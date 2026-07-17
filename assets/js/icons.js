// ============================================================
// Node glyph system. Zero external assets.
// - Skills render a monogram badge in their category color.
// - Hubs render a geometric category glyph.
// - Projects render their index in a hex ring.
//
// WANT REAL BRAND LOGOS? Paste a Simple-Icons (CC0) 24x24 path
// string into SVG_PATHS below, keyed by skill id, e.g.
//   python: "M14.25.18l.9..."
// and it will be drawn instead of the monogram automatically.
// ============================================================

export const MONO = {
  python: "PY", jsts: "TS", php: "PHP", sql: "SQL", htmlcss: "</>",
  shell: "SH", json: "{}",
  nextjs: "N", react: "@", laravel: "LV", tailwind: "TW", supabase: "SB",
  rest: "API", a11y: "A11",
  pytorch: "PT", opencv: "CV", lstm: "ML", bayes: "BAY", stats: "STA",
  numpy: "NP", signal: "DSP",
  selenium: "SE", playwright: "PW", scraping: "SCR", concurrency: "CC",
  scheduler: "SCH", notify: "NTF", config: "CFG",
  linux: "LX", windows: "WIN", git: "GIT", mikrotik: "MT", cisco: "CO",
  lanwlan: "NET", http: "HTP",
  architecture: "ARC", testing: "TST", database: "DB", security: "SEC",
  prompt: ">_", aiworkflow: "AI", docs: "DOC",
};

// Real brand logos (Simple Icons, CC0) extracted into logos.js.
import { LOGOS } from "./logos.js";

// Optional manual overrides: skill id -> SVG path 'd' (24x24 viewBox).
// Anything set here WINS over the generated LOGOS map.
export const SVG_PATHS = {};
const _path2d = {};
function srcFor(id) {
  return SVG_PATHS[id] || LOGOS[id] || null;
}
function pathFor(id) {
  const d = srcFor(id);
  if (!d) return null;
  if (!_path2d[id]) _path2d[id] = new Path2D(d);
  return _path2d[id];
}

// ---- category geometric glyphs (drawn in a unit box centered at 0) ----
function glyphLang(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.13);
  ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-s * 0.18, -s * 0.42); ctx.lineTo(-s * 0.5, 0); ctx.lineTo(-s * 0.18, s * 0.42);
  ctx.moveTo(s * 0.18, -s * 0.42); ctx.lineTo(s * 0.5, 0); ctx.lineTo(s * 0.18, s * 0.42);
  ctx.stroke();
}
function glyphWeb(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.11);
  ctx.strokeRect(-s * 0.5, -s * 0.42, s, s * 0.84);
  ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.18); ctx.lineTo(s * 0.5, -s * 0.18); ctx.stroke();
  ctx.fillRect(-s * 0.38, -s * 0.34, s * 0.1, s * 0.1);
  ctx.fillRect(-s * 0.2, -s * 0.34, s * 0.1, s * 0.1);
}
function glyphAi(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.11); ctx.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * s * 0.14, Math.sin(a) * s * 0.14);
    ctx.lineTo(Math.cos(a) * s * 0.5, Math.sin(a) * s * 0.5);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(0, 0, s * 0.13, 0, Math.PI * 2); ctx.fill();
}
function glyphAuto(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.1);
  const teeth = 8;
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const r1 = s * 0.5, r2 = s * 0.36;
    ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.lineTo(Math.cos(a + 0.22) * r2, Math.sin(a + 0.22) * r2);
  }
  ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2); ctx.stroke();
}
function glyphSys(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.1);
  for (let i = -1; i <= 1; i++) {
    const y = i * s * 0.3;
    ctx.strokeRect(-s * 0.45, y - s * 0.12, s * 0.9, s * 0.24);
    ctx.beginPath(); ctx.arc(s * 0.3, y, s * 0.03, 0, Math.PI * 2); ctx.fill();
  }
}
function glyphEng(ctx, s) {
  ctx.lineWidth = Math.max(1, s * 0.1); ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(0, 0, s * 0.46, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5);
  ctx.moveTo(-s * 0.5, 0); ctx.lineTo(s * 0.5, 0);
  ctx.stroke();
}
const CAT_GLYPH = {
  "cat-lang": glyphLang, "cat-web": glyphWeb, "cat-ai": glyphAi,
  "cat-auto": glyphAuto, "cat-sys": glyphSys, "cat-prac": glyphEng,
};

function contrast(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16),
    g = parseInt(h.substring(2, 4), 16),
    b = parseInt(h.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#04120e" : "#e9fff8";
}

// Draw a node's symbol. r is the node radius in px.
export function drawGlyph(ctx, n, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);

  if (n.type === "center") {
    ctx.fillStyle = "#04120e";
    ctx.font = `700 ${r * 0.9}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("H", 0, r * 0.04);
    ctx.restore(); return;
  }

  if (n.type === "hub") {
    ctx.strokeStyle = contrast(color); ctx.fillStyle = contrast(color);
    const g = CAT_GLYPH[n.cat];
    if (g && r > 5) g(ctx, r * 1.15);
    ctx.restore(); return;
  }

  if (n.type === "project") {
    ctx.fillStyle = "#04120e";
    ctx.font = `700 ${Math.max(7, r * 0.85)}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(n.label ? n.label[0] : "P", 0, r * 0.06);
    ctx.restore(); return;
  }

  // skill
  const p = pathFor(n.id);
  if (p && r > 4) {
    const sc = (r * 1.7) / 24;
    ctx.translate(-12 * sc, -12 * sc);
    ctx.scale(sc, sc);
    ctx.fillStyle = contrast(color);
    ctx.fill(p);
    ctx.restore(); return;
  }
  const code = MONO[n.id] || (n.label || "").substring(0, 2).toUpperCase();
  if (r > 4.5) {
    ctx.fillStyle = contrast(color);
    let fs = r * 0.95;
    if (code.length >= 3) fs = r * 0.72;
    ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(code, 0, r * 0.06);
  }
  ctx.restore();
}
