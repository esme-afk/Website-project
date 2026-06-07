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
  var FRAME_COUNT  = 169;
  var FRAMES_BASE  = "https://pub-5aff009cfde149179ad8598d6f4b228e.r2.dev/frames/";
  var FRAME_PATH   = function (i) {
    return FRAMES_BASE + "frame_" + String(i).padStart(4, "0") + ".jpg";
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
  // Draw the current frame "contain"-fitted and centered on white.
  function drawFrame(index) {
    var img = images[Math.round(index)];
    var w = canvas.width, h = canvas.height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    if (!img || !img.naturalWidth) return;

    var fit = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    var dw = img.naturalWidth * fit;
    var dh = img.naturalHeight * fit;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
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

    if (prefersReduced) { drawFrame(0); return; } // static first frame

    // 1) Scrubbed frame sequence — forward on down, reverse on up,
    //    while the stage is pinned in place.
    gsap.to(seq, {
      frame: FRAME_COUNT - 1,
      ease: "none",
      snap: { frame: 1 },
      onUpdate: function () { drawFrame(seq.frame); },
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

    // 2) Subtle parallax — BOTH headline layers move together (identical
    //    transform) so the front/back copies stay perfectly registered;
    //    the drift is relative to the truck, which deepens the layering.
    gsap.to(".hero__headline", {
      yPercent: -7, ease: "none",
      scrollTrigger: {
        trigger: ".hero", start: "top top",
        end: function () { return "+=" + scrollLength(); },
        scrub: 1, invalidateOnRefresh: true
      }
    });

    // Intro for the CTA once frames are ready
    gsap.from(".hero__cta", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });

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
