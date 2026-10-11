/* =========================================================================
   AIAT — now.js
   Everything to do with time:
   1. AIAT.time — Hijri/Gregorian helpers (Umm al-Qura + hijriOffsetDays)
   2. AIAT.schedule — the next date of every program, live windows
   3. The "now" strip (8.1): today's dates, Quetta prayer times (Aladhan,
      cached for the day, hidden if the request fails), next program
      countdown, Live now badge
   4. Today's Hijri date anywhere on the page ([data-hijri-today])
   ========================================================================= */
(function () {
  "use strict";
  var S = AIAT.settings, util = AIAT.util;
  var TZ = S.timezone || "Asia/Karachi";
  var DAY = 864e5;

  /* ---- 1. Time helpers -------------------------------------------------- */
  var hijriFmt = new Intl.DateTimeFormat("en-GB-u-ca-islamic-umalqura", { day: "numeric", month: "numeric", year: "numeric", timeZone: TZ });
  var hijriLong = new Intl.DateTimeFormat("en-GB-u-ca-islamic-umalqura", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
  var pkYMD = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: TZ });

  var T = AIAT.time = {
    monthNames: ["Muharram", "Safar", "Rabiʻ I", "Rabiʻ II", "Jumada I", "Jumada II", "Rajab", "Shaʻban", "Ramadan", "Shawwal", "Dhu al-Qaʻdah", "Dhu al-Hijjah"],
    monthNamesAr: ["محرّم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
    // Hijri day/month/year for a moment, after the local moon-sighting offset.
    hijri: function (date) {
      var shifted = new Date(date.getTime() + (S.hijriOffsetDays || 0) * DAY);
      var p = {};
      hijriFmt.formatToParts(shifted).forEach(function (x) { p[x.type] = x.value; });
      return { day: +p.day, month: +p.month, year: parseInt(p.year, 10) };
    },
    hijriLabel: function (date) {
      return hijriLong.format(new Date(date.getTime() + (S.hijriOffsetDays || 0) * DAY));
    },
    // "YYYY-MM-DD" of a moment in Pakistan.
    ymd: function (date) { return pkYMD.format(date); },
    // Midday in Pakistan on a "YYYY-MM-DD" date (safe for day maths).
    pkDate: function (ymd) { return new Date(ymd + "T12:00:00+05:00"); },
    // "YYYY-MM-DDTHH:MM" in Pakistan time → Date.
    pkDateTime: function (s) { return new Date(s.length === 16 ? s + ":00+05:00" : s); },
    addDays: function (d, n) { return new Date(d.getTime() + n * DAY); },
    // Next date (on/after `from`) whose Hijri month/day match. Searches ~13 months.
    findHijri: function (month, day, from) {
      var d = T.pkDate(T.ymd(from));
      for (var i = 0; i < 400; i++) {
        var h = T.hijri(d);
        if (h.month === month && h.day === day) return d;
        d = T.addDays(d, 1);
      }
      return null;
    },
    // Last date of a Hijri date range starting at `start` (handles 29-day months).
    rangeEnd: function (start, month, endDay) {
      var end = start, d = start;
      for (var i = 0; i < 35; i++) {
        var h = T.hijri(d);
        if (h.month !== month || h.day > endDay) break;
        end = d; d = T.addDays(d, 1);
      }
      return end;
    },
    fmt: function (date, opts) {
      var o = { timeZone: TZ }; for (var k in opts) o[k] = opts[k];
      return new Intl.DateTimeFormat("en-GB", o).format(date);
    },
    // "Mon 8 Feb 2027" or "8–15 Feb 2027" style ranges.
    range: function (a, b) {
      var full = { day: "numeric", month: "short", year: "numeric" };
      if (!b || T.ymd(a) === T.ymd(b)) return T.fmt(a, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
      var sameMonth = T.fmt(a, { month: "short", year: "numeric" }) === T.fmt(b, { month: "short", year: "numeric" });
      return (sameMonth ? T.fmt(a, { day: "numeric" }) : T.fmt(a, { day: "numeric", month: "short" })) + "–" + T.fmt(b, full);
    },
    // Is this a Muharram-mode page view? (?season=muharram|normal forces it for previews)
    isMuharram: function () { return document.documentElement.classList.contains("is-muharram"); }
  };

  /* ---- 2. Schedule: next occurrence of every program ------------------- */
  var now = new Date();
  var today = T.pkDate(T.ymd(now));

  function nextOccurrence(p) {
    // Confirmed Gregorian dates win, while they are still current.
    if (p.confirmed && p.confirmed.start) {
      var cs = T.pkDate(p.confirmed.start), ce = T.pkDate(p.confirmed.end || p.confirmed.start);
      if (ce >= today) return { start: cs, end: ce, confirmed: true, hijriMonth: T.hijri(cs).month };
    }
    if (p.hijri) {
      var span = p.hijri.endDay - p.hijri.startDay;
      // Search from `span` days ago so a program in progress is still "this" occurrence.
      var start = T.findHijri(p.hijri.month, p.hijri.startDay, T.addDays(today, -span));
      if (!start) return null;
      var end = T.rangeEnd(start, p.hijri.month, p.hijri.endDay);
      if (end < today) start = T.findHijri(p.hijri.month, p.hijri.startDay, T.addDays(today, 1)), end = start && T.rangeEnd(start, p.hijri.month, p.hijri.endDay);
      return start ? { start: start, end: end, confirmed: false, hijriMonth: p.hijri.month } : null;
    }
    if (p.gregorian) {
      // Month known, days not yet: no exact date, no countdown.
      var y = +T.ymd(now).slice(0, 4), m = p.gregorian.month;
      if (+T.ymd(now).slice(5, 7) > m) y += 1;
      var mid = T.pkDate(y + "-" + String(m).padStart(2, "0") + "-15");
      return { start: null, end: null, monthOnly: T.fmt(mid, { month: "long", year: "numeric" }), confirmed: false, hijriMonth: T.hijri(mid).month };
    }
    return null;
  }

  AIAT.schedule = (AIAT.programs || []).map(function (p) {
    return { program: p, next: nextOccurrence(p) };
  });

  // Live windows from programs.js and muharram.js.
  AIAT.liveNow = (function () {
    var windows = [];
    (AIAT.programs || []).forEach(function (p) { (p.live || []).forEach(function (w) { windows.push({ name: p.name, w: w }); }); });
    var up = AIAT.muharram && AIAT.muharram.upcoming;
    if (up) up.nights.forEach(function (n) { if (n.liveStart && n.liveEnd) windows.push({ name: "Muharram, night " + n.night, w: { start: n.liveStart, end: n.liveEnd } }); });
    for (var i = 0; i < windows.length; i++) {
      var w = windows[i].w;
      if (w.start && w.end && now >= T.pkDateTime(w.start) && now <= T.pkDateTime(w.end)) return { name: windows[i].name, url: S.youtubeLiveUrl || S.youtubeUrl || "" };
    }
    return null;
  })();

  /* ---- 4. Today's date anywhere ----------------------------------------- */
  util.$$("[data-hijri-today]").forEach(function (el) { el.textContent = T.hijriLabel(now); });
  util.$$("[data-greg-today]").forEach(function (el) { el.textContent = T.fmt(now, { weekday: "long", day: "numeric", month: "long", year: "numeric" }); });

  /* ---- Live badge -------------------------------------------------------- */
  util.$$("[data-live]").forEach(function (slot) {
    if (!AIAT.liveNow) return;
    var L = AIAT.liveNow;
    slot.innerHTML = L.url
      ? '<a class="now__live" href="' + util.esc(L.url) + '" target="_blank" rel="noopener"><span class="tag tag--live">Live now</span> <span>' + util.esc(L.name) + ' on YouTube</span></a>'
      : '<span class="now__live"><span class="tag tag--live">Live now</span> <span>' + util.esc(L.name) + "</span></span>";
    slot.hidden = false;
  });

  /* ---- 3a. Prayer times (Aladhan) --------------------------------------- */
  var prayerCell = util.$("[data-prayers-cell]");
  if (prayerCell) {
    var list = util.$("[data-prayers]", prayerCell);
    var names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var P = S.prayer || {};
    var dmy = T.ymd(now).split("-").reverse().join("-");
    var cacheKey = "aiat-prayers-" + dmy + "-" + P.method + "-" + P.city;

    var render = function (t) {
      var nowHM = T.fmt(new Date(), { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
      var nextIdx = names.findIndex(function (n) { return t[n].slice(0, 5) > nowHM; });
      if (nextIdx === -1) nextIdx = 0; // after Isha, Fajr is next
      list.innerHTML = names.map(function (n, i) {
        var hm = t[n].slice(0, 5).split(":"), h = +hm[0];
        var label = ((h + 11) % 12 + 1) + ":" + hm[1] + (h < 12 ? " am" : " pm");
        return "<li" + (i === nextIdx ? ' aria-current="time"' : "") + ">" + n + " <b>" + label + "</b></li>";
      }).join("");
      prayerCell.hidden = false;
    };

    var cached = null;
    try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch (e) { /* storage blocked */ }
    if (cached) render(cached);
    else {
      var url = "https://api.aladhan.com/v1/timingsByCity/" + dmy + "?city=" + encodeURIComponent(P.city) +
        "&country=" + encodeURIComponent(P.country) + "&method=" + encodeURIComponent(P.method);
      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
      fetch(url, ctrl ? { signal: ctrl.signal } : {})
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (json) {
          clearTimeout(timer);
          var t = json && json.data && json.data.timings;
          if (!t || !t.Fajr) throw new Error("bad data");
          try {
            // Keep only today's entry.
            Object.keys(localStorage).forEach(function (k) { if (k.indexOf("aiat-prayers-") === 0) localStorage.removeItem(k); });
            localStorage.setItem(cacheKey, JSON.stringify(t));
          } catch (e) { /* storage blocked: fine */ }
          render(t);
        })
        .catch(function () { prayerCell.hidden = true; }); // never show broken content
    }
  }

  /* ---- 3b. Next program + countdown ------------------------------------- */
  var nextCell = util.$("[data-next-program]");
  if (nextCell) {
    var upcoming = AIAT.schedule.filter(function (s) { return s.next && s.next.start; })
      .sort(function (a, b) { return a.next.start - b.next.start; });
    var nx = upcoming[0];
    if (!nx) { nextCell.hidden = true; }
    else {
      var p = nx.program, n = nx.next;
      var running = n.start <= today && n.end >= today;
      var days = Math.round((n.start - today) / DAY);
      var when = running ? "Happening now" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : "In " + days + " days";
      util.$("[data-next-name]", nextCell).innerHTML = p.link
        ? '<a href="' + util.esc(p.link) + '">' + util.esc(p.name) + "</a>" : util.esc(p.name);
      util.$("[data-next-when]", nextCell).innerHTML =
        "<strong>" + when + "</strong> · " + T.range(n.start, n.end) +
        (n.confirmed ? "" : ' <span class="tag tag--expected" title="The date depends on the moon sighting">expected</span>');
    }
  }

  /* ---- Muharram mode details: "Night N of 10" when it applies --------- */
  util.$$("[data-muharram-day]").forEach(function (el) {
    var h = T.hijri(now);
    el.textContent = h.month === 1 ? h.day + " Muharram " + h.year + (h.day <= 10 ? " · day " + h.day + " of the ten" : "") : T.hijriLabel(now);
  });
})();
