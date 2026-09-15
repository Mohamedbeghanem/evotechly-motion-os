"use strict";

/**
 * EvotechlyNative UI micro pack.
 * Opacity / scale / position only. Premium easing. No bounce loops.
 */

const C = require("./common");

const ELEMENTS = {
  button: { x: 0, y: 6, enterScale: 98, hoverScale: 102, hoverY: -2, clickScale: 96, expandSy: 92, group: "FAST", ease: "fast-product" },
  card: { x: 0, y: 12, enterScale: 97, hoverScale: 101.4, hoverY: -4, clickScale: 98.5, expandSy: 88, group: "STANDARD", ease: "premium-smooth" },
  modal: { x: 0, y: 14, enterScale: 96, hoverScale: 100.6, hoverY: -2, clickScale: 98, expandSy: 86, group: "STANDARD", ease: "premium-smooth" },
  tooltip: { x: 0, y: 4, enterScale: 98, hoverScale: 101, hoverY: -2, clickScale: 98, expandSy: 94, group: "MICRO", ease: "snappy" },
  dropdown: { x: 0, y: -8, enterScale: 99, hoverScale: 100.4, hoverY: -1, clickScale: 99, expandSy: 72, group: "FAST", ease: "fast-product" },
  sidebar: { x: 24, y: 0, enterScale: 100, hoverScale: 100.4, hoverY: 0, clickScale: 99, expandSy: 100, group: "STANDARD", ease: "premium-smooth" },
  nav: { x: 0, y: 4, enterScale: 100, hoverScale: 100.8, hoverY: -1, clickScale: 98.5, expandSy: 100, group: "FAST", ease: "apple-smooth" },
  tabs: { x: 0, y: 0, enterScale: 100, hoverScale: 100.6, hoverY: -1, clickScale: 98, expandSy: 100, group: "MICRO", ease: "snappy" },
  row: { x: 8, y: 0, enterScale: 100, hoverScale: 100.5, hoverY: 0, clickScale: 99, expandSy: 100, group: "FAST", ease: "apple-smooth" },
  metric: { x: 0, y: 8, enterScale: 96, hoverScale: 101.2, hoverY: -2, clickScale: 98, expandSy: 100, group: "FAST", ease: "premium-smooth" },
  badge: { x: 0, y: 0, enterScale: 90, hoverScale: 104, hoverY: -1, clickScale: 94, expandSy: 100, group: "MICRO", ease: "snappy" },
  notification: { x: 16, y: 0, enterScale: 98, hoverScale: 100.6, hoverY: 0, clickScale: 98, expandSy: 90, group: "FAST", ease: "fast-product" },
  search: { x: 0, y: 0, enterScale: 98, hoverScale: 100.4, hoverY: 0, clickScale: 99, expandSy: 100, group: "FAST", ease: "fast-product" },
  avatar: { x: 0, y: 0, enterScale: 94, hoverScale: 103, hoverY: -1, clickScale: 96, expandSy: 100, group: "MICRO", ease: "apple-smooth" }
};

const CORE_ACTIONS = {
  button: ["ENTER", "EXIT", "HOVER", "CLICK"],
  card: ["ENTER", "EXIT", "HOVER", "CLICK", "EXPAND", "COLLAPSE"],
  modal: ["ENTER", "EXIT", "EXPAND", "COLLAPSE"],
  tooltip: ["ENTER", "EXIT", "HOVER"],
  dropdown: ["ENTER", "EXIT", "EXPAND", "COLLAPSE"],
  sidebar: ["ENTER", "EXIT", "EXPAND", "COLLAPSE"],
  nav: ["ENTER", "EXIT", "HOVER"],
  tabs: ["ENTER", "CLICK"],
  row: ["ENTER", "EXIT", "HOVER"],
  metric: ["ENTER", "HOVER"],
  badge: ["ENTER", "EXIT"],
  notification: ["ENTER", "EXIT"],
  search: ["ENTER", "EXPAND", "COLLAPSE"],
  avatar: ["ENTER", "HOVER"]
};

const UI_MICRO_IDS = [];
const UI_MICRO_META = {};

Object.keys(CORE_ACTIONS).forEach(function (element) {
  CORE_ACTIONS[element].forEach(function (action) {
    const id = "EVT_UI_" + element.toUpperCase() + "_" + action;
    UI_MICRO_IDS.push(id);
    UI_MICRO_META[id] = {
      name: titleCase(element) + " " + titleCase(action),
      element: element,
      action: action.toLowerCase(),
      group: ELEMENTS[element].group,
      ease: ELEMENTS[element].ease,
      bestUse: bestUseFor(element, action.toLowerCase())
    };
  });
});

