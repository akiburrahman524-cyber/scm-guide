/* Bilingual UI state: English + Bangla. t(en, bn) picks by current language. */
'use strict';
let LANG = 'en';
const t = (en, bn) => (LANG === 'bn' && bn ? bn : en);
const langListeners = [];
const onLangChange = (fn) => langListeners.push(fn);
async function initLang() {
  LANG = await store.get('lang', 'en');
  document.documentElement.lang = LANG;
}
async function setLang(l) {
  LANG = l; document.documentElement.lang = l;
  await store.set('lang', l);
  langListeners.forEach((f) => { try { f(l); } catch (e) { console.error(e); } });
}
/* theme */
let THEME = 'light';
const themeListeners = [];
const onThemeChange = (fn) => themeListeners.push(fn);
async function initTheme() {
  THEME = await store.get('theme', 'light');
  document.documentElement.dataset.theme = THEME;
}
async function setTheme(th) {
  THEME = th; document.documentElement.dataset.theme = th;
  await store.set('theme', th);
  themeListeners.forEach((f) => { try { f(th); } catch (e) { } });
}
const DISCLAIMER = () => t(
  'Estimates and reference information only - not legal, tax or customs advice. Duty rates and rules change: always confirm with the destination customs authority or a licensed broker before you ship.',
  'শুধুমাত্র আনুমানিক ও রেফারেন্স তথ্য - আইনি, কর বা কাস্টমস পরামর্শ নয়। শুল্ক হার ও নিয়ম বদলায়: চালানের আগে গন্তব্য দেশের কাস্টমস কর্তৃপক্ষ বা লাইসেন্সপ্রাপ্ত ব্রোকারের কাছে নিশ্চিত করুন।'
);
