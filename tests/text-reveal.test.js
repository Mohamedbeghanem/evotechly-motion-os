"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const T = require("../core/textReveal");

test("flowingText is deterministic and uses a native text animator", function () {
  const opts = { layer: "Title", unit: "char", duration: 0.8, ease: "apple", direction: "in" };
  const a = T.flowingText(opts);
  const b = T.flowingText(opts);
  assert.deepEqual(a, b);
  assert.equal(a.kind, "flowingText");
  assert.equal(a.layer, "Title");
  assert.equal(a.unit, "char");
  assert.equal(a.basedOn, 1);
  assert.equal(a.duration, 0.8);
  assert.equal(a.ease, "apple");
  assert.equal(a.easeInfluences.influenceIn, 80);
  assert.equal(a.direction, "in");
  assert.equal(a.animator.name, "EVO_FLOW");
  assert.equal(a.animator.matchName, "ADBE Text Animator");
  assert.equal(a.animator.shape, "rampUp");
  assert.equal(a.animator.shapeValue, 2);
  assert.equal(a.animator.selector.basedOnValue, 1);
  assert.deepEqual(a.animator.selector.endKeys, [
    { t: 0, end: 100 },
    { t: 0.8, end: 0 }
  ]);
  assert.equal(a.animator.properties[0].matchName, "ADBE Text Opacity");
  assert.equal(a.animator.properties[0].value, 0);
  assert.equal(a.animator.properties[1].matchName, "ADBE Text Position 3D");
  assert.deepEqual(a.animator.properties[1].value, [0, T.FLOWING.travel, 0]);
  assert.ok(a.note.indexOf("vendor") !== -1);
});

test("flowingText accepts word and line units and layer objects", function () {
  assert.equal(T.flowingText({ layer: { name: "Hook" }, unit: "word" }).unit, "word");
  assert.equal(T.flowingText({ layer: { name: "Hook" }, unit: "word" }).basedOn, 3);
  assert.equal(T.flowingText({ layer: { layer: "Caption" }, unit: "line" }).unit, "line");
  assert.equal(T.flowingText({ layer: { layer: "Caption" }, unit: "line" }).basedOn, 4);
  assert.equal(T.flowingText({ layer: { layer: "Caption" }, unit: "line" }).layer, "Caption");
  assert.equal(T.normalizeUnit("words"), "word");
  assert.equal(T.normalizeUnit("LINES"), "line");
  assert.equal(T.normalizeUnit("nope"), "char");
  assert.equal(T.rangeBasedOn("char"), 1);
});

test("flowingText direction in/out/both and ease", function () {
  const out = T.flowingText({ layer: "Title", direction: "out", duration: 1 });
  assert.equal(out.direction, "out");
  assert.deepEqual(out.animator.selector.endKeys, [
    { t: 0, end: 0 },
    { t: 1, end: 100 }
  ]);

  const both = T.flowingText({ layer: "Title", direction: "both", duration: 0.5, ease: "soft" });
  assert.equal(both.direction, "both");
  assert.equal(both.hold, 0.2);
  assert.equal(both.ease, "soft");
  assert.equal(both.easeInfluences.influenceIn, 40);
  assert.deepEqual(both.animator.selector.endKeys, [
    { t: 0, end: 100 },
    { t: 0.5, end: 0 },
    { t: 0.7, end: 0 },
    { t: 1.2, end: 100 }
  ]);

  const lin = T.flowingText({ layer: "Title", ease: "linear" });
  assert.equal(lin.ease, "linear");
  assert.equal(lin.easeInfluences.influenceIn, 16);
  assert.equal(T.normalizeEase("nope"), "apple");
  assert.equal(T.flowingText({}).direction, "in");
});

test("flowingText clamps duration", function () {
  assert.equal(T.flowingText({ layer: "A", duration: 0.01 }).duration, 0.05);
  assert.equal(T.flowingText({ layer: "A", duration: 99 }).duration, 30);
  assert.equal(T.flowingText({ layer: "A" }).duration, T.FLOWING.duration);
});

