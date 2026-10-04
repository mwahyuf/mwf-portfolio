/* Classic (non-module) script that runs before first paint: applies the saved theme and language to avoid a flash. */
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  try { var t = localStorage.getItem('theme'); if (t === 'dark' || t === 'light') d.setAttribute('data-theme', t); } catch (e) {}
  var l = '';
  try { l = localStorage.getItem('lang') || ''; } catch (e) {}
  if (l !== 'id' && l !== 'en') l = (navigator.language || '').slice(0, 2) === 'id' ? 'id' : 'en';
  d.lang = l; d.setAttribute('data-lang', l);
  if (l === 'id') { d.classList.add('lp'); setTimeout(function () { d.classList.remove('lp'); }, 1500); }
})();
