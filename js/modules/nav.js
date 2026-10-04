// Mobile menu, compact sticky header on scroll, and the scroll-progress bar (pages with data-progress).
(function () {
'use strict';

function initNav() {
  const header = document.querySelector('header');
  const menu = document.querySelector('.menu');
  const list = document.getElementById('nl');
  const progress = document.getElementById('prog');
  const closeMenu = () => { list.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); };
  if (menu && list) {
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(list.classList.toggle('open'))));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && list.classList.contains('open')) { closeMenu(); menu.focus(); } });
  }
  const wantsProgress = 'progress' in document.body.dataset;
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sm', scrollY > 24);
    if (progress) {
      progress.classList.toggle('on', wantsProgress && max > 200);
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    }
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}
Site.initNav = initNav;
})();
