/* =====================================================================
   Lone Wolf Hauling — Footer
   Subtle fade-up reveal of the footer columns + watermark on scroll.
   Reveal-only (no pinning); won't conflict with other sections.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var footer = document.querySelector(".site-footer");
    if (!footer) return;

    var bits = Array.prototype.slice.call(
      footer.querySelectorAll(".site-footer__brand, .site-footer__col, .site-footer__watermark, .site-footer__bottom")
    );

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // visible by default
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(bits, { opacity: 0, y: 36 });
    ScrollTrigger.create({
      trigger: footer,
      start: "top 82%",
      once: true,
      onEnter: function () {
        gsap.to(bits, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
