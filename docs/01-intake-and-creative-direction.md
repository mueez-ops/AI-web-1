# 01 — Intake, Asset Inventory & Creative Direction

Status: **Gate 1 not passed. Waiting on owner facts. Creative direction is proposed and needs approval.**
Prepared: 2026-10-11

---

## 1. Execution mode

**Discovery and creative proposal (Gates 1–2). No site code yet.**

The repository was empty. No `CLIENT-VARIABLES.txt`, `BUSINESS-INFO.txt`, `ASSET-CHECKLIST.txt`, logo, or text content was supplied. The only inputs were one photo and two short video clips. Building pages now would mean inventing a name, a location, a schedule, and contact details, so implementation waits until the owner confirms the facts.

Templates for the missing files are in `/intake`, pre-filled with what the media actually shows.

---

## 2. What this is and the primary goal

**This is not a commercial business.** The media shows a religious community venue: a Shia imambargah or markaz hosting a large night-time Muharram majlis in an open courtyard. The scene includes red alams, attendees dressed in mourning black, a speaker on a wooden minbar, and banners in Arabic.

The blueprint's "commercial promise" therefore becomes an **institutional promise**: *you are welcome here, this is when we gather, and this is how to get here.*

| Item | Status |
|---|---|
| Name | **UNKNOWN.** No name is legible in any asset. |
| Category | Religious / community venue (imambargah, markaz, or similar). Type **NEEDS OWNER CONFIRMATION.** |
| Location | **UNKNOWN.** Visual cues and the +05:00 timestamp offset are consistent with Pakistan. **Do not publish anything inferred.** |
| Primary audience (proposed) | Local community members, visiting mourners, and families looking for majlis times and directions. |
| Primary action (proposed) | **View majlis schedule.** |
| Secondary actions (proposed) | Get directions; contact (phone or WhatsApp); support/donate (**only with verified details**). |

The primary action is "View majlis schedule" because a visitor's real question is *when* and *where*. Directions is the natural next step from the schedule, so it is secondary, not a competing action.

---

## 3. Fact & Conflict Report

### Verified from the media (observed, not inferred)

