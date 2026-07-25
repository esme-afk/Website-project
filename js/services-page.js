/* =====================================================================
   Lone Wolf Hauling — Services page
   Scroll reveals + ZIP form acknowledgements.
   ===================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reveals.length && !reduce && "IntersectionObserver" in window) {
    root.classList.add("has-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  Array.prototype.forEach.call(document.querySelectorAll('form[data-form="zip"]'), function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="zip"]');
      var msg = form.querySelector("[data-msg]");
      if (!msg) return;
      var zip = input && input.value.trim();
      msg.hidden = false;
      msg.textContent = zip
        ? "Thanks! Text or call (760) 208-3563 and we'll confirm availability and pricing for " + zip + "."
        : "Enter your ZIP code, or text us your city and project details at (760) 208-3563.";
    });
  });
})();
