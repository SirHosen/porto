# Phase 0 — portfolio audit / Gate 0

Date: 2026-09-15. Repository: `/home/hosea/Projects/001/porto`.

**Status: audit complete; Gate 0 awaits Hosen's explicit confirmation. No application code, dependencies, deployment settings, or production content changed.**

## Findings

- Current local site: **Midnight Panel**, a single-page HTML/CSS/JavaScript site, with no React or build framework. React Three Fiber cannot be dropped into its existing module architecture without adding React and a bundler.
- The hero moves a raster image with CSS; only the Skills crystal uses actual 3D. There is no scroll-driven world-space camera path.
- **45 skills in 6 domains**, all six description paragraphs, headings, interaction hints, and connected-project labels are preserved verbatim in [the readable snapshot](skills-verbatim.md) and [the complete machine-readable snapshot](skills-verbatim.json).
- The working tree already contains an uncommitted redesign. It is the content/identity baseline, not Git HEAD. Audit-only files are committed separately; those existing changes remain untouched.
- GitHub Pages is the existing host: [sirhosen.github.io/porto](https://sirhosen.github.io/porto/). The Pages API confirms legacy branch publishing from `main:/`, no custom domain. The live page is still **HOSEA // System**, displaying **42 skills**; it does not yet contain the local Midnight Panel redesign.

## Scope and stack

All 27 first-party source, config, documentation, license, and asset files were inspected: every text file read fully, the WebP viewed, binary font metadata inspected, and every file hashed. Third-party `node_modules`, generated `test-results`, and Git objects were excluded from source reading. [The manifest](baseline-manifest.json) records exact sizes and SHA-256 hashes, plus deploy/browser evidence.

| Area | Current implementation |
| --- | --- |
| Runtime | Native ES modules; handwritten CSS; WebGL 1 / GLSL; Canvas 2D; Web Audio; Web Animations |
| Entry points | `index.html` → `midnight.css` and `midnight.js` → `data.js`, `core.js`, `sfx.js` |
| Legacy implementation | `system.css`, `app.js`, `background.js`, `graph.js`, `icons.js`, `logos.js`; not loaded by the current local page |
| Dependencies | No runtime dependencies. Dev: Playwright 1.58.2, @axe-core/playwright 4.13.0 |
| Commands | Python static dev server; Node verification/accessibility scripts; no application build/lint pipeline |
| Structure | Hero → Projects → Skills / Arsenal → About → Contact; anchor navigation and a project dialog, no backend |

Nine existing projects remain in scope: NESTfetch; GameNest; Spinwheel AI Lab; Sonorus; SonicCipher; Adaptive Form QA; Browser Session Reliability Lab; This System / Midnight Panel; Aqila Atelier. Private/archive labels and provenance must remain accurate. No removed repository is needed or reconstructed.

## Identity and assets to retain

| Asset / token | Inventory |
| --- | --- |
| Base palette | Ink `#101010`, paper `#eeeade`, vermilion `#f24b3e`, muted `#aba9a1`, rule `#353532` |
| Display type | Local Bebas Neue TTF, 56,136 bytes |
| Body type | Local Space Grotesk TTF, 69,360 bytes |
| Utility type | Local JetBrains Mono TTF, 112,172 bytes |
| Supporting type | Existing system serif / Japanese fallbacks; bundled fonts have OFL license files |
| Hero artwork | `midnight-city.webp`, 1672 × 941, 228,068 bytes: anime city, red moon, rooftop silhouette |
| Icons | H-mark SVG favicon; legacy inline SVG logo/category maps, no runtime icon library |
| Other visuals | CSS-built concept project previews, not product screenshots; procedural 3D crystal/rings; synthesized audio |
| 3D imports | No GLB/GLTF, HDR, or imported model assets. Draco is not applicable to current procedural geometry |

## Smallest viable migration — proposed, not executed

1. Keep this repository, all existing records, local fonts, artwork, and GitHub Pages hosting. Add **Next.js App Router + TypeScript + Tailwind**, with a small client boundary for **React Three Fiber + drei + GSAP/ScrollTrigger + Lenis**. Three.js and React/React DOM are the necessary underlying packages, not alternative engines.
2. Use `output: 'export'`, a production `basePath: '/porto'`, and static-compatible asset URLs. Next supports App Router static export; server-only features and its default server image optimizer are not suitable for this target. Use the already optimized local assets. [Next.js static-export documentation](https://nextjs.org/docs/app/guides/static-exports).
3. Phase 1 gets an isolated procedural camera prototype, no real content integration yet. Preserve the current source beside it until Phase 2. Pair React and Fiber majors correctly (React 19 / Fiber 9 is a documented pairing); resolve compatible versions before installation. [React Three Fiber compatibility](https://github.com/pmndrs/react-three-fiber#readme).
4. Phase 2 ports existing data into typed, side-effect-free content with equality checks against the frozen Skills snapshot. Build-time HTML supplies readable content and keyboard navigation; a lazy client canvas supplies depth. Reduced-motion / no-WebGL users receive the complete static page, without camera travel or smooth-scroll hijacking.
5. Phase 6 changes the Pages publishing pipeline to deploy the exported `out/` artifact, preferably through GitHub Actions, only after its gate approval. No push or hosting configuration change occurs now.

The absolute-smallest technical addition would be a React island with a bundler, but it would deviate from the requested default stack. The in-repo Next.js migration above is recommended instead; it needs Gate 0 approval.

## Proposed creative direction

**Midnight Panel, made spatial:** enter the existing red-moon world, then travel between physical, ink-edged architectural panels. Camera movement reveals actual depth; typography and project information remain legible DOM content associated with each waypoint. Left-align reading content; keep the navigation quiet. No new palette or font family is proposed.

```text
Hero → About → Projects: 9 separate waypoints → Skills → Contact
       one continuous camera path through foreground / middle / distant geometry
```

Brief review: a rotating crystal beside flat cards would repeat the current limitation. The signature must be the camera journey, not independent reveal effects. Preserve the anime/comic identity through silhouette, framing, negative space, and cel-like surfaces; avoid an unrelated sci-fi dashboard. This is a direction to prototype, not a claim of finished visual quality.

Reference sites were opened: [Bruno Simon](https://bruno-simon.com/), [Active Theory](https://activetheory.net/), [Lusion](https://lusion.co/), [Jordan Breton](https://jordan-breton.com/), [Little Workshop](https://www.littleworkshop.fr/). Text-only browsing does not reproduce their interactive rendering (Active Theory requires JavaScript); the supplied descriptions guide atmosphere and pacing. No reference was used as a template or benchmark result.

## Risks and unverified gates

- **Performance remains unmeasured for the new scene.** Phase 1 must record scrolling and frame timing at 4× CPU slowdown, with the exact viewport/device profile, browser, and GPU renderer disclosed. A software-rendered headless run is not proof of mid-range mobile GPU performance. Do not pass a stuttering prototype.
- Current crystal initialization is eager, including reduced-motion mode. Current source has no React lifecycle cleanup. Migration must isolate browser APIs, dispose GPU/observer/listener resources, avoid duplicate scroll/render loops, cap pixel density and pause inactive rendering.
- Current project/Skills content is JS-injected. The no-JS page is incomplete. Static HTML must remain usable independently of WebGL. Continuous motion is the default; only the specified discrete-3D fallback is acceptable for mobile performance, explicitly reported at Gate 3.
- Phase 4 needs mobile/desktop Lighthouse before/after (target ≥90, stop below 85; LCP <2.5 s). Lighthouse measurement tooling is a proposed development-only addition outside the runtime stack, to be flagged before installation. No scores are claimed here.
- Current tests cover Chromium viewport cases, reduced motion and WebGL failure—not physical iPhone Safari, Android Chrome, or Firefox. Real device access is **[NEED CONTENT]** for physical-device QA; emulation will be labeled as emulation, never a device pass.
- Public spelling is currently **HOSEA / Hosea**; the brief says **Hosen**. **[NEED CONTENT]** if the public name should change; otherwise preserve it. Additional chat-only projects not recorded in this repo: **[NEED CONTENT]**. Email/contact-form destination: **[NEED CONTENT]** only if adding one; the existing GitHub contact works.
- Existing Skills copy includes `CHAPTER 02` and `1 connected projects`. Preserve both unless explicitly released from the verbatim rule; section reordering is not permission to silently fix the text.

## Checks completed and stop condition

Chrome with reduced motion rendered all six skill domains at 1440 × 1000; all text was captured directly from the DOM. No page errors were observed. A 390 × 844 viewport check found no horizontal document overflow. These are narrow audit checks, not a full test-suite run, Lighthouse pass, FPS result, or cross-device certification.

Gate 0 decision requested: approve the in-repo Next.js static-export migration and the preserved Midnight Panel direction. Stop here until explicit confirmation; no Phase 1 code has been written.
