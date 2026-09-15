"use strict";

/**
 * Micro family — EvoCRM list / toolbar chrome (hover, press, toggle, check, badge, counter, focus, snap).
 * Soft, no bounce loop. Reuses P1 UI hover/click numbers only where they already match.
 * Does not duplicate EVT_UI_*_HOVER / EVT_UI_*_CLICK.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). No glitch / RGB / flares.
 */

const { round4 } = require("../saasDemo");
const uiPush = require("./uiPush");

const MICRO_IDS = [
  "EVT_MICRO_HOVER",
  "EVT_MICRO_PRESS",
  "EVT_MICRO_TOGGLE",
  "EVT_MICRO_CHECK",
  "EVT_MICRO_BADGE",
  "EVT_MICRO_COUNTER",
  "EVT_MICRO_FOCUS",
  "EVT_MICRO_SNAP"
];

const ID_ALIASES = {
  EVT_HOVER: "EVT_MICRO_HOVER",
  EVT_CHROME_HOVER: "EVT_MICRO_HOVER",
  EVT_PRESS: "EVT_MICRO_PRESS",
  EVT_CHROME_PRESS: "EVT_MICRO_PRESS",
  EVT_CLICK_MICRO: "EVT_MICRO_PRESS",
  EVT_TOGGLE: "EVT_MICRO_TOGGLE",
  EVT_TOGGLE_SETTLE: "EVT_MICRO_TOGGLE",
  EVT_CHECK: "EVT_MICRO_CHECK",
  EVT_CHECKBOX: "EVT_MICRO_CHECK",
  EVT_CHECK_SETTLE: "EVT_MICRO_CHECK",
  EVT_BADGE: "EVT_MICRO_BADGE",
  EVT_BADGE_POP: "EVT_MICRO_BADGE",
  EVT_COUNTER: "EVT_MICRO_COUNTER",
  EVT_KPI_DIGIT: "EVT_MICRO_COUNTER",
  EVT_DIGIT: "EVT_MICRO_COUNTER",
  EVT_FOCUS: "EVT_MICRO_FOCUS",
  EVT_FOCUS_RING: "EVT_MICRO_FOCUS",
  EVT_FIELD_FOCUS: "EVT_MICRO_FOCUS",
  EVT_SNAP: "EVT_MICRO_SNAP",
  EVT_GRID_SNAP: "EVT_MICRO_SNAP",
  EVT_ALIGN_SNAP: "EVT_MICRO_SNAP"
};

const DISPLAY_NAMES = {
  EVT_MICRO_HOVER: "Micro Hover",
  EVT_MICRO_PRESS: "Micro Press",
  EVT_MICRO_TOGGLE: "Micro Toggle",
  EVT_MICRO_CHECK: "Micro Check",
  EVT_MICRO_BADGE: "Micro Badge",
  EVT_MICRO_COUNTER: "Micro Counter",
  EVT_MICRO_FOCUS: "Micro Focus",
  EVT_MICRO_SNAP: "Micro Snap"
};

const DEFAULT_GROUP_BY_ID = {
  EVT_MICRO_HOVER: "MICRO",
  EVT_MICRO_PRESS: "MICRO",
  EVT_MICRO_TOGGLE: "MICRO",
  EVT_MICRO_CHECK: "MICRO",
  EVT_MICRO_BADGE: "FAST",
  EVT_MICRO_COUNTER: "FAST",
  EVT_MICRO_FOCUS: "MICRO",
  EVT_MICRO_SNAP: "MICRO"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_MICRO_HOVER: 0,
  EVT_MICRO_PRESS: 0,
  EVT_MICRO_TOGGLE: 0,
  EVT_MICRO_CHECK: 0,
  EVT_MICRO_BADGE: 0,
  EVT_MICRO_COUNTER: 0,
  EVT_MICRO_FOCUS: 0,
  EVT_MICRO_SNAP: 0
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_MICRO_HOVER: "left",
  EVT_MICRO_PRESS: "left",
  EVT_MICRO_TOGGLE: "right",
  EVT_MICRO_CHECK: "left",
  EVT_MICRO_BADGE: "left",
  EVT_MICRO_COUNTER: "up",
  EVT_MICRO_FOCUS: "left",
  EVT_MICRO_SNAP: "left"
};

const PHASE_PROFILE = {
  EVT_MICRO_HOVER: "soft",
  EVT_MICRO_PRESS: "snap",
  EVT_MICRO_TOGGLE: "snap",
  EVT_MICRO_CHECK: "snap",
  EVT_MICRO_BADGE: "snap",
  EVT_MICRO_COUNTER: "snap",
  EVT_MICRO_FOCUS: "soft",
  EVT_MICRO_SNAP: "snap"
};

