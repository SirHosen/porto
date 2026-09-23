# Phase 3 direction — 2026-09-16

Historical direction. The city/card composition below was superseded by
[the spatial redesign](phase-3-spatial-direction.md) after the user's September 23 feedback.

The user's latest “lanjutkan” approves Phase 3 and explicitly requests richer panels, project technology logos, useful interaction instead of the orbit crystal, natural About copy, removal of the Midnight Panel label, and appropriate motion. Stop at Gate 3 for confirmation; no Lighthouse/deployment phase yet.

## Before-code design plan

Preserve the established palette: Ink `#101010`, Paper `#eeeade`, Red `#f24b3e`, Muted `#aba9a1`, Rule `#353532`, Slate `#83b9b4`. Existing six domain colors remain unchanged. Ink is the environment, paper holds project content, red guides interaction and the spatial frames; slate is a secondary material color, not another competing UI accent.

Keep the existing local fonts. Bebas Neue: name and project titles. Space Grotesk: all reading/interface text. JetBrains Mono: only the existing frozen skill labels and meaningful project sequence/readout. No new font download.

One continuous city/camera path remains the signature. Projects become illustrated technical plates suspended in that space: full-width, material-like SVG compositions depicting each project's known subject, with a paper reading surface, compact icon rail, and unambiguous source/navigation controls. The illustrations are abstract artwork, not invented product screenshots, charts, metrics, or feature claims. Text aligns left; project sequence aligns right. About becomes a direct introduction, not a Linux slogan.

```text
PROJECT WAYPOINT                     SKILLS WAYPOINT
+----------------------------+       +-------------------------------------------+
| subject-specific artwork   |       | Many tools. One mind. / preserved intro   |
| layers / ink / depth    01 |       +----------+----------------+---------------+
+----------------------------+       | domains  | verbatim copy  | related work  |
| NESTfetch                  |       |          | skill buttons  | real projects |
| one existing tagline       |       |          |                | → waypoint    |
| [logo][logo][icon][logo]    |       +----------+----------------+---------------+
| archived       source info |       | frozen skills footer                      |
| previous       01/09  next |       +-------------------------------------------+
+----------------------------+
```

Mobile keeps one centered project and compact artwork. Skills domains form two columns; the proof list sits below the preserved copy. Short screens can scroll the panel's real content; there is no decorative drag surface or instruction to interact with an object that does nothing.

## Review and revision before implementation

A red/black UI and hairline frames can easily become a generic generated dashboard. Those colors/fonts are explicitly inherited, so do not replace the identity. Instead remove invented brand chrome, arbitrary symbols, decorative core controls, gratuitous all-caps labels outside the frozen Skills content, and repeated outline-word emphasis. Spend the visual complexity on nine subject-specific illustrations, not a universal card garnish. The numbering is legitimate here: nine actual projects in a camera-path sequence.

Motion must explain an action: camera travel, a subtle actual camera offset responding to a fine pointer, skill selection updating related projects, logo name disclosure, and source/navigation feedback. No continuously spinning decoration, per-section fade-up preset, postprocessing, shadows, physics, or extra animation dependency. Reduced-motion/manual-static modes remove camera and entrance movement entirely.

## Content exceptions and provenance

Preserve all 45 skill names, six domain names, six descriptions, category counts, and existing shared Skills copy exactly. The user's explicit replacement of the orbit authorizes removing only its specific UI: CAPABILITY CORE, 創造, orbit/scroll instructions, RESET, and decorative domain-code badge. Preserve the Phase 0 snapshot and historical Phase 2 evidence unchanged; test the new implementation against the original wording, with this documented UI exception.

Rename the self-project's display name to “This portfolio” in the typed adapter, not the frozen source. Remove Midnight Panel from current public page/header/metadata, not historical audit records or legacy user-owned files. About draws only from the existing roles and the user's Linux-native statement. Project-to-skill connections use existing `deps` only; no new achievements, technologies, metrics, or claims are inferred.

Use locally vendored, provenance-documented brand SVGs for actual products. Non-brand concepts (Async, Testing, Auth, etc.) receive functional glyphs, never another product's logo. Every icon has an accessible name and hover/focus/touch disclosure. No new major dependency.
