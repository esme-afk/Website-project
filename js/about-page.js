/* =====================================================================
   Lone Wolf Hauling — About Page entrance animations
   Runs GSAP hero stagger + ScrollTrigger section reveals.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var gsap          = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;

    if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ---- Hero entrance (fires once on load) ---- */
    var eyebrow  = document.querySelector(".about-hero__eyebrow");
    var lines    = Array.from(document.querySelectorAll(".about-hero__headline-line"));
    var body     = document.querySelector(".about-hero__body");
    var ctas     = document.querySelector(".about-hero__ctas");
    var media    = document.querySelector(".about-hero__media");

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (eyebrow)     tl.from(eyebrow,  { y: 20, opacity: 0, duration: 0.65 });
    if (lines.length) tl.from(lines,   { y: 56, opacity: 0, duration: 0.9, stagger: 0.13 }, "-=0.35");
    if (body)         tl.from(body,    { y: 24, opacity: 0, duration: 0.7 }, "-=0.55");
    if (ctas)         tl.from(ctas,    { y: 18, opacity: 0, duration: 0.6 }, "-=0.45");
    if (media)        tl.from(media,   { x: 50, opacity: 0, duration: 1.1 }, 0.25);

    /* ---- BA section header reveal on scroll ---- */
    if (!ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var baHead = document.querySelector(".ba-section__head");
    if (baHead) {
      gsap.from(Array.from(baHead.children), {
        y: 32, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: baHead, start: "top 82%", once: true }
      });
    }

    var baSlider = document.querySelector(".ba-slider");
    if (baSlider) {
      gsap.from(baSlider, {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: baSlider, start: "top 88%", once: true }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
