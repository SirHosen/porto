/* ============================================================
   icons.js — offline inline-SVG icon system.
   Hand-drawn minimal glyphs (24x24, currentColor) — zero CDN,
   shared by DOM chips and the canvas graph (via Path2D).
   Strings = stroke paths, [d,"f"] = fill paths, t = text glyph.
   ============================================================ */
(function () {
  "use strict";

  var CYL = [
    "M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6",
    "M5 6c0 1.66 3.13 3 7 3s7-1.34 7-3-3.13-3-7-3-7 1.34-7 3z",
    "M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3"
  ];

  var ICONS = {
    "cat-lang": { p: ["M8 5L3 12l5 7", "M16 5l5 7-5 7"] },
    "cat-web": { p: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M3 12h18", "M12 3c3 2.4 4.5 5.4 4.5 9s-1.5 6.6-4.5 9c-3-2.4-4.5-5.4-4.5-9s1.5-6.6 4.5-9z"] },
    "cat-db": { p: CYL },
    "cat-net": { p: ["M12 7.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M5 21.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M19 21.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M10.9 6.9L6 17.1M13.1 6.9L18 17.1M7.2 19h9.6"] },
    "cat-sys": { p: ["M3 5.5h18v13H3z", "M6.5 9.5l3 2.5-3 2.5", "M12 15h5"] },
    "cat-prac": { p: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M8 12.4l2.7 2.7 5.3-5.6"] },

    php: { t: "php" },
    jsts: { t: "TS" },
    python: { p: [
      "M8.5 8.8V5.6C8.5 4.2 9.7 3 11.1 3h1.8c1.4 0 2.6 1.2 2.6 2.6v3.6c0 1.4-1.2 2.6-2.6 2.6h-2.8c-2.3 0-4.1 1.8-4.1 4.1v.9",
      "M15.5 15.2v3.2c0 1.4-1.2 2.6-2.6 2.6h-1.8c-1.4 0-2.6-1.2-2.6-2.6v-3.6c0-1.4 1.2-2.6 2.6-2.6h2.8c2.3 0 4.1-1.8 4.1-4.1v-.9",
      ["M10.4 5.9a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9z", "f"],
      ["M13.6 20a.95.95 0 1 0 0-1.9.95.95 0 0 0 0 1.9z", "f"]
    ] },
    java: { p: ["M6 9.5h9V15a4 4 0 0 1-4 4h-1a4 4 0 0 1-4-4V9.5z", "M15 10.5h2.2a2 2 0 0 1 0 4H15", "M9 6.8C9 5.6 10.4 5.4 10.4 4.2", "M12.2 6.8c0-1.2 1.4-1.4 1.4-2.6"] },
    dart: { p: ["M4 4l9 1.6L20.2 20 6 13 4 4z", "M4 4l16 16"] },
    sql: { p: CYL },
    htmlcss: { p: ["M4 3h16l-1.4 14.5L12 21l-6.6-3.5L4 3z", "M8.6 8h6.8l-.4 5-3 1.3-3-1.3"] },
    laravel: { p: ["M3 6l5-3 5 3-5 3-5-3z", "M13 12.5l5-3 3.5 2v5.5L16 20", "M3 6v9.5L13 21l8.5-5", "M8 9v5"] },
    nextjs: { p: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M9.3 8.3V16", "M9.3 8.3l6.3 8.2V13"] },
    vue: { p: [["M2 4h4.4L12 13.6 17.6 4H22L12 21 2 4z", "f"]] },
    alpine: { p: [["M8 7.2l5.8 9.8H2.2L8 7.2z", "f"], ["M16 7.2l5.8 9.8h-6.9l-2.5-4.2L16 7.2z", "f"]] },
    flutter: { p: [["M14 2L5 11l2.8 2.8L21.5 2H14z", "f"], ["M14.2 12.4l-4.4 4.4 4.4 4.4h7.3l-4.4-4.4 4.4-4.4h-7.3z", "f"]] },
    tailwind: { p: [
      ["M12 5.6c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.23 1.6.9 2.3 1.65 1.15 1.2 2.5 2.55 5.5 2.55 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.23-1.6-.9-2.3-1.65C16.35 6.95 15 5.6 12 5.6z", "f"],
      ["M6 12.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.23 1.6.9 2.3 1.65 1.15 1.2 2.5 2.55 5.5 2.55 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.23-1.6-.9-2.3-1.65-1.15-1.2-2.5-2.55-5.5-2.55z", "f"]
    ] },
    django: { t: "dj" },
    mysql: { p: [CYL[0], [CYL[1], "f"], CYL[2]] },
    postgres: { p: [CYL[0], CYL[1], "M12 9v12"] },
    supabase: { p: [["M13 2L4 13.5h6.5L11 22l9-11.5h-6.5L13 2z", "f"]] },
    sqlite: { p: ["M5 7v10c0 1.66 3.13 3 7 3s7-1.34 7-3V7", "M5 7c0 1.66 3.13 3 7 3s7-1.34 7-3-3.13-3-7-3-7 1.34-7 3z", "M16.5 21.5l4-11"] },
    erd: { p: ["M3 4h7v5H3zM14 4h7v5h-7zM8.5 15h7v5h-7z", "M6.5 9v2.5h11V9M12 11.5V15"] },
    prisma: { p: ["M12 2.5L4 18.5l8 3 8-3L12 2.5z", "M12 2.5l2.4 19"] },
    mikrotik: { p: ["M3.5 13.5h17v6h-17z", "M7 13.5V6.5M17 13.5V6.5", "M6.5 16.5H9M11 16.5h1.5"] },
    cisco: { p: ["M3 16v-3.5M7.5 16V9.5M12 16V5.5M16.5 16V9.5M21 16v-3.5"] },
    lanwlan: { p: ["M4 10.5c4.5-4 11.5-4 16 0", "M7 13.7c3-2.7 7-2.7 10 0", "M9.9 16.7c1.3-1.1 3-1.1 4.3 0", ["M12 20.4a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z", "f"]] },
    qos: { p: ["M4 17a8 8 0 0 1 16 0", "M12 17l4.4-5.4", ["M12 18.4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z", "f"]] },
    cabling: { p: ["M6.5 10V4h11v6", "M4 10h16v8H4z", "M8.5 10V7M12 10V6.5M15.5 10V7", "M9.5 18v2h5v-2"] },
    windows: { p: [["M3 5.4l7.5-1v6.8H3V5.4z", "f"], ["M11.8 4.2L21 3v8.2h-9.2V4.2z", "f"], ["M3 12.8h7.5v6.8L3 18.6v-5.8z", "f"], ["M11.8 12.8H21V21l-9.2-1.2v-7z", "f"]] },
    linux: { p: ["M12 3.5L21 20H3L12 3.5z", "M8.5 20c1.1.8 2.3 1.2 3.5 1.2s2.4-.4 3.5-1.2"] },
    git: { p: ["M6 8.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M6 20.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M18 11.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z", "M6 8.2v7.6", "M6 13.5c6 0 7.8-1.4 9.8-3.1"] },
    pm2: { p: ["M4 5.5h16M4 12h6.5M4 18.5h7.5", ["M13.5 9.5l6.5 4-6.5 4v-8z", "f"]] },
    nginx: { p: ["M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5L12 2.5z", "M9 15.5V8.6l6 6.9V8.5"] },
    tasksched: { p: ["M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z", "M12 7v5.3l3.7 2.2"] },
    systemd: { p: ["M6.5 6H4v12h2.5M17.5 6H20v12h-2.5", ["M9.5 8.5l7 3.5-7 3.5v-7z", "f"]] },
    fullstack: { p: ["M12 3l9 5-9 5-9-5 9-5z", "M3.6 13.2L12 17.8l8.4-4.6", "M3.6 17L12 21.6 20.4 17"] },
    rest: { p: ["M9 3v4.5M15 3v4.5", "M6 7.5h12V12a6 6 0 0 1-12 0V7.5z", "M12 18v3"] },
    scrum: { p: ["M19.2 12a7.2 7.2 0 1 1-2.1-5.1", ["M16.2 2.8l4.6 4.4-6.3 1.1 1.7-5.5z", "f"]] },
    rad: { p: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", ["M13.2 6.2L8.6 13h3.2l-1 4.8 4.6-6.8h-3.2l1-4.8z", "f"]] },
    codereview: { p: ["M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z", "M15.2 15.2L21 21", "M7.8 10.6l1.9 1.9 3.4-3.6"] },
    blackbox: { p: ["M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5z", "M12 12L3.8 7.4M12 12l8.2-4.6M12 12v9"] }
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function svg(id, cls) {
    var ic = ICONS[id];
    if (!ic) return "";
    var body = "";
    if (ic.t) {
      body += '<text x="12" y="12.8" text-anchor="middle" dominant-baseline="middle" font-family="JetBrains Mono, Menlo, monospace" font-weight="700" font-size="' + (ic.t.length > 2 ? 9.5 : 11.5) + '" fill="currentColor">' + esc(ic.t) + "</text>";
    }
    (ic.p || []).forEach(function (p) {
      var d = typeof p === "string" ? p : p[0];
      var f = typeof p !== "string" && p[1] === "f";
      body += f
        ? '<path d="' + d + '" fill="currentColor"/>'
        : '<path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
    });
    return '<svg class="' + (cls || "ico") + '" viewBox="0 0 24 24" aria-hidden="true">' + body + "</svg>";
  }

  /* canvas rendering (Path2D cache) */
  var cache = {};
  function draw(ctx, id, x, y, size, color) {
    var ic = ICONS[id];
    if (!ic || typeof Path2D === "undefined") return false;
    var k = size / 24;
    ctx.save();
    ctx.translate(x - size / 2, y - size / 2);
    ctx.scale(k, k);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (ic.t) {
      ctx.font = "700 " + (ic.t.length > 2 ? 10 : 13) + "px 'JetBrains Mono', Menlo, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ic.t, 12, 12.5);
    }
    var ps = cache[id] || (cache[id] = (ic.p || []).map(function (p) {
      return {
        path: new Path2D(typeof p === "string" ? p : p[0]),
        f: typeof p !== "string" && p[1] === "f"
      };
    }));
    for (var i = 0; i < ps.length; i++) {
      if (ps[i].f) ctx.fill(ps[i].path);
      else ctx.stroke(ps[i].path);
    }
    ctx.restore();
    return true;
  }

  window.NodeIcons = {
    svg: svg,
    draw: draw,
    has: function (id) { return !!ICONS[id]; }
  };
})();
