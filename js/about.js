/* =====================================================================
   Lone Wolf Hauling — Section 4: Get To Know Us
   Quiet, premium reveal: the photo eases in while the copy fades up in a
   short stagger. Reveal-only (no pinning) so it can't conflict with the
   hero / Section 2 / Section 3 ScrollTriggers.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".about");
    if (!section) return;

    var media = section.querySelector(".about__media");
    var bits  = Array.prototype.slice.call(
      section.querySelectorAll(".about__rule, .about__title, .about__body p, .about__cta")
    );

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // everything visible by default
    }
    gsap.registerPlugin(ScrollTrigger);

    if (media) gsap.set(media, { opacity: 0, y: 48 });
    gsap.set(bits, { opacity: 0, y: 28 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      once: false,
      onEnter: function () {
        if (media) gsap.to(media, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
        gsap.to(bits, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12, delay: 0.15 });
      },
      onLeaveBack: function () {
        if (media) gsap.to(media, { opacity: 0, y: 48, duration: 0.4, ease: "power2.in" });
        gsap.to(bits, { opacity: 0, y: 28, duration: 0.3, ease: "power2.in" });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
