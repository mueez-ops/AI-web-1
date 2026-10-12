# AIAT website: Ali Ibn-e-Abitalib Islamic Institution, Quetta

A single-page site in plain HTML, CSS and JavaScript. There are no frameworks and no build step.

| Path | What it is |
|---|---|
| `index.html` | The page: hero video, classes, Muharram, the year, winter camp, visit and ask |
| `assets/css/site.css` | All styles. Colours and sizes are tokens at the top. |
| `assets/js/site.js` | Hero video loop, scroll zoom, the WhatsApp ask form |
| `assets/js/config.js` | WhatsApp number and optional links (YouTube, map) |
| `assets/brand/` | The logo (original upload), its cut-out versions, favicons, sharing image |
| `media/` | Photos and videos. **Git-ignored**, never committed. |
| `tools/make-web-media.sh` | Rebuilds `media/web/` from the untouched originals in `media/originals/` |
| `docs/intake.md` | Intake report, asset inventory, media quality policy, approved direction |
| `TODO.md` | What is still needed |

## To view it locally
1. Put the originals in `media/originals/` and run `tools/make-web-media.sh`.
2. Run `python3 -m http.server`.
3. Open http://localhost:8000.

Without the media, the page still works: the photo areas stay empty and the text and buttons all work.
