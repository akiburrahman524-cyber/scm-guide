const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadNews, ask, allow, terms, incoterms, ACCESS_CODE } = require('./core.js');
const PORT = process.env.PORT || 3000;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (ACCESS_CODE) {
      const code = req.headers['x-access-code'] || url.searchParams.get('code') || '';
      const open = !url.pathname.startsWith('/api/');
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
