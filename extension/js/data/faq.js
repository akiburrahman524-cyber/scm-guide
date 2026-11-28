/* Guides and FAQs - English + Bangla. General reference, not legal/customs advice. */
'use strict';
const GUIDES = [
  {
    id: 'bd-import',
    title: ['Importing into Bangladesh - steps', 'বাংলাদেশে আমদানি - ধাপে ধাপে'],
    body: [
      ['1. Get the basics ready: trade licence, TIN, VAT (BIN) registration, and a bank that handles import L/Cs. Register with CCI&E for an IRC (Import Registration Certificate) if you import commercially.',
       '১. প্রাথমিক প্রয়োজন: ট্রেড লাইসেন্স, TIN, VAT (BIN) রেজিস্ট্রেশন এবং এল/সি করতে পারে এমন ব্যাংক। ব্যবসায়িক আমদানির জন্য CCI&E থেকে IRC (ইমপোর্ট রেজিস্ট্রেশন সার্টিফিকেট) নিন।'],
      ['2. Classify your product: find the HS code first - duty, RD, SD, VAT and AIT all depend on it. Check the Bangladesh Customs tariff on the NBR site or with your C&F agent.',
       '২. পণ্য শ্রেণিবিন্যাস: আগে HS কোড বের করুন - শুল্ক, RD, SD, VAT ও AIT সব এর ওপর নির্ভর করে। NBR সাইটে বাংলাদেশ কাস্টমস ট্যারিফ দেখুন বা আপনার C&F এজেন্টকে জিজ্ঞেস করুন।'],
      ['3. Open the L/C (letter of credit) or agree payment terms with the supplier. Insurance is usually arranged through a local insurer.',
       '৩. সরবরাহকারীর সঙ্গে এল/সি খুলুন বা পেমেন্ট শর্ত ঠিক করুন। বীমা সাধারণত দেশীয় বীমা কোম্পানির মাধ্যমে করতে হয়।'],
      ['4. Documents: commercial invoice, packing list, bill of lading / air waybill, certificate of origin, insurance, and any product-specific permits (BSTI, drug administration, plant quarantine etc.).',
       '৪. কাগজপত্র: কমার্শিয়াল ইনভয়েস, প্যাকিং লিস্ট, বিল অব লেডিং / এয়ার ওয়েবিল, সার্টিফিকেট অব অরিজিন, বীমা এবং পণ্যভেদে বিশেষ অনুমতি (BSTI, ড্রাগ অ্যাডমিনিস্ট্রেশন, প্লান্ট কোয়ারেন্টাইন ইত্যাদি)।'],
      ['5. On arrival: your C&F (clearing & forwarding) agent files the bill of entry in the ASYCUDA system. Customs assesses value and duty; goods may be examined.',
       '৫. মাল পৌঁছালে: আপনার C&F এজেন্ট ASYCUDA সিস্টেমে বিল অব এন্ট্রি দাখিল করেন। কাস্টমস মূল্য ও শুল্ক নির্ধারণ করে; মাল পরীক্ষা হতে পারে।'],
      ['6. Pay the duty stack: Customs Duty + Regulatory Duty + Supplementary Duty + VAT 15% + Advance Income Tax 5% (AIT is usually adjustable against your income tax). Then release, port dues, and delivery.',
       '৬. শুল্ক পরিশোধ: কাস্টমস ডিউটি + রেগুলেটরি ডিউটি + সাপ্লিমেন্টারি ডিউটি + ভ্যাট ১৫% + অ্যাডভান্স ইনকাম ট্যাক্স ৫% (AIT সাধারণত আয়করের সঙ্গে সমন্বয়যোগ্য)। তারপর রিলিজ, বন্দর খরচ ও ডেলিভারি।'],
      ['Rates change every budget (July). Confirm current rates for your HS code on the NBR / Bangladesh Customs tariff before you order.',
       'প্রতি বাজেটে (জুলাই) হার বদলায়। অর্ডারের আগে আপনার HS কোডের বর্তমান হার NBR / বাংলাদেশ কাস্টমস ট্যারিফে নিশ্চিত করুন।']
    ]
  },
  {
    id: 'my-import',
    title: ['Importing into Malaysia - steps', 'মালয়েশিয়ায় আমদানি - ধাপে ধাপে'],
    body: [
      ['1. Register your business (SSM) and, if needed, an import licence. Most goods are free to import; some need permits from other agencies (SIRIM, MITI, MOH etc.).',
       '১. ব্যবসা রেজিস্টার করুন (SSM) এবং প্রয়োজনে ইমপোর্ট লাইসেন্স। বেশিরভাগ পণ্য মুক্ত; কিছু পণ্যে অন্য সংস্থার পারমিট লাগে (SIRIM, MITI, MOH ইত্যাদি)।'],
      ['2. Find the HS code and check duty + sales tax on the official MySST / JKDM tariff finder. Sales tax on imports is commonly 5% or 10% (some goods specific rates); service tax applies to services, not goods.',
       '২. HS কোড বের করে অফিসিয়াল MySST / JKDM ট্যারিফে ডিউটি ও সেলস ট্যাক্স দেখুন। আমদানিতে সেলস ট্যাক্স সাধারণত ৫% বা ১০% (কিছু পণ্যে নির্দিষ্ট হার); সার্ভিস ট্যাক্স পণ্যে নয়, সেবায় প্রযোজ্য।'],
      ['3. Agree Incoterms with the supplier, book freight, and prepare documents: invoice, packing list, bill of lading / air waybill, certificate of origin (needed for preferential rates under ASEAN / RCEP etc.).',
       '৩. সরবরাহকারীর সঙ্গে ইনকোটার্ম ঠিক করুন, ফ্রেইট বুক করুন এবং কাগজপত্র তৈরি করুন: ইনভয়েস, প্যাকিং লিস্ট, বিল অব লেডিং / এয়ার ওয়েবিল, সার্টিফিকেট অব অরিজিন (ASEAN / RCEP সুবিধার হারের জন্য লাগে)।'],
      ['4. Declaration: your forwarding agent submits the Customs declaration (eDeclare / Dagang Net). Duty and sales tax are paid before release.',
       '৪. ঘোষণা: আপনার ফরোয়ার্ডিং এজেন্ট কাস্টমস ডিক্লেয়ারেশন জমা দেন (eDeclare / Dagang Net)। রিলিজের আগে ডিউটি ও সেলস ট্যাক্স পরিশোধ করতে হয়।'],
      ['5. Low-value goods: items sold online from overseas at RM500 or less carry a 10% low-value goods (LVG) sales tax, usually collected by the seller/platform.',
       '৫. সস্তা পণ্য (LVG): বিদেশ থেকে অনলাইনে কেনা RM500 বা তার কম দামের পণ্যে ১০% লো-ভ্যালু গুডস সেলস ট্যাক্স থাকে, সাধারণত বিক্রেতা/প্ল্যাটফর্ম তুলে নেয়।'],
      ['Confirm current rates with Royal Malaysian Customs (JKDM) - budgets change rates and thresholds.',
       'বর্তমান হার রয়েল মালয়েশিয়ান কাস্টমসে (JKDM) নিশ্চিত করুন - বাজেটে হার ও সীমা বদলায়।']
    ]
  },
  {
    id: 'how-import-works',
    title: ['How customs clearance works anywhere', 'কাস্টমস ক্লিয়ারেন্স সারাদেশে যেভাবে হয়'],
    body: [
      ['Every country follows the same pattern: classify (HS code) -> value (usually transaction value, CIF or FOB basis) -> assess duty and tax -> declare -> pay -> examine (sometimes) -> release.',
       'সব দেশে একই ধরণ: শ্রেণিবিন্যাস (HS কোড) -> মূল্যায়ন (সাধারণত ট্রানজ্যাকশন ভ্যালু, CIF বা FOB ভিত্তিতে) -> শুল্ক ও কর নির্ধারণ -> ঘোষণা -> পরিশোধ -> পরীক্ষা (মাঝে মাঝে) -> রিলিজ।'],
      ['The customs value basis differs: most countries charge duty on CIF (cost + insurance + freight); the USA charges on the FAS/FOB-style transaction value without international freight and insurance.',
       'কাস্টমস মূল্যের ভিত্তি দেশভেদে ভিন্ন: বেশিরভাগ দেশ CIF (দাম + বীমা + ফ্রেইট) -এর ওপর শুল্ক নেয়; যুক্তরাষ্ট্রে আন্তর্জাতিক ফ্রেইট ও বীমা বাদে ট্রানজ্যাকশন ভ্যালুর ওপর নেয়।'],
      ['A licensed customs broker (C&F agent) files the declaration for you. For commercial imports this is almost always worth it - classification mistakes cost more than the fee.',
       'লাইসেন্সপ্রাপ্ত কাস্টমস ব্রোকার (C&F এজেন্ট) আপনার হয়ে ডিক্লেয়ারেশন করেন। ব্যবসায়িক আমদানিতে এটি প্রায় সবসময়ই মূল্যবান - ভুল শ্রেণিবিন্যাসের খরচ ফি-এর চেয়ে বেশি।'],
      ['Free trade agreements (ASEAN, RCEP, EU GSP etc.) can cut duty to zero - but only with a valid certificate of origin and direct shipment rules met.',
       'মুক্ত বাণিজ্য চুক্তি (ASEAN, RCEP, EU GSP ইত্যাদি) শুল্ক শূন্য পর্যন্ত কমাতে পারে - তবে শুধু বৈধ সার্টিফিকেট অব অরিজিন ও সরাসরি চালানের শর্ত পূরণ হলে।']
    ]
  }
];

