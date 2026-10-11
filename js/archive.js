/* =========================================================================
   AIAT — archive.js
   8.6 Library — the lecture archive.
   - Homepage: the latest few lectures ([data-library-latest])
   - library.html: search by title/topic, filter by year, occasion and
     speaker; the search is kept in the address bar so it can be shared
   - Videos use light embeds (thumbnail first, player on tap; see main.js)
   ========================================================================= */
(function () {
  "use strict";
  var util = AIAT.util, S = AIAT.settings;
  var lectures = AIAT.data.lectures.slice().sort(function (a, b) {
    return String(b.date || b.year || "").localeCompare(String(a.date || a.year || ""));
  });

  function card(l) {
    return '<article class="card lecture">' + util.lite(l, l.title) +
      '<div class="cluster" style="--cluster:.4rem">' + util.sampleTag(l) +
      (l.occasion ? '<span class="tag tag--open">' + util.esc(l.occasion) + "</span>" : "") + "</div>" +
      '<h3 class="card__title">' + util.esc(l.title) + "</h3>" +
      '<p class="lecture__meta">' + [l.speaker, l.year, (l.topics || []).join(", ")].filter(util.has).map(util.esc).join(" · ") + "</p>" +
      "</article>";
  }

  function emptyArchive() {
    return '<div class="empty" style="grid-column:1/-1"><h3>Recordings will appear here</h3>' +
      "<p>The lecture archive is being prepared.</p>" +
      (util.has(S.youtubeUrl) ? '<a class="btn btn--secondary" href="' + util.esc(S.youtubeUrl) + '" target="_blank" rel="noopener">' + util.icon("play") + "Watch on YouTube</a>" : "") +
      "</div>";
  }

  /* ---- Homepage: latest lectures ---------------------------------------- */
  util.$$("[data-library-latest]").forEach(function (el) {
    var n = parseInt(el.getAttribute("data-library-latest"), 10) || 3;
    el.innerHTML = lectures.length ? lectures.slice(0, n).map(card).join("") : emptyArchive();
  });

  /* ---- muharram.html: last season's ten nights, one step each ---------- */
  var journey = util.$("[data-journey]");
  var rec = AIAT.muharram && AIAT.muharram.recorded;
  if (journey && rec) {
    util.$$("[data-recorded-year]").forEach(function (el) { el.textContent = rec.hijriYear; });
    journey.innerHTML = rec.nights.map(function (n) {
      var label = "Night " + n.night + (n.topic ? ": " + n.topic : "");
      return '<li class="step" data-night="' + n.night + '">' +
        '<p class="step__n">Night ' + n.night + "</p>" +
        (n.date ? '<p class="step__date">' + util.esc(AIAT.time.fmt(AIAT.time.pkDate(n.date), { weekday: "long", day: "numeric", month: "long", year: "numeric" })) + "</p>" : "") +
        (n.topic ? '<p class="step__topic">' + util.esc(n.topic) + "</p>" : '<p class="step__topic is-missing">Topic to be added</p>') +
        (n.photo ? '<figure class="photo"><img src="' + util.esc(n.photo) + '" alt="' + util.esc(n.photoAlt || "") + '" loading="lazy" decoding="async" width="1600" height="900"></figure>' : "") +
        (n.youtubeId ? util.lite(n, label) : '<p class="step__date">Recording to be added</p>') +
        "</li>";
    }).join("");
  }

  /* ---- library.html: full archive --------------------------------------- */
  var root = util.$("[data-library]");
  if (!root) return;
  var grid = util.$("[data-library-grid]", root);
  var countEl = util.$("[data-library-count]", root);
  var q = util.$("#lib-q", root), fYear = util.$("#lib-year", root), fOcc = util.$("#lib-occasion", root), fSpk = util.$("#lib-speaker", root);

  if (!lectures.length) {
    util.$("[data-library-tools]", root).hidden = true;
    grid.innerHTML = emptyArchive();
    return;
  }

  function fill(select, key) {
    var vals = [];
    lectures.forEach(function (l) { var v = String(l[key] || ""); if (v && vals.indexOf(v) === -1) vals.push(v); });
    vals.sort(key === "year" ? function (a, b) { return b - a; } : undefined);
    select.innerHTML = '<option value="">All</option>' + vals.map(function (v) { return '<option value="' + util.esc(v) + '">' + util.esc(v) + "</option>"; }).join("");
  }
  fill(fYear, "year"); fill(fOcc, "occasion"); fill(fSpk, "speaker");

  // Restore from the address bar (?q=…&year=…).
  var params = new URLSearchParams(location.search);
  q.value = params.get("q") || "";
  [[fYear, "year"], [fOcc, "occasion"], [fSpk, "speaker"]].forEach(function (pair) {
    var v = params.get(pair[1]);
    if (v && util.$('option[value="' + CSS.escape(v) + '"]', pair[0])) pair[0].value = v;
  });

  function render() {
    var text = q.value.trim().toLowerCase();
    var list = lectures.filter(function (l) {
      if (fYear.value && String(l.year) !== fYear.value) return false;
      if (fOcc.value && l.occasion !== fOcc.value) return false;
      if (fSpk.value && l.speaker !== fSpk.value) return false;
      if (!text) return true;
      return [l.title, l.speaker, l.occasion].concat(l.topics || []).join(" ").toLowerCase().indexOf(text) > -1;
    });
    grid.innerHTML = list.length ? list.map(card).join("")
      : '<div class="empty" style="grid-column:1/-1"><h3>No lectures match</h3><p>Try a different word, or clear the filters.</p><button class="btn btn--secondary" type="button" data-lib-clear>Clear search and filters</button></div>';
    countEl.textContent = list.length === lectures.length ? lectures.length + " lectures" : list.length + " of " + lectures.length + " lectures";
    // Keep the search in the address bar.
    var p = new URLSearchParams();
    if (q.value.trim()) p.set("q", q.value.trim());
    if (fYear.value) p.set("year", fYear.value);
    if (fOcc.value) p.set("occasion", fOcc.value);
    if (fSpk.value) p.set("speaker", fSpk.value);
    var qs = p.toString();
    history.replaceState(history.state, "", location.pathname + (qs ? "?" + qs : ""));
  }

  var t;
  q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(render, 150); });
  [fYear, fOcc, fSpk].forEach(function (s) { s.addEventListener("change", render); });
  util.$("form", root).addEventListener("submit", function (e) { e.preventDefault(); render(); });
  grid.addEventListener("click", function (e) {
    if (!e.target.closest("[data-lib-clear]")) return;
    q.value = ""; fYear.value = ""; fOcc.value = ""; fSpk.value = "";
    render(); q.focus();
  });
  render();
})();
