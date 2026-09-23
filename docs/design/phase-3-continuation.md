# Phase 3 continuation — 2026-09-22

Historical continuation. Blueprint preservation and inspection still apply;
the visual shell is now defined by [the spatial redesign](phase-3-spatial-direction.md).

## Preserve the user's continuation

The user has extended the project artwork into technical blueprint plates, added systems/networking About content, refined pointer settling to 0.42 s, and expanded metadata. These are the starting point, not changes to roll back. The before-state of the overlapping files was copied to `/tmp/porto-polish-YAgOQW/before/` before editing. Legacy user-owned files remain untouched.

The user explicitly confirmed that throughput, cache-hit and backtest numbers in the artwork are illustrative, not measurements. Remove those numerical claims and label the artwork “Concept schematic.” No placeholder performance data is published. Missing measurements remain [NEED CONTENT] in the audit, not fabricated UI stats.

## Before-code plan and review

Palette: Ink #101010, Paper #eeeade, Vermilion #f24b3e, Steel #83b9b4, Muted #aba9a1, Rule #353532. Retain the established six Skills domain colors separately.

Typography: Bebas Neue for the identity and work titles; Space Grotesk for readable controls and descriptions; existing JetBrains Mono for diagrams and keyboard shortcuts. No extra fonts. Increase diagram legibility by giving it a real inspection surface rather than cramming more text into the preview.

Layout: keep the continuous 13-stop camera path and asymmetrical project placement. Give each plate a clear inspection action, backed by a native modal with a full-size schematic, source/status and waypoint action. Add a searchable project directory accessible from the header, hero, footer and Ctrl/⌘ K. Reading surfaces and results align left.

```text
PROJECT WAYPOINT                   PROJECT INDEX / INSPECTOR
+---------------------------+      +-----------------------------------------+
| project type       01/09  |      | Project index                  Close × |
| user's blueprint artwork |      | Search work or technology       Ctrl K |
| Concept schematic   [+]  |      | All work / Public source / Archives    |
| title / one tagline       |      | 01  NESTfetch       Archived      ↗ [+]|
| technology logos          |      | 02  GameNest        Archived      ↗ [+]|
| status       source link |      +-----------------------------------------+
| previous            next |      | Inspect: large blueprint + real source |
+---------------------------+      +-----------------------------------------+
```

Mobile uses the same real actions and touch-sized controls. A native dialog provides focus containment and Escape dismissal. Static/reduced-motion/no-JS users retain all projects and all 45 Skills; JS-only affordances appear only after hydration.

Review: a terminal shell with invented telemetry would be a generic IT costume. Do not add it. The distinctive behavior is the connection from searchable, factual project data to a spatial waypoint and an inspectable blueprint. Preserve the user's blueprint geometry, remove unverified implementation details/measurement claims, and compress About's three paragraphs into existing discipline facts. Keep the subject-specific drawing language; no new visual brand or dependencies.

Motion: retain real camera parallax and the user's faster pointer settling. Short action-response transitions only; no endless “live” dashboards. The modal search must not cause root React renders or 3D work on each keystroke. Gate 3 requires a new full-scroll recording and the same CPU-4× benchmark thresholds. No Lighthouse/deployment until later gate approval.
