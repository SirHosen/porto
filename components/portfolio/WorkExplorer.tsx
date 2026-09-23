"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { PROJECTS, SKILLS, type Project } from "@/lib/portfolio";
import { ProjectArtwork } from "./ProjectArtwork";
import { TechIcon } from "./TechIcon";

type Props = { projectId?: string; onDismiss: () => void };
type Scope = "all" | "public" | "archive";
const hasSource = (project: Project) => "repo" in project && Boolean(project.repo);
const searchable = PROJECTS.map(project => [
  project.name, project.kind, ...project.stack,
  ...SKILLS.filter(skill => project.deps.includes(skill[0])).map(skill => skill[1]),
].join(" ").toLowerCase());

export default function WorkExplorer({ projectId, onDismiss }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [inspected, setInspected] = useState(PROJECTS.find(project => project.id === projectId) ?? null);
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = PROJECTS.filter((project, index) =>
    tokens.every(token => searchable[index].includes(token)) &&
    (scope === "all" || (scope === "public" ? hasSource(project) : !hasSource(project))),
  );

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    element.showModal();
    input.current?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.documentElement.style.overflow = overflow;
      if (opener?.isConnected && !opener.closest("[inert]")) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (inspected) dialog.current?.querySelector<HTMLButtonElement>(".mp-explorer-back")?.focus({ preventScroll: true });
    else input.current?.focus({ preventScroll: true });
  }, [inspected]);

  const navigateResults = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? results.length - 1
      : (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
    links.current[next]?.focus();
  };
  const backToIndex = () => {
    setInspected(null);
    requestAnimationFrame(() => input.current?.focus());
  };

  return <dialog ref={dialog} className="mp-explorer" aria-labelledby="explorer-title"
    data-lenis-prevent="" onCancel={event => { event.preventDefault(); onDismiss(); }}
    onKeyDown={event => {
      // Native search fields otherwise consume Escape just to clear the query.
      if (event.key === "Escape") { event.preventDefault(); onDismiss(); return; }
      if (event.key !== "Tab") return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'))
        .filter(element => !element.closest("[hidden]") && element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onDismiss();
    }}>
    <header className="mp-explorer-header">
      <div>
        {inspected && <button className="mp-explorer-back" type="button" onClick={backToIndex}>← Project index</button>}
        <h2 id="explorer-title">{inspected ? inspected.name : "Project index"}</h2>
      </div>
      <button className="mp-explorer-close" type="button" onClick={onDismiss} aria-label="Close project explorer"><span aria-hidden="true">×</span><kbd>Esc</kbd></button>
    </header>

    {inspected ? <div className="mp-inspection">
      <div className="mp-inspection-meta"><span>{inspected.kind}</span><span>{inspected.status}</span></div>
      <ProjectArtwork index={PROJECTS.indexOf(inspected)} instance="inspection" />
      <p className="mp-schematic-note">Concept schematic · not a product screenshot or measured telemetry.</p>
      <p className="mp-inspection-description">{inspected.tagline}</p>
      <ul className="mp-project-tags" aria-label="Technologies">{inspected.stack.map((tech, i) =>
        <li key={tech}><TechIcon name={tech} id={"inspect-" + inspected.id + "-" + i} /></li>)}</ul>
      <div className="mp-inspection-actions">
        <a className="mp-solid-link" href={"#" + inspected.id} onClick={onDismiss}>Open waypoint <span aria-hidden="true">↗</span></a>
        {hasSource(inspected) && "repo" in inspected
          ? <a href={inspected.repo} target="_blank" rel="noopener noreferrer" aria-label={"Source for " + inspected.name + " on GitHub (new tab)"}>View source ↗</a>
          : <span>Source unavailable</span>}
      </div>
    </div> : <>
      <div className="mp-search-field">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></svg>
        <label className="mp-visually-hidden" htmlFor="work-search">Search projects or technologies</label>
        <input ref={input} id="work-search" type="search" autoFocus autoComplete="off" spellCheck={false}
          placeholder="Search projects or technologies…" value={query} aria-controls="work-results"
          onChange={event => setQuery(event.target.value)}
          onKeyDown={event => {
            if (event.key === "ArrowDown") { event.preventDefault(); links.current[0]?.focus(); }
            if (event.key === "Enter") { event.preventDefault(); links.current[0]?.click(); }
          }} />
      </div>
      <div className="mp-search-toolbar">
        <div className="mp-search-filters" aria-label="Project source filter">
          {([["all", "All work"], ["public", "Public source"], ["archive", "Archives"]] as const).map(([value, label]) =>
            <button type="button" key={value} aria-pressed={scope === value} onClick={() => setScope(value)}>{label}</button>)}
        </div>
        <p role="status">{results.length} {results.length === 1 ? "project" : "projects"}</p>
      </div>
      <ul id="work-results" className="mp-search-results">
        {results.map((project, index) => <li key={project.id}>
          <a ref={element => { links.current[index] = element; }} href={"#" + project.id} onClick={onDismiss}
            onKeyDown={event => navigateResults(event, index)}>
            <span className="mp-search-number" aria-hidden="true">{project.index}</span>
            <span className="mp-search-name">{project.name}<small>{project.kind}</small></span>
            <span className="mp-search-status">{project.status}</span>
            <span className="mp-search-arrow" aria-hidden="true">↗</span>
          </a>
          <button type="button" className="mp-inspect-shortcut" onClick={() => setInspected(project)}
            aria-label={"Inspect " + project.name + " schematic"} title="Inspect schematic">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z" /></svg>
          </button>
        </li>)}
      </ul>
      {results.length === 0 && <div className="mp-search-empty">
        <p>No linked work for “{query || (scope === "public" ? "public source" : "archives")}”.</p>
        <button type="button" onClick={() => { setQuery(""); setScope("all"); input.current?.focus(); }}>Show all projects</button>
      </div>}
      <footer className="mp-explorer-footer"><span>Search uses the documented stack and skill connections.</span><span><kbd>↑</kbd> <kbd>↓</kbd> Navigate <kbd>Enter</kbd> Open</span></footer>
    </>}
  </dialog>;
}
