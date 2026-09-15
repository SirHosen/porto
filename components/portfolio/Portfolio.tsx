"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { PROFILE, PROJECTS, WAYPOINTS, NAVIGATION, type CoreInput } from "@/lib/portfolio";
import { ProjectPanel } from "./ProjectPanel";
import { Skills } from "./Skills";

const World = dynamic(() => import("./PortfolioWorld"), { ssr: false });
class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const metrics = useRef<{ width: number; height: number }[]>([]);
  const surface = useRef<HTMLDivElement>(null);
  const core = useRef<CoreInput>({ x: -.22, y: .45, color: "#f24b3e", offsetX: 0, offsetY: 0, radius: 75, visible: false });
  const line = useRef<HTMLDivElement>(null);
  const location = useRef<HTMLSpanElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const current = useRef(0);
  const resume = useRef<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [manualStatic, setManualStatic] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const animate = checked && !reduced && !manualStatic && !failed;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (window.__MIDNIGHT_CAMERA__) resume.current = current.current;
      setReduced(preference.matches); setChecked(true); setReady(false);
    };
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (animate) return;
    for (const panel of panels.current) if (panel) {
      panel.inert = false;
      panel.style.removeProperty("pointer-events");
      panel.style.removeProperty("visibility");
    }
    if (checked && resume.current !== null) {
      const index = resume.current;
      requestAnimationFrame(() => document.getElementById(WAYPOINTS[index].id)?.scrollIntoView({ block: "start" }));
    }
  }, [animate, checked]);

  useEffect(() => {
    const measure = () => {
      metrics.current = panels.current.map((panel) => ({ width: panel?.offsetWidth ?? 0, height: panel?.offsetHeight ?? 0 }));
      const panel = panels.current[11], stage = surface.current;
      if (panel && stage) {
        let x = stage.offsetWidth / 2, y = stage.offsetHeight / 2;
        let element: HTMLElement | null = stage;
        while (element && element !== panel) { x += element.offsetLeft; y += element.offsetTop; element = element.offsetParent as HTMLElement | null; }
        core.current.offsetX = x - panel.offsetWidth / 2;
        core.current.offsetY = y - panel.offsetHeight / 2;
        core.current.radius = Math.min(stage.offsetWidth, stage.offsetHeight) * .29;
        core.current.visible = animate;
      }
      window.__MIDNIGHT_CAMERA__?.redraw();
    };
    const observer = new ResizeObserver(measure);
    for (const panel of panels.current) if (panel) observer.observe(panel);
    if (surface.current) observer.observe(surface.current);
    measure();
    return () => observer.disconnect();
  }, [animate, ready]);

  const onReady = useCallback(() => {
    setReady(true);
    const hash = window.location.hash.slice(1);
    const index = WAYPOINTS.findIndex((stop) => stop.id === hash || (hash === "work" && stop.id === PROJECTS[0].id));
    if (resume.current !== null || index >= 0) {
      const stop = WAYPOINTS[resume.current ?? index];
      void window.__MIDNIGHT_CAMERA__?.travel(stop.progress);
      resume.current = null;
    }
  }, []);
  const onFailure = useCallback(() => { resume.current = current.current; setFailed(true); setReady(false); }, []);
  const onProgress = useCallback((progress: number) => {
    if (line.current) line.current.style.transform = "scaleX(" + progress + ")";
    const index = Math.min(12, Math.round(progress * 12));
    if (current.current === index && root.current?.dataset.currentWaypoint === WAYPOINTS[index].id) return;
    current.current = index;
    if (root.current) root.current.dataset.currentWaypoint = WAYPOINTS[index].id;
    if (location.current) location.current.textContent = WAYPOINTS[index].label;
    if (number.current) number.current.textContent = String(index + 1).padStart(2, "0");
    root.current?.querySelectorAll<HTMLAnchorElement>(".mp-nav a").forEach((anchor, i) => {
      if (WAYPOINTS[index].section === i) anchor.setAttribute("aria-current", "step");
      else anchor.removeAttribute("aria-current");
    });
  }, []);

  const status = animate ? ready ? "ready" : "loading" : failed ? "webgl-unavailable" : checked && reduced ? "reduced-motion" : "static";

  return <main ref={root} className={"midnight-portfolio " + (animate ? "is-cinematic" : "is-static")}
    data-scene-status={status}
    onClickCapture={(event) => {
      if (!animate || !window.__MIDNIGHT_CAMERA__ || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.hash.slice(1);
      const index = WAYPOINTS.findIndex((stop) => stop.id === id || (id === "work" && stop.id === PROJECTS[0].id));
      if (index < 0) return;
      event.preventDefault();
      history.replaceState(null, "", "#" + WAYPOINTS[index].id);
      void window.__MIDNIGHT_CAMERA__.travel(WAYPOINTS[index].progress, .95).then(() => panels.current[index]?.focus({ preventScroll: true }));
    }}>
    <a className="skip-link" href="#work">Skip to projects</a>
    <header className="mp-header">
      <a className="mp-brand" href="#hero" aria-label="Hosea — back to the beginning"><span aria-hidden="true">H<i>.</i></span><span>{PROFILE.handle}<small>MIDNIGHT PANEL</small></span></a>
      <div className="mp-header-actions">
        <button type="button" className="mp-motion" disabled={!checked || reduced || failed} aria-pressed={!animate} onClick={() => {
          let index = current.current;
          if (!animate) {
            let closest = Infinity;
            panels.current.forEach((panel, i) => {
              if (!panel) return;
              const box = panel.getBoundingClientRect(), middle = innerHeight / 2;
              const distance = middle < box.top ? box.top - middle : middle > box.bottom ? middle - box.bottom : 0;
              if (distance < closest) { closest = distance; index = i; }
            });
          }
          resume.current = index; setReady(false); setManualStatic((value) => !value);
        }}>{reduced && checked ? "Reduced motion" : failed ? "Static view" : manualStatic ? "Enable 3D" : "Static view"}</button>
        <a className="mp-github" href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="Hosea on GitHub (new tab)">GitHub <span aria-hidden="true">↗</span></a>
      </div>
    </header>
    <div className="mp-world" aria-hidden="true">
      {animate && <SceneBoundary onFailure={onFailure}><World track={track} panels={panels} metrics={metrics} core={core} onReady={onReady} onFailure={onFailure} onProgress={onProgress} /></SceneBoundary>}
    </div>
    <p className="mp-status" role="status">{animate ? ready ? "3D ready." : "Preparing the 3D world…" : failed ? "3D is unavailable. All work and skills are available in this static page." : "Camera movement is off. All work and skills are available below."}</p>

    <div ref={track} className="mp-track">
      {WAYPOINTS.map((stop, i) => <section id={stop.id} className="mp-slot" key={stop.id} aria-labelledby={stop.id + "-title"}>
        {i === 2 && <span id="work" className="mp-anchor" />}
        <div ref={(element) => { panels.current[i] = element; }}
          className={"mp-content " + (i === 0 ? "mp-hero" : i === 1 ? "mp-about" : i <= 10 ? "mp-project" : i === 11 ? "mp-arsenal" : "mp-contact")}
          data-waypoint={stop.id} style={{ zIndex: 13 - i }} data-lenis-prevent={i >= 2 && i <= 11 ? "" : undefined} tabIndex={-1}>
          {i === 0 ? <>
            <div className="mp-hero-top mp-mono"><span>{PROFILE.roles[0]}</span><span>{PROFILE.location}</span></div>
            <h1 id="hero-title">{PROFILE.name}<span>.</span></h1>
            <div className="mp-hero-bottom"><p>Software. Automation. Applied AI.</p><a href="#about">Scroll to enter <span aria-hidden="true">↓</span></a></div>
            <span className="mp-hero-stamp mp-mono" aria-hidden="true">001 — MIDNIGHT PANEL</span>
          </> : i === 1 ? <>
            <p className="mp-eyebrow">ABOUT / {PROFILE.roles[1]}</p>
            <h2 id="about-title">LINUX<br />AT <span className="mp-outline">HEART.</span></h2>
            <p className="mp-about-line">Linux is my everyday environment.</p>
            <a className="mp-text-link" href="#work">Explore the work <span aria-hidden="true">↗</span></a>
          </> : i <= 10 ? <ProjectPanel project={PROJECTS[i - 2]} index={i - 2} />
          : i === 11 ? <Skills cinematic={animate} core={core} surface={surface} />
          : <>
            <p className="mp-eyebrow">CONTACT / {PROFILE.location}</p>
            <h2 id="contact-title">LET’S BUILD<br />SOMETHING<br /><span>worth it.</span></h2>
            <a className="mp-contact-link" href={PROFILE.github} target="_blank" rel="noopener noreferrer">Find me on GitHub <span aria-hidden="true">↗</span></a>
            <div className="mp-contact-foot mp-mono"><span>{PROFILE.handle}</span><a href="#hero">Back to the beginning ↑</a></div>
          </>}
        </div>
      </section>)}
    </div>

    <footer className="mp-footer">
      <div className="mp-location" aria-hidden="true"><span ref={number}>01</span><span><span ref={location}>Hero</span><small> / 13 WAYPOINTS</small></span></div>
      <nav className="mp-nav" aria-label="Portfolio sections">{NAVIGATION.map((item) => <a key={item.label} href={"#" + WAYPOINTS[item.index].id}><span /><span>{item.label}</span></a>)}</nav>
      <span className="mp-footer-sign mp-mono" aria-hidden="true">SCROLL / EXPLORE</span>
    </footer>
    <div ref={line} className="mp-travel-line" aria-hidden="true" />
  </main>;
}
