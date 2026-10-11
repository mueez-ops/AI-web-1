# TODO — facts and files needed from Mueez

Nothing below is shown on the site until it is filled in. Tick each item when it is provided.
Placeholders in the code are marked `<!-- TODO: ... -->`. Almost everything goes into a file in
`data/`, and each data file starts with a comment explaining how to edit it.

## Where each answer goes

| Answer | File |
|---|---|
| Purpose line, logo path, contact, address, map, hours, social links, Formspree URLs, Hijri offset, prayer method, student and follower numbers | `data/settings.js` |
| Class list | `data/classes.js` |
| Confirmed program dates, livestream windows, one-line summaries | `data/programs.js` |
| Muharram topics, times, live windows, recordings | `data/muharram.js` |
| Lecture archive (YouTube IDs) | `data/lectures.js` |
| Camp details (dates, what happens, what to bring), School and Welfare text | `index.html` (search for `TODO`) |
| Approved photos | `images/` (WebP), then update the `src` in the HTML |

## Before going live (launch checklist)

- [ ] Set `showSamples: false` in `data/settings.js`. Remove `data/samples.js` and its `<script>` tags.
- [ ] Create the four Formspree forms (enroll, camp, support, enquiry) and paste their URLs into `settings.js`.
- [ ] Replace the `images/local/...` photo paths with approved photos in `images/`. The repo is public, so publish only consented photos.
- [ ] Set `siteUrl`. Make `og:image` and `og:url` absolute in the three pages. Add `url`, `logo` and `sameAs` to the JSON-LD in `index.html`.
- [ ] Add `Event` structured data once program dates are confirmed. It is deliberately left out while dates are only "expected".
- [ ] Replace `images/favicon.svg` (placeholder arch) with one made from the logo.
- [ ] Explicit go-ahead to publish, and choose the host (Netlify or Firebase Hosting) and domain.

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
- [ ] **Eid prayers:** does AIAT hold prayers for both Eid al-Fitr and Eid al-Adha? Both are listed in `data/programs.js`. Remove Eid al-Adha if not.
- [ ] **Shab-e-Qadr nights:** which nights does AIAT hold? The site currently assumes 19–23 Ramadan, shown as expected.
- [ ] **One-line summaries** for the Ramadan, Shab-e-Qadr and Eid al-Ghadir programs.
- [ ] **Privacy wording** under each form. It currently says details are used only to reply and are not shared; please confirm that is true.
- [ ] **Hosting go-ahead.** Netlify or Firebase Hosting, and the domain. Nothing will be published without your explicit approval.
