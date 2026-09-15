# Charts and dashboards (`08_Charts-Dashboards`)

P2b owns native chart / device-plate motion for EvoCRM. KPI count-up already exists as text (`EVT_TEXT_NUMBER_COUNTER` / `PCT` / `METRIC`). This folder adds series enter, bar/column rise, line draw, donut/arc fill, pipeline funnel, activity spark, and laptop/phone frame present.

No stock chart AEPs. No 3D camera. Soft, no bounce, no glitch.

## Intended contents

Node plans in `core/assets/chartsDevices.js`. Apply: **Window → Evotechly Transitions → Charts**. Registry rows are `sourceType: native`, `commercialUse: true`.

Nothing binary ships in this folder. Shape layers (bars, paths, ellipses) stay in the editor comp.

## EVT_ IDs (owned, P2b)

- `EVT_CHART_SERIES_ENTER` — series / bars stagger in (Stagger-Cascade 3f / 16px)
- `EVT_CHART_BAR_DRAW` — horizontal bar grows `scaleX` 0→100
- `EVT_CHART_COLUMN_RISE` — vertical column rises `scaleY` 0→100
- `EVT_CHART_LINE_REVEAL` — line draw, native trim path 0→100
- `EVT_CHART_DONUT_FILL` — donut / arc fill to a percent (default 72)
- `EVT_CHART_KPI_COUNT` — KPI widget present + linear count-up
- `EVT_CHART_FUNNEL_IN` — pipeline funnel stages stagger in
- `EVT_CHART_SPARK` — activity sparkline draw
- `EVT_DASH_WIDGET_IN` — dashboard widget present (Scale-Zoom 90→100)
- `EVT_DEVICE_LAPTOP_IN` — laptop frame present (not a 3D camera)
- `EVT_DEVICE_PHONE_IN` — phone frame present (not a 3D camera)

## Native path

Reuse Scale-Zoom `POP_START` (90) and Stagger-Cascade offset / travel. Trim paths for line / spark / donut. Independent scale axes for bar / column. Device plates are 2D frame presents.

## Third-party path

Do not vendor Lottie chart files into the release zip without per-file license review.

## Registry

Rows live in `../Metadata/asset-registry.json`. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
