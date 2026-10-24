// ============================================================
// SINGLE SOURCE OF TRUTH - edit copy, skills, and projects here.
// No framework, no build step. Plain ES module.
// ============================================================

export const PROFILE = {
  handle: "hosea.dev",
  name: "HOSEA",
  roles: ["PYTHON ENGINEER", "FULL-STACK DEV", "AUTOMATION & APPLIED AI"],
  pitch:
    "I engineer useful digital systems at the intersection of software, automation, and applied intelligence.",
  location: "ID \u00b7 UTC+7",
  github: "https://github.com/SirHosen",
};

export const CAPABILITIES = [
  "Python", "TypeScript", "Next.js", "React", "Laravel", "PyTorch",
  "Automation", "Web Scraping", "Prompt Engineering", "Systems / Networking",
];

export const STATS = [
  { value: "9", label: "Projects & Experiments" },
  { value: "6", label: "Skill Domains" },
  { value: "MTCNA", label: "Network Certified" },
  { value: "Linux", label: "Native Workflow" },
];

// Categories (graph hubs) + palette
export const CATS = [
  { id: "cat-lang", label: "Languages", code: "LANG", color: "#f24b3e" },
  { id: "cat-web", label: "Web & Mobile", code: "WEB", color: "#d2ba85" },
  { id: "cat-ai", label: "Data & Applied AI", code: "AI", color: "#b79ac7" },
  { id: "cat-auto", label: "Automation", code: "AUTO", color: "#b8cf8c" },
  { id: "cat-sys", label: "Systems & Network", code: "SYS", color: "#83b9b4" },
  { id: "cat-prac", label: "Engineering Practice", code: "ENG", color: "#e2b2a2" },
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
  ["dart", "Dart", "cat-lang"],

  ["nextjs", "Next.js", "cat-web"],
  ["react", "React", "cat-web"],
  ["laravel", "Laravel", "cat-web"],
  ["tailwind", "Tailwind", "cat-web"],
  ["supabase", "Supabase", "cat-web"],
  ["rest", "REST APIs", "cat-web"],
  ["a11y", "A11y / SEO", "cat-web"],
  ["flutter", "Flutter", "cat-web"],
  ["riverpod", "Riverpod", "cat-web"],

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
    status: "Archived", category: "lab", featured: "nest",
    deps: ["python", "scraping", "playwright", "concurrency", "config", "database", "testing", "architecture"],
  },
  {
    id: "p-gamenest", index: "02", name: "GameNest", kind: "Full-stack product",
    tagline: "A game catalog with a protected CMS, authentication, image storage, advanced search, and SEO.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    status: "Archived", category: "product", featured: "game",
    deps: ["jsts", "nextjs", "react", "tailwind", "supabase", "database", "security", "a11y"],
  },
  {
    id: "p-spin", index: "03", name: "Spinwheel AI Lab", kind: "Applied ML",
    tagline: "CV + Bayesian + PyTorch LSTM lab with walk-forward backtesting, log-loss and Brier scoring \u2014 honest evidence, no hype.",
    stack: ["Python", "PyTorch", "OpenCV", "Bayesian", "NumPy"],
    status: "Private archive", category: "lab",
    deps: ["python", "pytorch", "opencv", "lstm", "bayes", "stats", "numpy", "testing"],
  },
  {
    id: "p-sonorus", index: "04", name: "Sonorus", kind: "Full-stack \u00b7 Laravel",
    tagline: "Classical-music streaming product with role-based admin, playlists, favorites, history and search.",
    stack: ["PHP", "Laravel", "MySQL", "Blade", "Auth"],
    repo: "https://github.com/SirHosen/Sonorus",
    status: "Public source", category: "product",
    deps: ["php", "laravel", "jsts", "htmlcss", "database", "security", "architecture"],
  },
  {
    id: "p-sonic", index: "05", name: "SonicCipher", kind: "Desktop \u00b7 Audio DSP",
    tagline: "Modular PyQt desktop app encoding text into sound with waveform, spectrogram and FFT visualization.",
    stack: ["Python", "PyQt", "NumPy", "DSP", "PyInstaller"],
    repo: "https://github.com/SirHosen/SonicChipper",
    status: "Public source", category: "product",
    deps: ["python", "numpy", "signal", "architecture", "testing"],
  },
  {
    id: "p-formqa", index: "06", name: "Adaptive Form QA", kind: "Automation \u00b7 QA",
    tagline: "Configurable Selenium harness for authorized testing of dynamic multi-page forms with JSON answer profiles.",
    stack: ["Python", "Selenium", "JSON", "Concurrency", "Testing"],
    repo: "https://github.com/SirHosen/gform_bot",
    status: "Public source", category: "lab",
    deps: ["python", "selenium", "json", "concurrency", "testing", "config"],
  },
  {
    id: "p-sessionlab", index: "07", name: "Browser Session Reliability Lab", kind: "Automation \u00b7 Systems",
    tagline: "Controlled browser-lifecycle experiment for authorized multi-session UI and proxy reliability testing.",
    stack: ["Python", "Selenium", "Concurrency", "HTTP / Proxy", "Logging"],
    status: "Private archive", category: "lab",
    deps: ["python", "selenium", "concurrency", "http", "windows", "testing"],
  },
  {
    id: "p-portfolio", index: "08", name: "This System / Midnight Panel", kind: "Creative Engineering",
    tagline: "This portfolio, reimagined as a cinematic manga-inspired world: interactive 3D, custom artwork, and a connected skill explorer.",
    stack: ["WebGL / GLSL", "Canvas 2D", "Web Audio", "Vanilla JS"],
    repo: "https://github.com/SirHosen/porto", status: "You're here", category: "product",
    deps: ["jsts", "htmlcss", "architecture", "a11y", "docs", "aiworkflow"],
  },
  {
    id: "p-aqila", index: "09", name: "Aqila Atelier", kind: "Flutter · Retail operations",
    tagline: "A boutique workspace connecting inventory, point of sale, EOQ restock planning, and sales reporting.",
    stack: ["Flutter", "Dart", "Riverpod", "Supabase", "PostgreSQL"],
    repo: "https://github.com/SirHosen/butik_aqila", status: "In development", category: "product", featured: "aqila",
    deps: ["dart", "flutter", "riverpod", "supabase", "database", "security", "testing", "architecture", "docs"],
  },
];

