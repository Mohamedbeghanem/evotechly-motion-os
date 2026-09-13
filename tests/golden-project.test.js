"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const G = require("../core/goldenProject");
const F = require("../core/editorFreeKit");
const { detectRole } = require("../core/roles");
const { SAFE } = require("../core/captions");

test("golden project names are frozen and ordered", function () {
  assert.deepEqual(G.COMP_NAMES, ["00_HOME", "ERP_DEMO", "TALKING_HEAD", "REEL_9x16"]);
  assert.equal(G.META_NULL, "EVO_GOLDEN_META");
  assert.equal(G.DESKTOP.width, 1920);
  assert.equal(G.DESKTOP.height, 1080);
  assert.equal(G.REEL.width, 1080);
  assert.equal(G.REEL.height, 1920);
  assert.equal(G.specFor("REEL_9x16").frame, "reel916");
  assert.equal(G.specFor("00_HOME").fps, 30);
});

test("planGoldenProject is idempotent by exact comp name", function () {
  const empty = G.planGoldenProject([]);
  const again = G.planGoldenProject([]);
  assert.deepEqual(empty, again);
  assert.equal(empty.kind, "goldenProject");
  assert.deepEqual(empty.created, G.COMP_NAMES);
  assert.deepEqual(empty.skipped, []);
  assert.equal(empty.comps.length, 4);
  assert.equal(empty.meta, "EVO_GOLDEN_META");

  const all = G.planGoldenProject(G.COMP_NAMES);
  assert.deepEqual(all.created, []);
  assert.deepEqual(all.skipped, G.COMP_NAMES);
  assert.equal(all.comps.length, 0);

  const partial = G.planGoldenProject(["00_HOME", "REEL_9x16"]);
  assert.deepEqual(partial.created, ["ERP_DEMO", "TALKING_HEAD"]);
  assert.deepEqual(partial.skipped, ["00_HOME", "REEL_9x16"]);

  assert.equal(G.hasComp(["00_home"], "00_HOME"), false);
  assert.equal(G.hasComp(["00_HOME"], "00_HOME"), true);
  assert.deepEqual(G.compsToCreate(["00_HOME"]), ["ERP_DEMO", "TALKING_HEAD", "REEL_9x16"]);
  assert.deepEqual(G.compsToSkip(["ERP_DEMO"]), ["ERP_DEMO"]);
});

test("ERP_DEMO shape layers use Motion OS role names", function () {
  const names = G.layerNamesFor("ERP_DEMO");
  ["Title", "Subtitle", "Card 1", "Card 2", "Card 3", "CTA", "Screenshot", "Cursor", "Nav", "Sidebar"].forEach(function (name) {
    assert.ok(names.indexOf(name) !== -1, name);
  });
  const byRole = {};
  G.erpLayers().forEach(function (layer) {
    assert.equal(detectRole({ name: layer.name }), layer.role);
    byRole[layer.role] = (byRole[layer.role] || 0) + 1;
  });
  assert.equal(byRole.card, 3);
  assert.equal(byRole.cta, 1);
  assert.equal(byRole.cursor, 1);
});

test("TALKING_HEAD has placeholder video and mid-stack captions", function () {
  const names = G.layerNamesFor("TALKING_HEAD");
  assert.ok(names.indexOf("VIDEO_PLACEHOLDER") !== -1);
  assert.ok(names.indexOf("CUTOUT") !== -1);
  assert.ok(names.indexOf("Caption") !== -1);
  assert.ok(names.indexOf("Caption AR") !== -1);
  assert.ok(names.indexOf("Caption EN") !== -1);
  assert.ok(names.indexOf("STACK_NOTE") !== -1);
  assert.ok(names.indexOf("Product UI / L3") !== -1);
  assert.ok(names.indexOf("BG") !== -1);
  const caption = G.talkingHeadLayers().filter(function (layer) {
    return layer.role === "caption";
  });
  assert.ok(caption.length >= 3);
  assert.equal(detectRole({ name: "Caption" }), "caption");
});

test("REEL_9x16 caption guides match native 9:16 safe margins", function () {
  const spec = G.specFor("REEL_9x16");
  assert.equal(spec.width, 1080);
  assert.equal(spec.height, 1920);
  const names = spec.layers.map(function (layer) {
    return layer.name;
  });
  ["SAFE_TOP", "SAFE_BOTTOM", "SAFE_LEFT", "SAFE_RIGHT", "Hook", "Kinetic", "Caption"].forEach(function (name) {
    assert.ok(names.indexOf(name) !== -1, name);
  });
  const top = spec.layers.filter(function (layer) { return layer.name === "SAFE_TOP"; })[0];
  assert.equal(top.size[1], Math.round(1920 * SAFE.reel916.top));
  const side = spec.layers.filter(function (layer) { return layer.name === "SAFE_LEFT"; })[0];
  assert.equal(side.size[0], Math.round(1080 * SAFE.reel916.side));
});

test("00_HOME documents required tabs on shy meta null", function () {
  const spec = G.specFor("00_HOME");
  const meta = spec.layers.filter(function (layer) { return layer.name === G.META_NULL; })[0];
  assert.ok(meta);
  assert.equal(meta.kind, "null");
  assert.equal(meta.shy, true);
  assert.equal(meta.guide, true);
  assert.ok(meta.comment.indexOf("Motion") !== -1);
  assert.ok(meta.comment.indexOf("SaaS Demo") !== -1);
  assert.ok(G.REQUIRED_TABS.indexOf("Window → SaaS Demo Tools") !== -1);
  const pre = spec.layers.filter(function (layer) { return layer.kind === "precomp"; }).map(function (layer) {
    return layer.name;
  });
  assert.deepEqual(pre, ["ERP_DEMO", "TALKING_HEAD", "REEL_9x16"]);
});

test("job map routes SaaS / talking-head / reel to tabs and buttons", function () {
  const saas = G.jobFor("saas");
  assert.equal(saas.comp, "ERP_DEMO");
  assert.ok(saas.saasDemo.indexOf("Cursor + click") !== -1);
  assert.ok(saas.saasDemo.indexOf("Glass Panel (selected)") !== -1);
  assert.ok(saas.tabs.some(function (t) { return t.indexOf("Motion") === 0; }));

  const talk = G.jobFor("talkingHead");
  assert.equal(talk.comp, "TALKING_HEAD");
  assert.deepEqual(talk.saasDemo, []);
  assert.ok(talk.tabs[0].indexOf("Person") === 0);

  const reel = G.jobFor("reel");
  assert.equal(reel.comp, "REEL_9x16");
  assert.ok(reel.tabs.some(function (t) { return t.indexOf("Captions") === 0; }));
  assert.ok(reel.saasDemo.indexOf("Gradient Wipe (selected)") !== -1);

  assert.equal(G.jobFor("unknown").comp, "ERP_DEMO");
  assert.deepEqual(F.GOLDEN_SEED.comps, G.COMP_NAMES);
  assert.equal(F.GOLDEN_SEED.script, "ae/Seed Golden Project.jsx");
});
