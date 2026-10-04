// Certificate viewer. Each trigger names its <dialog> in data-d. Without JS the triggers are plain links to the image files.
(function () {
'use strict';

function initCertificates() {
  document.querySelectorAll('[data-d]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.d);
    if (!dialog || !dialog.showModal) return;
    trigger.addEventListener('click', (ev) => { ev.preventDefault(); dialog.showModal(); });
    dialog.addEventListener('click', (ev) => { if (ev.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => trigger.focus());
  });
}
Site.initCertificates = initCertificates;
})();
