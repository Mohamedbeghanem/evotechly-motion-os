# Cursors (`11_Cursors`)

Pointer / hand / I-beam plus click squash. Shape layers only — no PNG cursor packs.

## Intended contents

P1 native cursor motion lives in `core/assets/cursorPack.js` (`EVT_CURSOR_MOVE` … `RIPPLE`). Styles stay pointer / hand / ibeam. Apply: Evotechly Transitions → **Cursor**.

## EVT_ naming examples

- `EVT_CURSOR_POINTER` — native createCursor({ style: 'pointer' })
- `EVT_CURSOR_HAND` — planned
- `EVT_CURSOR_IBEAM` — planned
- `EVT_CURSOR_CLICK` — planned

## Native path

core/saasDemo.js CURSOR.styles. Hub SaaS Style dropdown.

## Third-party path

CursorKit is skip / reference only. Do not vendor.

## Registry

Add a row to `../Metadata/asset-registry.json` before claiming an asset exists. `downloaded: true` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
