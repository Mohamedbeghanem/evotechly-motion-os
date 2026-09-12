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
const { SHOT_ORDER, REEL_SHOTS, applyShot } = require("../core/shots");
const { parseBrand, applyBrand } = require("../core/brand");

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

test("pipeline: rectangle to card, frame to dashboard, parentId kept, y-order", function () {
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

test("evotechly and calm packs differ from stripe on the same hero layers", function () {
  const stripe = generateMotion(sample, { style: "stripe" });
  const evo = generateMotion(sample, { style: "evotechly" });
  const calm = generateMotion(sample, { style: "apple" });
  const sTitle = stripe.layers.find(function (l) { return l.layer === "Title"; });
  const eTitle = evo.layers.find(function (l) { return l.layer === "Title"; });
  const aTitle = calm.layers.find(function (l) { return l.layer === "Title"; });
  const sCard = stripe.layers.find(function (l) { return l.layer === "Card 1"; });
  const eCard = evo.layers.find(function (l) { return l.layer === "Card 1"; });
  const aCta = calm.layers.find(function (l) { return l.layer === "CTA"; });
  const sCta = stripe.layers.find(function (l) { return l.layer === "CTA"; });
  assert.ok(Math.abs(eTitle.animation.from.y) < Math.abs(sTitle.animation.from.y));
  assert.ok(Math.abs(aTitle.animation.from.y) < Math.abs(eTitle.animation.from.y));
  assert.ok(aTitle.animation.duration > sTitle.animation.duration);
  assert.notEqual(eCard.preset, sCard.preset);
  assert.notEqual(aCta.preset, sCta.preset);
  assert.equal(sCta.preset, "pop");
  assert.equal(evo.travel, 0.62);
  assert.equal(calm.travel, 0.38);
  assert.equal(stripe.travel, 1);
});

test("brand JSON tokens change gap and role timing", function () {
  const brand = parseBrand(require("../examples/evotechly.brand.json"));
  assert.equal(brand.travel, 0.62);
  const styled = applyBrand(getStyle("stripe"), brand);
  assert.equal(styled.gapAfterGroup, 0.16);
  assert.equal(styled.roles.card.stagger, 0.05);
  const plain = generateMotion(sample, { style: "stripe" });
  const branded = generateMotion(sample, { style: "stripe", brand: brand });
  const pCard2 = plain.layers.find(function (l) { return l.layer === "Card 2"; });
  const bCard2 = branded.layers.find(function (l) { return l.layer === "Card 2"; });
  assert.ok(bCard2.delay < pCard2.delay);
});

test("shots taxonomy recorded on plan", function () {
  assert.deepEqual(SHOT_ORDER.slice(0, 6), [
    "hero", "featureRow", "pricing", "dashboardTour", "logoLockup", "uiScreen"
  ]);
  assert.deepEqual(REEL_SHOTS, ["hook", "kineticType", "uiPunchIn", "logoSting", "captions"]);
  const plan = generateMotion(sample, { shot: "uiScreen" });
  assert.equal(plan.shot, "uiScreen");
  assert.equal(plan.shotFamily, "saas");
});

test("reel shots + caption role; SaaS both has no hold", function () {
  assert.equal(detectRole({ name: "Caption 1" }), "caption");
  assert.ok(ROLE_ORDER.indexOf("caption") > ROLE_ORDER.indexOf("stack"));
  const hook = generateMotion(sample, { shot: "hook" });
  assert.equal(hook.shot, "hook");
  assert.equal(hook.shotFamily, "reel");
  const hTitle = hook.layers.find(function (l) { return l.layer === "Title"; });
  const heroTitle = generateMotion(sample).layers.find(function (l) { return l.layer === "Title"; });
  assert.ok(hTitle.delay < heroTitle.delay);
  assert.equal(hTitle.preset, "hookSlam");
  const punch = generateMotion(sample, { shot: "uiPunchIn" });
  assert.ok(punch.shotFamily === "reel");
  const sting = generateMotion({
    shot: "logoSting",
    layers: [
      { name: "Logo", type: "rectangle", x: 40, y: 40, width: 48, height: 48 },
      { name: "Title", type: "text", x: 100, y: 48, width: 220, height: 32 }
    ]
  });
  assert.ok(sting.lockup && sting.lockup.applied);
  const bothSaas = generateMotion(sample, { direction: "both", shot: "hero" });
  const bothTitle = bothSaas.layers.find(function (l) { return l.layer === "Title"; });
  assert.ok(bothTitle.animation.out);
  assert.ok(!bothTitle.animation.hold);
  const bothReel = generateMotion(sample, { direction: "both", shot: "hook" });
  const reelTitle = bothReel.layers.find(function (l) { return l.layer === "Title"; });
  assert.ok(reelTitle.animation.hold > 0);
  const aeReel = exportAE(sample, { direction: "both", shot: "hook" });
  assert.equal(aeReel.layers[0].keyframes.length, 3);
  const cap = generateMotion({
    shot: "captions",
    layers: [
      { name: "Caption 1", type: "text", x: 40, y: 700, width: 400, height: 28 },
      { name: "Caption 2", type: "text", x: 40, y: 736, width: 400, height: 28 }
    ]
  });
  assert.equal(cap.layers[0].role, "caption");
  assert.ok(cap.layers[1].delay > cap.layers[0].delay);
  assert.ok(applyShot);
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

test("polish vocabulary is native-only and distinct from stripe hero", function () {
  const { EASE, TEXT_IN, TYPEWRITER, PLUGINS_REMINDER, easePair } = require("../core/polish");
  assert.equal(easePair("apple").influenceIn, 80);
  assert.equal(easePair("soft").influenceIn, 40);
  assert.ok(TEXT_IN.travel < 16);
  assert.equal(TYPEWRITER.charsPerSecond, 18);
  assert.ok(PLUGINS_REMINDER.indexOf("Saber") !== -1);
  const hero = generateMotion(sample);
  assert.equal(hero.style, "stripe");
  assert.equal(hero.travel, 1);
});

test("caption templates + basic SRT parser; stripe hero unchanged", function () {
  const { TEMPLATES, TEMPLATE_ORDER, parseSrt, srtTimeToSeconds, getTemplate } = require("../core/captions");
  assert.deepEqual(TEMPLATE_ORDER, ["hook", "kinetic", "stackArEn", "lowerThird", "burnIn"]);
  assert.equal(getTemplate("hook").duration, 1);
  assert.equal(TEMPLATES.stackArEn.defaultPrimary, "ar");
  assert.equal(srtTimeToSeconds("00:00:01,200"), 1.2);
  const fs = require("fs");
  const path = require("path");
  const en = parseSrt(fs.readFileSync(path.join(__dirname, "..", "examples", "captions", "demo-en.srt"), "utf8"));
  const ar = parseSrt(fs.readFileSync(path.join(__dirname, "..", "examples", "captions", "demo-ar.srt"), "utf8"));
  assert.equal(en.length, 3);
  assert.equal(ar.length, 3);
  assert.ok(ar[0].text.indexOf("لوحة") !== -1);
  assert.equal(en[0].start, 0);
  const hero = generateMotion(sample);
  assert.equal(hero.style, "stripe");
  assert.equal(hero.travel, 1);
  const byName = {};
  hero.layers.forEach(function (l) { byName[l.layer] = l; });
  assert.ok(byName.CTA.delay >= byName["Card 2"].delay);
});

test("editor recipes stay native; hook plugins are reminders only", function () {
  const { PERSON, EDITOR_SHOTS, KPI } = require("../core/recipes");
  assert.equal(PERSON.cutout.layerName, "CUTOUT");
  assert.equal(PERSON.talkingHead.wetOff, true);
  assert.equal(EDITOR_SHOTS.erpDemo.path, "cursor+ease");
  assert.ok(EDITOR_SHOTS.hook15.plugins.indexOf("Saber") !== -1);
  assert.equal(KPI.duration, 1.4);
  const hero = generateMotion(sample);
  assert.equal(hero.shot, "hero");
  assert.equal(hero.lockup, undefined);
});

test("auto-animate plans selected layers without roles; stripe hero unchanged", function () {
  const { planAutoAnimate, offsetFor, DIRECTIONS, EASING } = require("../core/autoAnimate");
  assert.ok(DIRECTIONS.up.y > 0);
  assert.ok(DIRECTIONS.scale.s < 100);
  assert.equal(EASING.apple.influenceIn, 80);
  const off = offsetFor("left", 1);
  assert.equal(off.x, 28);
  const plan = planAutoAnimate(
    [
      { name: "A", y: 40 },
      { name: "B", y: 200 },
      { name: "C", y: 120 }
    ],
    { direction: "up", mode: "in", sequence: "topToBottom", stagger: 0.06, duration: 0.42 }
  );
  assert.equal(plan.length, 3);
  assert.equal(plan[0].name, "A");
  assert.equal(plan[1].name, "C");
  assert.ok(plan[1].delay > plan[0].delay);
  assert.equal(plan[0].from.y, 28);
  const hero = generateMotion(sample);
  assert.equal(hero.style, "stripe");
  assert.equal(hero.travel, 1);
});

test("asset browser lite lists local templates and SRTs only", function () {
  const { CAPTION_ASSETS, SRT_ASSETS, COMPANIONS, listCaptionAssets } = require("../core/assetsLite");
  assert.equal(listCaptionAssets().length, 5);
  assert.equal(CAPTION_ASSETS[0].id, "hook");
  assert.equal(SRT_ASSETS.length, 3);
  assert.ok(COMPANIONS.some(function (c) { return c.name === "Saber"; }));
  assert.ok(COMPANIONS.every(function (c) { return c.url.indexOf("http") === 0; }));
  const hero = generateMotion(sample);
  assert.equal(hero.shot, "hero");
});
