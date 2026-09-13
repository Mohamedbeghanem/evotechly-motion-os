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

test("glassPanel is deterministic native frost with EVO_GLASS", function () {
  const a = S.glassPanel({ layer: "Card 1", opacity: 42, blur: 18 });
  const b = S.glassPanel({ layer: "Card 1", opacity: 42, blur: 18 });
  assert.deepEqual(a, b);
  assert.equal(a.kind, "glassPanel");
  assert.equal(a.controller.name, "EVO_GLASS");
  assert.equal(a.layer.name, "Card 1");
  assert.equal(a.layer.opacity, 42);
  assert.equal(a.layer.blur, 18);
  assert.ok(a.effects.indexOf("ADBE Fast Box Blur") !== -1);
  assert.ok(a.effects.indexOf("ADBE Tint") !== -1);
  assert.equal(a.fallbackBlur, "ADBE Gaussian Blur 2");
  assert.ok(a.expression.blur.indexOf("EVO_GLASS") !== -1);
  assert.ok(a.expression.opacity.indexOf("Opacity") !== -1);
  assert.ok(a.note.indexOf("Liquid Glass") !== -1);
  assert.ok(JSON.stringify(a).indexOf(".mbr") === -1);
  assert.ok(JSON.stringify(a).indexOf("Deep Glow") === -1);
  const many = S.glassPanel({ layers: layers, blur: 99 });
  assert.equal(many.layers.length, 3);
  assert.equal(many.controller.sliders[1].value, 80);
  assert.equal(S.glassPanel({}).layer.name, "Glass Panel");
});

test("gradientWipeReveal keys match Phase 1 ease and directions", function () {
  const left = S.gradientWipeReveal({
    layer: "Screenshot",
    duration: 0.55,
    direction: "left",
    ease: "apple"
  });
  const again = S.gradientWipeReveal({
    layer: "Screenshot",
    duration: 0.55,
    direction: "left",
    ease: "apple"
  });
  assert.deepEqual(left, again);
  assert.equal(left.kind, "gradientWipeReveal");
  assert.equal(left.effect, "ADBE Gradient Wipe");
  assert.equal(left.fallback, "shapeMatte");
  assert.equal(left.side, "left");
  assert.equal(left.mode, "in");
  assert.equal(left.layer.completionKeys[0].completion, 100);
  assert.equal(left.layer.completionKeys[1].completion, 0);
  assert.equal(left.layer.completionKeys[1].t, 0.55);
  assert.equal(left.easeInfluences.influenceIn, 80);
  assert.equal(S.gradientWipeReveal({ layer: "A", ease: "soft" }).easeInfluences.influenceIn, 40);
  assert.equal(S.gradientWipeReveal({ layer: "A", ease: "linear" }).easeInfluences.influenceIn, 16);
  assert.equal(S.wipeCompletionAt(0, 1, "left"), 100);
  assert.equal(S.wipeCompletionAt(1, 1, "left"), 0);
  assert.equal(S.wipeCompletionAt(0.5, 1, "left"), 50);
  assert.equal(S.wipeCompletionAt(0, 1, "out"), 0);
  assert.equal(S.wipeCompletionAt(1, 1, "out"), 100);
  assert.equal(S.wipeCompletionAt(0.55 + S.WIPE.hold, 0.55, "both"), 0);
  assert.equal(S.normalizeWipeDirection("RIGHT"), "right");
  assert.equal(S.normalizeWipeDirection("in"), "left");
  assert.equal(S.normalizeWipeDirection("out"), "out");
  const both = S.gradientWipeReveal({ layer: "Card 1", direction: "both", duration: 0.4 });
  assert.equal(both.layer.completionKeys.length, 4);
  assert.equal(both.layer.completionKeys[3].completion, 100);
  const up = S.gradientWipeReveal({ layers: layers, direction: "up" });
  assert.equal(up.side, "up");
  assert.equal(up.layers.length, 3);
  assert.ok(left.note.indexOf("No Saber") !== -1);
  assert.equal(left.effect.indexOf("Saber"), -1);
});

test("proximityHover expressions pair with Phase 1 Cursor", function () {
  const a = S.proximityHover({
    layers: layers,
    radius: 140,
    scaleBoost: 6,
    opacityBoost: 18
  });
  const b = S.proximityHover({
    layers: layers,
    radius: 140,
    scaleBoost: 6,
    opacityBoost: 18
  });
  assert.deepEqual(a, b);
  assert.equal(a.kind, "proximityHover");
  assert.equal(a.driver, "Cursor");
  assert.equal(a.controller.name, "EVO_HOVER");
  assert.equal(a.radius, 140);
  assert.equal(a.scaleBoost, 6);
  assert.ok(a.expression.scale.indexOf("Cursor") !== -1);
  assert.ok(a.expression.scale.indexOf("EVO_HOVER") !== -1);
  assert.ok(a.expression.opacity.indexOf("Opacity Boost") !== -1);
  assert.ok(a.note.indexOf("Cursor") !== -1);
  assert.equal(S.proximityFactor(0, 140), 1);
  assert.equal(S.proximityFactor(140, 140), 0);
  assert.equal(S.proximityFactor(70, 140), 0.5);
  assert.equal(S.hoverScaleAt(0, 140, 6, 100), 106);
  assert.equal(S.hoverScaleAt(140, 140, 6, 100), 100);
  assert.equal(S.hoverOpacityAt(0, 140, 18, 82), 100);
  assert.equal(a.layers[0].scaleAtCenter, 106);
  const custom = S.proximityHover({ layers: ["CTA"], driver: "Pointer", radius: 0 });
  assert.equal(custom.driver, "Pointer");
  assert.equal(custom.radius, 1);
});

test("Phase 1 APIs stay exported next to Phase 2", function () {
  assert.equal(typeof S.createCursor, "function");
  assert.equal(typeof S.depthReveal, "function");
  assert.equal(typeof S.staggerReveal, "function");
  assert.equal(typeof S.carouselSetup, "function");
  assert.equal(typeof S.glassPanel, "function");
  assert.equal(typeof S.gradientWipeReveal, "function");
  assert.equal(typeof S.proximityHover, "function");
  assert.equal(S.CURSOR.name, "Cursor");
  assert.equal(S.GLASS.controller, "EVO_GLASS");
  assert.equal(S.HOVER.driver, "Cursor");
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
  assert.ok(F.tabsForJob("saas")[0].indexOf("glass") !== -1);
  assert.ok(F.INSTALL_ORDER.filter(function (c) { return c.id === "liquidGlassPersonal"; })[0].note.indexOf("personal") !== -1);
  assert.ok(F.tabsForJob("talkingHead").some(function (t) { return t.indexOf("Person") === 0; }));
  assert.ok(S.COMPANIONS_POLICY.indexOf("Never redistributed") !== -1);
});
