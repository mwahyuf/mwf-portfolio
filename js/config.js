window.Site = window.Site || {};
// Site-wide settings. If you change the email, also update the visible links in the HTML (contact.html, footer).
Site.CONFIG = {
  name: 'Muhammad Wahyu Fadli',
  email: 'mwahyuf94@gmail.com',
  // Form endpoint (see README, Contact form setup). Replace the placeholder with your provider's URL,
  // e.g. 'https://formspree.io/f/xxxxxxxx'. If you use another provider, also update connect-src in the CSP.
  formEndpoint: 'YOUR_FORM_ENDPOINT_HERE',
  formTimeoutMs: 15000,
  storage: { lang: 'lang', theme: 'theme' },
};