/** P1 EVT_UI_BUTTON_HOVER — hoverScale / hoverY. Generic chrome, not that ID. */
const HOVER_SCALE = 102;
const HOVER_Y = -2;
const HOVER_ANTICIPATE_SCALE = 99.6;
const HOVER_ANTICIPATE_Y = 0.5;
const HOVER_MID_SCALE = 101.2;
const HOVER_MID_Y = -1;

/** P1 EVT_UI_BUTTON_CLICK — clickScale / clickScale+2 / y=1. Generic chrome, not that ID. */
const PRESS_SCALE = 96;
const PRESS_SY = 98;
const PRESS_Y = 1;
const PRESS_ANTICIPATE_SCALE = 100.4;

/** saasDemo STAGGER travel — toggle thumb settle. */
const TOGGLE_TRAVEL = 16;
const TOGGLE_MID_RATIO = 0.22;
const TOGGLE_ACTION_RATIO = 0.88;

/** Checkbox / check settle — 88→100, no bounce. */
const CHECK_START = 88;
const CHECK_MID = 97;
const CHECK_START_OPACITY = 0;
const CHECK_ACTION_OPACITY = 18;
const CHECK_MID_OPACITY = 78;

/** P1 EVT_UI_BADGE_ENTER enterScale. Pop once, then rest — no bounce loop. */
const BADGE_START = 90;
const BADGE_MID = 101.2;
const BADGE_START_OPACITY = 0;
const BADGE_ACTION_OPACITY = 18;
const BADGE_MID_OPACITY = 86;

/** P1 metric enter y — KPI digit change. */
const COUNTER_Y = 8;
const COUNTER_OUT_MID_Y = -4;
const COUNTER_OUT_MID_OPACITY = 38;
const COUNTER_IN_MID_Y = 2;
const COUNTER_IN_MID_OPACITY = 72;

/** Focus ring / field focus — 1% settle, no blur-focus family. */
const FOCUS_SCALE = 101;
const FOCUS_ANTICIPATE_SCALE = 100.2;
const FOCUS_MID_SCALE = 100.6;

/** Snap into grid / alignment. */
const SNAP_TRAVEL = 8;
const SNAP_MID_RATIO = 0.18;
const SNAP_ACTION_RATIO = 0.88;

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

function isMicroId(id) {
  return MICRO_IDS.indexOf(resolveId(id)) !== -1;
}

function stayKeys(fps, phases) {
  return uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
}

function pack(opts, outgoingKeys, incomingKeys, travel) {
  return {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest),
    travel: travel
  };
}

function planHover(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: HOVER_ANTICIPATE_Y, opacity: 100, blur: 0, sx: HOVER_ANTICIPATE_SCALE, phase: "action" },
    { frame: phases.mid, x: 0, y: HOVER_MID_Y, opacity: 100, blur: 0, sx: HOVER_MID_SCALE, phase: "crossover" },
    { frame: phases.settle, x: 0, y: HOVER_Y, opacity: 100, blur: 0, sx: HOVER_SCALE, phase: "settle" },
    { frame: phases.end, x: 0, y: HOVER_Y, opacity: 100, blur: 0, sx: HOVER_SCALE, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: "hover",
    distance: 0,
    hoverScale: HOVER_SCALE,
    hoverY: HOVER_Y,
    chrome: true,
    hover: true,
    overshoot: 0
  });
}

function planPress(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: PRESS_ANTICIPATE_SCALE, sy: PRESS_ANTICIPATE_SCALE, phase: "action" },
    { frame: phases.mid, x: 0, y: PRESS_Y, opacity: 100, blur: 0, sx: PRESS_SCALE, sy: PRESS_SY, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: "press",
    distance: 0,
    pressScale: PRESS_SCALE,
    pressSy: PRESS_SY,
    chrome: true,
    press: true,
    recover: true,
    overshoot: 0
  });
}

function planToggle(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const axis = uiPush.AXIS[opts.direction] || uiPush.AXIS.right;
  const startX = round4(-axis.x * TOGGLE_TRAVEL);
  const startY = round4(-axis.y * TOGGLE_TRAVEL);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: startX, y: startY, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    {
      frame: phases.anticipate,
      x: round4(startX * TOGGLE_ACTION_RATIO),
      y: round4(startY * TOGGLE_ACTION_RATIO),
      opacity: 100,
      blur: 0,
      sx: 100,
      phase: "action"
    },
    {
      frame: phases.mid,
      x: round4(startX * TOGGLE_MID_RATIO),
      y: round4(startY * TOGGLE_MID_RATIO),
      opacity: 100,
      blur: 0,
      sx: 100.4,
      phase: "crossover"
    },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: opts.direction,
    distance: TOGGLE_TRAVEL,
    chrome: true,
    toggle: true,
    overshoot: 0
  });
}

