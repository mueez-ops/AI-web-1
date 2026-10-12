# AIAT website — Intake Report & Creative Proposal (fresh start)

Prepared 2026-10-12, after Mueez asked to start again from scratch with no past ideas.
All earlier design, strategy and code were removed (still in git history, commit 56f352c, not reused).

**Status:**
- Gate 1 (facts and assets): open. Contact details, class details and media consent are missing.
- Gate 2 (creative direction): proposed below, awaiting approval.
- Nothing is built or deployed.

---

## 1. Execution mode

The project is in **reset and discovery (Gates 1–2)**. The repository now holds only this report, `TODO.md`, `CLAUDE.md` and the git-ignored media masters. Building starts once the direction in §6–8 is approved.

## 2. Business and primary conversion goal

| Item | Content | Source |
|---|---|---|
| Name and category | Ali Ibn-e-Abitalib Islamic Institution (AIAT), a Shia Islamic religious teaching institute | Owner brief |
| Location | Quetta, Balochistan, Pakistan. Street address **UNKNOWN**. | Owner brief |
| History | Founded 1992. Quetta institute since 2018. | Owner brief |
| Main offer | Classes in Qur'an, Tajweed, Ahkam and Hawza, in person and partly online (including students abroad). Classes are the only income. | Owner brief |
| Yearly programs | Muharram (first ten nights, livestreamed), Ramadan, Shab-e-Qadr, Eid prayers, Eid al-Ghadir, January winter camp (boys 10–17) | Owner brief |
| Primary audience | Families and students in and around Quetta; students abroad who want online classes; parents (winter camp) | Owner brief |
| **Primary action** | **Ask about a class (Submit Inquiry):** one short enquiry, sent by form or WhatsApp | Chosen because classes are the only income |
| Secondary actions | Watch the Muharram livestream and recordings (YouTube); get directions | Support the primary action without competing with it |

I kept these owner-supplied facts because they are facts, not ideas. If "no past ideas" was meant to include them, say so and they will be removed too.

## 3. Fact & Conflict Report

**Observed in the new media**
- **The minbar wall:** a large red calligraphy banner with a central roundel reading **السلام علیک یا اباعبدالله**, framed by dense red script.
- **A wooden minbar** with carved panels, and a cleric in a white turban speaking from it.
- **Hand-painted wall slogans in red**, mostly in Persian:
  - left wall: **هل من ناصر ینصرنی** with the Persian line **آیا کسی هست که مرا یاری کند؟**
  - right wall: **کسی مثل من با کسی مثل یزید بیعت نمیکند**, attributed on the wall to Imam Husayn.
- **The courtyard:** a sand-plaster courtyard with green planters, black and red flags along the top of the wall, red patterned carpets, a camera crew on tripods, and a very large seated gathering dressed mostly in black.

**Conflicts and open checks**

| # | Issue | Handling |
|---|---|---|
| C1 | The media is not labelled as AIAT's own venue or event. | **NEEDS OWNER CONFIRMATION** before any caption names a place or event. |
| C2 | The speaker on the minbar is not identified. | Never captioned with a name unless Mueez confirms who it is. |
| C3 | The video metadata says 25 June 2026 (10 Muharram 1448) at 10:44–11:26 am, but every scene is at night. | Metadata is not used for any public date. |
| C4 | The wall slogans are in **Persian**, which suggests part of the audience may read Persian/Dari. | Ask which languages the site needs. |
| C5 | The wall slogans and banner are religious text. | Shown only as they appear in photos, never re-typeset as decoration, unless Mueez supplies and approves the exact wording. |

**Sensitivities**
- **Identifiable people:** hundreds of faces are recognisable, including **children**. Publishing needs a consent decision.
- **Security:** large Shia gatherings in Quetta have been targeted in the past. The site must not publish security arrangements, entry points or live crowd information.
- **Tone:** mourning. No celebratory effects, no autoplay sound.

