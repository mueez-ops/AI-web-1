/* =========================================================================
   AIAT — data/classes.js
   HOW TO EDIT: one { ... } block per class, separated by commas.
   Copy an existing block to add a class. Times are in PAKISTAN TIME, 24-hour
   ("17:00" = 5 pm). The site converts them for students abroad.

   Fields:
     id          short unique code, no spaces, e.g. "tajweed-1"
     subject     "Qur'an" | "Tajweed" | "Ahkam" | "Hawza" (or a new subject)
     level       e.g. "Beginner"
     ageGroup    e.g. "Children 8–12", "Adults"
     mode        "in-person" | "online" | "both"
     days        e.g. ["Mon", "Wed", "Fri"]   (Mon Tue Wed Thu Fri Sat Sun)
     start, end  "HH:MM" in Pakistan time
     teacher     teacher's name as it should be shown
     description one or two short sentences
     status      "open" | "full" | "soon"
   ========================================================================= */
window.AIAT = window.AIAT || {};

AIAT.classes = [
  // TODO: Mueez to provide the full class list. Example of the format:
  // {
  //   id: "tajweed-1",
  //   subject: "Tajweed",
  //   level: "Beginner",
  //   ageGroup: "Adults",
  //   mode: "both",
  //   days: ["Mon", "Wed"],
  //   start: "17:00", end: "18:00",
  //   teacher: "Teacher's name",
  //   description: "Short description.",
  //   status: "open"
  // },
];