export const DOMAIN_COPY = {
  "cat-lang": "Python is my home base. TypeScript, PHP, Dart, SQL, and shell scripting let me follow a problem across the stack.",
  "cat-web": "Interfaces backed by real systems: web products with React and Laravel, and Flutter applications connected to Supabase.",
  "cat-ai": "Computer vision, sequence models, signal processing, and statistical evaluation. Experiments are only as useful as the evidence behind them.",
  "cat-auto": "Browser workflows, scraping, asynchronous pipelines, retries, and schedulers. Turning repeatable tasks into configurable software.",
  "cat-sys": "Linux is my daily environment. Git, shell workflows, networking, and MikroTik knowledge connect the application to the machine it runs on.",
  "cat-prac": "Clear boundaries, secure configuration, tests, and useful documentation. AI-assisted development supports the workflow; verification stays part of it.",
};

export const PROJECT_DETAILS = {
  "p-aqila": {
    highlights: ["Role-based admin and cashier workflows, product photos, suppliers, and stock movements.", "EOQ restock planning, atomic point-of-sale checkout, PDF receipts, and PDF/XLSX reporting.", "Widget and local PostgreSQL tests cover permissions, stock consistency, and transaction behavior."],
    note: "In development. The public README records remaining emulator, device, and full cloud transaction checks; this is not presented as a completed production deployment.",
    source: "Public repository README, reviewed 14 September 2026.",
  },
  "p-nestfetch": { highlights: ["Configuration-driven scraping across multiple sites.", "Async fetches with retries and caching, plus SQLite and CSV export.", "CLI and dashboard entry points with a modular, testable structure."], note: "The source repository is no longer public. This project is retained from the original portfolio.", source: "Original portfolio project record." },
  "p-gamenest": { highlights: ["Game discovery with advanced search and SEO.", "Protected content management, authentication, and image storage.", "Next.js and TypeScript connected to Supabase and PostgreSQL."], note: "Archived showcase. The previous Vercel URL returned 404 when checked on 14 September 2026, and the repository is no longer public.", source: "Original portfolio project record; previous deployment checked separately." },
  "p-spin": { highlights: ["Computer vision and OCR for observation, with Bayesian and LSTM experiments.", "Walk-forward backtesting, log-loss, and Brier scoring for statistical evaluation.", "An exploratory lab, with no claim of reliable gambling prediction or financial returns."], note: "Private archive. Only the high-level technical summary is shown; source code and sensitive implementation details are not published.", source: "Original portfolio project record." },
  "p-sonorus": { highlights: ["A classical-music streaming interface built with Laravel and Blade.", "Role-based administration, playlists, and favorites.", "Listening history and search, backed by MySQL."], note: "Public source available. Project capabilities are summarized from the original portfolio.", source: "Original portfolio; public repository availability verified." },
  "p-sonic": { highlights: ["A PyQt desktop interface for encoding text into audio.", "Waveform, spectrogram, and FFT visualization with NumPy.", "A modular audio-processing workflow packaged with PyInstaller."], note: "Public source available under the repository name SonicChipper; the original portfolio display name SonicCipher is preserved.", source: "Original portfolio; public repository availability verified." },
  "p-formqa": { highlights: ["Configurable browser automation with Selenium.", "JSON answer profiles for dynamic, multi-page form workflows.", "Concurrent execution and a testing-oriented configuration structure."], note: "Public source available under gform_bot. Use automation only on forms and systems you have permission to test.", source: "Original portfolio; public repository availability verified." },
  "p-sessionlab": { highlights: ["Exploration of browser process and session lifecycles.", "Concurrent browser sessions, proxy behavior, and logging.", "Python and Selenium workflows, retained as a high-level technical archive."], note: "Private archive. No source code, operational instructions, or sensitive service details are published.", source: "Original portfolio project record." },
  "p-portfolio": { highlights: ["An original anime cityscape, manga-inspired editorial panels, and responsive project browsing.", "A real WebGL crystal with orbiting geometry, pointer interaction, and domain-driven color changes.", "Local fonts, opt-in ambient audio, motion controls, keyboard navigation, and a static fallback when WebGL is unavailable."], note: "The original graph-based portfolio evolved into Midnight Panel. Built with browser-native APIs and no runtime library dependencies.", source: "Current portfolio implementation." },
};

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
