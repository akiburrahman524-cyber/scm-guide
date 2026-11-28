/* Demurrage / detention calculator with tiered daily rates. */
'use strict';
(function () {
registerTool({
  id:'demurrage', icon:'clock',
  title:['Demurrage & Detention','ডেমারেজ ও ডিটেনশন'],
  blurb:['Cost of overrunning free days at port (demurrage) or keeping the container (detention), with tiered rates.','ফ্রি দিন পার হলে বন্দরে (ডেমারেজ) বা কন্টেইনার রাখার (ডিটেনশন) খরচ, স্তরভিত্তিক রেটে।'],
  async render(root){
    const S=Object.assign({freeDays:7,daysUsed:12,t1d:5,t1r:20,t2d:10,t2r:40,t3r:80,containers:1},await store.get('dem_inputs',{}));
    const wrap=el('div');
    wrap.append(el('div','notebox',t('Lines give free days, then charge per container per day, and the daily rate usually climbs in tiers. Enter your line\'s tariff - examples shown. Demurrage = inside the port. Detention = outside the port, same math.','লাইনগুলো ফ্রি দিন দেয়, তারপর প্রতি কন্টেইনার প্রতিদিন চার্জ, আর দৈনিক রেট সাধারণত স্তরে স্তরে বাড়ে। আপনার লাইনের ট্যারিফ দিন - উদাহরণ দেখানো আছে। ডেমারেজ = বন্দরের ভিতরে। ডিটেনশন = বন্দরের বাইরে, হিসাব একই।')));
    const grid=el('div','frow c3');
    [['freeDays',()=>t('Free days','ফ্রি দিন')],['daysUsed',()=>t('Days actually used','আসলে ব্যবহৃত দিন')],['containers',()=>t('Containers','কন্টেইনার')],
     ['t1d',()=>t('Tier 1: up to N days over','স্তর ১: প্রথম N দিন')],['t1r',()=>t('Tier 1 rate per day','স্তর ১ রেট /দিন')],
     ['t2d',()=>t('Tier 2: up to N days over','স্তর ২: পরের N দিন')],['t2r',()=>t('Tier 2 rate per day','স্তর ২ রেট /দিন')],
     ['t3r',()=>t('Tier 3 rate per day (after)','স্তর ৩ রেট /দিন (পরে)')]].forEach(([k,lf])=>{ const w=el('div'); w.append(el('label','',lf())); const i=el('input'); i.inputMode='decimal'; i.value=S[k]; i.oninput=()=>{S[k]=i.value;store.set('dem_inputs',S);calc();}; w.append(i); grid.append(w); });
    const out=el('div'); wrap.append(grid,out);
    function calc(){
      out.replaceChildren();
      const over=Math.max(0,Math.ceil(num(S.daysUsed))-Math.ceil(num(S.freeDays)));
      const r=el('div','result');
      if(over<=0){ r.append(el('div','m',t('Within free time','ফ্রি সময়ের মধ্যে')),el('div','big',money(0))); out.append(r); return; }
      const a=Math.min(over,num(S.t1d)), b=Math.min(Math.max(over-num(S.t1d),0),num(S.t2d)), c=Math.max(over-num(S.t1d)-num(S.t2d),0);
      const total=(a*num(S.t1r)+b*num(S.t2r)+c*num(S.t3r))*Math.ceil(num(S.containers));
      r.append(el('div','m',t('Days over free time','ফ্রি সময়ের বাইরে দিন')+': '+over), el('div','big',money(total)));
      [[t('Tier 1','স্তর ১'),a,num(S.t1r)],[t('Tier 2','স্তর ২'),b,num(S.t2r)],[t('Tier 3','স্তর ৩'),c,num(S.t3r)]].forEach(([nm,d,rt])=>{ if(!d) return; const k=el('div','kv'); k.append(el('span','',`${nm}: ${d} ${t('days','দিন')} x ${rt} x ${Math.ceil(num(S.containers))} ${t('container(s)','কন্টেইনার')}`),el('b','',money(d*rt*Math.ceil(num(S.containers))))); r.append(k); });
      out.append(r);
      out.append(el('div','warnbox',t('Tariffs differ by line and port and can double after 14 days. Always confirm the actual tariff and free days on your booking confirmation.','ট্যারিফ লাইন ও বন্দরভেদে ভিন্ন এবং ১৪ দিন পর দ্বিগুণ হতে পারে। বুকিং কনফার্মেশনে আসল ট্যারিফ ও ফ্রি দিন নিশ্চিত করুন।')));
    }
    root.append(wrap);
    calc();
  }
});
})();
