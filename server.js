// SCM Guide server. No dependencies. Node 18+.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { terms, incoterms } = require('./kb.js');

const PORT = process.env.PORT || 3000;
const GROQ_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const ACCESS_CODE = process.env.ACCESS_CODE || ''; // private preview gate

const FEEDS = [
  { name: 'Supply Chain Dive', url: 'https://www.supplychaindive.com/feeds/news/' },
  { name: 'gCaptain', url: 'https://gcaptain.com/feed/' },
  { name: 'Journal of Commerce', url: 'https://www.joc.com/rss.xml' },
];

const decode = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#8217;|&#039;|&#39;/g, "'").replace(/&#8216;/g, "'").replace(/&#8220;|&#8221;/g, '"').replace(/&#8211;|&#8212;/g, '-').replace(/<[^>]+>/g, '').trim();
const pick = (x, tag) => { const m = x.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>')); return m ? decode(m[1]) : ''; };

let newsCache = { at: 0, items: [], errors: [] };
async function loadNews() {
  if (Date.now() - newsCache.at < 15 * 60 * 1000 && newsCache.items.length) return newsCache;
  const items = []; const errors = [];
  await Promise.all(FEEDS.map(async (f) => {
    try {
      const r = await fetch(f.url, { headers: { 'user-agent': 'Mozilla/5.0 SCMGuide/0.1' }, signal: AbortSignal.timeout(12000) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const xml = await r.text();
      const parts = xml.split(/<item[ >]/).slice(1, 9);
      for (const p of parts) {
        const title = pick(p, 'title'); const link = pick(p, 'link'); const date = pick(p, 'pubDate');
        const t = Date.parse(date);
        if (title && link && Number.isFinite(t)) items.push({ source: f.name, title, link, date: new Date(t).toISOString() });
      }
    } catch (e) { errors.push(f.name + ': ' + e.message); }
  }));
  items.sort((a, b) => b.date.localeCompare(a.date));
  newsCache = { at: Date.now(), items: items.slice(0, 30), errors };
  return newsCache;
}

// Rate limit: per IP per minute and a global daily cap, to stay inside free limits.
const hits = new Map(); let dayKey = ''; let dayCount = 0;
const DAILY_CAP = Number(process.env.DAILY_ASK_CAP || 800);
function allow(ip) {
  const day = new Date().toISOString().slice(0, 10);
  if (day !== dayKey) { dayKey = day; dayCount = 0; }
  if (dayCount >= DAILY_CAP) return 'daily';
  const now = Date.now(); const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (arr.length >= 6) return 'minute';
  arr.push(now); hits.set(ip, arr); dayCount++; return '';
}

const kbText = () => terms.map((t) => `${t.term}: ${t.en}`).join('\n') + '\nIncoterms 2020:\n' + incoterms.map((i) => `${i.code} ${i.name}: ${i.en}`).join('\n');
function kbSearch(q) {
  const w = q.toLowerCase().split(/\W+/).filter((x) => x.length > 2);
  return terms.map((t) => ({ t, s: w.reduce((a, x) => a + (t.term.toLowerCase().includes(x) ? 3 : 0) + (t.en.toLowerCase().includes(x) ? 1 : 0), 0) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 3).map((x) => x.t);
}

async function ask(question, lang) {
  const news = await loadNews().catch(() => ({ items: [] }));
  if (!GROQ_KEY) {
    const hit = kbSearch(question);
    if (!hit.length) return { answer: 'I do not have this in the guide yet, and the AI service is not connected in this preview.', sources: [] };
    return { answer: hit.map((t) => `${t.term}: ${t.en}` + (lang === 'bn' ? `\n${t.bn}` : '')).join('\n\n'), sources: ['SCM Guide glossary'] };
  }
  const system = 'You are SCM Guide, an assistant for supply chain, procurement and logistics learners. Rules: Be accurate and concise. Use the REFERENCE below first. If you are not sure, or the question needs current facts you do not have, say so plainly; never invent numbers, prices, dates, regulations or certification fees. Show formulas with variable meanings. For news, use only the NEWS list and name the source and date. ' + (lang === 'bn' ? 'Answer in simple Bangla, keeping standard English terms in brackets.' : 'Answer in simple English.') + '\n\nREFERENCE:\n' + kbText() + '\n\nNEWS (latest headlines):\n' + news.items.slice(0, 12).map((n) => `${n.date.slice(0, 10)} ${n.source}: ${n.title}`).join('\n');
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({ model: GROQ_MODEL, temperature: 0.2, max_tokens: 700, messages: [{ role: 'system', content: system }, { role: 'user', content: question.slice(0, 800) }] }),
    signal: AbortSignal.timeout(25000),
  });
  if (!r.ok) throw new Error('AI service error ' + r.status);
  const j = await r.json();
  return { answer: j.choices?.[0]?.message?.content || 'No answer.', sources: ['SCM Guide reference', 'AI model (can be wrong; verify important facts)'] };
}

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (ACCESS_CODE) {
      const code = req.headers['x-access-code'] || url.searchParams.get('code') || '';
      const open = url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/health';
      if (!open && code !== ACCESS_CODE) return send(res, 401, { error: 'access code required' });
    }
    if (url.pathname === '/health') return send(res, 200, { ok: true, ai: !!GROQ_KEY });
    if (url.pathname === '/api/kb') return send(res, 200, { terms, incoterms });
    if (url.pathname === '/api/news') { const n = await loadNews(); return send(res, 200, { fetchedAt: new Date(n.at).toISOString(), items: n.items, errors: n.errors }); }
    if (url.pathname === '/api/ask' && req.method === 'POST') {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().split(',')[0].trim();
      const lim = allow(ip);
      if (lim) return send(res, 429, { error: lim === 'daily' ? 'Daily free limit reached. Try tomorrow.' : 'Too many questions. Wait a minute.' });
      let body = ''; for await (const c of req) { body += c; if (body.length > 4000) break; }
      let q; try { q = JSON.parse(body); } catch { return send(res, 400, { error: 'bad json' }); }
      if (!q.question || typeof q.question !== 'string') return send(res, 400, { error: 'question required' });
      return send(res, 200, await ask(q.question, q.lang === 'bn' ? 'bn' : 'en'));
    }
    const file = path.join(__dirname, 'public', url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(path.join(__dirname, 'public'))) return send(res, 403, 'no', 'text/plain');
    fs.readFile(file, (e, d) => e ? send(res, 404, 'Not found', 'text/plain') : send(res, 200, d, types[path.extname(file)] || 'application/octet-stream'));
  } catch (e) { send(res, 500, { error: 'server error' }); }
}).listen(PORT, () => console.log('SCM Guide on ' + PORT));
