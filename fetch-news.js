// Run by GitHub Actions: fetches public RSS feeds and writes docs/news.json (no third-party proxy).
const fs = require('fs');
const { loadNews } = require('./core.js');
loadNews().then((n) => {
  if (!n.items.length) { console.error('no items, keeping old file'); process.exit(0); }
  fs.writeFileSync('docs/news.json', JSON.stringify({ fetchedAt: new Date().toISOString(), items: n.items, errors: n.errors.map((e) => e.split(':')[0]) }));
  console.log('wrote', n.items.length, 'items');
});
