/* =====================================================================
   Lone Wolf Hauling — Final CTA (two-step lead form)
   - Step 1: visitor enters ZIP code.
   - Step 2: visitor enters name + contact info so we can reach out
     with a free quote.
   - Everything is submitted to the GHL inbound webhook (lead capture)
     using the site's own design (no third-party iframe).
   - Subtle one-time entrance animation (reveal only, no pinning).
   ===================================================================== */
(function () {
  "use strict";

  // GHL inbound webhook — captures every quote-request lead
  var WEBHOOK = "https://services.leadconnectorhq.com/hooks/PAnnpKnujnhgYptCcXm1/webhook-trigger/68e26e6e-615f-4f39-be4e-848fe75da2a6";

  function init() {
    var section = document.querySelector(".final-cta");
    if (!section) return;

    var form = section.querySelector(".final-cta__form");
    var msg  = section.querySelector(".final-cta__msg");

    if (form) {
      var panel1  = form.querySelector('[data-step-panel="1"]');
      var panel2  = form.querySelector('[data-step-panel="2"]');
      var nextBtn = form.querySelector("[data-next]");
      var backBtn = form.querySelector("[data-back]");
      var zipEcho = form.querySelector("[data-zip-echo]");

      var zipInput   = form.querySelector('input[name="zip"]');
      var nameInput  = form.querySelector('input[name="name"]');
      var phoneInput = form.querySelector('input[name="phone"]');
      var emailInput = form.querySelector('input[name="email"]');

      function showError(text, focusEl) {
        if (msg) { msg.hidden = false; msg.className = "final-cta__msg is-error"; msg.textContent = text; }
        if (focusEl) focusEl.focus();
      }
      function clearMsg() { if (msg) { msg.hidden = true; msg.className = "final-cta__msg"; msg.textContent = ""; } }

      /* ------- Step 1 -> Step 2 ------- */
      function goToStep2() {
        var zip = zipInput ? zipInput.value.trim() : "";
        if (!zip) { showError("Please enter your ZIP code.", zipInput); return; }
        clearMsg();
        if (zipEcho) zipEcho.textContent = "ZIP " + zip;
        if (panel1) panel1.hidden = true;
        if (panel2) panel2.hidden = false;
        form.setAttribute("data-step", "2");
        if (nameInput) nameInput.focus();
      }
      if (nextBtn) nextBtn.addEventListener("click", goToStep2);
      // Allow Enter in the ZIP field to advance
      if (zipInput) {
        zipInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); goToStep2(); }
        });
      }

      /* ------- Back to Step 1 ------- */
      if (backBtn) {
        backBtn.addEventListener("click", function () {
          clearMsg();
          if (panel2) panel2.hidden = true;
          if (panel1) panel1.hidden = false;
          form.setAttribute("data-step", "1");
          if (zipInput) zipInput.focus();
        });
      }

      /* ------- Final submit -> webhook ------- */
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        var zip   = zipInput   ? zipInput.value.trim()   : "";
        var name  = nameInput  ? nameInput.value.trim()  : "";
        var phone = phoneInput ? phoneInput.value.trim() : "";
        var email = emailInput ? emailInput.value.trim() : "";

        if (!zip)   { goToStep2(); return; }
        if (!name)  { showError("Please enter your name.", nameInput);  return; }
        if (!phone) { showError("Please enter a phone number so we can reach you.", phoneInput); return; }

        clearMsg();

        // First + last name split (GHL maps first_name / last_name nicely)
        var parts = name.split(/\s+/);
        var firstName = parts.shift() || name;
        var lastName  = parts.join(" ");

        var payload = {
          full_name: name,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          email: email,
          zip: zip,
          postal_code: zip,
          source: "Home Page — Free Quote Form",
          page: location.href,
          submitted_at: new Date().toISOString()
        };

        // Send to GHL as application/x-www-form-urlencoded. This content type
        // is CORS-safelisted, so it works under mode:"no-cors" WITHOUT a
        // preflight (GHL's webhook doesn't answer preflights), and GHL parses
        // it straight into named fields for the Mapping Reference. A JSON body
        // would arrive as text/plain here and produce no mappable fields.
        var body = new URLSearchParams(payload); // sets form-urlencoded header

        var btn = form.querySelector('[data-step-panel="2"] .final-cta__submit');
        if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }

        fetch(WEBHOOK, {
          method: "POST",
          mode: "no-cors",
          body: body
        }).then(finish).catch(finish);

        function finish() {
          if (msg) {
            msg.hidden = false;
            msg.className = "final-cta__msg is-ok";
            msg.textContent = "Thanks, " + name + "! We got your request for ZIP " + zip +
              " — we'll reach out shortly with your free quote. Need it now? Call or text (760) 208-3563.";
          }
          // Reset back to step 1 for the next visitor
          form.reset();
          if (panel2) panel2.hidden = true;
          if (panel1) panel1.hidden = false;
          form.setAttribute("data-step", "1");
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Get My Free Quote"; }
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
      section.querySelectorAll(".final-cta__headline, .final-cta__sub, .final-cta__step, .final-cta__phone")
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
