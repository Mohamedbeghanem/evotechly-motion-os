"use strict";

/**
 * Lucide SVG → AE shape *recipe* (not a tested importer).
 *
 * Reads Evotechly-SaaS-Assets/ThirdParty/lucide/svg/*.svg and writes
 * Evotechly-SaaS-Assets/EvotechlyNative/lucide-shape-recipes.json
 * with viewBox + raw path `d` strings.
 *
 * This does NOT claim After Effects can import those paths automatically.
 * Untested in AE. Editor path (manual):
 *   1. File → Import → SVG (AE 2024+), or
 *   2. Copy the path `d` into a shape layer / illustrator, or
 *   3. Use the recipe JSON as a checklist of icons to rebuild as native shapes.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SVG_DIR = path.join(ROOT, "Evotechly-SaaS-Assets", "ThirdParty", "lucide", "svg");
const OUT = path.join(ROOT, "Evotechly-SaaS-Assets", "EvotechlyNative", "lucide-shape-recipes.json");

function extract(attr, body) {
  const re = new RegExp(attr + '="([^"]+)"');
  const m = body.match(re);
  return m ? m[1] : "";
}

function pathsOf(body) {
  const out = [];
  const re = /<path\b([^>]*)\/?>/g;
  let m;
  while ((m = re.exec(body))) {
    const d = extract("d", m[1]);
    if (d) {
      out.push({
        d: d,
        fill: extract("fill", m[1]) || "none",
        stroke: extract("stroke", m[1]) || "currentColor"
      });
    }
  }
  return out;
}

const files = fs
  .readdirSync(SVG_DIR)
  .filter(function (f) {
    return f.endsWith(".svg");
  })
  .sort();

const recipes = files.map(function (file) {
  const body = fs.readFileSync(path.join(SVG_DIR, file), "utf8");
  return {
    id: "EVT_ICON_LUCIDE_" + file.replace(/\.svg$/, "").toUpperCase().replace(/-/g, "_"),
    file: "ThirdParty/lucide/svg/" + file,
    viewBox: extract("viewBox", body) || "0 0 24 24",
    paths: pathsOf(body),
    aeImport: "untested",
    note: "Recipe only. Do not claim File > Import SVG works until an editor soaks it."
  };
});

const payload = {
  version: "0.2.0-p1",
  source: "Lucide official SVGs (ISC + Feather MIT — see ThirdParty/lucide/LICENSE)",
  aeImportStatus: "untested",
  manualPath: [
    "After Effects 2024+: File → Import the SVG, then convert / parent as needed.",
    "Older AE: open in Illustrator or copy path data into a shape Path.",
    "Prefer rebuilding high-use icons as native shape layers for demo comps."
  ],
  recipes: recipes
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");
console.log("wrote", OUT, "icons=", recipes.length, "aeImport=untested");
