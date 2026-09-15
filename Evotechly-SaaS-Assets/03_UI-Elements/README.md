# UI elements (`03_UI-Elements`)

Nav, tabs, pills, toasts, input focus, toggle chrome. Linear / Stripe taste. Rebuild as AE shapes + our presets.

## Intended contents

P1 native UI micro plans live in `core/assets/uiMicro.js` (`EVT_UI_{ELEMENT}_{ACTION}`). Nothing binary ships in this folder. Apply: Evotechly Transitions → **UI**.

## EVT_ naming examples

- `EVT_UI_TAB_SWITCH` — planned
- `EVT_UI_TOAST_IN` — planned
- `EVT_UI_PILL_SELECT` — planned
- `EVT_UI_TOGGLE_SETTLE` — planned

## Native path

core/uiPresets.js (fade-up, slide-*, pop) + staggerReveal. Expand generators in P1.

## Third-party path

UI Animator Pro is $0 companion install only — never vendor jsxbin.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
