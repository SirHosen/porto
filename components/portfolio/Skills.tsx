"use client";

import { useRef, useState, type CSSProperties } from "react";
import { CATS, SKILLS, DOMAIN_COPY, CONNECTED_PROJECTS, PROJECTS, projectsForDomain } from "@/lib/portfolio";

export function Skills({ cinematic }: { cinematic: boolean }) {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState<string | null>(null);
  const tabs = useRef<(HTMLAnchorElement | null)[]>([]);
  const category = CATS[selected];
  const select = (index: number) => { setSelected(index); setFilter(null); };
  return <div className="mp-skills" style={{ "--domain-color": category.color } as CSSProperties}>
    <div className="mp-skills-heading">
      <div>
        <p className="mp-eyebrow">CHAPTER 02 <span>/</span> THE ARSENAL</p>
        <h2 id="arsenal-title">MANY TOOLS.<br />ONE <span className="mp-outline">MIND.</span></h2>
      </div>
      <p className="mp-skills-aside">Different disciplines. Connected thinking.<br />Select a domain to explore the tools behind the work.</p>
    </div>
    <div className="mp-domain-browser">
      <div className="mp-domain-tabs" role={cinematic ? "tablist" : undefined} aria-label="Skill domains" aria-orientation={cinematic ? "vertical" : undefined}>
        {CATS.map((cat, i) => {
          const count = SKILLS.filter((skill) => skill[2] === cat.id).length;
          return <a key={cat.id} ref={(element) => { tabs.current[i] = element; }} href={"#domain-" + cat.id}
            id={"tab-" + cat.id} role={cinematic ? "tab" : undefined}
            aria-selected={cinematic ? selected === i : undefined}
            aria-controls={cinematic ? "domain-" + cat.id : undefined}
            tabIndex={cinematic && selected !== i ? -1 : 0}
            data-selected={selected === i}
            onClick={(event) => { if (cinematic) event.preventDefault(); select(i); }}
            onKeyDown={(event) => {
              if (!cinematic || !["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? 5 : (i + (event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1) + 6) % 6;
              select(next); tabs.current[next]?.focus();
            }}>
            <span className="mp-domain-index">{String(i + 1).padStart(2, "0")}</span>
            <span>{cat.label}</span>
            <span className="mp-domain-count">{String(count).padStart(2, "0")}</span>
            <span className="mp-domain-sign" aria-hidden="true">{selected === i ? "−" : "+"}</span>
          </a>;
        })}
      </div>
      <div className="mp-domain-panels">
        {CATS.map((cat, i) => {
          const selectedSkill = selected === i ? filter : null;
          const projects = projectsForDomain(cat.id).filter(project => !selectedSkill || project.deps.includes(selectedSkill));
          const name = SKILLS.find(skill => skill[0] === selectedSkill)?.[1];
          return <div key={cat.id} id={"domain-" + cat.id}
            className="mp-domain-panel" role={cinematic ? "tabpanel" : "region"}
            aria-labelledby={"tab-" + cat.id} tabIndex={0} hidden={cinematic && selected !== i}
            style={{ "--domain-color": cat.color } as CSSProperties}>
            {!cinematic && <h3>{cat.label}</h3>}
            <div className="mp-domain-body">
              <div className="mp-domain-copy">
                <p>{DOMAIN_COPY[cat.id as keyof typeof DOMAIN_COPY]}</p>
                <ul className="mp-skill-tags">{SKILLS.filter((skill) => skill[2] === cat.id).map((skill) => <li key={skill[0]}>
                  <button type="button" aria-pressed={selectedSkill === skill[0]} aria-controls={"proof-" + cat.id}
                    onClick={() => { setSelected(i); setFilter(selectedSkill === skill[0] ? null : skill[0]); }}>{skill[1]}</button>
                </li>)}</ul>
                <p className="mp-domain-projects">IN PRACTICE → <a href={"#" + projectsForDomain(cat.id)[0].id}>{CONNECTED_PROJECTS[i]} connected projects</a></p>
              </div>
              <div className="mp-proof" id={"proof-" + cat.id}>
                <div className="mp-proof-heading"><h3>Related work</h3>
                  {selectedSkill && <button type="button" onClick={() => setFilter(null)} aria-label="Clear skill filter">Clear <span aria-hidden="true">×</span></button>}
                </div>
                <p className="mp-proof-summary" aria-live="polite" aria-atomic="true">{name ? name + " · " : ""}{projects.length} {projects.length === 1 ? "project" : "projects"}</p>
                <ul className="mp-proof-list" key={selectedSkill ?? cat.id}>
                  {projects.map(project => <li key={project.id}>
                    <a href={"#" + project.id}>
                      <span className={"mp-proof-thumb mp-proof-thumb-" + PROJECTS.indexOf(project)} aria-hidden="true">{project.index}</span>
                      <span className="mp-proof-name">{project.name}<small>{project.kind}</small></span>
                      <span className="mp-proof-arrow" aria-hidden="true">↗</span>
                    </a>
                  </li>)}
                </ul>
                {projects.length === 0 && <p className="mp-proof-empty">No linked project in this archive.</p>}
                {!selectedSkill && <p className="mp-proof-hint">Pick a skill to narrow the work.</p>}
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>
    <div className="mp-skills-foot mp-mono"><span>NO SKILL BARS. JUST TOOLS I BUILD WITH.</span><span>6 DOMAINS / 45 TOOLS &amp; PRACTICES</span></div>
  </div>;
}
