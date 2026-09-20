/* =====================================================================
   Lone Wolf Hauling — Section 5: Testimonials
   The background image stays still (CSS sticky) while three glass cards
   float up over it, revealing one-by-one as the user scrolls. Reverses
   naturally on scroll up. Reveal-only (no pinning) so it can't conflict
   with the hero / Section 2 ScrollTriggers; reliable for GoHighLevel.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".testimonials-section");
    if (!section) return;

    var cards = Array.prototype.slice.call(
      section.querySelectorAll(".testimonials-section__card")
    );
    if (!cards.length) return;

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // cards visible by default
    }
    gsap.registerPlugin(ScrollTrigger);

    // Hold the background still: position:fixed while the section is in view,
    // resting at the bottom on exit. (Avoids the overflow-x:hidden sticky bug.)
    var bg = section.querySelector(".testimonials-section__bg");
    function setBg(state) {
      if (!bg) return;
      bg.classList.toggle("is-fixed", state === "fixed");
      bg.classList.toggle("is-bottom", state === "bottom");
    }
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onEnter:      function () { setBg("fixed"); },
      onLeave:      function () { setBg("bottom"); },
      onEnterBack:  function () { setBg("fixed"); },
      onLeaveBack:  function () { setBg("top"); }
    });

    cards.forEach(function (card) {
      gsap.set(card, { opacity: 0, y: 64 });
      ScrollTrigger.create({
        trigger: card,
        start: "top 84%",
        onEnter: function () {
          gsap.to(card, {
            opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
            // hand transform back to CSS so the resting tilt + hover work
            onComplete: function () { gsap.set(card, { clearProps: "transform" }); }
          });
        },
        onLeaveBack: function () {
          gsap.to(card, { opacity: 0, y: 64, duration: 0.4, ease: "power2.in" });
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
