"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const C = require("../core/captionStyle");
const captions = require("../core/captions");
const F = require("../core/editorFreeKit");
const { generateMotion } = require("../api/motionAPI");

const sample = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "examples", "saas-hero.json"), "utf8")
);

test("colorKeywords returns a deterministic animator / range plan", function () {
  const opts = {
    text: "Ship FAST. Ship calm.",
    keywords: ["ship", "FAST"],
    colorHex: "#3DDC97"
  };
  const a = C.colorKeywords(opts);
  const b = C.colorKeywords(opts);
  assert.deepEqual(a, b);
  assert.equal(a.kind, "colorKeywords");
  assert.equal(a.colorHex, "#3DDC97");
  assert.deepEqual(a.colorRgb, C.hexToRgb01("#3DDC97"));
  assert.equal(a.ranges.length, 3);
  assert.equal(a.animators.length, 3);
  assert.equal(a.ranges[0].keyword.toLowerCase(), "ship");
  assert.equal(a.ranges[0].start, 0);
  assert.equal(a.ranges[0].end, 4);
  assert.equal(a.ranges[0].aeStart, 1);
  assert.equal(a.ranges[1].keyword, "FAST");
  assert.equal(a.ranges[1].start, 5);
  assert.equal(a.animators[0].name, "EVO_CAP_COLOR_0");
  assert.equal(a.animators[0].matchName, "ADBE Text Fill Color");
  assert.equal(a.animators[0].selector.basedOn, "characters");
  assert.ok(a.note.indexOf("Meow") !== -1);
  assert.ok(a.note.indexOf("not required") !== -1);
});

test("colorKeywords is case-insensitive, longest-first, and skips overlaps", function () {
  const plan = C.colorKeywords({
    text: "automation auto",
    keywords: ["auto", "automation"],
    colorHex: "#ff0"
  });
  assert.equal(plan.colorHex, "#FFFF00");
  assert.equal(plan.ranges.length, 2);
  assert.equal(plan.ranges[0].keyword, "automation");
  assert.equal(plan.ranges[0].start, 0);
  assert.equal(plan.ranges[0].end, 10);
  assert.equal(plan.ranges[1].keyword, "auto");
  assert.equal(plan.ranges[1].start, 11);
  const comma = C.colorKeywords({
    text: "Ship fast",
    keywords: "ship, ship, FAST",
    colorHex: "0a7"
  });
  assert.equal(comma.ranges.length, 2);
  assert.equal(comma.colorHex, "#00AA77");
});

test("colorKeywords handles empty, missing, and Arabic live text", function () {
  assert.deepEqual(C.colorKeywords({ text: "", keywords: ["a"] }).ranges, []);
  assert.deepEqual(C.colorKeywords({ text: "hello", keywords: [] }).animators, []);
  assert.deepEqual(C.colorKeywords({}).ranges, []);
  const ar = C.colorKeywords({
    text: "لوحة التحكم FAST",
    keywords: ["FAST", "لوحة"],
    colorHex: "#3ddc97"
  });
  assert.equal(ar.arabic, true);
  assert.equal(ar.ranges.length, 2);
  assert.equal(ar.ranges[0].keyword, "لوحة");
  assert.ok(ar.ranges[1].start > ar.ranges[0].end);
  assert.equal(C.parseColorHex("nope"), C.DEFAULT_COLOR);
  assert.equal(C.parseColorHex("#3dd"), "#33DDDD");
  assert.deepEqual(C.hexToRgb01("#000000"), [0, 0, 0]);
  assert.deepEqual(C.hexToRgb01("#FFFFFF"), [1, 1, 1]);
});

test("captionInOut plans fade scale slideUp typewriter blur for in/out/both", function () {
  const fade = C.captionInOut({ preset: "fade", direction: "in", frames: 12 });
  const again = C.captionInOut({ preset: "fade", direction: "in", frames: 12 });
  assert.deepEqual(fade, again);
  assert.equal(fade.kind, "captionInOut");
  assert.equal(fade.preset, "fade");
  assert.equal(fade.direction, "in");
  assert.equal(fade.frames, 12);
  assert.equal(fade.fps, 30);
  assert.equal(fade.duration, 0.4);
  assert.equal(fade.hold, 0);
  assert.equal(fade.easeInfluences.influenceIn, 80);
  assert.equal(fade.animators[0].matchName, "ADBE Text Opacity");
  assert.equal(fade.animators[0].keys[0].value, 0);
  assert.equal(fade.animators[0].keys[1].value, 100);

  const out = C.captionInOut({ preset: "scale", direction: "out", frames: 15, fps: 30 });
  assert.equal(out.preset, "scale");
  assert.equal(out.duration, 0.5);
  assert.deepEqual(out.animators[0].keys[0].value, [100, 100, 100]);
  assert.deepEqual(out.animators[0].keys[1].value, [80, 80, 100]);

  const slide = C.captionInOut({ preset: "Slide Up", direction: "in", frames: 12 });
  assert.equal(slide.preset, "slideUp");
  assert.equal(slide.animators.length, 2);
  assert.deepEqual(slide.animators[1].from, [0, C.SLIDE_TRAVEL, 0]);

  const tw = C.captionInOut({ preset: "typewriter", direction: "in", frames: 12 });
  assert.equal(tw.animators[0].value, 0);
  assert.equal(tw.animators[0].selector.basedOn, "characters");
  assert.equal(tw.animators[0].selectorKeys[0].end, 0);
  assert.equal(tw.animators[0].selectorKeys[1].end, 100);

  const blur = C.captionInOut({ preset: "blur", direction: "both", frames: 12 });
  assert.equal(blur.hold, C.HOLD);
  assert.equal(blur.animators[1].matchName, "ADBE Text Blur");
  assert.equal(blur.animators[1].keys.length, 4);
  assert.equal(blur.animators[1].keys[0].value, C.BLUR_FROM);
  assert.equal(blur.animators[1].keys[1].value, 0);
  assert.equal(blur.animators[1].keys[3].value, C.BLUR_FROM);

  const twOut = C.captionInOut({ preset: "typewriter", direction: "out", frames: 10 });
  assert.equal(twOut.animators[0].selectorKeys[0].end, 100);
  assert.equal(twOut.animators[0].selectorKeys[1].end, 0);
});

