# Cards (`06_Cards`)

Dashboard cards: lift, stack, swap, soft scale. Bounds-based only — no mesh warp.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_CARD_LIFT` — planned
- `EVT_CARD_SWAP_SCALE` — planned
- `EVT_CARD_STACK_IN` — planned
- `EVT_UI_PUSH_SCALE` — already owned

## Native path

Reuse UI Push + Scale / Cover. P1 card-specific settle.

## Third-party path

Reject glitch card packs. AEJuice slides stay in the vendor browser.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
