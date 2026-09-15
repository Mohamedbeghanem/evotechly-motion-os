"use strict";

/**
 * UI Slide family — card / panel / drawer / sheet plans.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear / Stripe). Card-width travel, not full-frame.
 * EvoCRM: dashboard → card → detail. No glitch / RGB / flares.
 */

const { round4 } = require("../saasDemo");
const uiPush = require("./uiPush");

const UI_SLIDE_IDS = [
  "EVT_SLIDE_CARD_LEFT",
  "EVT_SLIDE_CARD_RIGHT",
  "EVT_SLIDE_PANEL_IN",
  "EVT_SLIDE_PANEL_OUT",
  "EVT_SLIDE_DRAWER",
  "EVT_SLIDE_SHEET_UP",
  "EVT_SLIDE_STACK",
  "EVT_SLIDE_PEEK"
];

const ID_ALIASES = {
  EVT_CARD_SLIDE_LEFT: "EVT_SLIDE_CARD_LEFT",
  EVT_CARD_SLIDE_RIGHT: "EVT_SLIDE_CARD_RIGHT",
  EVT_SLIDE_CARD: "EVT_SLIDE_CARD_LEFT"
};

const DISPLAY_NAMES = {
  EVT_SLIDE_CARD_LEFT: "Slide Card Left",
  EVT_SLIDE_CARD_RIGHT: "Slide Card Right",
  EVT_SLIDE_PANEL_IN: "Slide Panel In",
  EVT_SLIDE_PANEL_OUT: "Slide Panel Out",
  EVT_SLIDE_DRAWER: "Slide Drawer",
  EVT_SLIDE_SHEET_UP: "Slide Sheet Up",
  EVT_SLIDE_STACK: "Slide Stack",
  EVT_SLIDE_PEEK: "Slide Peek"
};

const CARD_WIDTH_RATIO = 0.28;
const PANEL_WIDTH_RATIO = 0.32;
const DRAWER_WIDTH_RATIO = 0.22;
const SHEET_HEIGHT_RATIO = 0.42;
const STACK_WIDTH_RATIO = 0.24;
const PEEK_HOLD_RATIO = 0.36;

const AXIS = uiPush.AXIS;

const DEFAULT_GROUP_BY_ID = {
  EVT_SLIDE_CARD_LEFT: "FAST",
  EVT_SLIDE_CARD_RIGHT: "FAST",
  EVT_SLIDE_PANEL_IN: "STANDARD",
  EVT_SLIDE_PANEL_OUT: "FAST",
  EVT_SLIDE_DRAWER: "STANDARD",
  EVT_SLIDE_SHEET_UP: "STANDARD",
  EVT_SLIDE_STACK: "SMOOTH",
  EVT_SLIDE_PEEK: "MICRO"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_SLIDE_CARD_LEFT: 4,
  EVT_SLIDE_CARD_RIGHT: 4,
  EVT_SLIDE_PANEL_IN: 4,
  EVT_SLIDE_PANEL_OUT: 3,
  EVT_SLIDE_DRAWER: 4,
  EVT_SLIDE_SHEET_UP: 5,
  EVT_SLIDE_STACK: 6,
  EVT_SLIDE_PEEK: 2
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_SLIDE_CARD_LEFT: "left",
  EVT_SLIDE_CARD_RIGHT: "right",
  EVT_SLIDE_PANEL_IN: "right",
  EVT_SLIDE_PANEL_OUT: "right",
  EVT_SLIDE_DRAWER: "left",
  EVT_SLIDE_SHEET_UP: "up",
  EVT_SLIDE_STACK: "left",
  EVT_SLIDE_PEEK: "left"
};

const TRAVEL_SCALE = {
  EVT_SLIDE_CARD_LEFT: CARD_WIDTH_RATIO,
  EVT_SLIDE_CARD_RIGHT: CARD_WIDTH_RATIO,
  EVT_SLIDE_PANEL_IN: PANEL_WIDTH_RATIO,
  EVT_SLIDE_PANEL_OUT: PANEL_WIDTH_RATIO,
  EVT_SLIDE_DRAWER: DRAWER_WIDTH_RATIO,
  EVT_SLIDE_SHEET_UP: SHEET_HEIGHT_RATIO,
  EVT_SLIDE_STACK: STACK_WIDTH_RATIO,
  EVT_SLIDE_PEEK: CARD_WIDTH_RATIO
};

function displayName(id) {
  return DISPLAY_NAMES[id] || id;
}

function resolveId(id) {
  const raw = String(id || "")
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_");
  return ID_ALIASES[raw] || raw;
}

function isUiSlideId(id) {
  return UI_SLIDE_IDS.indexOf(resolveId(id)) !== -1;
}

function scaledDistance(id, distance) {
  const scale = TRAVEL_SCALE[id] == null ? CARD_WIDTH_RATIO : TRAVEL_SCALE[id];
  return round4(distance * scale);
}

function planCardSlide(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = scaledDistance(opts.id, opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 100.2, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.5, y: axis.y * distance * 0.5, opacity: 48, blur: 1, sx: 99.4, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 3, sx: 98.6, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 3, sx: 101.2, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.18, y: -axis.y * distance * 0.18, opacity: 82, blur: 1, sx: 100.4, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, cardWidth: true });
}

function pack(opts, outgoingKeys, incomingKeys, travel) {
  return {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest),
    travel: travel
  };
}