function titleCase(s) {
  return String(s)
    .split(/[-_]/)
    .map(function (part) {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

function bestUseFor(element, action) {
  const map = {
    enter: element + " present — short travel, fade + scale",
    exit: element + " dismiss — reverse of enter",
    hover: element + " hover lift — 1–4 px / 1–3% scale",
    click: element + " press — squash then recover, no bounce loop",
    expand: element + " expand — scaleY / travel, settle to rest",
    collapse: element + " collapse — reverse of expand"
  };
  return map[action] || element + " " + action;
}

function isUiMicroId(id) {
  return UI_MICRO_IDS.indexOf(C.normalizeId(id)) !== -1;
}

function catalogRows() {
  return UI_MICRO_IDS.map(function (id) {
    const meta = UI_MICRO_META[id];
    return {
      id: id,
      name: meta.name,
      category: "UI-Elements",
      folder: elementFolder(meta.element),
      group: meta.group,
      ease: meta.ease,
      bestUse: meta.bestUse,
      implemented: true,
      transitionKitPath: "core/assets/uiMicro.js",
      notes: "P1 native UI micro. " + meta.bestUse + ". Apply: Evotechly Transitions → UI."
    };
  });
}

function elementFolder(element) {
  if (element === "button") return "05_Buttons-CTAs";
  if (element === "card") return "06_Cards";
  if (element === "modal") return "07_Modals-Overlays";
  return "03_UI-Elements";
}

function posesFor(action, el, ph) {
  if (action === "enter") {
    return [
      { frame: ph.start, x: el.x, y: el.y, sx: el.enterScale, sy: 100, opacity: 0, blur: 0, phase: "start" },
      { frame: ph.mid, x: C.round4(el.x * 0.18), y: C.round4(el.y * 0.18), sx: C.round4(Math.min(100.5, el.enterScale + 3)), sy: 100, opacity: 86, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
    ];
  }
  if (action === "exit") {
    return [
      { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.mid, x: C.round4(el.x * 0.22), y: C.round4(el.y * 0.22), sx: C.round4(el.enterScale + 1), sy: 100, opacity: 38, blur: 0, phase: "mid" },
      { frame: ph.end, x: el.x, y: el.y, sx: el.enterScale, sy: 100, opacity: 0, blur: 0, phase: "done" }
    ];
  }
  if (action === "hover") {
    return [
      { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.end, x: 0, y: el.hoverY, sx: el.hoverScale, sy: el.hoverScale, opacity: 100, blur: 0, phase: "done" }
    ];
  }
  if (action === "click") {
    return [
      { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 1, sx: el.clickScale, sy: C.round4(el.clickScale + 2), opacity: 100, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
    ];
  }
  if (action === "expand") {
    const startSx = el === ELEMENTS.search ? 72 : 100;
    return [
      { frame: ph.start, x: 0, y: 0, sx: startSx, sy: el.expandSy, opacity: 0, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 0, sx: 100.4, sy: 101, opacity: 90, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
    ];
  }
  if (action === "collapse") {
    const endSx = el === ELEMENTS.search ? 72 : 100;
    return [
      { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "start" },
      { frame: ph.mid, x: 0, y: 0, sx: 100.2, sy: 98, opacity: 52, blur: 0, phase: "mid" },
      { frame: ph.end, x: 0, y: 0, sx: endSx, sy: el.expandSy, opacity: 0, blur: 0, phase: "done" }
    ];
  }
  return [
    { frame: ph.start, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "start" },
    { frame: ph.end, x: 0, y: 0, sx: 100, sy: 100, opacity: 100, blur: 0, phase: "done" }
  ];
}

function applyUiMicroPlan(opts) {
  opts = opts || {};
  const id = C.normalizeId(opts.id);
  if (!isUiMicroId(id)) {
    return C.wrapPlan("ui-micro", id, C.resolveTiming(opts, "FAST"), {
      category: "UI",
      implemented: false,
      description: id + " is not a P1 UI micro asset.",
      layers: []
    });
  }
  const meta = UI_MICRO_META[id];
  const el = ELEMENTS[meta.element];
  const timing = C.resolveTiming(opts, meta.group, opts.ease || meta.ease);
  const name = C.layerName(opts.layer, titleCase(meta.element));
  const rest = C.layerRest(opts.layer);
  const poses = posesFor(meta.action, el, timing.phases);
  const keys = C.poseKeys(timing.fps, poses);
  const layer = C.restRelativeOps(name, meta.action, keys, rest);
  return C.wrapPlan("ui-micro", id, timing, {
    category: "UI",
    name: meta.name,
    element: meta.element,
    action: meta.action,
    bestUse: meta.bestUse,
    description: "Apply " + id + " · " + timing.frames + "f @" + timing.fps + "fps · " + timing.ease,
    layers: [layer],
    outgoing: layer
  });
}

module.exports = {
  ELEMENTS,
  CORE_ACTIONS,
  UI_MICRO_IDS,
  UI_MICRO_META,
  isUiMicroId,
  catalogRows,
  posesFor,
  applyUiMicroPlan
};
