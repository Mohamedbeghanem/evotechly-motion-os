"use strict";

/**
 * EvotechlyNative P2b charts / device plates.
 * EvoCRM: KPI widget, pipeline funnel, activity spark, laptop/phone frames.
 * Reuses Scale-Zoom POP_START (90) and Stagger-Cascade offset/travel (3f / 16px).
 * Soft present. No bounce, no glitch, no 3D camera.
 * Node is source of truth. JSX mirrors apply numbers.
 */

const { STAGGER } = require("../saasDemo");
const { POP_START } = require("../transitions/scaleZoom");
const stagger = require("../transitions/staggerCascade");
const text = require("./textAnimations");
const C = require("./common");

const CHART_DEVICE_IDS = [
  "EVT_CHART_SERIES_ENTER",
  "EVT_CHART_BAR_DRAW",
  "EVT_CHART_COLUMN_RISE",
  "EVT_CHART_LINE_REVEAL",
  "EVT_CHART_DONUT_FILL",
  "EVT_CHART_KPI_COUNT",
  "EVT_CHART_FUNNEL_IN",
  "EVT_CHART_SPARK",
  "EVT_DASH_WIDGET_IN",
  "EVT_DEVICE_LAPTOP_IN",
  "EVT_DEVICE_PHONE_IN"
];

const CHART_DEVICE_META = {
  EVT_CHART_SERIES_ENTER: {
    name: "Chart Series Enter",
    group: "STANDARD",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "EvoCRM series / bars stagger in — 3f offset, 16px lift"
  },
  EVT_CHART_BAR_DRAW: {
    name: "Chart Bar Draw",
    group: "STANDARD",
    ease: "apple-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Horizontal bar grows scaleX 0→100, no bounce"
  },
  EVT_CHART_COLUMN_RISE: {
    name: "Chart Column Rise",
    group: "STANDARD",
    ease: "apple-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Vertical column rises scaleY 0→100"
  },
  EVT_CHART_LINE_REVEAL: {
    name: "Chart Line Reveal",
    group: "SMOOTH",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Line draw — native trim path 0→100"
  },
  EVT_CHART_DONUT_FILL: {
    name: "Chart Donut Fill",
    group: "SMOOTH",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Donut / arc fill to a percent, no spin"
  },
  EVT_CHART_KPI_COUNT: {
    name: "Chart KPI Count",
    group: "SMOOTH",
    ease: "linear",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "KPI widget present + linear count-up (pairs with Text counters)"
  },
  EVT_CHART_FUNNEL_IN: {
    name: "Chart Funnel In",
    group: "STANDARD",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Pipeline funnel stages stagger in"
  },
  EVT_CHART_SPARK: {
    name: "Chart Spark",
    group: "FAST",
    ease: "apple-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Activity sparkline draw"
  },
  EVT_DASH_WIDGET_IN: {
    name: "Dash Widget In",
    group: "FAST",
    ease: "fast-product",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Dashboard widget present — Scale-Zoom 90→100"
  },
  EVT_DEVICE_LAPTOP_IN: {
    name: "Device Laptop In",
    group: "STANDARD",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Laptop frame present — not a 3D camera"
  },
  EVT_DEVICE_PHONE_IN: {
    name: "Device Phone In",
    group: "FAST",
    ease: "premium-smooth",
    category: "Charts-Dashboards",
    folder: "08_Charts-Dashboards",
    bestUse: "Phone frame present — not a 3D camera"
  }
};

const OFFSET_FRAMES = stagger.OFFSET_FRAMES;
const TRAVEL_PX = stagger.TRAVEL_PX;
const CARD_ENTER_SCALE = stagger.CARD_ENTER_SCALE;
const FUNNEL_TRAVEL_PX = stagger.CASCADE_IN_TRAVEL_PX;
const DEFAULT_ITEM_COUNT = stagger.DEFAULT_ITEM_COUNT;
const HOLD_SEC = stagger.HOLD_SEC;
const GROW_MID = 72;
const DONUT_FILL_DEFAULT = 72;
const SPARK_FILL = 100;
const KPI_ENTER_Y = 8;
const KPI_ENTER_SCALE = 96;
const DEVICE_LAPTOP_Y = 12;
const DEVICE_PHONE_Y = 10;
const DEVICE_PHONE_SCALE = 92;
const WIDGET_MID_OPACITY = 84;
const TRIM_MATCH = "ADBE Vector Filter - Trim";
const TRIM_END = "ADBE Vector Trim End";

