# Transitions (`01_Transitions`)

Screen-to-screen SaaS motion (dashboard → card → analytics). Premium, short travel, no glitch / RGB / flares.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_UI_PUSH_LEFT` — already owned in Transition Kit Phase 1
- `EVT_UI_PUSH_DASHBOARD` — already owned in Transition Kit Phase 2
- `EVT_UI_PUSH_SPLIT` — already owned (master–detail)
- `EVT_SLIDE_CARD_LEFT` / `EVT_SLIDE_PANEL_IN` / `EVT_SLIDE_STACK` — already owned in Transition Kit Phase 3
- `EVT_ZOOM_IN` / `EVT_ZOOM_TARGET` / `EVT_SCALE_POP` — already owned in Transition Kit Phase 4
- `EVT_SHARED_CARD` / `EVT_SHARED_IMAGE` / `EVT_MATCH_CUT` / `EVT_MORPH_BOUNDS` / `EVT_HERO_TO_DETAIL` / `EVT_LIST_TO_DETAIL` — already owned (Phase 12 Shared-Element, bounds-match only)
- `EVT_MODAL_IN` / `EVT_MODAL_OUT` / `EVT_SHEET_UP` / `EVT_SHEET_DOWN` / `EVT_OVERLAY_DIM` / `EVT_POPOVER_IN` / `EVT_TOAST_IN` — already owned (Phase 9 Overlay-Modal)
- `EVT_PAGE_PUSH` / `EVT_PAGE_FADE` / `EVT_SCREEN_SWAP` / `EVT_NAV_FORWARD` / `EVT_NAV_BACK` / `EVT_TAB_CROSS` — already owned (Phase 10 Page-Screen)
- `EVT_XFADE_SOFT` — catalog only until Transition Kit Phase 5

## Native path

core/transitions + ae/Evotechly Transitions.jsx. Registry IDs must match transitions/Metadata/catalog.json.

## Third-party path

Do not drop AEJuice / Motion Bro / Animation Composer presets here. Those stay MANUAL companion installs.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
