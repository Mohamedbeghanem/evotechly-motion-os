# Camera moves (`20_Camera-Moves`)

Plate push/pull / target zoom. Not a 3D camera rig. Transition Kit Camera-Dolly family is catalog (Phase 14).

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_CAM_DOLLY_IN` — catalog
- `EVT_ZOOM_TARGET` — planTargetZoom math exists; JSX apply later
- `EVT_CAM_PUSH_SOFT` — planned

## Native path

core/transitions/target.js + Camera-Dolly catalog IDs.

## Third-party path

No paid camera-rig plugins. No Motion Bro camera packs in git.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
