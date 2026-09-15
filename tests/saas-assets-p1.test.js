"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assets = require("../core/assets/index");
const text = require("../core/assets/textAnimations");
const ui = require("../core/assets/uiMicro");
const cursor = require("../core/assets/cursorPack");

const PACK = path.join(__dirname, "..", "Evotechly-SaaS-Assets");
const REGISTRY_PATH = path.join(PACK, "Metadata", "asset-registry.json");
const JSX_PATH = path.join(__dirname, "..", "ae", "Evotechly Transitions.jsx");

function planTwice(id, extra) {
  const opts = Object.assign({ id: id, durationFrames: 15, fps: 30 }, extra || {});
  const a = assets.applyAssetPlan(opts);
  const b = assets.applyAssetPlan(opts);
  return { a: a, b: b };
}

test("P1 native IDs are unique and cover text / UI / cursor", function () {
  assert.equal(text.TEXT_IDS.length, 18);
  assert.ok(ui.UI_MICRO_IDS.length >= 40);
  assert.equal(cursor.CURSOR_IDS.length, 8);
  assert.deepEqual(assets.uniqueIdErrors(), []);
  const seen = {};
  assets.NATIVE_ASSET_IDS.forEach(function (id) {
    assert.match(id, /^EVT_[A-Z0-9_]+$/);
    assert.equal(seen[id], undefined, "duplicate " + id);
    seen[id] = true;
  });
  assert.ok(assets.isNativeAssetId("evt-text-fade-up"));
  assert.equal(assets.isNativeAssetId("EVT_UI_PUSH_LEFT"), false);
});

test("every implemented P1 plan is deterministic and complete", function () {
  assets.NATIVE_ASSET_IDS.forEach(function (id) {
    const extra = {};
    if (id === "EVT_TEXT_SWAP") {
      extra.layer = { name: "Old", position: [960, 200] };
      extra.incoming = { name: "New", position: [960, 200] };
    }
    const { a, b } = planTwice(id, extra);
    assert.deepEqual(a, b, id + " must be deterministic");
    assert.equal(a.id, id);
    assert.equal(a.implemented, true);
    assert.equal(a.sourceType, "native");
    assert.equal(a.commercialUse, true);
    assert.equal(a.style, "premium-saas");
    assert.ok(a.layers.length >= 1, id + " needs layers");
    assert.ok(a.durationFrames >= 2);
    assert.ok(a.easeInfluences.influenceIn > 0);
    assert.equal(a.undo, "Evotechly Asset · " + id);
  });
});

