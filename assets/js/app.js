/* ==========================================================================
   app.js — Ali Ibn-e-Abitalib Islamic Institution
   Everything here is an enhancement: the page reads and works without it.
   With "reduce motion" switched on, nothing animates or pins.
   ========================================================================== */
(function () {
  "use strict";
  var C = window.AIAT || {};
  var root = document.documentElement;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wide = function () { return window.matchMedia("(min-width: 1000px)").matches; };
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var motion = !reduce && hasGsap;
  if (motion) { root.classList.add("motion"); gsap.registerPlugin(ScrollTrigger); }

  /* ---- Video sources: best version the browser can play ------------------ */
  var probe = document.createElement("video");
  var can = function (t) { var r = probe.canPlayType(t); return r === "probably" || r === "maybe"; };
  var AV1 = can('video/mp4; codecs="av01.0.12M.10"'), HEVC = can('video/mp4; codecs="hvc1.2.4.L153.B0"');
  var bigScreen = Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1) > 2200 && window.innerWidth >= 1000;
  var conn = navigator.connection || {};
  var saveData = !!conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "");
  function sources(name, has4k) {
    var list = [];
    if (AV1) { if (has4k && bigScreen) list.push(name + "-4k-av1-hdr.mp4"); list.push(name + "-1080-av1-hdr.mp4"); }
    if (HEVC) { if (has4k && bigScreen) list.push(name + "-4k-hevc-hdr.mp4"); list.push(name + "-1080-hevc-hdr.mp4"); }
    list.push(name + "-1080-h264-sdr.mp4");
    return list.map(function (f) { return "media/web/" + f; });
  }
  // Load a <video>, falling back to the next version if one fails.
  function load(video, list, onReady) {
    var i = 0;
    video.addEventListener("error", function () { if (++i < list.length) { video.src = list[i]; video.play().catch(function () {}); } });
    video.addEventListener("playing", function once() { video.removeEventListener("playing", once); video.classList.add("is-on"); if (onReady) onReady(); });
    video.src = list[0];
    video.preload = "auto";
  }
  var videosAllowed = !reduce && !saveData;

  /* ---- Smooth scroll (Lenis) --------------------------------------------- */
  var lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function goTo(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 }); else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1), target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    closeMenu();
    goTo(target);
    history.replaceState(null, "", "#" + id);
  });

  /* ---- Live clock in Quetta ---------------------------------------------- */
  var clockFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: C.timeZone || "Asia/Karachi" });
  function tickClock() { var t = clockFmt.format(new Date()); $$("[data-clock]").forEach(function (el) { el.textContent = t; }); }
  tickClock(); setInterval(tickClock, 15000);

  /* ---- Text that fills the full width ------------------------------------ */
  function fit() {
    $$("[data-fit]").forEach(function (el) {
      var inner = el.querySelector(".line > span") || el.firstElementChild;
      var box = el.parentElement.getBoundingClientRect().width - (el.classList.contains("foot__word") ? 0 : 0);
      var avail = el.getBoundingClientRect().width - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight);
      el.style.fontSize = "100px";
      var w = inner.getBoundingClientRect().width || inner.scrollWidth;
      if (w > 0) el.style.fontSize = (100 * (avail || box) / w * 0.995).toFixed(2) + "px";
    });
    if (hasGsap) ScrollTrigger.refresh();
  }

  /* ---- Decoding labels ---------------------------------------------------- */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/[]—·";
  function scramble(el) {
    var final = el.getAttribute("aria-label") || el.textContent;
    el.setAttribute("aria-label", final);
    if (reduce) return;
    var frame = 0, total = 24;
    (function step() {
      var out = "";
      for (var i = 0; i < final.length; i++) {
        var reveal = frame / total * final.length;
        out += (i < reveal || final[i] === " ") ? final[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (++frame <= total) requestAnimationFrame(step); else el.textContent = final;
    })();
  }
  if ("IntersectionObserver" in window) {
    var scrambleIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { scramble(e.target); scrambleIO.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$("[data-scramble]").forEach(function (el) { if (!el.closest("[data-loader]")) scrambleIO.observe(el); });
  }

  /* ---- Menu --------------------------------------------------------------- */
  var menu = $("[data-menu]"), menuBtn = $("[data-menu-open]");
  var menuLabel = menuBtn ? menuBtn.firstChild : null;
  function openMenu() {
    menu.hidden = false;
    if (menuLabel) menuLabel.textContent = "Close ";
    requestAnimationFrame(function () { menu.classList.add("is-open"); });
    menuBtn.setAttribute("aria-expanded", "true");
    if (lenis) lenis.stop();
    var first = menu.querySelector("a"); if (first) first.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    if (menuLabel) menuLabel.textContent = "Menu ";
    if (lenis) lenis.start();
    setTimeout(function () { menu.hidden = true; }, reduce ? 0 : 800);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
  $$("[data-menu-close]").forEach(function (b) { b.addEventListener("click", function () { closeMenu(); menuBtn.focus(); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && !menu.hidden) { closeMenu(); menuBtn.focus(); } });

  /* ---- Top bar follows the colour of the section beneath it ------------ */
  if (hasGsap) {
    $$("main > section, footer").forEach(function (sec) {
      var theme = sec.classList.contains("bone") ? "bone" : sec.classList.contains("teal") ? "teal" : "ink";
      ScrollTrigger.create({ trigger: sec, start: "top 40px", end: "bottom 40px", refreshPriority: -1, // after the pinned sections
        onToggle: function (st) { if (st.isActive) root.setAttribute("data-hud", theme); } });
    });
  }

  /* ---- Cursor and magnetic buttons (mouse only) -------------------------- */
  if (motion && finePointer) {
    var cur = $("[data-cursor]"), label = $("[data-cursor-label]");
    var cx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("pointermove", function (e) { cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var t = e.target.closest("[data-cursor-text]");
      if (t) { label.textContent = t.getAttribute("data-cursor-text"); cur.classList.add("has-label"); }
    });
    document.addEventListener("pointerout", function (e) {
      var t = e.target.closest("[data-cursor-text]");
      if (t && !t.contains(e.relatedTarget)) cur.classList.remove("has-label");
    });
    $$("[data-magnetic]").forEach(function (el) {
      var mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" }), my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3); my((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener("pointerleave", function () { mx(0); my(0); });
    });
  }

  /* ---- 00 Hero: video loop + veil ----------------------------------------- */
  var hero = $("[data-hero]");
  var heroVideos = $$(".hero__video", hero);
  var veil = null;
  var heroVideoReady = new Promise(function (resolve) {
    if (!videosAllowed || !heroVideos.length) return resolve();
    var A = heroVideos[0], B = heroVideos[1], list = sources("hero", true), FADE = 0.6, fading = false, raf = 0, visible = true;
    load(A, list, resolve);
    B.src = A.src; B.preload = "auto";
    A.addEventListener("error", function () { B.src = A.src; });
    setTimeout(resolve, 4000); // never hold the page for the video
    // Crossfade loop between the two layers, so the 4-second clip never "jumps".
    function tick() {
      raf = requestAnimationFrame(tick);
      if (!visible || fading || !A.duration || A.currentTime < A.duration - FADE) return;
      fading = true; B.currentTime = 0;
      B.play().then(function () {
        B.classList.add("is-on"); A.classList.remove("is-on");
        setTimeout(function () { A.pause(); var t = A; A = B; B = t; fading = false; }, FADE * 1000);
      }).catch(function () { fading = false; A.currentTime = 0; });
    }
    A.play().catch(function () {});
    tick();
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible) { A.play().catch(function () {}); if (veil) veil.play(); }
      else { A.pause(); B.pause(); if (veil) veil.pause(); }
    }).observe(hero);
  });
  if (motion && window.Veil) {
    veil = window.Veil.start($("[data-veil]"), hero);
    var hint = $("[data-hint]");
    if (veil) {
      if (!finePointer) hint.textContent = "Touch to light the night";
      veil.onFirstMove = function () { hint.classList.add("is-gone"); };
    } else hint.hidden = true;
  } else { var h0 = $("[data-hint]"); if (h0) h0.hidden = true; }

  /* ---- Preloader ---------------------------------------------------------- */
  var loader = $("[data-loader]");
  function revealHero() {
    $$(".hero__title .line").forEach(function (l, i) { setTimeout(function () { l.classList.add("is-in"); }, 120 + i * 140); });
    if (veil) veil.play();
  }
  if (loader) {
    loader.style.animation = "none";
    if (reduce) { loader.remove(); revealHero(); }
    else {
      var countEl = $("[data-count]", loader), shown = 0, target = 0, done = false, t0 = performance.now();
      scramble($(".loader__name", loader));
      var poster = $(".hero__poster");
      var steps = [
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise(function (r) { if (poster.complete) r(); else { poster.addEventListener("load", r); poster.addEventListener("error", r); } }),
        heroVideoReady
      ];
      steps.forEach(function (p) { p.then(function () { target += 100 / steps.length; }); });
      Promise.all(steps).then(function () { target = 100; });
      setTimeout(function () { target = 100; }, 6000);
      (function count() {
        shown += (target - shown) * 0.08 + (target > shown ? 0.25 : 0);
        shown = Math.min(shown, target);
        countEl.textContent = String(Math.round(shown)).padStart(3, "0");
        if (shown >= 99.5 && performance.now() - t0 > 1200 && !done) {
          done = true; countEl.textContent = "100";
          fit();
          setTimeout(function () { loader.classList.add("is-done"); revealHero(); setTimeout(function () { loader.remove(); }, 1200); }, 250);
          return;
        }
        requestAnimationFrame(count);
      })();
    }
  } else revealHero();

  /* ---- 01 Statement: words light up as you read --------------------------- */
  var words = $("[data-words]");
  if (words && motion) {
    // Wrap each word (keeping the italic word together) in a span.
    var parts = [];
    Array.prototype.slice.call(words.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w) return;
          if (/^\s+$/.test(w)) parts.push(document.createTextNode(" "));
          else { var s = document.createElement("span"); s.className = "w"; s.textContent = w; parts.push(s); }
        });
      } else { node.classList.add("w"); parts.push(node); }
    });
    words.textContent = "";
    parts.forEach(function (p) { words.appendChild(p); });
    var ws = $$(".w", words);
    ScrollTrigger.create({
      trigger: words, start: "top 80%", end: "bottom 45%", scrub: true,
      onUpdate: function (st) { var n = Math.round(st.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle("is-lit", i < n); }); }
    });
  }

  /* ---- 02 Classes: sideways on desktop ------------------------------------ */
  var track = $("[data-track]"), cards = $$(".card", track);
  function markActive() {
    var mid = window.innerWidth / 2, best = null, bestD = 1e9;
    cards.forEach(function (c) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bestD) { bestD = d; best = c; } });
    cards.forEach(function (c) { c.classList.toggle("is-active", c === best && !c.classList.contains("card--slot")); });
  }
  if (motion) {
    gsap.matchMedia().add("(min-width: 1000px)", function () {
      var tween = gsap.to(track, {
        x: function () { return -(track.scrollWidth - (window.innerWidth - track.getBoundingClientRect().left)) - 32; },
        ease: "none",
        scrollTrigger: { trigger: "[data-classes]", pin: ".classes__pin", start: "top top", end: function () { return "+=" + track.scrollWidth; }, scrub: 0.6, invalidateOnRefresh: true, onUpdate: markActive }
      });
      return function () { tween.kill(); gsap.set(track, { clearProps: "transform" }); };
    });
  }
  if ("IntersectionObserver" in window && !wide()) {
    var cardIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle("is-active", e.isIntersecting && !e.target.classList.contains("card--slot")); }); }, { rootMargin: "-40% 0px -40% 0px" });
    cards.forEach(function (c) { cardIO.observe(c); });
  }

  /* ---- 03 The ten nights: the window opens -------------------------------- */
  var nights = $("[data-nights]");
  var nightsVideo = $(".nights__video", nights);
  var textItems = $$("[data-nights-text] > *", nights);
  var ticks = $$(".ticks li", nights);
  if (motion) {
    gsap.matchMedia().add("(min-width: 1000px)", function () {
      var win = $("[data-window]", nights);
      var tl = gsap.timeline({ scrollTrigger: { trigger: nights, pin: ".nights__pin", start: "top top", end: "+=260%", scrub: 0.8,
        onUpdate: function (st) {
          var p = st.progress;
          textItems.forEach(function (el, i) { el.classList.toggle("is-in", p > 0.42 + i * 0.1); });
          ticks.forEach(function (t, i) { t.classList.toggle("is-on", p > 0.45 + i * 0.05); });
        } } });
      tl.fromTo(win, { clipPath: "inset(30% 34% 30% 34% round 20px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 }, 0)
        .to("[data-split-a]", { xPercent: -70, opacity: 0, ease: "power2.in", duration: 0.8 }, 0)
        .to("[data-split-b]", { xPercent: 70, opacity: 0, ease: "power2.in", duration: 0.8 }, 0)
        .fromTo(win, { "--shade": 0 }, { "--shade": 1, duration: 0.4 }, 0.7)
        .to({}, { duration: 1.2 });
      return function () { textItems.forEach(function (el) { el.classList.remove("is-in"); }); };
    });
  }
  if (!motion || !wide()) ticks.forEach(function (t) { t.classList.add("is-on"); });

  /* ---- Videos that play only while visible (nights + reel) ---------------- */
  if (videosAllowed && "IntersectionObserver" in window) {
    var lazy = [{ el: nightsVideo, name: "nights", k: true }].concat($$("[data-reel] video").map(function (v) { return { el: v, name: v.getAttribute("data-clip"), k: false }; }));
    var playIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) { var item = lazy.filter(function (x) { return x.el === v; })[0]; load(v, sources(item.name, item.k)); }
          v.play().catch(function () {});
        } else v.pause();
      });
    }, { rootMargin: "200px 0px", threshold: 0.15 });
    lazy.forEach(function (x) { if (x.el) playIO.observe(x.el); });
  }

  /* ---- Reel: drag sideways with the mouse --------------------------------- */
  var reel = $("[data-reel]");
  if (reel && finePointer) {
    var down = false, sx = 0, sl = 0, moved = false;
    reel.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = reel.scrollLeft; reel.classList.add("is-dragging"); });
    window.addEventListener("pointermove", function (e) { if (!down) return; var dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; reel.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", function () { if (!down) return; down = false; reel.classList.remove("is-dragging"); });
    reel.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  /* ---- 04 Marquee: speeds up with the scroll ------------------------------ */
  var rows = $$("[data-marquee]");
  if (motion && rows.length) {
    rows.forEach(function (row) { var s = row.firstElementChild; row.appendChild(s.cloneNode(true)); row.appendChild(s.cloneNode(true)); });
    var xs = rows.map(function () { return 0; }), onScreen = false;
    ScrollTrigger.create({ trigger: ".year", start: "top bottom", end: "bottom top", onToggle: function (st) { onScreen = st.isActive; } });
    gsap.ticker.add(function (time, dt) {
      if (!onScreen) return;
      var v = lenis ? Math.abs(lenis.velocity) : 0;
      rows.forEach(function (row, i) {
        var dir = parseFloat(row.getAttribute("data-marquee")), w = row.firstElementChild.getBoundingClientRect().width;
        xs[i] -= dir * (0.04 + v * 0.02) * dt;
        if (dir > 0 && xs[i] <= -w) xs[i] += w;
        if (dir < 0 && xs[i] >= 0) xs[i] -= w;
        row.style.transform = "translate3d(" + xs[i] + "px,0,0)";
      });
    });
    rows.forEach(function (row, i) { if (parseFloat(row.getAttribute("data-marquee")) < 0) xs[i] = -row.firstElementChild.getBoundingClientRect().width; });
  }

  /* ---- 06 Composer → WhatsApp -------------------------------------------- */
  var composer = $("[data-composer]");
  if (composer) composer.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = composer.elements;
    var name = String(f.name.value || "").trim();
    var text = "Assalamu alaikum." + (name ? " My name is " + name + "." : "") +
      " I would like to ask about " + f.about.value + ". I would study " + f.mode.value + ".";
    var url = "https://wa.me/" + (C.whatsappDigits || "923158455594") + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank", "noopener");
    var st = $("[data-status]", composer);
    st.innerHTML = 'WhatsApp should now open with your message. If it didn\'t, <a href="' + url + '" target="_blank" rel="noopener">open it here</a>.';
    st.hidden = false;
  });

  /* ---- Start -------------------------------------------------------------- */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
    // Refit once the display font has actually arrived (it may load after "ready").
    document.fonts.load('800 100px "Archivo"').then(fit).catch(function () {});
    document.fonts.addEventListener && document.fonts.addEventListener("loadingdone", fit);
  } else fit();
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fit, 150); });
  if (!loader) fit();
})();
