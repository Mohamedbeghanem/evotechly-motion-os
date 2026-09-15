# Captions (`09_Captions`)

Keyword color + in/out (fade, scale, slideUp, typewriter, blur). AR+EN captions stay on the main panel.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_CAPTION_COLOR_KEYWORDS` — native captionStyle
- `EVT_CAPTION_IN_FADE` — planned
- `EVT_CAPTION_OUT_SLIDE_UP` — planned
- `EVT_CAPTION_TYPEWRITER` — planned

## Native path

core/captionStyle.js + Window → Caption Style Tools. assets/caption-templates.json.

## Third-party path

Meow Captions is optional companion (itch.io). Never vendor the CEP zip.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
