# Text animations (`02_Text-Animations`)

Product-taste text: flowing reveal, coloured keyword, typewriter, fade/scale/slide. Not kinetic-glitch packs.

## Intended contents

P1 native generators live in `core/assets/textAnimations.js` (18 IDs). Nothing binary ships in this folder. Apply: Evotechly Transitions → **Text**.

## EVT_ naming examples

- `EVT_TEXT_FLOWING` — native core/textReveal.js
- `EVT_TEXT_COLOURED` — native colouredReveal
- `EVT_CAPTION_TYPEWRITER` — native captionStyle / Polish Typewriter
- `EVT_TEXT_FADE_UP` — P1 later native generator

## Native path

core/textReveal.js, core/captionStyle.js, Hub SaaS + Caption Style Tools.

## Third-party path

Presetify / Vignette Typer Lite / Meow stay companion-only. Do not vendor their JSX.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
