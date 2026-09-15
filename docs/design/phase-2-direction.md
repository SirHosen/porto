# Phase 2 — Midnight Panel, inhabited

Gate 1 was approved by Hosen's “lanjutkan”. Scope: section integration and
regression checks only. Phase 3 motion polish and later gates remain closed.

## Visual system

Preserve the audited identity: ink #101010, paper #eeeade, vermilion #f24b3e,
muted #aba9a1, rule #353532. The six existing Skills category colors remain
verbatim accents within their domain; they do not become competing site themes.

Bebas Neue: oversized names and chapter titles. Space Grotesk: readable sentences.
JetBrains Mono: quiet indexes, tech tags, navigational coordinates. All local fonts.

## Spatial / page sketch

```
H.  hosea.dev                                   Static view   GitHub ↗
┌──────────────────── continuous WebGL world ────────────────────────┐
│  HOSEA.             ink architecture / a distant red moon          │
│       ↓ camera crosses the first panel                            │
│  LINUX AT HEART.                                                  │
│       ↓                                                           │
│   [01 NESTfetch] → [02 GameNest] → ... → [09 Aqila Atelier]         │
│   actual world anchors: approach, pass, retreat                    │
│       ↓                                                           │
│  MANY TOOLS. ONE MIND.   core | domains | verbatim tools & copy     │
│       ↓                                                           │
│  LET’S BUILD SOMETHING worth it.                    GitHub ↗       │
└───────────────────────────────────────────────────────────────────┘
    Hero     About     Projects     Skills     Contact        progress
```

No dashboard chrome, fake app screenshots, experience metrics, or decorative
skill percentages. Each project gets a restrained graphic emblem (an illustration,
not a product preview) and one editorial paper panel. Alternating spatial anchors
create gallery rhythm without rearranging content. The camera is still one curve.

Project labels are DOM billboards projected from real world-space anchors by the
same camera that renders their physical frames; CSS only presents that projection.
This is not a DOM-only scroll animation. Native text remains sharp and accessible.

The static / reduced-motion / no-JavaScript document contains all nine projects
and all six complete Skills domains. 3D is progressive enhancement, never a content
dependency. Existing archived/private projects stay high-level with no dead links.

## Content handling

All Skills data and descriptions are byte-for-byte string copies of the Phase 0
snapshot. Shared UI wording is retained, including “CHAPTER 02”, even though the
camera visits Skills after Projects, and “1 connected projects”. Existing touch
and static hints are used where applicable.

Project records are copied from assets/js/data.js. Only this portfolio's own tech
tags and one-line description are updated to the implementation now being built.
No invented accomplishments or details from unavailable chat sessions are added.
Name remains HOSEA as in the source; contact remains the existing GitHub profile.

## Craft / scope review

One signature: travelling through manga panels in a continuous ink city.
Type, silhouette, negative space, contrast and depth do the work. No new major
dependency, image generation, bloom, shadows, physics, or automatic ornament loops.
Single GSAP render clock and DPR 1 from the approved prototype are retained.
