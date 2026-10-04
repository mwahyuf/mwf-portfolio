// Scroll reveal. Skipped entirely for reduced motion, so content is never hidden.
(function () {
'use strict';

function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('mo');
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    io.unobserve(el);
    setTimeout(() => { el.style.transitionDelay = ''; }, 1100);
  }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('main>section:not(:first-child) :is(.wrap>.mono,.wrap>h2,.wrap>.lead,.card,.proc li,details,dl,.row,.ctc,.portrait)')
    .forEach((el) => el.classList.add('rv'));
  document.querySelectorAll('.rv').forEach((el) => {
    let n = 0;
    for (let p = el.previousElementSibling; p && n < 4; p = p.previousElementSibling) if (p.classList.contains('rv')) n++;
    el.style.transitionDelay = `${n * 80}ms`;
    io.observe(el);
  });
}
Site.initReveal = initReveal;
})();
