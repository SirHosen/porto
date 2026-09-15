# Phase 1 — scroll-driven camera prototype

Date: 2026-09-15. Gate 0 was approved by the user's “lanjut”. **Phase 1 implementation and its measured prototype checks are complete; Gate 1 awaits explicit visual approval. Phase 2 has not started.**

## Review

- Local production preview: [open the prototype](http://127.0.0.1:4175/porto/prototype/).
- [Full scroll recording](evidence/phase-1-camera.mp4): 17.47 s, 1280 × 800, H.264, **30 fps encoded**. This is a screen recording for visual review, not the 60 fps measurement.
- [Desktop frame](evidence/phase-1-desktop.png) and [mobile frame](evidence/phase-1-mobile.png).
- [Measurement evidence, raw frame intervals, test results, previous attempts and source hashes](phase-1-evidence.json).

This is intentionally a geometry prototype: no personal intro, project records, or Skills have been integrated. The current `index.html`, all original application code/assets, 45 Skills and six domain descriptions remain byte-for-byte unchanged. Only package/build configuration changed within the old baseline.

## Implemented

The approved stack is in the same repo: Next.js 16.3.5 App Router, TypeScript, Tailwind, React 19.2.8, Fiber 9.7.0, drei, GSAP/ScrollTrigger and Lenis. React 19.3 was not used because the installed Fiber peer range excludes it. Export remains static with `basePath: "/porto"`; no server feature or new host is required. No production push, deployment or Pages setting change was made.

One Catmull–Rom camera curve travels from `[0, 3.3, 18]` to `[0, 4.6, -110]`. It moves and turns in actual world space, with arc-length sampling through five unlabelled content stops. Frames, slabs, distant silhouettes and the red disc are static geometry at different depths. Camera movement creates the changing projection; there are no section-by-section camera cuts.

```text
Native scroll / Lenis
        ↓
GSAP ScrollTrigger → normalized path position
        ↓
One GSAP clock → camera position + look direction → R3F render
                       only when a frame is dirty
```

R3F uses `frameloop="never"` with explicit `advance()`, so it does not schedule a second render RAF. Idle geometry does not redraw. CPU work updates only the intro opacity, progress line and changed labels—not an inherited CSS variable across the whole document. The scene uses **3 draw calls / 1,662 triangles**, MSAA, and **DPR 1**. It has no texture/model requests, postprocessing, shadows or physics. Draco is not applicable.

Reduced-motion preference is checked before loading the 3D module. Static mode has five readable HTML sections and static SVG sketches, not slowed camera travel. No-JS, no-WebGL, manual static mode and live context loss all retain usable content. Listeners, Lenis, triggers and rendering resources are released on unmount.

## Visual direction and critique

The frontend-design skill guided retention of the established identity: ink `#101010`, paper `#eeeade`, vermilion `#f24b3e`, muted `#aba9a1`, rule `#353532`; existing Bebas Neue display, Space Grotesk body and JetBrains Mono utility fonts.

The camera travels through panel-like architecture toward a red moon; quiet navigation stays outside the scene. Reading copy is left-aligned. This prototype proves scale, occlusion and travel, not final anime assets or award-level finish. Screenshot review led to smaller intro type and a local contrast scrim so white geometry does not erase the text. The bold element is the spatial journey, not a dashboard overlay.

## Gate 1 benchmark

Production static export, Chrome **153.0.8010.36**, Linux, Intel **Core i3-1115G4**, hardware **ANGLE / Mesa Intel UHD Graphics (TGL GT2), OpenGL ES 3.2**. Mobile profile: **390 × 844**, touch/mobile emulation, device scale 2, actual canvas DPR 1, **CDP CPU slowdown 4×**. Desktop: 1440 × 900, CPU 1×. No video encoder ran during the measured benchmark.

Each run measures WebGL render callback intervals during a full 12-second linear Lenis scroll after material warm-up. These are render-loop delivery readings, not display-presentation timestamps. The internal nominal-60 check requires mean ≥59 fps, p95 ≤18.5 ms, and at most 1% intervals above 33.4 ms; the unrounded readings are included.

| Final verification | Mean render FPS | p95 interval | Max interval | Intervals >33.4 ms |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 60.00 | 16.90 ms | 18.20 ms | 0 |
| Mobile 4× / run 1 | 60.01 | 17.40 ms | 18.30 ms | 0 |
| Mobile 4× / run 2 | 60.00 | 17.40 ms | 18.00 ms | 0 |
| Mobile 4× / run 3 | 60.00 | 17.40 ms | 24.40 ms | 0 |

All three mobile runs meet the checks. The scene remains continuous; no discrete-scenes fallback was used.

Earlier failures are retained in the evidence: the first two-RAF implementation rendered at ~30 fps. A single clock restored ~60 but mobile timing was uneven. Localized style updates and DPR 1 removed the remaining missed intervals. An initial DPR-1 run still missed the conservative p95 threshold by 0.2 ms, so it was not called a pass; the final repeat met all thresholds.

**Limits:** CPU throttling and viewport emulation do not turn the Intel GPU into a phone GPU. These results do not certify physical Android or iPhone Safari, cold-load performance, or every device. Hardware QA stays at Phase 5. Lighthouse/LCP and production-site performance remain unmeasured here; Phase 4 and Phase 6 are not claimed complete.

## Verification

TypeScript check, static build and content preservation check passed. Runtime dependency audit reported zero known vulnerabilities at the time of this check.

A development/Strict Mode smoke check also reached the midpoint with exactly one active trigger and no uncaught errors. Development logs include an upstream Three.js `Clock` deprecation warning from Fiber's internal clock; it was not suppressed. The currently pinned combination builds and passes the prototype checks.

The browser suite passed all 13 groups: continuous/reversible travel; real wheel binding; idle render suppression; anchor and keyboard navigation; 320–1440 px layout and axe WCAG A/AA checks; static/remount cleanup; runtime OS motion changes; reduced-motion first load; no-JS content; emulated touch sequences; live WebGL context loss; unavailable WebGL; no uncaught errors or failed requests. The high-level Chrome synthetic-scroll helper did not generate touch scrolling in this environment; explicit touch-start/move/end injection was used and verified instead. This is emulation, not device QA.

The MP4 contains 949 captured Chrome screen frames, resampled to 524 encoded frames at 30 fps. System FFmpeg was used because the Playwright-bundled recorder did not produce a usable file in this environment. Sampled frames and the video metadata were inspected. Recording and benchmarking are separate runs.

## Reproduce locally

```sh
npm ci
npm run build
npm run preview
```

In another terminal:

```sh
npm run typecheck
npm run test:content
npm run test:prototype
npm run test:camera-benchmark
npm run test:camera-record
```

The browser tools use installed Chrome at `/opt/google/chrome/chrome`; override with `PORTFOLIO_CHROME_PATH`. Video uses system `ffmpeg`, overridable with `PORTFOLIO_FFMPEG_PATH`. `PORTFOLIO_PROTOTYPE_URL` overrides the preview URL. `PORTFOLIO_RENDERER=software` is diagnostic only and cannot pass the hardware benchmark.

Development: `npm run dev` → `http://127.0.0.1:3000/porto/prototype/`. Existing static site: `npm run dev:legacy` → `http://127.0.0.1:4173/`. Existing legacy tests are unchanged.

The Phase 1 commit is scoped to the new prototype/build/testing/evidence files plus the unchanged local fonts and licenses required to build it. The pre-existing uncommitted legacy redesign is not swept into this commit. The preservation test compares against that current-workspace audit baseline.

**Stop at Gate 1.** Review the recording/prototype before approving real section integration. Do not treat earlier “continue” messages, sent before this Gate 1 report, as approval to enter Phase 2.
