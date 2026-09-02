"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { generateMotion, runEngine, exportAE } = require("../api/motionAPI");
const { resolveMotion } = require("../core/resolver");
const { mapFigmaType } = require("../pipeline/typeMapper");
const { normalize } = require("../pipeline/normalizer");

const sample = {
  frameName: "Dashboard",
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

test("resolver: text fadeUp delay 0; card scaleIn delay 0.06 at index 1", function () {
  const text = resolveMotion({ name: "Title", type: "text" }, 0);
  assert.equal(text.preset, "fadeUp");
  assert.equal(text.delay, 0);
  const card = resolveMotion({ name: "Card", type: "card" }, 1);
  assert.equal(card.preset, "scaleIn");
  assert.equal(card.delay, 0.06);
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
  assert.equal(layers[0].type, "text");
  assert.equal(layers[1].name, "Lower");
  assert.equal(layers[1].type, "card");
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
