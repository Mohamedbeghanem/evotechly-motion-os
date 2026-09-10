"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { generateMotion, runEngine, exportAE } = require("../api/motionAPI");
const { resolveMotion } = require("../core/resolver");
const { mapFigmaType } = require("../pipeline/typeMapper");
const { normalize } = require("../pipeline/normalizer");
const { detectRole } = require("../core/roles");

const sample = {
  frameName: "Dashboard",
  style: "stripe",
  layers: [
    { name: "Title", type: "text", x: 120, y: 80, width: 400, height: 48 },
    { name: "Card 1", type: "rectangle", x: 120, y: 200, width: 300, height: 180 },
    { name: "Card 2", type: "rectangle", x: 440, y: 200, width: 300, height: 180 },
    { name: "CTA", type: "rectangle", x: 120, y: 420, width: 160, height: 44 }
  ]
};

test("generateMotion is deterministic", function () {
  const a = generateMotion(sample);
  const b = generateMotion(sample);
  assert.deepEqual(a, b);
});

test("runEngine aliases generateMotion", function () {
  assert.deepEqual(runEngine(sample), generateMotion(sample));
});

test("roles: Title is title/fadeUp; Card is card/scaleIn; CTA is cta", function () {
  assert.equal(detectRole({ name: "Title", type: "text" }), "title");
  assert.equal(detectRole({ name: "Card 2", type: "rectangle" }), "card");
  assert.equal(detectRole({ name: "CTA", type: "rectangle" }), "cta");
  const title = resolveMotion({ name: "Title", type: "text" }, 0);
  assert.equal(title.preset, "fadeUp");
  const card = resolveMotion({ name: "Card", type: "card" }, 0);
  assert.equal(card.preset, "scaleIn");
});

test("saas hero: cards stagger, CTA comes after the group, two runs match bytes", function () {
  const hero = JSON.parse(require("fs").readFileSync(
    require("path").join(__dirname, "..", "examples", "saas-hero.json"),
    "utf8"
  ));
  const a = generateMotion(hero);
  const b = generateMotion(hero);
  assert.deepEqual(a, b);
  const byName = {};
  a.layers.forEach(function (l) { byName[l.layer] = l; });
  assert.equal(byName.Title.role, "title");
  assert.equal(byName["Card 1"].preset, "scaleIn");
  assert.ok(byName["Card 2"].delay > byName["Card 1"].delay);
  assert.ok(byName["Card 3"].delay > byName["Card 2"].delay);
  assert.ok(byName.CTA.delay >= byName["Card 3"].delay);
  assert.ok(byName.Cursor.delay >= byName.CTA.delay);
});

test("pipeline: rectangle→card, frame→dashboard, parentId kept, y-order", function () {
  assert.equal(mapFigmaType("rectangle"), "card");
  assert.equal(mapFigmaType("frame"), "dashboard");
  const layers = normalize({
    layers: [
      { name: "Lower", type: "rectangle", x: 0, y: 200, parentId: "p1" },
      { name: "Upper", type: "text", x: 0, y: 40, parentId: "p1" }
    ]
  });
  assert.equal(layers[0].name, "Upper");
  assert.equal(layers[1].name, "Lower");
  assert.equal(layers[1].parentId, "p1");
  const framed = normalize({
    frames: [{ layers: [{ name: "Shell", type: "frame", y: 0, x: 0, parentId: "root" }] }]
  });
  assert.equal(framed[0].type, "dashboard");
  assert.equal(framed[0].parentId, "root");
});

test("exportAE: schema, name+layer, keyframes, easingAE, deterministic", function () {
  const a = exportAE(sample);
  const b = exportAE(sample);
  assert.equal(a.schema, "evotechly.motion.ae.v1");
  assert.deepEqual(a, b);
  for (let i = 0; i < a.layers.length; i++) {
    const layer = a.layers[i];
    assert.equal(layer.name, layer.layer);
    assert.equal(layer.keyframes.length, 2);
    assert.ok(layer.easingAE);
  }
});
