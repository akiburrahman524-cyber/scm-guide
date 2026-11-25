// Netlify Functions fallback (free tier). Same logic as server.js. Needs env vars ACCESS_CODE and GROQ_API_KEY set in Netlify.
const { loadNews, ask, allow, terms, incoterms, ACCESS_CODE } = require('../../core.js');
const json = (code, body) => ({ statusCode: code, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: JSON.stringify(body) });
exports.handler = async (event) => {
  const route = (event.path || '').replace(/^.*\/api\//, '');
  const code = event.headers['x-access-code'] || '';
  if (ACCESS_CODE && code !== ACCESS_CODE) return json(401, { error: 'access code required' });
  try {
    if (route === 'kb') return json(200, { terms, incoterms });
    if (route === 'news') { const n = await loadNews(); return json(200, { fetchedAt: new Date(n.at).toISOString(), items: n.items, errors: n.errors }); }
    if (route === 'ask' && event.httpMethod === 'POST') {
      const ip = (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const lim = allow(ip); if (lim) return json(429, { error: lim === 'daily' ? 'Daily free limit reached. Try tomorrow.' : 'Too many questions. Wait a minute.' });
      const q = JSON.parse(event.body || '{}'); if (!q.question) return json(400, { error: 'question required' });
      return json(200, await ask(String(q.question), q.lang === 'bn' ? 'bn' : 'en'));
    }
    return json(404, { error: 'not found' });
  } catch (e) { return json(500, { error: 'server error' }); }
};
