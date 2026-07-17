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

  $("#signal-links").innerHTML = `<a href="${PROFILE.github}" target="_blank" rel="noopener" data-sfx>GitHub \u2197</a>`;
  $("#foot-handle").textContent = PROFILE.handle;
  $("#foot-year").textContent = new Date().getFullYear();
}
renderContent();

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

const graph = initGraph(graphCanvas, {
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

  // Phase A: hero -> map (first viewport of scroll) zooms + unblurs the graph.
  const p = clamp(y / (H * 0.85), 0, 1);
  // Phase B: when leaving the map, fade the graph out as content covers it.
  const outStart = mapTop + mapH - H * 1.1;
  const pOut = clamp((y - outStart) / (H * 0.6), 0, 1);

  const blur = lerp(9, 0, p);
  const opacity = lerp(0.4, 1, p) * (1 - pOut);
  const zoom = lerp(0.72, 1.18, p);

  graphCanvas.style.filter = `blur(${blur.toFixed(2)}px)`;
  graphCanvas.style.opacity = opacity.toFixed(3);

  const interactive = p > 0.85 && pOut < 0.15;
  graph.setCamera({
    zoom,
    interactive,
    labels: p > 0.75 ? 1 : 0,
    autoRate: interactive ? 0.0009 : 0.0016,
  });
  if (interactive !== lastInteractive) {
    lastInteractive = interactive;
    if (mapPanel) mapPanel.classList.toggle("live", interactive);
  }

  // hero parallax: name drifts up and fades as you scroll into the map
  if (heroCopy) {
    heroCopy.style.transform = `translate(0, ${(-y * 0.25).toFixed(1)}px) scale(${(1 + p * 0.12).toFixed(3)})`;
    heroCopy.style.opacity = (1 - clamp(p * 1.15, 0, 1)).toFixed(3);
  }

  requestAnimationFrame(frameCam);
}
if (reduce) {
  graphCanvas.style.filter = "none";
  graphCanvas.style.opacity = "1";
  graph.setCamera({ zoom: 1, interactive: true, labels: 1, autoRate: 0 });
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
