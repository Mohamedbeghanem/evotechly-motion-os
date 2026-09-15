# Transition Kit — phase roadmap

Status after this PR: **Phase 0–4, Phase 6, Phase 9, Phase 10, Phase 12, and Phase 13 are done.** Mask-Reveal is the EvoCRM screenshot / card iris family (native AE masks, no plugins). Stagger-Cascade is the list/table-row family. Page-Screen is the IA family. Overlay-Modal is the dialog family. Shared-Element is the full bounds-match family (not mesh). Later phases are catalogued, not implemented. Charts / device plates are **P2b SaaS assets** (not a kit phase). Crossfade stays catalog-only — `PAGE_FADE` / `TAB_CROSS` already own dissolves. Highest-ROI kit leftover: **Micro** (Phase 17 chrome hover/press not already in P1 UI).

| Phase | Job | Status |
|---|---|---|
| **0** | Architecture docs, feasibility, folder scaffold, catalog shape | **done** |
| **1** | Core engine + 6 UI Push plan generators + companion panel + tests | **done** |
| **2** | Full UI Push family (soft / snap / overshoot / parallax / fade / cover / panel / dashboard / split) | **done** |
| **3** | UI-Slide card family (card / panel / drawer / sheet / stack / peek) | **done** |
| **4** | Scale-Zoom family + JSX apply for `planTargetZoom` + `EVT_SHARED_CARD` | **done** |
| 5 | Crossfade family | planned |
| **6** | Mask-Reveal family (native masks, no plugins) | **done** |
| 7 | Blur-Focus family | planned |
| 8 | Depth-Parallax family | planned |
| **9** | Overlay-Modal family (modal / sheet / dim / popover / toast) | **done** |
| **10** | Page-Screen family (page push / fade / screen swap / nav / tab) | **done** |
| 11 | Wipe-Split family (soft mattes / native gradient wipe) | planned |
| **12** | Shared-Element family (bounds match, not mesh) | **done** |
| **13** | Stagger-Cascade family (reuse `staggerReveal` numbers where they fit) | **done** |
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

## Phase 3 — done

- `core/transitions/uiSlide.js` — card-width (not full-frame) plans for every UI-Slide catalog ID
- `EVT_SLIDE_CARD_LEFT` / `CARD_RIGHT` / `PANEL_IN` / `PANEL_OUT` / `DRAWER` / `SHEET_UP` / `STACK` / `PEEK`
- Catalog `implemented:true` + `phase: 3` on the 8 IDs
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family

## Phase 4 — done

- `core/transitions/scaleZoom.js` — `EVT_ZOOM_IN` / `OUT` / `TARGET` / `MATCH` + `EVT_SCALE_POP` / `BREATHE` / `PUNCH` / `SETTLE`
- `core/transitions/sharedElement.js` — `EVT_SHARED_CARD` bounds-match (position + scale, not mesh)
- `planTargetZoom` + `planBoundsMorph` in `core/transitions/target.js`; JSX apply mirrors both
- Catalog `implemented:true` + names on the 8 Scale-Zoom IDs (`phase: 4`) and `EVT_SHARED_CARD` (`phase: 12`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags
- Remaining Shared-Element IDs (`SHARED_IMAGE`, `MATCH_CUT`, `MORPH_BOUNDS`, `HERO_TO_DETAIL`, `LIST_TO_DETAIL`) stay catalog-only — **superseded by Phase 12**

## Phase 12 — done

- `core/transitions/sharedElement.js` — full family: `EVT_SHARED_CARD` / `SHARED_IMAGE` / `MATCH_CUT` / `MORPH_BOUNDS` / `HERO_TO_DETAIL` / `LIST_TO_DETAIL`
- Position + independent scale via `planBoundsMorph`. No mesh warp
- EvoCRM paths: card → detail, list row → pane, marketing hero → app UI, image → gallery
- Catalog `implemented:true` + names on all 6 Shared-Element IDs (`phase: 12`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags, axis / scale math
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family

## Phase 6 — done

- `core/transitions/maskReveal.js` — `EVT_MASK_CIRCLE` / `MASK_RECT` / `MASK_SOFT_EDGE` / `MASK_EXPAND` / `REVEAL_IRIS` / `REVEAL_WIPE_SOFT`
- Native AE masks only (`ADBE Mask Offset` expansion + feather). Ellipse iris, rounded-rect card crop, wipe-from-bounds. No bounce / overshoot / plugins
- EvoCRM paths: screenshot iris, card crop reveal, soft matte, directional bounds wipe
- Catalog `implemented:true` + names on all 6 Mask-Reveal IDs (`phase: 6`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab (incoming gets the native mask)
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags, expansion / feather / wipe-shift math
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family. Crossfade stays catalog-only

## Phase 13 — done

- `core/transitions/staggerCascade.js` — `EVT_STAGGER_CARDS` / `STAGGER_LIST` / `CASCADE_IN` / `CASCADE_OUT` / `STAGGER_FADE` / `WAVE_SOFT`
- Reuses `saasDemo.STAGGER` offset (3f), travel (16px), and hold (0.2s). Wave uses a 4-frame soft delay. Fade is opacity-only. No bounce / overshoot
- EvoCRM paths: deal pipeline cards, contacts list, activity rows, tree / nav cascade
- Catalog `implemented:true` + names on all 6 Stagger-Cascade IDs (`phase: 13`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab (2+ selected rows, top = first)
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags, offset / travel / opacity-only math
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family. Crossfade stays catalog-only

## Phase 10 — done

- `core/transitions/pageScreen.js` — `EVT_PAGE_PUSH` / `PAGE_FADE` / `SCREEN_SWAP` / `NAV_FORWARD` / `NAV_BACK` / `TAB_CROSS`
- Full-page push reuses UI Push math. Fade is opacity-only (Scale-Zoom mid opacities). Screen swap keeps app chrome (UI-Slide card-width). Nav forward/back are directional IA. Tab cross is a quiet content fade
- EvoCRM paths: dashboard → page, stack forward/back, tab content
- Catalog `implemented:true` + names on all 6 Page-Screen IDs (`phase: 10`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags, push / fade / chrome-stay math
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family

## Phase 9 — done

- `core/transitions/overlayModal.js` — `EVT_MODAL_IN` / `MODAL_OUT` / `SHEET_UP` / `SHEET_DOWN` / `OVERLAY_DIM` / `POPOVER_IN` / `TOAST_IN`
- Dim plate + scale/opacity present. Sheet reuses UI-Slide sheet math. Popover is target-aware (`planBoundsMorph`)
- EvoCRM paths: dialog, bottom sheet, dimmer, popover from a control, toast from the edge
- Catalog `implemented:true` + names on all 7 Overlay-Modal IDs (`phase: 9`)
- JSX mirrors apply math in `ae/Evotechly Transitions.jsx` Transitions tab
- Registry: native `sourceType` rows, `commercialUse: true`
- Tests: deterministic plans, unique IDs, implemented flags, dim / sheet / popover math
- Charts / device plates are **P2b owned** (`core/assets/chartsDevices.js` + Charts tab) — not a Transition Kit family

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
