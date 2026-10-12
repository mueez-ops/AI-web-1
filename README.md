# Ali Ibn-e-Abitalib Islamic Institution — website

A single, cinematic page in chapters. It's plain HTML, CSS and JavaScript with no build step. See `docs/site.md` for how it works.

| Path | What it is |
|---|---|
| `index.html` | The page |
| `assets/css/main.css` | All styles (colours and fonts at the top) |
| `assets/js/app.js` | Loader, smooth scroll, cursor, the chapters, the WhatsApp composer |
| `assets/js/veil.js` | The WebGL "lamp in the night" over the hero video |
| `assets/js/config.js` | WhatsApp number and optional YouTube link |
| `assets/js/vendor/` | GSAP, ScrollTrigger and Lenis (kept in the repo, no CDN needed) |
| `assets/brand/` | The logo (original upload and cut-out versions), favicons, sharing image |
| `media/web/` | Web versions of the photo and videos |
| `media/originals/` | The untouched camera files (local only, not committed) |
| `tools/make-web-media.sh` | Rebuilds `media/web/` from the originals |

## View it locally
Run `python3 -m http.server` in this folder, then open http://localhost:8000.
