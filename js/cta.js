/* =====================================================================
   Lone Wolf Hauling — Final CTA
   - Submits the ZIP form to the GHL inbound webhook (lead capture) using
     the site's own design (no third-party iframe).
   - Subtle one-time entrance animation (reveal only, no pinning).
   ===================================================================== */
(function () {
  "use strict";

  // GHL inbound webhook — captures every ZIP availability lead
  var WEBHOOK = "https://services.leadconnectorhq.com/hooks/PAnnpKnujnhgYptCcXm1/webhook-trigger/68e26e6e-615f-4f39-be4e-848fe75da2a6";

  function init() {
    var section = document.querySelector(".final-cta");
    if (!section) return;

    var form = section.querySelector(".final-cta__form");
    var msg  = section.querySelector(".final-cta__msg");

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector('input[name="zip"]');
        var btn   = form.querySelector(".final-cta__submit");
        var zip   = input ? input.value.trim() : "";

        if (!zip) {
          if (msg) { msg.hidden = false; msg.className = "final-cta__msg is-error"; msg.textContent = "Please enter your ZIP code."; }
          if (input) input.focus();
          return;
        }

        var payload = {
          zip: zip,
          source: "Home Page — Final CTA",
          page: location.href,
          submitted_at: new Date().toISOString()
        };

        // Send to GHL. no-cors "fire and forget" (webhook returns no CORS
        // headers); also mirror the fields onto the query string so the lead
        // is captured even if the body is not parsed.
        var url = WEBHOOK + "?zip=" + encodeURIComponent(zip) +
                  "&source=" + encodeURIComponent(payload.source) +
                  "&page=" + encodeURIComponent(payload.page);

        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }

        fetch(url, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload)
        }).then(finish).catch(finish);

        function finish() {
          if (msg) {
            msg.hidden = false;
            msg.className = "final-cta__msg is-ok";
            msg.textContent = "Thanks! We got ZIP " + zip + " — we'll confirm availability and pricing shortly. Need it now? Call or text (760) 208-3563.";
          }
          form.reset();
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Check Availability"; }
        }
      });
    }

    /* ----------------------------- Entrance ------------------------------ */
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // visible by default
    }
    gsap.registerPlugin(ScrollTrigger);

    var container = section.querySelector(".final-cta__container");
    var bits = Array.prototype.slice.call(
      section.querySelectorAll(".final-cta__headline, .final-cta__sub, .final-cta__field, .final-cta__submit, .final-cta__phone")
    );
    var media = section.querySelector(".final-cta__media");

    gsap.set(container, { opacity: 0, y: 60 });
    gsap.set(bits, { opacity: 0, y: 24 });
    if (media) gsap.set(media, { opacity: 0, y: 30 });

    ScrollTrigger.create({
      trigger: section,
      start: "top 78%",
      once: true,
      onEnter: function () {
        var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(container, { opacity: 1, y: 0, duration: 0.8 })
          .to(bits, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
          .to(media, { opacity: 1, y: 0, duration: 0.8 }, "-=0.7");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
