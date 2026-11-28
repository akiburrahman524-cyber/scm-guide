/* App shell: sidebar nav, hash routing, theme & language. */
'use strict';
(async function () {
  await initLang(); await initTheme();
  const nav = $('#nav'), content = $('#content'), pageTitle = $('#pageTitle');
  const order = ['dashboard','landed','hs','cbm','freight','demurrage','formulas','incoterms','guide','glossary'];
  const tools = order.map(getTool).filter(Boolean);
  function paintStatic() {
    $('#brandSub').textContent = t('Supply chain toolkit','সাপ্লাই চেইন টুলকিট');
    $('#sideFoot').textContent = 'v1.0 · ' + t('Free forever. No ads. No data collection.','চিরকাল ফ্রি। বিজ্ঞাপন নেই। তথ্য সংগ্রহ নেই।');
    $('#langBtn').innerHTML = icon('globe',15) + ' ' + (LANG === 'en' ? 'বাংলা' : 'English');
    $('#themeBtn').innerHTML = THEME === 'light' ? icon('moon',15) + ' ' + t('Dark','ডার্ক') : icon('sun',15) + ' ' + t('Light','লাইট');
  }
  function paintNav(active) {
    nav.replaceChildren();
    tools.forEach((tl) => {
      const b = el('button', tl.id === active ? 'on' : '');
      b.innerHTML = icon(tl.icon, 18) + ' <span></span>';
      b.lastChild.textContent = t(tl.title[0], tl.title[1]);
      b.onclick = () => { location.hash = '#/' + tl.id; $('#sidebar').classList.remove('open'); };
      nav.append(b);
    });
  }
  async function route() {
    const id = (location.hash.replace(/^#\//, '') || 'dashboard');
    const tl = getTool(id) || getTool('dashboard');
    paintNav(tl.id);
    pageTitle.textContent = t(tl.title[0], tl.title[1]);
    content.replaceChildren();
    await tl.render(content);
    window.scrollTo(0, 0);
  }
  $('#langBtn').onclick = async () => { await setLang(LANG === 'en' ? 'bn' : 'en'); };
  $('#themeBtn').onclick = async () => { await setTheme(THEME === 'light' ? 'dark' : 'light'); };
  $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
  onLangChange(() => { paintStatic(); route(); });
  onThemeChange(paintStatic);
  window.addEventListener('hashchange', route);
  paintStatic(); await route();
})();