function planCheck(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: CHECK_START_OPACITY, blur: 0, sx: CHECK_START, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: CHECK_ACTION_OPACITY, blur: 0, sx: CHECK_START, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: CHECK_MID_OPACITY, blur: 0, sx: CHECK_MID, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: "check",
    distance: 0,
    checkStart: CHECK_START,
    chrome: true,
    check: true,
    overshoot: 0
  });
}

function planBadge(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: BADGE_START_OPACITY, blur: 0, sx: BADGE_START, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: BADGE_ACTION_OPACITY, blur: 0, sx: BADGE_START + 1.2, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: BADGE_MID_OPACITY, blur: 0, sx: BADGE_MID, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: "badge",
    distance: 0,
    badgeStart: BADGE_START,
    chrome: true,
    badge: true,
    bounceLoop: false,
    overshoot: 0
  });
}

function planCounter(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: -1, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: COUNTER_OUT_MID_Y, opacity: COUNTER_OUT_MID_OPACITY, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: -COUNTER_Y, opacity: 0, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: COUNTER_Y, opacity: 0, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: COUNTER_Y - 1, opacity: 12, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: COUNTER_IN_MID_Y, opacity: COUNTER_IN_MID_OPACITY, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "up",
    distance: COUNTER_Y,
    chrome: true,
    counter: true,
    overshoot: 0
  });
}

function planFocus(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: FOCUS_ANTICIPATE_SCALE, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: FOCUS_MID_SCALE, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: FOCUS_SCALE, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: FOCUS_SCALE, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: "focus",
    distance: 0,
    focusScale: FOCUS_SCALE,
    chrome: true,
    focus: true,
    overshoot: 0
  });
}

function planSnap(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const axis = uiPush.AXIS[opts.direction] || uiPush.AXIS.left;
  const startX = round4(-axis.x * SNAP_TRAVEL);
  const startY = round4(-axis.y * SNAP_TRAVEL);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: startX, y: startY, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    {
      frame: phases.anticipate,
      x: round4(startX * SNAP_ACTION_RATIO),
      y: round4(startY * SNAP_ACTION_RATIO),
      opacity: 100,
      blur: 0,
      sx: 100,
      phase: "action"
    },
    {
      frame: phases.mid,
      x: round4(startX * SNAP_MID_RATIO),
      y: round4(startY * SNAP_MID_RATIO),
      opacity: 100,
      blur: 0,
      sx: 100,
      phase: "crossover"
    },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, stayKeys(fps, phases), inKeys, {
    direction: opts.direction,
    distance: SNAP_TRAVEL,
    chrome: true,
    snap: true,
    overshoot: 0
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_MICRO_HOVER") return planHover(next);
  if (resolved === "EVT_MICRO_PRESS") return planPress(next);
  if (resolved === "EVT_MICRO_TOGGLE") return planToggle(next);
  if (resolved === "EVT_MICRO_CHECK") return planCheck(next);
  if (resolved === "EVT_MICRO_BADGE") return planBadge(next);
  if (resolved === "EVT_MICRO_COUNTER") return planCounter(next);
  if (resolved === "EVT_MICRO_FOCUS") return planFocus(next);
  if (resolved === "EVT_MICRO_SNAP") return planSnap(next);
  return planHover(next);
}

module.exports = {
  MICRO_IDS,
  IMPLEMENTED_IDS: MICRO_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  PHASE_PROFILE,
  HOVER_SCALE,
  HOVER_Y,
  HOVER_ANTICIPATE_SCALE,
  HOVER_ANTICIPATE_Y,
  HOVER_MID_SCALE,
  HOVER_MID_Y,
  PRESS_SCALE,
  PRESS_SY,
  PRESS_Y,
  PRESS_ANTICIPATE_SCALE,
  TOGGLE_TRAVEL,
  TOGGLE_MID_RATIO,
  TOGGLE_ACTION_RATIO,
  CHECK_START,
  CHECK_MID,
  CHECK_START_OPACITY,
  CHECK_ACTION_OPACITY,
  CHECK_MID_OPACITY,
  BADGE_START,
  BADGE_MID,
  BADGE_START_OPACITY,
  BADGE_ACTION_OPACITY,
  BADGE_MID_OPACITY,
  COUNTER_Y,
  COUNTER_OUT_MID_Y,
  COUNTER_OUT_MID_OPACITY,
  COUNTER_IN_MID_Y,
  COUNTER_IN_MID_OPACITY,
  FOCUS_SCALE,
  FOCUS_ANTICIPATE_SCALE,
  FOCUS_MID_SCALE,
  SNAP_TRAVEL,
  SNAP_MID_RATIO,
  SNAP_ACTION_RATIO,
  displayName,
  resolveId,
  isMicroId,
  plan
};
