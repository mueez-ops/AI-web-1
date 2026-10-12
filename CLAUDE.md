# CLAUDE.md — AIAT website (fresh start, 2026-10-12)

The owner (Mueez) asked to **start the website from scratch with no past ideas**.
Everything built before that (design, strategy, code) was removed. It remains in
git history (commit 56f352c) and must not be reused unless Mueez asks for it.

Read `docs/intake.md` before doing any work. It holds the facts, the asset
inventory and the proposed direction. `TODO.md` lists the open questions.

## Facts provided by the owner (still valid)
- Ali Ibn-e-Abitalib Islamic Institution (AIAT). A Shia Islamic religious institute.
- Founded 1992. The Quetta institute has served the community since 2018.
  Quetta, Balochistan, Pakistan.
- Head / founder: Muhammad Kazim Behjati. He is the speaker on the minbar in the photos and videos.
- Location: Hazara Town, Quetta (shown on the institute's logo). Street address and map pin not yet supplied.
- WhatsApp: +92 315 8455594 (the main contact; confirmed by Mueez).
- The supplied photo and videos are from AIAT's own Muharram nights.
- The site is in English only.
- Teaches Qur'an, Tajweed, Ahkam and Hawza. Some classes are online, including for
  students abroad. Classes are the institute's only source of income.
- Yearly programs: Muharram (first ten nights, the head speaks each night,
  livestreamed on YouTube), Ramadan, Shab-e-Qadr, Eid prayers, Eid al-Ghadir,
  and a January winter camp for boys aged 10–17.

## Rules
- Never invent facts, numbers, names, dates, quotes, Qur'an verses or hadith.
  Missing items become visible placeholders and go into `TODO.md`.
- **Media quality:** Mueez asked that photos and videos never lose quality.
  Masters live untouched in `media/originals/` (git-ignored). Every web version
  must be visually lossless at its display size. See "Media quality policy" in
  `docs/intake.md`.
- **Media consent:** on 2026-10-12 Mueez approved the photos and video for the public
  website. `media/web/` (web versions) is committed; `media/originals/` stays local.
- Nothing is published or deployed without Mueez's explicit go-ahead.
- Creative direction "The Minbar Wall" was approved on 2026-10-12 and the site is built
  (`index.html`, `assets/`). The logo is shown on black, as Mueez asked.
- Rebuild `media/web/` with `tools/make-web-media.sh`. Never add AI upscaling or retouching.
- The logo stays on black, as supplied (Mueez confirmed, 2026-10-12).
