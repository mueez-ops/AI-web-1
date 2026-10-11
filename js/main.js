/* =========================================================================
   AIAT — main.js
   Site-wide behaviour, used on every page:
   1. Small helpers (AIAT.util) and the merged data lists (AIAT.data)
   2. Preview banner (only while settings.showSamples is true)
   3. Settings binding: fills phone/email/links from data/settings.js and
      hides anything that depends on a value that is still empty
   4. Logo, image fallbacks
   5. Mobile menu
   6. Enrolment drawer (open/close, back button, #join deep link)
   7. Light YouTube embeds (load the player only when tapped)
   ========================================================================= */
(function () {
  "use strict";
  var S = AIAT.settings;

  /* ---- 1. Helpers ------------------------------------------------------- */
  var util = AIAT.util = {
    $: function (sel, root) { return (root || document).querySelector(sel); },
    $$: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },
    // Escape text before putting it into HTML.
    esc: function (str) {
      return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    },
    has: function (v) { return v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length); },
    icon: function (name, cls) { return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; },
    // Photo placeholder: an arch outline + a short label. Never a fake photo.
    ph: function (label) {
      return '<div class="ph" role="img" aria-label="' + util.esc(label) + ' (photo to come)">' +
        '<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M10 118V58C10 30 50 6 50 6s40 24 40 52v60"/><path d="M24 118V62c0-18 26-36 26-36s26 18 26 36v56"/><path d="M4 118h92"/></svg>' +
        '<span class="ph__label">' + util.esc(label) + "</span></div>";
    },
    // WhatsApp link with a pre-written message (empty string if no number).
    wa: function (text) {
      if (!util.has(S.whatsapp)) return "";
      return "https://wa.me/" + String(S.whatsapp).replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : "");
    },
    sampleTag: function (item) { return item && item.sample ? '<span class="tag tag--sample">Sample</span>' : ""; }
  };

  /* ---- Merged data: real items first, then samples (preview only) ------ */
  function withSamples(real, samples) {
    var list = (real || []).slice();
    if (S.showSamples && samples) {
      samples.forEach(function (s) { var c = {}; for (var k in s) c[k] = s[k]; c.sample = true; list.push(c); });
    }
    return list;
  }
  var samples = AIAT.samples || {};
  AIAT.data = {
    classes: withSamples(AIAT.classes, samples.classes),
    lectures: withSamples(AIAT.lectures, samples.lectures)
  };

  /* ---- 2. Preview banner ------------------------------------------------ */
  if (S.showSamples) {
    var banner = document.createElement("p");
    banner.className = "preview-banner";
    banner.textContent = "Preview: items marked SAMPLE are not real. Not for publishing.";
    document.body.insertBefore(banner, document.body.firstChild);
  }

  /* ---- 3. Settings binding ---------------------------------------------- */
  // data-requires="whatsapp email" → hidden unless every listed setting has a value
  util.$$("[data-requires]").forEach(function (el) {
    var ok = el.getAttribute("data-requires").split(/\s+/).every(function (k) { return util.has(S[k]); });
    if (!ok) el.hidden = true;
  });
  // data-unless="whatsapp" → shown only while that setting is still empty
  util.$$("[data-unless]").forEach(function (el) {
    if (util.has(S[el.getAttribute("data-unless")])) el.hidden = true;
  });
  // data-bind="email" → text content; links get the right href
  util.$$("[data-bind]").forEach(function (el) {
    var key = el.getAttribute("data-bind"), v = S[key];
    if (!util.has(v)) return;
    el.textContent = v;
    if (el.tagName === "A") {
      if (key === "email") el.href = "mailto:" + v;
      else if (key === "phone") el.href = "tel:" + String(v).replace(/[^\d+]/g, "");
    }
  });
  // data-href="youtubeUrl" → link target
  util.$$("[data-href]").forEach(function (el) {
    var v = S[el.getAttribute("data-href")];
    if (util.has(v)) el.href = v;
  });
  // data-wa="message" → WhatsApp link with a pre-written message
  util.$$("[data-wa]").forEach(function (el) {
    var link = util.wa(el.getAttribute("data-wa"));
    if (link) { el.href = link; el.target = "_blank"; el.rel = "noopener"; }
  });
  // Full address line
  util.$$("[data-address]").forEach(function (el) {
    el.textContent = [S.address, S.city, S.region, S.country].filter(util.has).join(", ");
  });
  // data-count-from="studentsTaught" → Proof number (the fact stays hidden until set)
  util.$$("[data-count-from]").forEach(function (el) {
    var v = S[el.getAttribute("data-count-from")];
    if (util.has(v)) { el.setAttribute("data-count", v); el.textContent = Number(v).toLocaleString("en"); }
  });
  // Opening hours table
  util.$$("[data-hours]").forEach(function (el) {
    if (!util.has(S.openingHours)) return;
    el.innerHTML = '<table class="hours"><caption class="visually-hidden">Opening hours</caption><tbody>' +
      S.openingHours.map(function (r) { return '<tr><th scope="row">' + util.esc(r[0]) + "</th><td>" + util.esc(r[1]) + "</td></tr>"; }).join("") +
      "</tbody></table>";
  });
  // Map: embedded only when an embed URL is set (no third-party load otherwise)
  util.$$("[data-map]").forEach(function (el) {
    if (!util.has(S.mapEmbedUrl)) return;
    el.innerHTML = '<iframe class="map-frame" src="' + util.esc(S.mapEmbedUrl) + '" title="Map showing the institute in Quetta" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  });

  /* ---- 4. Logo and image fallbacks -------------------------------------- */
  // Empty photo slots (photos not supplied yet) get the placeholder.
  util.$$("[data-ph-slot]").forEach(function (el) { el.outerHTML = util.ph(el.getAttribute("data-ph-slot")); });
  if (util.has(S.logo)) {
    util.$$(".brand__mark").forEach(function (mark) {
      var img = document.createElement("img");
      img.className = "brand__logo"; img.src = S.logo; img.alt = S.name + " logo"; img.height = 48;
      mark.replaceWith(img);
    });
  }
  // A photo that fails to load (not yet approved / not in the repo) becomes a placeholder.
  function swapBroken(img) {
    var fig = img.closest("[data-ph]");
    if (!fig || fig.getAttribute("data-swapped")) return;
    fig.setAttribute("data-swapped", "1");
    fig.innerHTML = util.ph(fig.getAttribute("data-ph"));
    fig.classList.remove("photo");
  }
  util.$$("[data-ph] img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) swapBroken(img);
    img.addEventListener("error", function () { swapBroken(img); });
  });

  /* ---- Dialog helpers: open/close with a short transition -------------- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function openDialog(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { requestAnimationFrame(function () { dlg.classList.add("is-open"); }); });
  }
  function closeDialog(dlg) {
    if (!dlg.open) return;
    dlg.classList.remove("is-open");
    var done = function () { dlg.close(); document.documentElement.style.overflow = ""; };
    if (reduce) done(); else setTimeout(done, 300);
  }
  // Esc fires "cancel": run our close (with transition) instead.
  function wireEsc(dlg, fn) { dlg.addEventListener("cancel", function (e) { e.preventDefault(); fn(); }); }
  // Click on the dark backdrop closes.
  function wireBackdrop(dlg, fn) { dlg.addEventListener("click", function (e) { if (e.target === dlg) fn(); }); }

  /* ---- 5. Mobile menu --------------------------------------------------- */
  var menu = util.$("#menu");
  if (menu) {
    var closeMenu = function () { closeDialog(menu); };
    util.$$("[data-menu-open]").forEach(function (b) { b.addEventListener("click", function (e) { e.preventDefault(); openDialog(menu); }); });
    util.$$("[data-menu-close]", menu).forEach(function (b) { b.addEventListener("click", closeMenu); });
    util.$$("a", menu).forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("is-open"); menu.close(); document.documentElement.style.overflow = ""; }); });
    wireEsc(menu, closeMenu);
  }

  /* ---- 6. Enrolment drawer ---------------------------------------------- */
  var drawer = util.$("#join");
  AIAT.drawer = {
    open: function (classId) {
      if (!drawer) return;
      var sel = util.$("#e-class", drawer);
      if (sel && classId) sel.value = classId;
      if (location.hash !== "#join") history.pushState({ drawer: true }, "", "#join");
      if (menu && menu.open) { menu.close(); }
      openDialog(drawer);
      setTimeout(function () { var f = util.$("#e-name", drawer); if (f) f.focus(); }, reduce ? 0 : 120);
    },
    close: function () {
      if (!drawer || !drawer.open) return;
      // If we added #join to history, going back removes it and closes the drawer.
      if (history.state && history.state.drawer) history.back();
      else { closeDialog(drawer); if (location.hash === "#join") history.replaceState(null, "", location.pathname + location.search); }
    }
  };
  if (drawer) {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-join]");
      if (!t) return;
      e.preventDefault();
      AIAT.drawer.open(t.getAttribute("data-class") || "");
    });
    util.$$("[data-drawer-close]", drawer).forEach(function (b) { b.addEventListener("click", AIAT.drawer.close); });
    wireEsc(drawer, AIAT.drawer.close);
    wireBackdrop(drawer, AIAT.drawer.close);
    // Back button closes the drawer; forward re-opens it.
    window.addEventListener("popstate", function () {
      if (location.hash === "#join") openDialog(drawer); else closeDialog(drawer);
    });
    // Deep link: a shared link ending in #join opens the drawer.
    if (location.hash === "#join") { history.replaceState(null, "", location.pathname + location.search); AIAT.drawer.open(""); }
  }

  /* ---- 7. Light YouTube embeds ------------------------------------------ */
  AIAT.util.lite = function (item, label) {
    if (!util.has(item.youtubeId)) {
      return '<div class="lite-embed is-empty" role="img" aria-label="Recording to come">' +
        '<svg class="lite-embed__ph" viewBox="0 0 100 120" aria-hidden="true"><path d="M10 118V58C10 30 50 6 50 6s40 24 40 52v60"/><path d="M4 118h92"/></svg>' +
        '<span class="lite-embed__note">Recording to come</span>' +
        (item.duration ? '<span class="lite-embed__duration">' + util.esc(item.duration) + "</span>" : "") + "</div>";
    }
    var id = util.esc(item.youtubeId);
    return '<button class="lite-embed" type="button" data-yt="' + id + '" aria-label="Play: ' + util.esc(label) + '">' +
      '<img src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">' +
      '<span class="lite-embed__play">' + '<svg class="icon" aria-hidden="true" style="fill:currentColor;stroke:none"><use href="#i-play"/></svg></span>' +
      (item.duration ? '<span class="lite-embed__duration">' + util.esc(item.duration) + "</span>" : "") + "</button>";
  };
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button.lite-embed[data-yt]");
    if (!btn) return;
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(btn.getAttribute("data-yt")) + "?autoplay=1&rel=0";
    frame.title = btn.getAttribute("aria-label").replace(/^Play: /, "");
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    frame.allowFullscreen = true;
    var wrap = document.createElement("div");
    wrap.className = "lite-embed";
    wrap.appendChild(frame);
    btn.replaceWith(wrap);
    frame.focus();
  });

  /* ---- Current year in footers ------------------------------------------ */
  util.$$("[data-current-year]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
