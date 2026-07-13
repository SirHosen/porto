/* ============================================================
   main.js — boot sequence, scroll choreography binding,
   interactions (chips ↔ graph, build modals), custom cursor,
   accessibility & reduced-motion / low-end fallbacks.
   ============================================================ */
(function () {
  "use strict";

  var D = window.GRAPH_DATA;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var qaSection = window.QA_SECTION || null;
  var qaModal = !!window.QA_MODAL;

  var body = document.body;
  var engine = null;
  var rafTicks = 0;

  var sections = Array.prototype.slice.call(document.querySelectorAll("section[data-cam]"));
  var tip = document.getElementById("graph-tip");
  var canvas = document.getElementById("graph");

  /* ================= boot sequence ================= */
  var bootEl = document.getElementById("boot");
  var bootLog = document.getElementById("boot-log");
  var BOOT_LINES = [
    "HOSEA-OS v3.74 — boot sequence initiated",
    "[ OK ] cpu: informatics-engineering (GPA 3.74/4.00)",
    "[ OK ] mount /dev/skills — 6 module groups found",
    "[ OK ] import projects — 8 builds linked",
    "[ OK ] verify certifications — 4/4 signatures valid",
    "[ OK ] test suite — 29/29 passing",
    "[ .. ] rendering dependency graph\u2026"
  ];
  var bootDone = false;
  var bootTimers = [];

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    bootTimers.forEach(clearTimeout);
    body.classList.add("booted");
    if (bootEl) {
      bootEl.classList.add("done");
      setTimeout(function () {
        if (bootEl && bootEl.parentNode) bootEl.parentNode.removeChild(bootEl);
      }, 650);
    }
    initScene();
  }

  var skipBoot = reduceMotion || !!location.hash || qaSection || qaModal;
  if (qaSection || qaModal) document.documentElement.classList.add("qa");

  /* ================= scene init (lazy — after boot) ================= */

  function computeKeyframes() {
    return sections.map(function (s) {
      var c = JSON.parse(s.getAttribute("data-cam"));
      return { top: s.offsetTop, pos: c.pos, alpha: c.alpha == null ? 1 : c.alpha };
    });
  }

  function projectById(id) {
    for (var i = 0; i < D.PROJECTS.length; i++) {
      if (D.PROJECTS[i].id === id) return D.PROJECTS[i];
    }
    return null;
  }

  function nodeLabel(id) {
    for (var i = 0; i < D.SKILLS.length; i++) if (D.SKILLS[i][0] === id) return D.SKILLS[i][1];
    for (var j = 0; j < D.CATS.length; j++) if (D.CATS[j].id === id) return D.CATS[j].label;
    return id;
  }

  function initScene() {
    if (engine || !window.GraphScene || !canvas.getContext) return;
    engine = new window.GraphScene(canvas);
    engine.staticMode = reduceMotion;
    engine.setKeyframes(computeKeyframes());
    engine.updateTargetFromScroll(window.scrollY);

    window.addEventListener("resize", function () {
      engine.resize();
      engine.setKeyframes(computeKeyframes());
      engine.updateTargetFromScroll(window.scrollY);
      if (reduceMotion) engine.frame(0, 0.016);
    });
    window.addEventListener("scroll", function () {
      engine.updateTargetFromScroll(window.scrollY);
      // parallax layer 1: background grid drifts slower than graph & text
      if (!reduceMotion) {
        body.style.backgroundPosition = "0px " + ((-window.scrollY * 0.08) % 64) + "px";
      }
      if (reduceMotion || rafTicks === 0) {
        engine.formT = 1; engine.snap(); engine.frame(0.45, 0.016);
      }
    }, { passive: true });

    if (!reduceMotion) {
      var last = performance.now();
      var loop = function (now) {
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        rafTicks++;
        if (!document.hidden) engine.frame(now / 1000, dt);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    } else {
      engine.frame(0.4, 0.016);
    }

    /* synchronous first paint (before rAF kicks in) */
    engine.snap();
    engine.frame(0.45, 0.016);

    /* pointer → graph picking + parallax */
    window.addEventListener("pointermove", function (ev) {
      // canvas may be inset as a right-side panel — normalize to its rect
      var cvr = canvas.getBoundingClientRect();
      engine.mouse.x = ((ev.clientX - cvr.left) / cvr.width) * 2 - 1;
      engine.mouse.y = ((ev.clientY - cvr.top) / cvr.height) * 2 - 1;
      var el = document.elementFromPoint(ev.clientX, ev.clientY);
      engine.pointer = { x: ev.clientX - cvr.left, y: ev.clientY - cvr.top, active: el === canvas };
    }, { passive: true });

    window.addEventListener("click", function (ev) {
      var el = document.elementFromPoint(ev.clientX, ev.clientY);
      if (el !== canvas || !engine.hovered) return;
      var n = engine.hovered.n;
      if (n.type === "project") {
        var pr = projectById(n.id);
        if (pr) openModal(pr);
      }
    });

    /* tooltip + cursor state per frame */
    engine.onFrame = function () {
      var hv = engine.hovered;
      if (hv && !reduceMotion) {
        var n = hv.n;
        var subText;
        if (n.type === "project") {
          var depN = (engine.neighbors[n.id] || []).length;
          subText = "click to open · " + depN + " deps";
        } else if (n.type === "skill") {
          var uses = (engine.neighbors[n.id] || []).filter(function (id) { return id.indexOf("p-") === 0; }).length;
          subText = nodeLabel(n.cat) + (uses ? " · used by " + uses + " build" + (uses > 1 ? "s" : "") : "");
        } else if (n.type === "hub") {
          var mods = (engine.neighbors[n.id] || []).filter(function (id) { return id.indexOf("p-") !== 0 && id !== "center"; }).length;
          subText = mods + " modules";
        } else {
          subText = "the center node";
        }
        tip.innerHTML = "<b>" + n.label + "</b><span>" + subText + "</span>";
        var tipRect = canvas.getBoundingClientRect();
        tip.style.left = (tipRect.left + hv.x) + "px";
        tip.style.top = (tipRect.top + hv.y - hv.r - 16) + "px";
        tip.classList.add("show");
      } else {
        tip.classList.remove("show");
      }
      if (cursorRing) {
        cursorRing.classList.toggle("on", !!hv || overInteractive);
      }
    };

    /* ensure at least one rendered frame even without rAF (some webviews) */
    setTimeout(function () {
      if (rafTicks === 0) { engine.formT = 1; engine.snap(); engine.frame(0.45, 0.016); }
    }, 250);

    /* QA / deep-link helpers */
    if (qaSection) {
      var target = document.getElementById(qaSection);
      if (target) {
        target.scrollIntoView();
        engine.updateTargetFromScroll(window.scrollY);
        engine.formT = 1;
        engine.snap();
        engine.frame(0.45, 0.016);
      }
    }
    if (qaModal) {
      engine.formT = 1;
      engine.snap();
      engine.frame(0.45, 0.016);
      openModal(D.PROJECTS[0]);
    }
  }

  /* ================= reveals (rect-based; robust without rAF/IO) ================= */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    var vh = window.innerHeight;
    var batch = 0;
    reveals = reveals.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (reduceMotion || (r.top < vh * 0.9 && r.bottom > 0)) {
        var idx = batch++;
        var useAnime = !reduceMotion && !qaSection && !qaModal && window.animeLite;
        if (useAnime) {
          // animejs-style entrance: expo slide-up for the block,
          // then elastic-back pop for its chips, staggered
          el.style.transition = "none";
          el.classList.add("in");
          window.animeLite({
            targets: el,
            translateY: [36, 0], scale: [0.96, 1], opacity: [0, 1],
            duration: 850, delay: idx * 95, easing: "outExpo",
            complete: function () { el.style.transition = ""; }
          });
          var chips = el.querySelectorAll(".chip");
          if (chips.length && chips.length <= 24) {
            Array.prototype.forEach.call(chips, function (c) { c.style.transition = "none"; });
            window.animeLite({
              targets: chips,
              translateY: [14, 0], scale: [0.65, 1], opacity: [0, 1],
              duration: 650, easing: "outBack",
              delay: window.animeLite.stagger(26, { start: idx * 95 + 160 })
            });
            setTimeout(function () {
              Array.prototype.forEach.call(chips, function (c) { c.style.transition = ""; });
            }, idx * 95 + 160 + chips.length * 26 + 750);
          }
        } else {
          el.classList.add("in");
        }
        return false;
      }
      return true;
    });
  }
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals);
  checkReveals();
  setTimeout(checkReveals, 60);

  /* ================= icon injection (offline inline SVG) ================= */
  if (window.NodeIcons) {
    Array.prototype.forEach.call(document.querySelectorAll(".chip[data-node]"), function (chip) {
      var id = chip.getAttribute("data-node");
      if (window.NodeIcons.has(id)) chip.insertAdjacentHTML("afterbegin", window.NodeIcons.svg(id, "ci"));
    });
    Array.prototype.forEach.call(document.querySelectorAll(".m-ico[data-ico]"), function (el) {
      el.innerHTML = window.NodeIcons.svg(el.getAttribute("data-ico"), "mi");
    });
  }

  /* ================= chips ↔ graph highlight ================= */
  Array.prototype.forEach.call(document.querySelectorAll(".chip[data-node]"), function (chip) {
    var id = chip.getAttribute("data-node");
    var on = function () { if (engine) engine.highlightId = id; };
    var off = function () { if (engine && engine.highlightId === id) engine.highlightId = null; };
    chip.addEventListener("mouseenter", on);
    chip.addEventListener("mouseleave", off);
    chip.addEventListener("focus", on);
    chip.addEventListener("blur", off);
  });

  /* ================= build modal ================= */
  var backdrop = document.getElementById("modal-backdrop");
  var modalBody = document.getElementById("modal-body");
  var modalClose = document.getElementById("modal-close");
  var lastFocus = null;

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function openModal(pr) {
    lastFocus = document.activeElement;
    var html = "";
    html += '<div class="m-tag mono">[ build : ' + pr.id + ' ]</div>';
    html += '<h3 id="modal-title">' + escapeHtml(pr.label) + '</h3>';
    html += '<span class="type">' + escapeHtml(pr.type) + "</span>";
    html += "<p class='m-tagline'>" + escapeHtml(pr.tagline) + "</p><ul>";
    pr.bullets.forEach(function (b) { html += "<li>" + escapeHtml(b) + "</li>"; });
    html += "</ul>";
    html += '<div class="m-deps mono">linked modules →</div><div class="chips">';
    pr.deps.forEach(function (d) {
      var ico = window.NodeIcons && window.NodeIcons.has(d) ? window.NodeIcons.svg(d, "ci") : "";
      html += '<span class="chip static">' + ico + escapeHtml(nodeLabel(d)) + "</span>";
    });
    html += "</div>";
    modalBody.innerHTML = html;
    backdrop.hidden = false;
    void backdrop.offsetWidth; // reflow so the enter transition can play
    backdrop.classList.add("show");
    body.classList.add("modal-open");
    modalClose.focus();
  }

  function closeModal() {
    backdrop.classList.remove("show");
    body.classList.remove("modal-open");
    if (reduceMotion) backdrop.hidden = true;
    else setTimeout(function () { if (!backdrop.classList.contains("show")) backdrop.hidden = true; }, 190);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".card[data-project]"), function (card) {
    card.addEventListener("click", function () {
      var pr = projectById(card.getAttribute("data-project"));
      if (pr) openModal(pr);
    });
    // subtle 3D tilt on hover (fine pointers, motion allowed)
    if (finePointer && !reduceMotion) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var nx = (ev.clientX - r.left) / r.width - 0.5;
        var ny = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(700px) rotateX(" + (-ny * 8).toFixed(2) + "deg) rotateY(" + (nx * 8).toFixed(2) + "deg) translateY(-3px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    }
  });
  modalClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", function (ev) {
    if (ev.target === backdrop) closeModal();
  });
  window.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !backdrop.hidden) closeModal();
  });

  /* ================= custom cursor (fine pointers only) ================= */
  var cursorDot = document.getElementById("cur-dot");
  var cursorRing = document.getElementById("cur-ring");
  var overInteractive = false;

  if (finePointer && !reduceMotion) {
    body.classList.add("cc");
    var rx = -100, ry = -100, tx = -100, ty = -100;
    window.addEventListener("pointermove", function (ev) {
      tx = ev.clientX; ty = ev.clientY;
      cursorDot.style.left = tx + "px";
      cursorDot.style.top = ty + "px";
      cursorDot.classList.add("live");
      cursorRing.classList.add("live");
    }, { passive: true });
    (function ringLoop() {
      rx += (tx - rx) * 0.11;
      ry += (ty - ry) * 0.11;
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
      requestAnimationFrame(ringLoop);
    })();
    var hoverSel = "a, button, .chip, .card";
    document.addEventListener("mouseover", function (ev) {
      overInteractive = !!(ev.target.closest && ev.target.closest(hoverSel));
    });
  } else {
    cursorDot.style.display = "none";
    cursorRing.style.display = "none";
  }

  /* ================= nav active state ================= */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var mainEl = document.querySelector("main");
  var lastStage = null, warpT = null;
  if ("IntersectionObserver" in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        // brief chromatic warp on stage transition ("flying through" feel)
        if (id !== lastStage) {
          if (lastStage !== null && !reduceMotion && mainEl) {
            mainEl.classList.add("warp");
            clearTimeout(warpT);
            warpT = setTimeout(function () { mainEl.classList.remove("warp"); }, 150);
          }
          lastStage = id;
        }
        navLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + id;
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* ================= kickoff (last: all bindings ready) ================= */
  if (skipBoot) {
    finishBoot();
  } else {
    // typewriter boot: character-by-character with rhythm pauses at line ends
    var bootText = BOOT_LINES.join("\n") + "\n";
    var bi = 0;
    var typeTick = function () {
      if (bootDone) return;
      if (bi >= bootText.length) {
        bootTimers.push(setTimeout(finishBoot, 420));
        return;
      }
      bi = Math.min(bootText.length, bi + 3);
      bootLog.textContent = bootText.slice(0, bi);
      var pause = bootText.charAt(bi - 1) === "\n" ? 90 : 11;
      bootTimers.push(setTimeout(typeTick, pause));
    };
    bootTimers.push(setTimeout(typeTick, 160));
    window.addEventListener("keydown", finishBoot, { once: true });
    window.addEventListener("pointerdown", finishBoot, { once: true });
  }
})();
