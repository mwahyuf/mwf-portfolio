// English in the HTML is the source text. Indonesian is applied by looking up each text node in i18n/id.js.
(function () {
'use strict';
const { dictionary, CONFIG } = Site;
const root = document.documentElement;
let lang = root.getAttribute('data-lang') || 'en';
const textOriginals = new WeakMap();
const attrOriginals = new WeakMap();
const ATTRS = ['alt', 'aria-label', 'content'];

const getLang = () => lang;
const T = (key) => (lang === 'id' && dictionary[key]) || key;
const normalize = (s) => s.trim().replace(/\s+/g, ' ');

function translateText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    let o = textOriginals.get(node);
    if (!o) {
      const key = normalize(node.nodeValue);
      if (!key || !dictionary[key]) continue;
      o = { raw: node.nodeValue, key, pre: node.nodeValue.match(/^\s*/)[0], post: node.nodeValue.match(/\s*$/)[0] };
      textOriginals.set(node, o);
    }
    node.nodeValue = lang === 'id' ? o.pre + dictionary[o.key] + o.post : o.raw;
  }
}

function translateAttributes() {
  document.querySelectorAll('[alt],[aria-label]:not(#thm),meta[name=description]').forEach((el) => {
    const saved = attrOriginals.get(el) || {};
    attrOriginals.set(el, saved);
    ATTRS.forEach((a) => {
      if (!el.hasAttribute(a) || (a === 'content' && !el.matches('meta'))) return;
      if (!(a in saved)) saved[a] = el.getAttribute(a);
      if (dictionary[saved[a]]) el.setAttribute(a, lang === 'id' ? dictionary[saved[a]] : saved[a]);
    });
  });
}

function apply() {
  root.lang = lang;
  root.setAttribute('data-lang', lang);
  translateText();
  translateAttributes();
  const t = document.body.dataset.title;
  if (t) document.title = `${T(t)} \u2014 ${CONFIG.name}`;
  document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.l === lang)));
  const group = document.querySelector('.lang');
  if (group) group.setAttribute('aria-label', T('Change language'));
  root.classList.remove('lp');
  document.dispatchEvent(new CustomEvent('langchange'));
}

function initI18n() {
  document.querySelectorAll('.lang button').forEach((b) =>
    b.addEventListener('click', () => {
      lang = b.dataset.l;
      try { localStorage.setItem(CONFIG.storage.lang, lang); } catch { /* storage unavailable */ }
      apply();
    }));
  apply();
}
Site.T = T; Site.getLang = getLang; Site.initI18n = initI18n;
})();
