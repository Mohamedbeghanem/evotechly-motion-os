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

test("planBoundsMorph matches card rect to detail without mesh", function () {
  const morph = target.planBoundsMorph({
    fromBounds: { l: 240, t: 300, r: 720, b: 660 },
    toBounds: { l: 280, t: 80, r: 1640, b: 1000 }
  });
  assert.equal(morph.valid, true);
  assert.deepEqual(morph.fromCenter, [480, 480]);
  assert.deepEqual(morph.toCenter, [960, 540]);
  assert.deepEqual(morph.positionDelta, [480, 60]);
  assert.deepEqual(morph.scale, [283.3333, 255.5556]);
  assert.deepEqual(morph.inverseScale, [35.2941, 39.1304]);
  assert.deepEqual(morph.fromSize, [480, 360]);
  assert.deepEqual(morph.toSize, [1360, 920]);

  const empty = target.planBoundsMorph({
    fromBounds: { l: 10, t: 10, r: 10, b: 10 },
    toBounds: { l: 0, t: 0, r: 100, b: 100 }
  });
  assert.equal(empty.valid, false);
  assert.deepEqual(empty.scale, [100, 100]);
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

test("every implemented ID produces a deterministic complete plan", function () {
  const uiPush = require("../core/transitions/uiPush");
  const uiSlide = require("../core/transitions/uiSlide");
  const scaleZoom = require("../core/transitions/scaleZoom");
  const sharedElement = require("../core/transitions/sharedElement");
  const ids = engine.IMPLEMENTED_IDS.slice();
  assert.deepEqual(
    ids,
    uiPush.UI_PUSH_IDS.concat(uiSlide.UI_SLIDE_IDS).concat(scaleZoom.SCALE_ZOOM_IDS).concat(sharedElement.SHARED_ELEMENT_IDS)
  );
  assert.deepEqual(ids, [
    "EVT_UI_PUSH_LEFT",
    "EVT_UI_PUSH_RIGHT",
    "EVT_UI_PUSH_UP",
    "EVT_UI_PUSH_DOWN",
    "EVT_UI_PUSH_SCALE",
    "EVT_UI_PUSH_DEPTH",
    "EVT_UI_PUSH_SOFT",
    "EVT_UI_PUSH_SNAP",
    "EVT_UI_PUSH_OVERSHOOT",
    "EVT_UI_PUSH_PARALLAX",
    "EVT_UI_PUSH_FADE",
    "EVT_UI_PUSH_COVER",
    "EVT_UI_PUSH_PANEL",
    "EVT_UI_PUSH_DASHBOARD",
    "EVT_UI_PUSH_SPLIT",
    "EVT_SLIDE_CARD_LEFT",
    "EVT_SLIDE_CARD_RIGHT",
    "EVT_SLIDE_PANEL_IN",
    "EVT_SLIDE_PANEL_OUT",
    "EVT_SLIDE_DRAWER",
    "EVT_SLIDE_SHEET_UP",
    "EVT_SLIDE_STACK",
    "EVT_SLIDE_PEEK",
    "EVT_ZOOM_IN",
    "EVT_ZOOM_OUT",
    "EVT_ZOOM_TARGET",
    "EVT_ZOOM_MATCH",
    "EVT_SCALE_POP",
    "EVT_SCALE_BREATHE",
    "EVT_SCALE_PUNCH",
    "EVT_SCALE_SETTLE",
    "EVT_SHARED_CARD",
    "EVT_SHARED_IMAGE",
    "EVT_MATCH_CUT",
    "EVT_MORPH_BOUNDS",
    "EVT_HERO_TO_DETAIL",
    "EVT_LIST_TO_DETAIL"
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
    const name = sharedElement.isSharedElementId(id)
      ? sharedElement.displayName(id)
      : scaleZoom.isScaleZoomId(id)
        ? scaleZoom.displayName(id)
        : uiSlide.isUiSlideId(id)
          ? uiSlide.displayName(id)
          : uiPush.displayName(id);
    assert.equal(a.name, name);
    assert.ok(a.outgoing.keys.length >= 3, id + " outgoing keys");
    assert.ok(a.incoming.keys.length >= 3, id + " incoming keys");
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

test("soft / snap / overshoot / fade vary travel and settle from left", function () {
  const left = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_LEFT", durationFrames: 16, fps: 30 });
  const soft = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_SOFT", durationFrames: 16, fps: 30 });
  const snap = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_SNAP", durationFrames: 16, fps: 30 });
  const overshoot = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_OVERSHOOT", durationFrames: 16, fps: 30 });
  const fade = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_FADE", durationFrames: 16, fps: 30 });

  assert.equal(soft.direction, "left");
  assert.equal(soft.travel.distance, 1766.4);
  assert.ok(soft.phases.settle < left.phases.settle, "soft settle window starts earlier");
  assert.equal(soft.outgoing.keys[3].blur, 3);
  assert.equal(soft.incoming.keys[0].opacity, 12);

  assert.equal(snap.travel.distance, 806.4);
  assert.equal(snap.outgoing.keys[3].blur, 1);
  assert.equal(snap.incoming.keys[1].opacity, 88);

  assert.equal(overshoot.travel.distance, 1920);
  assert.equal(overshoot.incoming.keys[2].scale[0], 101.4);
  assert.ok(Math.abs(overshoot.incoming.keys[1].x) < Math.abs(left.incoming.keys[1].x));

  assert.equal(fade.travel.distance, 691.2);
  assert.equal(fade.outgoing.keys[2].opacity, 38);
});

test("parallax keeps background visible with less travel than foreground", function () {
  const plan = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_PARALLAX", durationFrames: 16, fps: 30 });
  assert.equal(plan.travel.foreground, 1920);
  assert.equal(plan.travel.background, 537.6);
  assert.equal(plan.outgoing.keys[3].opacity, 28);
  assert.equal(plan.outgoing.keys[3].x, -537.6);
  assert.equal(plan.incoming.keys[0].x, 1920);
  assert.equal(plan.incoming.keys[3].x, 0);
});

test("cover keeps outgoing in place and opaque", function () {
  const plan = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_COVER", durationFrames: 16, fps: 30 });
  assert.equal(plan.travel.outgoingStays, true);
  assert.equal(plan.outgoing.keys[3].x, 0);
  assert.equal(plan.outgoing.keys[3].opacity, 100);
  assert.equal(plan.incoming.keys[0].opacity, 100);
  assert.equal(plan.incoming.keys[0].x, 1920);
  assert.equal(plan.incoming.keys[3].opacity, 100);
});

test("panel / dashboard / split match named UI Push variants", function () {
  const panel = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_PANEL", durationFrames: 16, fps: 30 });
  const alias = engine.applyTransitionPlan({ id: "EVT_PANEL_PUSH", durationFrames: 16, fps: 30 });
  const dash = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_DASHBOARD", durationFrames: 16, fps: 30 });
  const split = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_SPLIT", durationFrames: 16, fps: 30 });

  assert.equal(panel.id, "EVT_UI_PUSH_PANEL");
  assert.equal(panel.name, "Panel Push");
  assert.equal(panel.direction, "right");
  assert.equal(panel.travel.distance, 768);
  assert.equal(panel.incoming.keys[0].x, 768);
  assert.ok(panel.outgoing.keys[3].x < 0);
  assert.equal(panel.outgoing.keys[3].opacity, 64);
  assert.deepEqual(alias, panel);

  assert.equal(dash.name, "Dashboard Push");
  assert.equal(dash.direction, "left");
  assert.equal(dash.travel.distance, 1920);
  assert.equal(dash.outgoing.keys[3].y, 14);
  assert.equal(dash.incoming.keys[0].y, -10);
  assert.equal(dash.outgoing.keys[3].scale[0], 93.5);

  assert.equal(split.name, "Split Panel Push");
  assert.equal(split.travel.distance, 1056);
  assert.equal(split.outgoing.keys[2].x, -528);
  assert.equal(split.incoming.keys[1].x, 528);
  assert.equal(split.outgoing.keys[2].x + split.incoming.keys[1].x, 0);
});

test("UI-Slide card family uses card-width travel, not full-frame", function () {
  const uiSlide = require("../core/transitions/uiSlide");
  const left = engine.applyTransitionPlan({ id: "EVT_SLIDE_CARD_LEFT", durationFrames: 16, fps: 30 });
  const right = engine.applyTransitionPlan({ id: "EVT_SLIDE_CARD_RIGHT", durationFrames: 16, fps: 30 });
  const push = engine.applyTransitionPlan({ id: "EVT_UI_PUSH_LEFT", durationFrames: 16, fps: 30 });

  assert.equal(left.category, "UI-Slide");
  assert.equal(left.name, "Slide Card Left");
  assert.equal(left.direction, "left");
  assert.equal(left.travel.cardWidth, true);
  assert.equal(left.travel.distance, 537.6);
  assert.ok(left.travel.distance < push.travel.distance);
  assert.equal(left.outgoing.keys[0].x, 0);
  assert.equal(left.outgoing.keys[3].x, -537.6);
  assert.equal(left.outgoing.keys[3].opacity, 0);
  assert.equal(left.incoming.keys[0].x, 537.6);
  assert.equal(left.incoming.keys[3].x, 0);
  assert.equal(left.incoming.keys[3].opacity, 100);

  assert.equal(right.name, "Slide Card Right");
  assert.equal(right.direction, "right");
  assert.equal(right.outgoing.keys[3].x, 537.6);
  assert.equal(right.incoming.keys[0].x, -537.6);

  const remapped = engine.applyTransitionPlan({ id: "EVT_SLIDE_CARD_LEFT", direction: "right", durationFrames: 16 });
  assert.equal(remapped.id, "EVT_SLIDE_CARD_RIGHT");
  assert.equal(uiSlide.CARD_WIDTH_RATIO, 0.28);
});

test("UI-Slide panel / drawer / sheet / stack / peek match named variants", function () {
  const panelIn = engine.applyTransitionPlan({ id: "EVT_SLIDE_PANEL_IN", durationFrames: 16, fps: 30 });
  const panelOut = engine.applyTransitionPlan({ id: "EVT_SLIDE_PANEL_OUT", durationFrames: 16, fps: 30 });
  const drawer = engine.applyTransitionPlan({ id: "EVT_SLIDE_DRAWER", durationFrames: 16, fps: 30 });
  const sheet = engine.applyTransitionPlan({ id: "EVT_SLIDE_SHEET_UP", durationFrames: 16, fps: 30 });
  const stack = engine.applyTransitionPlan({ id: "EVT_SLIDE_STACK", durationFrames: 16, fps: 30 });
  const peek = engine.applyTransitionPlan({ id: "EVT_SLIDE_PEEK", durationFrames: 16, fps: 30 });

  assert.equal(panelIn.name, "Slide Panel In");
  assert.equal(panelIn.direction, "right");
  assert.equal(panelIn.travel.distance, 614.4);
  assert.equal(panelIn.travel.outgoingStays, true);
  assert.equal(panelIn.incoming.keys[0].x, 614.4);
  assert.ok(panelIn.outgoing.keys[3].x < 0);
  assert.equal(panelIn.outgoing.keys[3].opacity, 68);

  assert.equal(panelOut.name, "Slide Panel Out");
  assert.equal(panelOut.travel.dismiss, true);
  assert.equal(panelOut.outgoing.keys[3].x, 614.4);
  assert.equal(panelOut.outgoing.keys[3].opacity, 0);
  assert.equal(panelOut.incoming.keys[3].x, 0);
  assert.equal(panelOut.incoming.keys[3].opacity, 100);

  assert.equal(drawer.name, "Slide Drawer");
  assert.equal(drawer.direction, "left");
  assert.equal(drawer.travel.distance, 422.4);
  assert.equal(drawer.travel.drawer, true);
  assert.equal(drawer.incoming.keys[0].x, -422.4);
  assert.equal(drawer.outgoing.keys[3].opacity, 72);

  assert.equal(sheet.name, "Slide Sheet Up");
  assert.equal(sheet.direction, "up");
  assert.equal(sheet.travel.distance, 453.6);
  assert.equal(sheet.travel.sheet, true);
  assert.equal(sheet.incoming.keys[0].y, 453.6);
  assert.equal(sheet.outgoing.keys[3].y, -8);
  assert.equal(sheet.outgoing.keys[3].opacity, 64);

  assert.equal(stack.name, "Slide Stack");
  assert.equal(stack.travel.stack, true);
  assert.equal(stack.travel.distance, 460.8);
  assert.equal(stack.outgoing.keys[3].scale[0], 92);
  assert.equal(stack.outgoing.keys[3].opacity, 58);
  assert.equal(stack.incoming.keys[0].scale[0], 96);
  assert.equal(stack.incoming.keys[3].x, 0);

  assert.equal(peek.name, "Slide Peek");
  assert.equal(peek.travel.peek, true);
  assert.equal(peek.travel.hold, 193.536);
  assert.equal(peek.incoming.keys[3].x, 193.536);
  assert.equal(peek.incoming.keys[3].opacity, 100);
  assert.ok(peek.incoming.keys[3].x !== 0, "peek holds off rest");
  assert.equal(peek.outgoing.keys[3].opacity, 92);
});

test("Scale-Zoom in / out / pop / breathe / punch / settle use opacity + scale", function () {
  const zoomIn = engine.applyTransitionPlan({ id: "EVT_ZOOM_IN", durationFrames: 16, fps: 30 });
  const zoomOut = engine.applyTransitionPlan({ id: "EVT_ZOOM_OUT", durationFrames: 16, fps: 30 });
  const pop = engine.applyTransitionPlan({ id: "EVT_SCALE_POP", durationFrames: 16, fps: 30 });
  const breathe = engine.applyTransitionPlan({ id: "EVT_SCALE_BREATHE", durationFrames: 16, fps: 30 });
  const punch = engine.applyTransitionPlan({ id: "EVT_SCALE_PUNCH", durationFrames: 16, fps: 30 });
  const settle = engine.applyTransitionPlan({ id: "EVT_SCALE_SETTLE", durationFrames: 16, fps: 30 });

  assert.equal(zoomIn.category, "Scale-Zoom");
  assert.equal(zoomIn.name, "Zoom In");
  assert.equal(zoomIn.travel.zoom, true);
  assert.equal(zoomIn.travel.distance, 0);
  assert.equal(zoomIn.incoming.keys[0].scale[0], 88);
  assert.equal(zoomIn.incoming.keys[3].scale[0], 100);
  assert.equal(zoomIn.outgoing.keys[3].scale[0], 108);
  assert.equal(zoomIn.outgoing.keys[3].opacity, 0);
  assert.equal(zoomIn.outgoing.keys[0].x, 0);
  assert.equal(zoomIn.incoming.keys[0].x, 0);

  assert.equal(zoomOut.name, "Zoom Out");
  assert.equal(zoomOut.incoming.keys[0].scale[0], 112);
  assert.equal(zoomOut.outgoing.keys[3].scale[0], 92);
  assert.equal(zoomOut.incoming.keys[3].opacity, 100);

  assert.equal(pop.name, "Scale Pop");
  assert.equal(pop.incoming.keys[0].scale[0], 90);
  assert.equal(pop.incoming.keys[3].scale[0], 100);
  assert.equal(pop.outgoing.keys[3].opacity, 0);

  assert.equal(breathe.name, "Scale Breathe");
  assert.equal(breathe.travel.breathe, true);
  assert.equal(breathe.travel.outgoingStays, true);
  assert.equal(breathe.incoming.keys[1].scale[0], 102);
  assert.equal(breathe.incoming.keys[3].scale[0], 100);
  assert.equal(breathe.outgoing.keys[3].opacity, 100);

  assert.equal(punch.name, "Scale Punch");
  assert.equal(punch.incoming.keys[1].scale[0], 106);
  assert.equal(punch.incoming.keys[3].scale[0], 100);
  assert.equal(punch.outgoing.keys[3].opacity, 100);

  assert.equal(settle.name, "Scale Settle");
  assert.equal(settle.incoming.keys[0].scale[0], 108);
  assert.equal(settle.incoming.keys[3].scale[0], 100);
  assert.equal(settle.outgoing.keys[3].opacity, 0);
});

test("Zoom Target and Zoom Match apply planTargetZoom to the outgoing plate", function () {
  const targetZoom = engine.applyTransitionPlan({ id: "EVT_ZOOM_TARGET", durationFrames: 16, fps: 30 });
  const match = engine.applyTransitionPlan({ id: "EVT_ZOOM_MATCH", durationFrames: 16, fps: 30 });
  const offset = engine.applyTransitionPlan({
    id: "EVT_ZOOM_TARGET",
    durationFrames: 16,
    fps: 30,
    target: { layerBounds: { left: 100, top: 100, right: 500, bottom: 400 }, padding: 80 }
  });

  assert.equal(targetZoom.name, "Zoom Target");
  assert.equal(targetZoom.travel.targetZoom, true);
  assert.equal(targetZoom.target.valid, true);
  assert.deepEqual(targetZoom.target.scale, [230, 230]);
  assert.deepEqual(targetZoom.target.positionDelta, [0, 0]);
  assert.equal(targetZoom.outgoing.keys[3].scale[0], 230);
  assert.equal(targetZoom.outgoing.keys[3].x, 0);
  assert.equal(targetZoom.outgoing.keys[3].opacity, 72);
  assert.equal(targetZoom.incoming.keys[3].scale[0], 100);
  assert.equal(targetZoom.incoming.keys[3].opacity, 100);

  assert.equal(match.name, "Zoom Match");
  assert.equal(match.travel.match, true);
  assert.equal(match.outgoing.keys[3].scale[0], 230);
  assert.equal(match.outgoing.keys[3].opacity, 0);
  assert.equal(match.incoming.keys[0].opacity, 0);
  assert.equal(match.incoming.keys[3].opacity, 100);

  assert.equal(offset.target.scaleFactor, 3.0667);
  assert.deepEqual(offset.outgoing.keys[3].scale, [306.6667, 306.6667]);
  assert.equal(offset.outgoing.keys[3].x, 2024);
  assert.equal(offset.outgoing.keys[3].y, 889.3333);
});

test("Shared Card morphs card bounds to detail with position + scale, not mesh", function () {
  const plan = engine.applyTransitionPlan({ id: "EVT_SHARED_CARD", durationFrames: 16, fps: 30 });
  const alias = engine.applyTransitionPlan({ id: "EVT_CARD_TO_DETAIL", durationFrames: 16, fps: 30 });

  assert.equal(plan.category, "Shared-Element");
  assert.equal(plan.name, "Shared Card");
  assert.equal(plan.travel.boundsMatch, true);
  assert.equal(plan.travel.shared, true);
  assert.equal(plan.travel.mesh, false);
  assert.equal(plan.morph.valid, true);
  assert.deepEqual(plan.morph.positionDelta, [480, 60]);
  assert.deepEqual(plan.morph.scale, [283.3333, 255.5556]);
  assert.equal(plan.outgoing.keys[0].x, 0);
  assert.equal(plan.outgoing.keys[0].scale[0], 100);
  assert.equal(plan.outgoing.keys[3].x, 480);
  assert.equal(plan.outgoing.keys[3].y, 60);
  assert.deepEqual(plan.outgoing.keys[3].scale, [283.3333, 255.5556]);
  assert.equal(plan.outgoing.keys[3].opacity, 0);
  assert.equal(plan.incoming.keys[0].x, -480);
  assert.equal(plan.incoming.keys[0].y, -60);
  assert.deepEqual(plan.incoming.keys[0].scale, [35.2941, 39.1304]);
  assert.equal(plan.incoming.keys[3].x, 0);
  assert.equal(plan.incoming.keys[3].scale[0], 100);
  assert.equal(plan.incoming.keys[3].opacity, 100);
  assert.deepEqual(alias, plan);
});

test("Shared Image / Match Cut / Morph Bounds / Hero / List are position+scale only", function () {
  const image = engine.applyTransitionPlan({ id: "EVT_SHARED_IMAGE", durationFrames: 16, fps: 30 });
  const imageAlias = engine.applyTransitionPlan({ id: "EVT_IMAGE_TO_GALLERY", durationFrames: 16, fps: 30 });
  const cut = engine.applyTransitionPlan({ id: "EVT_MATCH_CUT", durationFrames: 16, fps: 30 });
  const morph = engine.applyTransitionPlan({ id: "EVT_MORPH_BOUNDS", durationFrames: 16, fps: 30 });
  const hero = engine.applyTransitionPlan({ id: "EVT_HERO_TO_DETAIL", durationFrames: 16, fps: 30 });
  const list = engine.applyTransitionPlan({ id: "EVT_LIST_TO_DETAIL", durationFrames: 16, fps: 30 });
  const listAlias = engine.applyTransitionPlan({ id: "EVT_ROW_TO_DETAIL", durationFrames: 16, fps: 30 });

  assert.equal(image.category, "Shared-Element");
  assert.equal(image.name, "Shared Image");
  assert.equal(image.travel.image, true);
  assert.equal(image.travel.mesh, false);
  assert.equal(image.travel.boundsMatch, true);
  assert.deepEqual(image.morph.positionDelta, [0, 80]);
  assert.deepEqual(image.morph.scale, [187.5, 175]);
  assert.deepEqual(image.outgoing.keys[3].scale, [187.5, 175]);
  assert.equal(image.outgoing.keys[3].y, 80);
  assert.equal(image.outgoing.keys[3].opacity, 0);
  assert.equal(image.incoming.keys[0].y, -80);
  assert.deepEqual(image.incoming.keys[0].scale, [53.3333, 57.1429]);
  assert.equal(image.incoming.keys[3].opacity, 100);
  assert.deepEqual(imageAlias, image);

  assert.equal(cut.name, "Match Cut");
  assert.equal(cut.travel.matchCut, true);
  assert.equal(cut.travel.mesh, false);
  assert.deepEqual(cut.morph.positionDelta, [480, 60]);
  assert.equal(cut.outgoing.keys[2].opacity, 100);
  assert.equal(cut.outgoing.keys[2].x, 480);
  assert.deepEqual(cut.outgoing.keys[2].scale, [283.3333, 255.5556]);
  assert.equal(cut.outgoing.keys[3].opacity, 0);
  assert.equal(cut.incoming.keys[0].opacity, 0);
  assert.equal(cut.incoming.keys[1].opacity, 0);
  assert.equal(cut.incoming.keys[2].opacity, 100);
  assert.equal(cut.incoming.keys[2].x, 0);
  assert.equal(cut.incoming.keys[2].scale[0], 100);

  assert.equal(morph.name, "Morph Bounds");
  assert.equal(morph.travel.morphBounds, true);
  assert.equal(morph.travel.mesh, false);
  assert.equal(morph.outgoing.keys[2].opacity, 100);
  assert.equal(morph.incoming.keys[1].opacity, 100);
  assert.equal(morph.outgoing.keys[1].scale[0], 100);
  assert.equal(morph.outgoing.keys[2].x, 240);
  assert.deepEqual(morph.outgoing.keys[3].scale, [283.3333, 255.5556]);

  assert.equal(hero.name, "Hero to Detail");
  assert.equal(hero.travel.hero, true);
  assert.equal(hero.travel.mesh, false);
  assert.deepEqual(hero.morph.positionDelta, [0, -20]);
  assert.deepEqual(hero.morph.scale, [50, 79.1667]);
  assert.equal(hero.outgoing.keys[3].y, -20);
  assert.deepEqual(hero.outgoing.keys[3].scale, [50, 79.1667]);
  assert.equal(hero.incoming.keys[0].y, 20);
  assert.deepEqual(hero.incoming.keys[0].scale, [200, 126.3158]);

  assert.equal(list.name, "List to Detail");
  assert.equal(list.travel.list, true);
  assert.equal(list.travel.mesh, false);
  assert.deepEqual(list.morph.positionDelta, [780, 140]);
  assert.deepEqual(list.morph.scale, [133.3333, 1150]);
  assert.equal(list.outgoing.keys[3].x, 780);
  assert.equal(list.outgoing.keys[3].y, 140);
  assert.deepEqual(list.outgoing.keys[3].scale, [133.3333, 1150]);
  assert.deepEqual(list.incoming.keys[0].scale, [75, 8.6957]);
  assert.deepEqual(listAlias, list);

  const custom = engine.applyTransitionPlan({
    id: "EVT_LIST_TO_DETAIL",
    durationFrames: 16,
    fps: 30,
    target: {
      layerBounds: { l: 240, t: 300, r: 720, b: 660 },
      destBounds: { l: 280, t: 80, r: 1640, b: 1000 }
    }
  });
  assert.deepEqual(custom.morph.positionDelta, [480, 60]);
  assert.deepEqual(custom.morph.scale, [283.3333, 255.5556]);
});

test("unimplemented catalog IDs return a safe stub plan", function () {
  const plan = engine.applyTransitionPlan({ id: "EVT_MICRO_HOVER" });
  assert.equal(plan.implemented, false);
  assert.ok(plan.description.indexOf("later phase") !== -1);
  assert.equal(plan.outgoing.set.position.length, 0);
});

test("catalog has unique EVT_ IDs and implemented flags for shipped families", function () {
  const uiPush = require("../core/transitions/uiPush");
  const uiSlide = require("../core/transitions/uiSlide");
  const scaleZoom = require("../core/transitions/scaleZoom");
  const sharedElement = require("../core/transitions/sharedElement");
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
  assert.equal(implemented.length, 37);
  implemented.forEach(function (row) {
    assert.equal(row.implemented, true);
    assert.equal(row.style, "premium-saas");
    if (row.category === "UI-Slide") {
      assert.equal(row.phase, 3);
      assert.equal(row.name, uiSlide.displayName(row.id));
    } else if (row.category === "Scale-Zoom") {
      assert.equal(row.phase, 4);
      assert.equal(row.name, scaleZoom.displayName(row.id));
    } else if (row.category === "Shared-Element") {
      assert.equal(row.phase, 12);
      assert.equal(row.name, sharedElement.displayName(row.id));
    } else {
      assert.equal(row.category, "UI-Push");
      assert.ok(uiPush.PHASE1_IDS.indexOf(row.id) !== -1 ? row.phase === 1 : row.phase === 2, row.id + " phase");
      assert.equal(row.name, uiPush.displayName(row.id));
    }
    assert.ok(row.aspectRatios.indexOf("16:9") !== -1);
    assert.ok(row.aspectRatios.indexOf("9:16") !== -1);
    assert.ok(row.aspectRatios.indexOf("1:1") !== -1);
    assert.ok(row.aspectRatios.indexOf("4:5") !== -1);
  });
  assert.equal(registry.getById("EVT_UI_PUSH_LEFT").category, "UI-Push");
  assert.equal(registry.getById("EVT_UI_PUSH_LEFT").name, "UI Push Left");
  assert.equal(registry.getById("EVT_UI_PUSH_SCALE").name, "UI Push + Scale");
  assert.equal(registry.getById("EVT_UI_PUSH_DEPTH").name, "UI Push + Depth");
  assert.equal(registry.getById("EVT_UI_PUSH_PANEL").name, "Panel Push");
  assert.equal(registry.getById("EVT_UI_PUSH_DASHBOARD").name, "Dashboard Push");
  assert.equal(registry.getById("EVT_UI_PUSH_SPLIT").name, "Split Panel Push");
  assert.equal(registry.getById("evt-ui-push-depth").implemented, true);
  assert.equal(registry.getById("EVT_UI_PUSH_COVER").implemented, true);
  assert.equal(registry.getById("EVT_SLIDE_CARD_LEFT").implemented, true);
  assert.equal(registry.getById("EVT_SLIDE_CARD_LEFT").name, "Slide Card Left");
  assert.equal(registry.getById("EVT_SLIDE_PANEL_IN").name, "Slide Panel In");
  assert.equal(registry.getById("EVT_SLIDE_STACK").name, "Slide Stack");
  assert.equal(registry.getById("EVT_ZOOM_IN").implemented, true);
  assert.equal(registry.getById("EVT_ZOOM_IN").name, "Zoom In");
  assert.equal(registry.getById("EVT_ZOOM_TARGET").implemented, true);
  assert.equal(registry.getById("EVT_SCALE_POP").name, "Scale Pop");
  assert.equal(registry.getById("EVT_SHARED_CARD").implemented, true);
  assert.equal(registry.getById("EVT_SHARED_CARD").name, "Shared Card");
  assert.equal(registry.getById("EVT_SHARED_IMAGE").implemented, true);
  assert.equal(registry.getById("EVT_SHARED_IMAGE").name, "Shared Image");
  assert.equal(registry.getById("EVT_MATCH_CUT").name, "Match Cut");
  assert.equal(registry.getById("EVT_MORPH_BOUNDS").name, "Morph Bounds");
  assert.equal(registry.getById("EVT_HERO_TO_DETAIL").name, "Hero to Detail");
  assert.equal(registry.getById("EVT_LIST_TO_DETAIL").name, "List to Detail");
  assert.equal(registry.filterCatalog({ query: "micro", category: "Micro" }).length, 8);
  assert.equal(registry.filterCatalog({ query: "dashboard push", category: "UI-Push" }).length, 1);
  assert.equal(registry.filterCatalog({ query: "split panel", category: "UI-Push" })[0].id, "EVT_UI_PUSH_SPLIT");
  assert.equal(registry.filterCatalog({ query: "EVT_SLIDE_CARD", category: "UI-Slide" }).length, 2);
  assert.equal(registry.categories().length, 16);
  assert.equal(registry.listByCategory("UI-Push").length, 15);
  assert.equal(registry.listByCategory("UI-Slide").length, 8);
  assert.equal(registry.listByCategory("Scale-Zoom").length, 8);
  assert.equal(registry.listByCategory("Shared-Element").length, 6);
  assert.equal(registry.filterCatalog({ query: "shared card", category: "Shared-Element" })[0].id, "EVT_SHARED_CARD");
  assert.equal(registry.filterCatalog({ query: "list to detail", category: "Shared-Element" })[0].id, "EVT_LIST_TO_DETAIL");
  assert.equal(registry.filterCatalog({ implemented: true, category: "Shared-Element" }).length, 6);
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

test("JSX companion embeds UI Push IDs and mirrored constants", function () {
  engine.IMPLEMENTED_IDS.forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX");
  });
  assert.ok(jsx.indexOf("EVOTECHLY_TRANSITION_CONTROL") !== -1);
  assert.ok(jsx.indexOf("premium-smooth") !== -1);
  assert.ok(jsx.indexOf("influenceIn: 88") !== -1 || jsx.indexOf("i: 88") !== -1);
  assert.ok(jsx.indexOf("Node is source of truth") !== -1 || jsx.indexOf("source of truth") !== -1);
  assert.ok(jsx.indexOf("function applyTransition") !== -1 || jsx.indexOf("function runApply") !== -1);
  assert.ok(jsx.indexOf("function planForId") !== -1);
  assert.ok(jsx.indexOf("function planPanel") !== -1);
  assert.ok(jsx.indexOf("function planDashboard") !== -1);
  assert.ok(jsx.indexOf("function planSplit") !== -1);
  assert.ok(jsx.indexOf("function planSoft") !== -1);
  assert.ok(jsx.indexOf("function planParallax") !== -1);
  assert.ok(jsx.indexOf("function planCover") !== -1);
  assert.ok(jsx.indexOf("function planCard") !== -1);
  assert.ok(jsx.indexOf("function planPanelIn") !== -1);
  assert.ok(jsx.indexOf("function planPanelOut") !== -1);
  assert.ok(jsx.indexOf("function planDrawer") !== -1);
  assert.ok(jsx.indexOf("function planSheetUp") !== -1);
  assert.ok(jsx.indexOf("function planStack") !== -1);
  assert.ok(jsx.indexOf("function planPeek") !== -1);
  assert.ok(jsx.indexOf("function planZoomIn") !== -1);
  assert.ok(jsx.indexOf("function planZoomOut") !== -1);
  assert.ok(jsx.indexOf("function planZoomTarget") !== -1);
  assert.ok(jsx.indexOf("function planZoomMatch") !== -1);
  assert.ok(jsx.indexOf("function planScalePop") !== -1);
  assert.ok(jsx.indexOf("function planScaleBreathe") !== -1);
  assert.ok(jsx.indexOf("function planScalePunch") !== -1);
  assert.ok(jsx.indexOf("function planScaleSettle") !== -1);
  assert.ok(jsx.indexOf("function planSharedCard") !== -1);
  assert.ok(jsx.indexOf("function planSharedImage") !== -1);
  assert.ok(jsx.indexOf("function planMatchCut") !== -1);
  assert.ok(jsx.indexOf("function planMorphBounds") !== -1);
  assert.ok(jsx.indexOf("function planHeroToDetail") !== -1);
  assert.ok(jsx.indexOf("function planListToDetail") !== -1);
  assert.ok(jsx.indexOf("function planSharedMorphJs") !== -1);
  assert.ok(jsx.indexOf("function planTargetZoomJs") !== -1);
  assert.ok(jsx.indexOf("Panel Push") !== -1);
  assert.ok(jsx.indexOf("Dashboard Push") !== -1);
  assert.ok(jsx.indexOf("Split Panel Push") !== -1);
  assert.ok(jsx.indexOf("Slide Card Left") !== -1);
  assert.ok(jsx.indexOf("Slide Panel In") !== -1);
  assert.ok(jsx.indexOf("Slide Stack") !== -1);
  assert.ok(jsx.indexOf("Zoom In") !== -1);
  assert.ok(jsx.indexOf("Zoom Target") !== -1);
  assert.ok(jsx.indexOf("Scale Pop") !== -1);
  assert.ok(jsx.indexOf("Shared Card") !== -1);
  assert.ok(jsx.indexOf("Shared Image") !== -1);
  assert.ok(jsx.indexOf("Match Cut") !== -1);
  assert.ok(jsx.indexOf("Morph Bounds") !== -1);
  assert.ok(jsx.indexOf("Hero to Detail") !== -1);
  assert.ok(jsx.indexOf("List to Detail") !== -1);
  assert.ok(/#target aftereffects/.test(jsx));
  assert.ok(jsx.indexOf("does not replace") !== -1);
  registry.catalogIds().forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX catalog");
  });
  const hub = fs.readFileSync(path.join(__dirname, "..", "ae", "SaaS Demo Tools.jsx"), "utf8");
  assert.ok(hub.indexOf("Evotechly Transitions") !== -1);
});
