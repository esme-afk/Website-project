/* =====================================================================
   Lone Wolf Hauling — About Page hero entrance animation
   Gentle, premium fade-up of the heading, slider, and card on load.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var gsap = window.gsap;
    if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var eyebrow  = document.querySelector(".about-hero__eyebrow");
    var headline = document.querySelector(".about-hero__headline");
    var sub      = document.querySelector(".about-hero__sub");
    var slider   = document.querySelector(".ba-slider");
    var card     = document.querySelector(".about-hero__card");

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (eyebrow)  tl.from(eyebrow,  { y: 16, opacity: 0, duration: 0.6 });
    if (headline) tl.from(headline, { y: 28, opacity: 0, duration: 0.8 }, "-=0.35");
    if (sub)      tl.from(sub,      { y: 20, opacity: 0, duration: 0.7 }, "-=0.5");
    if (slider)   tl.from(slider,   { y: 40, opacity: 0, duration: 0.9 }, "-=0.4");
    if (card)     tl.from(card,     { y: 26, opacity: 0, duration: 0.7 }, "-=0.45");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
