/* Reviews marquee — duplicate each row's cards so the slide loops seamlessly. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  Array.prototype.forEach.call(document.querySelectorAll(".tm__track"), function (track) {
    track.innerHTML += track.innerHTML;
  });
})();