function isChartDeviceId(id) {
  return CHART_DEVICE_IDS.indexOf(C.normalizeId(id)) !== -1;
}

function isDeviceId(id) {
  const norm = C.normalizeId(id);
  return norm === "EVT_DEVICE_LAPTOP_IN" || norm === "EVT_DEVICE_PHONE_IN";
}

function isStaggerChartId(id) {
  const norm = C.normalizeId(id);
  return norm === "EVT_CHART_SERIES_ENTER" || norm === "EVT_CHART_FUNNEL_IN";
}

function isTrimChartId(id) {
  const norm = C.normalizeId(id);
  return norm === "EVT_CHART_LINE_REVEAL" || norm === "EVT_CHART_DONUT_FILL" || norm === "EVT_CHART_SPARK";
}

function catalogRows() {
  return CHART_DEVICE_IDS.map(function (id) {
    const meta = CHART_DEVICE_META[id];
    return {
      id: id,
      name: meta.name,
      category: meta.category,
      folder: meta.folder,
      group: meta.group,
      ease: meta.ease,
      bestUse: meta.bestUse,
      implemented: true,
      transitionKitPath: "core/assets/chartsDevices.js",
      notes: "P2b native. " + meta.bestUse + ". Apply: Evotechly Transitions → Charts."
    };
  });
}

function shiftKeys(keys, offsetFrames, fps) {
  const offset = Math.round(C.clamp(offsetFrames, 0, 120));
  return keys.map(function (k) {
    const frame = k.frame + offset;
    const copy = Object.assign({}, k, {
      frame: frame,
      t: C.secondsFromFrames(frame, fps)
    });
    if (k.scale) copy.scale = k.scale.slice();
    return copy;
  });
}

function layerFromPoses(name, role, rest, keys) {
  return C.restRelativeOps(name, role, keys, rest);
}

function resolveItemLayers(opts, count) {
  const list = opts.layers || opts.items;
  if (Array.isArray(list) && list.length) return list;
  const names = [];
  let i;
  for (i = 0; i < count; i++) {
    names.push({ name: i === 0 ? C.layerName(opts.layer, "Series 0") : "Series " + i, position: C.layerRest(opts.layer) });
  }
  return names;
}

function trimKeys(ph, fps, endValue) {
  const end = C.round4(endValue == null ? 100 : endValue);
  return [
    { t: C.secondsFromFrames(ph.start, fps), frame: ph.start, value: 0, phase: "start" },
    { t: C.secondsFromFrames(ph.mid, fps), frame: ph.mid, value: C.round4(end * (GROW_MID / 100)), phase: "mid" },
    { t: C.secondsFromFrames(ph.end, fps), frame: ph.end, value: end, phase: "done" }
  ];
}

function makeTrimPath(keys, fillPct) {
  return {
    matchName: TRIM_MATCH,
    endMatchName: TRIM_END,
    start: 0,
    fillPct: fillPct == null ? 100 : C.round4(fillPct),
    keys: keys,
    note: "Native trim path. Soft draw, no spin / bounce."
  };
}

