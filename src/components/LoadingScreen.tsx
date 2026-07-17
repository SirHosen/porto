'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const COLORS = ['#ff9f1c', '#7c8cff', '#00d4ff', '#ffc53d'];

export default function LoadingScreen() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const particles = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 37 + 11) % 97}%`, top: `${(i * 53 + 17) % 91}%`,
    size: `${1 + (i % 3)}px`, delay: i * 34,
  })), []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const bar = barRef.current;
    const pct = pctRef.current;
    if (!wrap || !bar || !pct) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setGone(true); return; }

    const animations: Animation[] = [];
    const counter = { value: 0 };
    const started = performance.now();
    let raf = 0;

    animations.push(bar.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 1550, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }
    ));
    document.querySelectorAll<HTMLElement>('.loader-particle').forEach((el, i) => {
      animations.push(el.animate(
        [{ opacity: 0, transform: 'scale(0) translateY(12px)' }, { opacity: .72, transform: 'scale(1) translateY(0)' }],
        { duration: 520, delay: 120 + i * 34, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }
      ));
    });
    document.querySelector<HTMLElement>('.loader-tagline')?.animate(
      [{ opacity: 0, letterSpacing: '.32em' }, { opacity: 1, letterSpacing: '.18em' }],
      { duration: 700, delay: 220, easing: 'ease-out', fill: 'forwards' }
    );

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 1550);
      const eased = t < .5 ? 8*t*t*t*t : 1 - Math.pow(-2*t + 2, 4)/2;
      counter.value = Math.round(eased * 100);
      pct.textContent = `${String(counter.value).padStart(3, '0')}%`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const exit = window.setTimeout(() => {
      const a = wrap.animate(
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-18px)' }],
        { duration: 560, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' }
      );
      animations.push(a);
      a.finished.then(() => setGone(true));
    }, 1720);

    return () => { cancelAnimationFrame(raf); clearTimeout(exit); animations.forEach(a => a.cancel()); };
  }, []);

  if (gone) return null;
  return <div ref={wrapRef} id="premium-loader">
    <div className="loader-bg"/><div className="loader-grid"/>
    <div className="loader-particles">{particles.map((p, i) => <i key={i} className="loader-particle" style={{ left:p.left, top:p.top, width:p.size, height:p.size, background:COLORS[i%COLORS.length] }}/>)}</div>
    <div className="loader-content"><div className="loader-kicker mono">PORTFOLIO_OS / 2026</div><div className="loader-logo">hosea<span>.dev</span></div><div className="loader-tagline">mapping evidence to capability</div><div className="loader-bar-wrap"><div ref={barRef} className="loader-bar"/></div><div ref={pctRef} className="loader-pct">000%</div></div>
  </div>;
}
