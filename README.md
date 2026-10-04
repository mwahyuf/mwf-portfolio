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
- The contact form opens the visitor's email app (no server, nothing stored). For direct delivery you need a backend; see the security checklist.
- Language and theme are saved in `localStorage`. Both languages share the same URL, so search engines index the English version.
- Google Fonts is the only third-party request; self-host Inter if you want to remove it.

## Adding a project
Copy any `project-*.html`, edit its sections (Overview, Challenge, Role, Approach, Implementation, Tools, Result, Notes), add a card to `work.html` (and optionally `index.html`), add the URL to `sitemap.xml`, and add Indonesian text to `i18n/id.js`.