## 4. Asset Inventory

Masters are stored **byte-for-byte as supplied** in `media/originals/` (git-ignored; checksums verified against the uploads).

| Final name | Specs | Subject | Quality notes | Class | Use |
|---|---|---|---|---|---|
| `majlis-minbar-elevated-2576x1932.jpg` | 2576×1932, 4:3 landscape, JPEG 1.98 MB, EXIF stripped | High view down onto the minbar, the red banner and the gathering | Sharp, well exposed. A black flag is motion-blurred across the top-left corner, which is atmospheric but covers about 15% of the frame. A floodlight flare sits on the right. | **A / B** | The signature scroll moment (§8). A portrait crop for phones can be cut from the right two-thirds. |
| `IMG_3186-minbar-wall-wide-4k-hdr.mov` | 3840×2160, HEVC 10-bit, Dolby Vision 8.4 / HLG, 30 fps, **4.13 s**, 50.7 Mb/s, audio track | Frontal wide view of the whole minbar wall, the speaker and the crowd | Nearly static (8 px drift over the clip at 960 px width). A plain loop jumps visibly at the end. Needs a 0.5 s crossfade loop. | **A + E** | **Hero video.** Its poster frame doubles as the static fallback. |
| `IMG_3165-courtyard-pan-4k-hdr.mov` | 3840×2160, HEVC HDR, 3.46 s, 35 Mb/s | Pan across the courtyard to the minbar | Steady pan. Too short and directional to loop cleanly. | **B** | Optional atmosphere clip, desktop only |
| `IMG_3162-courtyard-wide-4k-hdr.mov` | 3840×2160, HEVC HDR, 1.81 s, 37 Mb/s | Wide view of the courtyard and banner | Very short | **C** | Stills only |

**Missing Asset Plan**

| Needed | Why | Priority |
|---|---|---|
| Logo (vector or large PNG) | Identity; must be shown exactly as supplied | Critical |
| Photos of **classes and teaching** | The main offer currently has no images; every supplied file is from a Muharram night | Critical |
| Daytime exterior / entrance | Helps visitors find the building | High |
| Winter camp photos | For parents | Medium |
| Longer locked-off clip (10–20 s), if one exists | A smoother hero loop | Nice to have |

## 5. Media quality policy (Mueez's instruction: never lower the quality)

1. **Masters are never altered.** All originals stay in `media/originals/` exactly as delivered.
2. **The photo** is served at its full 2576×1932 resolution on large screens:
   - The original JPEG is used byte-identical, with no recompression.
   - An AVIF copy is offered at visually lossless settings (verified by SSIM ≥ 0.99 against the original).
   - Phones get a size at or above their own pixel count (for example 1290 px wide for a 430-pt, 3× phone). They never see fewer pixels than their screen can show.
3. **Videos keep their full 4K resolution and their HDR:**
   - **Safari, iPhone and Mac:** the original HEVC HDR stream is repackaged as MP4 with no re-encoding, so it is identical to the source.
   - **Chrome, Edge, Firefox and Android:** 4K AV1 10-bit HDR at a visually lossless setting.
   - **Older devices and screens without HDR:** a carefully tone-mapped SDR 4K H.264 version. HDR played on a non-HDR screen looks grey and washed out, so this version is the better-looking choice there, not a downgrade.
4. **On phones,** the hero video loads a 1080p version (the same HDR treatment). A phone screen is about 1080–1290 physical pixels wide, so this shows every pixel the screen can display while keeping the download practical on mobile data. Sound is removed (the video is muted by design).
5. **"Even increase it":**
   - **What is possible:** the HDR is kept rather than flattened, which is already more than most websites show.
   - **What I won't do:** AI upscaling or "enhancing" would invent detail that wasn't in the photo. That conflicts with showing the real place and people, so I won't do it.
   - **Offered, not done:** a gentle exposure and colour correction of the photo, saved as a separate file. Your approval is needed.

