/* =========================================================================
   AIAT — data/programs.js
   The yearly programs, shown on "The Year" timeline with Add to calendar.

   HOW DATES WORK
   - Islamic programs use Hijri dates: hijri: { month, startDay, endDay }.
     The site works out the Gregorian dates from the Umm al-Qura calendar
     (plus hijriOffsetDays in settings.js). These are EXPECTED dates — the
     site says so — because the real date depends on moon sighting.
   - When the institute announces exact dates, add them in "confirmed":
       confirmed: { start: "2027-02-08", end: "2027-03-09" }
     and the site shows them as confirmed.
   - The winter camp uses Gregorian dates (gregorian: { month: 1 }).

   Hijri months: 1 Muharram · 2 Safar · 3 Rabiʻ I · 4 Rabiʻ II · 5 Jumada I
   6 Jumada II · 7 Rajab · 8 Shaʻban · 9 Ramadan · 10 Shawwal
   11 Dhu al-Qaʻdah · 12 Dhu al-Hijjah

   live: optional livestream windows (Pakistan time), e.g.
     live: [{ start: "2027-02-08T21:00", end: "2027-02-08T23:00" }]
   ========================================================================= */
window.AIAT = window.AIAT || {};

AIAT.programs = [
  {
    id: "muharram",
    name: "Muharram",
    arabic: "محرّم",                       // TODO: confirm Arabic spelling
    hijri: { month: 1, startDay: 1, endDay: 10 },
    summary: "The first ten nights of Muharram. The head of the institute speaks each night, and every night is livestreamed on YouTube.",
    livestreamed: true,
    link: "muharram.html",
    confirmed: null,
    live: []
  },
  {
    id: "ramadan",
    name: "Ramadan",
    arabic: "رمضان",
    hijri: { month: 9, startDay: 1, endDay: 30 },
    summary: "The Ramadan program.",                         // TODO: one line from Mueez
    livestreamed: false,                                    // TODO: confirm
    confirmed: null,
    live: []
  },
  {
    id: "shab-e-qadr",
    name: "Shab-e-Qadr",
    arabic: "ليلة القدر",
    hijri: { month: 9, startDay: 19, endDay: 23 },          // TODO: confirm which nights AIAT holds
    summary: "The Nights of Qadr in Ramadan.",               // TODO: one line from Mueez
    livestreamed: false,
    confirmed: null,
    live: []
  },
  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr prayer",
    arabic: "عيد الفطر",
    group: "Eid prayers",
    hijri: { month: 10, startDay: 1, endDay: 1 },
    summary: "Prayers for Eid al-Fitr.",                        // TODO: time and place
    livestreamed: false,
    confirmed: null,
    live: []
  },
  {
    id: "eid-al-adha",
    name: "Eid al-Adha prayer",
    arabic: "عيد الأضحى",
    group: "Eid prayers",
    hijri: { month: 12, startDay: 10, endDay: 10 },
    summary: "Prayers for Eid al-Adha.",                        // TODO: confirm AIAT holds Eid al-Adha prayers too
    livestreamed: false,
    confirmed: null,
    live: []
  },
  {
    id: "eid-al-ghadir",
    name: "Eid al-Ghadir",
    arabic: "عيد الغدير",
    hijri: { month: 12, startDay: 18, endDay: 18 },
    summary: "The Eid al-Ghadir program.",                   // TODO: one line from Mueez
    livestreamed: false,
    confirmed: null,
    live: []
  },
  {
    id: "winter-camp",
    name: "Winter camp",
    arabic: "",
    gregorian: { month: 1 },                                // January; exact days TODO
    summary: "A January camp for boys aged 10 to 17.",
    livestreamed: false,
    link: "#camp",
    confirmed: null,                                        // TODO: { start: "2027-01-..", end: "2027-01-.." }
    live: []
  }
];
