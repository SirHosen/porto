import { PROJECTS, type Project } from "@/lib/portfolio";
import { ProjectArtwork } from "./ProjectArtwork";
import { TechIcon } from "./TechIcon";

export function ProjectPanel({ project, index, onInspect }: { project: Project; index: number; onInspect?: (id: string) => void }) {
  return <>
    <div className="mp-project-top"><span>{project.kind}</span><span>{project.index} / 09</span></div>
    <div className="mp-project-visual">
      <ProjectArtwork index={index} />
      <div className="mp-art-caption"><span>Concept study</span>{onInspect && <button type="button" onClick={() => onInspect(project.id)} aria-label={"Inspect " + project.name + " schematic"}>Inspect schematic <span aria-hidden="true">⤢</span></button>}</div>
    </div>
    <div className="mp-project-body" tabIndex={0} role="region" aria-label={project.name + " details"}>
      <h2 id={project.id + "-title"}>{project.name}</h2>
      <p className="mp-project-description">{project.tagline}</p>
      <ul className="mp-project-tags" aria-label="Technologies">
        {project.stack.map((tech, i) => <li key={tech}><TechIcon name={tech} id={project.id + "-tech-" + i} /></li>)}
      </ul>
      <div className="mp-project-bottom">
        <span className="mp-project-status"><span aria-hidden="true" />{project.status}</span>
        {"repo" in project && project.repo
          ? <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={"Source for " + project.name + " on GitHub (new tab)"}>View source <span aria-hidden="true">↗</span></a>
          : <span className="mp-archive-note">Source unavailable</span>}
      </div>
    </div>
    <nav className="mp-project-pagination" aria-label={project.name + " navigation"}>
      <a href={index === 0 ? "#about" : "#" + PROJECTS[index - 1].id} aria-label="Previous waypoint"><span aria-hidden="true">←</span></a>
      <span>{project.index} <span>/ 09</span></span>
      <a href={index === 8 ? "#arsenal" : "#" + PROJECTS[index + 1].id} aria-label="Next waypoint"><span aria-hidden="true">→</span></a>
    </nav>
  </>;
}