function seriesPoses(ph, travel, enterScale) {
  return [
    { frame: ph.start, x: 0, y: travel, sx: enterScale, sy: enterScale, opacity: 0, blur: 0, phase: "start" },
    { frame: ph.mid, x: 0, y: C.round4(travel * 0.22), sx: C.round4(enterScale + 1.2), sy: C.round4(enterScale + 1.2), opacity: 78, blur: 0, phase: "mid" },
    { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
  ];
}

function growPoses(ph, axis) {
  const startSx = axis === "x" ? 0 : 100;
  const startSy = axis === "y" ? 0 : 100;
  const midSx = axis === "x" ? GROW_MID : 100;
  const midSy = axis === "y" ? GROW_MID : 100;
  return [
    { frame: ph.start, x: 0, y: 0, sx: startSx, sy: startSy, opacity: 80, blur: 0, phase: "start" },
    { frame: ph.mid, x: 0, y: 0, sx: midSx, sy: midSy, opacity: 100, blur: 0, phase: "mid" },
    { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
  ];
}

function popPresentPoses(ph, startScale, liftY) {
  const midScale = C.round4(startScale + (100 - startScale) * 0.6);
  return [
    { frame: ph.start, x: 0, y: liftY || 0, sx: startScale, sy: startScale, opacity: 0, blur: 2, phase: "start" },
    { frame: ph.mid, x: 0, y: C.round4((liftY || 0) * 0.18), sx: midScale, sy: midScale, opacity: WIDGET_MID_OPACITY, blur: 0, phase: "mid" },
    { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
  ];
}

function buildStaggerLayers(opts, timing, travel, enterScale) {
  const count = Math.max(2, Math.round(opts.staggerCount || opts.itemCount || DEFAULT_ITEM_COUNT));
  const items = resolveItemLayers(opts, count);
  const offset = opts.offsetFrames == null ? OFFSET_FRAMES : Math.round(C.clamp(opts.offsetFrames, 0, 120));
  const basePoses = seriesPoses(timing.phases, travel, enterScale);
  const baseKeys = C.poseKeys(timing.fps, basePoses);
  return items.map(function (layer, i) {
    const keys = shiftKeys(baseKeys, i * offset, timing.fps);
    const name = C.layerName(layer, "Series " + i);
    const rest = C.layerRest(layer);
    return {
      name: name,
      index: i,
      delayFrames: i * offset,
      delaySec: C.secondsFromFrames(i * offset, timing.fps),
      role: i === 0 ? "series" : "item",
      rest: [C.round4(rest[0]), C.round4(rest[1])],
      layer: layerFromPoses(name, i === 0 ? "series" : "item", rest, keys),
      keys: keys
    };
  });
}

function applyChartDevicePlan(opts) {
  opts = opts || {};
  const id = C.normalizeId(opts.id);
  if (!isChartDeviceId(id)) {
    return C.wrapPlan("chart-asset", id, C.resolveTiming(opts, "STANDARD"), {
      category: "Charts",
      implemented: false,
      description: id + " is not a P2b chart/device asset.",
      layers: []
    });
  }

  const meta = CHART_DEVICE_META[id];
  const timing = C.resolveTiming(opts, meta.group, opts.ease || meta.ease);
  const name = C.layerName(opts.layer, isDeviceId(id) ? "Device" : "Chart");
  const rest = C.layerRest(opts.layer);
  const ph = timing.phases;
  const kind = isDeviceId(id) ? "device-asset" : "chart-asset";
  const plan = C.wrapPlan(kind, id, timing, {
    category: isDeviceId(id) ? "Device" : "Charts",
    name: meta.name,
    bestUse: meta.bestUse,
    description: "Apply " + id + " · " + timing.frames + "f @" + timing.fps + "fps · " + timing.ease,
    note: "Native AE keyframes. Node plan is source of truth. JSX mirrors P2b Charts tab. Soft, no bounce, no glitch. No 3D camera.",
    layer: name,
    trimPath: null,
    sourceText: null,
    stagger: null,
    growAxis: null,
    layers: []
  });

  if (id === "EVT_CHART_SERIES_ENTER" || id === "EVT_CHART_FUNNEL_IN") {
    const travel = id === "EVT_CHART_FUNNEL_IN" ? FUNNEL_TRAVEL_PX : TRAVEL_PX;
    const enterScale = id === "EVT_CHART_FUNNEL_IN" ? 97 : CARD_ENTER_SCALE;
    const items = buildStaggerLayers(opts, timing, travel, enterScale);
    plan.layers = items.map(function (item) {
      return item.layer;
    });
    plan.outgoing = plan.layers[0];
    plan.stagger = {
      offsetFrames: items[1] ? items[1].delayFrames : OFFSET_FRAMES,
      travelPx: travel,
      holdSec: HOLD_SEC,
      itemCount: items.length,
      noBounce: true,
      items: items.map(function (item) {
        return {
          name: item.name,
          index: item.index,
          delayFrames: item.delayFrames,
          delaySec: item.delaySec,
          role: item.role
        };
      })
    };
    return plan;
  }

  if (id === "EVT_CHART_BAR_DRAW" || id === "EVT_CHART_COLUMN_RISE") {
    const axis = id === "EVT_CHART_BAR_DRAW" ? "x" : "y";
    const keys = C.poseKeys(timing.fps, growPoses(ph, axis));
    const layer = layerFromPoses(name, "bar", rest, keys);
    plan.growAxis = axis;
    plan.layers = [layer];
    plan.outgoing = layer;
    return plan;
  }

  if (id === "EVT_CHART_LINE_REVEAL" || id === "EVT_CHART_SPARK" || id === "EVT_CHART_DONUT_FILL") {
    const fillPct =
      opts.fillPct == null
        ? id === "EVT_CHART_DONUT_FILL"
          ? DONUT_FILL_DEFAULT
          : SPARK_FILL
        : C.clamp(Number(opts.fillPct), 1, 100);
    const fadeKeys = C.poseKeys(timing.fps, [
      { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 0, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
    ]);
    const layer = layerFromPoses(name, id === "EVT_CHART_DONUT_FILL" ? "donut" : "line", rest, fadeKeys);
    plan.trimPath = makeTrimPath(trimKeys(ph, timing.fps, fillPct), fillPct);
    plan.layers = [layer];
    plan.outgoing = layer;
    return plan;
  }

  if (id === "EVT_CHART_KPI_COUNT") {
    const from = opts.from == null ? 0 : Number(opts.from);
    const to = opts.to == null ? 124 : Number(opts.to);
    const keys = C.poseKeys(timing.fps, popPresentPoses(ph, KPI_ENTER_SCALE, KPI_ENTER_Y));
    const layer = layerFromPoses(name, "kpi", rest, keys);
    plan.sourceText = {
      from: from,
      to: to,
      prefix: opts.prefix == null ? "" : String(opts.prefix),
      suffix: opts.suffix == null ? "" : String(opts.suffix),
      decimals: opts.decimals == null ? 0 : Number(opts.decimals),
      keys: text.counterSteps(from, to, timing.frames, timing.fps, text.formatNumber),
      matchName: "ADBE Text Document",
      note: "Source-text keys. Linear count. Pairs with EVT_TEXT_NUMBER_COUNTER. No bounce."
    };
    plan.layers = [layer];
    plan.outgoing = layer;
    plan.ease = "linear";
    plan.easeInfluences = { influenceIn: 16, influenceOut: 16 };
    return plan;
  }

  let startScale = POP_START;
  let liftY = 8;
  if (id === "EVT_DEVICE_LAPTOP_IN") {
    startScale = POP_START;
    liftY = DEVICE_LAPTOP_Y;
  } else if (id === "EVT_DEVICE_PHONE_IN") {
    startScale = DEVICE_PHONE_SCALE;
    liftY = DEVICE_PHONE_Y;
  } else if (id === "EVT_DASH_WIDGET_IN") {
    startScale = POP_START;
    liftY = 8;
  }

  const keys = C.poseKeys(timing.fps, popPresentPoses(ph, startScale, liftY));
  const layer = layerFromPoses(name, isDeviceId(id) ? "device" : "widget", rest, keys);
  plan.layers = [layer];
  plan.outgoing = layer;
  plan.enterScale = startScale;
  plan.liftY = liftY;
  plan.noCamera = true;
  return plan;
}

module.exports = {
  CHART_DEVICE_IDS,
  CHART_DEVICE_META,
  OFFSET_FRAMES,
  TRAVEL_PX,
  CARD_ENTER_SCALE,
  FUNNEL_TRAVEL_PX,
  POP_START,
  GROW_MID,
  DONUT_FILL_DEFAULT,
  KPI_ENTER_Y,
  KPI_ENTER_SCALE,
  DEVICE_LAPTOP_Y,
  DEVICE_PHONE_Y,
  DEVICE_PHONE_SCALE,
  TRIM_MATCH,
  TRIM_END,
  isChartDeviceId,
  isDeviceId,
  isStaggerChartId,
  isTrimChartId,
  catalogRows,
  applyChartDevicePlan,
  seriesPoses,
  growPoses,
  popPresentPoses,
  trimKeys
};
