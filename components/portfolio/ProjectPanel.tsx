import { PROJECTS, type Project } from "@/lib/portfolio";

function Emblem({ index }: { index: number }) {
  return <svg className="mp-emblem" viewBox="0 0 400 150" aria-hidden="true">
    <path d="M0 75h400M200 0v150" stroke="currentColor" opacity=".12" />
    {index === 0 && <g fill="none" stroke="currentColor" strokeWidth="2">
      {[0, 1, 2, 3].map((n) => <path key={n} d={"M" + (100 + n * 17) + " " + (28 + n * 12) + "h130v70h-130z"} />)}
      <path d="m257 105 34 0m-10-10 10 10-10 10" stroke="#f24b3e" strokeWidth="5" />
    </g>}
    {index === 1 && <g fill="none" stroke="currentColor" strokeWidth="2">
      {[0, 1, 2].map((n) => <path key={n} d={"m200 " + (20 + n * 29) + " 90 25-90 25-90-25z"} fill={n === 0 ? "#f24b3e" : "none"} />)}
    </g>}
    {index === 2 && <g fill="none" stroke="currentColor">
      <circle cx="200" cy="75" r="57" strokeWidth="2" />
      <ellipse cx="200" cy="75" rx="105" ry="30" transform="rotate(-22 200 75)" />
      <circle cx="200" cy="75" r="18" fill="#f24b3e" stroke="none" />
      <path d="m163 106 26-50 19 35 28-51" strokeWidth="3" />
    </g>}
    {(index === 3 || index === 4) && <g>
      {Array.from({ length: 31 }, (_, n) => {
        const h = index === 3 ? 12 + Math.abs(Math.sin(n * .3)) * 88 : 8 + Math.abs(Math.sin(n * .63) * Math.cos(n * .13)) * 108;
        return <rect key={n} x={78 + n * 8} y={75 - h / 2} width={index === 3 ? 3 : 5} height={h} fill={n > 11 && n < 20 ? "#f24b3e" : "currentColor"} />;
      })}
    </g>}
    {index === 5 && <g fill="none" stroke="currentColor" strokeWidth="2">
      {[0, 1, 2].map((n) => <g key={n}><rect x="134" y={20 + n * 38} width="20" height="20" /><path d={"M174 " + (30 + n * 38) + "h92"} /></g>)}
      <path d="m137 62 7 7 14-17" stroke="#f24b3e" strokeWidth="5" />
    </g>}
    {index === 6 && <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m200 75-80-38m80 38 80-38m-80 38-80 38m80-38 80 38" />
      {[[120, 37], [280, 37], [120, 113], [280, 113]].map(([x, y], n) => <rect key={n} x={x - 20} y={y - 12} width="40" height="24" fill="#eeeade" />)}
      <path d="m200 54 21 21-21 21-21-21z" fill="#f24b3e" stroke="none" />
    </g>}
    {index === 7 && <g fill="none" stroke="currentColor">
      <circle cx="243" cy="51" r="27" fill="#f24b3e" stroke="none" />
      {[0, 1, 2].map((n) => <rect key={n} x={112 + n * 29} y={15 + n * 20} width={178 - n * 58} height={123 - n * 31} strokeWidth={4 - n} />)}
    </g>}
    {index === 8 && <g>
      <path d="m142 132 50-114h17l-37 114z" fill="currentColor" />
      <path d="m209 18 51 114h-31l-33-80z" fill="#f24b3e" />
      <path d="M172 101h55" stroke="currentColor" strokeWidth="3" />
    </g>}
  </svg>;
}

export function ProjectPanel({ project, index }: { project: Project; index: number }) {
  return <>
    <div className="mp-project-top">
      <span className="mp-mono">WORK / {project.index}</span>
      <span>{project.kind}</span>
      <span className="mp-project-mark" aria-hidden="true">↗</span>
    </div>
    <Emblem index={index} />
    <h2 id={project.id + "-title"}>{project.name}</h2>
    <p className="mp-project-description">{project.tagline}</p>
    <ul className="mp-project-tags" aria-label="Technologies">
      {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
    </ul>
    <div className="mp-project-bottom">
      <span className="mp-mono">{project.status}</span>
      {"repo" in project && project.repo
        ? <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={"Source for " + project.name + " on GitHub (new tab)"}>Source <span aria-hidden="true">↗</span></a>
        : <span className="mp-archive-note">Source unavailable</span>}
    </div>
    <nav className="mp-project-pagination" aria-label={project.name + " navigation"}>
      <a href={index === 0 ? "#about" : "#" + PROJECTS[index - 1].id} aria-label="Previous waypoint">←</a>
      <span>{project.index} <span>/ 09</span></span>
      <a href={index === 8 ? "#arsenal" : "#" + PROJECTS[index + 1].id} aria-label="Next waypoint">→</a>
    </nav>
  </>;
}
