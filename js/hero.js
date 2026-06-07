/* =====================================================================
   Lone Wolf Hauling — Hero
   Scroll-driven frame animation rendered with Three.js.

   • The 360° truck reveal plays FORWARD as you scroll down and REVERSES
     as you scroll up (GSAP ScrollTrigger `scrub`).
   • Frames are drawn onto an offscreen 2D canvas ("contain" on white),
     fed to Three.js as a CanvasTexture on a full-screen quad.
   • Scroll speed is intentionally slowed by 40%.
   • The headline gets a subtle parallax against the truck.
   ===================================================================== */

import * as THREE from "three";

/* ----------------------------- Config ------------------------------ */
const FRAME_COUNT = 169;                       // frames in /assets/frames
const FRAME_PATH  = (i) =>
  `assets/frames/frame_${String(i).padStart(4, "0")}.jpg`;

// Scroll distance that the pinned sequence occupies.
// BASE feels natural for this many frames; dividing by 0.6 makes the
// whole thing 40% SLOWER (it now takes ~167% of the original scroll).
const speedFactor = 0.6;                        // 1.0 = normal, 0.6 = −40%
const scrollLength = () => (window.innerHeight * 3) / speedFactor;

// Nudge the truck toward the right so it clears the center-left headline.
const truckShiftX = () => (window.innerWidth > 860 ? window.innerWidth * 0.14 : 0);
const truckScale  = () => (window.innerWidth > 860 ? 1.02 : 0.96);

const prefersReduced =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------- DOM --------------------------------- */
const canvas      = document.getElementById("heroCanvas");
const loaderEl    = document.getElementById("heroLoader");
const loaderFill  = document.getElementById("heroLoaderFill");
const scrollCue   = document.getElementById("scrollCue");

/* ----------------------- Offscreen frame canvas -------------------- */
const frameCanvas = document.createElement("canvas");
const fctx = frameCanvas.getContext("2d");

/* ----------------------------- Three.js ---------------------------- */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setClearColor(0xffffff, 1);

const scene  = new THREE.Scene();
// Orthographic clip-space camera + a 2×2 plane = a perfect full-screen quad.
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const texture = new THREE.CanvasTexture(frameCanvas);
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.generateMipmaps = false;

const quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({ map: texture })
);
scene.add(quad);

/* ----------------------------- State ------------------------------- */
const images = new Array(FRAME_COUNT);
const seq = { frame: 0 };          // tweened by ScrollTrigger
let dpr = Math.min(window.devicePixelRatio || 1, 2);

/* Draw the current frame, contained on white, shifted right of headline */
function drawFrame(index) {
  const img = images[Math.round(index)];
  const w = frameCanvas.width;
  const h = frameCanvas.height;

  fctx.fillStyle = "#ffffff";
  fctx.fillRect(0, 0, w, h);
  if (!img) return;

  const fit = Math.min(w / img.width, h / img.height) * truckScale();
  const dw = img.width * fit;
  const dh = img.height * fit;
  const dx = (w - dw) / 2 + truckShiftX() * dpr;
  const dy = (h - dh) / 2;

  fctx.drawImage(img, dx, dy, dw, dh);
  texture.needsUpdate = true;
  renderer.render(scene, camera);
}

/* ----------------------------- Resize ------------------------------ */
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);

  frameCanvas.width  = Math.round(w * dpr);
  frameCanvas.height = Math.round(h * dpr);

  drawFrame(seq.frame);
}

/* --------------------------- Preloading ---------------------------- */
function preload() {
  return new Promise((resolve) => {
    let loaded = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        images[i] = img.naturalWidth ? img : null;
        loaded++;
        if (loaderFill) loaderFill.style.width = (loaded / FRAME_COUNT) * 100 + "%";
        if (loaded === FRAME_COUNT) resolve();
      };
      img.src = FRAME_PATH(i + 1);
    }
  });
}

/* --------------------------- Animation ----------------------------- */
function buildScrollAnimation() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!gsap || !ScrollTrigger) {
    // Library CDN unavailable — degrade gracefully to the first frame.
    console.warn("[hero] GSAP/ScrollTrigger not found; static hero shown.");
    drawFrame(0);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  if (prefersReduced) {
    drawFrame(0);
    return;
  }

  // 1) The scrubbed frame sequence (forward on down, reverse on up)
  gsap.to(seq, {
    frame: FRAME_COUNT - 1,
    ease: "none",
    snap: { frame: 1 },
    onUpdate: () => drawFrame(seq.frame),
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: () => "+=" + scrollLength(),
      scrub: 0.7,                 // smoothing gives the reverse a nice glide
      pin: ".hero__stage",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (scrollCue) scrollCue.classList.toggle("is-hidden", self.progress > 0.02);
      },
    },
  });

  // 2) Subtle headline parallax — each element drifts up at its own rate
  gsap.utils.toArray("[data-parallax]").forEach((el) => {
    const factor = parseFloat(el.dataset.parallax) || 0.1;
    gsap.to(el, {
      yPercent: -factor * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: () => "+=" + scrollLength(),
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  });

  // 3) Gently fade the copy out as the reveal completes
  gsap.to(".hero__content", {
    autoAlpha: 0.15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: () => "top+=" + scrollLength() * 0.55 + " top",
      end: () => "+=" + scrollLength() * 0.4,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  // Intro: ease the headline + CTA in once frames are ready
  gsap.from(".hero__eyebrow, .hero__headline, .hero__cta", {
    y: 26,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    delay: 0.1,
  });

  ScrollTrigger.refresh();
}

/* ----------------------------- Boot -------------------------------- */
function reveal() {
  if (loaderEl) loaderEl.classList.add("is-done");
}

resize();
window.addEventListener("resize", resize);

preload().then(() => {
  drawFrame(0);
  reveal();
  buildScrollAnimation();
  // a second refresh after layout settles avoids first-paint offset
  requestAnimationFrame(() => window.ScrollTrigger && window.ScrollTrigger.refresh());
});
