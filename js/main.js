// Entry point: each feature is a small script that fails safely if its markup is absent.
// Plain scripts (not ES modules) so the site also works when index.html is opened directly from disk.
(function () {
  Site.initI18n();
  Site.initTheme();
  Site.initNav();
  Site.initReveal();
  Site.initContactForm();
  Site.initCertificates();
})();
