# Boost and Gears: interactive engine guide

A static website in English and Arabic (with a language switch) explaining turbochargers, superchargers, intercoolers, gearboxes, hybrids and carmaker technologies.

It needs no server code, database or build step. Any static web host can serve it.

## Files

```
index.html       the page
css/style.css    all styles
js/app.js        animations, calculators, language switch, data
favicon.svg      browser tab icon
```

## Put it online (pick one)

**Netlify Drop (fastest, free)**
1. Go to https://app.netlify.com/drop and sign in.
2. Drag the whole `website` folder onto the page.
3. You get a live link such as `your-name.netlify.app`. Rename it under Site settings.

**GitHub Pages (free)**
1. Create a new public repository and upload the contents of this folder (keep `index.html` at the top level).
2. Open Settings, then Pages. Under Source pick `main` branch and `/ (root)`, then Save.
3. After a minute the site is at `https://<your-username>.github.io/<repo-name>/`.

**Cloudflare Pages (free)**
1. In the Cloudflare dashboard open Workers and Pages, then Create, then Pages, then Upload assets.
2. Upload this folder and deploy. You get a `*.pages.dev` link.

**Your own hosting or company server**
Upload the folder contents to the web root (for example `public_html`). No configuration needed.

## Preview on your computer

Double-click `index.html`, or run a tiny local server from this folder:

```
python3 -m http.server 8000
```

then open http://localhost:8000.

## Editing

- Carmaker technologies: the `TECH` list in `js/app.js`. Each entry has `en` and `ar` text.
- Glossary and quiz: the `GL` and `QZ` lists in `js/app.js`.
- Fixed page text is in `index.html`, written twice: inside `class="en"` and `class="ar"` elements.

Simulated numbers (boost, lag, temperatures) are simplified models for learning.
