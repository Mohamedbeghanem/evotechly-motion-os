# SaaS Assets Pack — P1 Native Generators

Deterministic Node plans + companion apply. **No third-party AE packs.**

Node is source of truth. `ae/Evotechly Transitions.jsx` mirrors numbers (ExtendScript cannot `require`). AE cannot run in CI — green tests are not a visual soak.

## What shipped

| Pack | Module | IDs | Panel tab |
|---|---|---|---|
| Text | `core/assets/textAnimations.js` | 18 `EVT_TEXT_*` | **Text** |
| UI micro | `core/assets/uiMicro.js` | 44 `EVT_UI_{ELEMENT}_{ACTION}` | **UI** |
| Cursor | `core/assets/cursorPack.js` | 8 `EVT_CURSOR_*` | **Cursor** |

Registry (authoritative for P1): [`../Metadata/asset-registry.json`](../Metadata/asset-registry.json) — every implemented ID is `sourceType: "native"`, `commercialUse: true`, `status: OWNED`.

Transition Kit catalog stays the screen-to-screen family. P1 assets are **not** dumped into `transitions/Metadata/catalog.json`.

## Apply

**Window → Evotechly Transitions** (same companion as UI Push — not a stub of the 297 KB Motion OS panel).

1. Open **Text**, **UI**, or **Cursor** (P2b adds **Charts**).
2. Search. Pick a duration group and ease.
3. Select the target layer (Text Swap / some cursor moves: two layers).
4. **Apply**.

Taste: Apple / Linear restraint. Short travel, opacity + scale. No glitch, RGB split, bounce loops.

## Text IDs

`EVT_TEXT_FADE_UP` · `FADE_DOWN` · `MASK_REVEAL` · `WORD_REVEAL` · `LINE_REVEAL` · `CHAR_REVEAL` · `BLUR_IN` · `BLUR_OUT` · `SCALE_IN` · `SLIDE_IN` · `TRACKING_REVEAL` · `HEADLINE_REVEAL` · `SUBTITLE_REVEAL` · `KINETIC_HEADLINE` · `TEXT_SWAP` · `NUMBER_COUNTER` · `PCT_COUNTER` · `METRIC_COUNTER`

Reveal IDs reuse `ADBE Text Animator` / range selectors from `core/textReveal.js`. Counters write source-text keys (linear). Kinetic headline is tracking + 8 px lift — not a kinetic-glitch preset.

## UI micro

Solid core (not empty stubs) for button, card, modal, tooltip, dropdown, sidebar, nav, tabs, row, metric, badge, notification, search, avatar.

Actions implemented where they belong: `ENTER` / `EXIT` / `HOVER` / `CLICK` / `EXPAND` / `COLLAPSE`. Opacity, scale, and small position offsets only.

## Cursor

`EVT_CURSOR_MOVE` · `CLICK` · `DBLCLICK` · `HOVER` · `DRAG` · `SWIPE` · `SELECT` · `RIPPLE`

Styles remain `pointer` / `hand` / `ibeam` from `createCursor`. Ripple is an optional ellipse halo (scale + opacity).

## Lucide → AE shapes

[`../EvotechlyNative/lucide-shape-recipes.json`](../EvotechlyNative/lucide-shape-recipes.json) is a **recipe** (viewBox + path `d`). Rebuild with:

```
node scripts/lucide-to-ae-shapes.js
```

**AE import is untested.** Do not claim File → Import SVG works until an editor soaks it. See [LUCIDE_AE_SHAPES.md](LUCIDE_AE_SHAPES.md).

## Tests

`tests/saas-assets-p1.test.js` — plans deterministic, unique IDs, registry complete for the implemented set.

## Not in P1

AEJuice, Motion Bro, Animation Composer, BentoMotion / Liquid Glass binaries. `downloaded: true` only for Lucide SVGs already vendored in P0.
