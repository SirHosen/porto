/* ============================================================
   anime-lite — minimal anime.js-style animation engine.
   Same call shape as anime(): targets, per-prop [from,to],
   duration, delay (number or fn), easing, stagger helper.
   Written vanilla so the site stays offline-safe (no CDN).
   ============================================================ */
(function () {
  "use strict";

  var EASES = {
    linear: function (u) { return u; },
    outQuad: function (u) { return 1 - (1 - u) * (1 - u); },
    inOutCubic: function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    outExpo: function (u) { return u >= 1 ? 1 : 1 - Math.pow(2, -10 * u); },
    outBack: function (u) {
      var c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
    },
    outElastic: function (u) {
      if (u === 0 || u === 1) return u;
      return Math.pow(2, -10 * u) * Math.sin((u * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
    }
  };

  var PROPS = ["translateX", "translateY", "rotate", "scale", "opacity"];
  var active = [];
  var running = false;

  function toArray(t) {
    if (!t) return [];
    if (typeof t === "string") return Array.prototype.slice.call(document.querySelectorAll(t));
    if (typeof t.length === "number" && !(t instanceof Element)) return Array.prototype.slice.call(t);
    return [t];
  }

  function apply(el, vals) {
    var tr = "";
    if (vals.translateX !== undefined) tr += " translateX(" + vals.translateX + "px)";
    if (vals.translateY !== undefined) tr += " translateY(" + vals.translateY + "px)";
    if (vals.rotate !== undefined) tr += " rotate(" + vals.rotate + "deg)";
    if (vals.scale !== undefined) tr += " scale(" + vals.scale + ")";
    if (tr) el.style.transform = tr.trim();
    if (vals.opacity !== undefined) el.style.opacity = vals.opacity;
  }

  function endsIdentity(props) {
    if (props.translateX && props.translateX[1] !== 0) return false;
    if (props.translateY && props.translateY[1] !== 0) return false;
    if (props.rotate && props.rotate[1] !== 0) return false;
    if (props.scale && props.scale[1] !== 1) return false;
    return true;
  }

  function tick(now) {
    for (var i = active.length - 1; i >= 0; i--) {
      var a = active[i];
      var u = (now - a.start) / a.dur;
      if (u < 0) u = 0;
      var done = u >= 1;
      var e = a.ease(done ? 1 : u);
      var vals = {};
      for (var k in a.props) vals[k] = a.props[k][0] + (a.props[k][1] - a.props[k][0]) * e;
      apply(a.el, vals);
      if (done) {
        active.splice(i, 1);
        // release inline styles when we end at identity so CSS :hover
        // transforms keep working after the entrance animation
        if (endsIdentity(a.props)) a.el.style.transform = "";
        if (a.props.opacity && a.props.opacity[1] === 1) a.el.style.opacity = "";
        if (a.cb) a.cb();
      }
    }
    if (active.length) requestAnimationFrame(tick);
    else running = false;
  }

  function animeLite(opts) {
    var els = toArray(opts.targets);
    var dur = opts.duration || 600;
    var ease = EASES[opts.easing] || EASES.outQuad;
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    els.forEach(function (el, i) {
      var delay = typeof opts.delay === "function" ? opts.delay(el, i) : (opts.delay || 0);
      var props = {};
      PROPS.forEach(function (k) {
        if (opts[k] === undefined) return;
        var v = opts[k];
        props[k] = Array.isArray(v) ? [v[0], v[1]] : [(k === "scale" || k === "opacity") ? 1 : 0, v];
      });
      // apply the "from" state synchronously so there is no flash
      var init = {};
      for (var k2 in props) init[k2] = props[k2][0];
      apply(el, init);
      active.push({
        el: el, props: props, start: now + delay, dur: dur, ease: ease,
        cb: i === els.length - 1 ? (opts.complete || null) : null
      });
    });
    if (!running && active.length) {
      running = true;
      requestAnimationFrame(tick);
    }
  }

  animeLite.stagger = function (step, opts) {
    var start = (opts && opts.start) || 0;
    return function (el, i) { return start + i * step; };
  };

  window.animeLite = animeLite;
})();
