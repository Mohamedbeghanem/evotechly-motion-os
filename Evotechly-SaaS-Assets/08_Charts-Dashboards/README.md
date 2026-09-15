# Charts and dashboards (`08_Charts-Dashboards`)

KPI count-up, bar draw, sparkline, donut sweep. Native expressions / trim paths later — no stock chart AEPs.

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

- `EVT_CHART_BAR_DRAW` — planned
- `EVT_CHART_KPI_COUNT` — planned
- `EVT_CHART_LINE_REVEAL` — planned
- `EVT_DASH_WIDGET_IN` — planned

## Native path

P1 generators + Lucide chart icons as placeholders.

## Third-party path

Do not vendor Lottie chart files into the release zip without per-file license review.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
