# Phase 3 — spatial redesign and motion / Gate 3

Status: implemented and ready for Gate 3 review. **Wait for explicit confirmation
before Phase 4.** No push, hosting changes, Lighthouse pass or deployment.

## Review

- [Full scroll-through](evidence/phase-3/camera-scroll.mp4), 1280 × 800, 30 fps video.
- [Desktop hero](evidence/phase-3/desktop-00-hero.png).
- [Desktop project](evidence/phase-3/desktop-02-p-nestfetch.png).
- [Mobile project](evidence/phase-3/mobile-08-p-sessionlab.png).
- [Skills](evidence/phase-3/desktop-11-arsenal.png).
- [Search](evidence/phase-3/project-index.png) and [inspector](evidence/phase-3/project-inspector.png).
- [Short-screen detail scroll](evidence/phase-3/short-project-scrolled.png).
- [Evidence directory](evidence/phase-3/) includes every desktop/mobile waypoint,
  six Skills panels, fallbacks, modal states and short-screen checks.
- Preview: http://127.0.0.1:4175/porto/ (`npm run preview` after `npm run build`).

## What changed

The approved **continuous, arc-length camera path** remains on both desktop and
mobile. No discrete-scene fallback was used. Real geometry, world-space placement
and camera movement produce depth; nearby objects move differently from distant
architecture. Fine-pointer parallax moves the actual camera. Scroll changes the
sculptures' orientation. Rendering suspends when input settles.

The former city/cards shell is replaced by an original mechanical gallery: layered
H, workstation, storage trays, catalogue surfaces, learning lattice, audio record,
waveform, form stages, browser sessions, nested frames and inventory modules.
Rounded geometry, locally generated studio reflections and restrained material
colors give the work a consistent visual language. No imported models, remote HDR,
postprocessing, realtime shadow maps or new major dependency.

The user's existing detailed blueprint artwork survives in the inspector and
static reading mode. Confirmed illustrative throughput/cache/backtest numbers are
removed as performance claims. Sculptures and diagrams are explicitly conceptual,
not product screenshots or evidence of results.

All nine projects remain. Project stacks use local technology marks and named
functional glyphs, with keyboard/touch-accessible disclosures. The former crystal
orbit is removed. Skills now filter actual linked projects using existing dependency
records. Project search supports technology/skill queries, source filters, keyboard
navigation, Ctrl/⌘ K and an accessible native modal. Escape and focus restoration
are tested.

45 Skills names, six domain descriptions and preserved headings/panel content
remain verbatim. Original content JSON and Phase 0 snapshots are unchanged.
About remains factual; Linux is an environment fact, not a slogan. User metadata,
blueprint compositions and the 0.42 s pointer-settle choice were retained. Legacy
user-owned files were not edited or staged as part of this phase.

## Reference and visual critique

[Igloo](https://www.igloo.inc/) was opened and rendered directly; local
`/home/hosea/Projects/001/porto-bahan` was audited for scene/camera/warmup techniques.
The user's clarification is explicit: **do not adopt that reference's design**.
No personal textures, artwork, copy or code were taken from the local reference.
Its README excludes personal assets from reuse.

The frontend-design process produced the documented
[spatial direction](../design/phase-3-spatial-direction.md): retained local fonts,
ink/paper identity, original mechanical objects and quiet framing. Screenshot
critique led to stronger separation between nearby/far exhibits, bounded object
sizes, studio reflections, corrected Sonorus tonearm connections, distinct browser
session geometry, and a dedicated short-screen details scroller with visible
project navigation. Earlier design notes remain as explicitly superseded history.
[Technology asset provenance](../design/technology-icons.md) is recorded separately.

## Verification

Production static export, TypeScript, frozen-content checks and 2,002 curve samples
pass. Chromium browser suites pass:

- 13 portfolio check groups: 13 stops, nine projects, all 45 Skills connections,
  six domains, logos/disclosures, section/project navigation, pointer/touch/wheel,
  320/390/768/1440 layouts, idle rendering, teardown/remount, OS reduced-motion,
  context loss, no WebGL, no JavaScript and no failed assets/runtime errors.
- Five explorer groups: focus containment/return, Escape, search, source filters,
  all nine inspectors, native diagram panning and reduced-motion/touch behavior.
- Two short-screen groups: complete hero/About/contact at 320 × 568; native detail
  scrolling without moving the scene, visible next/previous controls.
- 13 shared prototype regression groups.
- Zero automated WCAG A/AA violations across 11 portfolio/explorer states.
  Automated checks do not replace manual assistive-technology or physical-device QA.

The current build supersedes an earlier interrupted multi-browser test run. Its
partial report was not counted as a pass. Final authoritative reports are archived
with the source hashes in [the manifest](evidence/phase-3/manifest.json).

### Render pacing

[Raw benchmark](evidence/phase-3/benchmark.json): Chrome 153.0.8010.52, Linux,
Intel Core i3-1115G4 (2 cores / 4 threads), hardware Mesa Intel UHD TGL GT2.
Canvas DPR 1. Separate from recording; 12-second complete linear scroll per run.

| Profile | Mean fps | p95 frame | Worst frame | Frames >33.4 ms |
| --- | ---: | ---: | ---: | ---: |
| Desktop 1440 × 900, 1× CPU | 60.00 | 17.5 ms | 18.8 ms | 0 |
| Mobile 390 × 844, 4× CPU, run 1 | 60.00 | 17.6 ms | 19.1 ms | 0 |
| Mobile 390 × 844, 4× CPU, run 2 | 60.01 | 17.7 ms | 19.1 ms | 0 |
| Mobile 390 × 844, 4× CPU, run 3 | 59.93 | 18.1 ms | 43.1 ms | 1 |

All runs meet the unchanged nominal budget: mean ≥59 fps, p95 ≤18.5 ms,
slow-frame fraction ≤1%. The third run contains one long frame; **this is not a
locked-60 claim**. No outlier or failed run was discarded to improve the results.
These are render-callback intervals on a disclosed host, not display presentation
timings, physical-phone measurements or mobile-GPU certification. The 30 fps
review video is not the 60 fps benchmark. Investigate remaining long-frame risk
during the explicitly approved next performance phase.

At the thirteen stops the scene stays within the existing test budget of ≤10 draw
calls and <10,000 triangles. Materials/geometry are shared/merged, the studio map
is generated once at 128 resolution, and no scene-state React update runs per frame.
Draco is not applicable to original procedural geometry.

## Remaining gates

Gate 3 requires Hosen's review/confirmation. Phase 4 then measures Lighthouse
mobile/desktop before/after (target ≥90, LCP <2.5 s; stop below 85). No scores are
invented here. Physical iPhone Safari/Android Chrome and desktop Firefox belong
to Phase 5; no physical-device passes are claimed. Phase 6 deployment remains
unauthorized. Existing GitHub Pages publishing has not changed.

[NEED CONTENT] if desired later: real measured project metrics, additional projects
not present in the repository, an email/contact-form destination, or a change from
the existing public name Hosea to Hosen. None was fabricated.
