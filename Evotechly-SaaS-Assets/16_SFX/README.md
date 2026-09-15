# Sound effects (`16_SFX`)

UI whoosh / tick / cross markers first. Audio files only after a verified CC0 or Mixkit Free License download on the editor machine.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_SFX_ANTICIPATE` — marker hook ui-soft-in
- `EVT_SFX_ACTION` — ui-whoosh-soft
- `EVT_SFX_CROSSOVER` — ui-cross
- `EVT_SFX_SETTLE` — ui-tick-soft

## Native path

Transition Kit SFX markers only today. No WAV/MP3 in this repo for P0.

## Third-party path

See MANUAL-DOWNLOADS.md Mixkit / Pixabay / Freesound candidates. Never commit files whose license forbids redistribution.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
