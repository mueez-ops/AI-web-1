# How the AIAT site is built

The site is a single, chapter-based page in the style of studio sites like Lusion, Igloo and Lando Norris. It's built from plain HTML, CSS and JavaScript, with three small libraries saved in the repo (`assets/js/vendor/`):
- GSAP and ScrollTrigger, for scroll-linked motion;
- Lenis, for smooth scrolling.

There is no build step.

## Chapters

| # | Section | What happens |
|---|---|---|
| — | **Loader** | A counter from 000 to 100 tied to real loading (fonts, the hero poster, the hero video). The name decodes. The loader lifts like a curtain. |
| 00 | **Hero** | The minbar-wall video (IMG_3186) plays at full quality under a WebGL veil of dark smoke (`assets/js/veil.js`). The cursor or a finger is a lamp that lifts the darkness; with no input, a soft lamp drifts by itself. The name "ALI IBN-E-ABITALIB" is sized to fill the full width. |
| 01 | **The institute** | Bone background. The statement lights up word by word as you scroll. Below it, four facts. |
| 02 | **Classes** | Pinned; four large cards move sideways as you scroll (desktop). On phones they stack. Each card links to WhatsApp with a ready message. A fifth card is the empty place for a class photo. |
| 03 | **The ten nights** | Pinned. "THE FIRST / TEN NIGHTS" splits apart as a small window opens to full screen on the IMG_3165 courtyard video. Three lines of text and ten ticks follow. |
| — | **Reel** | A sideways strip, draggable with the mouse: the building at night (IMG_3172), the minbar wall (IMG_3184), the photo from above, the courtyard (IMG_3162). Each clip plays only while visible. |
| 04 | **The year** | Logo-teal background. Two giant bands of program names that speed up with scrolling, then the six programs. |
| 05 | **Winter camp** | Bone background, a full-width "JANUARY", and a round magnetic button to WhatsApp. |
| 06 | **Visit & ask** | "Assalamu alaikum." A message composer (subject and mode chips, optional name) opens WhatsApp with the message written. Also the big WhatsApp number, the location, a live Quetta clock, and the empty place for the building photo. |
| — | **Footer** | The logo on black, links, and a giant outlined "AIAT". |

**Throughout the page:**
- a custom cursor that shows labels such as Ask, Drag and Send;
- magnetic buttons;
- monospace labels that decode as they appear;
- a static film grain;
- a top bar that adapts to the colour of the section under it;
- a full-screen menu.

## Rules the code follows
- **All content is real HTML.** Without JavaScript the page is complete: no loader, static layout, poster images.
- **Reduced motion:** no smooth scroll, no pinning, no veil, no cursor and no video. Everything is visible at once.
- **Safety net:** if the script fails, the loader lifts itself after 7 seconds (CSS fallback).
- **Video:**
  - Each clip picks the best version the browser can play (AV1 HDR → HEVC HDR → H.264), and moves on if one fails.
  - 4K is used only on large, sharp screens.
  - No video loads with Data Saver or reduced motion.
  - Clips play only while visible.
- **The veil:** renders at half resolution, since it's soft smoke; the video underneath is never resampled.

## Palette and type
- **Colours (all from the logo):** blue-green `#113A42` (dark sections use the logo's darkest teal `#0D3035`), white `#FFFFFF`, gold `#BD9862` (deeper `#9A7640` for large text on white). The logo always sits on black.
- **Type:**
  - Archivo, condensed via its width axis, for display;
  - Geist Mono for interface labels;
  - Instrument Serif italic for the voice lines.

## Media
`tools/make-web-media.sh` builds `media/web/` from the untouched originals in `media/originals/`. The 4K HEVC files are the original camera stream, copied without re-encoding; the other versions are checked with SSIM against the original.
