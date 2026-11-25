const S = { product: 'Example product', originCountry: 'China', dest: 'MY', incoterm: 'FOB', mode: 'sea-fcl', qty: 1000, price: 5, cartons: 100, l: 50, w: 40, h: 30, kg: 12, items: 1000, containers: 1, rate: 2500, originCost: 0, insPct: 0.3, duty: 10, excise: 0, rd: 0, sd: 0, sws: 10, xduty: 0, ait: 5, vat: 10, euCountry: 'Germany', euLow: 'no', thc: 300, broker: 150, inland: 400, otherCost: 0, dutyOther: 0, fx: '' };
let OVER = {}; let CUSTOM = [];
const FIELDS = [
 ['product','Product','t'],['originCountry','Origin country','t'],['dest','Destination','sel',[['MY','Malaysia'],['BD','Bangladesh'],['EU','European Union'],['GB','United Kingdom'],['SG','Singapore'],['AE','United Arab Emirates'],['IN','India'],['US','United States'],['XX','Other country']]],
 ['incoterm','Incoterm (who pays what)','sel',Object.keys(INCOTERMS).map(x=>[x,x])],['mode','Transport mode','sel',[['sea-fcl','Sea, full container (FCL)'],['sea-lcl','Sea, shared (LCL)'],['air','Air freight'],['road','Road / courier (per kg)']]],
 ['qty','Quantity (units)'],['price','Unit price (same currency for all amounts)'],['cartons','Number of cartons'],['l','Carton length (cm)'],['w','Carton width (cm)'],['h','Carton height (cm)'],['kg','Carton weight (kg)'],
 ['containers','Containers (FCL only)'],['rate','Freight rate: per container (FCL), per CBM or tonne (LCL), per kg (air/road). Your own rate, example shown.'],
 ['originCost','Origin charges (if buyer pays)'],['insPct','Insurance % (example)'],['duty','Import duty % (by HS code)'],
 ['excise','Excise % (Malaysia)','n','MY'],['rd','Regulatory duty % (Bangladesh)','n','BD'],['sd','Supplementary duty % (Bangladesh)','n','BD'],['ait','Advance income tax % (Bangladesh)','n','BD'],
 ['sws','Social Welfare Surcharge % of BCD (India)','n','IN'],['xduty','Additional tariffs % (US, by origin)','n','US'],['euCountry','EU country (sets standard VAT)','sel',Object.keys(EU_VAT).map(x=>[x,x]),'EU'],['euLow','Low-value B2C parcel (EUR 3 + EUR 2 per item)?','sel',[['no','No'],['yes','Yes']],'EU'],['items','Items in parcel (for per-item EU fees)','n','EU'],
 ['vat','VAT / sales tax / GST %'],['thc','Port, terminal and D/O fees at destination'],['broker','Customs broker fee'],['inland','Inland delivery'],['otherCost','Other costs'],['fx','Optional: exchange rate to local currency (multiplier)'],
];
let HS=null;
async function hsFind(q){ if(!HS){ try{ HS=await (await fetch('/hs.json')).json(); }catch(e){ HS=[]; } }
 const w=q.toLowerCase().split(/\W+/).filter(x=>x.length>2); const box=$('#hsout'); box.replaceChildren();
 if(!w.length){ return; }
 const hits=HS.filter(([n,t])=>w.some(x=>t.toLowerCase().includes(x)||String(n)===x)).slice(0,8);
 if(!hits.length){ box.append(el('div','m','No chapter title matches. Try a broader word such as machinery, plastic, textile, food.')); return; }
 hits.forEach(([n,t])=>{ const c=el('div','card'); c.append(el('b','','Chapter '+String(n).padStart(2,'0')),el('div','',t)); box.append(c); });
 box.append(el('div','m','Chapter is only the first 2 digits. Find the full 6 to 10 digit code and the duty rate on the destination customs tariff search (for example Malaysia Customs, Bangladesh Customs, EU TARIC, UK Trade Tariff). Chapter titles: WCO HS 2022.'));
}
function initLanded(){
 const f=$('#lform'); f.replaceChildren();
 const hsBox=el('div'); hsBox.append(el('label','m','Not sure of the HS code? Type a product word to find its HS chapter'));
 const hi=el('input'); hi.placeholder='e.g. plastic, machine, cotton, battery'; hi.oninput=()=>hsFind(hi.value); hsBox.append(hi, Object.assign(el('div'),{id:'hsout'})); f.append(hsBox);
 FIELDS.forEach(([k,l,t,opts,only])=>{ const w=el('div'); w.dataset.only=(t==='n'||t==='sel')&&typeof opts==='string'?opts:(only||''); if(t==='n'&&typeof opts==='string'){w.dataset.only=opts}
  w.append(el('label','m',l)); let i;
  if(t==='sel'){ i=el('select'); i.style.cssText='width:100%;padding:10px;margin:4px 0 10px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fff'; opts.forEach(([v,n])=>{const o=el('option','',n);o.value=v;i.append(o)}); }
  else { i=el('input'); if(t!=='t') i.inputMode='decimal'; }
  i.value=S[k]; i.oninput=i.onchange=()=>{ S[k]=i.value; if(k==='dest'){ S.vat = k==='dest'? (DEST[S.dest].vat) : S.vat; if(S.dest==='EU') S.vat=EU_VAT[S.euCountry]; const vf=f.querySelector('[data-k=vat]'); if(vf) vf.value=S.vat; } if(k==='euCountry'){ S.vat=EU_VAT[S.euCountry]; const vf=f.querySelector('[data-k=vat]'); if(vf) vf.value=S.vat; } OVER={}; showHide(); recalc(); };
  i.dataset.k=k; w.append(i); f.append(w); });
 const ex=el('div'); const b=el('button','p','Add my own cost line'); b.onclick=()=>{CUSTOM.push({id:'c'+Date.now(),label:'My cost',amount:0,note:'Added by you',group:'custom'}); recalc()}; ex.append(b); f.append(ex);
 $('#lcsv').onclick=downloadCSV; $('#lprint').onclick=()=>window.print(); showHide(); recalc();
}
function showHide(){ document.querySelectorAll('#lform > div').forEach(w=>{ const o=w.dataset.only; if(!o) return; w.hidden=o!==S.dest; }); }
let CUR=[];
function recalc(){
 CUR=buildLines(S).map(l=>(OVER[l.id]!==undefined? {...l,amount:OVER[l.id],note:l.note+' (edited by you)'}:l)).concat(CUSTOM.map(c=>({...c,amount:OVER[c.id]!==undefined?OVER[c.id]:c.amount})));
 const box=$('#llines'); box.replaceChildren();
 CUR.forEach(l=>{ const c=el('div','card'); c.append(el('b','',l.label)); c.append(el('div','m',l.note));
  if(l.group==='sub'){ c.append(el('div','',money(l.amount))); }
  else { const i=el('input'); i.inputMode='decimal'; i.value=l.amount; i.oninput=()=>{ if(l.group==='custom'){ const cc=CUSTOM.find(x=>x.id===l.id); if(cc) cc.amount=num(i.value); } OVER[l.id]=num(i.value); updTotal(); }; c.append(i);
   if(l.group==='custom'){ const nm=el('input'); nm.value=l.label; nm.oninput=()=>{const cc=CUSTOM.find(x=>x.id===l.id); if(cc){cc.label=nm.value; const cur=CUR.find(x=>x.id===l.id); if(cur) cur.label=nm.value;}}; c.append(el('label','m','Name this line'),nm); } }
  box.append(c)});
 updTotal(); $('#lnote').textContent=DEST[S.dest].note+' Container fit is approximate (about '+Object.entries(cargo(S).fit).map(([k,v])=>k+' '+v+' CBM').join(', ')+' usable). Cargo: '+cargo(S).cbm.toFixed(2)+' CBM, '+cargo(S).grossKg.toFixed(0)+' kg gross, '+cargo(S).chargeKg.toFixed(0)+' kg chargeable (air). Containers needed: '+Object.entries(cargo(S).boxes).map(([k,v])=>k+' '+v).join(', ')+'.';
}
function liveLines(){ return CUR.map(l=>({...l,amount:OVER[l.id]!==undefined?OVER[l.id]:l.amount})); }
function updTotal(){ const t=totalOf(liveLines()); const fx=num(S.fx); const q=num(S.qty);
 const c=$('#ltotal'); c.replaceChildren(el('b','','Total landed cost: '+money(t)),el('div','','Per unit: '+(q?money(t/q):'enter quantity')),...(fx?[el('div','','In local currency: '+money(t*fx))]:[])); }
