/* Guides & FAQs: BD/MY import guides, how clearance works, common questions, official links. */
'use strict';
(function () {
registerTool({
  id:'guide', icon:'book',
  title:['Guides & FAQ','গাইড ও FAQ'],
  blurb:['Bangladesh and Malaysia import walkthroughs, how clearance works, and answers to common questions.','বাংলাদেশ ও মালয়েশিয়া আমদানি গাইড, ক্লিয়ারেন্স কীভাবে হয়, এবং সাধারণ প্রশ্নের উত্তর।'],
  async render(root){
    const wrap=el('div');
    const tabs=el('div','tabs');
    const panes={};
    const mk=(id,label)=>{ const b=el('button','',label); b.onclick=()=>{ Object.values(panes).forEach(p=>p.hidden=true); $$('button',tabs).forEach(x=>x.classList.remove('on')); b.classList.add('on'); panes[id].hidden=false; }; tabs.append(b); return b; };
    mk('guides',t('Import guides','আমদানি গাইড')); mk('faq',t('FAQ','সাধারণ প্রশ্ন')); mk('links',t('Official sources','অফিসিয়াল উৎস'));
    wrap.append(tabs);
    const pg=el('div'); panes.guides=pg;
    GUIDES.forEach(g=>{
      const c=el('div','card'); c.style.marginBottom='12px';
      c.append(el('h3','',t(g.title[0],g.title[1])));
      const ol=el('div'); g.body.forEach(([en,bn])=>{ const p=el('p','',t(en,bn)); p.style.margin='8px 0'; ol.append(p); });
      c.append(ol); pg.append(c);
    });
    const pf=el('div'); panes.faq=pf; pf.hidden=true;
    FAQS.forEach(f=>{
      const box=el('div');
      const q=el('button','faq-q'); q.append(el('span','',t(f.q[0],f.q[1]))); const chev=el('span','','+'); q.append(chev);
      const a=el('div','faq-a',t(f.a[0],f.a[1])); a.hidden=true;
      q.onclick=()=>{ a.hidden=!a.hidden; chev.textContent=a.hidden?'+':'−'; };
      box.append(q,a); pf.append(box);
    });
    const pl=el('div'); panes.links=pl; pl.hidden=true;
    pl.append(el('div','notebox',t('Always confirm rates and rules at the official source. These are the sites customs brokers actually use.','হার ও নিয়ম সবসময় অফিসিয়াল উৎসে নিশ্চিত করুন। কাস্টমস ব্রোকাররা আসলে এই সাইটগুলোই ব্যবহার করে।')));
    const lg=el('div','grid c2'); lg.style.marginTop='12px';
    OFFICIAL_LINKS.forEach(l=>{ const a=el('a','tool-card'); a.href=l.url; a.target='_blank'; a.rel='noopener noreferrer'; a.style.textDecoration='none';
      const tic2=el('span','tic'); tic2.append(iconEl('external',20)); a.append(tic2); const tx=el('div'); tx.append(el('b','',t(l.name[0],l.name[1])), el('div','m',l.url.replace(/^https?:\/\//,'')));
      a.append(tx); lg.append(a); });
    pl.append(lg);
    [pg,pf,pl].forEach(p=>wrap.append(p));
    $$('button',tabs)[0].click();
    root.append(wrap);
  }
});
})();
