// ============================================================
// SINGLE SOURCE OF TRUTH - edit copy, skills, and projects here.
// No framework, no build step. Plain ES module.
// ============================================================

export const PROFILE = {
  handle: "hosea.dev",
  name: "HOSEA",
  roles: ["PYTHON ENGINEER", "FULL-STACK DEV", "AUTOMATION & APPLIED AI"],
  pitch:
    "I build systems, not scripts \u2014 production web apps, automation engines, and applied-AI tooling.",
  location: "ID \u00b7 UTC+7",
  github: "https://github.com/SirHosen",
};

export const CAPABILITIES = [
  "Python", "TypeScript", "Next.js", "React", "Laravel", "PyTorch",
  "Automation", "Web Scraping", "Prompt Engineering", "Systems / Networking",
];

export const STATS = [
  { value: "8+", label: "Shipped Projects" },
  { value: "6", label: "Skill Domains" },
  { value: "MTCNA", label: "Network Certified" },
  { value: "24/7", label: "Build Mode" },
];

// Categories (graph hubs) + palette
export const CATS = [
  { id: "cat-lang", label: "Languages", code: "LANG", color: "#39ffce" },
  { id: "cat-web", label: "Web & Product", code: "WEB", color: "#4dd4ff" },
  { id: "cat-ai", label: "Data & AI", code: "AI", color: "#b98cff" },
  { id: "cat-auto", label: "Automation", code: "AUTO", color: "#ffd166" },
  { id: "cat-sys", label: "Systems & Network", code: "SYS", color: "#7cffb2" },
  { id: "cat-prac", label: "Engineering", code: "ENG", color: "#ff8fa3" },
];

// [id, label, categoryId]
export const SKILLS = [
  ["python", "Python", "cat-lang"],
  ["jsts", "TypeScript / JS", "cat-lang"],
  ["php", "PHP", "cat-lang"],
  ["sql", "SQL", "cat-lang"],
  ["htmlcss", "HTML / CSS", "cat-lang"],
  ["shell", "Shell / Batch", "cat-lang"],
  ["json", "JSON / Config", "cat-lang"],

  ["nextjs", "Next.js", "cat-web"],
  ["react", "React", "cat-web"],
  ["laravel", "Laravel", "cat-web"],
  ["tailwind", "Tailwind", "cat-web"],
  ["supabase", "Supabase", "cat-web"],
  ["rest", "REST APIs", "cat-web"],
  ["a11y", "A11y / SEO", "cat-web"],

  ["pytorch", "PyTorch", "cat-ai"],
  ["opencv", "OpenCV / OCR", "cat-ai"],
  ["lstm", "LSTM / Sequence", "cat-ai"],
  ["bayes", "Bayesian Inference", "cat-ai"],
  ["stats", "Statistical Validation", "cat-ai"],
  ["numpy", "NumPy", "cat-ai"],
  ["signal", "Signal Processing", "cat-ai"],

  ["selenium", "Selenium", "cat-auto"],
  ["playwright", "Playwright", "cat-auto"],
  ["scraping", "Web Scraping", "cat-auto"],
  ["concurrency", "Async / Concurrency", "cat-auto"],
  ["scheduler", "Schedulers", "cat-auto"],
  ["notify", "Webhooks / Notify", "cat-auto"],
  ["config", "Config-driven Engines", "cat-auto"],

  ["linux", "Linux", "cat-sys"],
  ["windows", "Windows", "cat-sys"],
  ["git", "Git / GitHub", "cat-sys"],
  ["mikrotik", "MikroTik / MTCNA", "cat-sys"],
  ["cisco", "Cisco", "cat-sys"],
  ["lanwlan", "LAN / WLAN", "cat-sys"],
  ["http", "HTTP / Proxy", "cat-sys"],

  ["architecture", "Modular Architecture", "cat-prac"],
  ["testing", "Automated Testing", "cat-prac"],
  ["database", "PostgreSQL / MySQL", "cat-prac"],
  ["security", "Auth & Secure Config", "cat-prac"],
  ["prompt", "Prompt Engineering", "cat-prac"],
  ["aiworkflow", "AI-assisted Dev", "cat-prac"],
  ["docs", "Technical Docs", "cat-prac"],
];

