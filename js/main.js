(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = d.getElementById("nav");
  var btn = d.getElementById("menu-btn");
  var menu = d.getElementById("menu");

  /* Nav turns solid after 40px */
  function onScroll() { nav.classList.toggle("is-solid", window.scrollY > 40); }
  onScroll();

  /* Hero parallax (transform only, off below 768px, off for reduced motion) */
  var media = d.querySelector("[data-parallax]");
  var wide = window.matchMedia("(min-width: 768px)");
  var ticking = false;
  function parallax() {
    ticking = false;
    if (!media) return;
    media.style.transform = (!reduce && wide.matches && window.scrollY < window.innerHeight)
      ? "translate3d(0," + Math.round(window.scrollY * 0.25) + "px,0)" : "";
  }

  /* Process line draws on scroll */
  var steps = d.getElementById("steps");
  function progress() {
    if (!steps) return;
    if (reduce) { steps.style.setProperty("--progress", 1); return; }
    var r = steps.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.75 - r.top) / (r.height || 1);
    steps.style.setProperty("--progress", Math.max(0, Math.min(1, p)).toFixed(3));
  }
  progress();

  window.addEventListener("scroll", function () {
    onScroll();
    if (!ticking) { ticking = true; requestAnimationFrame(function () { parallax(); progress(); }); }
  }, { passive: true });
  window.addEventListener("resize", function () { parallax(); progress(); });

  /* Reveals (one-time, staggered via --i) */
  var reveals = d.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* Counters run once. Final values are already in the HTML. */
  var counters = d.querySelectorAll("[data-count]");
  function runCounter(el) {
    var end = parseInt(el.getAttribute("data-count"), 10), t0 = null, dur = 1200;
    function tick(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    }
    el.textContent = "0";
    requestAnimationFrame(tick);
  }
  if (!reduce && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* Scrollspy */
  var links = d.querySelectorAll('.nav__links a[href^="#"]:not(.btn), .menu a[href^="#"]:not(.btn)');
  function setActive(id) {
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    d.querySelectorAll("main section[id]").forEach(function (s) { so.observe(s); });
  }

  /* Mobile menu overlay */
  var lastFocus = null;
  function focusables() { return [btn].concat(Array.prototype.slice.call(menu.querySelectorAll("a"))); }
  function setMenu(open) {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    d.body.style.overflow = open ? "hidden" : "";
    if (open) { lastFocus = d.activeElement; setTimeout(function () { menu.querySelector("a").focus(); }, 50); }
    else if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  function isOpen() { return btn.getAttribute("aria-expanded") === "true"; }
  btn.addEventListener("click", function () { setMenu(!isOpen()); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  d.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") { setMenu(false); return; }
    if (e.key !== "Tab") return;
    var f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia("(min-width: 900px)").addEventListener("change", function (m) { if (m.matches && isOpen()) setMenu(false); });

  /* Quote form via fetch. Without JS the form posts natively. */
  var form = d.getElementById("quote-form");
  var status = d.getElementById("form-status");
  if (form && window.fetch) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending...";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            status.className = "form-status is-ok";
            status.textContent = "Thank you. We have received your request and will contact you shortly.";
          } else { throw new Error("bad status"); }
        })
        .catch(function () {
          status.className = "form-status is-err";
          status.textContent = "Sorry, your request could not be sent. Please call +234 816 305 0451 or message us on WhatsApp.";
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
