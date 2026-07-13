/* ============================================================
   The Dependency Graph — data layer
   Generated 1:1 from the CV. Do NOT invent relations here:
   every project→skill edge mirrors the real stack used.
   ============================================================ */
window.GRAPH_DATA = (function () {
  "use strict";

  // deterministic jitter (no Math.random — layout must be stable)
  var seeded = function (n) {
    var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x) - 0.5;
  };

  var CATS = [
    { id: "cat-lang", label: "Languages" },
    { id: "cat-web",  label: "Web & Frameworks" },
    { id: "cat-db",   label: "Databases" },
    { id: "cat-net",  label: "Networking" },
    { id: "cat-sys",  label: "Systems & Tools" },
    { id: "cat-prac", label: "Practices" }
  ];

  // [id, label, category]
  var SKILLS = [
    ["php", "PHP", "cat-lang"],
    ["jsts", "JavaScript / TypeScript", "cat-lang"],
    ["python", "Python", "cat-lang"],
    ["java", "Java", "cat-lang"],
    ["dart", "Dart", "cat-lang"],
    ["sql", "SQL", "cat-lang"],
    ["htmlcss", "HTML / CSS", "cat-lang"],
    ["laravel", "Laravel", "cat-web"],
    ["nextjs", "Next.js (App Router)", "cat-web"],
    ["vue", "Vue.js", "cat-web"],
    ["alpine", "Alpine.js", "cat-web"],
    ["flutter", "Flutter", "cat-web"],
    ["tailwind", "Tailwind CSS", "cat-web"],
    ["django", "Django (learning)", "cat-web"],
    ["mysql", "MySQL / MariaDB", "cat-db"],
    ["postgres", "PostgreSQL", "cat-db"],
    ["supabase", "Supabase", "cat-db"],
    ["sqlite", "SQLite", "cat-db"],
    ["erd", "ERD / LRS design", "cat-db"],
    ["prisma", "Prisma ORM", "cat-db"],
    ["mikrotik", "MikroTik (MTCNA)", "cat-net"],
    ["cisco", "Cisco", "cat-net"],
    ["lanwlan", "LAN / WLAN configuration", "cat-net"],
    ["qos", "QoS", "cat-net"],
    ["cabling", "Cabling & troubleshooting", "cat-net"],
    ["windows", "Windows (advanced)", "cat-sys"],
    ["linux", "Linux (Arch, Ubuntu)", "cat-sys"],
    ["git", "Git / GitHub", "cat-sys"],
    ["pm2", "PM2", "cat-sys"],
    ["nginx", "Nginx", "cat-sys"],
    ["tasksched", "Task Scheduler", "cat-sys"],
    ["systemd", "systemd", "cat-sys"],
    ["fullstack", "Full-stack development", "cat-prac"],
    ["rest", "REST APIs", "cat-prac"],
    ["scrum", "Scrum", "cat-prac"],
    ["rad", "RAD", "cat-prac"],
    ["codereview", "Code review & auditing", "cat-prac"],
    ["blackbox", "Black-box testing", "cat-prac"]
  ];

  var PROJECTS = [
    {
      id: "p-spin",
      label: "Spin Wheel Probability Lab",
      type: "Personal",
      tagline: "Python desktop app — ~13,500 lines across 75 modules — for probabilistic prediction and statistical analysis.",
      bullets: [
        "Ensemble prediction engine: Bayesian inference, higher-order Markov models, physics-based simulation, TensorFlow LSTM, fractional-Kelly allocation, bootstrap confidence intervals.",
        "Statistical validation: chi-square, walk-forward z-tests, KS drift detection, per-engine isotonic calibration.",
        "Framework-agnostic REST API (FastAPI) with SQLite persistence.",
        "29/29 automated test suite passing with clean compilation across the codebase."
      ],
      deps: ["python", "sql", "rest", "codereview"]
    },
    {
      id: "p-rumah",
      label: "Rumah Pemuridan",
      type: "Web Project",
      tagline: "Content management website built on Next.js (App Router) + Supabase with Server Components & Server Actions.",
      bullets: [
        "Authentication with row-level security (RLS) and middleware-protected admin routes.",
        "Defense-in-depth security checks throughout the stack.",
        "News / content management module for day-to-day publishing."
      ],
      deps: ["jsts", "nextjs", "supabase", "postgres"]
    },
    {
      id: "p-restoran",
      label: "Restoran Nusantara",
      type: "Web Project",
      tagline: "Restaurant & reservation website on Laravel 10, Blade, Alpine.js, and Tailwind CSS.",
      bullets: [
        "ERD-driven data model design.",
        "Reservation flow with server-side price snapshotting to keep bookings consistent.",
        "Admin dashboard with role-based permissions, full CRUD, activity logging, and sales/reservation reporting."
      ],
      deps: ["php", "laravel", "alpine", "tailwind", "mysql", "erd"]
    },
    {
      id: "p-price",
      label: "Price & Stock Monitoring Service",
      type: "Freelance",
      tagline: "Python automation (Requests, BeautifulSoup, Playwright) monitoring competitor prices & stock with real-time Telegram alerts.",
      bullets: [
        "Runs 24/7 on RDP/VPS via Task Scheduler and systemd.",
        "Persistent price history and configurable price targets."
      ],
      deps: ["python", "tasksched", "systemd"]
    },
    {
      id: "p-sonic",
      label: "SonicCipher",
      type: "Personal",
      tagline: "Python app converting text into encrypted audio with a custom Frequency-Shift Audio Encryption (FSAE) approach.",
      bullets: [
        "Combines cryptography and audio steganography concepts.",
        "Threaded PyQt GUI with audio visualization: waveform, spectrogram, FFT."
      ],
      deps: ["python", "cat-sys"]
    },
    {
      id: "p-sonorus",
      label: "Sonorus",
      type: "Academic",
      tagline: "Classical music streaming website built in Laravel.",
      bullets: [
        "User authentication, music streaming, and database management.",
        "Responsive, smooth end-to-end user experience."
      ],
      deps: ["php", "laravel", "mysql"]
    },
    {
      id: "p-coop",
      label: "Cooperative Management System",
      type: "Freelance",
      tagline: "Web-based cooperative management system delivered with Scrum.",
      bullets: [
        "Member management, transaction tracking, and reporting.",
        "Met all client requirements."
      ],
      deps: ["scrum", "fullstack"]
    },
    {
      id: "p-auto",
      label: "Automotive Production Scheduling Application",
      type: "Freelance",
      tagline: "Automated scheduling system with optimization algorithms for an automotive production workflow.",
      bullets: [
        "Streamlined the client's production workflow end-to-end."
      ],
      deps: ["rad", "fullstack"]
    }
  ];

  /* ---------- 3D layout ---------- */
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
  SKILLS.forEach(function (s) {
    (byCat[s[2]] = byCat[s[2]] || []).push(s);
  });

  var skillPos = {};
  Object.keys(byCat).forEach(function (cid) {
    var arr = byCat[cid];
    var hub = hubInfo[cid];
    arr.forEach(function (s, j) {
      var phi = hub.th + (j - (arr.length - 1) / 2) * 0.34;
      var rr = 44 + seeded(j * 13 + cid.length) * 5;
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
    var th = Math.atan2(cz / n, cx / n) + seeded(i * 31) * 0.55;
    var r = 60;
    var pos = [r * Math.cos(th), (cy / n) * 1.1 + (i % 2 ? 8 : -8), r * Math.sin(th)];
    nodes.push({ id: pr.id, label: pr.label, type: "project", p: pos });
    pr.deps.forEach(function (d) {
      edges.push({ a: pr.id, b: d, t: "dep" });
    });
  });

  return { CATS: CATS, SKILLS: SKILLS, PROJECTS: PROJECTS, nodes: nodes, edges: edges };
})();
