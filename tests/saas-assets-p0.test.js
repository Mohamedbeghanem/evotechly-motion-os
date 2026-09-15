"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const PACK = path.join(__dirname, "..", "Evotechly-SaaS-Assets");
const REGISTRY_PATH = path.join(PACK, "Metadata", "asset-registry.json");
const SCHEMA_PATH = path.join(PACK, "Metadata", "asset-registry.schema.json");
const LUCIDE = path.join(PACK, "ThirdParty", "lucide");

const NUMBERED = [
  "01_Transitions",
  "02_Text-Animations",
  "03_UI-Elements",
  "04_Icons",
  "05_Buttons-CTAs",
  "06_Cards",
  "07_Modals-Overlays",
  "08_Charts-Dashboards",
  "09_Captions",
  "10_Lower-Thirds",
  "11_Cursors",
  "12_Glass-Frost",
  "13_Logos-Lockups",
  "14_Backgrounds",
  "15_Overlays-HUD",
  "16_SFX",
  "17_Presets-Expressions",
  "18_Shapes-Ornaments",
  "19_Particles-Accents",
  "20_Camera-Moves"
];

const SUPPORT = [
  "Engine",
  "Presets",
  "Scripts",
  "Metadata",
  "Previews",
  "Licenses",
  "Sources",
  "Documentation",
  "ThirdParty",
  "EvotechlyNative"
];

function walkFiles(dir, acc) {
  acc = acc || [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (ent) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else acc.push(p);
  });
  return acc;
}

test("P0 pack folders and legal docs exist", function () {
  NUMBERED.forEach(function (name) {
    const readme = path.join(PACK, name, "README.md");
    assert.ok(fs.existsSync(readme), readme);
    const body = fs.readFileSync(readme, "utf8");
    assert.match(body, /EVT_/);
    assert.match(body, /Intended contents/);
  });
  SUPPORT.forEach(function (name) {
    assert.ok(fs.existsSync(path.join(PACK, name, "README.md")), name);
  });
  ["SOURCES.md", "MANUAL-DOWNLOADS.md", "ASSET-AUDIT.md", "README.md"].forEach(function (f) {
    const p = path.join(PACK, f);
    assert.ok(fs.existsSync(p), f);
    assert.ok(fs.statSync(p).size > 400, f + " too small");
  });
  assert.ok(fs.existsSync(path.join(PACK, "Documentation", "INSTALL.md")));
  assert.ok(fs.existsSync(path.join(__dirname, "..", "docs", "SAAS_ASSETS_P0.md")));
});

test("legal docs do not claim AEJuice / Gumroad packs were downloaded", function () {
  const sources = fs.readFileSync(path.join(PACK, "SOURCES.md"), "utf8");
  const audit = fs.readFileSync(path.join(PACK, "ASSET-AUDIT.md"), "utf8");
  assert.match(sources, /No AEJuice \/ Gumroad \/ Motion Bro \/ itch binaries were downloaded/);
  assert.match(audit, /REQUIRES LICENSE REVIEW/);
  assert.match(audit, /BentoMotion/);
  assert.doesNotMatch(sources, /Downloaded AEJuice Starter Pack into this repo/i);
});

test("asset registry schema + native Transition Kit stubs", function () {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  assert.equal(registry.schemaVersion, 1);
  assert.ok(registry.phase === "P0" || registry.phase === "P1");
  assert.ok(Array.isArray(registry.assets));
  assert.ok(schema.$defs.asset);

  const native = registry.assets.filter(function (a) {
    return a.sourceType === "native";
  });
  assert.ok(native.length >= 15, "expected Transition Kit stubs");
  native.forEach(function (a) {
    assert.match(a.id, /^EVT_/);
    assert.equal(a.owner, "Evotechly");
    assert.equal(a.commercialUse, true);
    assert.equal(a.redistributionAllowed, true);
    assert.equal(a.status, "OWNED");
    assert.equal(a.downloaded, false);
  });

  const push = native.filter(function (a) {
    return a.transitionKitId && a.transitionKitId.indexOf("EVT_UI_PUSH_") === 0;
  });
  assert.equal(push.length, 15);
  push.forEach(function (a) {
    assert.equal(a.transitionKitPath, "core/transitions");
    assert.equal(a.catalogPath, "transitions/Metadata/catalog.json");
    assert.equal(a.implemented, true);
  });

  const catalog = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "transitions", "Metadata", "catalog.json"), "utf8")
  );
  const byId = {};
  catalog.transitions.forEach(function (row) {
    byId[row.id] = row;
  });
  push.forEach(function (a) {
    assert.ok(byId[a.transitionKitId], "catalog missing " + a.transitionKitId);
    assert.equal(byId[a.transitionKitId].implemented, true);
  });
});

test("Lucide subset is real SVGs + LICENSE; no vendor AE binaries in pack", function () {
  const license = fs.readFileSync(path.join(LUCIDE, "LICENSE"), "utf8");
  assert.match(license, /ISC License/);
  assert.match(license, /The MIT License/);

  const svgDir = path.join(LUCIDE, "svg");
  const svgs = fs.readdirSync(svgDir).filter(function (f) {
    return f.endsWith(".svg");
  });
  assert.ok(svgs.length >= 30, "expected curated set");
  assert.ok(svgs.length <= 60, "do not vendor the whole icon library");
  svgs.forEach(function (f) {
    const body = fs.readFileSync(path.join(svgDir, f), "utf8");
    assert.match(body, /<svg/);
  });

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const lucide = registry.assets.filter(function (a) {
    return a.status === "VENDORED";
  });
  assert.equal(lucide.length, svgs.length);
  lucide.forEach(function (a) {
    assert.equal(a.sourceType, "thirdParty");
    assert.equal(a.downloaded, true);
    assert.equal(a.commercialUse, true);
    assert.notEqual(a.owner, "Evotechly");
    assert.ok(a.files.length);
    a.files.forEach(function (rel) {
      assert.ok(fs.existsSync(path.join(PACK, rel.replace(/^Evotechly-SaaS-Assets\//, ""))), rel);
    });
  });

  const forbidden = [".aex", ".plugin", ".jsxbin", ".mbr", ".aep", ".ffx", ".zip", ".mp3", ".wav"];
  walkFiles(PACK).forEach(function (file) {
    const ext = path.extname(file).toLowerCase();
    assert.ok(forbidden.indexOf(ext) === -1, "forbidden binary " + file);
  });
});
