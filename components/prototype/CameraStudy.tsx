"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { STOPS, type CameraReading } from "@/lib/camera-study";

const World = dynamic(() => import("./CameraWorld"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function StaticFrame({ index }: { index: number }) {
  return (
    <svg className="static-frame" viewBox="0 0 480 320" aria-hidden="true">
      <rect width="480" height="320" fill="#101010" />
      <circle cx={330 - index * 15} cy="86" r="46" fill="#f24b3e" />
      <path d="M0 300 235 175 480 300M0 260 480 260" stroke="#353532" fill="none" />
      {[0, 1, 2].map((n) => <rect key={n} x={68 + n * 48} y={36 + n * 35} width={320 - n * 96} height={280 - n * 55} fill="none" stroke={n === index % 3 ? "#f24b3e" : "#eeeade"} strokeWidth={8 - n * 2} />)}
    </svg>
  );
}

export function CameraStudy() {
  const track = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const travelLine = useRef<HTMLDivElement>(null);
  const lastPercent = useRef(-1);
  const progressLabel = useRef<HTMLSpanElement>(null);
  const currentStop = useRef(0);
  const [activeStop, setActiveStop] = useState(0);
  const [reduced, setReduced] = useState(true);
  const [checked, setChecked] = useState(false);
  const [manualStatic, setManualStatic] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [diagnostics, setDiagnostics] = useState(false);
  const [reading, setReading] = useState<CameraReading | null>(null);
  const animate = checked && !reduced && !manualStatic && !failed;

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(preference.matches); setChecked(true); };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!diagnostics || !animate) return;
    const timer = window.setInterval(() => setReading(window.__MIDNIGHT_CAMERA__?.read() ?? null), 250);
    return () => clearInterval(timer);
  }, [diagnostics, animate]);

  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const onProgress = useCallback((progress: number) => {
    // Keep changing styles on the two animated leaves, not an inherited
    // custom property that invalidates the entire static DOM every frame.
    if (intro.current) intro.current.style.opacity = String(Math.max(0, 1 - progress * 8));
    if (travelLine.current) travelLine.current.style.transform = "scaleX(" + progress + ")";
    const percent = Math.round(progress * 100);
    if (progressLabel.current && percent !== lastPercent.current) {
      progressLabel.current.textContent = String(percent).padStart(3, "0");
      lastPercent.current = percent;
    }
    const index = Math.min(STOPS.length - 1, Math.floor(progress * (STOPS.length - 1) + 0.5));
    if (currentStop.current !== index) { currentStop.current = index; setActiveStop(index); }
  }, []);

  const toggleMotion = () => {
    const progress = scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight);
    setReady(false);
    setManualStatic((value) => !value);
    requestAnimationFrame(() => window.scrollTo(0, progress * (document.documentElement.scrollHeight - innerHeight)));
  };

  const status = animate ? (ready ? "ready" : "loading") : failed ? "webgl-unavailable" : reduced && checked ? "reduced-motion" : "static";

  return (
    <main className={"camera-study " + (animate ? "is-cinematic" : "is-static")} data-scene-status={status}>
      <a className="skip-link" href="#frame-arrival">Skip to the study</a>
      <header className="study-header flex items-center justify-between">
        <a className="study-brand" href={(process.env.NEXT_PUBLIC_BASE_PATH ?? "/porto") + "/"} aria-label="Midnight Panel study index">
          <span className="brand-mark" aria-hidden="true">H<span>.</span></span>
          <span>Midnight Panel<small>Camera study / 01</small></span>
        </a>
        <div className="study-controls flex items-center">
          <button type="button" className="quiet-button diagnostics-toggle" aria-expanded={diagnostics} aria-controls="camera-diagnostics" onClick={() => setDiagnostics(!diagnostics)}>Diagnostics</button>
          <button type="button" className="quiet-button motion-toggle" onClick={toggleMotion} disabled={reduced || failed} aria-pressed={!animate}>
            {reduced && checked ? "Reduced motion" : failed ? "Static view" : manualStatic ? "Enable 3D" : "Static view"}
          </button>
        </div>
      </header>

      <div className="scene-layer" aria-hidden="true">
        {animate && <SceneBoundary onFailure={onFailure}><World track={track} onReady={onReady} onFailure={onFailure} onProgress={onProgress} /></SceneBoundary>}
      </div>

      <div ref={intro} className="study-intro">
        <p className="study-kicker">A spatial sketch</p>
        <h1>Through<br />the panels.</h1>
        <p className="study-note">Five frames. One continuous camera.</p>
        <p className="scroll-cue"><span aria-hidden="true">↓</span> Scroll to travel</p>
      </div>

      <p className="scene-message" role="status">
        {animate ? ready ? "3D camera ready." : "Preparing geometry…" : failed ? "3D is unavailable. The static study is available below." : "Static study. Camera movement is off."}
      </p>

      <div ref={track} className="camera-track" id="camera-track">
        {STOPS.map((stop, i) => (
          <section className="path-stop" id={"frame-" + stop.id} aria-labelledby={"title-" + stop.id} key={stop.id}>
            <div className="stop-content">
              <p className="study-kicker">Frame {String(i + 1).padStart(2, "0")}</p>
              <h2 id={"title-" + stop.id}>{stop.name}</h2>
              <StaticFrame index={i} />
              <p>Placeholder geometry. No portfolio content integrated.</p>
            </div>
          </section>
        ))}
      </div>

      <footer className="study-footer">
        <div className="frame-readout" aria-hidden="true">
          <span className="frame-number">{String(activeStop + 1).padStart(2, "0")}<span>/05</span></span>
          <span className="frame-name">{STOPS[activeStop].name}</span>
        </div>
        <nav className="frame-nav" aria-label="Camera waypoints">
          {STOPS.map((stop, i) => (
            <a href={"#frame-" + stop.id} key={stop.id} aria-label={"Frame " + (i + 1) + ": " + stop.name}
              aria-current={animate && i === activeStop ? "step" : undefined}
              onClick={(event) => {
                if (animate && window.__MIDNIGHT_CAMERA__) {
                  event.preventDefault();
                  void window.__MIDNIGHT_CAMERA__.travel(stop.progress, 1.2);
                }
              }}>
              <span className="nav-tick" /><span className="nav-name">{stop.name}</span>
            </a>
          ))}
        </nav>
        <p className="progress-readout" aria-hidden="true"><span ref={progressLabel}>000</span><span>%</span></p>
      </footer>
      <div ref={travelLine} className="travel-line" aria-hidden="true" />
      <aside id="camera-diagnostics" className="camera-diagnostics" hidden={!diagnostics} aria-label="Camera diagnostics">
        <p>Phase 1 / not a benchmark</p>
        {reading ? <>
          <p>Position: {reading.position.map((n) => n.toFixed(2)).join(", ")}</p>
          <p>Progress: {reading.progress.toFixed(4)}</p>
          <p>{reading.calls} draws / {reading.triangles} triangles</p>
          <p>DPR: {reading.dpr} / renders: {reading.renders}</p>
          <p>{reading.renderer}</p>
        </> : <p>Camera inactive.</p>}
      </aside>
    </main>
  );
}
