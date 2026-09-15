# Transition Kit — phase roadmap

Status after this PR: **Phase 0, Phase 1, and Phase 2 are done.** Later phases are catalogued, not implemented.

| Phase | Job | Status |
|---|---|---|
| **0** | Architecture docs, feasibility, folder scaffold, catalog shape | **done** |
| **1** | Core engine + 6 UI Push plan generators + companion panel + tests | **done** |
| **2** | Full UI Push family (soft / snap / overshoot / parallax / fade / cover / panel / dashboard / split) | **done** |
| 3 | UI-Slide family | planned |
| 4 | Scale-Zoom family + JSX apply for `planTargetZoom` | planned |
| 5 | Crossfade family | planned |
| 6 | Mask-Reveal family (native masks, no plugins) | planned |
| 7 | Blur-Focus family | planned |
| 8 | Depth-Parallax family | planned |
| 9 | Overlay-Modal family | planned |
| 10 | Page-Screen family | planned |
| 11 | Wipe-Split family (soft mattes / native gradient wipe) | planned |
| 12 | Shared-Element family (bounds match, not mesh) | planned |
| 13 | Stagger-Cascade family (reuse `staggerReveal` numbers where they fit) | planned |
| 14 | Camera-Dolly family (plate push/pull — not a 3D camera rig) | planned |
| 15 | Glass-Frost family (native frost; no Liquid Glass binary) | planned |
| 16 | Hero family + apply `transitions/Examples/demo-storyboard.json` | planned |
| 17 | Micro family | planned |
| 18 | AI pairing (catalog → prompt map) + SFX metadata polish | planned |

## Phase 0 — done

- `docs/TRANSITION_KIT.md`
- This file
- `transitions/01_UI-Push/` … `16_Micro/` README stubs
- `transitions/Engine/`, `Expressions/`, `Metadata/`, `Examples/`, `Documentation/`

## Phase 1 — done

- `core/transitions/{easing,timing,target,control,engine,registry}.js`
- `transitions/Metadata/catalog.json` — unique `EVT_*` IDs, `implemented:true` on the six UI Pushes
- `ae/Evotechly Transitions.jsx` — search, duration group, direction, apply
- `tests/transitions-engine.test.js`
- Demo storyboard JSON (data only; apply is Phase 16)
- Hub one-line pointer. **v0.32 panel not edited.**

## Phase 2 — done

- `core/transitions/uiPush.js` — complete keyframe plans for every UI-Push catalog ID
- Added `EVT_UI_PUSH_PANEL` (Panel Push), `EVT_UI_PUSH_DASHBOARD` (Dashboard Push), `EVT_UI_PUSH_SPLIT` (Split Panel Push)
- Catalog names: UI Push Left/Right/Up/Down, UI Push + Scale, UI Push + Depth, Panel Push, Dashboard Push, Split Panel Push
- `implemented:true` on the full UI Push family (15 IDs)
- JSX mirrors apply math for every UI Push ID
- Tests: every UI Push ID produces a deterministic plan

## What “done” means later

A phase is done when:

1. Every ID in that family has a real `applyTransitionPlan` generator (not an empty stub).
2. Catalog `implemented` + `phase` match the engine.
3. JSX can apply those IDs with the same numbers.
4. Node tests cover determinism and axis / scale math.
5. No `.ffx` / `.aep` / vendor code.

## Out of scope for every phase

- Stubbing `ae/Evotechly Motion OS.jsx`
- Vendoring Motion Bro, AEJuice, Animation Composer, or Liquid Glass
- Fake binaries for CI
- Gaming / glitch / RGB / flare / explosion language
