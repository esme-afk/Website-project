/* =====================================================================
   Lone Wolf Hauling — Contact page
   Scroll reveals, FAQ accordion, and ZIP form acknowledgements.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- Scroll reveal ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reveals.length && !reduce && "IntersectionObserver" in window) {
    root.classList.add("has-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- FAQ accordion ---- */
  Array.prototype.forEach.call(document.querySelectorAll(".faq__item"), function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", open ? "true" : "false");
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
    });
  });
  // keep an open answer sized correctly on resize
  window.addEventListener("resize", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".faq__item.is-open .faq__a"), function (a) {
      a.style.maxHeight = a.scrollHeight + "px";
    });
  });

  /* ---- ZIP forms — acknowledge without a backend ---- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-form="zip"]'), function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="zip"]');
      var msg = form.querySelector("[data-msg]");
      if (!msg) return;
      var zip = input && input.value.trim();
      msg.hidden = false;
      msg.textContent = zip
        ? "Thanks! Text or call (760) 208-3563 and we'll confirm availability and timing for " + zip + "."
        : "Enter your ZIP code, or text us your city and project details at (760) 208-3563.";
    });
  });
})();
