# Evotechly Motion OS

Panel build: **v0.32** (P0–P23) on main — `ae/Evotechly Motion OS.jsx` (~297 KB Reliability).

## Phase 3 — editor-ready golden project seed

No `.aep` binary (AE cannot run in CI). `ae/Seed Golden Project.jsx` builds `00_HOME`, `ERP_DEMO`, `TALKING_HEAD`, `REEL_9x16` when the editor runs it. Idempotent. Shy `EVO_GOLDEN_META` on Home. One-page path: `docs/QUICK_START.md`. Helpers: `core/goldenProject.js`. SaaS Demo Tools has a Seed button. Does not replace v0.32.

## Phase 2 — native glass, gradient wipe, proximity hover

Own Solair-class FX. No third-party binaries. Liquid Glass remains an optional external pack for personal use only — not redistributed.

- `core/saasDemoFx.js` — `glassPanel`, `gradientWipeReveal`, `proximityHover` (re-exported from `core/saasDemo.js`)
- `ae/SaaS Demo Tools.jsx` — Glass Panel, Gradient Wipe, Proximity Hover buttons
- Tests in `tests/saas-demo.test.js`. Phase 1 APIs unchanged.

## Phase 1 — Solair-class SaaS Demo Kit (own code)

Own SaaS Demo tools + Editor Free Kit docs. Not a Solair port. Companions stay external.

- `core/saasDemo.js` — `createCursor`, `depthReveal`, `staggerReveal`, `carouselSetup`
- `ae/SaaS Demo Tools.jsx` — Window panel; does not replace v0.32
- `docs/SAAS_DEMO_KIT.md` + `docs/EDITOR_FREE_KIT.md`

Do not tag v2.0.0. AE soak is UNKNOWN. See V2_RELEASE_GATE.md.
