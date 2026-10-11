# TODO — facts and files needed from Mueez

Nothing below is shown on the site until it is filled in. Tick each item when it is provided.
Placeholders in the code are marked `<!-- TODO: ... -->`.

## Open questions from the brief (CLAUDE.md §14)

- [ ] Number of students taught
- [ ] Current Facebook follower count
- [ ] One-line statement of purpose for the first screen
- [ ] Full class list: subjects, levels, ages, days, times, teachers, online or not
- [ ] Exact program dates for the coming year
- [ ] Muharram night topics
- [ ] YouTube links for past lectures and Muharram nights
- [ ] WhatsApp number
- [ ] Phone
- [ ] Email
- [ ] Address
- [ ] Map location
- [ ] Opening hours
- [ ] Prayer-time method the institute follows (the default is Aladhan method 0, Shia Ithna-Ashari / Leva Institute, Qum)
- [ ] School details
- [ ] Welfare & Educational Support details
- [ ] Winter camp dates
- [ ] Winter camp: what to bring
- [ ] Photos: building, classes, each program, Muharram nights, winter camp

## Found during Phase 0

- [ ] **Logo file.** `images/logo.png` is not in the repository. Please add it, as SVG if possible, otherwise as a PNG at least 1000 px wide with a transparent background.
- [ ] **Head's title and spelling:** "Muhammad Kazim Behjati". Which title should be shown (Agha, Allama, Sheikh, Syed, other)?
- [ ] **Where was AIAT founded in 1992?** The brief says the Quetta institute has served since 2018. The site will say "Founded 1992" and "Serving Quetta since 2018" exactly as given unless you want more detail.
- [ ] **Photo and video consent.** The repository is public. The supplied Muharram photo and the two phone clips show identifiable people, including children, so they are kept out of git (`images/local/`). Please confirm one of:
  - A. Crowd photos can be published as they are.
  - B. Wide shots only, with no close faces of children.
  - C. No crowd photos; use architecture and detail shots only.
- [ ] **Are the supplied photo and clips from AIAT's own courtyard?** Please confirm. The clips' metadata dates them to 10 Muharram 1448 (25 June 2026), but the time stamp says morning while the scenes are at night, so the metadata can't be trusted on its own.
- [ ] **Pro media.** Please send the Sony A7III photos and Canon footage from Muharram. The supplied files are iPhone clips of 1.8 s and 3.5 s, which are too short for video use.
- [ ] **Hijri offset.** The site computes the Umm al-Qura calendar. Pakistan's moon sighting is often a day behind it. Which offset should `hijriOffsetDays` use (0, -1, or set per month)?
- [ ] **Arabic spellings** of the program names. The styleguide shows standard spellings; please confirm them.
- [ ] **"School"** in "Support — School and Welfare & Educational Support" (§8.8). Is there a school separate from the classes? What should this block say?
- [ ] **Hosting go-ahead.** Netlify or Firebase Hosting, and the domain. Nothing will be published without your explicit approval.
