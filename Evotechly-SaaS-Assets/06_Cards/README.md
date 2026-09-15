# Cards (`06_Cards`)

Dashboard cards: lift, stack, swap, soft scale. Bounds-based only — no mesh warp.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_SLIDE_CARD_LEFT` / `EVT_SLIDE_CARD_RIGHT` — already owned (Transition Kit Phase 3)
- `EVT_SLIDE_STACK` / `EVT_SLIDE_PEEK` — already owned (Transition Kit Phase 3)
- `EVT_SHARED_CARD` — already owned (bounds-match card→detail, not mesh)
- `EVT_ZOOM_IN` / `EVT_SCALE_POP` / `EVT_SCALE_SETTLE` — already owned (Transition Kit Phase 4)
- `EVT_UI_PUSH_SCALE` — already owned
- `EVT_CARD_LIFT` — planned (P2b / later)

## Native path

Reuse UI-Slide card family (`core/transitions/uiSlide.js`) + Scale-Zoom + Shared Card (`scaleZoom.js`, `sharedElement.js`) + UI Push + Scale / Cover.

## Third-party path

Reject glitch card packs. AEJuice slides stay in the vendor browser.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