- The venue has a buff/sand brick facade with cream stone trim, pointed Persian-style arched windows, a crenellated parapet, and a central arched doorway.
- The inscription above the door reads **ادخلوها بسلام آمنین** ("Enter it in peace, secure", Qur'an 15:46). This is a verse, not the venue's name.
- The courtyard is floodlit at night, with red patterned floor carpets, red alams on tall poles, and a hedge and green planting along the boundary.
- Banners include **نصر من اللہ و فتح قریب**, a large red backdrop reading **السلام علیک یا اباعبدالله**, and a red flag that appears to read **هیهات منا الذلة**. The exact text **NEEDS CONFIRMATION** before any of it is reproduced on the site.
- A cleric or speaker is on a wooden minbar. There is a large seated crowd.
- A neighbouring building on the right of the photo has third-party shop signage.

### Conflicts and warnings

| # | Issue | Handling |
|---|---|---|
| C1 | The clips' embedded capture time is **2026-06-25 10:44 and 11:01 (+05:00)**, which is morning, but both scenes are clearly at night. | Do not use metadata for any public date. Ask the owner for the event date. |
| C2 | The clips are trimmed re-exports (file creation 2026-10-10 and 2026-10-11), so the original context is lost. | Ask for the original clips if longer footage exists. |
| C3 | The photo has no EXIF date or location. | Treat the event date as UNKNOWN. |
| C4 | The 25 June 2026 date would fall within Muharram 1448, which fits the scene, but this is circumstantial. | Do not publish it. Confirm with the owner. |

### Sensitivities (must be resolved before publishing any media)

1. **Identifiable people, including children.** Hundreds of faces are recognisable, many of them minors, at a religious gathering. Publishing them needs the owner's explicit consent policy.
2. **Security.** Large Shia gatherings in the region have historically been targets of attacks. The site must not reveal security arrangements, entry points, or live attendance. The owner decides what location detail is public.
3. **Sacred text.** Qur'anic verses and ziyarat text must be reproduced exactly, never cropped or distorted, never used as decorative texture, and never placed in the footer, beside a link, or anywhere it could be printed and discarded carelessly. Get a scholar's or owner's sign-off on every Arabic string.
4. **Tone.** This is a mourning context. No celebratory motion, confetti, glitter, sparkles, playful micro-interactions, or autoplaying audio.
5. **The speaker.** If the cleric is featured or named, that needs their consent and their correct title.

---

## 4. Asset Inventory

| Proposed final name | Source file | Specs | Content | Quality and risks | Class | Use |
|---|---|---|---|---|---|---|
| `courtyard-majlis-night` | `ae64111d-image.jpg` | 2576×1932, 4:3 landscape, JPEG, 2.0 MB, EXIF stripped | Facade with three arches and the inscribed door, red alams, floodlit seated crowd | Good exposure. The flags are motion-blurred, which reads as life rather than as a fault. The black sky (top ~30%) gives clean space for text. **Risks:** identifiable faces and minors in the foreground; third-party shop signs on the right. | **A + E** | Hero, poster, and Open Graph image. A portrait crop centred on the door and the right-hand alam serves mobile. |
| `courtyard-pan-minbar` | `c06ddd7d-IMG_3165.mov` | 3840×2160, HEVC, **Dolby Vision 8.4 / HLG BT.2020**, 30 fps, **3.46 s**, 45.7 Mb/s, has audio | Slow pan from a red flag across the crowd to the minbar; the "نصر من اللہ" banner; a hedge in the right foreground | Steady and well composed. **Too short for a hero loop.** HDR must be tone-mapped to SDR or colours will wash out. Audio must be stripped. | **B** | Desktop ambient clip in the "Gathering" section, slowed to about 0.6×, muted, playing only while in view. |
| `courtyard-wide-backdrop` | `ca70d6bb-IMG_3162.mov` | 3840×2160, HEVC, DV 8.4 / HLG, 30 fps, **1.81 s**, 54.8 Mb/s, has audio | Wide view with the red "السلام علیک یا اباعبدالله" backdrop and the minbar | Very short, handheld, slight motion blur. | **C / F** | Extract one or two stills for proof and detail. Not usable as video. |

**Missing assets (Missing Asset Plan)**

| Needed | Why | Priority |
|---|---|---|
| Name and logo or emblem, if one exists | Identity, header, and favicon | Critical |
| Daytime exterior and street approach | Helps first-time visitors recognise the building; works in a calm, non-Muharram state | High |
| Interior hall and minbar without a crowd | Year-round atmosphere with no consent risk | High |
| Detail shots: alam finials, carpets, calligraphy, brickwork | Texture and section support with no faces | Medium |
| Longer, steadier clip (8–15 s, locked-off, wide) | A proper ambient loop | Medium |
| Portrait-orientation photo | Purpose-built mobile hero | Medium |
| Written usage-rights and consent statement | Required before publishing any crowd media | Critical |

---

## 5. Missing critical inputs

These block Gate 1:

1. The official name in English, plus Urdu and Arabic spelling if used.
2. Address, or the exact level of location detail the owner wants public, and a map pin.
3. Programme: the Muharram ashra schedule and any weekly or monthly majalis, with times.
4. Contact: phone, WhatsApp, email, and social links (verified).
5. Languages and their order: Urdu, English, and possibly Pashto or Persian/Dari.
6. Arrangements for women and families: a separate entrance or enclosure? Livestream?
7. Activities beyond majalis, if any: juloos, niyaz, classes, nikah, funeral services, library. **Publish only what the owner confirms.**
8. Donations: whether to include them at all, and if so, the verified account or payment details and any registration status.
9. History or founding information, if the owner wants it.
10. Consent and media policy, approval owner, domain and hosting, and deployment authority.

---

## 6. Creative World (proposed)

### Creative World Statement

**"The courtyard at night."** A sand-brick threshold opens into a floodlit courtyard where a whole community sits shoulder to shoulder in black, under red alams that never stop moving. The site should feel like stepping through that door: quiet, dignified, and welcoming, with the weight of the gathering and none of its noise.

- **In the first three seconds:** the visitor recognises this place, sees that it is a place of remembrance, and sees when the next gathering is.
- **The first memorable moment:** the arched doorway, the building's own ogee arch, opens to reveal the courtyard.
- **What is unique to this venue:** the door inscription, the sand brick, the red alams on tall poles, the red floor carpets, and the floodlights against a black sky.
- **The feeling while scrolling:** stillness, belonging, solemnity, and clarity.
- **What adds value honestly:** real architecture, real scale, and careful typography, not borrowed luxury cues.
- **What stays calm:** the schedule, visiting information, and contact sections are plain, legible, and on a light sand background, so the night hero carries the emotion.

### Visual DNA

| Token | Value (provisional; to be sampled from final assets) | Source |
|---|---|---|
| `--night` | `#0D0E11` | The night sky (near-black, not pure black) |
| `--mourning` | `#17171A` | Black clothing |
| `--alam` | `#B0161E` | The red flags (sparingly: one accent per view) |
| `--carpet` | `#6B1C24` | The floor carpets (deep red, used for borders and rules) |
| `--brick` | `#D6BF8E` | The facade brick |
| `--stone` | `#EEE5D0` | The cream stone trim; light section background |
| `--flood` | `#FFF7E8` | The floodlights (text on night) |

- **Why the site uses dark at all:** the night and the mourning black are literally the venue's world during Muharram. Information sections switch to stone or brick backgrounds for readability.
- **Typography:**
  - Urdu: **Noto Nastaliq Urdu**, subset.
  - Arabic sacred text: **Amiri**, a naskh face for exact Qur'anic rendering.
  - Latin display: **Cormorant Garamond**, restrained and set at large sizes only.
  - Latin body: **Source Sans 3**.
  - Full RTL support for the Urdu version.
- **Material language:** brick coursing as a subtle horizontal rhythm in section dividers (CSS only), stone-trim borders of 1–2 px in `--brick`, and the ogee arch as the single recurring shape (image masks and the section-heading frame).
- **Photography treatment:** natural colour and no filters. Slight lift in the shadows. Crops favour the architecture, the flags, and the crowd as a mass, not individual faces.
- **Forbidden:** gold foil, glassmorphism, neon, particles, sparkles, rounded SaaS cards, bouncy easing, stock imagery, and AI-generated "mosque" imagery.

### Motion DNA

- **Character:** processional. Slow, steady, never playful.
- **Durations:** 600–1200 ms for reveals; 200 ms for UI feedback.
- **Easing:** `cubic-bezier(0.22, 0, 0, 1)` for entrances and linear for scrubbed motion. No overshoot.
- **Properties:** transform and opacity only.
- **Mobile:** reveals become simple fades and the hero mask is static.
- **Reduced motion:** all reveals and video are off; posters and final states are shown immediately.

### Transition DNA

- **The threshold:** the hero arch mask expands to full-bleed as the visitor scrolls. This happens once and is not repeated per section.
- **Sections:** content fades in with an 8 px rise, staggered at most 3 items deep.
- **Between the night and stone sections:** a straight edge with a thin `--carpet` rule. No wipes and no snapping.

### Effects DNA

- **Allowed:** the arch mask, a slow video loop in view only, a gentle opacity reveal of calligraphy (verified text only), and a highlight on the next majlis.
- **Forbidden:** scroll-jacking, snapping, parallax on faces, cursor effects, auto-rotating carousels, sound, and flashing lights.

---

## 7. Adaptive page architecture (proposed)

| # | Section | Purpose | Notes |
|---|---|---|---|
| 1 | **Hero: "The Threshold"** | Name, one line of welcome, primary CTA *View majlis schedule*, secondary *Directions* | Photo with an arch mask. Text sits on the black sky. Works fully without JS. |
| 2 | **Next gathering** | The next majlis (date, time, topic or speaker if provided) and an "Add to calendar" link | Data-driven. Shows a "schedule coming soon" state when no data exists. Never fake. |
| 3 | **Programme** | The full ashra or weekly schedule as a semantic table or list | The highlight on today or next is the signature #2. |
| 4 | **The Gathering** | Atmosphere: ambient clip plus 2–3 stills | Face-safe crops. Only after consent is confirmed. |
| 5 | **About** | Short verified history or purpose | Omit the section if the owner provides nothing. |
| 6 | **Visit** | Address (to the approved level), map link chooser, women's and family arrangements, what to expect | Calm stone section. |
| 7 | **Support** *(optional)* | Donation details | **Only with verified accounts.** Otherwise removed entirely. |
| 8 | **Contact / final CTA** | Phone, WhatsApp, social | Verified links only. |
| 9 | **Footer** | Name, address line, language switch | **No sacred text in the footer.** |

**Language:** a parallel Urdu (RTL) and English page set, with a visible switch and `hreflang`. Further languages if confirmed.

---

## 8. Interaction Map

| # | Location | Trigger | Behaviour | Purpose | Assets | Mobile | Reduced motion | Fallback | Performance | Pass/fail test |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero | Load, then scroll through the hero | The photo starts inside the door's ogee arch (CSS `clip-path`/mask). Scrolling widens it to full-bleed. The title and CTA are visible from frame 0. | A memorable, venue-specific entrance | Hero photo (AVIF/WebP/JPEG) | Static arch frame and portrait crop, no scrub | Full image, no mask animation | Plain full-bleed `<img>` | Scroll-driven animation (CSS `animation-timeline` with an IntersectionObserver fallback), transform/clip only, no layout shift | CTA is clickable within 1 s on throttled 4G. Hero text is readable with JS off. |
| 2 | Programme | Page load (date-aware) | Today's or the next majlis gets a `--alam` left rule and a "Next" label, not just colour. | Answers "when?" instantly | Schedule data file | Same | Same (no animation involved) | The full list renders without JS | <1 KB script | With a mocked date, the correct row is labelled. The label is readable by a screen reader. |
| 3 | The Gathering | Section enters the viewport | A muted, slowed 1280 px loop of the pan plays and pauses when offscreen. | Conveys scale and atmosphere | Tone-mapped H.264 + AV1, poster | **Poster only.** Optional tap to play a 720p clip. | Poster only | Poster `<img>` | ≤1.5 MB desktop clip; never downloaded on mobile or Save-Data | No video request on mobile or with reduced motion (Network tab check) |
| 4 | Calligraphy | Section enters the viewport | A verified ziyarat line fades from 0 to 1 opacity over 1.2 s. | Spiritual anchor; identity | Live text in Amiri, not an image | Same, shorter | Shown immediately | Static text | Font subset ≤40 KB | Text is selectable and correct; owner or scholar signs off |
| 5 | Visit / sticky bar | Tap "Directions" | A chooser opens: Google Maps, Apple Maps, copy address. An accessible dialog with focus trapping; Esc closes it. | Gets people to the door | Verified address | A sticky bottom bar (*Schedule · Directions*) appears after the hero | No animation | Plain links | No map embed until clicked (no third-party load) | Keyboard-only flow works; links open the correct pin |

---

## 9. Mobile strategy and performance risks

**Mobile**

- A purpose-made portrait crop of the hero (the door and the right-hand alam) with the title in the black sky.
- Schedule first after the hero; the sticky *Schedule · Directions* bar appears after the hero.
- No video download by default. All tap targets are ≥44 px. Urdu Nastaliq gets a line-height of about 2.0.

**Risks**

| Risk | Mitigation |
|---|---|
| The source video is 4K HEVC Dolby Vision HLG at about 50 Mb/s | Tone-map to SDR BT.709 (`zscale`/`tonemap`; the tooling is confirmed available), downscale to 1280 px, strip audio, and encode to H.264 and AV1. Target ≤1.5 MB. |
| The clips are 1.8 s and 3.5 s, so the loop seam will be visible | Slow to about 0.6× with a crossfade loop, or fall back to a still. A longer clip is the real fix. |
| Nastaliq fonts are heavy (often 300 KB or more) | Subset to the used glyphs, use `font-display: swap`, and load only on the Urdu pages. |
| The 2 MB hero JPEG | Responsive AVIF/WebP at 640, 1280, and 1920 px; target hero LCP image ≤180 KB on mobile. |
| Map embeds and social widgets add third-party weight and tracking | Use links only, with no embeds and no trackers unless approved. |

**Stack (proposed):** Astro with static output, zero client JS by default, and all venue data in one typed `src/data/venue.ts`. Built-in i18n routing handles `ur`/`en`, and output is plain static files deployable anywhere. Nothing will be deployed without Gate 6 authorisation.

---

## 10. Readiness

| Gate | Status |
|---|---|
| 1. Facts and assets | ❌ Name, location, schedule, contact, languages, and the consent policy are all missing |
| 2. Creative direction | 🟡 Proposed above; awaiting approval |
| 3–7 | Not started |

**Not ready for final creative approval.** The direction can be reviewed now, in parallel with collecting the facts.

## 11. Exact next action

**The owner fills in `intake/BUSINESS-INFO.txt` (at minimum the ★ fields) and `intake/ASSET-CHECKLIST.txt` (consent policy), and approves or adjusts Sections 6–8 above.**

On receipt, I will:

1. Lock the facts.
2. Transcode and crop the media.
3. Scaffold the Astro site with the data file and tokens.
4. Build the hero and schedule first, as a private local preview (Gate 3).
