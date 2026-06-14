/* =====================================================================
   Lone Wolf Hauling — Hero
   Scroll-driven frame animation on a plain 2D <canvas> (no Three.js).

   • The 360° truck reveal plays FORWARD as you scroll down and REVERSES
     as you scroll up (GSAP ScrollTrigger `scrub`).
   • Each frame is painted with ctx.drawImage — no WebGL, no pixel reads,
     so the cross-origin R2 frames render without needing CORS headers.
   • The canvas uses CSS mix-blend-mode:multiply so the frames' white
     background drops out, letting the BACK headline show through and the
     truck sit in front of it. A masked FRONT headline copy crosses over
     the truck body for a layered 3D depth effect.
   • Scroll speed is intentionally slowed by 40%.
   ===================================================================== */
(function () {
  "use strict";

  /* ----------------------------- Config ---------------------------- */
  var FRAME_COUNT  = 145;
  // Pre-keyed transparent WebP frames, hosted same-origin (no CORS issues),
  // so the truck is a real cutout that occludes the headline behind it.
  var FRAMES_BASE  = "assets/frames-web/";
  var FRAME_PATH   = function (i) {
    return FRAMES_BASE + "frame_" + String(i).padStart(4, "0") + ".webp";
  };

  // 1.0 = normal scroll, 0.6 = 40% slower (sequence takes ~167% of scroll)
  var SPEED_FACTOR = 0.6;
  var scrollLength = function () { return (window.innerHeight * 3) / SPEED_FACTOR; };

  /* ------------------------------ DOM ------------------------------ */
  var canvas     = document.getElementById("heroCanvas");
  var loaderEl   = document.getElementById("heroLoader");
  var loaderFill = document.getElementById("heroLoaderFill");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var images = new Array(FRAME_COUNT);
  var seq = { frame: 0 };
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------- Rendering --------------------------- */
  // Truck is drawn "contain" (never cropped) and scaled down with generous
  // margins so it can't crop on any viewport. Shifted toward the LEFT so the
  // right-side headline stays clear and readable.
  function truckScale() { return window.innerWidth > 860 ? 0.82 : 0.92; }
  function truckShiftX() { return window.innerWidth > 860 ? -0.15 : 0; } // fraction of width

  function drawFrame(index) {
    var img = images[Math.round(index)];
    var w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);   // transparent — let the hero gradient show
    if (!img || !img.naturalWidth) return;

    var fit = Math.min(w / img.naturalWidth, h / img.naturalHeight) * truckScale();
    var dw = img.naturalWidth * fit;
    var dh = img.naturalHeight * fit;
    var dx = (w - dw) / 2 + w * truckShiftX();
    var dy = (h - dh) / 2;
    // HARD CLAMP inside the canvas — cropping is now mathematically impossible
    // (dw <= w and dh <= h because scale < 1 with a contain fit).
    dx = Math.max(0, Math.min(dx, w - dw));
    dy = Math.max(0, Math.min(dy, h - dh));
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    drawFrame(seq.frame);
  }

  /* --------------------------- Preloading -------------------------- */
  // NOTE: no img.crossOrigin — drawImage works with cross-origin images
  // and we never call getImageData, so CORS headers aren't required.
  function preload() {
    return new Promise(function (resolve) {
      var loaded = 0;
      var done = function () {
        loaded++;
        if (loaderFill) loaderFill.style.width = (loaded / FRAME_COUNT) * 100 + "%";
        if (loaded === FRAME_COUNT) resolve();
      };
      for (var i = 0; i < FRAME_COUNT; i++) {
        (function (i) {
          var img = new Image();
          img.decoding = "async";
          img.onload = function () { images[i] = img; done(); };
          img.onerror = function () { images[i] = null; done(); };
          img.src = FRAME_PATH(i + 1);
        })(i);
      }
    });
  }

  /* --------------------------- Animation --------------------------- */
  function buildScroll() {
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) { drawFrame(0); return; }
    gsap.registerPlugin(ScrollTrigger);

    var lines = gsap.utils.toArray(".hero__headline .hl-inner");

    if (prefersReduced) {
      // No motion: show the truck + everything in place.
      drawFrame(0);
      return;
    }

    // Hidden starting state for the choreographed reveals
    gsap.set(lines, { yPercent: 120, opacity: 0 });
    gsap.set(".hero__card", { y: 60, autoAlpha: 0 });

    // One timeline scrubbed by the pinned scroll drives EVERYTHING:
    //   • the truck frame sequence (forward on down / reverse on up)
    //   • each headline line sliding up in sequence
    //   • the body card + CTA appearing last (once you've scrolled through)
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: function () { return "+=" + scrollLength(); },
        scrub: 0.6,
        pin: ".hero__stage",
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Frame sequence spans the whole timeline (0 → 10 units)
    tl.to(seq, {
      frame: FRAME_COUNT - 1,
      snap: { frame: 1 },
      duration: 10,
      onUpdate: function () { drawFrame(seq.frame); }
    }, 0);

    // Headline lines reveal one after another as you scroll
    lines.forEach(function (ln, i) {
      tl.to(ln, { yPercent: 0, opacity: 1, ease: "power3.out", duration: 1.1 }, 0.4 + i * 1.5);
    });

    // Body card + CTA — the last thing to appear, near the end of the scroll
    tl.to(".hero__card", { y: 0, autoAlpha: 1, ease: "power3.out", duration: 1.6 }, 7.6);

    ScrollTrigger.refresh();
  }

  /* ----------------------------- Boot ------------------------------ */
  resize();
  window.addEventListener("resize", resize);

  function start() {
    preload().then(function () {
      drawFrame(0);
      if (loaderEl) loaderEl.classList.add("is-done");
      buildScroll();
      requestAnimationFrame(function () {
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
