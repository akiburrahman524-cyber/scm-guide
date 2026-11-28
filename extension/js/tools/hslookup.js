/* HS code lookup: HS 2022 6-digit subheadings + headings + chapters, with official tariff links.
   Rates are not bundled (they change) - each result links to official tariffs and lets the user save their own rate. */
'use strict';
(function () {
registerTool({
  id:'hs', icon:'barcode',
  title:['HS Code Lookup','এইচএস কোড খোঁজ'],
  blurb:['Search 5,600+ HS 2022 codes, see the chapter, and open official US / UK / EU / BD / MY tariffs.','৫,৬০০+ HS 2022 কোড খুঁজুন, চ্যাপ্টার দেখুন, অফিসিয়াল US / UK / EU / BD / MY ট্যারিফ খুলুন।'],
  async render(root){
    const wrap=el('div');
    const sb=el('div','searchbig'); sb.innerHTML=icon('search',18);
    const inp=el('input'); inp.placeholder=t('Search a product or code: "cotton shirt", "led", "8517"...','পণ্য বা কোড খুঁজুন: "cotton shirt", "led", "8517"...');
    sb.append(inp); wrap.append(sb);
    const note=el('div','notebox'); note.innerHTML = esc(t('HS 2022 (WCO) 6-digit codes - the worldwide base. Countries extend them to 8-10 digits. Data: UN Comtrade / datasets-harmonized-system (public domain). Duty rates are NOT in this data - open the official tariff for your destination.','HS 2022 (WCO) ৬ সংখ্যার কোড - বিশ্বব্যাপী ভিত্তি। দেশগুলো ৮-১০ সংখ্যা পর্যন্ত বাড়ায়। তথ্য: UN Comtrade / datasets-harmonized-system (পাবলিক ডোমেইন)। শুল্ক হার এই ডেটায় নেই - গন্তব্যের অফিসিয়াল ট্যারিফ দেখুন।'));
    wrap.append(note);
    const out=el('div'); wrap.append(out);
    const chapterOf = (code)=>HS_CHAPTERS.find(c=>String(c[0]).padStart(2,'0')===code.slice(0,2));
    const headingOf = (code)=>HS_HEADINGS.find(h=>h[0]===code.slice(0,4));
    function detail(code,desc){
      const d=el('div','card'); d.style.marginTop='10px';
      const ch=chapterOf(code), hd=headingOf(code);
      d.append(el('h3','',code+' - '+desc));
      const meta=el('div','m'); meta.textContent=(ch?`${t('Chapter','চ্যাপ্টার')} ${String(ch[0]).padStart(2,'0')}: ${ch[1]}`:'')+(hd?` · ${t('Heading','হেডিং')} ${hd[0]}: ${hd[1]}`:'');
      d.append(meta);
      const links=el('div','btnrow');
      const add=(name,url)=>{ const a=el('a','btn g',name); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; a.style.textDecoration='none'; links.append(a); };
      add('US HTS (USITC)','https://hts.usitc.gov/search?query='+encodeURIComponent(code.slice(0,4)+'.'+code.slice(4)));
      add('UK Trade Tariff','https://www.trade-tariff.service.gov.uk/subheadings/'+code+'0000-80');
      add('EU TARIC','https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en&SimDate=&Area=&MeasType=&StartPubDate=&EndPubDate=&MeasText=&GoodsText=&op=&Taric='+code+'&search_text=goods&textSearch=&LangDescr=en&OrderNum=&Regulation=&measStartDat=&measEndDat=');
      add(t('Bangladesh Customs','বাংলাদেশ কাস্টমস'),'http://bangladeshcustoms.gov.bd/');
      add(t('Malaysia MySST tariff','মালয়েশিয়া MySST ট্যারিফ'),'https://mysst.customs.gov.my/');
      d.append(links);
      const tip=el('div','m',t('Duty rates depend on destination AND origin (trade agreements). Enter the rate you find into the Landed Cost tool.','শুল্ক হার গন্তব্য ও উৎস দুটোর ওপরই নির্ভর করে (বাণিজ্য চুক্তি)। যে হার পাবেন তা ল্যান্ডেড কস্ট টুলে বসান।'));
      tip.style.marginTop='10px'; d.append(tip);
      return d;
    }
    function search(q){
      out.replaceChildren();
      q=q.trim(); if(!q){ out.append(el('div','empty',t('Type at least 2 letters or digits. Try "shoes", "battery", "rice" or a 4-6 digit code.','কমপক্ষে ২ অক্ষর বা সংখ্যা লিখুন। যেমন "shoes", "battery", "rice" বা ৪-৬ সংখ্যার কোড।'))); return; }
      const words=q.toLowerCase().split(/[\s,]+/).filter(x=>x.length>1);
      const scored=[];
      const isNum=/^\d{2,6}$/.test(q);
      HS_CODES.forEach(([code,desc])=>{
        let s=0; const dl=desc.toLowerCase();
        if(isNum){ if(code.startsWith(q)) s=100-(code.length-q.length); }
        else { words.forEach(w=>{ if(dl.includes(w)) s+= dl.startsWith(w)? 5:3; }); }
        if(s>0) scored.push([s,code,desc]);
      });
      if(!isNum){
        HS_HEADINGS.forEach(([code,desc])=>{ let s=0; const dl=desc.toLowerCase(); words.forEach(w=>{ if(dl.includes(w)) s+=4; }); if(s>0) scored.push([s-0.5,code,'',desc,true]); });
      }
      scored.sort((a,b)=>b[0]-a[0]);
      const hits=scored.slice(0,25);
      if(!hits.length){ out.append(el('div','empty',t('No match. Try a broader word - "plastic", "machine", "food" - or check the chapter list on the SCM Guide site.','মিলেনি। আরও সাধারণ শব্দ দিন - "plastic", "machine", "food"।'))); return; }
      const list=el('div'); 
      hits.forEach(([s,code,short,long,isHeading])=>{
        const desc=isHeading?long:short;
        const c=el('div','card'); c.style.cursor='pointer';
        const top=el('div'); top.style.display='flex'; top.style.justifyContent='space-between'; top.style.gap='10px';
        top.append(el('b','',code+(isHeading?'  ('+t('heading','হেডিং')+')':'')), el('span','chip',t('Chapter','চ্যাপ্টার')+' '+code.slice(0,2)));
        c.append(top, el('div','',desc));
        c.onclick=()=>{ const ex=$('.hs-detail',out); if(ex) ex.remove(); const d=detail(code,desc); d.classList.add('hs-detail'); c.after(d); d.scrollIntoView({behavior:'smooth',block:'nearest'}); };
        list.append(c);
      });
      out.append(el('div','m',hits.length+t(' results shown (top matches). Click one for official tariff links.','টি ফলাফল (শীর্ষ মিল)। অফিসিয়াল ট্যারিফ লিংকের জন্য ক্লিক করুন।')), list);
    }
    inp.oninput=()=>search(inp.value);
    root.append(wrap);
    search('');
  }
});
})();
