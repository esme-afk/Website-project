/* =====================================================================
   Lone Wolf Hauling — Menu interactions
   - Burger ⇄ overlay (circular reveal)
   - Sticky/frosted nav on scroll
   - GSAP-powered link stagger + button micro-interactions
   ===================================================================== */
(function () {
  "use strict";

  const body    = document.body;
  const nav     = document.querySelector(".nav");
  const burger  = document.getElementById("burger");
  const overlay = document.getElementById("overlayMenu");
  const links   = Array.from(document.querySelectorAll(".overlay__link"));

  const hasGSAP = typeof window.gsap !== "undefined";

  /* ----------------------------- Overlay menu ----------------------- */
  function openMenu() {
    body.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    overlay.setAttribute("aria-hidden", "false");

    if (hasGSAP) {
      gsap.fromTo(
        links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.07, delay: 0.18 }
      );
    } else {
      links.forEach((l) => { l.style.opacity = 1; l.style.transform = "none"; });
    }
  }

  function closeMenu() {
    body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    overlay.setAttribute("aria-hidden", "true");
    if (hasGSAP) gsap.to(links, { y: 20, opacity: 0, duration: 0.25, ease: "power2.in" });
  }

  function toggleMenu() {
    body.classList.contains("menu-open") ? closeMenu() : openMenu();
  }

  burger.addEventListener("click", toggleMenu);

  // Close when a destination is chosen, or on Escape
  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) closeMenu();
  });

  /* ----------------------------- Sticky nav ------------------------- */
  const onScroll = () => {
    nav.classList.toggle("is-stuck", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* --------------------- Button ripple micro-interaction ------------ *
     Acknowledges the click with a quick ripple from the cursor point.  */
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText =
        "position:absolute;border-radius:50%;pointer-events:none;z-index:-1;" +
        "background:rgba(255,255,255,0.35);transform:scale(0);" +
        "width:" + size + "px;height:" + size + "px;" +
        "left:" + (e.clientX - rect.left - size / 2) + "px;" +
        "top:"  + (e.clientY - rect.top  - size / 2) + "px;";
      this.appendChild(ripple);
      if (hasGSAP) {
        gsap.to(ripple, {
          scale: 2.4, opacity: 0, duration: 0.6, ease: "power2.out",
          onComplete: () => ripple.remove(),
        });
      } else {
        setTimeout(() => ripple.remove(), 600);
      }
    });
  });

  /* --------------------- Subtle magnetic CTA ------------------------ *
     The nav CTA leans slightly toward the cursor — small, playful.     */
  if (hasGSAP && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".btn--cta, .btn--quote").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.18,
          y: (e.clientY - (r.top + r.height / 2)) * 0.28,
          duration: 0.4, ease: "power3.out",
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }
})();
