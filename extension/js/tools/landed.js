/* Landed cost calculator - editable lines, country presets (BD/MY first), CSV + print.
   Rates are typical public rates with sources in notes; every line is user-editable. */
'use strict';
(function () {
const LC_INCOTERMS = { EXW:{o:'b',f:'b',i:'b'},FCA:{o:'s',f:'b',i:'b'},FAS:{o:'s',f:'b',i:'b'},FOB:{o:'s',f:'b',i:'b'},CFR:{o:'s',f:'s',i:'b'},CIF:{o:'s',f:'s',i:'s'},CPT:{o:'s',f:'s',i:'b'},CIP:{o:'s',f:'s',i:'s'},DAP:{o:'s',f:'s',i:'s'},DPU:{o:'s',f:'s',i:'s'},DDP:{o:'s',f:'s',i:'s'} };
const EU_VAT = { Austria:20,Belgium:21,Bulgaria:20,Croatia:25,'Czech Republic':21,Denmark:25,Finland:25.5,France:20,Germany:19,Greece:24,Hungary:27,Ireland:23,Italy:22,Lithuania:21,Netherlands:21,Poland:23,Portugal:23,Romania:21,Spain:21,Sweden:25 };
const DEST = {
  BD: { name:'Bangladesh', vatLabel:'VAT', vat:15, note:'Customs Duty + Regulatory Duty + Supplementary Duty + VAT 15% + Advance Income Tax 5%. Cascade used here: CD and RD on customs value, SD on value+CD+RD, VAT on value+CD+RD+SD (commonly used method; source: trade.gov Bangladesh import tariffs, NBR VAT FAQ, 2026). Confirm per HS code with NBR / Bangladesh Customs and your C&F agent.', bn:'কাস্টমস ডিউটি + রেগুলেটরি ডিউটি + সাপ্লিমেন্টারি ডিউটি + ভ্যাট ১৫% + অ্যাডভান্স ইনকাম ট্যাক্স ৫%। হার প্রতি বাজেটে বদলায় - HS কোড অনুযায়ী NBR / বাংলাদেশ কাস্টমস ও আপনার C&F এজেন্টের কাছে নিশ্চিত করুন।' },
  MY: { name:'Malaysia', vatLabel:'Sales tax (SST)', vat:10, note:'Sales tax on (CIF + import duty + excise). Standard 10%, reduced 5% for listed goods (Malaysia Customs MySST / JKDM). Import duty depends on the HS code - check the MySST tariff finder. Goods RM500 or less sold online from overseas carry the 10% low-value goods tax.', bn:'(CIF + ইমপোর্ট ডিউটি + এক্সাইজ) -এর ওপর সেলস ট্যাক্স। স্ট্যান্ডার্ড ১০%, তালিকাভুক্ত পণ্যে ৫% (মালয়েশিয়া কাস্টমস MySST / JKDM)। ইমপোর্ট ডিউটি HS কোডভেদে ভিন্ন - MySST ট্যারিফ দেখুন।' },
  EU: { name:'European Union', vatLabel:'VAT', vat:19, note:'VAT on customs value + duty + costs up to the first EU destination. Standard VAT rates are as of Jan 2026 (source: Tax Foundation EU VAT rates). Duty follows the EU TARIC per HS code. Preferential origin not applied.', bn:'কাস্টমস মূল্য + ডিউটি + প্রথম EU গন্তব্য পর্যন্ত খরচের ওপর ভ্যাট। ডিউটি HS কোড অনুযায়ী EU TARIC।' },
  GB: { name:'United Kingdom', vatLabel:'Import VAT', vat:20, note:'Import VAT 20% on customs value + duty + incidental costs to first UK destination (gov.uk). Duty follows the UK Global Tariff per HS code.', bn:'কাস্টমস মূল্য + ডিউটি + প্রথম UK গন্তব্য পর্যন্ত খরচের ওপর ২০% ইমপোর্ট ভ্যাট (gov.uk)। ডিউটি UK Global Tariff অনুযায়ী।' },
  SG: { name:'Singapore', vatLabel:'GST', vat:9, note:'GST 9% on customs value + duties (IRAS / Singapore Customs). Most goods carry no duty; dutiable: liquor, tobacco, motor vehicles, petroleum.', bn:'কাস্টমস মূল্য + ডিউটির ওপর GST ৯% (IRAS / সিঙ্গাপুর কাস্টমস)। বেশিরভাগ পণ্যে ডিউটি নেই।' },
  AE: { name:'United Arab Emirates', vatLabel:'VAT', vat:5, note:'Customs duty mostly 5% of CIF (u.ae); VAT 5% on CIF + duty. Free-zone and GCC rules differ.', bn:'বেশিরভাগ পণ্যে CIF-এর ৫% শুল্ক (u.ae); CIF + ডিউটির ওপর ভ্যাট ৫%।' },
  IN: { name:'India', vatLabel:'IGST', vat:18, note:'Basic Customs Duty on assessable value, Social Welfare Surcharge 10% of BCD, then IGST on value+BCD+SWS (CBIC guidance). IGST rate depends on the item - enter it from the CBIC tariff.', bn:'অ্যাসেসেবল মূল্যে BCD, BCD-এর ১০% SWS, তারপর (মূল্য+BCD+SWS)-এ IGST (CBIC)। আইটেমভেদে IGST হার CBIC ট্যারিফ থেকে দিন।' },
  US: { name:'United States', vatLabel:'Sales/state tax (usually 0 at import)', vat:0, note:'No federal VAT. Duty follows the HTS by HS code and origin; additional tariffs may apply - use the extra duty field. Duty base here is the transaction value without international freight/insurance. MPF 0.3464% (min $34.58, max $670.86, FY2026) and HMF 0.125% for sea (CBP fee table, effective 1 Oct 2025).', bn:'ফেডারেল VAT নেই। HS কোড ও উৎস অনুযায়ী HTS ডিউটি; অতিরিক্ত ট্যারিফ থাকতে পারে। MPF 0.3464% (ন্যূনতম $34.58, সর্বোচ্চ $670.86) ও সমুদ্রপথে HMF 0.125%।' },
  XX: { name:t('Other country','অন্য দেশ'), vatLabel:'VAT / GST', vat:0, note:'Enter your own duty and VAT/GST rates from the destination customs authority.', bn:'গন্তব্য দেশের কাস্টমস কর্তৃপক্ষের হার নিজে দিন।' }
};
const cargoCalc = (s) => {
  const cbmPerCarton = (num(s.l)*num(s.w)*num(s.h))/1e6, cartons = Math.ceil(num(s.cartons));
  const cbm = cbmPerCarton*cartons, grossKg = num(s.kg)*cartons, volKg = (num(s.l)*num(s.w)*num(s.h))/6000*cartons;
  const fit = {'20ft':28,'40ft':58,'40HC':68};
  return { cbmPerCarton, cartons, cbm, grossKg, volKg, chargeKg: Math.max(grossKg, volKg),
    boxes: Object.fromEntries(Object.entries(fit).map(([k,v])=>[k, cbm? Math.ceil(cbm/v*100)/100 : 0])), fit };
};
function buildLines(s){
  const c = cargoCalc(s), ic = LC_INCOTERMS[s.incoterm]||LC_INCOTERMS.FOB;
  const goods = num(s.qty)*num(s.price); let freight = 0, freightBasis='';
  if (s.mode==='sea-fcl'){ freight = num(s.rate)*num(s.containers); freightBasis = t(`${num(s.containers)} container x rate`,`${num(s.containers)} কন্টেইনার x রেট`); }
  else if (s.mode==='sea-lcl'){ freight = num(s.rate)*Math.max(c.cbm,c.grossKg/1000); freightBasis = `rate x max(${c.cbm.toFixed(2)} CBM, ${(c.grossKg/1000).toFixed(2)} t)`; }
  else { freight = num(s.rate)*c.chargeKg; freightBasis = `rate x ${t('chargeable','চার্জেবল')} ${c.chargeKg.toFixed(1)} kg`; }
  const L = []; const add=(id,label,amount,note,group)=>L.push({id,label,amount:+amount.toFixed(2),note,group});
  add('goods',t('Goods value (qty x unit price)','পণ্যের মূল্য (পরিমাণ x ইউনিট দাম)'),goods,`${num(s.qty)} x ${num(s.price)}`,'goods');
  add('origin',t('Origin charges (export clearance, local haulage, packing)','মূল দেশের খরচ (এক্সপোর্ট ক্লিয়ারেন্স, লোকাল পরিবহন, প্যাকিং)'),ic.o==='b'?num(s.originCost):0,ic.o==='b'?t('Buyer pays under','ক্রেতা দেয়')+' '+s.incoterm:t('Seller pays under','বিক্রেতা দেয়')+' '+s.incoterm,'ship');
  add('freight',t('Main freight','মূল ফ্রেইট'),ic.f==='b'?freight:0,ic.f==='b'?freightBasis:t('Inside price under','দামের মধ্যে')+' '+s.incoterm,'ship');
  const insBase = goods+(ic.o==='b'?num(s.originCost):0)+(ic.f==='b'?freight:0);
  add('ins',t('Cargo insurance','কার্গো বীমা'),ic.i==='b'?insBase*num(s.insPct)/100:0,ic.i==='b'?num(s.insPct)+'% '+t('of goods + freight','পণ্য + ফ্রেইটের'):t('Included under','অন্তর্ভুক্ত')+' '+s.incoterm,'ship');
  const cv = L.reduce((a,x)=>a+x.amount,0);
  add('cv',t('Customs value (CIF basis, subtotal)','কাস্টমস মূল্য (CIF ভিত্তি, সাবটোটাল)'),cv,t('Goods + origin + freight + insurance you pay','আপনার দেওয়া পণ্য + মূল খরচ + ফ্রেইট + বীমা'),'sub');
  const usCv = L[0].amount + L[1].amount;
  const dutyBase = s.dest==='US'? usCv : cv;
  const duty = dutyBase*num(s.duty)/100;
  let vatBase = cv+duty;
  add('duty',t('Import / customs duty','ইমপোর্ট / কাস্টমস ডিউটি'),duty,`${num(s.duty)}% ${t('of','-এর')} ${s.dest==='US'?t('goods value','পণ্যের মূল্য'):t('customs value','কাস্টমস মূল্য')} (HS)`,'tax');
  if (s.dest==='BD'){ const rd=cv*num(s.rd)/100, sd=(cv+duty+rd)*num(s.sd)/100;
    add('rd',t('Regulatory duty (RD)','রেগুলেটরি ডিউটি (RD)'),rd,`${num(s.rd)}% ${t('of customs value','কাস্টমস মূল্যের')}`,'tax');
    add('sd',t('Supplementary duty (SD)','সাপ্লিমেন্টারি ডিউটি (SD)'),sd,`${num(s.sd)}% ${t('of (value + CD + RD)','(মূল্য + CD + RD)-এর')}`,'tax'); vatBase = cv+duty+rd+sd; }
  if (s.dest==='MY'){ const ex=cv*num(s.excise)/100; add('excise',t('Excise duty','এক্সাইজ ডিউটি'),ex,`${num(s.excise)}% ${t('of customs value','কাস্টমস মূল্যের')}`,'tax'); vatBase = cv+duty+ex; }
  if (s.dest==='IN'){ const sws=duty*num(s.sws)/100; add('sws','Social Welfare Surcharge (SWS)',sws,`${num(s.sws)}% of BCD`,'tax'); vatBase = cv+duty+sws; }
  if (s.dest==='US'){ const mpf=Math.min(Math.max(usCv*0.003464,34.58),670.86);
    add('mpf','Merchandise Processing Fee',usCv>0?mpf:0,'0.3464%, min $34.58, max $670.86 (USD)','tax');
    const hmf=(s.mode==='sea-fcl'||s.mode==='sea-lcl')?usCv*0.00125:0; add('hmf','Harbor Maintenance Fee (sea)',hmf,'0.125%','tax');
    add('xduty',t('Additional tariffs (by origin)','অতিরিক্ত ট্যারিফ (উৎস অনুযায়ী)'),usCv*num(s.xduty)/100,`${num(s.xduty)}% ${t('of goods value','পণ্যের মূল্যের')}`,'tax'); vatBase=0; }
  add('thc',t('Port, terminal and D/O fees at destination','গন্তব্য বন্দর, টার্মিনাল ও D/O ফি'),num(s.thc),t('Your estimate','আপনার অনুমান'),'dest');
  add('broker',t('Customs broker / C&F agent fee','কাস্টমস ব্রোকার / C&F এজেন্ট ফি'),num(s.broker),t('Your estimate','আপনার অনুমান'),'dest');
  add('inland',t('Inland delivery to your address','অভ্যন্তরীণ ডেলিভারি'),num(s.inland),t('Your estimate','আপনার অনুমান'),'dest');
  if (s.dest==='EU'||s.dest==='GB') vatBase += num(s.inland);
  if (s.dest!=='US'||num(s.vat)>0) add('vat',`${DEST[s.dest].vatLabel} (${num(s.vat)}%)`,vatBase*num(s.vat)/100,`${num(s.vat)}% ${t('of','-এর')} ${money(vatBase)}`,'tax');
  if (s.dest==='BD') add('ait',t('Advance Income Tax (AIT)','অ্যাডভান্স ইনকাম ট্যাক্স (AIT)'),cv*num(s.ait)/100,`${num(s.ait)}% ${t('of customs value, usually adjustable','কাস্টমস মূল্যের, সাধারণত সমন্বয়যোগ্য')}`,'tax');
  add('other',t('Other (storage, demurrage, inspection, certificates)','অন্যান্য (স্টোরেজ, ডেমারেজ, পরীক্ষা, সনদ)'),num(s.otherCost),t('Your estimate','আপনার অনুমান'),'dest');
  return L;
}
const totalOf = (lines)=>lines.filter(l=>l.group!=='sub').reduce((a,l)=>a+num(l.amount),0);

registerTool({
  id:'landed', icon:'calculator',
  title:['Landed Cost Calculator','ল্যান্ডেড কস্ট ক্যালকুলেটর'],
  blurb:['Full cost to your door: price, freight, insurance, duty, VAT, clearance. Every line editable.','দরজা পর্যন্ত পুরো খরচ: দাম, ফ্রেইট, বীমা, শুল্ক, ভ্যাট, ক্লিয়ারেন্স। প্রতিটি লাইন সম্পাদনাযোগ্য।'],
  async render(root){
    const saved = await store.get('landed_inputs', null);
    const S = Object.assign({ product:'Example product', originCountry:'China', dest:'BD', incoterm:'FOB', mode:'sea-fcl', qty:1000, price:5, cartons:100, l:50, w:40, h:30, kg:12, containers:1, rate:2500, originCost:0, insPct:0.3, duty:10, excise:0, rd:0, sd:0, sws:10, xduty:0, ait:5, vat:15, thc:300, broker:150, inland:400, otherCost:0, fx:'' }, saved||{});
    let OVER = {}, CUSTOM = await store.get('landed_custom', []);
    const FIELDS = [
      ['product',()=>t('Product name','পণ্যের নাম'),'t'],
      ['originCountry',()=>t('Origin country','উৎস দেশ'),'t'],
      ['dest',()=>t('Destination','গন্তব্য'),'sel',[['BD','Bangladesh - বাংলাদেশ'],['MY','Malaysia - মালয়েশিয়া'],['EU','European Union'],['GB','United Kingdom'],['SG','Singapore'],['AE','UAE'],['IN','India'],['US','United States'],['XX',t('Other country','অন্য দেশ')]]],
      ['incoterm',()=>'Incoterm','sel',Object.keys(LC_INCOTERMS).map(x=>[x,x])],
      ['mode',()=>t('Transport mode','পরিবহন মাধ্যম'),'sel',[['sea-fcl',t('Sea - full container (FCL)','সমুদ্র - পুরো কন্টেইনার (FCL)')],['sea-lcl',t('Sea - shared (LCL)','সমুদ্র - শেয়ারড (LCL)')],['air',t('Air freight','এয়ার ফ্রেইট')],['road',t('Road / courier (per kg)','রোড / কুরিয়ার (কেজি প্রতি)')]]],
      ['qty',()=>t('Quantity (units)','পরিমাণ (ইউনিট)')],
      ['price',()=>t('Unit price','ইউনিট দাম')],
      ['cartons',()=>t('Number of cartons','কার্টুন সংখ্যা')],
      ['l',()=>t('Carton length (cm)','কার্টুন দৈর্ঘ্য (সেমি)')],['w',()=>t('Carton width (cm)','কার্টুন প্রস্থ (সেমি)')],['h',()=>t('Carton height (cm)','কার্টুন উচ্চতা (সেমি)')],['kg',()=>t('Carton weight (kg)','কার্টুন ওজন (কেজি)')],
      ['containers',()=>t('Containers (FCL)','কন্টেইনার (FCL)')],
      ['rate',()=>t('Freight rate (per container / CBM / kg)','ফ্রেইট রেট (কন্টেইনার / CBM / কেজি প্রতি)')],
      ['originCost',()=>t('Origin charges (if buyer pays)','মূল দেশের খরচ (ক্রেতা দিলে)')],
      ['insPct',()=>t('Insurance %','বীমা %')],
      ['duty',()=>t('Import duty % (by HS code)','ইমপোর্ট ডিউটি % (HS কোড অনুযায়ী)')],
      ['rd',()=>t('Regulatory duty % (BD)','রেগুলেটরি ডিউটি % (BD)'),'n','BD'],
      ['sd',()=>t('Supplementary duty % (BD)','সাপ্লিমেন্টারি ডিউটি % (BD)'),'n','BD'],
      ['ait',()=>t('Advance income tax % (BD)','অ্যাডভান্স ইনকাম ট্যাক্স % (BD)'),'n','BD'],
      ['excise',()=>t('Excise % (Malaysia)','এক্সাইজ % (মালয়েশিয়া)'),'n','MY'],
      ['sws',()=>'SWS % of BCD (India)','n','IN'],
      ['xduty',()=>t('Additional tariffs % (US)','অতিরিক্ত ট্যারিফ % (US)'),'n','US'],
      ['vat',()=>t('VAT / sales tax / GST %','ভ্যাট / সেলস ট্যাক্স / GST %')],
      ['thc',()=>t('Port / terminal / D/O fees','বন্দর / টার্মিনাল / D/O ফি')],
      ['broker',()=>t('Customs broker fee','কাস্টমস ব্রোকার ফি')],
      ['inland',()=>t('Inland delivery','অভ্যন্তরীণ ডেলিভারি')],
      ['otherCost',()=>t('Other costs','অন্যান্য খরচ')],
      ['fx',()=>t('Exchange rate to local currency (optional)','লোকাল কারেন্সিতে বিনিময় হার (ঐচ্ছিক)')],
    ];
    const persist = ()=>store.set('landed_inputs', S);
    const wrap = el('div');
    const note = el('div','notebox', t('Bangladesh and Malaysia presets come first. Every rate field and every cost line can be edited - the total updates instantly. All amounts in one currency of your choice.','বাংলাদেশ ও মালয়েশিয়া প্রিসেট আগে আছে। প্রতিটি হার ও খরচের লাইন সম্পাদনাযোগ্য - মোট সঙ্গে সঙ্গে বদলায়। সব অঙ্ক একই কারেন্সিতে দিন।'));
    const grid = el('div','grid c3');
    const linesBox = el('div'); const totalBox = el('div');
    FIELDS.forEach(([k,labelFn,type,opts,only])=>{ if(!only && typeof opts==='string'){ only=opts; }
      const w = el('div'); if(only) w.dataset.only = only;
      const lab = el('label','',labelFn()); let inp;
      if (type==='sel'){ inp = el('select'); opts.forEach(([v,n])=>{ const o=el('option','',n); o.value=v; inp.append(o); }); }
      else { inp = el('input'); if(type!=='t') inp.inputMode='decimal'; }
      inp.value = S[k];
      inp.oninput = inp.onchange = ()=>{ S[k]=inp.value; if(k==='dest'){ S.vat=DEST[S.dest].vat; OVER={}; const vf=grid.querySelector('[data-k=vat]'); if(vf) vf.value=S.vat; } persist(); showHide(); recalc(); };
      inp.dataset.k = k; w.append(lab, inp); grid.append(w);
    });
    function showHide(){ grid.childNodes.forEach(w=>{ if(!w.dataset||!w.dataset.only) return; w.hidden = w.dataset.only!==S.dest; }); }
    let CUR = [];
    function liveLines(){ return CUR.map(l=>({...l,amount:OVER[l.id]!==undefined?OVER[l.id]:l.amount})); }
    function updTotal(){ const tot=totalOf(liveLines()); const fx=num(S.fx), q=num(S.qty);
      totalBox.replaceChildren();
      const r=el('div','result');
      r.append(el('div','m',t('Total landed cost','মোট ল্যান্ডেড কস্ট')), el('div','big',money(tot)));
      const k1=el('div','kv'); k1.append(el('span','',t('Per unit','প্রতি ইউনিট')), el('b','', q?money(tot/q):'-'));
      r.append(k1);
      if(fx){ const k2=el('div','kv'); k2.append(el('span','',t('In local currency','লোকাল কারেন্সিতে')), el('b','',money(tot*fx))); r.append(k2); }
      const c=cargoCalc(S); const k3=el('div','kv'); k3.append(el('span','',t('Cargo volume / weight','কার্গো ভলিউম / ওজন')), el('b','',`${c.cbm.toFixed(2)} CBM · ${c.grossKg.toFixed(0)} kg`));
      r.append(k3); totalBox.append(r); }
    function recalc(){
      CUR = buildLines(S).concat(CUSTOM);
      linesBox.replaceChildren();
      const head=el('h3','',t('Cost lines - click any amount to edit','খরচের লাইন - যেকোনো অঙ্কে ক্লিক করে বদলান'));
      head.style.margin='18px 0 8px'; linesBox.append(head);
      CUR.forEach(l=>{
        const row=el('div','line-edit'+(l.group==='sub'?' subtotal':''));
        const lbl=el('div','lbl'); lbl.append(el('b','',l.label), el('span','',l.note));
        row.append(lbl);
        if(l.group==='sub'){ row.append(el('b','tot',money(l.amount))); }
        else {
          if(l.group==='custom'){ const nm=el('input'); nm.style.width='150px'; nm.style.flex='0 0 150px'; nm.value=l.label; nm.oninput=()=>{ const cc=CUSTOM.find(x=>x.id===l.id); if(cc){cc.label=nm.value; l.label=nm.value;} store.set('landed_custom',CUSTOM); }; lbl.replaceChildren(el('span','',l.note)); row.prepend(nm); }
          const i=el('input'); i.inputMode='decimal'; i.value=l.amount;
          i.oninput=()=>{ if(l.group==='custom'){ const cc=CUSTOM.find(x=>x.id===l.id); if(cc){cc.amount=num(i.value); store.set('landed_custom',CUSTOM);} } OVER[l.id]=num(i.value); updTotal(); };
          row.append(i);
        }
        linesBox.append(row);
      });
      updTotal();
      const dn=el('div','warnbox'); dn.textContent = LANG==='bn'? DEST[S.dest].bn : DEST[S.dest].note; linesBox.append(dn);
    }
    function downloadCSV(){
      const lines=liveLines(), tot=totalOf(lines);
      const rows=[['SCM Guide Toolkit - landed cost sheet'],[t('Product','পণ্য'),S.product],[t('Route','রুট'),`${S.originCountry} -> ${DEST[S.dest].name}`],['Incoterm',S.incoterm],[t('Mode','মাধ্যম'),S.mode],[t('Quantity','পরিমাণ'),S.qty],[],[t('Line','লাইন'),t('Amount','অঙ্ক'),t('Basis / note','ভিত্তি / নোট')]];
      lines.forEach(l=>rows.push([l.label,num(l.amount).toFixed(2),l.note]));
      rows.push(['TOTAL',tot.toFixed(2),''],[t('Per unit','প্রতি ইউনিট'),(num(S.qty)?tot/num(S.qty):0).toFixed(4),'']);
      rows.push([],[t('Estimate only - confirm rates with customs, carrier and your C&F agent.','শুধু অনুমান - কাস্টমস, ক্যারিয়ার ও C&F এজেন্টের কাছে হার নিশ্চিত করুন।')+' '+new Date().toISOString().slice(0,10)]);
      downloadText('landed-cost.csv','﻿'+rows.map(r=>r.map(c=>'"'+String(c??'').replace(/"/g,'""')+'"').join(',')).join('\r\n'),'text/csv');
    }
    const btns=el('div','btnrow');
    const addB=el('button','btn g',t('+ Add my own cost line','+ নিজের খরচের লাইন যোগ করুন'));
    addB.onclick=()=>{ CUSTOM.push({id:'c'+Date.now(),label:t('My cost','আমার খরচ'),amount:0,note:t('Added by you','আপনি যোগ করেছেন'),group:'custom'}); store.set('landed_custom',CUSTOM); recalc(); };
    const csvB=el('button','btn p'); csvB.innerHTML=icon('download',16)+' '+t('Download CSV (Excel)','CSV ডাউনলোড (Excel)'); csvB.onclick=downloadCSV;
    const prB=el('button','btn g',t('Print / save PDF','প্রিন্ট / PDF সেভ')); prB.onclick=()=>window.print();
    const clrB=el('button','btn g',t('Reset edits','এডিট রিসেট')); clrB.onclick=async()=>{ OVER={}; CUSTOM=[]; await store.set('landed_custom',[]); recalc(); };
    btns.append(addB,csvB,prB,clrB);
    wrap.append(note,grid,btns,linesBox,totalBox,el('div','footer-note',DISCLAIMER()));
    root.append(wrap);
    showHide(); recalc();
  }
});
})();