function planPanelIn(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const from = AXIS[direction] || AXIS.right;
  const distance = scaledDistance("EVT_SLIDE_PANEL_IN", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: from.x * anti * 0.35, y: from.y * anti * 0.35, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: -from.x * distance * 0.12, y: -from.y * distance * 0.12, opacity: 78, blur: 1, sx: 98.8, phase: "crossover" },
    { frame: phases.end, x: -from.x * distance * 0.18, y: -from.y * distance * 0.18, opacity: 68, blur: 2, sx: 98.4, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: from.x * distance, y: from.y * distance, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: from.x * distance * 0.16, y: from.y * distance * 0.16, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: -from.x * over, y: -from.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    edge: direction,
    outgoingStays: true,
    cardWidth: true
  });
}

function planPanelOut(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const from = AXIS[direction] || AXIS.right;
  const distance = scaledDistance("EVT_SLIDE_PANEL_OUT", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -from.x * anti * 0.4, y: -from.y * anti * 0.4, opacity: 100, blur: 0, sx: 100.1, phase: "action" },
    { frame: phases.mid, x: from.x * distance * 0.45, y: from.y * distance * 0.45, opacity: 52, blur: 1, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: from.x * distance, y: from.y * distance, opacity: 0, blur: 2, sx: 99, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: -from.x * distance * 0.18, y: -from.y * distance * 0.18, opacity: 68, blur: 2, sx: 98.4, phase: "anticipate" },
    { frame: phases.mid, x: -from.x * distance * 0.06, y: -from.y * distance * 0.06, opacity: 88, blur: 0, sx: 99.6, phase: "crossover" },
    { frame: phases.settle, x: from.x * over * 0.4, y: from.y * over * 0.4, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    edge: direction,
    dismiss: true,
    cardWidth: true
  });
}

function planDrawer(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const from = AXIS[direction] || AXIS.left;
  const distance = scaledDistance("EVT_SLIDE_DRAWER", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: from.x * anti * 0.3, y: from.y * anti * 0.3, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: -from.x * distance * 0.1, y: -from.y * distance * 0.1, opacity: 80, blur: 1, sx: 99.2, phase: "crossover" },
    { frame: phases.end, x: -from.x * distance * 0.14, y: -from.y * distance * 0.14, opacity: 72, blur: 2, sx: 98.8, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: from.x * distance, y: from.y * distance, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: from.x * distance * 0.14, y: from.y * distance * 0.14, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: -from.x * over, y: -from.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    edge: direction,
    outgoingStays: true,
    drawer: true,
    cardWidth: true
  });
}

function planSheetUp(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.up;
  const distance = scaledDistance("EVT_SLIDE_SHEET_UP", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: anti * 0.25, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: 0, y: -4, opacity: 76, blur: 2, sx: 98.6, phase: "crossover" },
    { frame: phases.end, x: 0, y: -8, opacity: 64, blur: 3, sx: 97.8, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.16, y: -axis.y * distance * 0.16, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    outgoingStays: true,
    sheet: true,
    cardWidth: true
  });
}

function planStack(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = scaledDistance("EVT_SLIDE_STACK", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti * 0.6, y: -axis.y * anti * 0.6 + 2, opacity: 100, blur: 0, sx: 99.2, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.22, y: axis.y * distance * 0.22 + 6, opacity: 78, blur: 2, sx: 96, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance * 0.28, y: axis.y * distance * 0.28 + 10, opacity: 58, blur: 3, sx: 92, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 3, sx: 96, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.2, y: -axis.y * distance * 0.2, opacity: 86, blur: 1, sx: 99, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.6, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    stack: true,
    peekCommit: true,
    cardWidth: true
  });
}

function planPeek(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = scaledDistance("EVT_SLIDE_PEEK", opts.distance);
  const hold = round4(distance * PEEK_HOLD_RATIO);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(hold, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti * 0.4, y: -axis.y * anti * 0.4, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.05, y: axis.y * distance * 0.05, opacity: 96, blur: 0, sx: 99.7, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance * 0.08, y: axis.y * distance * 0.08, opacity: 92, blur: 1, sx: 99.6, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 2, sx: 100.4, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.55, y: -axis.y * distance * 0.55, opacity: 78, blur: 1, sx: 100.2, phase: "crossover" },
    { frame: phases.settle, x: -axis.x * hold - axis.x * over * 0.3, y: -axis.y * hold - axis.y * over * 0.3, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: -axis.x * hold, y: -axis.y * hold, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    hold: hold,
    holdRatio: PEEK_HOLD_RATIO,
    anticipate: anti,
    overshoot: over,
    peek: true,
    cardWidth: true
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_SLIDE_PANEL_IN") return planPanelIn(next);
  if (resolved === "EVT_SLIDE_PANEL_OUT") return planPanelOut(next);
  if (resolved === "EVT_SLIDE_DRAWER") return planDrawer(next);
  if (resolved === "EVT_SLIDE_SHEET_UP") return planSheetUp(next);
  if (resolved === "EVT_SLIDE_STACK") return planStack(next);
  if (resolved === "EVT_SLIDE_PEEK") return planPeek(next);
  return planCardSlide(next);
}

module.exports = {
  UI_SLIDE_IDS,
  IMPLEMENTED_IDS: UI_SLIDE_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  CARD_WIDTH_RATIO,
  PANEL_WIDTH_RATIO,
  DRAWER_WIDTH_RATIO,
  SHEET_HEIGHT_RATIO,
  STACK_WIDTH_RATIO,
  PEEK_HOLD_RATIO,
  AXIS,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  TRAVEL_SCALE,
  displayName,
  resolveId,
  isUiSlideId,
  scaledDistance,
  plan,
  planCardSlide,
  planPanelIn,
  planPanelOut,
  planDrawer,
  planSheetUp,
  planStack,
  planPeek
};