const FAQS = [
  {
    q: ['How do I find the HS code for my product?', 'আমার পণ্যের HS কোড কীভাবে বের করব?'],
    a: ['Start with the HS Code tool here: search a plain product word (e.g. "cotton shirt") and read the 6-digit subheadings. The first 2 digits are the chapter, next 2 the heading, last 2 the subheading. Then open the destination country tariff (links inside each result) to get the national 8-10 digit code and the duty rate. When two codes could fit, the more specific description wins; for a binding answer, ask the customs authority or a broker.',
        'এখানকার HS কোড টুল দিয়ে শুরু করুন: সহজ ভাষায় পণ্যের নাম লিখুন (যেমন "cotton shirt") এবং ৬ সংখ্যার সাবহেডিং দেখুন। প্রথম ২ সংখ্যা চ্যাপ্টার, পরের ২ হেডিং, শেষ ২ সাবহেডিং। তারপর গন্তব্য দেশের ট্যারিফ খুলুন (প্রতিটি ফলাফলে লিংক আছে) জাতীয় ৮-১০ সংখ্যার কোড ও শুল্ক হারের জন্য। দুটি কোড মিলে গেলে বেশি নির্দিষ্ট বর্ণনাটি জেতে; চূড়ান্ত উত্তরের জন্য কাস্টমস বা ব্রোকারকে জিজ্ঞেস করুন।']
  },
  {
    q: ['What is landed cost and why does it matter?', 'ল্যান্ডেড কস্ট কী এবং কেন জরুরি?'],
    a: ['Landed cost is the total cost of getting one unit to your door: product price + freight + insurance + duty + taxes + port, clearance and delivery fees. It is the real cost to compare suppliers and set selling prices - a cheap FOB price can lose to a higher one once freight and duty are added.',
        'ল্যান্ডেড কস্ট হলো এক ইউনিট পণ্য আপনার দরজায় আনার মোট খরচ: পণ্যের দাম + ফ্রেইট + বীমা + শুল্ক + কর + বন্দর, ক্লিয়ারেন্স ও ডেলিভারি খরচ। সরবরাহকারী তুলনা ও বিক্রয়মূল্য ঠিক করার আসল ভিত্তি এটাই - ফ্রেইট আর শুল্ক যোগ করলে সস্তা FOB দামও ব্যয়বহুল হয়ে যেতে পারে।']
  },
  {
    q: ['Which Incoterm should I choose as a buyer?', 'ক্রেতা হিসেবে কোন ইনকোটার্ম বেছে নেব?'],
    a: ['FOB is the common safe choice for sea freight: the seller handles export and loading, you control the main freight and see real costs. EXW looks cheap but leaves you to handle export clearance in the seller\'s country. CIF is easy but the seller picks the freight and insurance, often at marked-up rates. DDP means the seller handles everything including duty - simplest, but compare the price against doing it yourself.',
        'সমুদ্রপথে FOB-ই সাধারণ নিরাপদ পছন্দ: বিক্রেতা রপ্তানি ও লোডিং সামলায়, আপনি মূল ফ্রেইট নিয়ন্ত্রণ করেন ও আসল খরচ দেখেন। EXW সস্তা মনে হলেও বিক্রেতার দেশে এক্সপোর্ট ক্লিয়ারেন্স আপনাকে করতে হয়। CIF সহজ কিন্তু বিক্রেতা ফ্রেইট ও বীমা বাছে, প্রায়ই বাড়তি দামে। DDP মানে বিক্রেতা সব সামলায়, শুল্কও - সবচেয়ে সহজ, কিন্তু নিজে করলে কত হয় তার সঙ্গে দাম তুলনা করুন।']
  },
  {
    q: ['FCL or LCL - when is a full container worth it?', 'FCL নাকি LCL - পুরো কন্টেইনার কখন লাভজনক?'],
    a: ['As a rule of thumb LCL (sharing a container) costs more per CBM and adds handling fees at both ends, but you only pay for your volume. Around 13-15 CBM and up, a 20ft FCL usually wins on cost and safety. Use the CBM tool here to see your volume and the Freight tool to compare both price structures with your forwarder\'s rates.',
        'সাধারণ নিয়ম: LCL (কন্টেইনার ভাগ করা) প্রতি CBM-এ বেশি খরচ এবং দুই প্রান্তে হ্যান্ডলিং ফি যোগ হয়, কিন্তু আপনি শুধু নিজের ভলিউমের টাকা দেন। প্রায় ১৩-১৫ CBM বা তার বেশি হলে ২০ ফুটের FCL সাধারণত খরচ ও নিরাপত্তায় জেতে। আপনার ভলিউম দেখতে এখানকার CBM টুল এবং ফরোয়ার্ডারের রেটে দুই কাঠামো তুলনা করতে Freight টুল ব্যবহার করুন।']
  },
  {
    q: ['How is air freight chargeable weight calculated?', 'এয়ার ফ্রেইটে চার্জেবল ওজন কীভাবে হয়?'],
    a: ['Airlines charge whichever is higher: actual gross weight or volumetric weight. Volumetric = (L x W x H in cm) / 6000 per carton, times the number of cartons. Couriers often divide by 5000, which makes light bulky cartons cost more. The Freight tool here computes both.',
        'এয়ারলাইন যেটি বেশি সেটি নেয়: আসল ওজন বা ভলুমেট্রিক ওজন। ভলুমেট্রিক = (দৈর্ঘ্য x প্রস্থ x উচ্চতা সেমিতে) / ৬০০০ প্রতি কার্টুন, গুণ কার্টুন সংখ্যা। কুরিয়াররা প্রায়ই ৫০০০ দিয়ে ভাগ করে, ফলে হালকা বড় কার্টুনের খরচ বাড়ে। এখানকার Freight টুল দুটোই হিসাব করে।']
  },
  {
    q: ['What are demurrage and detention and how do I avoid them?', 'ডেমারেজ ও ডিটেনশন কী এবং কীভাবে এড়াব?'],
    a: ['Demurrage is charged when your container stays inside the port past the free days. Detention is charged when you keep the carrier\'s container outside the port past the free days. Both grow daily and quickly exceed the freight itself. Avoid them: prepare documents before arrival, pre-clear customs where possible, book trucks early, and negotiate free days when you book the shipment. Use the Demurrage tool to see the cost of a delay.',
        'ফ্রি দিনের পর কন্টেইনার বন্দরের ভিতরে থাকলে ডেমারেজ, বাইরে ক্যারিয়ারের কন্টেইনার ফ্রি দিনের পর রাখলে ডিটেনশন ধরা হয়। দুটোই দৈনিক বাড়ে এবং দ্রুত ফ্রেইটকেও ছাড়িয়ে যায়। এড়াতে: মাল আসার আগে কাগজ প্রস্তুত করুন, সম্ভব হলে আগেই কাস্টমস প্রি-ক্লিয়ার করুন, ট্রাক আগে বুক করুন এবং বুকিংয়ের সময় ফ্রি দিন বাড়িয়ে নিন। দেরির খরচ দেখতে Demurrage টুল ব্যবহার করুন।']
  },
  {
    q: ['What documents do I need to import commercial goods?', 'ব্যবসায়িক পণ্য আমদানিতে কী কী কাগজ লাগে?'],
    a: ['The core set everywhere: commercial invoice, packing list, transport document (bill of lading, air waybill or CMR), and often a certificate of origin and insurance certificate. Product-specific permits depend on the goods: food, cosmetics, electronics, textiles and toys often need extra certificates in the destination country. Check before you pay the supplier - missing permits can strand the cargo.',
        'সব জায়গায় মূল সেট: কমার্শিয়াল ইনভয়েস, প্যাকিং লিস্ট, ট্রান্সপোর্ট ডকুমেন্ট (বিল অব লেডিং, এয়ার ওয়েবিল বা CMR), প্রায়ই সার্টিফিকেট অব অরিজিন ও বীমা সনদ। পণ্যভেদে বিশেষ পারমিট লাগে: খাদ্য, কসমেটিকস, ইলেকট্রনিকস, টেক্সটাইল ও খেলনায় গন্তব্য দেশে অতিরিক্ত সনদ লাগতে পারে। সরবরাহকারীকে টাকা দেওয়ার আগে যাচাই করুন - পারমিট না থাকলে মাল আটকে যেতে পারে।']
  },
  {
    q: ['Is the duty rate in this toolkit official?', 'এই টুলকিটের শুল্ক হার কি অফিসিয়াল?'],
    a: ['No. Default rates are typical public rates with sources and dates noted, and every rate field is editable. The official rate for your exact HS code and origin comes only from the destination customs tariff or a licensed broker. Treat every number here as a planning estimate.',
        'না। ডিফল্ট হারগুলো সাধারণ প্রকাশিত হার, উৎস ও তারিখসহ দেওয়া, আর প্রতিটি হারের ঘর সম্পাদনাযোগ্য। আপনার নির্দিষ্ট HS কোড ও উৎসের অফিসিয়াল হার আসে শুধু গন্তব্য দেশের কাস্টমস ট্যারিফ বা লাইসেন্সপ্রাপ্ত ব্রোকারের কাছ থেকে। এখানকার প্রতিটি সংখ্যাকে পরিকল্পনার আনুমানিক হিসেবে ধরুন।']
  },
  {
    q: ['Does this extension collect my data?', 'এই এক্সটেনশন কি আমার তথ্য সংগ্রহ করে?'],
    a: ['No. Everything runs offline inside your browser. Your inputs and saved rates stay in local browser storage on your device and are never sent anywhere. There are no accounts, no analytics and no ads.',
        'না। সবকিছু আপনার ব্রাউজারের ভিতরে অফলাইনে চলে। আপনার ইনপুট ও সংরক্ষিত হার আপনার ডিভাইসের লোকাল স্টোরেজে থাকে, কোথাও পাঠানো হয় না। কোনো অ্যাকাউন্ট, অ্যানালিটিক্স বা বিজ্ঞাপন নেই।']
  }
];

