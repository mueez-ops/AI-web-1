/* =========================================================================
   AIAT — data/settings.js
   HOW TO EDIT: change the values between the quotes. Leave a value as ""
   (empty) or null if you don't know it yet — the site hides that item
   instead of showing something wrong. Save the file and refresh the page.
   Do not rename the keys (the words before the colons).
   ========================================================================= */
window.AIAT = window.AIAT || {};

AIAT.settings = {
  /* ---- Preview switch -----------------------------------------------------
     true  = show clearly-marked SAMPLE classes and lectures (data/samples.js)
             so the systems can be reviewed before real data arrives.
     false = real data only. MUST be false before the site goes live.        */
  showSamples: true,

  /* ---- Identity ---------------------------------------------------------- */
  name: "Ali Ibn-e-Abitalib Islamic Institution",
  shortName: "AIAT",
  purposeLine: "",            // TODO: one short line of purpose for the first screen
  logo: "",                   // TODO: "images/logo.svg" or "images/logo.png" once supplied
  founded: 1992,
  quettaSince: 2018,
  head: {
    name: "Muhammad Kazim Behjati", // TODO: confirm spelling
    title: ""                       // TODO: confirm title (e.g. Agha, Allama, Sheikh)
  },

  /* ---- Numbers for the Proof section (null = not shown) ------------------ */
  studentsTaught: null,       // TODO: e.g. 1200
  facebookFollowers: null,    // TODO: e.g. 25000

  /* ---- Contact ----------------------------------------------------------- */
  whatsapp: "",               // TODO: digits only with country code, e.g. "923001234567"
  phone: "",                  // TODO: as it should be shown, e.g. "+92 81 123 4567"
  email: "",                  // TODO
  address: "",                // TODO: street address (city is added automatically)
  city: "Quetta",
  region: "Balochistan",
  country: "Pakistan",
  mapUrl: "",                 // TODO: Google Maps share link (opens the map)
  mapEmbedUrl: "",            // TODO: Google Maps "Embed a map" src URL
  openingHours: [],           // TODO: e.g. [["Monday–Saturday", "9:00 am – 8:00 pm"], ["Friday", "Closed"]]

  /* ---- Social ------------------------------------------------------------ */
  facebookUrl: "",            // TODO
  youtubeUrl: "",             // TODO: channel URL
  youtubeLiveUrl: "",         // TODO: channel live URL, e.g. "https://www.youtube.com/@channel/live"

  /* ---- Forms (Formspree — create a form at formspree.io, paste its URL) -- */
  formspree: {
    enroll:  "",              // TODO: e.g. "https://formspree.io/f/abcdwxyz"
    camp:    "",              // TODO
    support: "",              // TODO
    enquiry: ""               // TODO
  },

  /* ---- Time and prayer --------------------------------------------------- */
  timezone: "Asia/Karachi",   // Pakistan time (UTC+5, no daylight saving)
  hijriOffsetDays: 0,         // TODO: e.g. -1 if Pakistan's moon sighting is a day behind
  prayer: {
    city: "Quetta",
    country: "Pakistan",
    method: 0                 // Aladhan method 0 = Shia Ithna-Ashari (Leva Institute, Qum). TODO: confirm
  },


  /* ---- Website ----------------------------------------------------------- */
  siteUrl: ""                 // TODO: final address, e.g. "https://aiat.org.pk" (used for sharing previews)
};
