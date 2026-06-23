/* =====================================================================
   Lone Wolf Hauling — Section 2: Service Pillars
   Scroll-driven 2-column showcase. Right red panel stays pinned while the
   active service line is highlighted and the matching left image fades in.
   Self-contained; uses the global GSAP/ScrollTrigger, independent of the
   hero's ScrollTriggers.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".services");
    if (!section) return;

    var items = Array.prototype.slice.call(section.querySelectorAll(".svc-item"));
    var imgs  = Array.prototype.slice.call(section.querySelectorAll(".svc-img"));
    var list  = section.querySelector(".svc-list");
    var N = items.length;
    if (!N) return;

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

    function setActive(idx) {
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === idx); });
    }

    // No GSAP → static, first service shown
    if (!gsap || !ScrollTrigger) {
      setActive(0);
      imgs.forEach(function (im, i) { im.style.opacity = i === 0 ? "1" : "0"; im.style.transform = "none"; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Base state
    gsap.set(imgs, { autoAlpha: 0, scale: 1.12 });
    gsap.set(imgs[0], { autoAlpha: 1, scale: 1 });
    setActive(0);

    // Reduced motion → first service, no scroll animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var mm = gsap.matchMedia();

    /* ---------- DESKTOP: pinned, scrubbed crossfade + highlight ---------- */
    mm.add("(min-width: 861px)", function () {
      var st = ScrollTrigger.create({
        trigger: ".services",
        start: "top top",
        end: function () { return "+=" + (window.innerHeight * (N + 0.5)); }, // slow / premium
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress * (N - 1);              // continuous 0 .. N-1
          setActive(Math.round(p));
          gsap.set(list, { y: -22 * p });               // subtle upward drift
          imgs.forEach(function (im, i) {
            var d = Math.min(1, Math.abs(i - p));        // 0 = fully in, 1 = out
            gsap.set(im, { autoAlpha: 1 - d, scale: 1 + 0.12 * d });
          });
        }
      });
      return function () { st.kill(); };
    });

    /* ---------- MOBILE: sticky image, per-item triggers swap active ---------- */
    mm.add("(max-width: 860px)", function () {
      gsap.set(list, { y: 0 });
      gsap.set(imgs, { scale: 1 });
      function activate(i) {
        setActive(i);
        imgs.forEach(function (im, j) { gsap.to(im, { autoAlpha: j === i ? 1 : 0, duration: 0.45 }); });
      }
      activate(0);
      var trigs = items.map(function (it, i) {
        return ScrollTrigger.create({
          trigger: it,
          start: "top 62%",
          end: "bottom 42%",
          onEnter: function () { activate(i); },
          onEnterBack: function () { activate(i); }
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