const OFFICIAL_LINKS = [
  { name: ['US HTS (USITC)', 'ইউএস HTS (USITC)'], url: 'https://hts.usitc.gov/' },
  { name: ['UK Trade Tariff (GOV.UK)', 'ইউকে ট্রেড ট্যারিফ (GOV.UK)'], url: 'https://www.trade-tariff.service.gov.uk/find_commodity' },
  { name: ['EU TARIC', 'ইউরোপীয় ইউনিয়ন TARIC'], url: 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp?Lang=en' },
  { name: ['Bangladesh Customs (NBR)', 'বাংলাদেশ কাস্টমস (NBR)'], url: 'http://bangladeshcustoms.gov.bd/' },
  { name: ['Malaysia MySST / JKDM tariff', 'মালয়েশিয়া MySST / JKDM ট্যারিফ'], url: 'https://mysst.customs.gov.my/' },
  { name: ['Singapore Customs', 'সিঙ্গাপুর কাস্টমস'], url: 'https://www.customs.gov.sg/' },
  { name: ['India CBIC', 'ভারত CBIC'], url: 'https://www.cbic.gov.in/' },
  { name: ['UAE FCA', 'সংযুক্ত আরব আমিরাত FCA'], url: 'https://www.tax.gov.ae/en/' }
];
