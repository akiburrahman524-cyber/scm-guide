/* Freight helpers: chargeable weight per mode, freight cost estimate, FCL vs LCL comparison. */
'use strict';
(function () {
registerTool({
  id:'freight', icon:'ship',
  title:['Freight & C&F Cost Helper','ফ্রেইট ও C&F খরচ'],
  blurb:['Chargeable weight by mode, freight totals from your rates, FCL vs LCL side by side.','মাধ্যম অনুযায়ী চার্জেবল ওজন, আপনার রেটে ফ্রেইট মোট, FCL বনাম LCL পাশাপাশি।'],
  async render(root){
    const S=Object.assign({kg:500,cbm:2.5,airRate:4.5,courRate:6,lclRate:45,fcl20:1200,fcl40:2000,thcLcl:120,thcFcl:300},await store.get('freight_inputs',{}));
    const wrap=el('div');
    const g1=el('div','frow c2');
    const ship=el('div','card'); ship.append(el('h3','',t('Shipment','চালান')));
    [['kg',()=>t('Gross weight (kg)','মোট ওজন (কেজি)')],['cbm',()=>t('Volume (CBM)','আয়তন (CBM)')]].forEach(([k,lf])=>{ const w=el('div'); w.append(el('label','',lf())); const i=el('input'); i.inputMode='decimal'; i.value=S[k]; i.oninput=()=>{S[k]=i.value;store.set('freight_inputs',S);calc();}; w.append(i); ship.append(w); });
    const volIn=el('div'); ship.append(volIn);
    g1.append(ship);
    const rates=el('div','card'); rates.append(el('h3','',t('Your rates (editable)','আপনার রেট (সম্পাদনাযোগ্য)')));
    [['airRate',()=>t('Air rate per chargeable kg','এয়ার রেট প্রতি চার্জেবল কেজি')],['courRate',()=>t('Courier rate per kg (/5000)','কুরিয়ার রেট প্রতি কেজি (/৫০০০)')],['lclRate',()=>t('LCL rate per CBM (W/M)','LCL রেট প্রতি CBM (W/M)')],['fcl20',()=>t('20ft FCL all-in rate','২০ফুট FCL সবমিলিয়ে রেট')],['fcl40',()=>t('40ft FCL all-in rate','৪০ফুট FCL সবমিলিয়ে রেট')],['thcLcl',()=>t('LCL destination fees (CFS etc.)','LCL গন্তব্য ফি (CFS ইত্যাদি)')],['thcFcl',()=>t('FCL destination fees','FCL গন্তব্য ফি')]].forEach(([k,lf])=>{ const w=el('div'); w.append(el('label','',lf())); const i=el('input'); i.inputMode='decimal'; i.value=S[k]; i.oninput=()=>{S[k]=i.value;store.set('freight_inputs',S);calc();}; w.append(i); rates.append(w); });
    g1.append(rates); wrap.append(g1);
    const out=el('div'); wrap.append(out);
    function calc(){
      out.replaceChildren();
      const kg=num(S.kg), cbm=num(S.cbm);
      volIn.replaceChildren(el('div','m',t('Volumetric weight comes from the CBM tool: 1 CBM = 167 kg (air) or 200 kg (courier). Sea LCL bills per CBM or per tonne, whichever is higher (W/M).','ভলুমেট্রিক ওজন CBM টুল থেকে আসে: ১ CBM = ১৬৭ কেজি (এয়ার) বা ২০০ কেজি (কুরিয়ার)। সমুদ্রে LCL হয় CBM অথবা টন, যেটি বেশি (W/M)।')));
      const airKg=Math.max(kg,cbm*167), courKg=Math.max(kg,cbm*200), lclUnits=Math.max(cbm,kg/1000);
      const grid=el('div','grid c3');
      const card=(name,total,per,cls)=>{ const c=el('div','card'); c.append(el('h3','',name)); const r=el('div','result'); r.style.marginTop='8px'; r.append(el('div','big',money(total))); c.append(r); c.append(el('div','m',per)); return c; };
      grid.append(
        card(t('Air freight','এয়ার ফ্রেইট'),airKg*num(S.airRate),`${airKg.toFixed(0)} kg x ${num(S.airRate)} = ${money(airKg*num(S.airRate))}`),
        card(t('Courier / express','কুরিয়ার / এক্সপ্রেস'),courKg*num(S.courRate),`${courKg.toFixed(0)} kg x ${num(S.courRate)}`),
        card('Sea LCL',lclUnits*num(S.lclRate)+num(S.thcLcl),`${lclUnits.toFixed(2)} W/M x ${num(S.lclRate)} + ${money(num(S.thcLcl))} ${t('fees','ফি')}`),
        card('Sea FCL 20ft',num(S.fcl20)+num(S.thcFcl),(cbm<=28?t('fits (~28 CBM usable)','ঢোকে (~২৮ CBM)'):t('too big for one 20ft','এক ২০ফুটে ঢোকে না'))+` + ${money(num(S.thcFcl))} ${t('fees','ফি')}`),
        card('Sea FCL 40ft',num(S.fcl40)+num(S.thcFcl),(cbm<=58?t('fits (~58 CBM usable)','ঢোকে (~৫৮ CBM)'):t('too big for one 40ft','এক ৪০ফুটে ঢোকে না')))
      );
      out.append(grid);
      const lcl=lclUnits*num(S.lclRate)+num(S.thcLcl), fcl=num(S.fcl20)+num(S.thcFcl);
      const msg = cbm>28? t('Your cargo is bigger than one 20ft container - compare 40ft or split.','আপনার মাল এক ২০ফুট কন্টেইনারের চেয়ে বড় - ৪০ফুট দেখুন বা ভাগ করুন।')
        : lcl<fcl? t('LCL looks cheaper at this volume. Around 13-15 CBM a 20ft FCL usually starts to win on cost and cargo safety.','এই ভলিউমে LCL সস্তা দেখাচ্ছে। প্রায় ১৩-১৫ CBM-এ ২০ফুট FCL সাধারণত খরচ ও নিরাপত্তায় এগিয়ে যায়।')
        : t('FCL 20ft already beats LCL at this volume - and your cargo travels sealed.','এই ভলিউমে ২০ফুট FCL এখনই LCL-কে হারায় - আর মাল সিল করা থাকে।');
      out.append(el('div','notebox',msg));
      out.append(el('div','warnbox',t('Rates above are yours to edit - get real quotes from 2-3 forwarders. Freight prices move weekly. C&F (clearing & forwarding) agents quote clearance + local charges separately.','এই রেটগুলো আপনার সম্পাদনার জন্য - ২-৩ ফরোয়ার্ডারের আসল কোট নিন। ফ্রেইট দাম সাপ্তাহে বদলায়। C&F এজেন্টরা ক্লিয়ারেন্স ও লোকাল খরচ আলাদা করে কোট করেন।')));
    }
    root.append(wrap);
    calc();
  }
});
})();
