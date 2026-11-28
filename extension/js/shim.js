/* SCM Guide Toolkit - shared helpers. No network, no tracking. Works as an extension page or plain web page. */
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined && text !== null) e.textContent = text; return e; };
const num = (v) => { const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) ? n : 0; };
const money = (n, d = 2) => Number.isFinite(n) ? n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) : '-';
const money0 = (n) => money(n, 0);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* storage: chrome.storage.local when available, else localStorage */
const store = {
  async get(k, dflt) {
    try {
      if (window.chrome && chrome.storage && chrome.storage.local) {
        const o = await chrome.storage.local.get(k); return o[k] === undefined ? dflt : o[k];
      }
    } catch (e) { }
    try { const v = localStorage.getItem('scmt:' + k); return v === null ? dflt : JSON.parse(v); } catch (e) { return dflt; }
  },
  async set(k, v) {
    try {
      if (window.chrome && chrome.storage && chrome.storage.local) { await chrome.storage.local.set({ [k]: v }); return; }
    } catch (e) { }
    try { localStorage.setItem('scmt:' + k, JSON.stringify(v)); } catch (e) { }
  }
};

function downloadText(filename, text, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain' }));
  a.download = filename; document.body.append(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}

/* ---------- SVG icon set (stroke icons, 24x24) ---------- */
const ICONS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="9" y1="11" x2="9.01" y2="11"/><line x1="12" y1="11" x2="12.01" y2="11"/><line x1="15" y1="11" x2="15.01" y2="11"/><line x1="9" y1="15" x2="9.01" y2="15"/><line x1="12" y1="15" x2="12.01" y2="15"/><line x1="15" y1="15" x2="15.01" y2="15"/><line x1="9" y1="19" x2="9.01" y2="19"/><line x1="12" y1="19" x2="12.01" y2="19"/><line x1="15" y1="19" x2="15.01" y2="19"/>',
  barcode: '<path d="M3 5v14M7 5v14M11 5v14M14 5v10M17 5v14M21 5v10"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  ship: '<path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1"/><path d="M4 18 3 9h18l-1 9"/><path d="M7 9V5h6v4"/><path d="M10 5V3h1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sigma: '<path d="M18 7V5H6l6 7-6 7h12v-2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13.5 13.5 0 0 1 0 18 13.5 13.5 0 0 1 0-18Z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  scale: '<path d="M12 3v18"/><path d="M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7Z"/><path d="M19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7Z"/><path d="M5 7h14"/><path d="M8 21h8"/>',
  truck: '<path d="M1 7h13v10H1z"/><path d="M14 10h4l4 4v3h-8z"/><circle cx="6" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>',
  anchor: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="12" y1="7" x2="12.01" y2="7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  globe2: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 5.6 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.6-4-9s1.5-6.4 4-9Z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  percent: '<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>'
};
const icon = (name, size) => `<svg class="ic" width="${size || 20}" height="${size || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.box}</svg>`;

/* DOM-built inline SVG (avoids innerHTML) */
const iconEl = (name, size) => {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'ic'); svg.setAttribute('width', size || 20); svg.setAttribute('height', size || 20);
  svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const doc = new DOMParser().parseFromString('<svg xmlns="' + ns + '">' + (ICONS[name] || ICONS.box) + '</svg>', 'image/svg+xml');
  [...doc.documentElement.childNodes].forEach((n) => svg.appendChild(document.importNode(n, true)));
  return svg;
};
