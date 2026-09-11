"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { generateMotion, runEngine, exportAE } = require("../api/motionAPI");
const { resolveMotion } = require("../core/resolver");
const { mapFigmaType } = require("../pipeline/typeMapper");
const { normalize } = require("../pipeline/normalizer");
const { detectRole, ROLE_ORDER } = require("../core/roles");
const { PRESETS } = require("../core/presets");
const { getStyle } = require("../core/styles");
const { applyDirection, normalizeDirection } = require("../core/direction");
const { SHOT_ORDER } = require("../core/shots");

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
  assert.equal(a.style, "stripe");
  assert.equal(a.direction, "in");
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

test("ROLE_ORDER keeps SaaS hero prefix; UI roles append", function () {
  const prefix = [
    "logo", "eyebrow", "title", "subtitle", "nav", "sidebar",
    "dashboard", "screenshot", "image", "card", "metric", "badge",
    "tooltip", "button", "cta", "cursor"
  ];
  assert.deepEqual(ROLE_ORDER.slice(0, 16), prefix);
  assert.ok(ROLE_ORDER.indexOf("modal") > 15);
  assert.ok(ROLE_ORDER.indexOf("toast") > 15);
});

test("UI roles and presets exist", function () {
  assert.equal(detectRole({ name: "Modal" }), "modal");
  assert.equal(detectRole({ name: "Toast" }), "toast");
  assert.equal(detectRole({ name: "UI Row" }), "row");
  assert.equal(detectRole({ name: "Stack" }), "stack");
  ["uiRow", "uiStack", "uiCard", "uiModal", "uiNav", "uiToast"].forEach(function (id) {
    assert.ok(PRESETS[id], id);
  });
  const modal = resolveMotion({ name: "Modal" }, 0);
  assert.equal(modal.preset, "uiModal");
});

test("direction in/out/both", function () {
  assert.equal(normalizeDirection(undefined), "in");
  const fade = PRESETS.fadeUp;
  const inn = applyDirection(fade, "in");
  assert.equal(inn.from.y, fade.from.y);
  assert.equal(inn.to.y, fade.to.y);
  const out = applyDirection(fade, "out");
  assert.equal(out.from.y, fade.to.y);
  assert.equal(out.to.y, fade.from.y);
  const both = applyDirection(fade, "both");
  assert.equal(both.from.y, fade.from.y);
  assert.ok(both.out);
  assert.equal(both.out.to.y, fade.from.y);

  const planOut = generateMotion(sample, { direction: "out" });
  assert.equal(planOut.direction, "out");
  const title = planOut.layers.find(function (l) { return l.layer === "Title"; });
  assert.equal(title.direction, "out");
  assert.equal(title.animation.from.opacity, 1);
  assert.equal(title.animation.to.opacity, 0);

  const planBoth = generateMotion(sample, { direction: "both" });
  const card = planBoth.layers.find(function (l) { return l.layer === "Card 1"; });
  assert.ok(card.animation.out);
  const aeBoth = exportAE(sample, { direction: "both" });
  assert.equal(aeBoth.layers[0].keyframes.length, 3);
});

test("style packs evotechly and apple; default remains stripe", function () {
  assert.equal(getStyle("nope").id, "stripe");
  assert.equal(getStyle("evotechly").id, "evotechly");
  assert.equal(getStyle("apple").id, "apple");
  const evo = generateMotion(sample, { style: "evotechly" });
  assert.equal(evo.style, "evotechly");
  const apple = generateMotion(sample, { style: "apple" });
  assert.equal(apple.style, "apple");
  const def = generateMotion({ layers: sample.layers });
  assert.equal(def.style, "stripe");
});

test("shots taxonomy recorded on plan", function () {
  assert.deepEqual(SHOT_ORDER, [
    "hero", "featureRow", "pricing", "dashboardTour", "logoLockup", "uiScreen"
  ]);
  const plan = generateMotion(sample, { shot: "uiScreen" });
  assert.equal(plan.shot, "uiScreen");
});

test("logo lockup shot pins mark and type; hero is unchanged", function () {
  const { pinSet, lockupPart, isLockupSkip, guidesFromPins } = require("../core/lockup");
  const lock = generateMotion({
    style: "stripe",
    shot: "logoLockup",
    layers: [
      { name: "Logo", type: "rectangle", x: 40, y: 40, width: 48, height: 48 },
      { name: "Title", type: "text", x: 100, y: 48, width: 220, height: 32 }
    ]
  });
  assert.equal(lock.shot, "logoLockup");
  assert.ok(lock.lockup && lock.lockup.applied);
  assert.ok(lock.lockup.pins.opticalGap >= 8);
  assert.ok(lock.lockup.guides && lock.lockup.guides.length === 5);
  const logo = lock.layers.find(function (l) { return l.role === "logo"; });
  const title = lock.layers.find(function (l) { return l.role === "title"; });
  assert.equal(logo.lockup.part, "mark");
  assert.equal(title.lockup.part, "type");
  assert.ok(title.delay > logo.delay);

  const worded = generateMotion({
    shot: "logoLockup",
    layers: [
      { name: "Logo", type: "rectangle", x: 20, y: 20, width: 40, height: 40 },
      { name: "Wordmark", type: "text", x: 72, y: 28, width: 180, height: 24 }
    ]
  });
  const wm = worded.layers.find(function (l) { return l.layer === "Wordmark"; });
  assert.equal(lockupPart({ name: "Wordmark", role: "logo" }), "type");
  assert.equal(wm.lockup.part, "type");
  assert.ok(wm.delay > 0.1);

  const pins = pinSet(
    { x: 0, y: 0, width: 40, height: 40 },
    { x: 56, y: 8, width: 120, height: 24 }
  );
  assert.equal(pins.opticalGap, 16);
  assert.equal(guidesFromPins(pins).length, 5);
  assert.equal(isLockupSkip("EVO_SKIP_LOCKUP_BASE"), true);
  assert.equal(isLockupSkip("Title"), false);

  const hero = generateMotion(sample);
  assert.equal(hero.shot, "hero");
  assert.equal(hero.lockup, undefined);
  const aeLock = exportAE({
    shot: "logoLockup",
    layers: [
      { name: "Logo", type: "rectangle", x: 40, y: 40, width: 48, height: 48 },
      { name: "Title", type: "text", x: 100, y: 48, width: 220, height: 32 }
    ]
  });
  assert.ok(aeLock.lockup && aeLock.lockup.applied);
});
