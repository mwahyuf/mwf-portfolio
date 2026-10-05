/* ============================================
   CONTACT FORM
   Handles validation, submission, loading,
   success, and error states.
   Submits JSON to the endpoint in js/config.js.
   No mailto is used for the Send Inquiry action.
   ============================================ */
(function () {
'use strict';
const { CONFIG } = Site;
const T = (key) => Site.T(key);

const LIMITS = { name: 100, email: 254, message: 2000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initContactForm() {
  const form = document.getElementById('f');
  if (!form) return;

  const sendButton = document.getElementById('send');
  const successNotice = document.getElementById('status-ok');
  const errorNotice = document.getElementById('status-err');
  const field = (id) => document.getElementById(id);
  const value = (id) => field(id).value.trim();
  let sending = false; // blocks duplicate submissions while a request is in flight

  /* ---------- field errors ---------- */

  // Shows (or clears) the error under one field. Returns true when the field is valid.
  function setFieldError(id, messageKey) {
    const input = field(id);
    const error = field(`${id}-e`);
    if (!messageKey) {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
      error.textContent = '';
      delete error.dataset.k;
      return true;
    }
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${id}-e`);
    error.dataset.k = messageKey;
    error.textContent = T('Error: ') + T(messageKey); // textContent only, never innerHTML
    return false;
  }

  function validate() {
    const name = value('n');
    const email = value('e');
    const message = value('d');
    const results = [
      setFieldError('n', name && name.length <= LIMITS.name ? '' : 'Please enter your name.'),
      setFieldError('e', EMAIL_PATTERN.test(email) && email.length <= LIMITS.email ? '' : 'Please enter a valid email address.'),
      setFieldError('t', value('t') ? '' : 'Please select a service or project type.'),
      setFieldError('d', message && message.length <= LIMITS.message ? '' : 'Please tell me a little about your project.'),
    ];
    return !results.includes(false);
  }

  /* ---------- notices and button state ---------- */

  function hideNotices() {
    successNotice.hidden = true;
    errorNotice.hidden = true;
  }

  function showNotice(notice) {
    hideNotices();
    notice.hidden = false;
    notice.focus(); // announces the result to keyboard and screen-reader users
  }

  function setSending(isSending) {
    sending = isSending;
    sendButton.disabled = isSending;
    sendButton.querySelector('.lbl').hidden = isSending;
    sendButton.querySelector('.lbl-busy').hidden = !isSending;
    form.setAttribute('aria-busy', String(isSending));
  }

  /* ---------- submission ---------- */

  function isEndpointConfigured() {
    return /^https:\/\//.test(CONFIG.formEndpoint) && !CONFIG.formEndpoint.includes('YOUR_');
  }

  // Resolves only when the form service confirms success; otherwise throws.
  async function sendInquiry(payload) {
    if (!isEndpointConfigured()) throw new Error('Form endpoint is not configured (see js/config.js).');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.formTimeoutMs);
    try {
      const response = await fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Form service responded with status ${response.status}.`);
    } finally {
      clearTimeout(timer);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    hideNotices();
    if (!validate()) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    // Honeypot: real visitors never see this field. Bots that fill it get a quiet, unsent "success".
    if (field('hp').value) {
      form.reset();
      showNotice(successNotice);
      return;
    }
    const type = value('t');
    setSending(true);
    try {
      await sendInquiry({
        name: value('n'),
        email: value('e'),
        project_type: type,
        message: value('d'),
        language: Site.getLang(),
        _subject: `Portfolio inquiry: ${type}`,
        _gotcha: '',
      });
      form.reset();
      ['n', 'e', 't', 'd'].forEach((id) => setFieldError(id, ''));
      showNotice(successNotice);
    } catch (error) {
      console.warn('[contact-form]', error.message); // developer-only detail; visitors see a friendly message
      showNotice(errorNotice);
    } finally {
      setSending(false);
    }
  }

  // Re-render visible field errors when the language changes (notices are translated with the page).
  document.addEventListener('langchange', () => {
    form.querySelectorAll('.err[data-k]').forEach((error) => {
      error.textContent = T('Error: ') + T(error.dataset.k);
    });
  });

  form.addEventListener('submit', handleSubmit);
}

Site.initContactForm = initContactForm;
})();
