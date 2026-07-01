/* ============================================================
   Shared header + footer injection, nav behavior, reveals
   ============================================================ */
(function () {
  var NAV_LINKS = [
    { label: "About", href: "about.html" },
    { label: "Journals", href: "journals.html" },
    { label: "Research Areas", href: "research-areas.html" },
    { label: "Editorial Board", href: "editorial-board.html" },
    { label: "Conferences", href: "conferences.html" },
    { label: "Publications", href: "publications.html" },
    { label: "Contact", href: "contact.html" }
  ];

  var page = (location.pathname.split("/").pop() || "index.html");
  if (page === "") page = "index.html";

  function linkHtml(l, cls) {
    var active = l.href === page ? " active" : "";
    return '<a class="' + (cls || "") + active + '" href="' + l.href + '">' + l.label + "</a>";
  }

  var logoSvg =
    '<svg viewBox="0 0 24 24" fill="none"><path d="M2 13h4l2-7 3 14 3-9 2 2h6" stroke="#e3b85a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- NAV ---------- */
  var navHtml =
    '<nav class="nav" id="siteNav"><div class="nav__inner">' +
      '<a class="brand" href="index.html"><span class="brand__mark">' + logoSvg + '</span>' +
        '<span class="brand__name"><b>Lifeline Emed</b><span>Companies</span></span></a>' +
      '<ul class="nav__links">' + NAV_LINKS.map(function (l) { return "<li>" + linkHtml(l) + "</li>"; }).join("") + "</ul>" +
      '<div class="nav__actions">' +
        '<a class="btn btn--gold" href="contact.html">Submit Manuscript</a>' +
        '<button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      "</div>" +
    "</div></nav>" +
    '<div class="nav__drawer" id="drawer"><ul>' +
      NAV_LINKS.map(function (l) { return "<li>" + linkHtml(l) + "</li>"; }).join("") +
      '<a class="btn btn--gold" href="contact.html">Submit Manuscript</a>' +
    "</ul></div>";

  /* ---------- FOOTER ---------- */
  var footerHtml =
    '<footer class="footer"><div class="container">' +
      '<div class="footer__top">' +
        '<div class="footer__brand">' +
          '<a class="brand" href="index.html"><span class="brand__mark">' + logoSvg + '</span>' +
            '<span class="brand__name"><b>Lifeline Emed</b><span>Companies</span></span></a>' +
          "<p>A US-based organization advancing scholarly publishing, healthcare innovation, scientific research, education, and international collaboration.</p>" +
          '<div class="contacts">' +
            '<a href="mailto:info@lifelineemed.com">info@lifelineemed.com</a>' +
            '<a href="mailto:submissions@ajri.org">submissions@ajri.org</a>' +
          "</div>" +
        "</div>" +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="about.html">About Us</a></li>' +
          '<li><a href="journals.html">Journals</a></li>' +
          '<li><a href="research-areas.html">Research Areas</a></li>' +
          '<li><a href="editorial-board.html">Editorial Board</a></li>' +
        "</ul></div>" +
        '<div><h4>Publishing</h4><ul>' +
          '<li><a href="conferences.html">Conferences</a></li>' +
          '<li><a href="publications.html">Publications</a></li>' +
          '<li><a href="journals.html#guidelines">Author Guidelines</a></li>' +
          '<li><a href="contact.html">Submit Manuscript</a></li>' +
        "</ul></div>" +
        '<div><h4>Legal</h4><ul>' +
          '<li><a href="privacy-policy.html">Privacy Policy</a></li>' +
          '<li><a href="terms-of-service.html">Terms of Service</a></li>' +
          '<li><a href="cookie-policy.html">Cookie Policy</a></li>' +
          '<li><a href="disclaimer.html">Disclaimer</a></li>' +
          '<li><a href="accessibility-statement.html">Accessibility</a></li>' +
        "</ul></div>" +
      "</div>" +
      '<div class="footer__bottom">' +
        "<p>© 2026 Lifeline Emed Companies LLC. All Rights Reserved.</p>" +
        '<span class="tagline">Research · Innovation · Education · Global Collaboration</span>' +
      "</div>" +
    "</div></footer>";

  var navMount = document.getElementById("site-nav");
  var footMount = document.getElementById("site-footer");
  if (navMount) navMount.outerHTML = navHtml;
  if (footMount) footMount.outerHTML = footerHtml;

  /* ---------- Behavior ---------- */
  var nav = document.getElementById("siteNav");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scroll progress bar */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  /* parallax target */
  var heroPhoto = document.querySelector(".hero--dark .hero__photo");

  /* unified scroll handler — driven by native scroll OR Locomotive */
  function applyScroll(y, limit) {
    if (nav) {
      /* Island header: full-width bar at the top, floating pill once scrolled — always visible */
      nav.classList.toggle("scrolled", y > 20);
      nav.classList.remove("nav--hidden");
    }
    var max = limit || (document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
    if (heroPhoto && !reduceMotion) {
      heroPhoto.style.transform = "translate3d(0," + (y * 0.18) + "px,0) scale(1.12)";
    }
  }
  var nativeScroll = function () { applyScroll(window.scrollY); };
  window.addEventListener("scroll", nativeScroll, { passive: true });
  applyScroll(0);

  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") drawer.classList.remove("open");
    });
  }

  /* reveal on scroll (with stagger inside groups) */
  document.querySelectorAll(".grid, .steps, .stats, .hero__stats").forEach(function (group) {
    var items = group.querySelectorAll(".reveal");
    items.forEach(function (it, i) { it.style.transitionDelay = (i % 6) * 80 + "ms"; });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Locomotive Scroll (smooth inertia) — progressive enhancement ---------- */
  function loadLocomotive() {
    if (reduceMotion) return;                                  // respect reduced-motion
    if (window.innerWidth && window.innerWidth < 768) return;  // native scroll on mobile (0 = unknown → allow)
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "assets/vendor/locomotive-scroll.min.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "assets/vendor/locomotive-scroll.min.js";
    s.onload = initLocomotive;
    s.onerror = function () { /* keep native scroll */ };
    document.head.appendChild(s);
  }

  function initLocomotive() {
    if (typeof LocomotiveScroll === "undefined") return;
    try {
      var container = document.createElement("main");
      container.setAttribute("data-scroll-container", "");
      [].slice.call(document.body.children).forEach(function (n) {
        if (n === nav) return;
        if (n.classList && (n.classList.contains("nav__drawer") || n.classList.contains("scroll-progress"))) return;
        if (n.tagName === "SCRIPT" || n.tagName === "LINK" || n.tagName === "STYLE") return;
        container.appendChild(n);
      });
      document.body.appendChild(container);
      [].slice.call(container.children).forEach(function (c) {
        if (["HEADER", "SECTION", "FOOTER"].indexOf(c.tagName) >= 0) c.setAttribute("data-scroll-section", "");
      });
      document.documentElement.classList.add("has-scroll-smooth");

      var loco = new LocomotiveScroll({
        el: container,
        smooth: true,
        lerp: 0.085,
        multiplier: 1,
        tablet: { smooth: false, breakpoint: 1024 },
        smartphone: { smooth: false, breakpoint: 768 }
      });
      loco.on("scroll", function (a) { applyScroll(a.scroll.y, a.limit && a.limit.y); });

      // smooth anchor links
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        var href = a.getAttribute("href");
        if (href && href.length > 1) {
          a.addEventListener("click", function (e) { e.preventDefault(); loco.scrollTo(href); });
        }
      });

      // refresh after fonts/images settle
      window.addEventListener("load", function () { loco.update(); });
      setTimeout(function () { loco.update(); }, 700);
    } catch (err) {
      document.documentElement.classList.remove("has-scroll-smooth");
    }
  }
  loadLocomotive();

  /* contact / auth form demo handlers */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector("[data-msg]");
      if (msg) { msg.style.display = "block"; }
      f.reset();
    });
  });
})();
