// Orchestration: parallax scroll, boot, HUD, reveals, sound, graph wiring.

import { PROFILE, CAPABILITIES, STATS, CATS, PROJECTS, GRAPH } from "./data.js";
import { initBackground } from "./background.js";
import { initGraph } from "./graph.js";
import { sfx, initMute, isMuted, setMuted, onMute } from "./sfx.js";

const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bgCanvas = $("#bg-canvas");
const graphCanvas = $("#graph-canvas");

initBackground(bgCanvas);

// ---------- Render content ----------
function renderContent() {
  $("#hero-name").textContent = PROFILE.name;
  $("#hero-name").dataset.text = PROFILE.name;
  $("#hero-roles").innerHTML = PROFILE.roles
    .map((r) => `<span>${r}</span>`).join('<i class="sep">//</i>');
  $("#hero-pitch").textContent = PROFILE.pitch;
  $("#hero-handle").textContent = PROFILE.handle;
  $("#caps").innerHTML = CAPABILITIES.map((c) => `<li>${c}</li>`).join("");

  $("#legend").innerHTML = CATS
    .map((c) => `<button class="chip" data-cat="${c.id}" style="--c:${c.color}">
      <span class="chip__dot"></span>${c.code}<em>${c.label}</em></button>`).join("");

  $("#work-grid").innerHTML = PROJECTS.map((p) => `
    <article class="card" data-node="${p.id}" data-reveal>
      <header><span class="card__idx">${p.index}</span><span class="card__kind">${p.kind}</span></header>
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
      <ul class="card__stack">${p.stack.map((s) => `<li>${s}</li>`).join("")}</ul>
      <footer>
        ${p.live ? `<a href="${p.live}" target="_blank" rel="noopener" data-sfx>Live \u2197</a>` : ""}
        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener" data-sfx>Source \u2197</a>` : `<span class="card__na">private lab</span>`}
      </footer>
    </article>`).join("");

  $("#stats").innerHTML = STATS
    .map((s) => `<div class="stat" data-reveal><b>${s.value}</b><span>${s.label}</span></div>`).join("");

  $("#signal-links").innerHTML = `
    <a href="${PROFILE.github}" target="_blank" rel="noopener" data-sfx>Explore GitHub \u2197</a>
    <a href="#work" data-sfx>Review selected work \u2191</a>`;
  $("#foot-handle").textContent = PROFILE.handle;
  $("#foot-year").textContent = new Date().getFullYear();
}
renderContent();

// ---------- Kinetic type / cinematic entrance ----------
const heroName = $("#hero-name");
const heroPitch = $("#hero-pitch");
const nameText = heroName.textContent;
const pitchText = heroPitch.textContent;
heroName.innerHTML = [...nameText].map((c) => `<span class="glyph">${c}</span>`).join("");
heroPitch.innerHTML = pitchText.split(" ").map((w) => `<span class="word">${w}&nbsp;</span>`).join("");

function runIntro() {
  if (reduce) return;
  heroName.querySelectorAll(".glyph").forEach((glyph, i) => glyph.animate([
    { opacity: 0, transform: `translateY(${70 + i * 7}px) rotate(${i % 2 ? 3 : -3}deg)`, filter: "blur(14px)" },
    { opacity: 1, transform: "none", filter: "blur(0)" },
  ], { duration: 1100, delay: i * 65, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));

  heroPitch.querySelectorAll(".word").forEach((word, i) => word.animate([
    { opacity: 0, transform: "translateY(18px)", filter: "blur(7px)" },
    { opacity: 1, transform: "none", filter: "blur(0)" },
  ], { duration: 650, delay: 540 + i * 32, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));

  document.querySelectorAll(".hero__topline, .hero__roles, .caps, .kinetic-rail, .scroll-hint").forEach((el, i) => el.animate([
    { opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" },
  ], { duration: 700, delay: 260 + i * 90, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" }));
}

let booted = false;
try { booted = sessionStorage.getItem("booted") === "1"; } catch (e) {}
setTimeout(runIntro, booted || reduce ? 80 : 3600);

// ---------- Scroll-directed cinematic sequence ----------
const sequence = $("#sequence");
const sequenceChapters = [...document.querySelectorAll(".sequence__chapter")];
const sequenceIndex = $("#sequence-index");
const sequenceRail = $("#sequence-rail");
const sequenceVisual = $(".sequence__visual");
const sequenceCore = $(".core-pulse");
const orbitA = $(".core-orbit--a");
const orbitB = $(".core-orbit--b");
const orbitC = $(".core-orbit--c");
const codeRain = $("#code-rain");
const codeTokens = ["async.run()", "0x8DF6C5", "POST /v1", "p95 42ms", "model.eval()", "SELECT *", "pytest -q", "git push", "await queue", "200 OK", "cron:*/5", "loss 0.031"];
codeRain.innerHTML = codeTokens.map((token, i) => {
  const angle = (i / codeTokens.length) * Math.PI * 2;
  const radius = 34 + (i % 3) * 9;
  return `<span style="left:${50 + Math.cos(angle) * radius}%;top:${50 + Math.sin(angle) * radius}%">${token}</span>`;
}).join("");
const rainTokens = [...codeRain.children];
let activeScene = 0;

function updateSequence() {
  if (!sequence) return;
  const rect = sequence.getBoundingClientRect();
  const travel = sequence.offsetHeight - innerHeight;
  const progress = clamp(-rect.top / Math.max(travel, 1), 0, 1);
  const scene = Math.min(3, Math.floor(progress * 4));
  if (scene !== activeScene) {
    activeScene = scene;
    sequenceChapters.forEach((chapter, i) => chapter.classList.toggle("is-active", i === scene));
    sequenceIndex.textContent = `${String(scene + 1).padStart(2, "0")} / 04`;
    if (!reduce) sfx.node();
  }
  sequenceRail.style.transform = `scaleX(${progress})`;
  if (reduce) return;
  orbitA.style.rotate = `${progress * 520}deg`;
  orbitB.style.rotate = `${progress * -760}deg`;
  orbitC.style.rotate = `${progress * 980}deg`;
  sequenceCore.style.scale = `${1 + Math.sin(progress * Math.PI * 12) * .055}`;
  sequenceVisual.style.translate = `${Math.sin(progress * Math.PI * 4) * 3.5}vw ${Math.cos(progress * Math.PI * 3) * 2}vh`;
  rainTokens.forEach((token, i) => {
    token.style.translate = `${Math.sin(progress * 15 + i) * 18}px ${Math.cos(progress * 11 + i * .7) * 18}px`;
    token.style.opacity = String(.25 + Math.abs(Math.sin(progress * 8 + i)) * .65);
  });
}

// Pointer light and project-card depth. Native CSS + WAAPI; no animation dependency.
if (!reduce && matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    document.body.style.setProperty("--mx", `${(e.clientX / innerWidth) * 100}%`);
    document.body.style.setProperty("--my", `${(e.clientY / innerHeight) * 100}%`);
  }, { passive: true });

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--rx", `${(0.5 - y) * 4}deg`);
      card.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
      card.style.setProperty("--shine-x", `${x * 100}%`);
      card.style.setProperty("--shine-y", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

// ---------- Graph wiring ----------
const readoutLabel = $("#readout-label");
const readoutMeta = $("#readout-meta");
const readoutDot = $("#readout-dot");

function metaFor(n) {
  if (!n) return "hover a node to inspect";
  if (n.type === "skill") return `SKILL \u00b7 used in ${GRAPH.usage[n.id] || 0} projects`;
  if (n.type === "project") return "PROJECT \u00b7 click to open";
  if (n.type === "hub") return "DOMAIN \u00b7 click to filter";
  return "ROOT NODE";
}

const graphHit = $("#map-hit");
const graph = initGraph(graphCanvas, {
  hitTarget: graphHit,
  onHover(n) {
    readoutLabel.textContent = n ? n.label : "\u2014";
    readoutMeta.textContent = metaFor(n);
    readoutDot.style.background = n
      ? (n.type === "project" ? "#39ffce" : n.cat ? GRAPH.color[n.cat] : "#ffffff")
      : "#324b45";
  },
  onNodeEnter() { sfx.node(); },
  onSelect(n) {
    sfx.click();
    if (n.type === "project") {
      const p = PROJECTS.find((x) => x.id === n.id);
      if (p?.live) window.open(p.live, "_blank", "noopener");
      else if (p?.repo) window.open(p.repo, "_blank", "noopener");
      else document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
    } else if (n.type === "hub") {
      toggleCat(n.id);
    }
  },
});

let activeCat = null;
function toggleCat(cat) {
  activeCat = activeCat === cat ? null : cat;
  graph.setActiveCat(activeCat);
  document.querySelectorAll("#legend .chip").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.cat === activeCat)
  );
}
$("#legend").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  sfx.click();
  toggleCat(b.dataset.cat);
});
$("#legend").addEventListener("pointerover", (e) => {
  const b = e.target.closest(".chip");
  if (b && !activeCat) graph.setActiveCat(b.dataset.cat);
});
$("#legend").addEventListener("pointerout", () => { if (!activeCat) graph.setActiveCat(null); });

// zoom / pan controls
const gControls = $("#graph-controls");
if (gControls) {
  gControls.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-zoom]");
    if (!b) return;
    sfx.click();
    const a = b.dataset.zoom;
    if (a === "in") graph.zoomBy(1.28);
    else if (a === "out") graph.zoomBy(1 / 1.28);
    else graph.resetView();
  });
}

document.querySelectorAll(".card[data-node]").forEach((card) => {
  card.addEventListener("pointerenter", () => graph.setHovered(card.dataset.node));
  card.addEventListener("pointerleave", () => graph.setHovered(null));
});

// ---------- Parallax: scroll drives the graph camera ----------
const heroCopy = $("#hero-copy");
const mapSection = $("#map");
const mapPanel = $("#map-panel");
let lastInteractive = null;

function frameCam() {
  const H = window.innerHeight;
  const y = window.scrollY;
  const mapTop = mapSection.offsetTop;
  const mapH = mapSection.offsetHeight;

  updateSequence();

  // Graph stays quiet during cinematic sequence, then resolves into interactive atlas.
  const mapProgress = clamp((y - mapTop + H * 0.85) / (H * 0.85), 0, 1);
  const outStart = mapTop + mapH - H * 1.1;
  const pOut = clamp((y - outStart) / (H * 0.6), 0, 1);

  const blur = lerp(11, 0, mapProgress);
  const opacity = lerp(0.04, 1, mapProgress) * (1 - pOut);
  const zoom = lerp(0.68, 1.18, mapProgress);

  graphCanvas.style.filter = `blur(${blur.toFixed(2)}px)`;
  graphCanvas.style.opacity = opacity.toFixed(3);

  const interactive = mapProgress > 0.85 && pOut < 0.15;
  graph.setCamera({
    zoom,
    interactive,
    labels: mapProgress > 0.75 ? 1 : 0,
    autoRate: interactive ? 0.0009 : 0.0016,
  });
  if (interactive !== lastInteractive) {
    lastInteractive = interactive;
    if (mapPanel) mapPanel.classList.toggle("live", interactive);
    if (graphHit) graphHit.classList.toggle("live", interactive);
  }

  // Hero leaves before cinematic chapters begin.
  if (heroCopy) {
    const heroOut = clamp(y / (H * .8), 0, 1);
    heroCopy.style.transform = `translate(0, ${(-y * 0.22).toFixed(1)}px) scale(${(1 + heroOut * 0.08).toFixed(3)})`;
    heroCopy.style.opacity = (1 - heroOut).toFixed(3);
  }

  requestAnimationFrame(frameCam);
}
if (reduce) {
  updateSequence();
  graphCanvas.style.filter = "none";
  graphCanvas.style.opacity = "1";
  graph.setCamera({ zoom: 1, interactive: true, labels: 1, autoRate: 0 });
  if (graphHit) graphHit.classList.add("live");
  if (mapPanel) mapPanel.classList.add("live");
} else {
  requestAnimationFrame(frameCam);
}

// ---------- Sound ----------
initMute();
const soundBtn = $("#sound-toggle");
function syncSound() {
  const m = isMuted();
  soundBtn.classList.toggle("is-on", !m);
  soundBtn.setAttribute("aria-pressed", String(!m));
  soundBtn.querySelector("span").textContent = m ? "SOUND OFF" : "AMBIENT ON";
}
soundBtn.addEventListener("click", () => {
  setMuted(!isMuted());
  if (!isMuted()) sfx.toggle();
  syncSound();
});
onMute(syncSound);
syncSound();

document.addEventListener("pointerover", (e) => {
  if (e.target.closest("a, button, [data-sfx]")) sfx.hover();
});

// ---------- HUD clock / uptime ----------
const clock = $("#hud-clock");
const uptime = $("#hud-uptime");
const bootTime = Date.now();
function tick() {
  const d = new Date();
  clock.textContent = d.toISOString().substring(11, 19) + "Z";
  const s = Math.floor((Date.now() - bootTime) / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  uptime.textContent = `UP ${hh}:${mm}:${ss}`;
}
tick();
setInterval(tick, 1000);

// ---------- Reveals / scroll progress / nav ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

const prog = $("#scroll-prog");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
  prog.style.transform = `scaleX(${p})`;
}, { passive: true });

const navLinks = [...document.querySelectorAll(".nav__link")];
const secIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll("section[id]").forEach((s) => secIO.observe(s));

// ---------- Custom cursor ----------
const cursor = $("#cursor");
if (!reduce && cursor) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function cloop() {
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(cloop);
  })();
  document.addEventListener("pointerover", (e) => {
    cursor.classList.toggle("hot", !!e.target.closest("a, button, canvas, [data-sfx]"));
  });
}

// ---------- Boot ----------
const boot = $("#boot");
const bootLog = $("#boot-log");
const LINES = [
  "> initializing kernel  ................  OK",
  "> mounting /dev/portfolio  .............  OK",
  "> loading node graph [57 nodes]  .......  OK",
  "> compiling GLSL background shader  ....  OK",
  "> arming ambient audio engine  .........  STANDBY",
  "> boot complete. welcome, operator.",
];
function runBoot() {
  let already = false;
  try { already = sessionStorage.getItem("booted") === "1"; } catch (e) {}
  if (already || reduce) { boot.remove(); return; }
  let i = 0;
  function next() {
    if (i >= LINES.length) {
      setTimeout(() => { boot.classList.add("done"); setTimeout(() => boot.remove(), 900); }, 500);
      try { sessionStorage.setItem("booted", "1"); } catch (e) {}
      return;
    }
    const line = document.createElement("div");
    line.className = "boot__line";
    line.textContent = LINES[i];
    bootLog.appendChild(line);
    sfx.boot();
    i++;
    setTimeout(next, 260 + Math.random() * 180);
  }
  next();
}
runBoot();
