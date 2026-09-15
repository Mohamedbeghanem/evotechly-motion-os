"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const polish = require("../core/polish");
const U = require("../core/uiPresets");
const easing = require("../core/transitions/easing");
const timing = require("../core/transitions/timing");
const target = require("../core/transitions/target");
const control = require("../core/transitions/control");
const engine = require("../core/transitions/engine");
const registry = require("../core/transitions/registry");

const jsxPath = path.join(__dirname, "..", "ae", "Evotechly Transitions.jsx");
const jsx = fs.readFileSync(jsxPath, "utf8");

test("easing IDs include premium presets and match polish / uiPresets pairs", function () {
  assert.deepEqual(easing.listEasing(), [
    "premium-smooth",
    "apple-smooth",
    "fast-product",
    "soft-ui",
    "snappy",
    "elastic-micro"
  ]);
  assert.deepEqual(easing.easeInfluences("apple-smooth"), polish.easePair("apple"));
  assert.deepEqual(easing.easeInfluences("apple"), polish.easePair("apple"));
  assert.deepEqual(easing.easeInfluences("soft-ui"), polish.easePair("soft"));
  assert.deepEqual(easing.easeInfluences("linear"), U.applyUiPreset({ layers: [{ name: "A" }], ease: "Linear" }).easeInfluences);
  assert.deepEqual(easing.easeInfluences("premium-smooth"), { influenceIn: 88, influenceOut: 14 });
  assert.deepEqual(easing.easeInfluences("fast-product"), { influenceIn: 72, influenceOut: 12 });
  assert.deepEqual(easing.easeInfluences("snappy"), { influenceIn: 55, influenceOut: 8 });
  assert.deepEqual(easing.easeInfluences("elastic-micro"), { influenceIn: 35, influenceOut: 78 });
  assert.equal(easing.normalizeEase("not-a-curve"), "premium-smooth");
  assert.equal(easing.easeFromIndex(0), "premium-smooth");
  assert.equal(easing.easeFromIndex(2), "fast-product");
});

test("timing groups convert frames and seconds at 30 and 24 fps", function () {
  assert.equal(timing.durationFrames("MICRO", 30), 6);
  assert.equal(timing.durationFrames("FAST", 30), 10);
  assert.equal(timing.durationFrames("STANDARD", 30), 15);
  assert.equal(timing.durationFrames("SMOOTH", 30), 21);
  assert.equal(timing.durationFrames("HERO", 30), 30);
  assert.equal(timing.durationFrames("STANDARD", 24), 12);
  assert.equal(timing.secondsFromFrames(15, 30), 0.5);
  assert.equal(timing.secondsFromFrames(16, 30), 0.5333);
  assert.equal(timing.normalizeTimingGroup("smooth"), "SMOOTH");
  assert.equal(timing.durationFrames(20, 30), 20);
  assert.deepEqual(timing.timingSpec("STANDARD").min, 12);
  assert.deepEqual(timing.timingSpec("STANDARD").max, 18);
});

test("planTargetZoom frames a centered and an offset region", function () {
  const centered = target.planTargetZoom({
    compW: 1920,
    compH: 1080,
    layerBounds: { l: 760, t: 340, r: 1160, b: 740 },
    padding: 80
  });
  assert.equal(centered.valid, true);
  assert.deepEqual(centered.scale, [230, 230]);
  assert.equal(centered.scaleFactor, 2.3);
  assert.deepEqual(centered.positionDelta, [0, 0]);
  assert.deepEqual(centered.targetCenter, [960, 540]);

  const offset = target.planTargetZoom({
    compW: 1920,
    compH: 1080,
    layerBounds: { left: 100, top: 100, right: 500, bottom: 400 },
    padding: 80
  });
  assert.equal(offset.valid, true);
  assert.equal(offset.scaleFactor, 3.0667);
  assert.deepEqual(offset.scale, [306.6667, 306.6667]);
  assert.deepEqual(offset.positionDelta, [2024, 889.3333]);
  assert.deepEqual(offset.targetCenter, [300, 250]);

  const bad = target.planTargetZoom({
    compW: 1920,
    compH: 1080,
    layerBounds: { l: 10, t: 10, r: 10, b: 10 }
  });
  assert.equal(bad.valid, false);
  assert.deepEqual(bad.scale, [100, 100]);
  assert.deepEqual(bad.positionDelta, [0, 0]);
});

