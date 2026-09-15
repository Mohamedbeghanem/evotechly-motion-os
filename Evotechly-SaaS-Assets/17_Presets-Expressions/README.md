# Presets and expressions (`17_Presets-Expressions`)

Own expression snippets and later .jsx apply helpers. Never check in vendor .ffx / .aep.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_EXPR_PROGRESS_DRIVER` — reserved (Transition Kit later phase)
- `EVT_EXPR_SAFE_MARGIN` — planned
- `EVT_PRESET_APPLE_EASE` — already in core/polish.js

## Native path

core/transitions/easing.js, polish ease. Pack-level expressions land in Engine/ later.

## Third-party path

Animation Composer / AEJuice presets are companion browsers only.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
