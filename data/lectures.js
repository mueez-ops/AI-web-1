/* =========================================================================
   AIAT — data/lectures.js
   The lecture archive (Library). One { ... } block per lecture.

   Fields:
     title      as it should be shown
     speaker    speaker's name
     year       e.g. 2025
     occasion   e.g. "Muharram", "Ramadan", "Weekly lecture"
     topics     e.g. ["Ethics", "Qur'an"]
     youtubeId  the part after "v=" in the YouTube link
     duration   e.g. "1:02:15"
     date       optional, "YYYY-MM-DD" (used to sort newest first)
   ========================================================================= */
window.AIAT = window.AIAT || {};

AIAT.lectures = [
  // TODO: Mueez to provide YouTube links for past lectures. Example:
  // { title: "Lecture title", speaker: "Speaker", year: 2025, occasion: "Muharram",
  //   topics: ["Topic"], youtubeId: "XXXXXXXXXXX", duration: "58:10", date: "2025-07-01" },
];