function downloadCSV(){ const t=totalOf(liveLines()); const csv=toCSV(S,liveLines(),t,num(S.fx)); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='landed-cost.csv'; document.body.append(a); a.click(); a.remove(); }
function initProcess(){ const P=[
 ['The big picture (SCOR)','Plan, Source, Make, Deliver, Return. Planning sets demand and supply plans. Sourcing buys materials. Making converts them. Delivering moves product to customers. Returning handles returns and repairs.'],
 ['Buying: procure-to-pay','Need and requisition, supplier search (RFI/RFQ/RFP), evaluation and negotiation, contract and PO, shipment and goods receipt, 3-way match, payment.'],
 ['Importing step by step','1 Agree price and Incoterm. 2 Classify the product (HS code). 3 Check import rules: licences, permits, restricted goods. 4 Book transport. 5 Seller issues commercial invoice, packing list, bill of lading or air waybill, certificate of origin if needed. 6 Insurance. 7 Customs declaration lodged by you or a broker. 8 Duty and tax assessed on customs value. 9 Inspection if selected. 10 Payment and release. 11 Port pickup, delivery, goods receipt.'],
 ['Exporting step by step','Check export controls and sanctions, classify goods, pack and mark, book transport, issue documents, export declaration, handover under the Incoterm, receive payment (L/C, advance, open account).'],
 ['Landed cost method','Landed cost = goods + origin charges + main freight + insurance + duty + other duties + VAT or sales tax (where not recoverable) + port and clearance + inland delivery + any storage or demurrage. Which items you pay depends on the Incoterm. Taxes are applied in an order set by each country, so use the destination preset in the Landed cost tab.'],
 ['Modes of transport','Sea: cheapest per kg, slow, priced per container (FCL) or CBM (LCL). Air: fast, priced on chargeable weight. Road and rail: regional. Courier: door to door for small parcels with higher cost per kg.'],
 ['Inventory and planning','Forecast demand, set safety stock and reorder points, review with ABC analysis, run S&OP monthly, measure with turns, OTIF and fill rate.'],
 ['Risk and sustainability','Map suppliers beyond tier 1, use dual sourcing for critical items, track lead-time variability, and measure transport emissions and supplier practices.'],
 ['Careers and certifications','See the Learn tab: free courses first, then paid credentials such as CIPS, ASCM CSCP or CPIM.'] ];
 const b=$('#proc'); b.replaceChildren(); P.forEach(([a,c])=>{const d=el('div','card'); d.append(el('b','',a),el('div','',c)); b.append(d)}); }
