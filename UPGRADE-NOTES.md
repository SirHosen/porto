# Premium Portfolio Upgrade — Handoff

## Status
This is a Next.js 14 + TypeScript App Router project. The existing portfolio content, section order, dependency graph, project modal, and terminal aesthetic are preserved.

## Integrated premium systems
- GSAP hero line reveal, controlled glitch burst, and mouse depth parallax
- Lenis smooth scrolling with reduced-motion fallback
- Premium loading sequence
- Interactive skill constellation: drag, wheel/pinch zoom, category filters, hover and node inspector
- Existing scroll-controlled dependency graph and project-to-skill links
- Aurora layers, reactive mouse glow, ambient particles, cinematic noise/light treatment
- Magnetic CTAs, existing 3D card tilt, chip ripple, nav/scroll progress states
- Konami Code easter egg and five-click logo reaction
- Responsive and `prefers-reduced-motion` handling

## Architecture notes
- `src/app/page.tsx`: preserved page sections and integrated premium React components
- `src/components/HeroAnimated.tsx`: GSAP hero experience
- `src/components/SkillConstellation.tsx`: interactive canvas constellation
- `src/components/PremiumEffects.tsx`: Lenis and global atmospheric/micro interactions
- `src/components/LoadingScreen.tsx`: premium loader
- `src/app/ScriptLoader.tsx`: StrictMode-safe ordered loader for the preserved vanilla graph runtime
- `public/js/*`: existing graph/data/modal runtime; do not reorder without checking dependencies
- `public/css/styles.css`: original/base visual system
- `public/css/premium.css`: consolidated premium layer including constellation and hero styles

## Run
```bash
npm install
npm run dev
```

Production check:
```bash
npm run build
npm start
```

## Important
- Keep `tsconfig.json`; do not add `jsconfig.json` because Rocket detects this as Next.js + TypeScript.
- The hidden legacy boot node remains for runtime compatibility, while the visible experience uses the premium React loader.
- Do not initialize a second custom cursor/card-tilt loop; the preserved `main.js` already owns those transforms.