test("colouredReveal is deterministic and uses native fill/stroke", function () {
  const opts = { layer: "Title", colorHex: "#FF6A00", duration: 0.6, mode: "fill" };
  const a = T.colouredReveal(opts);
  const b = T.colouredReveal(opts);
  assert.deepEqual(a, b);
  assert.equal(a.kind, "colouredReveal");
  assert.equal(a.layer, "Title");
  assert.equal(a.colorHex, "#FF6A00");
  assert.deepEqual(a.colorRgb, T.hexToRgb("#FF6A00"));
  assert.equal(a.mode, "fill");
  assert.equal(a.enableStroke, false);
  assert.equal(a.animator.name, "EVO_COLOUR");
  assert.equal(a.animator.matchName, "ADBE Text Animator");
  assert.equal(a.animator.properties[0].matchName, "ADBE Text Fill Color");
  assert.deepEqual(a.animator.properties[0].value, a.colorRgb);
  assert.deepEqual(a.animator.selector.endKeys, [
    { t: 0, end: 0 },
    { t: 0.6, end: 100 }
  ]);
  assert.equal(a.animator.selector.basedOnValue, 1);
  assert.ok(a.note.indexOf("vendor") !== -1);
});

test("colouredReveal modes fill/stroke/both", function () {
  const fill = T.colouredReveal({ layer: "A", mode: "fill" });
  const stroke = T.colouredReveal({ layer: "A", mode: "stroke", colorHex: "#00AAFF" });
  const both = T.colouredReveal({ layer: "A", mode: "both" });
  assert.equal(fill.mode, "fill");
  assert.equal(fill.animator.properties.length, 1);
  assert.equal(stroke.mode, "stroke");
  assert.equal(stroke.enableStroke, true);
  assert.equal(stroke.strokeWidth, 2);
  assert.equal(stroke.animator.properties[0].matchName, "ADBE Text Stroke Color");
  assert.equal(stroke.animator.properties[1].matchName, "ADBE Text Stroke Width");
  assert.equal(stroke.animator.properties[1].value, 2);
  assert.equal(both.mode, "both");
  assert.equal(both.animator.properties[0].matchName, "ADBE Text Fill Color");
  assert.equal(both.animator.properties[1].matchName, "ADBE Text Stroke Color");
  assert.equal(T.normalizeMode("STROKE"), "stroke");
  assert.equal(T.normalizeMode("nope"), "fill");
});

test("colouredReveal parses and clamps hex + duration", function () {
  assert.equal(T.normalizeHex("#f60"), "#FF6600");
  assert.equal(T.normalizeHex("00c2a8"), "#00C2A8");
  assert.equal(T.normalizeHex("not-a-color"), "#FF6A00");
  assert.equal(T.normalizeHex(null), "#FF6A00");
  assert.deepEqual(T.hexToRgb("#FFFFFF"), [1, 1, 1]);
  assert.deepEqual(T.hexToRgb("#000000"), [0, 0, 0]);
  assert.deepEqual(T.hexToRgb("#FF6A00"), [
    1,
    T.round4(0x6a / 255),
    0
  ]);
  assert.equal(T.colouredReveal({ layer: "A", colorHex: "#abc" }).colorHex, "#AABBCC");
  assert.equal(T.colouredReveal({ layer: "A", duration: 0.01 }).duration, 0.05);
  assert.equal(T.colouredReveal({ layer: "A", duration: 40 }).duration, 30);
  assert.equal(T.colouredReveal({ layer: { id: "CTA" } }).layer, "CTA");
});

test("helpers stay deterministic", function () {
  assert.equal(T.round4(1.23456), 1.2346);
  assert.equal(T.clamp(9, 0, 2), 2);
  assert.equal(T.layerName(null, 2), "layer-2");
  assert.equal(T.durationOf(undefined, 0.8), 0.8);
  assert.deepEqual(T.endKeys("in", 0.8), [
    { t: 0, end: 100 },
    { t: 0.8, end: 0 }
  ]);
  assert.deepEqual(T.colourEndKeys(0.6), [
    { t: 0, end: 0 },
    { t: 0.6, end: 100 }
  ]);
  assert.deepEqual(T.UNITS, { char: 1, word: 3, line: 4 });
  assert.deepEqual(T.MODES, ["fill", "stroke", "both"]);
});
