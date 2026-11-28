/* Popup: quick search (HS codes + glossary) and shortcuts into the full toolkit. */
'use strict';
(async function () {
  await initLang(); await initTheme();
  $('#sic').innerHTML = icon('search', 16);
  function paint() {
    $('#popSub').textContent = t('Supply chain toolkit', 'সাপ্লাই চেইন টুলকিট');
    $('#pq').placeholder = t('HS code or term: "shoes", "8517", "MOQ"...', 'এইচএস কোড বা শব্দ: "shoes", "8517", "MOQ"...');
    $('#popLang').textContent = LANG === 'en' ? 'বাং' : 'EN';
    $('#popTheme').innerHTML = THEME === 'light' ? icon('moon', 14) : icon('sun', 14);
    $('#openFull').textContent = t('Open full toolkit', 'পুরো টুলকিট খুলুন');
    $('#siteLink').textContent = t('SCM Guide site', 'SCM Guide সাইট');
    $('#popDisc').textContent = t('Free forever. No ads. Nothing leaves your device.', 'চিরকাল ফ্রি। বিজ্ঞাপন নেই। কিছুই আপনার ডিভাইস ছাড়ে না।');
    const quick = [['landed', 'calculator'], ['hs', 'barcode'], ['cbm', 'box'], ['formulas', 'sigma']];
    $('#quick').replaceChildren(...quick.map(([id, ic]) => {
      const b = el('button'); b.innerHTML = icon(ic, 15) + ' <span></span>';
      const names = { landed: ['Landed cost', 'ল্যান্ডেড কস্ট'], hs: ['HS codes', 'এইচএস কোড'], cbm: ['CBM', 'সিবিএম'], formulas: ['Formulas', 'ফর্মুলা'] };
      b.lastChild.textContent = t(names[id][0], names[id][1]);
      b.onclick = () => openFull(id);
      return b;
    }));
  }
  function openFull(id) {
    const url = 'app.html#/' + (id || 'dashboard');
    if (window.chrome && chrome.tabs && chrome.tabs.create) chrome.tabs.create({ url: chrome.runtime.getURL(url) });
    else window.open(url, '_blank');
  }
  $('#openFull').onclick = () => openFull();
  $('#popLang').onclick = async () => { await setLang(LANG === 'en' ? 'bn' : 'en'); paint(); search(); };
  $('#popTheme').onclick = async () => { await setTheme(THEME === 'light' ? 'dark' : 'light'); paint(); };
  function search() {
    const q = $('#pq').value.trim().toLowerCase(); const box = $('#hits'); box.replaceChildren();
    if (q.length < 2) return;
    const hits = [];
    HS_CODES.forEach(([code, desc]) => {
      if ((/^\d{2,6}$/.test(q) && code.startsWith(q)) || desc.toLowerCase().includes(q)) hits.push({ t: code + ' - ' + desc, s: t('HS code', 'এইচএস কোড'), go: 'hs' });
    });
    TERMS.forEach((x) => { if (x.term.toLowerCase().includes(q) || x.en.toLowerCase().includes(q)) hits.push({ t: x.term, s: x.en.slice(0, 90) + (x.en.length > 90 ? '...' : ''), go: 'glossary' }); });
    hits.slice(0, 6).forEach((h) => {
      const d = el('div', 'hit'); d.innerHTML = icon(h.go === 'hs' ? 'barcode' : 'book', 16);
      const tx = el('div'); tx.append(el('b', '', h.t), el('div', 'm', h.s)); d.append(tx);
      d.onclick = () => openFull(h.go);
      box.append(d);
    });
    if (!hits.length) box.append(el('div', 'empty', t('No match - try the full toolkit.', 'মেলেনি - পুরো টুলকিট দেখুন।')));
  }
  $('#pq').oninput = search;
  paint();
})();
