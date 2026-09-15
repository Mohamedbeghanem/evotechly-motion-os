# Evotechly Transition Kit — architecture

Premium SaaS screen-to-screen motion. Apple / Linear / Stripe / Raycast taste. Not a glitch pack.

**Phase 0–3** ships this document, the folder scaffold, a Node-testable engine, catalog metadata, and a companion ScriptUI panel. The full UI Push family and the UI-Slide card family produce complete keyframe plans. Everything else is catalogued for later phases and AI pairing.

This kit does **not** replace the v0.32 Motion tab transitions (shot-level Clean Push / Whip / Zoom Match). Those stay in `ae/Evotechly Motion OS.jsx` (~297 KB — never stub). This kit is UI-to-UI: dashboard → card → analytics.

## Feasibility (honest)

| Want | Native AE? | Phase 1 |
|---|---|---|
| Position / scale / opacity push | Yes | **Implemented** for the full UI Push family |
| Fast Box Blur / Gaussian Blur | Yes | Planned on those 6 (blur keys in the plan) |
| Shy control null + Slider Controls | Yes | Plan + JSX wiring |
| Target-frame zoom math | Yes (pure math) | `planTargetZoom` only — JSX apply later |
| Rounded mask expand / iris | Yes (masks) | Catalog only (Phase 6) |
| Shared-element “morph” | Partial | Bounds match (pos+scale), not mesh warp |
| True glass refraction | No (without a plugin) | Native frost only; Liquid Glass stays companion |
| SFX | Markers only | Metadata hooks — **no audio files** |
| `.ffx` / `.aep` presets | Out of scope | Never checked in. AE cannot run in CI |
| Third-party packs | Forbidden | Motion Bro / AEJuice / Animation Composer stay URLs |

**CI cannot open After Effects.** Plans are deterministic JSON. Visual taste is an editor soak, same as the rest of Motion OS.

**ExtendScript cannot `require` Node.** `core/transitions/*.js` is the source of truth for numbers and tests. `ae/Evotechly Transitions.jsx` mirrors the UI Push and UI-Slide constants and apply math. If they drift, fix Node first, then the JSX.

**Progress slider** is reserved. Phase 1 keys are time-based. Driving the whole transition from `Progress` (0–100) is an Expressions-folder job in a later phase.

**Aspect ratios** (16:9 / 9:16 / 1:1 / 4:5) are metadata plus `comp.w` / `comp.h` math. There is no per-ratio binary.

## Anatomy

Every implemented transition is four beats, not a single ease:

```
anticipate → action → crossover → settle
```

| Beat | Default share (of duration) | Job |
|---|---|---|
| **anticipate** | 0–12.5% | Tiny opposite move or +1% scale. The screen breathes before it commits. |
| **action** | 12.5–50% | Outgoing leaves. Incoming is still mostly off or faded. |
| **crossover** | ~50% | Both plates visible. Opacity crosses. SFX marker `EVT_SFX_CROSSOVER`. |
| **settle** | 50–100% | Incoming overshoots a few pixels (capped), then rests. No bounce loop. |

Keep travel small enough to read as product UI. Full-frame push is allowed (UI Push distance 100% of axis). Overshoot is capped at 24 px. Anticipate is capped at 16 px.

## Timing groups @ 30 fps

| Group | Frames | Seconds @ 30 | Feel |
|---|---|---|---|
| **MICRO** | 4–8 (default 6) | 0.13–0.27 | Chrome, toggles, hover settle |
| **FAST** | 8–12 (default 10) | 0.27–0.40 | Buttons, toasts, tab chrome |
| **STANDARD** | 12–18 (default 15) | 0.40–0.60 | Card / screen push default |
| **SMOOTH** | 18–24 (default 21) | 0.60–0.80 | Dashboard tours |
| **HERO** | 24–36 (default 30) | 0.80–1.20 | Open, hold, product hero |

