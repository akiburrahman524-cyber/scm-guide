/* CBM & container fill: carton dimensions -> CBM, chargeable weight, container utilization with visuals. */
'use strict';
(function () {
registerTool({
  id:'cbm', icon:'box',
  title:['CBM & Container Fill','সিবিএম ও কন্টেইনার'],
  blurb:['Carton size to CBM, volumetric weight, and how much of a 20ft/40ft/40HC you fill.','কার্টুন সাইজ থেকে সিবিএম, ভলুমেট্রিক ওজন, ২০/৪০ ফুট কন্টেইনারে কতটুকু জায়গা লাগে।'],
  async render(root){
    const S = Object.assign({cartons:100,l:50,w:40,h:30,kg:12}, await store.get('cbm_inputs',{}));
    const wrap=el('div');
    const grid=el('div','frow c3');
    const F=[['cartons',()=>t('Number of cartons','কার্টুন সংখ্যা')],['l',()=>t('Length (cm)','দৈর্ঘ্য (সেমি)')],['w',()=>t('Width (cm)','প্রস্থ (সেমি)')],['h',()=>t('Height (cm)','উচ্চতা (সেমি)')],['kg',()=>t('Weight per carton (kg)','প্রতি কার্টুন ওজন (কেজি)')]];
    F.forEach(([k,lf])=>{ const w=el('div'); const lab=el('label','',lf()); const i=el('input'); i.inputMode='decimal'; i.value=S[k];
      i.oninput=()=>{ S[k]=i.value; store.set('cbm_inputs',S); calc(); }; w.append(lab,i); grid.append(w); });
    const out=el('div'); wrap.append(grid,out);
    const CONT=[['20ft',28,5.9,2.35,2.39],['40ft',58,12.03,2.35,2.39],['40HC',68,12.03,2.35,2.69]];
    function calc(){
      out.replaceChildren();
      const n=Math.ceil(num(S.cartons)), cbm1=(num(S.l)*num(S.w)*num(S.h))/1e6, cbm=cbm1*n, gross=num(S.kg)*n;
      const volAir=(num(S.l)*num(S.w)*num(S.h))/6000*n, volCour=(num(S.l)*num(S.w)*num(S.h))/5000*n;
      const r=el('div','result');
      r.append(el('div','m',t('Total volume','মোট আয়তন')), el('div','big',cbm.toFixed(3)+' CBM'));
      const rows=[[t('Per carton','প্রতি কার্টুন'),cbm1.toFixed(4)+' CBM'],[t('Gross weight','মোট ওজন'),gross.toFixed(1)+' kg'],
        [t('Volumetric (air, /6000)','ভলুমেট্রিক (এয়ার, /৬০০০)'),volAir.toFixed(1)+' kg'],[t('Volumetric (courier, /5000)','ভলুমেট্রিক (কুরিয়ার, /৫০০০)'),volCour.toFixed(1)+' kg'],
        [t('Air chargeable weight','এয়ার চার্জেবল ওজন'),Math.max(gross,volAir).toFixed(1)+' kg']];
      rows.forEach(([a,b])=>{ const k=el('div','kv'); k.append(el('span','',a),el('b','',b)); r.append(k); });
      out.append(r);
      const h=el('h3','',t('Container fill (typical usable volume)','কন্টেইনার ভর্তি (সাধারণ ব্যবহারযোগ্য আয়তন)')); h.style.margin='20px 0 10px'; out.append(h);
      const viz=el('div','container-viz');
      CONT.forEach(([name,cap])=>{
        const pct=cap?Math.min(cbm/cap*100,100):0;
        const col=el('div');
        const b=el('div','cv-box'); b.style.height='120px';
        const f=el('div','fill'); f.style.height=pct+'%'; b.append(f);
        const c=el('div','cap',(cbm/cap*100).toFixed(0)+'%'); b.append(c);
        col.append(b);
        col.append(el('div','cv-lab',`${name} · ~${cap} CBM`));
        const need=el('div','cv-lab',cbm>cap?t('need ','লাগবে ')+Math.ceil(cbm/cap)+'x':t('fits in 1','১টিতে ঢোকে'));
        col.append(need); viz.append(col);
      });
      out.append(viz);
      out.append(el('div','notebox',t('Usable volumes (~28 / 58 / 68 CBM) already allow for imperfect packing. Exact fit depends on carton vs container dimensions - a packing plan from your forwarder is more precise. Weight limits: 20ft ~28.2t, 40ft ~28.8t payload max.','ব্যবহারযোগ্য আয়তন (~২৮ / ৫৮ / ৬৮ সিবিএম) খালি জায়গা ধরে নেওয়া। কার্টুন-কন্টেইনার মাপ অনুযায়ী আসল ফিট বদলায় - ফরোয়ার্ডারের প্যাকিং প্ল্যান বেশি নির্ভুল। সর্বোচ্চ ওজন: ২০ফুট ~২৮.২ট, ৪০ফুট ~২৮.৮ট।')));
    }
    root.append(wrap);
    calc();
  }
});
})();