test("text pack uses restrained travel and native animator match names", function () {
  const fade = text.applyTextPlan({ id: "EVT_TEXT_FADE_UP", durationFrames: 12, fps: 30 });
  assert.equal(fade.kind, "text-asset");
  assert.equal(fade.outgoing.keys[0].y, 10);
  assert.equal(fade.outgoing.keys[0].opacity, 0);
  assert.equal(fade.outgoing.keys[fade.outgoing.keys.length - 1].y, 0);
  assert.equal(fade.outgoing.keys[fade.outgoing.keys.length - 1].opacity, 100);
  assert.ok(Math.abs(fade.outgoing.keys[0].y) <= 16);

  const down = text.applyTextPlan({ id: "EVT_TEXT_FADE_DOWN", durationFrames: 12, fps: 30 });
  assert.equal(down.outgoing.keys[0].y, -10);

  const word = text.applyTextPlan({ id: "EVT_TEXT_WORD_REVEAL", durationFrames: 15, fps: 30 });
  assert.equal(word.animator.unit, "word");
  assert.equal(word.animator.basedOn, 3);
  assert.equal(word.animator.matchName, "ADBE Text Animator");
  assert.equal(word.animator.properties[0].matchName, "ADBE Text Opacity");

  const line = text.applyTextPlan({ id: "EVT_TEXT_LINE_REVEAL" });
  assert.equal(line.animator.unit, "line");
  assert.equal(line.animator.basedOn, 4);

  const chr = text.applyTextPlan({ id: "EVT_TEXT_CHAR_REVEAL" });
  assert.equal(chr.animator.unit, "char");
  assert.equal(chr.animator.basedOn, 1);

  const mask = text.applyTextPlan({ id: "EVT_TEXT_MASK_REVEAL", durationFrames: 15, fps: 30 });
  assert.equal(mask.mask.type, "roundedRect");
  assert.equal(mask.mask.expansion[0].value, -72);
  assert.equal(mask.mask.expansion[2].value, 0);

  const kinetic = text.applyTextPlan({ id: "EVT_TEXT_KINETIC_HEADLINE" });
  assert.ok(kinetic.note.indexOf("glitch") !== -1);
  assert.ok(Math.abs(kinetic.outgoing.keys[0].y) <= 8);

  const swap = text.applyTextPlan({
    id: "EVT_TEXT_SWAP",
    layer: { name: "A" },
    incoming: { name: "B" },
    durationFrames: 15,
    fps: 30
  });
  assert.equal(swap.layers.length, 2);
  assert.equal(swap.outgoing.set.opacity[0].value, 100);
  assert.equal(swap.outgoing.set.opacity[2].value, 0);
  assert.equal(swap.incoming.set.opacity[0].value, 0);
  assert.equal(swap.incoming.set.opacity[2].value, 100);

  const num = text.applyTextPlan({ id: "EVT_TEXT_NUMBER_COUNTER", from: 0, to: 100, durationFrames: 20, fps: 30 });
  assert.equal(num.sourceText.keys[0].value, "0");
  assert.equal(num.sourceText.keys[num.sourceText.keys.length - 1].value, "100");
  assert.equal(num.ease, "linear");

  const pct = text.applyTextPlan({ id: "EVT_TEXT_PCT_COUNTER", from: 0, to: 48 });
  assert.equal(pct.sourceText.keys[pct.sourceText.keys.length - 1].value, "48%");

  const metric = text.applyTextPlan({ id: "EVT_TEXT_METRIC_COUNTER", from: 0, to: 12.4 });
  assert.equal(metric.sourceText.keys[0].value, "$0.0k");
  assert.equal(metric.sourceText.keys[metric.sourceText.keys.length - 1].value, "$12.4k");
});

test("UI micro pack has a solid core set with premium travel", function () {
  assert.ok(ui.UI_MICRO_IDS.indexOf("EVT_UI_BUTTON_ENTER") !== -1);
  assert.ok(ui.UI_MICRO_IDS.indexOf("EVT_UI_CARD_EXPAND") !== -1);
  assert.ok(ui.UI_MICRO_IDS.indexOf("EVT_UI_MODAL_ENTER") !== -1);
  assert.ok(ui.UI_MICRO_IDS.indexOf("EVT_UI_SEARCH_COLLAPSE") !== -1);

  const enter = ui.applyUiMicroPlan({ id: "EVT_UI_BUTTON_ENTER", durationFrames: 10, fps: 30 });
  assert.equal(enter.kind, "ui-micro");
  assert.equal(enter.element, "button");
  assert.equal(enter.action, "enter");
  assert.equal(enter.outgoing.keys[0].opacity, 0);
  assert.equal(enter.outgoing.keys[enter.outgoing.keys.length - 1].opacity, 100);
  assert.ok(Math.abs(enter.outgoing.keys[0].y) <= 24);

  const hover = ui.applyUiMicroPlan({ id: "EVT_UI_CARD_HOVER", durationFrames: 6, fps: 30 });
  assert.equal(hover.outgoing.keys[hover.outgoing.keys.length - 1].scale[0], ui.ELEMENTS.card.hoverScale);
  assert.ok(hover.outgoing.keys[hover.outgoing.keys.length - 1].scale[0] <= 104);

  const click = ui.applyUiMicroPlan({ id: "EVT_UI_BUTTON_CLICK", durationFrames: 8, fps: 30 });
  assert.equal(click.outgoing.keys[0].scale[0], 100);
  assert.equal(click.outgoing.keys[1].scale[0], ui.ELEMENTS.button.clickScale);
  assert.equal(click.outgoing.keys[2].scale[0], 100);

  const sidebar = ui.applyUiMicroPlan({ id: "EVT_UI_SIDEBAR_ENTER", durationFrames: 15, fps: 30 });
  assert.equal(sidebar.outgoing.keys[0].x, 24);
  assert.equal(sidebar.outgoing.keys[sidebar.outgoing.keys.length - 1].x, 0);
});

