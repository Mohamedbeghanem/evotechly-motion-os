"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assets = require("../core/assets/index");
const charts = require("../core/assets/chartsDevices");
const text = require("../core/assets/textAnimations");
const stagger = require("../core/transitions/staggerCascade");
const scaleZoom = require("../core/transitions/scaleZoom");

const PACK = path.join(__dirname, "..", "Evotechly-SaaS-Assets");
const REGISTRY_PATH = path.join(PACK, "Metadata", "asset-registry.json");
const JSX_PATH = path.join(__dirname, "..", "ae", "Evotechly Transitions.jsx");
const CHARTS_README = path.join(PACK, "08_Charts-Dashboards", "README.md");

function planTwice(id, extra) {
  const opts = Object.assign({ id: id, durationFrames: 15, fps: 30 }, extra || {});
  const a = charts.applyChartDevicePlan(opts);
  const b = charts.applyChartDevicePlan(opts);
  return { a: a, b: b };
}

test("P2b chart/device IDs are unique and registered as native", function () {
  assert.equal(charts.CHART_DEVICE_IDS.length, 11);
  assert.deepEqual(assets.uniqueIdErrors(), []);
  charts.CHART_DEVICE_IDS.forEach(function (id) {
    assert.match(id, /^EVT_[A-Z0-9_]+$/);
    assert.equal(assets.isNativeAssetId(id), true);
  });
  assert.ok(charts.isChartDeviceId("evt-chart-bar-draw"));
  assert.equal(charts.isChartDeviceId("EVT_TEXT_NUMBER_COUNTER"), false);
  assert.equal(charts.isDeviceId("EVT_DEVICE_LAPTOP_IN"), true);
  assert.equal(charts.isDeviceId("EVT_CHART_SPARK"), false);
});

test("every P2b chart/device plan is deterministic and complete", function () {
  charts.CHART_DEVICE_IDS.forEach(function (id) {
    const { a, b } = planTwice(id, { layer: { name: "Widget", position: [960, 540] } });
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
    assert.ok(a.note.indexOf("3D camera") !== -1 || a.note.indexOf("no bounce") !== -1);
  });
});

test("bar/column rise use independent scale axes without bounce", function () {
  const bar = charts.applyChartDevicePlan({ id: "EVT_CHART_BAR_DRAW", durationFrames: 15, fps: 30 });
  assert.equal(bar.kind, "chart-asset");
  assert.equal(bar.growAxis, "x");
  assert.equal(bar.outgoing.keys[0].scale[0], 0);
  assert.equal(bar.outgoing.keys[0].scale[1], 100);
  assert.equal(bar.outgoing.keys[bar.outgoing.keys.length - 1].scale[0], 100);
  assert.equal(bar.outgoing.keys[bar.outgoing.keys.length - 1].scale[1], 100);
  bar.outgoing.keys.forEach(function (k) {
    assert.ok(k.scale[0] <= 100, "bar must not overshoot");
  });

  const col = charts.applyChartDevicePlan({ id: "EVT_CHART_COLUMN_RISE", durationFrames: 15, fps: 30 });
  assert.equal(col.growAxis, "y");
  assert.equal(col.outgoing.keys[0].scale[0], 100);
  assert.equal(col.outgoing.keys[0].scale[1], 0);
  assert.equal(col.outgoing.keys[col.outgoing.keys.length - 1].scale[1], 100);
  col.outgoing.keys.forEach(function (k) {
    assert.ok(k.scale[1] <= 100, "column must not overshoot");
  });
});

test("line / donut / spark use native trim paths", function () {
  const line = charts.applyChartDevicePlan({ id: "EVT_CHART_LINE_REVEAL", durationFrames: 21, fps: 30 });
  assert.equal(line.trimPath.matchName, "ADBE Vector Filter - Trim");
  assert.equal(line.trimPath.endMatchName, "ADBE Vector Trim End");
  assert.equal(line.trimPath.keys[0].value, 0);
  assert.equal(line.trimPath.keys[line.trimPath.keys.length - 1].value, 100);

  const donut = charts.applyChartDevicePlan({ id: "EVT_CHART_DONUT_FILL", durationFrames: 21, fps: 30, fillPct: 72 });
  assert.equal(donut.trimPath.fillPct, 72);
  assert.equal(donut.trimPath.keys[donut.trimPath.keys.length - 1].value, 72);
  assert.ok(donut.trimPath.note.indexOf("spin") !== -1);

  const spark = charts.applyChartDevicePlan({ id: "EVT_CHART_SPARK", durationFrames: 10, fps: 30 });
  assert.equal(spark.group, "FAST");
  assert.equal(spark.trimPath.keys[spark.trimPath.keys.length - 1].value, 100);
});