## 6. Creative direction (new)

**Creative World Statement: "The Minbar Wall."** Every supplied image looks toward the same thing: one wall, one carved wooden minbar, one great red roundel, and hundreds of people seated on the floor, listening. AIAT is a place where a teacher speaks and a community listens and learns. The site is built around that line of sight, from the crowd to the minbar.

- **First three seconds:** a living image of the minbar wall, the institute's name, and one clear way to ask about classes.
- **First memorable moment:** the hero video. The gathering breathes, the speaker gestures under the roundel, and nothing moves except the real scene.
- **What is unique to AIAT:**
  - the roundel banner, the carved minbar, and the hand-painted red slogans on sand plaster;
  - black and red flags along the wall top;
  - the floor seating on patterned carpets.
- **Feeling while scrolling:** stillness and seriousness, then warmth when it turns to learning.
- **What adds value honestly:** real scale, real place, full-quality media. No invented numbers.
- **What stays calm:** the class, camp and visit sections are plain and readable on light plaster, so the hero and the signature moment carry the emotion.

### Visual DNA (proposed tokens, sampled from the photo)

| Token | Value | Comes from |
|---|---|---|
| `--limewash` | `#F1EADF` | The lit plaster, lightened for reading (main background) |
| `--plaster` | `#D6C4A8` | The sand wall (alternate surfaces) |
| `--ink` | `#1D1B1C` | Black clothing and the dark wall band (text) |
| `--banner` | `#8A2B2F` | The banner red (accent, primary buttons) |
| `--walnut` | `#A47652` | The minbar wood (thin rules and lines only; 3.3:1, never body text) |
| `--ground` | `#2F2A2C` | The banner's dark ground (dark sections) |

Measured contrast: ink on limewash 14.3:1; limewash on banner red 7.1:1 (button text); limewash on ground 11.8:1.

- **Typography (to be shown side by side for approval):**
  - **Latin display:** *Gloock*, a high-contrast serif with the weight of painted signage. Large sizes only.
  - **Body:** *Figtree*, a plain, very legible sans for reading on phones.
  - **Arabic and Persian lines:** *Noto Naskh Arabic* and *Noto Nastaliq Urdu*, for names of programs and, if wanted, Urdu or Persian text.
- **Material language:** flat plaster surfaces. Thin walnut-coloured rules like the minbar's edges. One recurring shape, the **circle of the roundel**, used for the hero's focus ring and the play/pause control, never as decoration on text.
- **Photography:** natural colour, full-bleed, no filters. Crops keep the architecture and the minbar in view and favour the crowd as a mass rather than single faces.
- **Shape and depth:** square corners. No shadows. Depth comes only from photography.
- **Forbidden:**
  - gold foil, glassmorphism, neon, particles, decorative gradients;
  - rounded "app" cards;
  - stock or AI imagery;
  - re-typeset sacred text used as ornament.

### Motion DNA
- **Character:** slow and steady, like a held breath.
- **Timing:** reveals of 500–800 ms, easing `cubic-bezier(.2,0,0,1)`, no overshoot.
- **What moves:** only the real footage and one scroll moment (§8). Text never waits for animation.
- **Phones:** reveals become simple fades and the scroll moment becomes a still image with a caption.
- **Reduced motion:** the poster image is shown instead of the video and all reveals are off.

### Transition DNA
- **Sections:** move from the dark hero into light plaster sections with a straight edge.
- **Signature exception:** the one transition is the zoom in §8. Nothing snaps, pins for long, or hijacks the scroll.

### Effects DNA
- **Allowed:** a slow video loop (pauses off-screen); one scroll-linked zoom; fade-in of content.
- **Forbidden:** parallax on faces, autoplay sound, carousels that rotate by themselves, cursor effects, flashing.

## 7. Page architecture (one page plus a privacy note)

