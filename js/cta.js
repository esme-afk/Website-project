/* =====================================================================
   Lone Wolf Hauling — Final CTA
   Subtle one-time entrance: container slides up, form fields stagger in,
   image reveals. Reveal-only (no pinning) so it can't conflict with the
   other sections.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".final-cta");
    if (!section) return;

    // Keep the form from reloading the page on submit (real handler / GHL
    // form gets wired in later). No fake messaging.
    var form = section.querySelector(".final-cta__form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // visible by default
    }
    gsap.registerPlugin(ScrollTrigger);

    var container = section.querySelector(".final-cta__container");
    var bits = Array.prototype.slice.call(
      section.querySelectorAll(".final-cta__headline, .final-cta__sub, .final-cta__field, .final-cta__submit, .final-cta__phone")
    );
    var media = section.querySelector(".final-cta__media");

    gsap.set(container, { opacity: 0, y: 60 });
    gsap.set(bits, { opacity: 0, y: 24 });
    if (media) gsap.set(media, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(container, { opacity: 1, y: 0, duration: 0.8 })
          .to(bits, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
          .to(media, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