test("series and funnel reuse Stagger-Cascade numbers", function () {
  assert.equal(charts.OFFSET_FRAMES, stagger.OFFSET_FRAMES);
  assert.equal(charts.TRAVEL_PX, stagger.TRAVEL_PX);
  assert.equal(charts.CARD_ENTER_SCALE, stagger.CARD_ENTER_SCALE);
  assert.equal(charts.FUNNEL_TRAVEL_PX, stagger.CASCADE_IN_TRAVEL_PX);

  const series = charts.applyChartDevicePlan({
    id: "EVT_CHART_SERIES_ENTER",
    durationFrames: 15,
    fps: 30,
    itemCount: 4
  });
  assert.equal(series.stagger.offsetFrames, 3);
  assert.equal(series.stagger.travelPx, 16);
  assert.equal(series.stagger.noBounce, true);
  assert.equal(series.stagger.itemCount, 4);
  assert.equal(series.layers.length, 4);
  assert.equal(series.layers[1].set.opacity[0].t, series.layers[0].set.opacity[0].t + 3 / 30);
  assert.equal(series.outgoing.keys[0].y, 16);
  assert.equal(series.outgoing.keys[0].scale[0], 98);

  const funnel = charts.applyChartDevicePlan({ id: "EVT_CHART_FUNNEL_IN", durationFrames: 15, fps: 30 });
  assert.equal(funnel.stagger.travelPx, 12);
  assert.equal(funnel.outgoing.keys[0].scale[0], 97);
});

test("KPI count pairs with the existing text counter and widget present", function () {
  const kpi = charts.applyChartDevicePlan({ id: "EVT_CHART_KPI_COUNT", from: 0, to: 100, durationFrames: 20, fps: 30 });
  assert.equal(kpi.ease, "linear");
  assert.equal(kpi.sourceText.keys[0].value, "0");
  assert.equal(kpi.sourceText.keys[kpi.sourceText.keys.length - 1].value, "100");
  assert.equal(kpi.outgoing.keys[0].y, 8);
  assert.equal(kpi.outgoing.keys[0].scale[0], 96);
  assert.equal(kpi.outgoing.keys[kpi.outgoing.keys.length - 1].scale[0], 100);

  const textNum = text.applyTextPlan({ id: "EVT_TEXT_NUMBER_COUNTER", from: 0, to: 100, durationFrames: 20, fps: 30 });
  assert.deepEqual(kpi.sourceText.keys, textNum.sourceText.keys);
});

test("device plates reuse Scale-Zoom pop and never claim a 3D camera", function () {
  assert.equal(charts.POP_START, scaleZoom.POP_START);

  const laptop = charts.applyChartDevicePlan({ id: "EVT_DEVICE_LAPTOP_IN", durationFrames: 15, fps: 30 });
  assert.equal(laptop.kind, "device-asset");
  assert.equal(laptop.enterScale, 90);
  assert.equal(laptop.liftY, 12);
  assert.equal(laptop.noCamera, true);
  assert.equal(laptop.outgoing.keys[0].scale[0], 90);
  assert.equal(laptop.outgoing.keys[laptop.outgoing.keys.length - 1].scale[0], 100);
  laptop.outgoing.keys.forEach(function (k) {
    assert.ok(k.scale[0] <= 100, "laptop must not bounce past 100");
  });

  const phone = charts.applyChartDevicePlan({ id: "EVT_DEVICE_PHONE_IN", durationFrames: 10, fps: 30 });
  assert.equal(phone.enterScale, 92);
  assert.equal(phone.liftY, 10);
  assert.equal(phone.noCamera, true);

  const widget = charts.applyChartDevicePlan({ id: "EVT_DASH_WIDGET_IN", durationFrames: 10, fps: 30 });
  assert.equal(widget.enterScale, 90);
  assert.equal(widget.kind, "chart-asset");
});

test("asset registry lists every P2b ID as owned native", function () {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  assert.equal(registry.phase, "P2b");
  assert.equal(registry.version, "0.3.0-p2b");
  const byId = {};
  registry.assets.forEach(function (row) {
    byId[row.id] = row;
  });
  charts.CHART_DEVICE_IDS.forEach(function (id) {
    const row = byId[id];
    assert.ok(row, "registry missing " + id);
    assert.equal(row.sourceType, "native");
    assert.equal(row.commercialUse, true);
    assert.equal(row.owner, "Evotechly");
    assert.equal(row.status, "OWNED");
    assert.equal(row.implemented, true);
    assert.equal(row.folder, "08_Charts-Dashboards");
    assert.match(row.notes, /P2b native/);
  });
});

test("JSX Charts tab mirrors P2b IDs and apply hooks", function () {
  const jsx = fs.readFileSync(JSX_PATH, "utf8");
  assert.ok(jsx.indexOf('tabs.add("tab", undefined, "Charts")') !== -1);
  assert.ok(jsx.indexOf('tabs.add("tab", undefined, "Transitions")') !== -1);
  assert.ok(jsx.indexOf('tabs.add("tab", undefined, "Text")') !== -1);
  assert.ok(jsx.indexOf('tabs.add("tab", undefined, "UI")') !== -1);
  assert.ok(jsx.indexOf('tabs.add("tab", undefined, "Cursor")') !== -1);
  assert.ok(jsx.indexOf("function applyTrimPath") !== -1);
  assert.ok(jsx.indexOf("function planChartGrowKeys") !== -1);
  assert.ok(jsx.indexOf("ADBE Vector Filter - Trim") !== -1);
  charts.CHART_DEVICE_IDS.forEach(function (id) {
    assert.ok(jsx.indexOf(id) !== -1, id + " missing from JSX");
  });
  assert.ok(jsx.indexOf("does not replace") !== -1);
});

test("Charts-Dashboards README claims owned P2b IDs", function () {
  const body = fs.readFileSync(CHARTS_README, "utf8");
  assert.match(body, /P2b/);
  charts.CHART_DEVICE_IDS.forEach(function (id) {
    assert.ok(body.indexOf(id) !== -1, id + " missing from 08 README");
  });
  assert.doesNotMatch(body, /planned only/);
});
