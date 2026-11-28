/* Dashboard: hero + tool cards + daily tip. */
'use strict';
(function () {
const TIPS = [
 ['A cheap FOB price can lose once freight and duty are added. Always compare landed cost, not price.','সস্তা FOB দামও ফ্রেইট আর শুল্ক যোগ করলে হেরে যেতে পারে। সবসময় দাম নয়, ল্যান্ডেড কস্ট তুলনা করুন।'],
 ['Check the HS code before you negotiate price - duty can be 0% or 30% on almost the same product.','দাম নিয়ে কথা বলার আগে HS কোড দেখুন - প্রায় একই পণ্যে শুল্ক ০% বা ৩০% হতে পারে।'],
 ['Book freight before the goods are ready, not after - late booking costs more than early.','মাল রেডি হওয়ার আগেই ফ্রেইট বুক করুন - দেরিতে বুকিং বেশি খরচ।'],
 ['Free days at the port are negotiable when you book. Ask for more before you ship, not after you arrive.','বন্দরে ফ্রি দিন বুকিংয়ের সময় দর-কষাকষি করা যায়। মাল আসার পর নয়, চালানের আগে চান।'],
 ['Keep the commercial invoice, packing list and B/L consistent - mismatches are the top cause of customs delays.','ইনভয়েস, প্যাকিং লিস্ট ও B/L মিলিয়ে রাখুন - অমিলই কাস্টমস দেরির প্রধান কারণ।'],
 ['1 CBM counts as 167 kg by air. Light bulky cartons are charged by volume, not scale weight.','বিমানে ১ CBM = ১৬৭ কেজি ধরা হয়। হালকা বড় কার্টুনে ওজন নয়, আয়তনের দাম লাগে।'],
 ['Reorder point = demand during lead time + safety stock. Set it once, avoid every stockout.','রিঅর্ডার পয়েন্ট = লিড টাইমের চাহিদা + সেফটি স্টক। একবার ঠিক করুন, স্টক-আউট ভুলুন।']
];
registerTool({
  id:'dashboard', icon:'dashboard',
  title:['Dashboard','ড্যাশবোর্ড'],
  blurb:['',''],
  async render(root){
    const wrap=el('div');
    const hero=el('div','hero');
    hero.append(el('h2','',t('Free supply chain toolkit','ফ্রি সাপ্লাই চেইন টুলকিট')));
    hero.append(el('p','',t('Landed cost, HS codes, CBM, freight, demurrage and every working formula - offline, private, in Bangla and English. Bangladesh and Malaysia first.','ল্যান্ডেড কস্ট, এইচএস কোড, সিবিএম, ফ্রেইট, ডেমারেজ এবং সব কার্যকর ফর্মুলা - অফলাইন, প্রাইভেট, বাংলা ও ইংরেজিতে। বাংলাদেশ ও মালয়েশিয়া আগে।')));
    wrap.append(hero);
    const grid=el('div','grid c3');
    TOOLS.filter(x=>x.id!=='dashboard').forEach(x=>{
      const c=el('div','tool-card');
      const tic=el('span','tic'); tic.append(iconEl(x.icon,22)); c.append(tic);
      const tx=el('div'); tx.append(el('b','',t(x.title[0],x.title[1])), el('div','m',t(x.blurb[0],x.blurb[1])));
      c.append(tx); c.onclick=()=>location.hash='#/'+x.id;
      grid.append(c);
    });
    wrap.append(grid);
    const tip=TIPS[new Date().getDate()%TIPS.length];
    const tc=el('div','card'); tc.style.marginTop='16px';
    tc.append(el('h3','',t('Tip of the day','আজকের টিপস')), el('div','',t(tip[0],tip[1])));
    wrap.append(tc);
    const lk=el('div','card'); lk.style.marginTop='12px';
    lk.append(el('h3','',t('More free tools','আরও ফ্রি টুল')));
    const a=el('a','','SCM Guide - '+t('glossary, news and courses on the web','ওয়েবে শব্দকোষ, খবর ও কোর্স'));
    a.href='https://akiburrahman524-cyber.github.io/scm-guide/'; a.target='_blank'; a.rel='noopener noreferrer';
    lk.append(a);
    wrap.append(lk);
    wrap.append(el('div','footer-note',DISCLAIMER()));
    root.append(wrap);
  }
});
})();
