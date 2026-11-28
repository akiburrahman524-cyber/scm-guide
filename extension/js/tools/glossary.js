/* Glossary: 48 supply chain terms in Bangla + English, searchable. */
'use strict';
(function () {
registerTool({
  id:'glossary', icon:'book',
  title:['Glossary (Bangla + English)','শব্দকোষ (বাংলা + English)'],
  blurb:['48 working supply chain terms explained in Bangla and English.','৪৮টি কার্যকর সাপ্লাই চেইন শব্দের বাংলা ও ইংরেজি ব্যাখ্যা।'],
  async render(root){
    const wrap=el('div');
    const sb=el('div','searchbig'); sb.append(iconEl('search',18));
    const inp=el('input'); inp.placeholder=t('Search: PO, MOQ, bill of lading...','খুঁজুন: PO, MOQ, bill of lading...');
    sb.append(inp); wrap.append(sb);
    const out=el('div'); out.style.marginTop='14px'; wrap.append(out);
    function draw(){
      out.replaceChildren();
      const q=inp.value.trim().toLowerCase();
      const hits=TERMS.filter(x=>!q||x.term.toLowerCase().includes(q)||x.en.toLowerCase().includes(q)||x.bn.includes(inp.value.trim()));
      if(!hits.length){ out.append(el('div','empty',t('No term matches.','কোনো শব্দ মেলেনি।'))); return; }
      hits.forEach(x=>{ const c=el('div','card'); c.style.marginBottom='10px'; c.append(el('h3','',x.term));
        const en=el('div','m',x.en); const bn=el('div','',x.bn);
        if(LANG==='bn'){ c.append(bn,en); } else { c.append(en,bn); }
        out.append(c); });
    }
    inp.oninput=draw; onLangChange(draw); draw();
    root.append(wrap);
  }
});
})();
