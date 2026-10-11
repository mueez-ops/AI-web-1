/* =========================================================================
   AIAT — motion.js
   1. Decides whether motion is allowed (respects prefers-reduced-motion).
   2. Reveals [data-reveal] blocks as they enter the screen.
   3. Runs the pinned Proof sequence (8.2) with GSAP + ScrollTrigger on
      desktop; phones get simple reveals; reduced motion gets nothing.
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
      var facts = gsap.utils.toArray(section.querySelectorAll(".proof__fact"));
      var media = gsap.utils.toArray(section.querySelectorAll(".proof__media > *"));
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

  /* ---- Start ------------------------------------------------------------ */
  function start() { initReveals(); initProof(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
