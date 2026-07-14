/* ============================================================
   GraphScene — lightweight 3D dependency-graph renderer.
   Custom perspective projection onto Canvas 2D: zero external
   dependencies, fully verifiable offline, deploy-anywhere.
   ============================================================ */
(function () {
  "use strict";

  var D = window.GRAPH_DATA;

  var COL = {
    phosphor: "#FF9F1C",
    signal: "#6C63FF",
    text: "#E9E6DC",
    muted: "#8A8FA3",
    void_: "#0A0B10"
  };

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function norm(a) {
    var l = Math.sqrt(dot(a, a)) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smooth(u) { return u * u * (3 - 2 * u); }
  function hexA(hex, a) {
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }
  // vanilla easing lib (animejs-style curves, no deps)
  var EASE = {
    outExpo: function (u) { return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u); },
    inOutCubic: function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }
  };

  function GraphScene(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext("2d");
    this.nodes = D.nodes;
    this.edges = D.edges;
    this.byId = {};
    this.neighbors = {};
    var self = this;
    this.nodes.forEach(function (n) { self.byId[n.id] = n; });
    this.edges.forEach(function (e) {
      (self.neighbors[e.a] = self.neighbors[e.a] || []).push(e.b);
      (self.neighbors[e.b] = self.neighbors[e.b] || []).push(e.a);
    });

    this.cam = { pos: [0, 12, 130], alpha: 1 };
    this.target = { pos: [0, 12, 130], alpha: 1 };
    this.rot = 0;
    this.scrollP = 0;
    this.mouse = { x: 0, y: 0 };            // parallax, -1..1
    this.pointer = { x: -1e4, y: -1e4, active: false };
    this.picks = [];
    this.hovered = null;
    this.highlightId = null;                 // set externally (chip hover)
    this.firstFrame = true;
    this.staticMode = false;
    this.formT = 0;                          // graph formation progress
    this.time = 0;
    this.vel = [0, 0, 0];                    // camera spring velocity
    this.canFilter = typeof this.ctx.filter === "string"; // ctx.filter unsupported in some engines
    this.parts = [];
    for (var pi = 0; pi < 18; pi++) {
      this.parts.push({
        x: Math.random(), y: Math.random(),
        s: 0.7 + Math.random() * 1.5,
        v: 0.006 + Math.random() * 0.02,
        a: 0.04 + Math.random() * 0.08,
        d: Math.random() * 6.2832
      });
    }
    this.kfs = [];
    this.onFrame = null;
    this.resize();
  }

  GraphScene.prototype.resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    // canvas is a replaced element: it does NOT stretch between left/right
    // like a div, so derive its box from the computed inset values instead
    var cs = window.getComputedStyle(this.cv);
    var csL = parseFloat(cs.left) || 0;
    var csR = parseFloat(cs.right) || 0;
    var csT = parseFloat(cs.top) || 0;
    var csB = parseFloat(cs.bottom) || 0;
    this.w = Math.max(1, window.innerWidth - csL - csR);
    this.h = Math.max(1, window.innerHeight - csT - csB);
    this.split = csL > 8; // canvas rendered as an inset right-side panel
    this.cv.width = Math.round(this.w * dpr);
    this.cv.height = Math.round(this.h * dpr);
    this.cv.style.width = this.w + "px";
    this.cv.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  GraphScene.prototype.setKeyframes = function (kfs) {
    this.kfs = kfs; // [{ top, pos:[x,y,z], alpha }] sorted by top
  };

  GraphScene.prototype.updateTargetFromScroll = function (y) {
    var kfs = this.kfs;
    if (!kfs.length) return;
    var last = kfs[kfs.length - 1];
    if (y <= kfs[0].top) {
      this.target.pos = kfs[0].pos.slice();
      this.target.alpha = kfs[0].alpha;
      this.scrollP = 0;
      return;
    }
    if (y >= last.top) {
      this.target.pos = last.pos.slice();
      this.target.alpha = last.alpha;
      this.scrollP = 1;
      return;
    }
    for (var i = 0; i < kfs.length - 1; i++) {
      var a = kfs[i], b = kfs[i + 1];
      if (y >= a.top && y < b.top) {
        var u = EASE.inOutCubic((y - a.top) / Math.max(1, b.top - a.top));
        this.target.pos = [
          a.pos[0] + (b.pos[0] - a.pos[0]) * u,
          a.pos[1] + (b.pos[1] - a.pos[1]) * u,
          a.pos[2] + (b.pos[2] - a.pos[2]) * u
        ];
        this.target.alpha = a.alpha + (b.alpha - a.alpha) * u;
        this.scrollP = (i + u) / (kfs.length - 1);
        return;
      }
    }
  };

  GraphScene.prototype.pick = function (x, y) {
    var best = null, bestD = 1e9;
    for (var i = 0; i < this.picks.length; i++) {
      var p = this.picks[i];
      var dx = p.x - x, dy = p.y - y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var hitR = Math.max(p.r * 1.7, 13);
      if (d < hitR && d < bestD) { best = p; bestD = d; }
    }
    return best;
  };

  GraphScene.prototype.snap = function () { this.firstFrame = true; };

  GraphScene.prototype.frame = function (t, dt) {
    this.time = t;
    if (this.formT < 1) {
      this.formT = this.staticMode ? 1 : Math.min(1, this.formT + dt * 0.5);
    }
    var f = this.firstFrame ? 1 : Math.min(1, dt * 4.5);
    if (this.firstFrame || this.staticMode) {
      this.cam.pos = this.target.pos.slice();
      this.vel = [0, 0, 0];
    } else {
      // underdamped spring chase: slight overshoot, animejs-like feel
      var sdt = Math.min(dt, 0.05);
      for (var ax = 0; ax < 3; ax++) {
        this.vel[ax] += (this.target.pos[ax] - this.cam.pos[ax]) * 34 * sdt;
        this.vel[ax] *= Math.exp(-9 * sdt);
        this.cam.pos[ax] += this.vel[ax] * sdt;
      }
    }
    this.cam.alpha += (this.target.alpha - this.cam.alpha) * f;
    var targetRot = this.scrollP * 2.1 + (this.staticMode ? 0.4 : t * 0.04);
    this.rot += (targetRot - this.rot) * f;
    this.firstFrame = false;
    this.render();
    if (this.onFrame) this.onFrame();
  };

  GraphScene.prototype.render = function () {
    var ctx = this.ctx, w = this.w, h = this.h;
    if (w < 2 || h < 2) return; // canvas not sized yet — skip to avoid NaN gradients
    ctx.clearRect(0, 0, w, h);

    var cp = [
      this.cam.pos[0] + this.mouse.x * 5,
      this.cam.pos[1] + this.mouse.y * 3,
      this.cam.pos[2]
    ];
    var fw = norm(sub([0, 0, 0], cp));
    var rt = norm(cross(fw, [0, 1, 0]));
    var up = cross(rt, fw);
    // side-panel mode: zoom out slightly so the cluster fits the narrower panel
    var fl = this.split ? Math.min(h * 0.95, w * 0.8) : h * 0.95;
    var cr = Math.cos(this.rot), sr = Math.sin(this.rot);
    var form = smooth(this.formT);

    // project all nodes
    var proj = {};
    var drawList = [];
    for (var i = 0; i < this.nodes.length; i++) {
      var n = this.nodes[i];
      var x = n.p[0] * form, y = n.p[1] * form, z = n.p[2] * form;
      var rx = x * cr - z * sr, rz = x * sr + z * cr;
      var d = [rx - cp[0], y - cp[1], rz - cp[2]];
      var zc = dot(d, fw);
      if (zc < 6) { proj[n.id] = null; continue; }
      var sx = w / 2 + fl * dot(d, rt) / zc;
      var sy = h / 2 - fl * dot(d, up) / zc;
      var pr = { x: sx, y: sy, z: zc, n: n };
      proj[n.id] = pr;
      drawList.push(pr);
    }

    // highlight set = hovered node (graph) or external highlight (chips)
    var hid = this.hovered ? this.hovered.n.id : this.highlightId;
    var hlset = null;
    if (hid && this.byId[hid]) {
      hlset = {};
      hlset[hid] = true;
      (this.neighbors[hid] || []).forEach(function (id) { hlset[id] = true; });
    }

    var galpha = this.cam.alpha;
    var dashT = this.staticMode ? 0.8 : this.time; // freeze motion in static/reduced mode

    // ---- ambient particle drift (background atmosphere) ----
    for (var pi = 0; pi < this.parts.length; pi++) {
      var pt = this.parts[pi];
      var py = (pt.y - dashT * pt.v) % 1; if (py < 0) py += 1;
      var px = (pt.x + Math.sin(dashT * 0.1 + pt.d) * 0.015) * w;
      ctx.globalAlpha = pt.a * galpha;
      ctx.fillStyle = pi % 3 === 0 ? COL.signal : COL.muted;
      ctx.beginPath(); ctx.arc(px, py * h, pt.s, 0, 6.2832); ctx.fill();
    }

    // ---- edges ----
    for (var j = 0; j < this.edges.length; j++) {
      var e = this.edges[j];
      var a = proj[e.a], b = proj[e.b];
      if (!a || !b) continue;
      var isHl = hlset && (e.a === hid || e.b === hid);
      var base = e.t === "core" ? 0.32 : e.t === "dep" ? 0.22 : 0.13;
      var depth = clamp(1.65 - ((a.z + b.z) / 2) / 210, 0.25, 1);
      var alpha = base * depth;
      if (hlset && !isHl) alpha *= 0.22;
      ctx.strokeStyle = isHl ? COL.phosphor : COL.signal;
      ctx.globalAlpha = (isHl ? 0.9 : alpha) * galpha;
      ctx.lineWidth = isHl ? 1.6 : 1;
      if (isHl) { ctx.setLineDash([7, 5]); ctx.lineDashOffset = -dashT * 26; }
      else if (e.t === "core" || e.t === "dep") { ctx.setLineDash([10, 8]); ctx.lineDashOffset = -dashT * 7; }
      else { ctx.setLineDash([]); }
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // ---- nodes (far to near) ----
    drawList.sort(function (p, q) { return q.z - p.z; });
    this.picks = [];
    var labelCands = [];
    for (var k = 0; k < drawList.length; k++) {
      var p = drawList[k];
      var n2 = p.n;
      var wr = n2.type === "center" ? 5.2 : n2.type === "project" ? 3.2 : n2.type === "hub" ? 2.4 : 1.25;
      var r = Math.max(1.6, wr * fl / p.z);
      // soft depth-of-field: far nodes blur + desaturate
      if (this.canFilter) {
        ctx.filter = p.z > 300 ? "blur(2px) saturate(0.7)" : p.z > 235 ? "blur(1.1px) saturate(0.85)" : "none";
      }
      var inSet = !hlset || hlset[n2.id];
      var isHov = hid === n2.id;
      var nodeAlpha = (inSet ? 1 : 0.28) * galpha;
      var color =
        isHov ? COL.phosphor :
        n2.type === "center" ? COL.phosphor :
        n2.type === "project" ? COL.signal :
        n2.type === "hub" ? COL.text : COL.muted;

      // glow for important nodes
      if (n2.type !== "skill" || isHov) {
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.6);
        g.addColorStop(0, color);
        g.addColorStop(0.32, hexA(color, 0.3));
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.26 * nodeAlpha;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3.6, 0, 6.2832);
        ctx.fill();
        // slow idle pulse ring so the graph feels alive when idle
        var pw = Math.sin(dashT * 1.5 + n2.p[0] * 0.13 + n2.p[2] * 0.11);
        ctx.globalAlpha = (0.09 + 0.05 * pw) * nodeAlpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (1.6 + 0.13 * pw), 0, 6.2832);
        ctx.stroke();
      }

      ctx.globalAlpha = nodeAlpha;
      if (n2.type === "project") {
        ctx.fillStyle = COL.void_;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.stroke();
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(1.4, r * 0.38), 0, 6.2832); ctx.fill();
      } else {
        var glyph = r >= 6.5 && window.NodeIcons && window.NodeIcons.has(n2.id);
        if (glyph) {
          ctx.fillStyle = "#10131B";
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.stroke();
          window.NodeIcons.draw(ctx, n2.id, p.x, p.y, r * 1.15, color);
        } else {
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        }
      }

      // labels — collected for a collision-resolved second pass
      var showLabel =
        n2.type === "center" || n2.type === "hub" || n2.type === "project" ||
        (hlset && hlset[n2.id]);
      if (showLabel && r > 2 && form > 0.9) {
        labelCands.push({ p: p, n: n2, r: r, isHov: isHov, inSet: inSet, nodeAlpha: nodeAlpha });
      }

      this.picks.push({ x: p.x, y: p.y, r: r, n: n2 });
    }

    // ---- labels: second pass, priority + collision avoidance so text never stacks ----
    var prio = { center: 3, project: 2, hub: 1, skill: 0 };
    labelCands.sort(function (a, b) {
      var pa = (a.isHov ? 100 : 0) + (hlset && hlset[a.n.id] ? 50 : 0) + (prio[a.n.type] || 0);
      var pb = (b.isHov ? 100 : 0) + (hlset && hlset[b.n.id] ? 50 : 0) + (prio[b.n.type] || 0);
      if (pb !== pa) return pb - pa;
      return a.p.z - b.p.z;
    });
    var drawnBoxes = [];
    ctx.textAlign = "center";
    for (var li = 0; li < labelCands.length; li++) {
      var lc = labelCands[li], lp = lc.p, ln = lc.n, lr = lc.r;
      var fs = ln.type === "center" ? 13 : clamp(lr * 3.2, 10, 14);
      ctx.font = "500 " + fs + "px 'JetBrains Mono', Menlo, monospace";
      var tw = ctx.measureText(ln.label).width;
      var lx = lp.x, ly = lp.y - lr - 8;
      var box = { l: lx - tw / 2 - 5, r: lx + tw / 2 + 5, t: ly - fs - 2, b: ly + 5 };
      var forced = lc.isHov || (hlset && hlset[ln.id]);
      var collide = false;
      if (!forced) {
        for (var bi = 0; bi < drawnBoxes.length; bi++) {
          var db = drawnBoxes[bi];
          if (box.l < db.r && box.r > db.l && box.t < db.b && box.b > db.t) { collide = true; break; }
        }
      }
      if (collide) continue;
      drawnBoxes.push(box);
      var lAlpha = clamp(1.7 - lp.z / 200, 0.35, 1) * lc.nodeAlpha;
      ctx.globalAlpha = lAlpha;
      ctx.fillStyle = lc.isHov ? COL.phosphor : (ln.type === "skill" ? COL.phosphor : (lc.inSet ? COL.text : COL.muted));
      ctx.fillText(ln.label, lx, ly);
    }
    ctx.globalAlpha = 1;

    // hover resolve (pointer set by main.js)
    this.hovered = this.pointer.active ? this.pick(this.pointer.x, this.pointer.y) : null;
  };

  window.GraphScene = GraphScene;
})();