test("captionInOut clamps frames, falls back preset/direction, and protects Arabic", function () {
  assert.equal(C.normalizePreset("nope"), "fade");
  assert.equal(C.captionInOut({ preset: "explode", direction: "sideways" }).preset, "fade");
  assert.equal(C.captionInOut({ preset: "explode", direction: "sideways" }).direction, "in");
  assert.equal(C.captionInOut({ frames: 0 }).frames, 1);
  assert.equal(C.captionInOut({ frames: 999 }).frames, 180);
  const ar = C.captionInOut({
    preset: "typewriter",
    direction: "in",
    frames: 12,
    text: "العنوان بالعربية"
  });
  assert.equal(ar.requestedPreset, "typewriter");
  assert.equal(ar.preset, "fade");
  assert.equal(ar.arabic, true);
  assert.ok(ar.note.indexOf("Arabic") !== -1);
  assert.equal(ar.animators[0].property, "opacity");
  assert.ok(C.PRESETS.indexOf("typewriter") !== -1);
  assert.deepEqual(C.PRESETS, ["fade", "scale", "slideUp", "typewriter", "blur"]);
});

test("captionValueAt interpolates in/out keys", function () {
  const fade = C.captionInOut({ preset: "fade", direction: "in", frames: 12 });
  assert.equal(C.captionValueAt(fade, "opacity", 0), 0);
  assert.equal(C.captionValueAt(fade, "opacity", 0.4), 100);
  assert.equal(C.captionValueAt(fade, "opacity", 0.2), 50);
  const tw = C.captionInOut({ preset: "typewriter", direction: "in", frames: 12 });
  assert.equal(C.captionValueAt(tw, "opacity", 0), 0);
  assert.equal(C.captionValueAt(tw, "opacity", 0.4), 100);
  const both = C.captionInOut({ preset: "fade", direction: "both", frames: 12 });
  assert.equal(C.captionValueAt(both, "opacity", 0.4), 100);
  assert.equal(C.captionValueAt(both, "opacity", 0.4 + C.HOLD), 100);
  assert.equal(C.captionValueAt(both, "opacity", 0.4 + C.HOLD + 0.4), 0);
});

test("captions.js re-exports P1c helpers; stripe hero unchanged", function () {
  assert.equal(typeof captions.colorKeywords, "function");
  assert.equal(typeof captions.captionInOut, "function");
  assert.equal(typeof captions.parseSrt, "function");
  const plan = captions.colorKeywords({
    text: "Hook line",
    keywords: ["Hook"],
    colorHex: "#3DDC97"
  });
  assert.equal(plan.ranges[0].start, 0);
  const hero = generateMotion(sample);
  assert.equal(hero.style, "stripe");
  assert.equal(hero.travel, 1);
  const byName = {};
  hero.layers.forEach(function (l) { byName[l.layer] = l; });
  assert.ok(byName.CTA.delay >= byName["Card 2"].delay);
});

test("P1c owns Meow/Presetify jobs without vendor code or ElevenLabs", function () {
  const src = fs.readFileSync(path.join(__dirname, "..", "core", "captionStyle.js"), "utf8");
  const jsx = fs.readFileSync(path.join(__dirname, "..", "ae", "Caption Style Tools.jsx"), "utf8");
  assert.ok(src.indexOf("api.eleven") === -1);
  assert.ok(src.indexOf("xi-api") === -1);
  assert.ok(jsx.indexOf("api.eleven") === -1);
  assert.ok(jsx.indexOf("xi-api") === -1);
  assert.ok(jsx.indexOf("sinopskyd") === -1);
  assert.ok(jsx.indexOf("kuldeepmp4") === -1);
  assert.ok(jsx.indexOf("not used") !== -1);
  assert.ok(jsx.indexOf("#target aftereffects") === 0);
  assert.ok(jsx.indexOf("ADBE Text Fill Color") !== -1);
  assert.ok(jsx.indexOf("ADBE Text Animators") !== -1);
  assert.ok(jsx.indexOf("Color keywords") !== -1);
  assert.ok(jsx.indexOf("Apply in/out") !== -1);
  assert.ok(C.COMPANIONS_POLICY.indexOf("Never redistributed") !== -1);
  assert.ok(C.COMPANIONS_POLICY.indexOf("Caption Style Tools") !== -1);
  assert.ok(F.tabsForJob("talkingHead").some(function (t) { return t.indexOf("Caption Style Tools") !== -1; }));
  assert.ok(F.tabsForJob("reel").some(function (t) { return t.indexOf("Caption Style Tools") !== -1; }));
  assert.ok(F.INSTALL_ORDER.filter(function (c) { return c.id === "meowCaptions"; })[0].note.indexOf("Caption Style Tools") !== -1);
});
