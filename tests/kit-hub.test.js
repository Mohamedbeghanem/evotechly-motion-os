"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const F = require("../core/editorFreeKit");
const H = require("../core/kitHub");

const jsxPath = path.join(__dirname, "..", "ae", "SaaS Demo Tools.jsx");
const jsx = fs.readFileSync(jsxPath, "utf8");

test("Kit Hub matrix matches Editor Free Kit install order", function () {
  const entries = H.kitHubEntries();
  assert.equal(entries.length, F.INSTALL_ORDER.length);
  assert.deepEqual(
    entries.map(function (c) {
      return c.id;
    }),
    F.companionIds()
  );
  entries.forEach(function (c, i) {
    assert.equal(c.name, F.INSTALL_ORDER[i].name);
    assert.equal(c.url, F.INSTALL_ORDER[i].url);
    assert.ok(H.isOfficialUrl(c.url), c.id + " must be an official https URL");
  });
  assert.ok(H.HUB_POLICY.indexOf("Never download") !== -1);
  assert.ok(H.HUB_POLICY.indexOf("Official URLs") !== -1);
});

test("officialUrl / clipboard / alert are URL-only (no binaries)", function () {
  assert.equal(H.officialUrl("uiAnimatorPro"), "https://whatstudio.gumroad.com/");
  assert.equal(H.officialUrl("UI Animator Pro"), "https://whatstudio.gumroad.com/");
  assert.equal(H.clipboardText("crateLightWrap"), "https://www.productioncrate.com/plugins/crates-light-wrap");
  assert.equal(H.officialUrl("missing-kit"), null);
  assert.equal(H.companionAlert("nope"), null);

  const alertText = H.companionAlert("liquidGlassPersonal");
  assert.ok(alertText.indexOf("Liquid Glass") !== -1);
  assert.ok(alertText.indexOf("https://bentomotion.gumroad.com/l/glass-ae") !== -1);
  assert.ok(alertText.indexOf("never downloads") !== -1);
  assert.ok(alertText.indexOf(".aex") === -1);

  assert.equal(H.isOfficialUrl("http://example.com"), false);
  assert.equal(H.isOfficialUrl("https://evil.example/pack.zip"), false);
  assert.equal(H.isOfficialUrl("https://aejuice.com"), true);
});

test("Hub SaaS actions include existing engines plus seed surface", function () {
  assert.deepEqual(H.saasActionIds(), [
    "cursor",
    "depth",
    "stagger",
    "carousel",
    "glass",
    "wipe",
    "hover"
  ]);
  assert.equal(H.GOLDEN_SEED.script, "ae/Seed Golden Project.jsx");
  assert.ok(H.HUB_SURFACE.window.indexOf("SaaS Demo Tools") !== -1);
  assert.ok(H.HUB_SURFACE.alias.indexOf("Motion OS Hub") !== -1);
  assert.ok(H.HUB_SURFACE.note.indexOf("Does not replace v0.32") !== -1);
  assert.ok(H.HUB_SURFACE.note.indexOf("297") !== -1);
});

test("SaaS Demo Tools.jsx is the Motion OS Hub and keeps every engine", function () {
  assert.ok(jsx.indexOf("Motion OS Hub") !== -1);
  assert.ok(jsx.indexOf("Kit Hub") !== -1);
  assert.ok(/never download/i.test(jsx));

  [
    "function runCursor",
    "function runDepth",
    "function runStagger",
    "function runCarousel",
    "function runGlass",
    "function runWipe",
    "function runHover",
    "function runSeedGolden"
  ].forEach(function (fn) {
    assert.ok(jsx.indexOf(fn) !== -1, fn);
  });

  H.kitHubEntries().forEach(function (c) {
    assert.ok(jsx.indexOf(c.url) !== -1, c.id + " URL missing from hub JSX");
    assert.ok(jsx.indexOf(c.name) !== -1, c.name + " missing from hub JSX");
  });
});