| # | Section | Job |
|---|---|---|
| 1 | **Hero:** the minbar wall video | Name, one line about what AIAT is, **Ask about a class** (primary), **Watch on YouTube** (secondary, once the link is supplied) |
| 2 | **Facts strip** | Founded 1992 · Quetta since 2018 · in person and online · six programs a year. Confirmed facts only. |
| 3 | **Classes** (core offer) | Qur'an, Tajweed, Ahkam, Hawza; in person or online; who each suits; ask about a class. Times and fees appear only once supplied. |
| 4 | **From the crowd to the minbar** (signature) | The elevated photo, zooming slowly toward the minbar as you scroll: Muharram's ten nights, the head of the institute speaking each night, the livestream |
| 5 | **The year** | The six programs in calendar order, with honest "date to be announced" states |
| 6 | **Winter camp** | For parents: ages 10–17, January, registration enquiry |
| 7 | **Visit & ask** | Address, map link, WhatsApp, enquiry form with validation, spam trap and privacy note |
| 8 | **Footer** | Name, city, links |

## 8. Interaction Map

| # | Location | Trigger | Behaviour | Purpose | Assets | Mobile | Reduced motion | Fallback | Performance | Pass/fail |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Hero | Page load | Poster shows instantly; the video fades in when ready and loops with a 0.5 s crossfade. A round pause/play button sits bottom-right. | First impression of the real place | IMG_3186 encodes plus poster | 1080p version; does not load at all with Data Saver on | Poster only | Poster `<img>` | Heading and button visible before any video loads; video paused when off-screen | No layout shift. Pause button works by keyboard. No video request when reduced motion or Data Saver is on. |
| 2 | Section 4 | Scroll through the section | The photo slowly scales from the full view to about 1.4× centred on the minbar; three short lines of text appear in turn | Shows who AIAT is: the voice from the minbar | Elevated photo (full resolution) | Still image, portrait crop, text below | Still image, all text visible | Same | Transform only, no pinning longer than about 1 screen | Text readable at every scroll position. No scroll trap. |
| 3 | Classes | Tap a class | The card expands to show who it suits and how to start; "Ask about this class" pre-fills the enquiry | Moves interest to enquiry | none | Same | No animation | All details shown | — | Works by keyboard; the enquiry field is pre-filled |
| 4 | Ask (form) | Submit | Validation, sending, success or failure message; "Send on WhatsApp" builds the same message | The primary action | none | Same | Same | Shows the WhatsApp or phone fallback | — | Errors are announced and focus moves to the first one |

## 9. Mobile strategy and performance risks

**Mobile is designed first.** Most visitors will come from WhatsApp or Facebook on a phone.
- **Phone layout:**
  - the hero fills the first screen with its text over the lower, darker part of the frame;
  - the action button is reachable by thumb;
  - section 4 becomes a still portrait crop.
- **No sticky bar** unless testing shows people lose the action button.

**Risks**

| Risk | Mitigation |
|---|---|
| Your no-quality-loss instruction against weak mobile connections | The policy in §5: full quality at every screen's real resolution, and nothing larger than the screen can show. |
| HDR support varies by browser | Three video versions, chosen automatically by the browser. |
| The 4 s hero loop may show a seam | A 0.5 s crossfade, verified frame by frame. |
| Persian/Urdu fonts are heavy | Loaded only if those languages are used. |

## 10. Ready for creative approval?

| Gate | Status |
|---|---|
| Gate 2 (creative direction) | Ready for review now |
| Gate 1 (facts and assets) | **Not passed:** contact details, class details, logo and media consent are missing (see `TODO.md`) |

The build can start on approval, with clearly marked placeholders where facts are missing.

## 11. Exact next action

Mueez replies with:
1. **"Approved"**, or changes to §6–8.
2. **Answers** to the ★ items in `TODO.md`, at minimum the consent choice and a WhatsApp number or other contact.
