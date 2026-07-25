/* =====================================================================
   Lone Wolf Hauling — Section 2: Service Pillars
   Scroll-driven 2-column showcase. Right red panel stays pinned while the
   active service line is highlighted and the matching left image fades in.

   Performance: the image crossfade + active highlight are driven by CSS
   transitions toggled on a class — we only touch the DOM when the active
   index actually changes (not every scroll frame), which keeps it smooth.
   Independent of the hero's ScrollTriggers (lower refreshPriority so the
   hero's pin spacing is calculated first and Section 2 starts after it).
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".services");
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll(".svc-item"));
    var imgs  = Array.prototype.slice.call(section.querySelectorAll(".svc-img"));
    var N = items.length;
    if (!N) return;

    function show(idx) {
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === idx); });
      imgs.forEach(function (im, i) { im.classList.toggle("is-shown", i === idx); });
    }
    show(0);

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;             // static first service
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var mm = gsap.matchMedia();

    /* ---------- DESKTOP: pin section, advance active service on scroll ---------- */
    mm.add("(min-width: 861px)", function () {
      var current = 0;
      var st = ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: function () { return "+=" + (window.innerHeight * (N + 0.5)); }, // slow / premium
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: function (self) {
          var idx = Math.round(self.progress * (N - 1));
          if (idx !== current) { current = idx; show(idx); }   // only on change
        }
      });
      return function () { st.kill(); };
    });

    /* ---------- MOBILE: sticky image, per-item triggers swap active ---------- */
    mm.add("(max-width: 860px)", function () {
      var trigs = items.map(function (it, i) {
        return ScrollTrigger.create({
          trigger: it,
          start: "top 62%",
          end: "bottom 42%",
          onEnter: function () { show(i); },
          onEnterBack: function () { show(i); }
        });
      });
      return function () { trigs.forEach(function (t) { t.kill(); }); };
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
