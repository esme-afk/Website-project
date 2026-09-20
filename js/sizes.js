/* =====================================================================
   Lone Wolf Hauling — Section 3: Dumpster Sizes
   Cards slide/rotate/fade into place as the section scrolls into view.
   Reveal-only (no pinning) so it never conflicts with the hero or Section 2
   ScrollTriggers and stays reliable/performant for GitHub Pages + GHL.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".dumpster-sizes");
    if (!section) return;

    var cards   = Array.prototype.slice.call(section.querySelectorAll(".dumpster-sizes__card"));
    var closing = section.querySelector(".dumpster-sizes__closing");

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

    // No GSAP or reduced motion → show everything in place (no animation)
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Cards: staggered slide + slight rotate + fade into place on enter
    gsap.set(cards, { opacity: 0, y: 80, rotateZ: function (i) { return i === 0 ? -5 : (i === cards.length - 1 ? 5 : 0); }, transformOrigin: "bottom center" });
    ScrollTrigger.batch(cards, {
      start: "top 86%",
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, rotateZ: 0, duration: 0.9, ease: "power3.out", stagger: 0.14, overwrite: true });
      },
      onLeaveBack: function (batch) {
        gsap.to(batch, { opacity: 0, y: 80, duration: 0.4, ease: "power2.in", overwrite: true });
      }
    });

    // Closing CTA: simple fade-up
    if (closing) {
      gsap.set(closing, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: closing,
        start: "top 90%",
        onEnter:    function () { gsap.to(closing, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }); },
        onLeaveBack: function () { gsap.to(closing, { opacity: 0, y: 40, duration: 0.35, ease: "power2.in" }); }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
