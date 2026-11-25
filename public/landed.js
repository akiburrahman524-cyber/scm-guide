// Landed cost engine (client side). All lines editable. Estimate only, not a customs ruling.
const INCOTERMS = { // who pays: o=origin charges, f=main freight, i=insurance by BUYER ("b") or included in price ("s")
  EXW: { o: 'b', f: 'b', i: 'b' }, FCA: { o: 's', f: 'b', i: 'b' }, FAS: { o: 's', f: 'b', i: 'b' }, FOB: { o: 's', f: 'b', i: 'b' },
  CFR: { o: 's', f: 's', i: 'b' }, CIF: { o: 's', f: 's', i: 's' }, CPT: { o: 's', f: 's', i: 'b' }, CIP: { o: 's', f: 's', i: 's' },
  DAP: { o: 's', f: 's', i: 's' }, DPU: { o: 's', f: 's', i: 's' }, DDP: { o: 's', f: 's', i: 's' },
};
// Standard VAT rates, EU member states, as of January 2026. Source: https://taxfoundation.org/data/all/eu/value-added-tax-vat-rates-europe/ (checked 26 Nov 2026)
const EU_VAT = { Austria: 20, Belgium: 21, Bulgaria: 20, Croatia: 25, 'Czech Republic': 21, Denmark: 25, Finland: 25.5, France: 20, Germany: 19, Greece: 24, Hungary: 27, Ireland: 23, Italy: 22, Lithuania: 21, Netherlands: 21, Poland: 23, Portugal: 23, Romania: 21, Spain: 21, Sweden: 25 };
const DEST = {
  MY: { name: 'Malaysia', note: 'Sales tax is charged on (CIF + import duty + excise). Standard 10%, reduced 5% for listed goods, some goods specific rates (source: Malaysia Customs MySST / DHL Malaysia guide, May 2026). Import duty % depends on HS code: look it up on the Malaysia Customs tariff finder. Goods valued RM500 or less sold online from overseas fall under the low-value goods sales tax, check with Customs.', vatLabel: 'Sales tax (SST)', vat: 10, taxes: [] },
  BD: { name: 'Bangladesh', note: 'Four main import levels: Customs Duty (CD), Regulatory Duty (RD), Supplementary Duty (SD), VAT 15%. Advance Income Tax 5% is also charged (source: trade.gov Bangladesh Import Tariffs, published 2026-03-19; NBR VAT FAQ). The cascade order used here (CD and RD on value, SD on value+CD+RD, VAT on value+CD+RD+SD) is the commonly used method. Confirm rates per HS code on the Bangladesh Customs tariff and with your C&F agent. Advance Trade VAT and other levies are not verified here, so add them as extra lines if they apply.', vatLabel: 'VAT', vat: 15, taxes: [] },
  EU: { name: 'European Union', note: 'VAT is charged on (customs value + duty + costs up to the first EU destination). Standard VAT rates shown are as of Jan 2026 and can change; reduced rates may apply to some goods. Since 1 July 2026 the EUR 150 duty exemption is gone: a EUR 3 duty per item applies to low-value B2C parcels, and a EUR 2 Union handling fee per item applies from 1 Nov 2026 (source: business.gov.uk EU UCC reforms page). Duty % otherwise follows the EU TARIC for the HS code. Special origin rules and trade agreements are not applied.', vatLabel: 'VAT', vat: 19, taxes: [] },
  XX: { name: 'Other country', note: 'Enter your own duty and VAT or GST rates from the destination customs authority.', vatLabel: 'VAT / GST', vat: 0, taxes: [] },
};
const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Volumes and weights
function cargo(s) {
  const cbmPerCarton = (num(s.l) * num(s.w) * num(s.h)) / 1e6;
  const cartons = Math.ceil(num(s.cartons));
  const cbm = cbmPerCarton * cartons;
  const grossKg = num(s.kg) * cartons;
  const volKg = (num(s.l) * num(s.w) * num(s.h)) / 6000 * cartons; // IATA air volumetric 6000 cm3/kg
  const chargeKg = Math.max(grossKg, volKg);
  // Approximate usable internal volumes (typical, varies by container and packing): 20ft ~28 m3, 40ft ~58 m3, 40HC ~68 m3
  const fit = { '20ft': 28, '40ft': 58, '40HC': 68 };
  const boxes = Object.fromEntries(Object.entries(fit).map(([k, v]) => [k, cbm ? Math.ceil(cbm / v * 100) / 100 : 0]));
  return { cbmPerCarton, cartons, cbm, grossKg, volKg, chargeKg, boxes, fit };
}

