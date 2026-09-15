# Icons (`04_Icons`)

Static SaaS icons (CRM, users, charts, billing). Prefer Lucide / Phosphor / Heroicons as shape sources, then rebuild as AE shape layers.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_ICON_LUCIDE_USERS` — planned
- `EVT_ICON_LUCIDE_LAYOUT_DASHBOARD` — planned
- `EVT_ICON_LUCIDE_CREDIT_CARD` — planned
- `EVT_ICON_AE_SHAPE_CHART` — P1 native rebuild

## Native path

P1: convert curated SVGs to AE shape descriptors. Do not ship 1000-icon dumps.

## Third-party path

Vendored Lucide set lives in ThirdParty/lucide (ISC + Feather MIT). Phosphor / Heroicons listed in SOURCES.md — do not scrape paid icon packs.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