test("cursor pack extends createCursor styles and motion IDs", function () {
  const move = cursor.applyCursorPlan({
    id: "EVT_CURSOR_MOVE",
    startPos: [10, 20],
    endPos: [200, 80],
    durationFrames: 15,
    fps: 30
  });
  assert.equal(move.kind, "cursor-asset");
  assert.equal(move.styleName, "pointer");
  assert.deepEqual(move.cursor.positionKeys[0].pos, [10, 20]);
  assert.deepEqual(move.cursor.positionKeys[move.cursor.positionKeys.length - 1].pos, [200, 80]);
  assert.equal(move.cursor.click, null);

  const click = cursor.applyCursorPlan({ id: "EVT_CURSOR_CLICK", style: "hand", durationFrames: 12, fps: 30 });
  assert.equal(click.styleName, "hand");
  assert.ok(click.cursor.click.scaleKeys.length >= 3);

  const dbl = cursor.applyCursorPlan({ id: "EVT_CURSOR_DBLCLICK", durationFrames: 15, fps: 30 });
  assert.equal(dbl.cursor.click.count, 2);

  const drag = cursor.applyCursorPlan({ id: "EVT_CURSOR_DRAG", durationFrames: 18, fps: 30 });
  assert.equal(drag.cursor.click.mode, "drag");
  assert.ok(drag.cursor.scaleKeys[1].scale[0] < 100);

  const ripple = cursor.applyCursorPlan({ id: "EVT_CURSOR_RIPPLE", durationFrames: 10, fps: 30 });
  assert.equal(ripple.ripple.type, "ellipse");
  assert.equal(ripple.ripple.opacityKeys[0].opacity, 36);
  assert.equal(ripple.ripple.opacityKeys[1].opacity, 0);

  const swipe = cursor.applyCursorPlan({
    id: "EVT_CURSOR_SWIPE",
    startPos: [0, 0],
    endPos: [100, 0],
    durationFrames: 10,
    fps: 30
  });
  assert.ok(swipe.cursor.positionKeys[1].pos[0] > 100);
});

test("asset registry is complete for the implemented P1 set", function () {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  assert.equal(registry.phase, "P1");
  assert.equal(registry.schemaVersion, 1);
  const byId = {};
  registry.assets.forEach(function (row) {
    byId[row.id] = row;
  });
  assets.NATIVE_ASSET_IDS.forEach(function (id) {
    const row = byId[id];
    assert.ok(row, "registry missing " + id);
    assert.equal(row.sourceType, "native");
    assert.equal(row.commercialUse, true);
    assert.equal(row.owner, "Evotechly");
    assert.equal(row.status, "OWNED");
    assert.equal(row.implemented, true);
    assert.equal(row.redistributionAllowed, true);
  });
  const native = registry.assets.filter(function (a) {
    return a.sourceType === "native";
  });
  assert.ok(native.length >= 15 + assets.NATIVE_ASSET_IDS.length);
});

test("JSX companion lists P1 categories and apply hooks", function () {
  const jsx = fs.readFileSync(JSX_PATH, "utf8");
  assert.ok(jsx.indexOf("Text") !== -1);
  assert.ok(jsx.indexOf("Cursor") !== -1);
  assert.ok(jsx.indexOf("function runApplyAsset") !== -1 || jsx.indexOf("function runApplyText") !== -1);
  assert.ok(jsx.indexOf("function applyAssetLayer") !== -1 || jsx.indexOf("function applyLayerKeys") !== -1);
  assets.NATIVE_ASSET_IDS.forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX");
  });
  assert.ok(jsx.indexOf("does not replace") !== -1);
  assert.ok(jsx.indexOf("ADBE Text Animator") !== -1);
  assert.ok(jsx.indexOf("EVO_CURSOR_RIPPLE") !== -1);
});

test("unknown asset IDs stay unimplemented stubs", function () {
  const plan = assets.applyAssetPlan({ id: "EVT_TEXT_GLITCH_RGB" });
  assert.equal(plan.implemented, false);
  assert.equal(plan.layers.length, 0);
});