// Build the default editable lines from inputs. Each line: {id,label,amount,basis,note,auto}
function buildLines(s) {
  const c = cargo(s); const t = INCOTERMS[s.incoterm] || INCOTERMS.FOB; const d = DEST[s.dest] || DEST.XX;
  const goods = num(s.qty) * num(s.price);
  let freight = 0, freightBasis = '';
  if (s.mode === 'sea-fcl') { freight = num(s.rate) * num(s.containers); freightBasis = `${num(s.containers)} container x rate`; }
  else if (s.mode === 'sea-lcl') { freight = num(s.rate) * Math.max(c.cbm, c.grossKg / 1000); freightBasis = `rate x max(${c.cbm.toFixed(2)} CBM, ${(c.grossKg / 1000).toFixed(2)} t)`; }
  else if (s.mode === 'air') { freight = num(s.rate) * c.chargeKg; freightBasis = `rate x chargeable ${c.chargeKg.toFixed(1)} kg`; }
  else { freight = num(s.rate) * c.chargeKg; freightBasis = `rate x ${c.chargeKg.toFixed(1)} kg`; }
  const L = [];
  const add = (id, label, amount, note, group, auto = true) => L.push({ id, label, amount: +amount.toFixed(2), note, group, auto });
  add('goods', 'Goods value (qty x unit price)', goods, `${num(s.qty)} x ${num(s.price)}`, 'goods');
  add('origin', 'Origin charges (export clearance, local haulage, packing)', t.o === 'b' ? num(s.originCost) : 0, t.o === 'b' ? 'Buyer pays under ' + s.incoterm : 'Seller pays under ' + s.incoterm + ' (inside price)', 'ship');
  add('freight', 'Main freight', t.f === 'b' ? freight : 0, t.f === 'b' ? freightBasis + ' (your rate, not a quote)' : 'Seller pays under ' + s.incoterm + ' (inside price)', 'ship');
  const insBase = goods + (t.o === 'b' ? num(s.originCost) : 0) + (t.f === 'b' ? freight : 0);
  add('ins', 'Cargo insurance', t.i === 'b' ? insBase * num(s.insPct) / 100 : 0, t.i === 'b' ? `${num(s.insPct)}% of goods + freight (your rate)` : 'Included under ' + s.incoterm, 'ship');
  const cv = L.slice(0, 4).reduce((a, x) => a + x.amount, 0);
  add('cv', 'Customs value (CIF basis, subtotal)', cv, 'Goods + origin + freight + insurance that you pay. Some countries value differently, check the rule.', 'sub');
  const duty = cv * num(s.duty) / 100; let rd = 0, sd = 0, other = 0; let vatBase = cv + duty; const extra = [];
  if (s.dest === 'BD') { rd = cv * num(s.rd) / 100; sd = (cv + duty + rd) * num(s.sd) / 100; vatBase = cv + duty + rd + sd; }
  add('duty', 'Import / customs duty', duty, `${num(s.duty)}% of customs value (rate by HS code)`, 'tax');
  if (s.dest === 'BD') { add('rd', 'Regulatory duty (RD)', rd, `${num(s.rd)}% of customs value`, 'tax'); add('sd', 'Supplementary duty (SD)', sd, `${num(s.sd)}% of (value + CD + RD)`, 'tax'); }
  if (s.dest === 'MY') { const ex = cv * num(s.excise) / 100; add('excise', 'Excise duty', ex, `${num(s.excise)}% of customs value (usually 0 unless excisable goods)`, 'tax'); vatBase = cv + duty + ex; }
  if (s.dest === 'EU') { const perItem = s.euLow === 'yes' ? 3 * num(s.items) : 0; add('eu3', 'EU EUR 3 duty per item (low-value parcels)', perItem, 'Only for B2C parcels up to EUR 150 per item, in EUR', 'tax'); const uhf = s.euLow === 'yes' ? 2 * num(s.items) : 0; add('uhf', 'EU Union handling fee EUR 2 per item', uhf, 'From 1 Nov 2026, in EUR', 'tax'); }
  const clearance = num(s.thc) + num(s.broker) + num(s.dutyOther);
  add('thc', 'Port / terminal handling and D/O fees at destination', num(s.thc), 'Your estimate', 'dest');
  add('broker', 'Customs broker / clearance agent fee', num(s.broker), 'Your estimate', 'dest');
  add('inland', 'Inland delivery to your address', num(s.inland), 'Your estimate', 'dest');
  if (s.dest === 'EU') vatBase += num(s.inland);
  add('vat', `${d.vatLabel} (${num(s.vat)}%)`, vatBase * num(s.vat) / 100, `${num(s.vat)}% of ${money(vatBase)}`, 'tax');
  if (s.dest === 'BD') { add('ait', 'Advance Income Tax (AIT)', cv * num(s.ait) / 100, `${num(s.ait)}% of customs value, usually creditable against income tax`, 'tax'); }
  add('other', 'Other (storage, demurrage, inspection, certificates)', num(s.otherCost), 'Your estimate', 'dest');
  return L;
}
const totalOf = (lines) => lines.filter((l) => l.group !== 'sub').reduce((a, l) => a + num(l.amount), 0);
function toCSV(s, lines, total, fx) {
  const rows = [['SCM Guide landed cost sheet'], ['Product', s.product], ['Route', `${s.originCountry} to ${DEST[s.dest].name}`], ['Incoterm', s.incoterm], ['Mode', s.mode], ['Quantity', s.qty], [], ['Line', 'Amount', 'Basis / note']];
  lines.forEach((l) => rows.push([l.label, num(l.amount).toFixed(2), l.note]));
  rows.push(['TOTAL LANDED COST', total.toFixed(2), ''], ['Per unit', (num(s.qty) ? total / num(s.qty) : 0).toFixed(4), '']);
  if (fx) rows.push(['Total in local currency (x' + fx + ')', (total * fx).toFixed(2), '']);
  rows.push([], ['Estimate only. Rates and fees must be confirmed with the customs authority, carrier and your clearing agent. Generated by SCM Guide on ' + new Date().toISOString().slice(0, 10)]);
  return '\ufeff' + rows.map((r) => r.map((c) => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\r\n');
}
if (typeof module !== 'undefined') module.exports = { INCOTERMS, EU_VAT, DEST, cargo, buildLines, totalOf, toCSV };