test("control plan is a shy null with the documented sliders", function () {
  const plan = control.planTransitionControl({
    group: "STANDARD",
    fps: 30,
    ease: "fast-product",
    direction: "up"
  });
  assert.equal(plan.name, "EVOTECHLY_TRANSITION_CONTROL");
  assert.equal(plan.shy, true);
  assert.equal(plan.guide, true);
  const names = plan.sliders.map(function (s) {
    return s.name;
  });
  assert.deepEqual(names, [
    "Progress",
    "Duration",
    "Direction",
    "Strength",
    "Distance",
    "Scale",
    "TargetScale",
    "Blur",
    "Overshoot",
    "Depth",
    "Opacity",
    "CornerRadius",
    "MaskExpansion",
    "Stagger",
    "Settle",
    "Easing"
  ]);
  assert.equal(plan.values.Duration, 15);
  assert.equal(plan.values.Direction, 2);
  assert.equal(plan.values.Easing, 2);
  assert.equal(plan.easing.id, "fast-product");
  assert.ok(plan.note.indexOf("metadata") !== -1);
});

test("six UI Push plans are deterministic and complete", function () {
  const ids = engine.IMPLEMENTED_IDS.slice();
  assert.deepEqual(ids, [
    "EVT_UI_PUSH_LEFT",
    "EVT_UI_PUSH_RIGHT",
    "EVT_UI_PUSH_UP",
    "EVT_UI_PUSH_DOWN",
    "EVT_UI_PUSH_SCALE",
    "EVT_UI_PUSH_DEPTH"
  ]);
  ids.forEach(function (id) {
    const opts = {
      id: id,
      outgoing: { name: "Dashboard", position: [960, 540] },
      incoming: { name: "Analytics", position: [960, 540] },
      durationFrames: 16,
      fps: 30,
      ease: "premium-smooth"
    };
    const a = engine.applyTransitionPlan(opts);
    const b = engine.applyTransitionPlan(opts);
    assert.deepEqual(a, b, id + " must be deterministic");
    assert.equal(a.kind, "transition");
    assert.equal(a.implemented, true);
    assert.equal(a.style, "premium-saas");
    assert.equal(a.undo, "Evotechly Transition · " + a.id);
    assert.equal(a.control.name, "EVOTECHLY_TRANSITION_CONTROL");
    assert.equal(a.layers.length, 2);
    assert.ok(a.outgoing.set.position.length >= 3);
    assert.ok(a.outgoing.set.scale.length >= 3);
    assert.ok(a.outgoing.set.opacity.length >= 3);
    assert.ok(a.outgoing.set.blur.length >= 3);
    assert.ok(a.incoming.set.position.length >= 3);
    assert.equal(a.markers.length, 4);
    assert.equal(a.markers[2].name, "EVT_SFX_CROSSOVER");
    assert.ok(a.anatomy.anticipate);
    assert.ok(a.anatomy.action);
    assert.ok(a.anatomy.crossover);
    assert.ok(a.anatomy.settle);
  });
});

test("UI Push left / right / up / down travel on the named axis", function () {
  const left = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_LEFT", durationFrames: 16, fps: 30 });
  const right = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_RIGHT", durationFrames: 16, fps: 30 });
  const up = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_UP", durationFrames: 16, fps: 30 });
  const down = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_DOWN", durationFrames: 16, fps: 30 });

  assert.equal(left.direction, "left");
  assert.equal(left.travel.distance, 1920);
  assert.equal(left.outgoing.keys[0].x, 0);
  assert.equal(left.outgoing.keys[1].x, 16);
  assert.equal(left.outgoing.keys[2].x, -960);
  assert.equal(left.outgoing.keys[3].x, -1920);
  assert.equal(left.outgoing.keys[3].opacity, 0);
  assert.equal(left.incoming.keys[0].x, 1920);
  assert.equal(left.incoming.keys[3].x, 0);
  assert.equal(left.incoming.keys[3].opacity, 100);

  assert.equal(right.outgoing.keys[3].x, 1920);
  assert.equal(right.incoming.keys[0].x, -1920);
  assert.equal(up.outgoing.keys[3].y, -1080);
  assert.equal(up.incoming.keys[0].y, 1080);
  assert.equal(down.outgoing.keys[3].y, 1080);
  assert.equal(down.incoming.keys[0].y, -1080);
});

test("direction override remaps the four directional IDs", function () {
  const plan = engine.applyTransitionPlan({
    id: "EVT_UI_PUSH_LEFT",
    direction: "right",
    durationFrames: 16
  });
  assert.equal(plan.id, "EVT_UI_PUSH_RIGHT");
  assert.equal(plan.direction, "right");
});

