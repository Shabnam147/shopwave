# ShopWave — Website

A static, responsive website for ShopWave (affordable IT & digital solutions), built with plain HTML, CSS, and JavaScript — no frameworks or build step required.

## Structure

```
/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Running locally

No build step is needed. Either:

- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server` from this directory, then visit `http://localhost:8000`.

## Deploying

This is a static site, so it can be deployed to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, a plain VPS with nginx, etc.) by uploading the folder as-is.

## Things to update before launch

- **Contact details**: the WhatsApp number and email address in the Contact section are clearly marked placeholders. Replace `hello@shopwave.store` and the WhatsApp link in `index.html` (search for `whatsappLink` and `emailLink`) once real details are available.
- **Contact form backend**: the form currently validates input in the browser but has no backend to actually send submissions anywhere. Connect it to a form service (e.g. Formspree, a serverless function, or your own endpoint) before relying on it.
- **Portfolio**: the five portfolio cards are explicitly labeled "Demo Project" or "Concept Project." Replace them with real client work (and remove the labels) as projects are completed.
- **Social links**: the footer social icons are placeholders with no linked URLs. Add real profile links once accounts exist.
- **Favicon**: a simple inline SVG favicon is used as a placeholder. Replace with a proper icon set if desired.

## Notes

- Fonts (Space Grotesk, Inter, JetBrains Mono) are loaded from Google Fonts via CDN — an internet connection is required for them to load; the site falls back to system fonts otherwise.
- The hero's 3D centerpiece uses [Three.js](https://threejs.org), loaded via CDN import map (`js/hero3d.js`) — the only external library in the project. Everything else is vanilla JS.

## 3D / motion features

- **Hero centerpiece**: a small WebGL "network" scene (`js/hero3d.js`) — a core node connected to four satellite nodes representing Web, Python, IT, and Cloud — with idle rotation, mouse parallax, and a scroll-linked dolly effect confined to the hero.
- **Floating terminal panel**: the terminal window in the hero tilts gently toward the cursor, like it's floating in front of the 3D scene.
- **3D tilt-on-hover cards**: service, package, "who we help," "why ShopWave," and portfolio cards tilt toward the cursor with a soft light-glare overlay (`.tilt-card` in `css/style.css`, applied via `js/script.js`).
- **Depth parallax blobs**: soft background glow layers behind the Services, Packages, and Portfolio sections drift at different scroll speeds for a layered feel.
- **Accessibility**: everything above is skipped when the browser reports `prefers-reduced-motion: reduce` — the site falls back to a static, fully functional layout with no motion.
- If the Three.js CDN can't load (e.g. offline), the hero simply shows the terminal panel without the WebGL background — nothing else on the site depends on it.
