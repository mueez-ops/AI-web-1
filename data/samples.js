/* =========================================================================
   AIAT — data/samples.js
   SAMPLE CONTENT FOR PREVIEW ONLY. Nothing here is real.
   Used only while settings.showSamples is true. Every item is shown with a
   "Sample" tag. Delete this file (and its <script> tags) before launch, or
   simply set showSamples: false in settings.js.
   ========================================================================= */
window.AIAT = window.AIAT || {};

AIAT.samples = {
  classes: [
    { id: "s-quran", subject: "Qur'an", level: "Sample level", ageGroup: "Sample ages", mode: "in-person", days: ["Mon", "Tue", "Wed", "Thu"], start: "16:00", end: "17:00", teacher: "Teacher name", description: "Sample description of a Qur'an reading class.", status: "open" },
    { id: "s-tajweed", subject: "Tajweed", level: "Sample level", ageGroup: "Sample ages", mode: "both", days: ["Mon", "Wed"], start: "17:00", end: "18:00", teacher: "Teacher name", description: "Sample description of a Tajweed class.", status: "open" },
    { id: "s-ahkam", subject: "Ahkam", level: "Sample level", ageGroup: "Sample ages", mode: "online", days: ["Sat"], start: "20:30", end: "21:30", teacher: "Teacher name", description: "Sample description of an Ahkam class for students abroad.", status: "soon" },
    { id: "s-hawza", subject: "Hawza", level: "Sample level", ageGroup: "Sample ages", mode: "in-person", days: ["Sat", "Sun"], start: "09:00", end: "12:00", teacher: "Teacher name", description: "Sample description of a Hawza studies class.", status: "full" },
    { id: "s-quran-online", subject: "Qur'an", level: "Sample level", ageGroup: "Sample ages", mode: "online", days: ["Fri"], start: "19:00", end: "20:00", teacher: "Teacher name", description: "Sample description of an online Qur'an class.", status: "open" }
  ],
  lectures: [
    { title: "Sample lecture title one", speaker: "Speaker name", year: 2026, occasion: "Muharram", topics: ["Sample topic"], youtubeId: "", duration: "58:10", date: "2026-06-20" },
    { title: "Sample lecture title two", speaker: "Speaker name", year: 2026, occasion: "Ramadan", topics: ["Sample topic"], youtubeId: "", duration: "47:32", date: "2026-03-01" },
    { title: "Sample lecture title three", speaker: "Second speaker", year: 2025, occasion: "Muharram", topics: ["Another topic"], youtubeId: "", duration: "1:04:05", date: "2025-07-02" },
    { title: "Sample lecture title four", speaker: "Speaker name", year: 2025, occasion: "Weekly lecture", topics: ["Another topic"], youtubeId: "", duration: "39:48", date: "2025-04-11" },
    { title: "Sample lecture title five", speaker: "Second speaker", year: 2024, occasion: "Eid al-Ghadir", topics: ["Sample topic"], youtubeId: "", duration: "52:20", date: "2024-06-25" },
    { title: "Sample lecture title six", speaker: "Speaker name", year: 2024, occasion: "Ramadan", topics: ["Sample topic"], youtubeId: "", duration: "44:00", date: "2024-03-30" }
  ]
};
