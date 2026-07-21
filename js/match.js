/* =====================================================================
   Lone Wolf Hauling — Project Match wizard (Sizes page only)
   A guided, client-side quiz that recommends a dumpster from the answers.
   Material decides the first recommendation; certain answers route to a
   "Needs Review" outcome. No backend — the result CTA sends to contact.
   ===================================================================== */
(function () {
  "use strict";

  var wizard = document.getElementById("pmWizard");
  if (!wizard) return;

  var screensEl = document.getElementById("pmScreens");
  var barEl  = document.getElementById("pmBar");
  var backEl = document.getElementById("pmBack");
  var nextEl = document.getElementById("pmNext");
  var navEl  = document.getElementById("pmNav");

  /* ----------------------------- Questions ---------------------------- */
  var QUESTIONS = [
    { key: "project", type: "single",
      q: "What type of project are you working on?",
      help: "Choose the option that best describes the job.",
      options: ["Home cleanout","Garage cleanout","Remodel","Roofing project","Construction job","Dirt, concrete, or asphalt","Green waste cleanup","Commercial cleanout","Yard cleanup","Other"] },
    { key: "material", type: "single",
      q: "What material are you loading?",
      help: "This is the most important question because the material affects the dumpster size, weight, and price.",
      options: ["Clean dirt","Clean concrete","Asphalt","Sod","Grass or weeds","Mixed dirt and concrete","Roof tile","Trash","Green waste","Palm","Bamboo","Mixed debris","Not sure"] },
    { key: "load", type: "single",
      q: "About how much debris do you have?",
      help: "A rough estimate is fine. We will confirm the best option before delivery.",
      options: ["Small load","Medium load","Large load","Full property cleanout","Active jobsite cleanup","Not sure"] },
    { key: "placement", type: "single",
      q: "Where will the dumpster be placed?",
      help: "Placement helps us plan access before the truck arrives.",
      options: ["Driveway","Street","Jobsite","Business property","Dirt lot","Alley or tight access area","Not sure yet"] },
    { key: "city", type: "text",
      q: "What city is the project in?",
      help: "This helps us confirm delivery availability and timing.",
      label: "City or ZIP Code" },
    { key: "when", type: "single",
      q: "When do you need the dumpster?",
      help: "Same-day delivery may be available in some cases near Vista and surrounding areas.",
      options: ["Today, if available","Tomorrow","This week","Next week","Flexible"] },
    { key: "duration", type: "single",
      q: "How long do you need the dumpster?",
      help: "Rental time depends on the dumpster type and material.",
      options: ["1 to 3 days","Up to 1 week","Longer than 1 week","Not sure"] },
    { key: "photo", type: "file",
      q: "Do you have a photo of the debris or project area?",
      help: "A photo helps us recommend the right dumpster faster.",
      label: "Upload Photo" },
    { key: "contact", type: "contact",
      q: "Where should we send your dumpster recommendation?",
      help: "We will review your project details and confirm the best dumpster, price, and delivery availability." }
  ];

  var answers = {};

  /* -------------------------- Build question DOM ---------------------- */
  var resultScreen = screensEl.querySelector('[data-screen="result"]');

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  QUESTIONS.forEach(function (cfg, i) {
    var s = el("div", "pm-screen");
    s.setAttribute("data-screen", "q");
    s.setAttribute("data-key", cfg.key);
    s.appendChild(el("p", "pm-q", cfg.q));
    if (cfg.help) s.appendChild(el("p", "pm-help", cfg.help));

    if (cfg.type === "single") {
      var opts = el("div", "pm-options");
      cfg.options.forEach(function (opt) {
        var b = el("button", "pm-opt", "<span>" + opt + "</span>");
        b.type = "button";
        b.setAttribute("data-value", opt);
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(opts.children, function (c) { c.classList.remove("is-selected"); });
          b.classList.add("is-selected");
          answers[cfg.key] = opt;
          refreshNav();
        });
        opts.appendChild(b);
      });
      s.appendChild(opts);

    } else if (cfg.type === "text") {
      var wrap = el("div", "pm-field");
      wrap.appendChild(el("label", "pm-field__label", cfg.label));
      var input = el("input", "pm-input");
      input.type = "text";
      input.placeholder = cfg.label;
      input.addEventListener("input", function () { answers[cfg.key] = input.value.trim(); refreshNav(); });
      wrap.appendChild(input);
      s.appendChild(wrap);

    } else if (cfg.type === "file") {
      var fwrap = el("div", "pm-file");
      var flabel = el("label", "pm-file__drop",
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M12 4l-4 4M12 4l4 4M5 20h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="pm-file__text">' + cfg.label + '</span>');
      var finput = el("input", "pm-file__input");
      finput.type = "file";
      finput.accept = "image/*";
      finput.addEventListener("change", function () {
        answers[cfg.key] = finput.files && finput.files.length ? finput.files[0].name : "";
        flabel.querySelector(".pm-file__text").textContent = answers[cfg.key] || cfg.label;
        flabel.classList.toggle("has-file", !!answers[cfg.key]);
      });
      flabel.appendChild(finput);
      fwrap.appendChild(flabel);
      var skip = el("button", "pm-skip", "Skip This Step");
      skip.type = "button";
      skip.addEventListener("click", function () { go(idx + 1); });
      fwrap.appendChild(skip);
      s.appendChild(fwrap);

    } else if (cfg.type === "contact") {
      var c = el("div", "pm-contact");
      c.innerHTML =
        '<label class="pm-field"><span class="pm-field__label">Full Name</span><input class="pm-input" type="text" data-c="name" /></label>' +
        '<label class="pm-field"><span class="pm-field__label">Phone Number</span><input class="pm-input" type="tel" data-c="phone" /></label>' +
        '<label class="pm-field"><span class="pm-field__label">Email Address</span><input class="pm-input" type="email" data-c="email" /></label>' +
        '<div class="pm-field"><span class="pm-field__label">Preferred Contact Method</span>' +
          '<div class="pm-methods">' +
            '<button type="button" class="pm-method" data-m="Call">Call</button>' +
            '<button type="button" class="pm-method" data-m="Text">Text</button>' +
            '<button type="button" class="pm-method" data-m="Email">Email</button>' +
          '</div>' +
        '</div>';
      c.addEventListener("input", function (e) {
        var k = e.target.getAttribute("data-c");
        if (k) { answers[k] = e.target.value.trim(); refreshNav(); }
      });
      Array.prototype.forEach.call(c.querySelectorAll(".pm-method"), function (m) {
        m.addEventListener("click", function () {
          Array.prototype.forEach.call(c.querySelectorAll(".pm-method"), function (x) { x.classList.remove("is-selected"); });
          m.classList.add("is-selected");
          answers.method = m.getAttribute("data-m");
          refreshNav();
        });
      });
      s.appendChild(c);
    }

    screensEl.insertBefore(s, resultScreen);
  });

  /* ------------------------------- Flow ------------------------------- */
  // flow = intro + questions (result is shown after submit, outside flow)
  var introScreen = screensEl.querySelector('[data-screen="intro"]');
  var qScreens = Array.prototype.slice.call(screensEl.querySelectorAll('[data-screen="q"]'));
  var flow = [introScreen].concat(qScreens);
  var idx = 0;

  function currentCfg() {
    if (idx === 0) return null;
    return QUESTIONS[idx - 1];
  }

  function isValid() {
    var cfg = currentCfg();
    if (!cfg) return true;               // intro
    if (cfg.type === "single") return !!answers[cfg.key];
    if (cfg.type === "text")   return !!answers[cfg.key];
    if (cfg.type === "file")   return true;   // optional
    if (cfg.type === "contact") return !!answers.name && (!!answers.phone || !!answers.email) && !!answers.method;
    return true;
  }

  function refreshNav() {
    nextEl.disabled = !isValid();
    nextEl.classList.toggle("is-disabled", nextEl.disabled);
  }

  function setBar() {
    // progress across the questions (intro = 0)
    var pct = (idx / QUESTIONS.length) * 100;
    barEl.style.width = pct + "%";
  }

  function go(n) {
    idx = Math.max(0, Math.min(flow.length, n));
    if (idx >= flow.length) { submit(); return; }
    flow.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
    resultScreen.classList.remove("is-active");
    backEl.style.visibility = idx === 0 ? "hidden" : "visible";
    nextEl.textContent = idx === 0 ? "Start"
      : (idx === flow.length - 1 ? "Show My Dumpster Match" : "Continue");
    setBar();
    refreshNav();
    // keep the wizard in view as steps change
    wizard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ----------------------------- Matching ----------------------------- */
  function matchResult() {
    var m = answers.material, place = answers.placement, dur = answers.duration, load = answers.load;

    var reviewMat   = ["Bamboo", "Mixed debris", "Not sure"];
    var reviewPlace = ["Street", "Alley or tight access area", "Not sure yet"];
    if (reviewMat.indexOf(m) !== -1) return "review";
    if (reviewPlace.indexOf(place) !== -1) return "review";
    if (dur === "Longer than 1 week") return "review";

    var tenYard = ["Clean dirt","Clean concrete","Asphalt","Sod","Grass or weeds","Mixed dirt and concrete"];
    if (tenYard.indexOf(m) !== -1) return "10";
    if (m === "Roof tile") return "25";
    if (m === "Trash") {
      var big = ["Large load","Full property cleanout","Active jobsite cleanup"];
      return big.indexOf(load) !== -1 ? "40" : "25";
    }
    if (m === "Green waste" || m === "Palm") return "40";
    return "review";
  }

  function submit() {
    var type = matchResult();
    flow.forEach(function (s) { s.classList.remove("is-active"); });
    navEl.style.display = "none";
    barEl.style.width = "100%";
    Array.prototype.forEach.call(resultScreen.querySelectorAll(".pm-rcard"), function (card) {
      card.hidden = card.getAttribute("data-result") !== type;
    });
    resultScreen.classList.add("is-active");
    wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------------------- Listeners ----------------------------- */
  nextEl.addEventListener("click", function () { if (isValid()) go(idx + 1); });
  backEl.addEventListener("click", function () { go(idx - 1); });

  var scrollBtn = document.querySelector('[data-action="scroll-wizard"]');
  if (scrollBtn) scrollBtn.addEventListener("click", function () {
    wizard.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  go(0);
})();
