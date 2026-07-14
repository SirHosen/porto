/* ============================================================
   bgflow.js — procedural "data / network flow" background.
   A living, video-like backdrop that renders BEHIND the 3D graph.
   Zero dependencies, fully offline, seam-less infinite loop.

   Layering (back -> front):  #bg-video  ->  #bg-flow (this)  ->  #graph
   The scrim/vignette above dims it so it reads as ambient depth.

   Respects prefers-reduced-motion and the deterministic QA mode
   (window.QA_SECTION / window.QA_MODAL) by painting a single frame.
   ============================================================ */
(function () {
  "use strict";

  var cv = document.getElementById("bg-flow");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  if (!ctx) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isQA = !!(window.QA_SECTION || window.QA_MODAL);

  var AMBER = [255, 159, 28];
  var SIGNAL = [108, 99, 255];

  var W = 0, H = 0, dpr = 1;
  var lanes = [];   // slow flowing lanes (curved paths)
  var packets = []; // bright data packets travelling along lanes
  var motes = [];   // faint drifting background specks for depth

  function rand(a, b) { return a + Math.random() * (b - a); }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function build() {
    lanes = [];
    packets = [];
    motes = [];

    // flowing lanes: gentle sine paths drifting left -> right
    var laneCount = W < 700 ? 7 : 12;
    for (var i = 0; i < laneCount; i++) {
      var baseY = (i + 0.5) / laneCount;
      lanes.push({
        y: baseY,                       // 0..1 vertical anchor
        amp: rand(0.02, 0.08),          // vertical sway amplitude (fraction of H)
        freq: rand(0.6, 1.6),           // horizontal wave frequency
        phase: rand(0, Math.PI * 2),
        drift: rand(0.006, 0.016),      // phase drift speed (very slow)
        color: Math.random() < 0.5 ? AMBER : SIGNAL,
        alpha: rand(0.05, 0.12)
      });
    }

    // packets ride the lanes as bright travelling dots
    var packetCount = W < 700 ? 22 : 42;
    for (var p = 0; p < packetCount; p++) {
      packets.push(spawnPacket(Math.random()));
    }

    // faint depth motes
    var moteCount = W < 700 ? 26 : 54;
    for (var m = 0; m < moteCount; m++) {
      motes.push({
        x: Math.random(), y: Math.random(),
        r: rand(0.4, 1.6),
        vx: rand(0.002, 0.012),
        a: rand(0.04, 0.16),
        color: Math.random() < 0.35 ? AMBER : SIGNAL
      });
    }
  }

  function spawnPacket(startX) {
    var lane = Math.floor(rand(0, lanes.length));
    return {
      lane: lane,
      x: startX,                       // 0..1 progress across width
      speed: rand(0.015, 0.05),        // slow travel
      size: rand(1.1, 2.6),
      color: lanes[lane] ? lanes[lane].color : AMBER,
      a: rand(0.5, 1)
    };
  }

  function laneYAt(lane, x, t) {
    // vertical position of a lane at horizontal fraction x and time t
    return (lane.y + lane.amp * Math.sin(x * Math.PI * 2 * lane.freq + lane.phase + t * lane.drift)) * H;
  }

  function step(t, dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    // 1) draw flowing lane paths (faint continuous ribbons)
    for (var i = 0; i < lanes.length; i++) {
      var L = lanes[i];
      ctx.beginPath();
      var segs = 42;
      for (var s = 0; s <= segs; s++) {
        var xf = s / segs;
        var px = xf * W;
        var py = laneYAt(L, xf, t);
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = rgba(L.color, L.alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 2) packets travelling along lanes, with a soft glow + short trail
    for (var p = 0; p < packets.length; p++) {
      var pk = packets[p];
      pk.x += pk.speed * dt;
      if (pk.x > 1.05) { packets[p] = spawnPacket(-0.05); continue; }
      var L2 = lanes[pk.lane];
      if (!L2) { packets[p] = spawnPacket(0); continue; }
      var x = pk.x * W;
      var y = laneYAt(L2, pk.x, t);

      // trail
      var tx = (pk.x - 0.05) * W;
      var ty = laneYAt(L2, Math.max(0, pk.x - 0.05), t);
      var grad = ctx.createLinearGradient(tx, ty, x, y);
      grad.addColorStop(0, rgba(pk.color, 0));
      grad.addColorStop(1, rgba(pk.color, 0.35 * pk.a));
      ctx.strokeStyle = grad;
      ctx.lineWidth = pk.size * 0.9;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();

      // glow
      var g = ctx.createRadialGradient(x, y, 0, x, y, pk.size * 6);
      g.addColorStop(0, rgba(pk.color, 0.5 * pk.a));
      g.addColorStop(0.4, rgba(pk.color, 0.12 * pk.a));
      g.addColorStop(1, rgba(pk.color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, pk.size * 6, 0, 6.2832); ctx.fill();

      // core
      ctx.fillStyle = rgba(pk.color, 0.9 * pk.a);
      ctx.beginPath(); ctx.arc(x, y, pk.size, 0, 6.2832); ctx.fill();
    }

    // 3) faint depth motes drifting slowly
    for (var m = 0; m < motes.length; m++) {
      var mo = motes[m];
      mo.x += mo.vx * dt;
      if (mo.x > 1.02) mo.x = -0.02;
      ctx.fillStyle = rgba(mo.color, mo.a);
      ctx.beginPath();
      ctx.arc(mo.x * W, mo.y * H, mo.r, 0, 6.2832);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
  }

  // ---- lifecycle ----
  resize();
  build();

  if (reduceMotion || isQA) {
    // static single frame — no animation loop
    step(0.4, 0.016);
  } else {
    var last = 0;
    function loop(now) {
      var t = now / 1000;
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      if (!document.hidden) step(t, dt);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    // paint one frame immediately so there is never a blank flash
    step(0.4, 0.016);
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { resize(); build(); if (reduceMotion || isQA) step(0.4, 0.016); }, 160);
  }, { passive: true });
})();
