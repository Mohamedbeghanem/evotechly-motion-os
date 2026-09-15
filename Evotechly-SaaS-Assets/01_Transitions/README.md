# Transitions (`01_Transitions`)

Screen-to-screen SaaS motion (dashboard → card → analytics). Premium, short travel, no glitch / RGB / flares.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_UI_PUSH_LEFT` — already owned in Transition Kit Phase 1
- `EVT_UI_PUSH_DASHBOARD` — already owned in Transition Kit Phase 2
- `EVT_UI_PUSH_SPLIT` — already owned (master–detail)
- `EVT_XFADE_SOFT` — catalog only until Transition Kit Phase 5

## Native path

core/transitions + ae/Evotechly Transitions.jsx. Registry IDs must match transitions/Metadata/catalog.json.

## Third-party path

Do not drop AEJuice / Motion Bro / Animation Composer presets here. Those stay MANUAL companion installs.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
