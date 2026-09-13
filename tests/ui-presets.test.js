"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const U = require("../core/uiPresets");

const cards = [
  { name: "Card 1", x: 200 },
  { name: "Card 2", x: 960 },
  { name: "Card 3", x: 1600 }
];

test("built-in pack lists six native presets", function () {
  assert.deepEqual(U.listUiPresets(), [
    "fade-up",
    "fade-scale",
    "slide-left",
    "slide-right",
    "slide-up",
    "pop"
  ]);
  U.listUiPresets().forEach(function (id) {
    assert.equal(U.UI_PRESETS[id].id, id);
  });
});

test("applyUiPreset is deterministic", function () {
  const opts = {
    layers: cards,
    presetId: "fade-up",
    direction: "in",
    duration: 0.5,
    staggerFrames: 3,
    ease: "Apple",
    mirror: false
  };
  assert.deepEqual(U.applyUiPreset(opts), U.applyUiPreset(opts));
});

test("fade-up enters from below and fades in", function () {
  const plan = U.applyUiPreset({
    layers: [{ name: "Card 1" }],
    presetId: "fade-up",
    direction: "in",
    duration: 0.5,
    staggerFrames: 0
  });
  assert.equal(plan.kind, "uiPreset");
  assert.equal(plan.presetId, "fade-up");
  assert.equal(plan.layers[0].from.opacity, 0);
  assert.equal(plan.layers[0].from.y, 16);
  assert.equal(plan.layers[0].from.x, 0);
  assert.equal(plan.layers[0].to.opacity, 100);
  assert.equal(plan.layers[0].to.y, 0);
  assert.deepEqual(plan.layers[0].to.scale, [100, 100]);
});

test("fade-scale fades while scaling toward 100", function () {
  const plan = U.applyUiPreset({ layers: [{ name: "A" }], presetId: "fade-scale" });
  assert.equal(plan.layers[0].from.opacity, 0);
  assert.deepEqual(plan.layers[0].from.scale, [92, 92]);
  assert.deepEqual(plan.layers[0].to.scale, [100, 100]);
  assert.equal(plan.layers[0].from.x, 0);
  assert.equal(plan.layers[0].from.y, 0);
});

test("slide-left / slide-right / slide-up travel on the named axis", function () {
  const left = U.applyUiPreset({ layers: [{ name: "L" }], presetId: "slide-left" });
  const right = U.applyUiPreset({ layers: [{ name: "R" }], presetId: "slide-right" });
  const up = U.applyUiPreset({ layers: [{ name: "U" }], presetId: "slide-up" });
  assert.equal(left.layers[0].from.x, 24);
  assert.equal(left.layers[0].from.y, 0);
  assert.equal(right.layers[0].from.x, -24);
  assert.equal(up.layers[0].from.y, 24);
  assert.equal(up.layers[0].from.x, 0);
  assert.equal(left.layers[0].to.x, 0);
  assert.equal(left.layers[0].from.opacity, 0);
  assert.equal(left.layers[0].to.opacity, 100);
});

test("pop scales 90 → 100", function () {
  const plan = U.applyUiPreset({
    layers: [{ name: "CTA" }],
    presetId: "pop",
    ease: "Apple"
  });
  assert.deepEqual(plan.layers[0].from.scale, [90, 90]);
  assert.deepEqual(plan.layers[0].to.scale, [100, 100]);
  assert.equal(plan.layers[0].from.opacity, 0);
  assert.equal(plan.ease, "apple");
});

test("staggerFrames converts to seconds at the given fps", function () {
  const plan = U.applyUiPreset({
    layers: cards,
    presetId: "fade-up",
    staggerFrames: 3,
    fps: 30
  });
  assert.equal(plan.staggerFrames, 3);
  assert.equal(plan.staggerSec, 0.1);
  assert.equal(plan.layers[0].delay, 0);
  assert.equal(plan.layers[1].delay, 0.1);
  assert.equal(plan.layers[2].delay, 0.2);
  assert.equal(plan.layers[2].delayFrames, 6);

  const film = U.applyUiPreset({
    layers: cards,
    presetId: "fade-up",
    staggerFrames: 2,
    fps: 24
  });
  assert.equal(film.layers[1].delay, 0.0833);
});

