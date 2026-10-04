// Contact form: validates in the browser, then opens the visitor's email app with the message filled in.
// Nothing is sent to or stored on a server. Without JS the form falls back to its mailto action.
(function () {
'use strict';
const { CONFIG } = Site;
const T = (key) => Site.T(key);
const MAX = { n: 100, e: 254, d: 2000 };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initContactForm() {
  const form = document.getElementById('f');
  if (!form) return;
  const status = document.getElementById('status');
  const val = (id) => document.getElementById(id).value.trim();

  // Show (or clear) the error for one field. Returns true when the field is valid.
  const check = (id, message) => {
    const field = document.getElementById(id);
    const err = document.getElementById(`${id}-e`);
    if (!message) {
      field.removeAttribute('aria-invalid'); field.removeAttribute('aria-describedby');
      err.textContent = ''; delete err.dataset.k;
      return true;
    }
    field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', `${id}-e`);
    err.dataset.k = message; err.textContent = T('Error: ') + T(message);
    return false;
  };
  document.addEventListener('langchange', () => {
    form.querySelectorAll('.err[data-k]').forEach((e) => { e.textContent = T('Error: ') + T(e.dataset.k); });
    if (status.dataset.k) status.textContent = T(status.dataset.k);
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    status.textContent = ''; delete status.dataset.k;
    const [n, e, t, d] = [val('n'), val('e'), val('t'), val('d')];
    const results = [
      check('n', n.length > 1 && n.length <= MAX.n ? '' : 'Please enter your name.'),
      check('e', EMAIL.test(e) && e.length <= MAX.e ? '' : 'Please enter a valid email address.'),
      check('t', t ? '' : 'Please choose a project type.'),
      check('d', d.length >= 20 && d.length <= MAX.d ? '' : 'Please describe your project in at least 20 characters.'),
    ];
    if (results.includes(false)) { form.querySelector('[aria-invalid=true]')?.focus(); return; }
    if (document.getElementById('hp').value) return; // honeypot: bots fill hidden fields
    const body = `${T('Name: ')}${n}\nEmail: ${e}\n${T('Type: ')}${t}\n\n${d}`;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(T('Project inquiry: ') + t)}&body=${encodeURIComponent(body)}`;
    status.dataset.k = "Your email app should open with the inquiry filled in. If it doesn't, write to the address shown.";
    status.textContent = T(status.dataset.k);
  });
}
Site.initContactForm = initContactForm;
})();
