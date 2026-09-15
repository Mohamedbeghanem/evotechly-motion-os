"use strict";

/**
 * EvotechlyNative P1 + P2b packs.
 * Require this file as `core/assets/index` — `core/assets.js` is the older filename parser.
 */

const text = require("./textAnimations");
const ui = require("./uiMicro");
const cursor = require("./cursorPack");
const charts = require("./chartsDevices");
const C = require("./common");

const NATIVE_ASSET_IDS = text.TEXT_IDS.concat(ui.UI_MICRO_IDS).concat(cursor.CURSOR_IDS).concat(charts.CHART_DEVICE_IDS);

function isNativeAssetId(id) {
  const norm = C.normalizeId(id);
  return NATIVE_ASSET_IDS.indexOf(norm) !== -1;
}

function catalogRows() {
  return text.catalogRows().concat(ui.catalogRows()).concat(cursor.catalogRows()).concat(charts.catalogRows());
}

function applyAssetPlan(opts) {
  opts = opts || {};
  const id = C.normalizeId(opts.id);
  if (text.isTextId(id)) return text.applyTextPlan(opts);
  if (ui.isUiMicroId(id)) return ui.applyUiMicroPlan(opts);
  if (cursor.isCursorId(id)) return cursor.applyCursorPlan(opts);
  if (charts.isChartDeviceId(id)) return charts.applyChartDevicePlan(opts);
  return C.wrapPlan("asset", id || "EVT_UNKNOWN", C.resolveTiming(opts, "STANDARD"), {
    implemented: false,
    description: (id || "missing-id") + " is not a P1 / P2b native asset.",
    layers: []
  });
}

function uniqueIdErrors(ids) {
  const list = ids || NATIVE_ASSET_IDS;
  const seen = {};
  const errors = [];
  list.forEach(function (id) {
    if (!id || String(id).indexOf("EVT_") !== 0) {
      errors.push("bad-id:" + id);
      return;
    }
    if (seen[id]) errors.push("duplicate:" + id);
    seen[id] = true;
  });
  return errors;
}

module.exports = {
  NATIVE_ASSET_IDS,
  isNativeAssetId,
  catalogRows,
  applyAssetPlan,
  uniqueIdErrors,
  text: text,
  ui: ui,
  cursor: cursor,
  charts: charts
};
