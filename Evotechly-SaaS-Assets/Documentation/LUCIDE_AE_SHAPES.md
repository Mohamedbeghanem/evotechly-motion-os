# Lucide SVG → After Effects shapes (untested)

P0 vendored a curated Lucide set under `ThirdParty/lucide/svg/` (ISC + Feather MIT). P1 adds a **recipe file**, not an importer.

## What we have

- `node scripts/lucide-to-ae-shapes.js` writes `EvotechlyNative/lucide-shape-recipes.json`
- Each row: `id`, `file`, `viewBox`, raw `<path d>` strings, `aeImport: "untested"`

## What we do **not** claim

After Effects File → Import of these SVGs has **not** been soaked. Path → AE bezier conversion is **not** implemented. Do not tell editors it “just works.”

## Manual path (editor)

1. **AE 2024+:** File → Import the SVG. Parent / convert as needed. Verify stroke width (Lucide is 24×24, 2 px stroke).
2. **Older AE:** Open in Illustrator, copy paths, paste into a shape layer — or rebuild the 8–12 icons a demo actually uses as native shapes.
3. Keep `ThirdParty/lucide/LICENSE` next to any copy.

Prefer native rebuild for EvoCRM chrome (search, settings, users, chart-line). Recipes are a checklist, not a pipeline.
