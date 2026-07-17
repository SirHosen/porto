// Interactive dependency graph - canvas 2D with 3D projection. No libraries.
// Exposes a camera API so the page can drive a parallax zoom-in on scroll.

import { GRAPH } from "./data.js";
import { drawGlyph } from "./icons.js";

const R = { center: 6.2, hub: 4.4, project: 4.0, skill: 3.0 };

function colorFor(n) {
  if (n.type === "center") return "#ffffff";
  if (n.type === "project") return "#39ffce";
  if (n.cat && GRAPH.color[n.cat]) return GRAPH.color[n.cat];
  return "#7c8b88";
}
function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function initGraph(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onHover = opts.onHover || (() => {});
  const onSelect = opts.onSelect || (() => {});
  const onNodeEnter = opts.onNodeEnter || (() => {});

  const cam = { zoom: 0.72, zoomT: 0.72, interactive: false, autoRate: 0.0016, labels: 0, labelsT: 0 };

  const state = {
    rotY: 0.5, rotX: 0.16, auto: !reduce, dragging: false,
    lastX: 0, lastY: 0, resume: 0, focal: 240,
    w: 0, h: 0, cx: 0, cy: 0, baseScale: 1,
    hovered: null, activeCat: null, lastHovered: null, t: 0,
  };

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    state.w = rect.width; state.h = rect.height;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.cx = rect.width / 2;
    state.cy = rect.height / 2;
    state.baseScale = Math.min(rect.width, rect.height) / 170;
  }

  const proj = new Map();
  function project() {
    const scale = state.baseScale * cam.zoom;
    const cyr = Math.cos(state.rotY), syr = Math.sin(state.rotY);
    const cxr = Math.cos(state.rotX), sxr = Math.sin(state.rotX);
    for (const n of GRAPH.nodes) {
      const [x, y, z] = n.p;
      const x1 = x * cyr - z * syr;
      const z1 = x * syr + z * cyr;
      const y1 = y * cxr - z1 * sxr;
      const z2 = y * sxr + z1 * cxr;
      const persp = state.focal / (state.focal + z2);
      const sc = scale * persp;
      proj.set(n.id, {
        sx: state.cx + x1 * sc,
        sy: state.cy - y1 * sc,
        z: z2,
        r: (R[n.type] || 2.5) * sc,
      });
    }
  }

  function focusSet() {
    if (state.hovered) {
      const s = new Set([state.hovered]);
      GRAPH.adj[state.hovered]?.forEach((n) => s.add(n));
      return s;
    }
    if (state.activeCat) return GRAPH.catMembers[state.activeCat];
    return null;
  }

  function draw() {
    const fs = focusSet();
    ctx.clearRect(0, 0, state.w, state.h);

    // edges
    for (const e of GRAPH.edges) {
      const a = proj.get(e.a), b = proj.get(e.b);
      if (!a || !b) continue;
      const hot = fs ? fs.has(e.a) && fs.has(e.b) : false;
      ctx.lineWidth = hot ? 1.4 : 1;
      if (fs && !hot) ctx.strokeStyle = "rgba(120,150,145,0.045)";
      else if (hot) ctx.strokeStyle = "rgba(57,255,206,0.75)";
      else ctx.strokeStyle = "rgba(80,150,135,0.15)";
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.lineTo(b.sx, b.sy);
      ctx.stroke();

      // traveling pulse on hot edges
      if (hot) {
        const tt = (state.t * 0.4 + (e.a.length + e.b.length) * 0.11) % 1;
        const px = a.sx + (b.sx - a.sx) * tt;
        const py = a.sy + (b.sy - a.sy) * tt;
        ctx.fillStyle = "rgba(180,255,235,0.9)";
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // nodes, depth sorted
    const order = [...GRAPH.nodes].sort((m, n) => proj.get(m.id).z - proj.get(n.id).z);
    for (const n of order) {
      const pr = proj.get(n.id);
      const dim = fs ? !fs.has(n.id) : false;
      const emph = fs ? fs.has(n.id) : false;
      const base = colorFor(n);
      const pulse = n.type === "project" || n.type === "hub"
        ? 1 + Math.sin(state.t * 2 + n.id.length) * 0.05 : 1;
      const rr = pr.r * (emph ? 1.35 : 1) * pulse;
      const alpha = dim ? 0.13 : 1;

      if (!dim) {
        const g = ctx.createRadialGradient(pr.sx, pr.sy, 0, pr.sx, pr.sy, rr * 3.6);
        g.addColorStop(0, hexA(base, emph ? 0.55 : 0.3));
        g.addColorStop(1, hexA(base, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pr.sx, pr.sy, rr * 3.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(pr.sx, pr.sy, rr, 0, Math.PI * 2);
      ctx.fill();

      if (n.type === "center" || n.type === "project" || n.type === "hub") {
        ctx.strokeStyle = hexA(base, alpha);
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(pr.sx, pr.sy, rr + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // icon / monogram inside node
      if (!dim) drawGlyph(ctx, n, pr.sx, pr.sy, rr, base, alpha);

      // text label (hubs/projects always; skills when zoomed/emph)
      const showLabel =
        n.type === "center" || n.type === "hub" || n.type === "project" ||
        emph || (n.type === "skill" && cam.labels > 0.5 && rr > 7);
      if (showLabel) {
        ctx.globalAlpha = dim ? 0.2 : 0.92;
        ctx.fillStyle = "#d7e6e2";
        ctx.font = `${n.type === "center" ? 14 : n.type === "skill" ? 9 : 11}px "JetBrains Mono", monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
        ctx.fillText(n.label, pr.sx, pr.sy - rr - 6);
        ctx.globalAlpha = 1;
      }
    }
  }

  function hit(mx, my) {
    let best = null, bestD = 20 * 20;
    for (const n of GRAPH.nodes) {
      const pr = proj.get(n.id);
      if (!pr) continue;
      const d = (pr.sx - mx) ** 2 + (pr.sy - my) ** 2;
      const rad = Math.max(pr.r + 5, 9);
      if (d < rad * rad && d < bestD) { best = n; bestD = d; }
    }
    return best;
  }

  const down = (e) => {
    if (!cam.interactive) return;
    state.dragging = true; state.auto = false;
    state.lastX = e.clientX; state.lastY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
  };
  const move = (e) => {
    if (!cam.interactive) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    if (state.dragging) {
      state.rotY += (e.clientX - state.lastX) * 0.007;
      state.rotX += (e.clientY - state.lastY) * 0.007;
      state.rotX = Math.max(-1.1, Math.min(1.1, state.rotX));
      state.lastX = e.clientX; state.lastY = e.clientY;
    } else {
      const n = hit(mx, my);
      const id = n ? n.id : null;
      if (id !== state.hovered) {
        state.hovered = id;
        canvas.style.cursor = id ? "pointer" : "grab";
        onHover(n);
        if (id && id !== state.lastHovered) { state.lastHovered = id; onNodeEnter(n); }
        if (!id) state.lastHovered = null;
      }
    }
  };
  const up = (e) => {
    if (state.dragging) { state.dragging = false; state.resume = performance.now() + 2200; }
    canvas.releasePointerCapture?.(e.pointerId);
  };
  const click = (e) => {
    if (!cam.interactive) return;
    const rect = canvas.getBoundingClientRect();
    const n = hit(e.clientX - rect.left, e.clientY - rect.top);
    if (n) onSelect(n);
  };
  const leave = () => {
    if (!state.dragging && state.hovered) { state.hovered = null; onHover(null); canvas.style.cursor = "grab"; }
  };

  canvas.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  canvas.addEventListener("click", click);
  canvas.addEventListener("pointerleave", leave);
  window.addEventListener("resize", resize);

  resize();
  let raf = 0;
  function loop() {
    state.t += 0.016;
    cam.zoom += (cam.zoomT - cam.zoom) * 0.08;
    cam.labels += (cam.labelsT - cam.labels) * 0.08;
    if (state.auto && !state.dragging && performance.now() > state.resume) state.rotY += cam.autoRate;
    project();
    draw();
    raf = requestAnimationFrame(loop);
  }
  loop();

  return {
    setActiveCat(cat) { state.activeCat = cat; },
    setHovered(id) { state.hovered = id; onHover(id ? GRAPH.nodes.find((n) => n.id === id) : null); },
    setCamera(c) {
      if (c.zoom != null) cam.zoomT = c.zoom;
      if (c.interactive != null) {
        cam.interactive = c.interactive;
        canvas.style.pointerEvents = c.interactive ? "auto" : "none";
        canvas.style.cursor = c.interactive ? "grab" : "default";
        state.auto = c.interactive ? state.auto : true;
      }
      if (c.autoRate != null) cam.autoRate = c.autoRate;
      if (c.labels != null) cam.labelsT = c.labels;
    },
    destroy() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      canvas.removeEventListener("click", click);
      canvas.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
    },
  };
}
