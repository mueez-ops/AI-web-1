/* =========================================================================
   AIAT — classes.js
   8.3 Learn — the class finder.
   - Filter chips (subject, mode, level, age group) built from the data
   - Filters are kept in the address bar (?subject=Tajweed) so a filtered
     list can be shared on WhatsApp
   - Time-zone switch: Pakistan time ⇄ the visitor's own time zone
   - "Request a seat" opens the enrolment drawer with the class chosen
   Also fills the class <select> in the enrolment drawer.
   ========================================================================= */
(function () {
  "use strict";
  var util = AIAT.util, T = AIAT.time, S = AIAT.settings;
  var classes = AIAT.data.classes;

  var MODE = { "in-person": "In person", online: "Online", both: "In person & online" };
  var STATUS = { open: ["Open", "tag--open"], soon: ["Starting soon", "tag--soon"], full: ["Full", "tag--full"] };

  /* ---- Drawer class list (every page) ---------------------------------- */
  var select = util.$("#e-class");
  if (select) {
    select.innerHTML = '<option value="">Not sure yet — please advise</option>' + classes.map(function (c) {
      return '<option value="' + util.esc(c.id) + '">' + util.esc(c.subject + (c.level ? " · " + c.level : "") + (c.sample ? " (sample)" : "")) + "</option>";
    }).join("");
  }

  var root = util.$("[data-finder]");
  if (!root) return;
  var grid = util.$("[data-finder-grid]", root);
  var filtersEl = util.$("[data-finder-filters]", root);
  var countEl = util.$("[data-finder-count]", root);
  var limit = parseInt(root.getAttribute("data-limit") || "0", 10);

  /* ---- Empty state: no classes in the data yet ------------------------- */
  if (!classes.length) {
    util.$$("[data-finder-tools]", root).forEach(function (el) { el.hidden = true; });
    grid.outerHTML =
      '<div class="empty"><h3>The class list is being updated</h3>' +
      "<p>Tell us what you would like to study and we will reply with the current times.</p>" +
      '<button class="btn btn--primary" type="button" data-join>Ask about a class</button></div>';
    return;
  }

  /* ---- Time zones ------------------------------------------------------- */
  var myZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  var samePK = (function () {
    var t = new Date();
    return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: S.timezone }).format(t) ===
      new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(t);
  })();
  var showMine = false;
  var tzSwitch = util.$("[data-tz-switch]", root), tzNote = util.$("[data-tz-note]", root);
  if (samePK) {
    if (tzSwitch) tzSwitch.hidden = true;
    if (tzNote) tzNote.textContent = "Times are in Pakistan time.";
  } else if (tzSwitch) {
    util.$("[data-tz-label]", tzSwitch).textContent = "My time (" + myZone.split("/").pop().replace(/_/g, " ") + ")";
    util.$$("input", tzSwitch).forEach(function (i) {
      i.addEventListener("change", function () {
        showMine = util.$("input:checked", tzSwitch).value === "me";
        tzNote.textContent = showMine ? "Times shown in your time zone (" + myZone.replace(/_/g, " ") + ")." : "Times shown in Pakistan time (PKT, UTC+5).";
        render();
      });
    });
  }

  // "17:00" Pakistan time → "12:00" (or "1:00 PM") in the visitor's zone, noting a day change.
  function fmtTime(hhmm) {
    if (!showMine) return hhmm;
    var p = hhmm.split(":"), pkDay = T.ymd(new Date()), ymd = pkDay.split("-");
    var instant = new Date(Date.UTC(+ymd[0], +ymd[1] - 1, +ymd[2], +p[0] - 5, +p[1]));
    var localDay = new Intl.DateTimeFormat("en-CA").format(instant);
    var label = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(instant);
    return label + (localDay > pkDay ? " (next day)" : localDay < pkDay ? " (day before)" : "");
  }

  /* ---- Filters ---------------------------------------------------------- */
  var groups = [
    { key: "subject", name: "Subject", values: uniq("subject") },
    { key: "mode", name: "Attend", values: ["in-person", "online"].filter(function (m) { return classes.some(function (c) { return c.mode === m || c.mode === "both"; }); }), label: function (v) { return MODE[v]; } },
    { key: "level", name: "Level", values: uniq("level") },
    { key: "ageGroup", name: "Ages", values: uniq("ageGroup") }
  ].filter(function (g) { return g.values.length > 1; });

  function uniq(k) {
    var seen = [];
    classes.forEach(function (c) { if (util.has(c[k]) && seen.indexOf(c[k]) === -1) seen.push(c[k]); });
    return seen;
  }

  // Current filter state, read from the address bar.
  var params = new URLSearchParams(location.search);
  var state = {};
  groups.forEach(function (g) { var v = params.get(g.key); state[g.key] = g.values.indexOf(v) > -1 ? v : ""; });

  function chip(g, value, text) {
    var on = state[g.key] === value;
    return '<button class="chip" type="button" aria-pressed="' + on + '" data-g="' + g.key + '" data-v="' + util.esc(value) + '">' +
      util.icon("check", "chip__tick") + util.esc(text) + "</button>";
  }
  function renderFilters() {
    filtersEl.innerHTML = groups.map(function (g) {
      return '<div class="finder__group"><p class="finder__group-name" id="fg-' + g.key + '">' + g.name + "</p>" +
        '<div class="cluster" role="group" aria-labelledby="fg-' + g.key + '">' +
        chip(g, "", "All") + g.values.map(function (v) { return chip(g, v, g.label ? g.label(v) : v); }).join("") +
        "</div></div>";
    }).join("");
  }
  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    state[b.getAttribute("data-g")] = b.getAttribute("data-v");
    // Keep the filter in the address bar (no new history entries).
    var q = new URLSearchParams(location.search);
    groups.forEach(function (g) { if (state[g.key]) q.set(g.key, state[g.key]); else q.delete(g.key); });
    var qs = q.toString();
    history.replaceState(history.state, "", location.pathname + (qs ? "?" + qs : "") + "#learn");
    renderFilters(); render();
    var again = util.$('.chip[data-g="' + b.getAttribute("data-g") + '"][data-v="' + b.getAttribute("data-v") + '"]', filtersEl);
    if (again) again.focus();
  });

  function matches(c) {
    return groups.every(function (g) {
      var v = state[g.key];
      if (!v) return true;
      if (g.key === "mode") return c.mode === v || c.mode === "both";
      return c[g.key] === v;
    });
  }

  /* ---- Cards ------------------------------------------------------------ */
  function card(c) {
    var st = STATUS[c.status] || STATUS.open;
    var full = c.status === "full";
    var when = (c.days || []).join(" · ") + (c.start ? " · " + fmtTime(c.start) + "–" + fmtTime(c.end) : "");
    return '<article class="card class-card" aria-labelledby="cls-' + util.esc(c.id) + '">' +
      '<div class="card__head"><h3 class="card__title" id="cls-' + util.esc(c.id) + '">' + util.esc(c.subject) + "</h3>" +
      '<div class="cluster" style="--cluster:.4rem;justify-content:flex-end">' + util.sampleTag(c) + '<span class="tag ' + st[1] + '">' + st[0] + "</span></div></div>" +
      (c.description ? '<p class="class-card__desc">' + util.esc(c.description) + "</p>" : "") +
      '<dl class="meta">' +
      (c.level ? "<dt>Level</dt><dd>" + util.esc(c.level) + "</dd>" : "") +
      (c.ageGroup ? "<dt>Ages</dt><dd>" + util.esc(c.ageGroup) + "</dd>" : "") +
      "<dt>Attend</dt><dd>" + (MODE[c.mode] || "") + "</dd>" +
      (when ? "<dt>When</dt><dd>" + util.esc(when) + "</dd>" : "") +
      (c.teacher ? "<dt>Teacher</dt><dd>" + util.esc(c.teacher) + "</dd>" : "") +
      "</dl>" +
      '<div class="card__foot">' + (full
        ? '<span class="finder__count">This class is full.</span><button class="link-arrow" type="button" data-join data-class="' + util.esc(c.id) + '">Join the waiting list ' + util.icon("arrow") + "</button>"
        : '<button class="btn btn--primary btn--sm" type="button" data-join data-class="' + util.esc(c.id) + '">Request a seat</button>') +
      "</div></article>";
  }

  function render() {
    var list = classes.filter(matches);
    var shown = limit ? list.slice(0, limit) : list;
    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><h3>No classes match these filters</h3><p>Try a different subject or level, or ask us directly.</p>' +
        '<div class="cluster"><button class="btn btn--secondary" type="button" data-clear>Show all classes</button><button class="btn btn--primary" type="button" data-join>Ask about a class</button></div></div>';
    } else {
      grid.innerHTML = shown.map(card).join("");
    }
    countEl.textContent = list.length === classes.length
      ? "Showing all " + classes.length + " classes"
      : "Showing " + list.length + " of " + classes.length + " classes";
  }
  grid.addEventListener("click", function (e) {
    if (!e.target.closest("[data-clear]")) return;
    groups.forEach(function (g) { state[g.key] = ""; });
    history.replaceState(history.state, "", location.pathname + "#learn");
    renderFilters(); render();
  });

  renderFilters();
  render();
})();
