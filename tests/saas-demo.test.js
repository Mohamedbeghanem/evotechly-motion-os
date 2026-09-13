"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const S = require("../core/saasDemo");
const F = require("../core/editorFreeKit");

const layers = [
  { name: "Card 1" },
  { name: "Card 2" },
  { name: "Card 3" }
];

test("createCursor is deterministic and uses a shape pointer", function () {
  const opts = {
    targetLayer: "CTA",
    startPos: [80, 90],
    endPos: [400, 320],
    duration: 0.6,
    clickAt: 0.55
  };
  const a = S.createCursor(opts);
  const b = S.createCursor(opts);
  assert.deepEqual(a, b);
  assert.equal(a.kind, "cursor");
  assert.equal(a.cursor.type, "shape");
  assert.equal(a.cursor.shape.kind, "pointer");
  assert.ok(a.cursor.shape.vertices.length >= 3);
  assert.equal(a.target.name, "CTA");
  assert.equal(a.cursor.positionKeys.length, 2);
  assert.equal(a.cursor.click.scaleKeys.length, 3);
  assert.equal(a.target.click.scaleKeys[1].scale[0], 94);
  assert.equal(a.cursor.click.scaleKeys[1].scale[0], 88);
});

test("createCursor clamps clickAt and duration", function () {
  const plan = S.createCursor({
    startPos: [0, 0],
    endPos: [100, 0],
    duration: 0.01,
    clickAt: 9
  });
  assert.equal(plan.cursor.duration, 0.05);
  assert.equal(plan.cursor.click.t, 0.05);
  assert.equal(S.createCursor({ clickAt: -2 }).cursor.click.t, 0);
});

test("cursorPosAt interpolates and clickScaleAt dips then recovers", function () {
  assert.deepEqual(S.cursorPosAt([0, 0], [100, 50], 0, 1), [0, 0]);
  assert.deepEqual(S.cursorPosAt([0, 0], [100, 50], 1, 1), [100, 50]);
  assert.deepEqual(S.cursorPosAt([0, 0], [100, 50], 0.5, 1), [50, 25]);
  assert.equal(S.clickScaleAt(0, 0.5, 0.12, 100, 0.88), 100);
  const dipT = 0.5 + 0.12 * S.CURSOR.dipRatio;
  assert.equal(S.clickScaleAt(dipT, 0.5, 0.12, 100, 0.88), 88);
  assert.equal(S.clickScaleAt(0.5 + 0.12, 0.5, 0.12, 100, 0.88), 100);
});

test("depthReveal assigns front-to-back depths and native blur", function () {
  const a = S.depthReveal({ layers: layers, focus: 50, strength: 0.24 });
  const b = S.depthReveal({ selected: layers, focus: 50, strength: 0.24 });
  assert.deepEqual(a, b);
  assert.equal(a.controller.name, "EVO_DEPTH");
  assert.ok(a.effects.indexOf("ADBE Glo2") !== -1);
  assert.equal(a.layers[0].depth, 0);
  assert.equal(a.layers[1].depth, 50);
  assert.equal(a.layers[2].depth, 100);
  assert.equal(a.layers[1].blur, 0);
  assert.equal(a.layers[0].blur, S.depthBlur(0, 50, 0.24));
  assert.ok(a.layers[0].glow);
  assert.equal(S.defaultDepth(0, 1), 50);
  assert.ok(a.note.indexOf("Deep Glow") !== -1);
});

test("staggerReveal offsets frames and supports in/out/both", function () {
  const inn = S.staggerReveal({
    layers: layers,
    direction: "in",
    offsetFrames: 3,
    ease: "apple"
  });
  const again = S.staggerReveal({
    layers: layers,
    direction: "in",
    offsetFrames: 3,
    ease: "apple"
  });
  assert.deepEqual(inn, again);
  assert.equal(inn.layers[0].delay, 0);
  assert.equal(inn.layers[1].delay, S.framesToSeconds(3, 30));
  assert.equal(inn.layers[2].delayFrames, 6);
  assert.equal(inn.layers[0].from.opacity, 0);
  assert.equal(inn.layers[0].to.opacity, 100);
  assert.equal(inn.easeInfluences.influenceIn, 80);

  const out = S.staggerReveal({ layers: layers, direction: "out", offsetFrames: 2, fps: 24 });
  assert.equal(out.direction, "out");
  assert.equal(out.layers[1].delay, S.staggerDelay(1, 2, 24));
  assert.equal(out.layers[0].from.opacity, 100);
  assert.equal(out.layers[0].to.opacity, 0);

  const both = S.staggerReveal({ layers: layers, direction: "both", offsetFrames: 3 });
  assert.ok(both.layers[0].out);
  assert.ok(both.layers[1].out.delay > both.layers[1].delay);
  assert.equal(both.layers[0].out.from.opacity, 100);
  assert.equal(S.normalizeEase("nope"), "apple");
});

test("carouselSetup offsets slides on the chosen axis", function () {
  const x = S.carouselSetup({
    layers: layers,
    axis: "x",
    gap: 1920,
    index: 1
  });
  const y = S.carouselSetup({
    layers: [{ name: "A", rest: [10, 20] }, { name: "B", rest: [10, 20] }],
    axis: "y",
    gap: 100,
    index: 0
  });
  assert.equal(x.controller.name, "EVO_CAROUSEL");
  assert.equal(x.axis, "x");
  assert.equal(x.slides[0].offset, -1920);
  assert.equal(x.slides[1].offset, 0);
  assert.deepEqual(x.slides[2].position, [1920, 0]);
  assert.equal(S.carouselOffset(2, 0, 100), 200);
  assert.deepEqual(S.carouselPosition("y", [10, 20], 100), [10, 120]);
  assert.equal(y.axis, "y");
  assert.ok(y.slides[1].expression.indexOf("EVO_CAROUSEL") !== -1);
  assert.equal(S.normalizeAxis("Y"), "y");
  assert.equal(S.normalizeAxis("sideways"), "x");
});

test("math helpers stay deterministic", function () {
  assert.equal(S.round4(1.23456), 1.2346);
  assert.equal(S.clamp(9, 0, 2), 2);
  assert.equal(S.lerp(0, 10, 0.25), 2.5);
  assert.deepEqual(S.lerp2([0, 0], [10, 10], 0.5), [5, 5]);
  assert.equal(S.framesToSeconds(15, 30), 0.5);
});

test("Editor Free Kit companions are optional and ordered", function () {
  assert.ok(F.POLICY.indexOf("not required") !== -1 || F.POLICY.indexOf("Not required") !== -1);
  assert.ok(F.POLICY.indexOf("not redistribute") !== -1 || F.POLICY.indexOf("does not redistribute") !== -1);
  assert.deepEqual(F.companionIds(), [
    "uiAnimatorPro",
    "pinRig",
    "aejuiceFree",
    "motionBroFree",
    "animationComposerFree",
    "crateLightWrap",
    "meowCaptions",
    "presetify",
    "vignetteTyperLite",
    "repeater",
    "paulPack",
    "liquidGlassPersonal"
  ]);
  assert.ok(F.companionsForJob("talkingHead").some(function (c) { return c.id === "crateLightWrap"; }));
  assert.ok(F.tabsForJob("saas")[0].indexOf("SaaS Demo Tools") !== -1);
  assert.ok(F.tabsForJob("talkingHead").some(function (t) { return t.indexOf("Person") === 0; }));
  assert.ok(S.COMPANIONS_POLICY.indexOf("Never redistributed") !== -1);
});
