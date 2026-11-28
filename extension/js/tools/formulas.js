/* A-to-Z supply chain accounting & planning calculators. */
'use strict';
(function () {
const CALCS = [
 { id:'eoq', name:['Economic Order Quantity (EOQ)','ইকোনমিক অর্ডার কোয়ান্টিটি (EOQ)'], f:'EOQ = √(2DS / H)',
   fields:[['d',['Annual demand (units)','বার্ষিক চাহিদা (ইউনিট)'],12000],['s',['Order cost per order S','প্রতি অর্ডার খরচ S'],50],['h',['Holding cost per unit per year H','প্রতি ইউনিট বার্ষিক হোল্ডিং খরচ H'],2]],
   run:v=>'√(2×'+v.d+'×'+v.s+'/'+v.h+') = '+money(Math.sqrt(2*v.d*v.s/v.h),1)+' '+t('units per order','ইউনিট প্রতি অর্ডার') },
 { id:'ss', name:['Safety stock','সেফটি স্টক'], f:'SS = Z × σd × √L',
   fields:[['sd',['Std deviation of daily demand σd','দৈনিক চাহিদার পরিবর্তন σd'],8],['lt',['Lead time (days)','লিড টাইম (দিন)'],9],['z',['Z (90%=1.28, 95%=1.65, 99%=2.33)','Z (৯০%=১.২৮, ৯৫%=১.৬৫, ৯৯%=২.৩৩)'],1.65]],
   run:v=>money(v.z*v.sd*Math.sqrt(v.lt),1)+' '+t('units','ইউনিট') },
 { id:'rop', name:['Reorder point (ROP)','রিঅর্ডার পয়েন্ট (ROP)'], f:'ROP = d̄ × L + SS',
   fields:[['dd',['Average daily demand','গড় দৈনিক চাহিদা'],40],['lt',['Lead time (days)','লিড টাইম (দিন)'],9],['ss',['Safety stock','সেফটি স্টক'],60]],
   run:v=>money(v.dd*v.lt+v.ss,0)+' '+t('units - order when stock hits this','ইউনিট - স্টক এখানে এলে অর্ডার করুন') },
 { id:'turns', name:['Inventory turnover','ইনভেন্টরি টার্নওভার'], f:'Turns = COGS / average inventory',
   fields:[['cogs',['Annual cost of goods sold','বার্ষিক COGS'],600000],['inv',['Average inventory value','গড় ইনভেন্টরি মূল্য'],100000]],
   run:v=>money(v.cogs/v.inv,2)+' '+t('turns','টার্ন')+' · '+money(365/(v.cogs/v.inv),0)+' '+t('days of stock','দিনের স্টক') },
 { id:'dio', name:['Days inventory outstanding (DIO)','ডেজ ইনভেন্টরি আউটস্ট্যান্ডিং (DIO)'], f:'DIO = avg inventory / COGS × 365',
   fields:[['inv',['Average inventory','গড় ইনভেন্টরি'],100000],['cogs',['Annual COGS','বার্ষিক COGS'],600000]],
   run:v=>money(v.inv/v.cogs*365,1)+' '+t('days','দিন') },
 { id:'dso', name:['Days sales outstanding (DSO)','ডেজ সেলস আউটস্ট্যান্ডিং (DSO)'], f:'DSO = receivables / revenue × 365',
   fields:[['ar',['Accounts receivable','পাওনা (receivable)'],80000],['rev',['Annual revenue','বার্ষিক আয়'],900000]],
   run:v=>money(v.ar/v.rev*365,1)+' '+t('days to collect','দিনে আদায়') },
 { id:'dpo', name:['Days payables outstanding (DPO)','ডেজ পেয়েবলস আউটস্ট্যান্ডিং (DPO)'], f:'DPO = payables / COGS × 365',
   fields:[['ap',['Accounts payable','পাওনা (payable)'],90000],['cogs',['Annual COGS','বার্ষিক COGS'],600000]],
   run:v=>money(v.ap/v.cogs*365,1)+' '+t('days to pay','দিনে পরিশোধ') },
 { id:'c2c', name:['Cash-to-cash cycle','ক্যাশ-টু-ক্যাশ সাইকেল'], f:'C2C = DIO + DSO − DPO',
   fields:[['dio',['DIO (days)','DIO (দিন)'],61],['dso',['DSO (days)','DSO (দিন)'],45],['dpo',['DPO (days)','DPO (দিন)'],55]],
   run:v=>money(v.dio+v.dso-v.dpo,0)+' '+t('days cash is tied up','দিন নগদ আটকে থাকে') },
 { id:'fill', name:['Fill rate','ফিল রেট'], f:'Fill rate = shipped units / ordered units',
   fields:[['sh',['Units shipped','পাঠানো ইউনিট'],950],['or',['Units ordered','অর্ডার করা ইউনিট'],1000]],
   run:v=>money(v.sh/v.or*100,1)+'%' },
 { id:'otif', name:['OTIF','OTIF'], f:'OTIF = orders on time AND in full / total orders',
   fields:[['ok',['Orders on time in full','সময়ে ও পুরো ডেলিভারি'],87],['tot',['Total orders','মোট অর্ডার'],100]],
   run:v=>money(v.ok/v.tot*100,1)+'%' },
 { id:'carry', name:['Annual carrying cost %','বার্ষিক ক্যারিং খরচ %'], f:'Carrying cost = inventory × rate',
   fields:[['inv',['Average inventory value','গড় ইনভেন্টরি মূল্য'],100000],['r',['Carrying rate % (capital + storage + risk, often 15-30%)','ক্যারিং রেট % (মূলধন + গুদাম + ঝুঁকি, সাধারণত ১৫-৩০%)'],20]],
   run:v=>money(v.inv*v.r/100,0)+' '+t('per year','প্রতি বছর') },
 { id:'margin', name:['Gross margin','গ্রস মার্জিন'], f:'Margin % = (price − cost) / price',
   fields:[['p',['Selling price','বিক্রয়মূল্য'],25],['c',['Landed cost per unit','প্রতি ইউনিট ল্যান্ডেড কস্ট'],15]],
   run:v=>money((v.p-v.c)/v.p*100,1)+'% '+t('margin','মার্জিন')+' · '+money(v.p-v.c)+' '+t('per unit','প্রতি ইউনিট') },
 { id:'markup', name:['Markup ↔ margin','মার্কআপ ↔ মার্জিন'], f:'Markup % = (price − cost) / cost',
   fields:[['c',['Cost','খরচ'],15],['p',['Selling price','বিক্রয়মূল্য'],25]],
   run:v=>t('Markup','মার্কআপ')+' '+money((v.p-v.c)/v.c*100,1)+'% = '+t('margin','মার্জিন')+' '+money((v.p-v.c)/v.p*100,1)+'%' },
 { id:'breakeven', name:['Break-even units','ব্রেক-ইভেন ইউনিট'], f:'BE = fixed costs / (price − variable cost)',
   fields:[['fx',['Fixed costs','স্থির খরচ'],50000],['p',['Price per unit','প্রতি ইউনিট দাম'],25],['vc',['Variable cost per unit','প্রতি ইউনিট পরিবর্তনশীল খরচ'],15]],
   run:v=>money(v.fx/(v.p-v.vc),0)+' '+t('units to break even','ইউনিটে ব্রেক-ইভেন') },
 { id:'perunit', name:['Per-unit landed cost','প্রতি ইউনিট ল্যান্ডেড কস্ট'], f:'Total cost / units',
   fields:[['tot',['Total shipment cost (from Landed Cost tool)','মোট চালান খরচ (ল্যান্ডেড কস্ট টুল থেকে)'],7550],['q',['Units','ইউনিট'],1000]],
   run:v=>money(v.tot/v.q,4)+' '+t('per unit','প্রতি ইউনিট') },
 { id:'duty', name:['Quick duty amount','দ্রুত শুল্ক'], f:'Duty = customs value × rate',
   fields:[['cv',['Customs value','কাস্টমস মূল্য'],10000],['r',['Duty %','ডিউটি %'],10]],
   run:v=>money(v.cv*v.r/100)+' '+t('duty','শুল্ক') },
 { id:'fxc', name:['Currency conversion','কারেন্সি রূপান্তর'], f:'Amount × rate',
   fields:[['a',['Amount (foreign)','অঙ্ক (বিদেশি)'],1000],['r',['Rate to local (e.g. 1 USD = BDT/RM?)','লোকাল হার (যেমন ১ USD = কত BDT/RM)'],117]],
   run:v=>money(v.a*v.r)+' '+t('local - enter today\'s rate from your bank','লোকাল - আজকের হার আপনার ব্যাংক থেকে দিন') },
 { id:'svc', name:['Service level to Z factor','সার্ভিস লেভেল থেকে Z'], f:'Z lookup',
   fields:[['sl',['Service level %','সার্ভিস লেভেল %'],95]],
   run:v=>{ const z=[[80,0.84],[85,1.04],[90,1.28],[95,1.65],[97.5,1.96],[98,2.05],[99,2.33],[99.9,3.09]]; const hit=z.reduce((b,x)=>Math.abs(x[0]-v.sl)<Math.abs(b[0]-v.sl)?x:b); return 'Z ≈ '+hit[1]+' ('+t('nearest standard level','নিকটতম স্ট্যান্ডার্ড')+' '+hit[0]+'%)'; } },
];
registerTool({
  id:'formulas', icon:'sigma',
  title:['A-Z Formulas & Accounting','এ-টু-জেড ফর্মুলা ও হিসাব'],
  blurb:['Every working supply chain calculation: EOQ, safety stock, margins, cash cycle and more.','কার্যকর সব সাপ্লাই চেইন হিসাব: EOQ, সেফটি স্টক, মার্জিন, ক্যাশ সাইকেল ও আরও।'],
  async render(root){
    const saved=await store.get('formula_vals',{});
    const wrap=el('div');
    wrap.append(el('div','notebox',t('Each calculator shows its formula. Change any number - the result updates at once.','প্রতিটি ক্যালকুলেটরে ফর্মুলা দেখানো আছে। যেকোনো সংখ্যা বদলান - ফল সঙ্গে সঙ্গে বদলায়।')));
    const grid=el('div','grid c2');
    CALCS.forEach(c=>{
      const card=el('div','card');
      card.append(el('h3','',t(c.name[0],c.name[1])), el('div','m',c.f));
      const vals=Object.assign({}, saved[c.id]||{});
      c.fields.forEach(([k])=>{ if(vals[k]===undefined) vals[k]=c.fields.find(f=>f[0]===k)[2]; });
      const out=el('div','result'); out.style.marginTop='10px'; const outB=el('b');
      const run=()=>{ try{ outB.textContent=t('Result','ফল')+': '+c.run(Object.fromEntries(Object.entries(vals).map(([k,v])=>[k,num(v)]))); }catch(e){ outB.textContent='-'; } };
      c.fields.forEach(([k,lf,dv])=>{ const w=el('div'); w.style.marginTop='8px'; w.append(el('label','',t(lf[0],lf[1]))); const i=el('input'); i.inputMode='decimal'; i.value=vals[k];
        i.oninput=()=>{ vals[k]=i.value; saved[c.id]=vals; store.set('formula_vals',saved); run(); }; w.append(i); card.append(w); });
      out.append(outB); card.append(out); grid.append(card); run();
    });
    wrap.append(grid);
    root.append(wrap);
  }
});
})();
