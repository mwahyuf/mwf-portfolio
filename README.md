# Portfolio website (static, vanilla HTML/CSS/JS)

No frameworks, no build step, no dependencies. You can open `index.html` directly from the folder, or serve it with any static server.

    python3 -m http.server 8000   # then visit http://localhost:8000

## Structure
| Path | Purpose |
|---|---|
| `index.html`, `work.html`, `services.html`, `about.html`, `contact.html`, `project-*.html` | One real page each; `work.html` is the project index and each `project-*.html` is a case study (works without JavaScript, good for SEO). English is the source text. |
| `css/styles.css` | Design tokens (colors, light/dark) at the top, then components, utilities, no-JS fallbacks. |
| `js/boot.js` | Tiny classic script that applies saved theme and language before first paint. |
| `js/config.js` | Site settings (email, storage keys). |
| `js/main.js` + `js/modules/` | `i18n`, `theme`, `nav`, `reveal`, `contact-form`, `certificates`. Each is an independent plain script sharing one `Site` object (no ES modules, so it also works opened from disk). Load order is listed in each page. |
| `i18n/id.js` | Indonesian dictionary. The English text in the HTML is the key. |
| `assets/` | Portrait, certificate images, favicon. |
| `_headers`, `robots.txt`, `sitemap.xml` | Hosting and SEO files. |

## Common edits
- **Change text:** edit the HTML, then update the matching key in `i18n/id.js`, otherwise that sentence stays English in Indonesian mode.
- **Contact details:** `js/config.js` (email) plus the visible links in `contact.html` and the footer of every page. The CV link is the `View CV` link in `about.html`.
- **Add a page:** copy a page, add it to the nav in every page and to `sitemap.xml`.

## Before launch
1. Replace `https://www.example.com` in the HTML (canonical, Open Graph, JSON-LD), `robots.txt` and `sitemap.xml`:
   `grep -rl example.com . | xargs sed -i 's#https://www.example.com#https://YOUR-DOMAIN#g'`
2. Deploy to a host that serves HTTPS and applies `_headers` (Netlify, Cloudflare Pages). On GitHub Pages custom headers are not supported, so only the meta CSP applies.
3. Check the CV link target is the anonymized CV and sharing is Viewer only.
4. Test: both languages, both themes, mobile, keyboard-only, with JavaScript disabled, and the contact form.

## Notes
- Strict CSP: scripts and styles come only from this site (plus Google Fonts). Do not add inline `<script>`, `style=""` attributes or inline event handlers; use the files and utility classes instead.
- The contact form posts JSON to a form service (see below). The direct email links are only an optional fallback.
- Language and theme are saved in `localStorage`. Both languages share the same URL, so search engines index the English version.
- Google Fonts is the only third-party request; self-host Inter if you want to remove it.

## Adding a project
Copy any `project-*.html`, edit its sections (Overview, Challenge, Role, Approach, Implementation, Tools, Result, Notes), add a card to `work.html` (and optionally `index.html`), add the URL to `sitemap.xml`, and add Indonesian text to `i18n/id.js`.

## Contact form setup (required before launch)
The form submits to a third-party form endpoint, so it works on GitHub Pages without a backend. No endpoint is configured yet: until you set one, "Send Inquiry" shows the friendly error message and never claims success.

Recommended provider: **Formspree** (static-site friendly, JSON endpoint, provider-side spam filtering, honeypot support). Alternatives such as Web3Forms or Getform also work, but may need extra payload fields; check their docs.

1. Create a form at the provider and copy its endpoint URL (for Formspree: `https://formspree.io/f/xxxxxxxx`).
2. Paste it into `formEndpoint` in `js/config.js`.
3. If the provider is not `formspree.io`, change `connect-src` in the CSP meta tag of every HTML page and in `_headers`.
4. In the provider dashboard, set the notification email, and restrict allowed domains if the provider offers it.
5. Test: success message, error message (e.g. offline), validation, English and Indonesian.

Notes:
- The endpoint URL is public by design (it is visible in the page). Never put a secret API key in the JavaScript.
- Spam: the hidden honeypot field (`_gotcha`) plus the provider's filtering. If spam becomes a problem, add the provider's CAPTCHA or Cloudflare Turnstile; this needs the script host added to the CSP.
- Privacy: the provider stores submissions according to its own policy. The note under the form says the inquiry goes through a third-party service. Add a link to the provider's privacy policy if you want to be more explicit.
- Submitted values are only ever shown with `textContent`, never `innerHTML`.
