/* ============================================================
   The Dependency Graph — portfolio data
   Each project → skill edge reflects the technology actually used.
   ============================================================ */
window.GRAPH_DATA = (function () {
  "use strict";

  var seeded = function (n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x) - 0.5;
  };

  var CATS = [
    { id: "cat-lang", label: "Languages" },
    { id: "cat-web", label: "Web & Product" },
    { id: "cat-ai", label: "Data & AI" },
    { id: "cat-auto", label: "Automation" },
    { id: "cat-sys", label: "Systems & Network" },
    { id: "cat-prac", label: "Engineering" }
  ];

  var SKILLS = [
    ["python", "Python", "cat-lang"],
    ["jsts", "TypeScript / JavaScript", "cat-lang"],
    ["php", "PHP", "cat-lang"],
    ["sql", "SQL / PLpgSQL", "cat-lang"],
    ["htmlcss", "HTML / CSS", "cat-lang"],
    ["shell", "Shell / Batch", "cat-lang"],
    ["json", "JSON / Config Schema", "cat-lang"],

    ["nextjs", "Next.js App Router", "cat-web"],
    ["react", "React", "cat-web"],
    ["laravel", "Laravel", "cat-web"],
    ["tailwind", "Tailwind CSS", "cat-web"],
    ["supabase", "Supabase", "cat-web"],
    ["rest", "REST APIs", "cat-web"],
    ["a11y", "Accessibility & SEO", "cat-web"],

    ["pytorch", "PyTorch", "cat-ai"],
    ["opencv", "OpenCV & OCR", "cat-ai"],
    ["lstm", "LSTM / Sequence Models", "cat-ai"],
    ["bayes", "Bayesian Inference", "cat-ai"],
    ["stats", "Statistical Validation", "cat-ai"],
    ["numpy", "NumPy / Scientific Python", "cat-ai"],
    ["signal", "Audio & Signal Processing", "cat-ai"],

    ["selenium", "Selenium", "cat-auto"],
    ["playwright", "Playwright", "cat-auto"],
    ["scraping", "Web Scraping", "cat-auto"],
    ["concurrency", "Async & Concurrency", "cat-auto"],
    ["scheduler", "Schedulers & Background Jobs", "cat-auto"],
    ["notify", "Webhooks & Notifications", "cat-auto"],
    ["config", "Config-driven Engines", "cat-auto"],

    ["linux", "Linux", "cat-sys"],
    ["windows", "Windows", "cat-sys"],
    ["git", "Git / GitHub", "cat-sys"],
    ["mikrotik", "MikroTik / MTCNA", "cat-sys"],
    ["cisco", "Cisco Networking", "cat-sys"],
    ["lanwlan", "LAN / WLAN", "cat-sys"],
    ["http", "HTTP / Proxy Networking", "cat-sys"],

    ["architecture", "Modular Architecture", "cat-prac"],
    ["testing", "Automated Testing", "cat-prac"],
    ["database", "MySQL / PostgreSQL / SQLite", "cat-prac"],
    ["security", "Auth, RLS & Secure Config", "cat-prac"],
    ["prompt", "Prompt Engineering", "cat-prac"],
    ["aiworkflow", "AI-assisted Development", "cat-prac"],
    ["docs", "Technical Documentation", "cat-prac"]
  ];

  var PROJECTS = [
    {
      id: "p-nestfetch",
      label: "NESTfetch",
      type: "Featured · Python Platform",
      tagline: "A modular, multi-site metadata scraper built as an extensible platform — not a one-off script.",
      bullets: [
        "Config-driven adapters onboard new sites through JSON without changing the core engine.",
        "Async fetching, retries, rate limiting, caching, link-health history, SQLite and CSV/JSON exports.",
        "CLI, zero-dependency web dashboard, schedulers, notifications and offline regression tests."
      ],
      deps: ["python", "scraping", "playwright", "concurrency", "config", "database", "testing", "architecture"],
      url: "https://github.com/SirHosen/gaming-scrap"
    },
    {
      id: "p-gamenest",
      label: "GameNest",
      type: "Featured · Full-stack",
      tagline: "Production-deployed game catalog with a protected CMS, accessible UI and search-first experience.",
      bullets: [
        "Next.js App Router + TypeScript + Supabase/PostgreSQL with authenticated admin routes.",
        "CRUD, image storage, markdown content, advanced filtering and publish/draft workflows.",
        "WCAG-aware interaction, structured SEO, optimized images and Vercel deployment."
      ],
      deps: ["jsts", "nextjs", "react", "tailwind", "supabase", "database", "security", "a11y"],
      url: "https://github.com/SirHosen/gamenest",
      live: "https://gamenest-chi.vercel.app"
    },
    {
      id: "p-spin",
      label: "Spinwheel AI Lab",
      type: "Featured · Applied ML",
      tagline: "An honest ML and computer-vision laboratory for measuring wheel bias — not pretending randomness is predictable.",
      bullets: [
        "Screen capture, automatic calibration and optional OCR create a clean observation pipeline.",
        "Bayesian posteriors, Monte Carlo EV, power analysis and multiple-testing correction quantify real evidence.",
        "PyTorch LSTM uses walk-forward backtesting, multiple baselines, log-loss and Brier scoring."
      ],
      deps: ["python", "pytorch", "opencv", "lstm", "bayes", "stats", "numpy", "testing"],
      url: "https://github.com/SirHosen/Project-Wheel"
    },
    {
      id: "p-sonorus",
      label: "Sonorus",
      type: "Full-stack · Laravel",
      tagline: "A classical-music streaming product with role-based administration and a complete listening workflow.",
      bullets: [
        "Laravel MVC, MySQL, migrations, seeders and permission-controlled admin operations.",
        "Composer catalog, playlists, favorites, history, search and HTML5 audio controls.",
        "Responsive Blade/Bootstrap interface with drag-and-drop playlist management."
      ],
      deps: ["php", "laravel", "jsts", "htmlcss", "database", "security", "architecture"],
      url: "https://github.com/SirHosen/Sonorus"
    },
    {
      id: "p-sonic",
      label: "SonicCipher",
      type: "Desktop · Audio",
      tagline: "A modular Python desktop experiment that encodes text into sound and visualizes the resulting signal.",
      bullets: [
        "PyQt interface separated from audio-processing and file/metadata layers.",
        "Frequency synthesis, waveform, spectrogram and FFT visualization with NumPy/SciPy.",
        "Round-trip validation and executable packaging with PyInstaller."
      ],
      deps: ["python", "numpy", "signal", "architecture", "testing"],
      url: "https://github.com/SirHosen/SonicChipper"
    },
    {
      id: "p-formqa",
      label: "Adaptive Form QA Harness",
      type: "Automation · QA",
      tagline: "A configurable Selenium harness for authorized testing of dynamic, multi-page Google Forms.",
      bullets: [
        "Detects text, paragraph, radio, checkbox, dropdown, grid, date and time fields.",
        "Supports JSON answer profiles, validation detection, screenshots, retries and concurrent runs.",
        "Designed for owned forms, regression checks and clearly marked synthetic test data."
      ],
      deps: ["python", "selenium", "json", "concurrency", "testing", "config"],
      url: "https://github.com/SirHosen/gform_bot"
    },
    {
      id: "p-sessionlab",
      label: "Browser Session Reliability Lab",
      type: "Automation · Systems",
      tagline: "A controlled browser-lifecycle experiment for authorized multi-session UI and proxy reliability testing.",
      bullets: [
        "Threaded task queues coordinate isolated Selenium sessions and structured runtime status.",
        "HTTP/SOCKS proxy health checks, retry logic, timeout handling and failure logging.",
        "Cookie persistence and browser cleanup explore resilient long-running automation."
      ],
      deps: ["python", "selenium", "concurrency", "http", "windows", "testing"]
    },
    {
      id: "p-portfolio",
      label: "The Dependency Graph",
      type: "Creative Engineering",
      tagline: "This portfolio: a cinematic, accessible system map where projects are wired to the skills they actually use.",
      bullets: [
        "Next.js + React presentation with GSAP hero choreography and an offline canvas graph engine.",
        "Scroll-driven camera, reduced-motion support, keyboard-safe interactions and responsive layouts.",
        "Content architecture doubles as an inspectable dependency model instead of a generic skill list."
      ],
      deps: ["jsts", "nextjs", "react", "htmlcss", "architecture", "a11y", "docs", "aiworkflow"]
    }
  ];

  var nodes = [];
  var edges = [];
  nodes.push({ id: "center", label: "HOSEA", type: "center", p: [0, 0, 0] });

  var hubInfo = {};
  CATS.forEach(function (c, i) {
    var th = (i / CATS.length) * Math.PI * 2 - Math.PI / 7;
    var r = 30;
    var pos = [r * Math.cos(th), (i % 2 ? 9 : -9) + seeded(i) * 4, r * Math.sin(th)];
    hubInfo[c.id] = { th: th, pos: pos };
    nodes.push({ id: c.id, label: c.label, type: "hub", p: pos });
    edges.push({ a: "center", b: c.id, t: "core" });
  });

  var byCat = {};
  SKILLS.forEach(function (s) { (byCat[s[2]] = byCat[s[2]] || []).push(s); });
  var skillPos = {};
  Object.keys(byCat).forEach(function (cid) {
    var arr = byCat[cid], hub = hubInfo[cid];
    arr.forEach(function (s, j) {
      var phi = hub.th + (j - (arr.length - 1) / 2) * 0.31;
      var rr = 45 + seeded(j * 13 + cid.length) * 5;
      var y = hub.pos[1] * 1.35 + seeded(j * 7 + cid.length * 3) * 7;
      var pos = [rr * Math.cos(phi), y, rr * Math.sin(phi)];
      skillPos[s[0]] = pos;
      nodes.push({ id: s[0], label: s[1], type: "skill", cat: cid, p: pos });
      edges.push({ a: cid, b: s[0], t: "skill" });
    });
  });

  PROJECTS.forEach(function (pr, i) {
    var cx = 0, cy = 0, cz = 0, n = 0;
    pr.deps.forEach(function (d) {
      var p = skillPos[d] || (hubInfo[d] && hubInfo[d].pos);
      if (p) { cx += p[0]; cy += p[1]; cz += p[2]; n++; }
    });
    n = n || 1;
    var th = Math.atan2(cz / n, cx / n) + seeded(i * 31) * 0.52;
    var r = 61;
    var pos = [r * Math.cos(th), (cy / n) * 1.1 + (i % 2 ? 8 : -8), r * Math.sin(th)];
    nodes.push({ id: pr.id, label: pr.label, type: "project", p: pos });
    pr.deps.forEach(function (d) { edges.push({ a: pr.id, b: d, t: "dep" }); });
  });

  return { CATS: CATS, SKILLS: SKILLS, PROJECTS: PROJECTS, nodes: nodes, edges: edges };
})();