// Full project records (cards + graph deps share this)
export const PROJECTS = [
  {
    id: "p-nestfetch", index: "01", name: "NESTfetch", kind: "Python Platform",
    tagline: "Config-driven multi-site scraper platform: async fetch, retries, caching, SQLite/CSV exports, CLI + dashboard.",
    stack: ["Python", "Async", "Scraping", "SQLite", "Testing"],
    repo: "https://github.com/SirHosen/gaming-scrap",
    deps: ["python", "scraping", "playwright", "concurrency", "config", "database", "testing", "architecture"],
  },
  {
    id: "p-gamenest", index: "02", name: "GameNest", kind: "Full-stack \u00b7 Live",
    tagline: "Production game catalog with protected CMS, auth, image storage, advanced search and SEO. Deployed on Vercel.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    repo: "https://github.com/SirHosen/gamenest", live: "https://gamenest-chi.vercel.app",
    deps: ["jsts", "nextjs", "react", "tailwind", "supabase", "database", "security", "a11y"],
  },
  {
    id: "p-spin", index: "03", name: "Spinwheel AI Lab", kind: "Applied ML",
    tagline: "CV + Bayesian + PyTorch LSTM lab with walk-forward backtesting, log-loss and Brier scoring \u2014 honest evidence, no hype.",
    stack: ["Python", "PyTorch", "OpenCV", "Bayesian", "NumPy"],
    repo: "https://github.com/SirHosen/Project-Wheel",
    deps: ["python", "pytorch", "opencv", "lstm", "bayes", "stats", "numpy", "testing"],
  },
  {
    id: "p-sonorus", index: "04", name: "Sonorus", kind: "Full-stack \u00b7 Laravel",
    tagline: "Classical-music streaming product with role-based admin, playlists, favorites, history and search.",
    stack: ["PHP", "Laravel", "MySQL", "Blade", "Auth"],
    repo: "https://github.com/SirHosen/Sonorus",
    deps: ["php", "laravel", "jsts", "htmlcss", "database", "security", "architecture"],
  },
  {
    id: "p-sonic", index: "05", name: "SonicCipher", kind: "Desktop \u00b7 Audio DSP",
    tagline: "Modular PyQt desktop app encoding text into sound with waveform, spectrogram and FFT visualization.",
    stack: ["Python", "PyQt", "NumPy", "DSP", "PyInstaller"],
    repo: "https://github.com/SirHosen/SonicChipper",
    deps: ["python", "numpy", "signal", "architecture", "testing"],
  },
  {
    id: "p-formqa", index: "06", name: "Adaptive Form QA", kind: "Automation \u00b7 QA",
    tagline: "Configurable Selenium harness for authorized testing of dynamic multi-page forms with JSON answer profiles.",
    stack: ["Python", "Selenium", "JSON", "Concurrency", "Testing"],
    repo: "https://github.com/SirHosen/gform_bot",
    deps: ["python", "selenium", "json", "concurrency", "testing", "config"],
  },
  {
    id: "p-sessionlab", index: "07", name: "Browser Session Reliability Lab", kind: "Automation \u00b7 Systems",
    tagline: "Controlled browser-lifecycle experiment for authorized multi-session UI and proxy reliability testing.",
    stack: ["Python", "Selenium", "Concurrency", "HTTP / Proxy", "Logging"],
    deps: ["python", "selenium", "concurrency", "http", "windows", "testing"],
  },
  {
    id: "p-portfolio", index: "08", name: "This System", kind: "Creative Engineering",
    tagline: "This portfolio: a zero-dependency WebGL + canvas system UI with an interactive dependency graph.",
    stack: ["WebGL / GLSL", "Canvas 2D", "Web Audio", "Vanilla JS"],
    deps: ["jsts", "htmlcss", "architecture", "a11y", "docs", "aiworkflow"],
  },
];

// ---------- Graph layout (radial 3D positions) ----------
const seeded = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

function buildGraph() {
  const nodes = [];
  const edges = [];
  const posMap = {};

  nodes.push({ id: "center", label: "HOSEA", type: "center", p: [0, 0, 0] });
  posMap["center"] = [0, 0, 0];

  const hub = {};
  CATS.forEach((c, i) => {
    const th = (i / CATS.length) * Math.PI * 2 - Math.PI / 7;
    const r = 30;
    const p = [r * Math.cos(th), (i % 2 ? 9 : -9) + seeded(i) * 4, r * Math.sin(th)];
    hub[c.id] = { th, p };
    posMap[c.id] = p;
    nodes.push({ id: c.id, label: c.label, type: "hub", cat: c.id, p });
    edges.push({ a: "center", b: c.id, t: "core" });
  });

  const byCat = {};
  SKILLS.forEach((s) => (byCat[s[2]] = byCat[s[2]] || []).push(s));
  Object.keys(byCat).forEach((cid) => {
    const arr = byCat[cid];
    const h = hub[cid];
    arr.forEach((s, j) => {
      const phi = h.th + (j - (arr.length - 1) / 2) * 0.31;
      const rr = 45 + seeded(j * 13 + cid.length) * 5;
      const y = h.p[1] * 1.35 + seeded(j * 7 + cid.length * 3) * 7;
      const p = [rr * Math.cos(phi), y, rr * Math.sin(phi)];
      posMap[s[0]] = p;
      nodes.push({ id: s[0], label: s[1], type: "skill", cat: cid, p });
      edges.push({ a: cid, b: s[0], t: "skill" });
    });
  });

  PROJECTS.forEach((pr, i) => {
    let cx = 0, cy = 0, cz = 0, n = 0;
    pr.deps.forEach((d) => {
      const p = posMap[d];
      if (p) { cx += p[0]; cy += p[1]; cz += p[2]; n++; }
    });
    n = n || 1;
    const th = Math.atan2(cz / n, cx / n) + seeded(i * 31) * 0.52;
    const r = 61;
    const p = [r * Math.cos(th), (cy / n) * 1.1 + (i % 2 ? 8 : -8), r * Math.sin(th)];
    posMap[pr.id] = p;
    nodes.push({ id: pr.id, label: pr.name, type: "project", p });
    pr.deps.forEach((d) => edges.push({ a: pr.id, b: d, t: "dep" }));
  });

  const adj = {};
  const link = (a, b) => {
    (adj[a] = adj[a] || new Set()).add(b);
    (adj[b] = adj[b] || new Set()).add(a);
  };
  edges.forEach((e) => link(e.a, e.b));

  const catMembers = {};
  CATS.forEach((c) => {
    const set = new Set([c.id]);
    SKILLS.filter((s) => s[2] === c.id).forEach((s) => set.add(s[0]));
    PROJECTS.forEach((pr) => { if (pr.deps.some((d) => set.has(d))) set.add(pr.id); });
    catMembers[c.id] = set;
  });

  const usage = {};
  PROJECTS.forEach((pr) => pr.deps.forEach((d) => (usage[d] = (usage[d] || 0) + 1)));

  const color = {};
  CATS.forEach((c) => (color[c.id] = c.color));

  return { nodes, edges, posMap, adj, catMembers, usage, color };
}

export const GRAPH = buildGraph();