test("direction in / out / both reverse the same travel", function () {
  const inn = U.applyUiPreset({
    layers: [{ name: "Card 1" }],
    presetId: "fade-up",
    direction: "in"
  });
  const out = U.applyUiPreset({
    layers: [{ name: "Card 1" }],
    presetId: "fade-up",
    direction: "out"
  });
  const both = U.applyUiPreset({
    layers: [{ name: "Card 1" }],
    presetId: "fade-up",
    direction: "both",
    duration: 0.5
  });

  assert.equal(inn.direction, "in");
  assert.equal(inn.layers[0].from.opacity, 0);
  assert.equal(inn.layers[0].to.opacity, 100);
  assert.ok(!inn.layers[0].out);

  assert.equal(out.direction, "out");
  assert.equal(out.layers[0].from.opacity, 100);
  assert.equal(out.layers[0].from.y, 0);
  assert.equal(out.layers[0].to.opacity, 0);
  assert.equal(out.layers[0].to.y, 16);

  assert.equal(both.direction, "both");
  assert.equal(both.layers[0].from.opacity, 0);
  assert.equal(both.layers[0].to.opacity, 100);
  assert.ok(both.layers[0].out);
  assert.equal(both.layers[0].out.from.opacity, 100);
  assert.equal(both.layers[0].out.to.opacity, 0);
  assert.equal(both.layers[0].out.to.y, 16);
  assert.equal(both.layers[0].out.delay, 0.5 + U.UI_PRESET_DEFAULTS.hold);
});

test("mirror inverts X only for layers left of comp center", function () {
  const plan = U.applyUiPreset({
    layers: cards,
    presetId: "slide-left",
    mirror: true,
    compWidth: 1920
  });
  assert.equal(plan.mirror, true);
  assert.equal(plan.compCenterX, 960);
  assert.equal(plan.layers[0].mirrored, true);
  assert.equal(plan.layers[0].from.x, -24);
  assert.equal(plan.layers[1].mirrored, false);
  assert.equal(plan.layers[1].from.x, 24);
  assert.equal(plan.layers[2].mirrored, false);
  assert.equal(plan.layers[2].from.x, 24);

  const off = U.applyUiPreset({
    layers: cards,
    presetId: "slide-left",
    mirror: false
  });
  assert.equal(off.layers[0].from.x, 24);
  assert.equal(off.layers[0].mirrored, false);
});

test("mirror also flips slide-right on the left half", function () {
  const plan = U.applyUiPreset({
    layers: [{ name: "Left", position: [100, 200] }, { name: "Right", rest: [1400, 200] }],
    presetId: "slide-right",
    mirror: true,
    compCenterX: 960
  });
  assert.equal(plan.layers[0].from.x, 24);
  assert.equal(plan.layers[1].from.x, -24);
});

test("unknown preset / ease / direction fall back safely", function () {
  const plan = U.applyUiPreset({
    layers: [{ name: "A" }],
    presetId: "not-a-real-preset",
    ease: "Bounce",
    direction: "sideways"
  });
  assert.equal(plan.presetId, "fade-up");
  assert.equal(plan.ease, "apple");
  assert.equal(plan.direction, "in");
  assert.equal(U.normalizePresetId("Fade Scale"), "fade-scale");
  assert.equal(U.normalizePresetId("slideRight"), "slide-right");
  assert.equal(U.normalizeUiEase("Soft"), "soft");
  assert.equal(U.normalizeUiEase("Linear"), "linear");
});

test("Apple / Soft / Linear ease influences are stable", function () {
  const apple = U.applyUiPreset({ layers: cards, ease: "Apple" });
  const soft = U.applyUiPreset({ layers: cards, ease: "Soft" });
  const linear = U.applyUiPreset({ layers: cards, ease: "Linear" });
  assert.deepEqual(apple.easeInfluences, { influenceIn: 80, influenceOut: 18 });
  assert.deepEqual(soft.easeInfluences, { influenceIn: 40, influenceOut: 40 });
  assert.deepEqual(linear.easeInfluences, { influenceIn: 16, influenceOut: 16 });
  assert.equal(apple.ease, "apple");
  assert.equal(soft.ease, "soft");
  assert.equal(linear.ease, "linear");
});

test("duration and staggerFrames clamp", function () {
  const tiny = U.applyUiPreset({ layers: cards, duration: 0.01, staggerFrames: -4 });
  const huge = U.applyUiPreset({ layers: cards, duration: 99, staggerFrames: 400 });
  assert.equal(tiny.duration, 0.05);
  assert.equal(tiny.staggerFrames, 0);
  assert.equal(huge.duration, 30);
  assert.equal(huge.staggerFrames, 120);
});

test("defaults match the documented pack", function () {
  const plan = U.applyUiPreset({ layers: [{ name: "Card 1" }] });
  assert.equal(plan.presetId, "fade-up");
  assert.equal(plan.direction, "in");
  assert.equal(plan.duration, 0.5);
  assert.equal(plan.staggerFrames, 3);
  assert.equal(plan.ease, "apple");
  assert.equal(plan.mirror, false);
  assert.equal(plan.hold, 0.2);
});
