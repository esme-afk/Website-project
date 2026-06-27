/* =====================================================================
   Lone Wolf Hauling — Before / After Image Slider
   Drag or tap the handle to compare before and after images.
   Left of handle = BEFORE · Right of handle = AFTER
   ===================================================================== */
(function () {
  "use strict";

  var slider   = document.querySelector(".ba-slider");
  if (!slider) return;

  var beforeEl = slider.querySelector(".ba-before");
  var handle   = slider.querySelector(".ba-handle");
  var dragging = false;

  function setPosition(clientX) {
    var rect = slider.getBoundingClientRect();
    var pct  = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    // Clip the BEFORE layer from the right so it only covers the left portion
    beforeEl.style.clipPath = "inset(0 " + (100 - pct).toFixed(1) + "% 0 0)";
    handle.style.left = pct.toFixed(1) + "%";
  }

  /* ---- Mouse ---- */
  handle.addEventListener("mousedown", function (e) {
    dragging = true;
    e.preventDefault();
  });
  document.addEventListener("mousemove", function (e) {
    if (dragging) setPosition(e.clientX);
  });
  document.addEventListener("mouseup", function () { dragging = false; });

  /* ---- Touch ---- */
  handle.addEventListener("touchstart", function (e) {
    dragging = true;
    e.preventDefault();
  }, { passive: false });
  document.addEventListener("touchmove", function (e) {
    if (dragging) setPosition(e.touches[0].clientX);
  }, { passive: false });
  document.addEventListener("touchend", function () { dragging = false; });

  /* ---- Click anywhere on slider to jump ---- */
  slider.addEventListener("click", function (e) {
    setPosition(e.clientX);
  });

  /* ---- Init at 50% ---- */
  (function () {
    var rect = slider.getBoundingClientRect();
    setPosition(rect.left + rect.width * 0.5);
  })();
})();