test("scale and depth pushes key scale / blur without full-frame travel", function () {
  const scale = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_SCALE", durationFrames: 16, fps: 30 });
  assert.deepEqual(
    scale.outgoing.keys.map(function (k) {
      return k.scale[0] + "/" + k.opacity;
    }),
    ["100/100", "101.2/100", "96/42", "88/0"]
  );
  assert.equal(scale.incoming.keys[0].scale[0], 110);
  assert.equal(scale.incoming.keys[3].scale[0], 100);
  assert.equal(scale.travel.distance, 0);

  const depth = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_DEPTH", durationFrames: 16, fps: 30 });
  assert.equal(depth.outgoing.keys[3].blur, 16);
  assert.equal(depth.outgoing.keys[3].scale[0], 92);
  assert.equal(depth.incoming.keys[0].y, -16);
  assert.equal(depth.incoming.keys[0].blur, 14);
  assert.equal(depth.incoming.keys[3].y, 0);
  assert.equal(depth.incoming.keys[3].blur, 0);
});

test("unimplemented catalog IDs return a safe stub plan", function () {
  const plan = engine.applyTransitionPlan({ id: "EVT_MICRO_HOVER" });
  assert.equal(plan.implemented, false);
  assert.ok(plan.description.indexOf("later phase") !== -1);
  assert.equal(plan.outgoing.set.position.length, 0);
});

test("catalog has unique EVT_ IDs and Phase 1 implemented flags", function () {
  const list = registry.loadCatalog();
  assert.ok(list.length >= 90);
  assert.deepEqual(registry.uniqueIdErrors(), []);
  assert.deepEqual(registry.implementedFlagErrors(), []);
  const ids = registry.catalogIds();
  const set = {};
  ids.forEach(function (id) {
    assert.ok(/^EVT_[A-Z0-9_]+$/.test(id), id);
    assert.equal(set[id], undefined, id);
    set[id] = true;
  });
  const implemented = registry.listImplemented();
  assert.equal(implemented.length, 6);
  implemented.forEach(function (row) {
    assert.equal(row.implemented, true);
    assert.equal(row.style, "premium-saas");
    assert.equal(row.phase, 1);
    assert.ok(row.aspectRatios.indexOf("16:9") !== -1);
    assert.ok(row.aspectRatios.indexOf("9:16") !== -1);
    assert.ok(row.aspectRatios.indexOf("1:1") !== -1);
    assert.ok(row.aspectRatios.indexOf("4:5") !== -1);
  });
  assert.equal(registry.getById("EVT_UI_PUSH_LEFT").category, "UI-Push");
  assert.equal(registry.getById("evt-ui-push-depth").implemented, true);
  assert.equal(registry.filterCatalog({ query: "micro", category: "Micro" }).length, 8);
  assert.equal(registry.categories().length, 16);
});

test("demo storyboard is a dashboard→card→analytics sequence", function () {
  const story = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "transitions", "Examples", "demo-storyboard.json"), "utf8")
  );
  assert.equal(story.phase, 16);
  assert.ok(story.beats.length >= 4);
  assert.equal(story.beats[0].from, "Dashboard");
  assert.equal(story.beats[0].to, "CardDetail");
  assert.equal(story.beats[0].id, "EVT_UI_PUSH_LEFT");
  assert.equal(story.beats[1].to, "Analytics");
  assert.ok(story.note.indexOf("Phase 16") !== -1);
});

test("JSX companion embeds Phase 1 IDs and mirrored constants", function () {
  engine.IMPLEMENTED_IDS.forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX");
  });
  assert.ok(jsx.indexOf("EVOTECHLY_TRANSITION_CONTROL") !== -1);
  assert.ok(jsx.indexOf("premium-smooth") !== -1);
  assert.ok(jsx.indexOf("influenceIn: 88") !== -1 || jsx.indexOf("i: 88") !== -1);
  assert.ok(jsx.indexOf("Node is source of truth") !== -1 || jsx.indexOf("source of truth") !== -1);
  assert.ok(jsx.indexOf("function applyTransition") !== -1 || jsx.indexOf("function runApply") !== -1);
  assert.ok(/#target aftereffects/.test(jsx));
  assert.ok(jsx.indexOf("does not replace") !== -1);
  registry.catalogIds().forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX catalog");
  });
  const hub = fs.readFileSync(path.join(__dirname, "..", "ae", "SaaS Demo Tools.jsx"), "utf8");
  assert.ok(hub.indexOf("Evotechly Transitions") !== -1);
});
