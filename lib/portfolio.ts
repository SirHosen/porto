import content from "./portfolio-content.json";

// The source records are copied from the audited working tree, not inferred
// from deleted repositories or inaccessible chat sessions.
export const { PROFILE, CATS, SKILLS, DOMAIN_COPY } = content;
export const PROJECTS = content.PROJECTS.map((project) => project.id === "p-portfolio" ? {
  ...project,
  tagline: "A manga-inspired portfolio built around a continuous, scroll-driven 3D camera.",
  stack: ["Next.js", "TypeScript", "React Three Fiber", "GSAP", "Tailwind"],
} : project);
export type Project = (typeof PROJECTS)[number];

export const WAYPOINTS = [
  { id: "hero", label: "Hero", section: 0 },
  { id: "about", label: "About", section: 1 },
  ...PROJECTS.map((project) => ({ id: project.id, label: project.name, section: 2 })),
  { id: "arsenal", label: "Skills", section: 3 },
  { id: "contact", label: "Contact", section: 4 },
].map((point, index, points) => ({ ...point, progress: index / (points.length - 1) }));

export const NAVIGATION = [
  { label: "Hero", index: 0 },
  { label: "About", index: 1 },
  { label: "Projects", index: 2 },
  { label: "Skills", index: 11 },
  { label: "Contact", index: 12 },
];
export const CONNECTED_PROJECTS = CATS.map((category) => {
  const ids = new Set(SKILLS.filter((skill) => skill[2] === category.id).map((skill) => skill[0]));
  return PROJECTS.filter((project) => project.deps.some((id) => ids.has(id))).length;
});
export type CoreInput = { x: number; y: number; color: string; offsetX: number; offsetY: number; radius: number; visible: boolean };
