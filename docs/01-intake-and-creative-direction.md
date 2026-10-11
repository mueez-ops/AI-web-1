# 01 — AIAT Intake Report, Asset Inventory & Creative Direction

Prepared: 2026-10-11 (≈ 30 Rabi' al-Thani 1448, Umm al-Qura).
Supersedes the earlier venue-agnostic draft, which was written before the brief arrived.
Source of truth: `CLAUDE.md` (owner brief), then `TODO.md` answers.

**Status: Phase 0 (styleguide) built and awaiting review. Gate 1 is partly passed: the brief is in, but facts and media are missing.**

---

## 1. Execution mode

The project is in **Phase 0, the design-system proof.** The brief explicitly asks for `styleguide.html` before any real page, and that page is the vehicle for creative approval (Gate 2). No production page has been built.

## 2. Business and conversion

**AIAT, Ali Ibn-e-Abitalib Islamic Institution, is a Shia teaching institute in Quetta.**

- It was founded in 1992 and has served Quetta since 2018.
- It teaches Qur'an, Tajweed, Ahkam, and Hawza, in person and online.
- It runs a yearly cycle of six programs, peaking with ten Muharram nights that are livestreamed.
- **Classes are its only income.**

| | |
|---|---|
| **Primary action** | **Join a class.** The *Request a seat* button opens the enrollment drawer, which pre-selects the class. |
| Secondary | Message on WhatsApp, with the same details pre-filled (WhatsApp is how people here make contact). |
| Seasonal / supporting | Watch live (only during a live window), add a program to the calendar, register for the winter camp, request or offer support. |

## 3. Fact & Conflict Report

| Fact | Status |
|---|---|
| Name and short name, AIAT | ✅ From the brief |
| Founded 1992; Quetta since 2018 | ✅ From the brief. Where it was founded is ambiguous (see `TODO.md`), so it is published exactly as worded. |
| Head: Muhammad Kazim Behjati | ⚠️ Title and spelling need confirmation |
| Subjects; online classes | ✅ Subjects confirmed. ❌ No class list (levels, times, teachers) |
| The six yearly programs | ✅ Names confirmed. ❌ Dates for the coming year missing |
| Numbers: students taught, Facebook followers | ❌ Missing. The Proof section skips them until they are provided. |
| Contact, address, hours, map | ❌ Missing |
| Logo (`images/logo.png`) | ❌ **Not in the repository** |
| Prayer-time method | ⚠️ Default is Aladhan method 0 (Jafari); needs confirmation |
| Hijri offset | ⚠️ The computed Umm al-Qura calendar is often a day ahead of Pakistan's sighting. Offset needed. |
| Supplied media date | ℹ️ The clip metadata says 25 June 2026, which is 10 Muharram 1448 and fits Ashura. The time of day conflicts with the night scene, so it needs confirmation. |
| Deployment (Definition of done) | ⚠️ Requires explicit go-ahead (Gate 6) |

**Sensitivities**

- **Public repository plus identifiable children:** crowd media stays out of git until consent is confirmed.
- **Sacred text:** no Qur'an verse or hadith appears anywhere unless Mueez supplies it.
- **Mourning tone in Muharram mode.**
- **Security:** no crowd counts or entry arrangements are published.

## 4. Asset Inventory

| File | Specs | Class | Decision |
|---|---|---|---|
| `ae64111d-image.jpg`, courtyard majlis at night | 2576×1932 (4:3) | A / E, Muharram mode | Used **locally only** in the styleguide's Muharram sample (`images/local/`, git-ignored) until consent and origin are confirmed |
| `IMG_3165.mov`, 3.5 s pan to minbar | 4K HEVC Dolby Vision HLG | B | On hold. Too short; the pro Canon footage is preferred. |
| `IMG_3162.mov`, 1.8 s wide view | 4K HEVC Dolby Vision HLG | C / F | Stills only |
| Logo | — | — | **Missing (critical)** |
| Building, classes, programs, camp photos | — | — | **Missing**; listed in `TODO.md` |

## 5. Creative direction (from the brief, refined)

**Creative World: "The institute's year, on one noticeboard."** The site is governed by time: today's Hijri date, the next prayer, and the next program. It is set in the logo's own materials: a teal dome, an open book, gold calligraphy, and warm ivory paper. Once a year the page goes dark for the ten nights of Muharram.

- **Visual DNA:** ivory paper and teal ink, with thin gold hairlines and small numbered labels (`01 — The Year`) instead of boxes and shadows. Cormorant Garamond 400–500 sets display type, Manrope 400–600 sets the interface, and Amiri sets Arabic program names. Gold and dark are used because they come from the logo, not as a luxury cue.
- **Muharram mode:** near-black mourning background, warm grey text, and crimson only as rules and fills (never as text, at 1.89:1 contrast).
- **Motion DNA:** motion follows time or reveals proof, and never decorates. Reveals run 500–900 ms on `cubic-bezier(.22,0,0,1)` with no overshoot. Pinned sequences appear only where the brief marks **[scroll]**. On phones they become vertical reveals, and with reduced motion everything is static and fully visible.
- **Transition DNA:** sections are joined by a gold hairline that draws across. Paper-to-mourning is a hard edge with no wipe.
- **Effects:** forbidden effects are glassmorphism, particles, neon, gradients for decoration, rounded SaaS cards, cursor effects, auto-carousels, autoplay sound, and celebration effects in Muharram mode.

## 6. Interaction Map

| # | Where | Trigger | Behaviour | Purpose | Mobile | Reduced motion / fallback | Pass/fail |
|---|---|---|---|---|---|---|---|
| 1 | 8.1 Now strip | Load, then each minute | Shows the Hijri and Gregorian date, Quetta prayer times with the next prayer marked by a text label plus a rule, and a countdown to the next program | A reason to return; answers "what's on" | Horizontally scrollable strip | Static. If the API fails, the prayer block hides quietly. | The block is hidden offline and no console errors appear |
| 2 | 8.2 Proof **[scroll]** | Scroll | Pinned; facts arrive one by one, quantities count up, photos crossfade | Credibility | Vertical reveals, no pin | All facts visible, final numbers shown | Only confirmed facts render |
| 3 | 8.4 The Year **[scroll]** | Scroll | A horizontal timeline driven by vertical scroll, with a "we are here" marker | Shows the living calendar and drives Add to calendar | Vertical list | Vertical list | The marker sits at today's Hijri date ± offset |
| 4 | 8.5 Muharram **[scroll]** | Scroll | One night per step, with slow crossfades | The emotional peak; recordings | Stacked nights | Stacked and static | No bright or playful motion |
| 5 | 8.10 Enrollment drawer | Any *Join* / *Request a seat* | The drawer slides in, focus is trapped, Esc closes it, and the class is pre-selected | **Income** | Full-screen sheet | Appears instantly with no slide | Keyboard-only submit works; WhatsApp fallback opens with the details |

Light YouTube embeds (the thumbnail first, the player only when tapped) are a performance system, not a motion effect.

## 7. Mobile and performance

- **Mobile-first at 375 px on a mid-range Android over a weak connection.**
- Fonts: four families. Only the weights used are loaded, with `display=swap`, and Amiri is loaded only where Arabic appears.
- GSAP plus ScrollTrigger is about 70 KB gzipped from cdnjs and is loaded `defer`. If it fails to load, content stays visible because it is never hidden by default.
- Images are WebP at 640, 1280, and 1920 px, lazy-loaded below the fold. Homepage target: under 2 MB.
- **Risks:**
  - There are no pro photos yet, so layouts are tuned for them blind.
  - The Aladhan API depends on network access.
  - Pinned sections on low-end phones are mitigated by switching them off below 768 px.

## 8. Readiness and next action

The styleguide is ready for **creative review (Gate 2)**. Real-page building (Phase 1) waits for that approval. The most valuable `TODO.md` answers to unblock Phase 1 and 2 are the **logo, the contact details, the purpose line, and the Hijri offset.**
