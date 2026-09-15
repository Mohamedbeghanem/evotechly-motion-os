# Modals and overlays (`07_Modals-Overlays`)

Dialog in/out, dimmer, sheet, popover. Quiet overshoot. Overlay-Modal family is Transition Kit Phase 9 — **implemented**.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_MODAL_IN` — already owned (Phase 9 Overlay-Modal)
- `EVT_MODAL_OUT` — already owned
- `EVT_SHEET_UP` / `EVT_SHEET_DOWN` — already owned
- `EVT_OVERLAY_DIM` — already owned
- `EVT_POPOVER_IN` / `EVT_TOAST_IN` — already owned

## Native path

`core/transitions/overlayModal.js` + Transitions tab apply. Hub `glassPanel` remains the frost behind a modal.

## Third-party path

BentoMotion Liquid Glass is personal-free only — not for Evotechly commercial.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
