# SaaS Assets Pack — P2b Native Charts / Devices

Deterministic Node plans + companion apply. **No third-party AE packs.**

Node is source of truth. `ae/Evotechly Transitions.jsx` mirrors numbers (ExtendScript cannot `require`). AE cannot run in CI — green tests are not a visual soak.

## What shipped

| Pack | Module | IDs | Panel tab |
|---|---|---|---|
| Charts / devices | `core/assets/chartsDevices.js` | 11 `EVT_CHART_*` / `EVT_DASH_*` / `EVT_DEVICE_*` | **Charts** |

Registry (authoritative for P2b): [`../Metadata/asset-registry.json`](../Metadata/asset-registry.json) — every implemented ID is `sourceType: "native"`, `commercialUse: true`, `status: OWNED`. Version `0.3.0-p2b`.

Transition Kit catalog stays the screen-to-screen family. P2b assets are **not** dumped into `transitions/Metadata/catalog.json`. Crossfade stays catalog-only (`PAGE_FADE` / `TAB_CROSS` already own dissolves).

## Apply

**Window → Evotechly Transitions** (same companion as UI Push — not a stub of the 297 KB Motion OS panel).

1. Open **Charts**.
2. Search. Pick a duration group and ease.
3. Select the target layer (series / funnel: 2+ layers, top = first).
4. **Apply**.

Taste: Apple / Linear restraint. Soft grow / draw / present. No bounce, no glitch, no 3D camera on device plates.

## Chart IDs

`EVT_CHART_SERIES_ENTER` · `BAR_DRAW` · `COLUMN_RISE` · `LINE_REVEAL` · `DONUT_FILL` · `KPI_COUNT` · `FUNNEL_IN` · `SPARK` · `EVT_DASH_WIDGET_IN`

Series / funnel reuse Stagger-Cascade offset (3f) and travel (16px / 12px). Bar / column use independent `scaleX` / `scaleY`. Line / spark / donut use `ADBE Vector Filter - Trim`. KPI count-up reuses the P1 text counter keys plus a widget present.

## Device IDs

`EVT_DEVICE_LAPTOP_IN` · `EVT_DEVICE_PHONE_IN`

Laptop / phone frames present with Scale-Zoom `POP_START` (90) or a quieter 92. Lift only — not Camera-Dolly, not a 3D rig.

## Tests

`tests/saas-assets-p2b.test.js` — plans deterministic, unique IDs, registry complete, JSX Charts tab present. Existing P0 / P1 suites stay green.

## Not in P2b

AEJuice, Motion Bro, Animation Composer, BentoMotion / Liquid Glass binaries. Mask-Reveal / Blur-Focus / Depth-Parallax / Wipe-Split / Camera-Dolly / Glass-Frost / Hero / Micro kit families. Crossfade.
