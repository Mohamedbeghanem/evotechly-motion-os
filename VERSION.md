# Evotechly Motion OS

Panel build: **v0.32** (P0–P23) on main — `ae/Evotechly Motion OS.jsx` (~297 KB Reliability).

## P0 — unify shell (companion hub)

Home / SaaS / Kit Hub live on **Window → SaaS Demo Tools / Motion OS Hub** (`ae/SaaS Demo Tools.jsx`). Seed on Home. SaaS engines: cursor (P1d styles), depth, stagger, **UI presets (P1a)**, carousel, glass, wipe, hover. Kit Hub = official URLs only (`core/kitHub.js`) — copy / alert, never download. Does **not** replace or stub v0.32. Main-panel tab fold deferred.

## Kit matrix — P1 high-ROI gaps

From [docs/KIT_CAPABILITY_MATRIX.md](docs/KIT_CAPABILITY_MATRIX.md). P0 Hub is shipped above. Phase 1–3 SaaS Demo / seed stay shipped below.

| ID | Job | Status | Native | Apply in AE |
|---|---|---|---|---|
| P1a | UI Animator–class preset pack + mirror | **shipped on main** | `core/uiPresets.js` | Hub **Apply UI Preset** |
| P1b | Flowing / coloured text reveal | open | — | — |
| **P1c** | Caption keyword color + in/out preset row | **this PR** | `core/captionStyle.js` | **Window → Caption Style Tools** (separate companion — not a Hub tab). Captions tab still places live text / SRT. |
| P1d | Cursor styles (pointer / hand / I-beam) | **shipped on main** | `createCursor({ style })` | Hub SaaS **Style** dropdown |

P1c owns the Meow keyword-color + Presetify in/out jobs **without their code**. Native text animators: `colorKeywords`, `captionInOut` (`fade` / `scale` / `slideUp` / `typewriter` / `blur`). No ElevenLabs. How-to: [docs/CAPTION_STYLE.md](docs/CAPTION_STYLE.md).

## Phase 3 — editor-ready golden project seed

No `.aep` binary (AE cannot run in CI). `ae/Seed Golden Project.jsx` builds `00_HOME`, `ERP_DEMO`, `TALKING_HEAD`, `REEL_9x16` when the editor runs it. Idempotent. Shy `EVO_GOLDEN_META` on Home. One-page path: `docs/QUICK_START.md`. Helpers: `core/goldenProject.js`. SaaS Demo Tools has a Seed button. Does not replace v0.32.

## Phase 2 — native glass, gradient wipe, proximity hover

Own Solair-class FX. No third-party binaries. Liquid Glass remains an optional external pack for personal use only — not redistributed.

- `core/saasDemoFx.js` — `glassPanel`, `gradientWipeReveal`, `proximityHover` (re-exported from `core/saasDemo.js`)
- `ae/SaaS Demo Tools.jsx` — Glass Panel, Gradient Wipe, Proximity Hover buttons
- Tests in `tests/saas-demo.test.js`. Phase 1 APIs unchanged.

## Phase 1d — native cursor styles

Shape-layer cursor styles on `createCursor`: `pointer` (default / arrow), `hand`, `ibeam`. Deterministic path descriptors in `CURSOR.styles` / `CURSOR.shape.style`. Motion OS Hub **SaaS** panel has a **Style** dropdown before **Cursor + click**. Home / Kit Hub unchanged. No PNG pack. No CursorKit. Existing plans without `style` stay pointer. Does not rewrite the 297 KB v0.32 panel.

## Phase 1 — Solair-class SaaS Demo Kit (own code)

Own SaaS Demo tools + Editor Free Kit docs. Not a Solair port. Companions stay external.

- `core/saasDemo.js` — `createCursor`, `depthReveal`, `staggerReveal`, `carouselSetup`
- `ae/SaaS Demo Tools.jsx` — Window panel; does not replace v0.32
- `docs/SAAS_DEMO_KIT.md` + `docs/EDITOR_FREE_KIT.md`

## Phase 1a — UI Preset Pack (own)

Native UI Animator Pro–class presets (in / out / both + optional mirror). Capability extract only — no vendor code.

- `core/uiPresets.js` — `applyUiPreset({ layers, presetId, direction, duration, staggerFrames, ease, mirror })`
- Built-ins: `fade-up`, `fade-scale`, `slide-left`, `slide-right`, `slide-up`, `pop` (90→100)
- `ae/SaaS Demo Tools.jsx` — dropdown + **Apply UI Preset** (does not replace v0.32)
- `tests/ui-presets.test.js` — timing / math
- `docs/KIT_CAPABILITY_MATRIX.md` — P1a **own**

Do not tag v2.0.0. AE soak is UNKNOWN. See V2_RELEASE_GATE.md.

Kit capability research matrix landed (research-before-build).

**v0.32.0-rc packaging:** full zip must include the main panel **and** `ae/SaaS Demo Tools.jsx` (Motion OS Hub) **and** `ae/Seed Golden Project.jsx` **and** `ae/Caption Style Tools.jsx` (P1c). Checklists: [docs/SOAK_CHECKLIST.md](docs/SOAK_CHECKLIST.md), [docs/RELEASE_ZIP_CHECKLIST.md](docs/RELEASE_ZIP_CHECKLIST.md).
