/* =====================================================================
   Lone Wolf Hauling — "Story Behind Lone Wolf" (About page only)

   A pinned, scroll-driven story that the visitor reads THROUGH:
   • The section pins while the story progresses, and reverses smoothly.
   • Words light up one-by-one with scroll (cumulative — once a word is
     lit it stays lit; scrolling back up un-lights them in reverse).
   • The headline stays fully lit the whole time.
   • Body 1 reveals first (full width). Then the image slides/reveals into
     the LEFT while Body 2 (split layout) reveals on the right. Then Body 3
     reveals full width. Earlier paragraphs stay fully lit as you go.
   • The image is only visible from Body 2 onward — hidden during Body 1.

   Progressive enhancement: if GSAP/ScrollTrigger are unavailable or the
   visitor prefers reduced motion, the whole story renders static and fully
   readable (every word lit, image shown) — nothing is hidden.
   ===================================================================== */
(function () {
  "use strict";

  function init() {
    var section = document.querySelector(".story");
    if (!section) return;

    var track  = section.querySelector(".story__track");
    var figure = section.querySelector(".story__media");
    var row    = section.querySelector(".story__row");
    var paras  = Array.prototype.slice.call(section.querySelectorAll(".story__p"));

    /* ---- Split each paragraph into word spans ---- */
    var groups = { "1": [], "2": [], "3": [] };
    paras.forEach(function (p) {
      var b = p.getAttribute("data-body");
      var text = p.textContent.trim();
      p.textContent = "";
      text.split(/\s+/).forEach(function (word) {
        var s = document.createElement("span");
        s.className = "story__w";
        s.textContent = word;
        p.appendChild(s);
        p.appendChild(document.createTextNode(" "));
        if (groups[b]) groups[b].push(s);
      });
    });

    var gsap = window.gsap, ST = window.ScrollTrigger;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!gsap || !ST || reduce) return; // static, fully-readable fallback

    gsap.registerPlugin(ST);
    section.classList.add("story--anim");

    var b1 = groups["1"], b2 = groups["2"], b3 = groups["3"];
    var vh, range, K;

    function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }

    // translate so element-center `c` (measured from track top) sits at the
    // vertical middle of the viewport, clamped to the scrollable range
    function yForCenter(c) {
      var y = -(c - vh / 2);
      if (y > 0) y = 0;
      if (y < -range) y = -range;
      return y;
    }

    function measure() {
      var prev = track.style.transform;
      track.style.transform = "none";
      var tTop = track.getBoundingClientRect().top;
      vh = window.innerHeight;
      var th = track.getBoundingClientRect().height;
      range = Math.max(1, th - vh);

      function centerOf(el) {
        var r = el.getBoundingClientRect();
        return (r.top - tTop) + r.height / 2;
      }
      var c1  = centerOf(b1[0].parentNode);
      var cRw = centerOf(row);
      var c3  = centerOf(b3[0].parentNode);

      track.style.transform = prev || "";

      // keyframes: progress -> translateY. Lingers on each beat so the
      // reader can move through the words, then advances to the next.
      K = [
        { p: 0.00, y: 0 },
        { p: 0.20, y: yForCenter(c1) },
        { p: 0.50, y: yForCenter(cRw) },
        { p: 0.85, y: yForCenter(c3) },
        { p: 1.00, y: -range }
      ];
    }

    function interpY(p) {
      for (var i = 0; i < K.length - 1; i++) {
        var a = K[i], b = K[i + 1];
        if (p <= b.p) {
          var t = (p - a.p) / ((b.p - a.p) || 1);
          return a.y + (b.y - a.y) * t;
        }
      }
      return K[K.length - 1].y;
    }

    // light a paragraph's words sequentially across the progress band [a,b]
    function lightBand(words, p, a, b) {
      var n = words.length, per = (b - a) / n, ramp = Math.max(per * 1.5, 0.012);
      for (var i = 0; i < n; i++) {
        var wp = a + i * per;
        var frac = clamp01((p - wp) / ramp);
        words[i].style.opacity = (0.16 + 0.84 * frac).toFixed(3);
      }
    }

    function render(p) {
      track.style.transform = "translate3d(0," + interpY(p).toFixed(1) + "px,0)";
      lightBand(b1, p, 0.06, 0.30);
      lightBand(b2, p, 0.40, 0.62);
      lightBand(b3, p, 0.66, 0.94);
      // image slides + wipes in from the left, only from Body 2 onward
      var f = clamp01((p - 0.32) / 0.14);
      figure.style.clipPath = "inset(0 " + ((1 - f) * 100).toFixed(1) + "% 0 0)";
      figure.style.opacity = f.toFixed(3);
      figure.style.transform = "translateX(" + (-36 * (1 - f)).toFixed(1) + "px)";
    }

    measure();
    ST.create({
      trigger: section,
      start: "top top",
      end: function () { return "+=" + range; },
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: function (self) { render(self.progress); }
    });
    render(0);
    ST.refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
