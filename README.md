# AIAT website — Ali Ibn-e-Abitalib Islamic Institution, Quetta

Plain HTML, CSS and JavaScript. No build step, no npm. Open `index.html` directly in a browser,
or serve the folder (`python3 -m http.server`) to test prayer times.

## Pages
- `index.html`: the homepage, with these sections:
  1. Now (live noticeboard)
  2. Proof
  3. Learn (class finder)
  4. The Year (timeline)
  5. Muharram teaser
  6. Library
  7. Winter camp
  8. Support
  9. Visit

  Plus the enrolment drawer and the footer.
- `muharram.html`: the ten nights, with the coming schedule, livestream panel, and last season's nights.
- `library.html`: the full lecture archive with search and filters.
- `styleguide.html`: internal design reference. It is set to `noindex`.

## Updating content
Edit only the files in `data/`. Each starts with instructions. Anything left empty is hidden on the site,
never shown wrong. See `TODO.md` for what is still missing and the launch checklist.

## Useful preview switches
- `?season=muharram` / `?season=normal`: preview either mode. The site switches automatically during the Hijri month of Muharram.
- `index.html#join`: opens the enrolment drawer, for sharing on WhatsApp.
- `index.html?subject=Tajweed#learn`: a filtered class list.
- `library.html?occasion=Muharram`: a filtered archive.

## Status
- All phases (0–9) are built.
- The site is in **preview mode**: `showSamples: true`, so items marked SAMPLE are not real.
- **Not deployed.** Publishing waits for Mueez's go-ahead.