Other fps values scale the 30 fps default (`round(frames30 * fps / 30)`). `core/transitions/timing.js`.

## Easing IDs

Influence pairs only — the same AE `KeyframeEase` model as Polish / UI presets.

| ID | In / Out | Source |
|---|---|---|
| `premium-smooth` | 88 / 14 | New. Default UI Push. |
| `apple-smooth` | 80 / 18 | `core/polish.js` apple |
| `fast-product` | 72 / 12 | Product snap (Vercel / Linear) |
| `soft-ui` | 40 / 40 | `core/polish.js` soft |
| `snappy` | 55 / 8 | Short chrome |
| `elastic-micro` | 35 / 78 | Micro settle — **not** a bounce preset |
| `linear` | 16 / 16 | `uiPresets` linear (alias, not in the panel list) |

## Control null

Name: **`EVOTECHLY_TRANSITION_CONTROL`**

Shy guide null. JSX adds **Slider Control** effects (no custom Match Name plugin, no `.ffx`).

| Slider | Default | Meaning |
|---|---|---|
| Progress | 0 | Reserved (expressions later) |
| Duration | 15 | Frames @ 30 fps |
| Direction | 0 | 0 left · 1 right · 2 up · 3 down |
| Strength | 100 | Travel multiplier |
| Distance | 100 | Percent of axis (comp W or H) |
| Scale | 100 | Outgoing rest scale |
| TargetScale | 100 | Incoming / target rest scale |
| Blur | 0 | Extra blur |
| Overshoot | 6 | Percent of travel, cap 24 px |
| Depth | 50 | Depth-family later |
| Opacity | 100 | Global opacity bias |
| CornerRadius | 12 | Mask family later |
| MaskExpansion | 0 | Mask family later |
| Stagger | 3 | Cascade family later |
| Settle | 20 | Percent of duration |
| Easing | 0 | Index into easing IDs (metadata) |

Easing is **metadata**. The slider is an index. JSX maps `0…5` → `premium-smooth` … `elastic-micro`.

## Aspect ratios

Plans take `comp.w` / `comp.h`. Catalog rows list `["16:9","9:16","1:1","4:5"]`. 9:16 is a crop of the same timing table — not a second delay set. Same rule as Motion OS shots.

## Families (A–16)

Folder names under `transitions/`. Letters are A=01 … P=16.

| # | Family | Folder | Phase | Phase 1 |
|---|---|---|---|---|
| A / 01 | UI-Push | `01_UI-Push/` | 1–2 | **15 IDs implemented (Phase 2)** |
| B / 02 | UI-Slide | `02_UI-Slide/` | 3 | **8 IDs implemented (Phase 3)** |
| C / 03 | Scale-Zoom | `03_Scale-Zoom/` | 4 | catalog |
| D / 04 | Crossfade | `04_Crossfade/` | 5 | catalog |
| E / 05 | Mask-Reveal | `05_Mask-Reveal/` | 6 | catalog |
| F / 06 | Blur-Focus | `06_Blur-Focus/` | 7 | catalog |
| G / 07 | Depth-Parallax | `07_Depth-Parallax/` | 8 | catalog |
| H / 08 | Overlay-Modal | `08_Overlay-Modal/` | 9 | catalog |
| I / 09 | Page-Screen | `09_Page-Screen/` | 10 | catalog |
| J / 10 | Wipe-Split | `10_Wipe-Split/` | 11 | catalog |
| K / 11 | Shared-Element | `11_Shared-Element/` | 12 | catalog |
| L / 12 | Stagger-Cascade | `12_Stagger-Cascade/` | 13 | catalog |
| M / 13 | Camera-Dolly | `13_Camera-Dolly/` | 14 | catalog |
| N / 14 | Glass-Frost | `14_Glass-Frost/` | 15 | catalog |
| O / 15 | Hero | `15_Hero/` | 16 | catalog + demo storyboard file |
| P / 16 | Micro | `16_Micro/` | 17 | catalog |

