/* Incoterms 2020 guide: cards + buyer/seller responsibility matrix. */
'use strict';
(function () {
/* rows: [code, group, who pays export clearance / main freight / insurance / import duty: 's'=seller,'b'=buyer] */
const M = [
 ['EXW','E',['b','b','b','b']], ['FCA','F',['s','b','b','b']], ['FAS','F',['s','b','b','b']], ['FOB','F',['s','b','b','b']],
 ['CFR','C',['s','s','b','b']], ['CIF','C',['s','s','s','b']], ['CPT','C',['s','s','b','b']], ['CIP','C',['s','s','s','b']],
 ['DAP','D',['s','s','s','b']], ['DPU','D',['s','s','s','b']], ['DDP','D',['s','s','s','s']]
];
registerTool({
  id:'incoterms', icon:'scale',
  title:['Incoterms 2020','ইনকোটার্মস ২০২০'],
  blurb:['All 11 terms, who pays what, and where risk passes - with the CIF/FOB/EXW decision guide.','১১টি শর্ত, কে কী দেয়, ঝুঁকি কোথায় হাত বদলায় - CIF/FOB/EXW বেছে নেওয়ার গাইডসহ।'],
  async render(root){
    const wrap=el('div');
    wrap.append(el('div','notebox',t('Incoterms 2020 (ICC) define who pays which leg and where risk moves from seller to buyer. They are not law by themselves - they apply when written into the contract.','ইনকোটার্মস ২০২০ (ICC) ঠিক করে দেয় কে কোন অংশের খরচ দেয় এবং ঝুঁকি কোথায় বিক্রেতা থেকে ক্রেতার কাছে যায়। এগুলো নিজে থেকে আইন নয় - চুক্তিতে লিখলে প্রযোজ্য হয়।')));
    const h1=el('h3','',t('Who pays what','কে কী দেয়')); h1.style.margin='18px 0 8px'; wrap.append(h1);
    const tbl=el('table','tbl matrix');
    const head=el('tr');
    ['Incoterm',t('Export clearance','এক্সপোর্ট ক্লিয়ারেন্স'),t('Main freight','মূল ফ্রেইট'),t('Insurance','বীমা'),t('Import duty & tax','ইমপোর্ট শুল্ক ও কর')].forEach(x=>head.append(el('th','',x)));
    tbl.append(head);
    M.forEach(([code,g,p])=>{
      const tr=el('tr'); tr.append(el('td','',code));
      p.forEach(x=>{ const td=el('td',x==='s'?'yes':'no', x==='s'?t('Seller','বিক্রেতা'):t('Buyer','ক্রেতা')); tr.append(td); });
      tbl.append(tr);
    });
    wrap.append(tbl);
    const h2=el('h3','',t('The 11 terms','১১টি শর্ত')); h2.style.margin='20px 0 8px'; wrap.append(h2);
    const grid=el('div','inco-grid');
    INCOTERM_INFO.forEach(it=>{
      const c=el('div','inco-card'); c.append(el('b','',it.code), el('div','m',it.name));
      c.onclick=()=>{ const ex=$('.inco-detail',wrap); if(ex) ex.remove();
        const d=el('div','card inco-detail'); d.style.marginTop='12px'; d.append(el('h3','',it.code+' - '+it.name), el('div','',it.en));
        const bnNote = el('div','m',t('Sea-only terms: FAS, FOB, CFR, CIF. The rest work for any mode.','শুধু সমুদ্রের জন্য: FAS, FOB, CFR, CIF। বাকিগুলো সব মাধ্যমে চলে।'));
        d.append(bnNote); c.after(d); };
      grid.append(c);
    });
    wrap.append(grid);
    const h3=el('h3','',t('Choosing between EXW, FOB and CIF','EXW, FOB ও CIF-এর মধ্যে পছন্দ')); h3.style.margin='20px 0 8px'; wrap.append(h3);
    const gg=el('div','grid c3');
    [['EXW',[ 'Seller just makes goods available at their door. You handle export clearance in their country - often hard for a foreign buyer. Price looks lowest but total is often highest.'],
             ['বিক্রেতা শুধু নিজের দরজায় মাল রেডি রাখে। তাদের দেশে এক্সপোর্ট ক্লিয়ারেন্স আপনাকে করতে হয় - বিদেশি ক্রেতার জন্য কঠিন। দাম সবচেয়ে কম মনে হলেও মোট প্রায়ই বেশি হয়।']],
     ['FOB',[ 'Seller clears export and loads the vessel. You control the main freight with your own forwarder and see the true cost. The standard choice for most sea buyers.'],
            ['বিক্রেতা এক্সপোর্ট ক্লিয়ার করে জাহাজে তোলে। আপনি নিজের ফরোয়ার্ডার দিয়ে মূল ফ্রেইট নিয়ন্ত্রণ করেন ও আসল খরচ দেখেন। বেশিরভাগ সমুদ্র-ক্রেতার স্ট্যান্ডার্ড পছন্দ।']],
     ['CIF',[ 'Seller arranges freight and minimum insurance to your port. Easy, but freight is often marked up and destination charges surprise first-time importers.'],
            ['বিক্রেতা আপনার বন্দর পর্যন্ত ফ্রেইট ও ন্যূনতম বীমা করে। সহজ, কিন্তু ফ্রেইটে বাড়তি দাম থাকে এবং গন্তব্যের চার্জ নতুন আমদানিকারীকে অবাক করে।']]].forEach(([code,[en,bn]])=>{
      const c=el('div','card'); c.append(el('h3','',code), el('div','',t(en,bn))); gg.append(c);
    });
    wrap.append(gg);
    root.append(wrap);
  }
});
})();
