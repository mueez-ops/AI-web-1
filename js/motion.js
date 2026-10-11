/* =========================================================================
   AIAT — motion.js
   1. Decides whether motion is allowed (respects prefers-reduced-motion).
   2. Reveals [data-reveal] blocks as they enter the screen.
   3. Runs the pinned Proof sequence (8.2) with GSAP + ScrollTrigger on
      desktop; phones get simple reveals; reduced motion gets nothing.
   4. The Year (8.4): on desktop, pins the timeline and moves it sideways
      as you scroll down. Without GSAP / with reduced motion it stays a
      normal sideways-scrolling strip.
   5. Muharram teaser (8.5): the photo settles slowly as it scrolls in.
   6. Ten nights journey (muharram.html): the large night number follows
      the step you are reading (no GSAP needed).
   Content is visible without this file — it only adds motion on top.
   ========================================================================= */
(function () {
  "use strict";

  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var motionOk = !reduceQuery.matches;

  /* ---- 1. Motion flag on <html> — CSS only animates under .motion-ok ---- */
  if (motionOk) document.documentElement.classList.add("motion-ok");

  /* ---- 2. Reveal on enter (no library needed) --------------------------- */
  function initReveals() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!motionOk || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Count-up helper: animates a number from 0 to its final value ----- */
  // Time-based, never tied to scroll position, so a number can never rest on
  // a wrong value if the visitor stops scrolling mid-count. Runs once per
  // element. Only elements with data-count are counted; years (e.g. 1992)
  // simply appear — counting up to a year reads oddly.
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var end = parseFloat(el.getAttribute("data-count"));
    var o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.1, ease: "power2.out",
      onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString("en"); },
      onComplete: function () { el.textContent = end.toLocaleString("en"); }
    });
  }

  /* ---- 3. Proof sequence ------------------------------------------------ */
  function initProof() {
    var section = document.querySelector("[data-proof]");
    if (!section) return;
    var counters = section.querySelectorAll("[data-count]");

    // No GSAP (CDN blocked/offline) or reduced motion: leave the plain list.
    if (!motionOk || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var mm = gsap.matchMedia();

    // Desktop (768px+): pin the section and step through facts on scroll.
    mm.add("(min-width: 768px)", function () {
      section.classList.add("is-pinned");
      // Facts whose number isn't confirmed yet are [hidden] — skip them and their media.
      var facts = gsap.utils.toArray(section.querySelectorAll(".proof__fact:not([hidden])"));
      var media = gsap.utils.toArray(section.querySelectorAll(".proof__media > :not([hidden])"));
      // One progress tick per visible fact.
      var rail = section.querySelector(".proof__rail");
      if (rail) rail.innerHTML = facts.map(function () { return '<span class="proof__tick"><span></span></span>'; }).join("");
      var ticks = gsap.utils.toArray(section.querySelectorAll(".proof__tick span"));
      var steps = facts.length;

      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=" + steps * 70 + "%",   // ~0.7 screen of scroll per fact
          pin: section.querySelector(".proof__inner"),
          scrub: 0.6,
          anticipatePin: 1
        }
      });

      facts.forEach(function (fact, i) {
        var at = i;                          // one timeline unit per fact
        var num = fact.querySelector("[data-count]");
        if (i > 0) {
          // previous fact leaves, this one arrives
          tl.to(facts[i - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, at - 0.35)
            .fromTo(fact, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at - 0.05);
          if (media[i]) tl.to(media[i], { autoAlpha: 1, duration: 0.4 }, at - 0.2);
        }
        if (num) tl.call(countUp, [num], at - 0.05);  // count starts as the fact arrives
        if (ticks[i]) tl.to(ticks[i], { scaleX: 1, duration: 0.6 }, at);
      });
      tl.to({}, { duration: 0.4 });          // short hold on the last fact

      // Undo everything if the screen drops below 768px.
      return function () {
        section.classList.remove("is-pinned");
        counters.forEach(function (n) { n.textContent = n.getAttribute("data-count"); });
      };
    });

    // Phones: no pinning. Numbers count up once as they scroll into view.
    mm.add("(max-width: 767px)", function () {
      counters.forEach(function (num) {
        ScrollTrigger.create({ trigger: num, start: "top 85%", once: true, onEnter: function () { countUp(num); } });
      });
    });
  }

  /* ---- 4. The Year: vertical scroll drives the horizontal timeline ----- */
  function initYear() {
    var section = document.querySelector("[data-year]");
    if (!section || !motionOk || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.matchMedia().add("(min-width: 1024px)", function () {
      var track = section.querySelector("[data-year-track]");
      var viewport = section.querySelector("[data-year-viewport]");
      var inner = section.querySelector(".year__inner");
      section.classList.add("is-driven");
      viewport.scrollLeft = 0;
      var distance = function () { return Math.max(0, track.scrollWidth - viewport.clientWidth); };
      gsap.to(track, {
        x: function () { return -distance(); },
        ease: "none",
        scrollTrigger: {
          trigger: inner,
          start: "top top",
          end: function () { return "+=" + distance(); },
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });
      return function () { section.classList.remove("is-driven"); gsap.set(track, { clearProps: "transform" }); };
    });
  }

  /* ---- 5. Muharram teaser: slow settle of the photo ------------------- */
  function initTeaser() {
    var photo = document.querySelector("[data-settle] img");
    if (!photo || !motionOk || !window.gsap || !window.ScrollTrigger) return;
    gsap.fromTo(photo, { scale: 1.08 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: photo.closest("[data-settle]"), start: "top bottom", end: "center center", scrub: true }
    });
  }

  /* ---- 6. Ten nights journey: sticky numeral follows the active step --- */
  function initJourney() {
    var num = document.querySelector("[data-journey-num]");
    var steps = document.querySelectorAll("[data-night]");
    if (!num || !steps.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var n = entry.target.getAttribute("data-night");
        if (num.textContent === n) return;
        if (motionOk) {
          num.style.opacity = "0";
          setTimeout(function () { num.textContent = n; num.style.opacity = "1"; }, 250);
        } else num.textContent = n;
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---- Start ------------------------------------------------------------ */
  function start() { initReveals(); initProof(); initYear(); initTeaser(); initJourney(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