IDs live in `transitions/Metadata/catalog.json`. Each README stub lists the planned IDs for that family.

### Phase 3 implemented IDs (UI-Slide card family)

Card-width travel (0.22–0.42 of the axis), not a full-frame push. EvoCRM: dashboard → card → detail.

- `EVT_SLIDE_CARD_LEFT` / `RIGHT` — **Slide Card Left/Right**. Single card travels a card-width; incoming enters from the opposite edge.
- `EVT_SLIDE_PANEL_IN` — **Slide Panel In**. Inspector from the trailing edge; content stays and dims.
- `EVT_SLIDE_PANEL_OUT` — **Slide Panel Out**. Panel dismisses; content recovers.
- `EVT_SLIDE_DRAWER` — **Slide Drawer**. Nav drawer from the leading edge.
- `EVT_SLIDE_SHEET_UP` — **Slide Sheet Up**. Bottom sheet present; dashboard stays.
- `EVT_SLIDE_STACK` — **Slide Stack**. Outgoing recedes into a stack; incoming peeks then commits.
- `EVT_SLIDE_PEEK` — **Slide Peek**. Partial reveal, then hold (incoming never reaches rest).

Plans: `core/transitions/uiSlide.js`. `EVT_CARD_SLIDE_LEFT` aliases `EVT_SLIDE_CARD_LEFT`.

### Phase 1–2 implemented IDs (UI Push family)

- `EVT_UI_PUSH_LEFT` / `RIGHT` / `UP` / `DOWN` — **UI Push Left/Right/Up/Down**. Outgoing travels on axis; incoming enters from the opposite edge; anticipate opposite; settle overshoot capped.
- `EVT_UI_PUSH_SCALE` — **UI Push + Scale**. Outgoing 100 → 88 + fade; incoming 110 → 100. No full-frame slide.
- `EVT_UI_PUSH_DEPTH` — **UI Push + Depth**. Outgoing recedes (scale down, blur up, slight +Y); incoming lifts from blur.
- `EVT_UI_PUSH_SOFT` — same axis as left, longer settle, quieter blur.
- `EVT_UI_PUSH_SNAP` — short tab-to-tab travel, almost no blur.
- `EVT_UI_PUSH_OVERSHOOT` — directional push with a quieter elastic settle (scale 101.4, then 100).
- `EVT_UI_PUSH_PARALLAX` — background (outgoing) travels 28% of the foreground (incoming).
- `EVT_UI_PUSH_FADE` — short travel plus an earlier opacity cross.
- `EVT_UI_PUSH_COVER` — incoming covers; outgoing stays put and opaque.
- `EVT_UI_PUSH_PANEL` — **Panel Push**. Inspector from the trailing edge; content dims and yields.
- `EVT_UI_PUSH_DASHBOARD` — **Dashboard Push**. Left-axis travel plus a quiet depth lift.
- `EVT_UI_PUSH_SPLIT` — **Split Panel Push**. Panes part at crossover, then incoming takes the frame.

Plans: `core/transitions/uiPush.js`. `EVT_PANEL_PUSH` aliases `EVT_UI_PUSH_PANEL`.

## AI pairing notes

Catalog rows are the pairing surface. Do not invent IDs at apply time.

Suggested prompt → ID mapping (later Phase 18):

