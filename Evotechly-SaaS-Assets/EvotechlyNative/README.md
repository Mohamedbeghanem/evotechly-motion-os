# EvotechlyNative/

**Our work.** MIT Evotechly Motion OS. Safe to ship in the Evotechly zip.

## What belongs here

- Native generators, plans, shape recipes, and docs we wrote
- Pointers to Transition Kit IDs we already own (`EVT_UI_PUSH_*`, `EVT_SLIDE_*`, `EVT_ZOOM_*`, `EVT_SCALE_*`, `EVT_SHARED_*`, `EVT_MATCH_CUT`, `EVT_MORPH_BOUNDS`, `EVT_HERO_TO_DETAIL`, `EVT_LIST_TO_DETAIL`, `EVT_MODAL_*`, `EVT_SHEET_*`, `EVT_OVERLAY_DIM`, `EVT_POPOVER_IN`, `EVT_TOAST_IN`, `EVT_PAGE_*`, `EVT_SCREEN_SWAP`, `EVT_NAV_*`, `EVT_TAB_CROSS`, catalog rows in `transitions/Metadata/catalog.json`)
- Future text / UI / glass / cursor assets implemented in `core/` + companion JSX

## What does not belong here

- Third-party source files (those go under `../ThirdParty/` or stay on the editor’s machine)
- Relabeled AEJuice / Motion Bro / Animation Composer presets
- Lucide SVGs (keep vendor LICENSE with the files — they stay in `../ThirdParty/lucide/`)

## P0

This folder is a **policy + pointer**, not a second copy of `core/transitions`.

Implemented Transition Kit IDs are registered in `../Metadata/asset-registry.json` as `sourceType: "native"`, `commercialUse: true`, `transitionKitPath: "core/transitions"`.

## P1

Generators live in `core/assets/` (text / UI micro / cursor / charts-devices). This folder holds policy plus `lucide-shape-recipes.json` (untested AE import). Apply: **Window → Evotechly Transitions** → Text / UI / Cursor / Charts.
