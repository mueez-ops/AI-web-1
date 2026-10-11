/* =========================================================================
   AIAT — calendar.js
   1. AIAT.cal — "Add to calendar": Google Calendar link + .ics download
      (generated here, no server needed)
   2. 8.4 The Year — the Islamic year as a timeline of 12 months with every
      program placed in its month and a "we are here" marker on today
   3. Homepage Muharram teaser: expected dates of the coming ten nights
   ========================================================================= */
(function () {
  "use strict";
  var util = AIAT.util, T = AIAT.time, S = AIAT.settings;

  /* ---- 1. Calendar helpers ---------------------------------------------- */
  function ymdCompact(d) { return T.ymd(d).replace(/-/g, ""); }
  function location_() { return [S.address, S.city, S.country].filter(util.has).join(", ") || "Quetta, Pakistan"; }
  function icsEscape(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }

  var cal = AIAT.cal = {
    // events: [{ title, start: Date, end: Date (inclusive, all-day), details }]
    google: function (ev) {
      var q = new URLSearchParams({
        action: "TEMPLATE",
        text: ev.title,
        dates: ymdCompact(ev.start) + "/" + ymdCompact(T.addDays(ev.end || ev.start, 1)),
        details: ev.details || "",
        location: location_()
      });
      return "https://calendar.google.com/calendar/render?" + q.toString();
    },
    ics: function (events) {
      var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
      var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AIAT//Website//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
      events.forEach(function (ev, i) {
        lines.push("BEGIN:VEVENT",
          "UID:" + ymdCompact(ev.start) + "-" + i + "-" + ev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "@aiat",
          "DTSTAMP:" + stamp,
          "DTSTART;VALUE=DATE:" + ymdCompact(ev.start),
          "DTEND;VALUE=DATE:" + ymdCompact(T.addDays(ev.end || ev.start, 1)),
          "SUMMARY:" + icsEscape(ev.title),
          "DESCRIPTION:" + icsEscape(ev.details || ""),
          "LOCATION:" + icsEscape(location_()),
          "END:VEVENT");
      });
      lines.push("END:VCALENDAR");
      return lines.join("\r\n");
    },
    download: function (filename, events) {
      var blob = new Blob([cal.ics(events)], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    },
    // The chooser markup. Events are kept in a registry and fetched by key.
    registry: {},
    chooser: function (key, events, label) {
      cal.registry[key] = events;
      return '<details class="addcal"><summary class="btn btn--secondary btn--sm">' + util.icon("calendar") + util.esc(label || "Add to calendar") + "</summary>" +
        '<div class="addcal__menu">' +
        (events.length === 1 ? '<a href="' + util.esc(cal.google(events[0])) + '" target="_blank" rel="noopener">Google Calendar</a>' : "") +
        '<button type="button" data-ics="' + util.esc(key) + '">Apple, Outlook &amp; others (.ics)</button>' +
        "</div></details>";
    }
  };
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-ics]");
    if (b) {
      var key = b.getAttribute("data-ics");
      cal.download("aiat-" + key + ".ics", cal.registry[key]);
      b.closest("details").open = false;
    }
    // Close any open chooser when clicking elsewhere.
    util.$$("details.addcal[open]").forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });

  // Note added to every expected (not yet confirmed) calendar entry.
  var EXPECTED_NOTE = "Expected date: the exact date depends on the moon sighting. Please check with AIAT nearer the time.";

  function eventsFor(s) {
    var p = s.program, n = s.next;
    return [{
      title: p.name + " — AIAT" + (n.confirmed ? "" : " (expected)"),
      start: n.start, end: n.end,
      details: (p.summary || "") + (n.confirmed ? "" : "\n\n" + EXPECTED_NOTE)
    }];
  }

  /* ---- 2. The Year timeline --------------------------------------------- */
  var track = util.$("[data-year-track]");
  if (track) {
    var nowH = T.hijri(new Date());
    var html = "";
    for (var m = 1; m <= 12; m++) {
      var items = AIAT.schedule.filter(function (s) { return s.next && s.next.hijriMonth === m; });
      var isNow = m === nowH.month;
      html += '<li class="year__month' + (items.length ? "" : " is-empty") + (isNow ? " is-now" : "") + '"' + (isNow ? ' aria-current="date"' : "") + ">" +
        '<p class="year__month-name"><span>' + T.monthNames[m - 1] + '</span><span lang="ar">' + T.monthNamesAr[m - 1] + "</span></p>" +
        '<div class="year__month-body">' +
        (isNow ? '<p class="year__here">We are here · ' + util.esc(T.hijriLabel(new Date())) + "</p>" : "") +
        items.map(programCard).join("") +
        "</div></li>";
    }
    track.innerHTML = html;

    // Native horizontal scroller (no GSAP): start with "we are here" in view.
    var here = util.$(".year__month.is-now", track);
    var viewport = util.$("[data-year-viewport]");
    if (here && viewport && window.matchMedia("(min-width: 1024px)").matches) {
      viewport.scrollLeft = Math.max(0, here.offsetLeft - 48);
    }
  }

  function programCard(s) {
    var p = s.program, n = s.next;
    var dates = n.start
      ? T.range(n.start, n.end)
      : n.monthOnly + (p.confirmed ? "" : " · days to be announced");
    var key = p.id;
    return '<article class="card program" aria-labelledby="prog-' + util.esc(p.id) + '">' +
      (p.arabic ? '<p class="program__ar" lang="ar">' + util.esc(p.arabic) + "</p>" : "") +
      '<h3 class="card__title" id="prog-' + util.esc(p.id) + '">' + (p.link ? '<a href="' + util.esc(p.link) + '">' + util.esc(p.name) + "</a>" : util.esc(p.name)) + "</h3>" +
      '<p class="program__dates">' + util.icon("calendar") + " " + util.esc(dates) + "</p>" +
      '<div class="cluster" style="--cluster:.4rem">' +
      (n.start ? (n.confirmed ? '<span class="tag tag--confirmed">Confirmed</span>' : '<span class="tag tag--expected">Expected</span>') : "") +
      (p.livestreamed ? '<span class="tag tag--open">Livestreamed</span>' : "") +
      "</div>" +
      (p.summary ? "<p>" + util.esc(p.summary) + "</p>" : "") +
      (n.start && !n.confirmed ? '<p class="program__note">Depends on the moon sighting. Confirmed dates will be posted here.</p>' : "") +
      (n.start ? '<div class="card__foot" style="padding-top:var(--space-3)">' + cal.chooser(key, eventsFor(s)) + "</div>" : "") +
      "</article>";
  }

  /* ---- 3. Muharram: expected dates of the coming ten nights ------------ */
  var mSched = AIAT.schedule.filter(function (s) { return s.program.id === "muharram"; })[0];
  util.$$("[data-muharram-dates]").forEach(function (el) {
    if (!mSched || !mSched.next || !mSched.next.start) { el.hidden = true; return; }
    var n = mSched.next;
    el.innerHTML = util.esc(T.range(n.start, n.end)) + (n.confirmed ? "" : ' <span class="tag tag--expected">expected</span>');
  });
  util.$$("[data-muharram-cal]").forEach(function (el) {
    if (!mSched || !mSched.next || !mSched.next.start) { el.hidden = true; return; }
    el.innerHTML = cal.chooser("muharram-ten", eventsFor(mSched), "Add the ten days to my calendar");
  });

  /* ---- 4. muharram.html: schedule of the coming ten nights ------------- */
  var sched = util.$("[data-schedule] tbody");
  var up = AIAT.muharram && AIAT.muharram.upcoming;
  if (sched && up) {
    // Day 1 of Muharram of the coming season (confirmed date wins if given).
    var first = mSched && mSched.next && mSched.next.start;
    sched.innerHTML = up.nights.map(function (n) {
      var date = n.date ? T.pkDate(n.date) : (first ? T.addDays(first, n.night - 1) : null);
      var dateText = date ? util.esc(n.night + " Muharram · " + T.fmt(date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })) +
        (n.date ? "" : ' <span class="tag tag--expected">expected</span>') : n.night + " Muharram";
      return '<tr><th scope="row">Night ' + n.night + "</th><td>" + dateText + "</td>" +
        "<td" + (n.time ? ">" + util.esc(n.time) : ' class="muted">To be announced') + "</td>" +
        "<td" + (n.topic ? ">" + util.esc(n.topic) : ' class="muted">To be announced') + "</td></tr>";
    }).join("");
  }
})();