| Editor / model language | Prefer |
|---|---|
| “next screen”, “forward”, “push left” | `EVT_UI_PUSH_LEFT` |
| “back”, “previous” | `EVT_UI_PUSH_RIGHT` or `EVT_NAV_BACK` |
| “open card”, “card from the right” | `EVT_SLIDE_CARD_LEFT` |
| “side panel”, “inspector”, “panel in” | `EVT_SLIDE_PANEL_IN` |
| “panel push” | `EVT_UI_PUSH_PANEL` |
| “drawer”, “nav drawer” | `EVT_SLIDE_DRAWER` |
| “bottom sheet” | `EVT_SLIDE_SHEET_UP` |
| “card stack”, “peek then commit” | `EVT_SLIDE_STACK` |
| “peek”, “partial card” | `EVT_SLIDE_PEEK` |
| “dashboard push”, “tour the dashboard” | `EVT_UI_PUSH_DASHBOARD` |
| “split view”, “master detail” | `EVT_UI_PUSH_SPLIT` |
| “zoom this widget” | `EVT_ZOOM_TARGET` (needs target bounds) |
| “modal”, “dialog” | `EVT_MODAL_IN` |
| “quiet”, “calm”, “expensive” | `SMOOTH` + `premium-smooth` or `soft-ui` |
| “snappy”, “product” | `FAST` + `fast-product` |
| “glitch / RGB / explode / spin” | **Refuse.** No such IDs. |

`bestUse`, `duration`, `intensity`, `targetRequired`, `aspectRatios`, and `phase` are the fields a model should read. `implemented: false` means: show in the panel, do not apply keys yet.

## SFX hooks

Markers only. No WAV/MP3 in the repo.

| Marker | Default hook id |
|---|---|
| `EVT_SFX_ANTICIPATE` | `ui-soft-in` |
| `EVT_SFX_ACTION` | `ui-whoosh-soft` |
| `EVT_SFX_CROSSOVER` | `ui-cross` |
| `EVT_SFX_SETTLE` | `ui-tick-soft` |

Catalog `sfx: []` (or a short list of hook ids) is metadata for a future sound pass. Editors drop their own audio on those markers.

## Repo map

| Path | Role |
|---|---|
| `core/transitions/easing.js` | Influence pairs |
| `core/transitions/timing.js` | Timing groups |
| `core/transitions/target.js` | Target zoom math |
| `core/transitions/control.js` | Control-null plan |
| `core/transitions/engine.js` | `applyTransitionPlan` |
| `core/transitions/uiPush.js` | UI Push family keyframe plans |
| `core/transitions/uiSlide.js` | UI-Slide card family keyframe plans |
| `core/transitions/registry.js` | Catalog load / filter |
| `transitions/Metadata/catalog.json` | Every planned `EVT_*` |
| `ae/Evotechly Transitions.jsx` | Companion panel |
| `tests/transitions-engine.test.js` | Node tests |
| `transitions/Examples/demo-storyboard.json` | Phase 16 sequence |
| `docs/TRANSITION_PHASES.md` | Phase 0–18 roadmap |

`transitions/Documentation/` points here. `transitions/Engine/` and `transitions/Expressions/` are reserved (no fake binaries).

## Install

Copy `ae/Evotechly Transitions.jsx` into **Scripts/ScriptUI Panels** next to Motion OS Hub. Restart AE. **Window → Evotechly Transitions**.

1. Select outgoing, then incoming.
2. Filter the catalog. Pick a duration group and a direction.
3. **Apply** — implemented IDs write keys + control null + SFX markers. Others alert the phase they belong to.

Hub SaaS / Kit Hub has a one-line pointer. The 297 KB panel is untouched.

## Quality bar

Do: short travel, opacity crosses, blur under 16 px, overshoot under 24 px, hold the settle.  
Do not: RGB split, glitch, lens flares, explosions, 360 spins, bounce loops, comic wipes.

## Limitations (read this)

1. AE is not in CI. Green tests ≠ soaked comps.
2. JSX is a mirror, not a `require`.
3. UI Push (15) + UI-Slide card family (8) implemented. Other catalog rows are metadata.
4. No `.ffx`, `.aep`, or vendored plugins.
5. No SFX audio.
6. Target zoom is math; target-required IDs are not applied in Phase 3.
7. Shared-element morph will be bounds, not True Comp or mesh.
8. Glass is native frost, not refraction.
9. Does not rewrite or stub `ae/Evotechly Motion OS.jsx`.
10. Progress-as-driver is not wired.
