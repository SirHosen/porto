"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { CATS, SKILLS, DOMAIN_COPY, CONNECTED_PROJECTS, type CoreInput } from "@/lib/portfolio";

export function Skills({ cinematic, core, surface }: {
  cinematic: boolean;
  core: RefObject<CoreInput>;
  surface: RefObject<HTMLDivElement | null>;
}) {
  const [selected, setSelected] = useState(0);
  const [touch, setTouch] = useState(false);
  const tabs = useRef<(HTMLAnchorElement | null)[]>([]);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const category = CATS[selected];
  useEffect(() => {
    const query = matchMedia("(pointer: coarse), (max-width: 760px)");
    const update = () => setTouch(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const select = (index: number) => {
    setSelected(index);
    core.current.color = CATS[index].color;
    window.__MIDNIGHT_CAMERA__?.redraw();
  };
  const orbit = cinematic && !touch;

  return <div className="mp-skills" style={{ "--domain-color": category.color } as CSSProperties}>
    <div className="mp-skills-heading">
      <div>
        <p className="mp-eyebrow">CHAPTER 02 <span>/</span> THE ARSENAL</p>
        <h2 id="arsenal-title">MANY TOOLS.<br />ONE <span className="mp-outline">MIND.</span></h2>
      </div>
      <p className="mp-skills-aside">Different disciplines. Connected thinking.<br />Select a domain to explore the tools behind the work.</p>
    </div>
    <div className="mp-skills-body">
      <div ref={surface} className="mp-core" data-orbit={orbit}
        onPointerDown={(event) => {
          if (!orbit || event.pointerType === "touch" || (event.target as HTMLElement).closest("button")) return;
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.id !== event.pointerId) return;
          core.current.y += (event.clientX - drag.current.x) * .012;
          core.current.x += (event.clientY - drag.current.y) * .012;
          drag.current.x = event.clientX; drag.current.y = event.clientY;
          window.__MIDNIGHT_CAMERA__?.redraw();
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}>
        <div className="mp-core-top mp-mono"><span><i /> CAPABILITY CORE</span><span>{category.code} / {String(selected + 1).padStart(2, "0")}</span></div>
        <div className="mp-core-symbol" aria-hidden="true">創造</div>
        <svg className="mp-core-static" viewBox="0 0 320 210" aria-hidden="true">
          <ellipse cx="160" cy="106" rx="97" ry="39" fill="none" stroke="currentColor" transform="rotate(-28 160 106)" />
          <path d="m160 28 50 78-50 77-50-77zM110 106h100M160 28v155" fill="none" stroke="var(--domain-color)" strokeWidth="2" />
        </svg>
        <div className="mp-core-bottom mp-mono">
          <span>{!cinematic ? "STATIC VIEW · EXPLORE THE DOMAINS" : touch ? "SELECT A DOMAIN · SCROLL TO CONTINUE" : "DRAG TO ORBIT · SCROLL TO CONTINUE"}</span>
          <button type="button" disabled={!orbit} onClick={() => {
            core.current.x = -.22; core.current.y = .45;
            window.__MIDNIGHT_CAMERA__?.redraw();
          }}>RESET ↺</button>
        </div>
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
          {CATS.map((cat, i) => <div key={cat.id} id={"domain-" + cat.id}
            className="mp-domain-panel" role={cinematic ? "tabpanel" : "region"}
            aria-labelledby={"tab-" + cat.id} tabIndex={0} hidden={cinematic && selected !== i}>
            {!cinematic && <h3>{cat.label}</h3>}
            <div className="mp-domain-copy">
              <p>{DOMAIN_COPY[cat.id as keyof typeof DOMAIN_COPY]}</p>
              <ul className="mp-skill-tags">{SKILLS.filter((skill) => skill[2] === cat.id).map((skill) => <li key={skill[0]}>{skill[1]}</li>)}</ul>
              <p className="mp-domain-projects">IN PRACTICE → <a href="#work">{CONNECTED_PROJECTS[i]} connected projects</a></p>
            </div>
          </div>)}
        </div>
      </div>
    </div>
    <div className="mp-skills-foot mp-mono"><span>NO SKILL BARS. JUST TOOLS I BUILD WITH.</span><span>6 DOMAINS / 45 TOOLS &amp; PRACTICES</span></div>
  </div>;
}
