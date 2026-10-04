// Light/dark toggle. No stored choice means the OS preference applies (see the CSS media query).
(function () {
'use strict';
const { CONFIG } = Site;
const T = (key) => Site.T(key);
const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');
const effective = () => root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');

function initTheme() {
  const btn = document.getElementById('thm');
  if (!btn) return;
  const update = () => {
    const e = effective();
    const label = T(e === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    root.setAttribute('data-eff', e);
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };
  btn.addEventListener('click', () => {
    const next = effective() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(CONFIG.storage.theme, next); } catch { /* storage unavailable */ }
    update();
  });
  media.addEventListener('change', update);
  document.addEventListener('langchange', update);
  update();
}
Site.initTheme = initTheme;
})();
