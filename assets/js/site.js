/* =========================================================================
   AIAT website — site.js
   1. Hero video: poster first, then the real clip, looped with a soft
      crossfade (two layers). Picks the best version the browser can play.
      Never loads with reduced motion or Data Saver. Pauses off-screen.
   2. "From the crowd to the minbar": scroll moves the photo toward the
      minbar on wide screens. Phones and reduced motion get a still photo.
   3. Ask form: checks the fields, then opens WhatsApp with the message.
   4. Small things: subject links pre-fill the form, menu closes on tap,
      optional links (YouTube, map) appear once set in config.js.
   ========================================================================= */
(function () {
  "use strict";
  var C = window.AIAT || {};
  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- 1. Hero video ----------------------------------------------------- */
  (function hero() {
    var box = document.querySelector("[data-hero]");
    if (!box) return;
    var layers = box.querySelectorAll(".hero__video");
    var toggle = document.querySelector("[data-video-toggle]");
    var label = document.querySelector("[data-video-label]");
    var conn = navigator.connection || {};
    if (reduceQuery.matches || conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")) return;

    // Choose the version: HDR where possible, 4K only on large screens.
    var big = Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1) > 2200 && window.innerWidth >= 900;
    var probe = document.createElement("video");
    var can = function (type) { return probe.canPlayType(type) === "probably" || probe.canPlayType(type) === "maybe"; };
    // Candidates in order of preference; if one fails to load, the next is tried.
    var list = [];
    if (can('video/mp4; codecs="av01.0.12M.10"')) list.push(big ? "hero-4k-av1-hdr.mp4" : "hero-1080-av1-hdr.mp4", "hero-1080-av1-hdr.mp4");
    if (can('video/mp4; codecs="hvc1.2.4.L153.B0"')) list.push(big ? "hero-4k-hevc-hdr.mp4" : "hero-1080-hevc-hdr.mp4", "hero-1080-hevc-hdr.mp4");
    list.push("hero-1080-h264-sdr.mp4");
    list = list.filter(function (f, i) { return list.indexOf(f) === i; }).map(function (f) { return "media/web/" + f; });
    var src = list.shift();

    var A = layers[0], B = layers[1], fading = false, paused = false, visible = true, raf = 0;
    var FADE = 0.6; // seconds of crossfade at the loop point

    // A version that can't load: move to the next one. If none work, the poster stays.
    A.addEventListener("error", function () {
      if (!list.length || A.classList.contains("is-on")) return;
      src = list.shift();
      [A, B].forEach(function (v) { v.src = src; });
      A.play().catch(function () {});
    });

    function start() {
      [A, B].forEach(function (v) { v.src = src; v.preload = "auto"; });
      A.addEventListener("playing", function onFirst() {
        A.removeEventListener("playing", onFirst);
        A.classList.add("is-on");
        if (toggle) toggle.hidden = false;
        tick();
      });
      A.play().catch(function () { /* autoplay refused: the poster stays, which is fine */ });
    }

    // Watch the clock; shortly before the end, start the other layer and fade.
    function tick() {
      cancelAnimationFrame(raf);
      if (paused || !visible) return;
      if (!fading && A.duration && A.currentTime >= A.duration - FADE) {
        fading = true;
        B.currentTime = 0;
        B.play().then(function () {
          B.classList.add("is-on");
          A.classList.remove("is-on");
          setTimeout(function () {
            A.pause();
            var t = A; A = B; B = t;   // swap roles
            fading = false;
          }, FADE * 1000);
        }).catch(function () { fading = false; A.currentTime = 0; });
      }
      raf = requestAnimationFrame(tick);
    }

    function setPlaying(on) {
      paused = !on;
      if (on && visible) { A.play().catch(function () {}); tick(); }
      else { A.pause(); B.pause(); cancelAnimationFrame(raf); }
      if (toggle) {
        toggle.setAttribute("aria-pressed", String(!on));
        label.textContent = on ? "Pause the video" : "Play the video";
      }
    }
    if (toggle) toggle.addEventListener("click", function () { setPlaying(paused); });

    // Pause when the hero is off-screen or the tab is hidden.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        visible = e[0].isIntersecting;
        if (paused || !A.src) return;
        if (visible) { A.play().catch(function () {}); tick(); } else { A.pause(); B.pause(); }
      }).observe(box);
    }
    document.addEventListener("visibilitychange", function () {
      if (!A.src || paused) return;
      if (document.hidden) { A.pause(); B.pause(); } else if (visible) { A.play().catch(function () {}); tick(); }
    });
    // If the visitor switches on reduced motion, stop.
    reduceQuery.addEventListener && reduceQuery.addEventListener("change", function (e) { if (e.matches) setPlaying(false); });

    // Start after the page has loaded, so the poster and text come first.
    if (document.readyState === "complete") start(); else window.addEventListener("load", start);
  })();

  /* ---- 2. From the crowd to the minbar ---------------------------------- */
  (function night() {
    var section = document.querySelector("[data-night]");
    if (!section) return;
    var img = section.querySelector(".night__img");
    var lines = section.querySelectorAll(".night__line");
    var wide = window.matchMedia("(min-width: 900px)");
    var raf = 0, active = false;

    function update() {
      raf = 0;
      var r = section.getBoundingClientRect();
      var span = section.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (span || 1)));
      var eased = 1 - Math.pow(1 - p, 2);
      img.style.transform = "scale(" + (1 + 0.45 * eased).toFixed(4) + ")";
      // Heading and first line show at once; the next lines join in turn.
      lines.forEach(function (el, i) { el.classList.toggle("is-shown", i <= 1 || p >= (i - 1) * 0.3); });
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }

    function apply() {
      var on = wide.matches && !reduceQuery.matches;
      if (on === active) return;
      active = on;
      section.classList.toggle("is-zoom", on);
      if (on) { window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll); update(); }
      else {
        window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
        img.style.transform = "";
        lines.forEach(function (el) { el.classList.remove("is-shown"); });
      }
    }
    apply();
    wide.addEventListener && wide.addEventListener("change", apply);
    reduceQuery.addEventListener && reduceQuery.addEventListener("change", apply);
  })();

  /* ---- 3. Ask form → WhatsApp ------------------------------------------- */
  (function ask() {
    var form = document.querySelector("[data-ask]");
    if (!form) return;
    var status = form.querySelector("[data-status]");
    var checked = false;

    function check(input) {
      var field = input.closest(".field");
      var bad = !input.checkValidity() || (input.required && !input.value.trim());
      field.classList.toggle("is-bad", bad);
      input.setAttribute("aria-invalid", String(bad));
      var err = field.querySelector(".err");
      if (err) err.hidden = !bad;
      return !bad;
    }
    var required = form.querySelectorAll("[required]");
    required.forEach(function (input) {
      input.addEventListener("input", function () { if (checked) check(input); });
      input.addEventListener("change", function () { if (checked) check(input); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      checked = true;
      var first = null;
      required.forEach(function (input) { if (!check(input) && !first) first = input; });
      if (first) { first.focus(); return; }

      var v = function (name) { var el = form.elements[name]; return el ? String(el.value).trim() : ""; };
      var lines = [
        "Assalamu alaikum. My name is " + v("name") + ".",
        "I would like to ask about: " + v("subject") + ".",
        "I would study: " + v("mode") + "."
      ];
      if (v("place")) lines.push("I live in: " + v("place") + ".");
      if (v("message")) lines.push(v("message"));
      var url = "https://wa.me/" + (C.whatsappDigits || "923158455594") + "?text=" + encodeURIComponent(lines.join("\n"));

      window.open(url, "_blank", "noopener");
      status.innerHTML = "WhatsApp should now open with your message ready to send. If it didn't, " +
        '<a href="' + url + '" target="_blank" rel="noopener">tap here to open it</a>, or message ' +
        '<a href="https://wa.me/' + (C.whatsappDigits || "923158455594") + '" target="_blank" rel="noopener">' + (C.whatsappDisplay || "+92 315 8455594") + "</a> directly.";
      status.hidden = false;
      status.focus();
    });
  })();

  /* ---- 4. Small things --------------------------------------------------- */
  // "Ask about Tajweed classes" etc. pre-fill the form's subject.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-subject]");
    if (!a) return;
    var sel = document.getElementById("f-subject");
    if (sel) { sel.value = a.getAttribute("data-subject"); sel.dispatchEvent(new Event("change")); }
  });
  // Close the phone menu after choosing a section.
  var menu = document.querySelector(".nav__menu");
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest("a")) menu.open = false; });
  // Optional links appear only once their address is set in config.js.
  if (C.youtubeUrl) document.querySelectorAll("[data-youtube]").forEach(function (a) { a.href = C.youtubeUrl; a.hidden = false; });
  if (C.mapUrl) {
    document.querySelectorAll("[data-map]").forEach(function (a) { a.href = C.mapUrl; a.hidden = false; });
    document.querySelectorAll("[data-map-missing]").forEach(function (p) { p.hidden = true; });
  }
})();
