"use strict";

/**
 * Mask-Reveal family — EvoCRM screenshot / card iris (native AE masks, no plugins).
 * Soft expand, no bounce, no glitch. Circle / rounded-rect / feathered matte / wipe-from-bounds.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). No glitch / RGB / flares.
 */

const { round4, clamp } = require("../saasDemo");
const { secondsFromFrames } = require("./timing");
const uiPush = require("./uiPush");

const MASK_REVEAL_IDS = [
  "EVT_MASK_CIRCLE",
  "EVT_MASK_RECT",
  "EVT_MASK_SOFT_EDGE",
  "EVT_MASK_EXPAND",
  "EVT_REVEAL_IRIS",
  "EVT_REVEAL_WIPE_SOFT"
];

const ID_ALIASES = {
  EVT_MASK: "EVT_MASK_CIRCLE",
  EVT_CIRCLE: "EVT_MASK_CIRCLE",
  EVT_CIRCLE_REVEAL: "EVT_MASK_CIRCLE",
  EVT_CARD_MASK: "EVT_MASK_CIRCLE",
  EVT_RECT: "EVT_MASK_RECT",
  EVT_CARD_REVEAL: "EVT_MASK_RECT",
  EVT_MASK_CROP: "EVT_MASK_RECT",
  EVT_SOFT_EDGE: "EVT_MASK_SOFT_EDGE",
  EVT_MASK_FEATHER: "EVT_MASK_SOFT_EDGE",
  EVT_EXPAND: "EVT_MASK_EXPAND",
  EVT_MASK_CENTER: "EVT_MASK_EXPAND",
  EVT_IRIS: "EVT_REVEAL_IRIS",
  EVT_MASK_IRIS: "EVT_REVEAL_IRIS",
  EVT_SCREENSHOT: "EVT_REVEAL_IRIS",
  EVT_SCREENSHOT_MASK: "EVT_REVEAL_IRIS",
  EVT_WIPE_SOFT: "EVT_REVEAL_WIPE_SOFT",
  EVT_MASK_WIPE: "EVT_REVEAL_WIPE_SOFT",
  EVT_WIPE_FROM_BOUNDS: "EVT_REVEAL_WIPE_SOFT"
};

const DISPLAY_NAMES = {
  EVT_MASK_CIRCLE: "Mask Circle",
  EVT_MASK_RECT: "Mask Rect",
  EVT_MASK_SOFT_EDGE: "Mask Soft Edge",
  EVT_MASK_EXPAND: "Mask Expand",
  EVT_REVEAL_IRIS: "Reveal Iris",
  EVT_REVEAL_WIPE_SOFT: "Reveal Wipe Soft"
};

const DEFAULT_GROUP_BY_ID = {
  EVT_MASK_CIRCLE: "STANDARD",
  EVT_MASK_RECT: "STANDARD",
  EVT_MASK_SOFT_EDGE: "SMOOTH",
  EVT_MASK_EXPAND: "STANDARD",
  EVT_REVEAL_IRIS: "SMOOTH",
  EVT_REVEAL_WIPE_SOFT: "STANDARD"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_MASK_CIRCLE: 0,
  EVT_MASK_RECT: 0,
  EVT_MASK_SOFT_EDGE: 0,
  EVT_MASK_EXPAND: 0,
  EVT_REVEAL_IRIS: 0,
  EVT_REVEAL_WIPE_SOFT: 0
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_MASK_CIRCLE: "left",
  EVT_MASK_RECT: "left",
  EVT_MASK_SOFT_EDGE: "left",
  EVT_MASK_EXPAND: "left",
  EVT_REVEAL_IRIS: "left",
  EVT_REVEAL_WIPE_SOFT: "left"
};

const PHASE_PROFILE = {
  EVT_MASK_SOFT_EDGE: "soft",
  EVT_REVEAL_IRIS: "soft"
};

/** Default SaaS card used when CIRCLE / RECT have no target bounds. */
const CARD_W = 360;
const CARD_H = 240;
/** Default screenshot plate used when IRIS has no target bounds. */
const SHOT_W = 960;
const SHOT_H = 540;
/** Matches the control-null CornerRadius default. */
const CORNER_RADIUS = 12;
const SOFT_CORNER_RADIUS = 16;

const CIRCLE_FEATHER = 10;
const RECT_FEATHER = 6;
const SOFT_FEATHER = 28;
const EXPAND_FEATHER = 8;
const IRIS_FEATHER = 14;
const WIPE_FEATHER = 18;

const CIRCLE_START = -160;
const CIRCLE_MID = -48;
const RECT_START = -140;
const RECT_MID = -36;
const SOFT_START = -120;
const SOFT_MID = -32;
const EXPAND_START = -180;
const EXPAND_MID = -50;
const IRIS_START = -280;
const IRIS_MID = -90;
const WIPE_START = -200;
const WIPE_MID = -56;
const EXPAND_END = 0;

const CIRCLE_OUT_MID = 64;
const RECT_OUT_MID = 58;
const SOFT_OUT_MID = 78;
const EXPAND_OUT_MID = 52;
const IRIS_OUT_MID = 88;
const WIPE_OUT_MID = 70;

/** Directional bias so wipe opens from bounds, not a center iris. */
const WIPE_SHIFT = 80;

const SPEC_BY_ID = {
  EVT_MASK_CIRCLE: {
    type: "ellipse",
    feather: CIRCLE_FEATHER,
    start: CIRCLE_START,
    mid: CIRCLE_MID,
    end: EXPAND_END,
    cornerRadius: 0,
    outMid: CIRCLE_OUT_MID,
    defaultW: CARD_W,
    defaultH: CARD_H,
    targetAware: true,
    card: true
  },
  EVT_MASK_RECT: {
    type: "roundedRect",
    feather: RECT_FEATHER,
    start: RECT_START,
    mid: RECT_MID,
    end: EXPAND_END,
    cornerRadius: CORNER_RADIUS,
    outMid: RECT_OUT_MID,
    defaultW: CARD_W,
    defaultH: CARD_H,
    targetAware: false,
    crop: true
  },
  EVT_MASK_SOFT_EDGE: {
    type: "roundedRect",
    feather: SOFT_FEATHER,
    start: SOFT_START,
    mid: SOFT_MID,
    end: EXPAND_END,
    cornerRadius: SOFT_CORNER_RADIUS,
    outMid: SOFT_OUT_MID,
    defaultW: CARD_W,
    defaultH: CARD_H,
    targetAware: false,
    soft: true
  },
  EVT_MASK_EXPAND: {
    type: "ellipse",
    feather: EXPAND_FEATHER,
    start: EXPAND_START,
    mid: EXPAND_MID,
    end: EXPAND_END,
    cornerRadius: 0,
    outMid: EXPAND_OUT_MID,
    defaultW: CARD_W,
    defaultH: CARD_H,
    targetAware: false,
    fromCenter: true
  },
  EVT_REVEAL_IRIS: {
    type: "ellipse",
    feather: IRIS_FEATHER,
    start: IRIS_START,
    mid: IRIS_MID,
    end: EXPAND_END,
    cornerRadius: 0,
    outMid: IRIS_OUT_MID,
    defaultW: SHOT_W,
    defaultH: SHOT_H,
    targetAware: true,
    screenshot: true,
    quiet: true
  },
  EVT_REVEAL_WIPE_SOFT: {
    type: "roundedRect",
    feather: WIPE_FEATHER,
    start: WIPE_START,
    mid: WIPE_MID,
    end: EXPAND_END,
    cornerRadius: CORNER_RADIUS,
    outMid: WIPE_OUT_MID,
    defaultW: CARD_W,
    defaultH: CARD_H,
    targetAware: false,
    wipe: true,
    shift: WIPE_SHIFT
  }
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

function isMaskRevealId(id) {
  return MASK_REVEAL_IDS.indexOf(resolveId(id)) !== -1;
}

function specForId(id) {
  return SPEC_BY_ID[resolveId(id)] || SPEC_BY_ID.EVT_MASK_CIRCLE;
}

function boundsSize(bounds, fallbackW, fallbackH) {
  if (!bounds) return { w: fallbackW, h: fallbackH };
  const w = Number(bounds.w != null ? bounds.w : bounds.width);
  const h = Number(bounds.h != null ? bounds.h : bounds.height);
  return {
    w: w === w && w > 0 ? w : fallbackW,
    h: h === h && h > 0 ? h : fallbackH
  };
}

function expansionScale(opts, spec) {
  if (!spec.targetAware) return 1;
  const size = boundsSize(opts.target && opts.target.layerBounds, spec.defaultW, spec.defaultH);
  const cover = Math.max(size.w, size.h);
  const base = Math.max(spec.defaultW, spec.defaultH);
  return round4(clamp(cover / base, 0.6, 2.4));
}

function expansionKeys(fps, phases, start, mid, end) {
  return [
    { t: secondsFromFrames(phases.start, fps), frame: phases.start, value: start, phase: "anticipate" },
    { t: secondsFromFrames(phases.anticipate, fps), frame: phases.anticipate, value: start, phase: "action" },
    { t: secondsFromFrames(phases.mid, fps), frame: phases.mid, value: mid, phase: "crossover" },
    { t: secondsFromFrames(phases.end, fps), frame: phases.end, value: end, phase: "done" }
  ];
}

function shiftKeys(fps, phases, direction, distance) {
  const axis = uiPush.AXIS[direction] || uiPush.AXIS.left;
  const startX = round4(axis.x * distance);
  const startY = round4(axis.y * distance);
  return [
    { t: secondsFromFrames(phases.start, fps), frame: phases.start, x: startX, y: startY, phase: "anticipate" },
    { t: secondsFromFrames(phases.anticipate, fps), frame: phases.anticipate, x: startX, y: startY, phase: "action" },
    {
      t: secondsFromFrames(phases.mid, fps),
      frame: phases.mid,
      x: round4(startX * 0.28),
      y: round4(startY * 0.28),
      phase: "crossover"
    },
    { t: secondsFromFrames(phases.end, fps), frame: phases.end, x: 0, y: 0, phase: "done" }
  ];
}

function buildMask(opts, spec) {
  const scale = expansionScale(opts, spec);
  const start = round4(spec.start * scale);
  const mid = round4(spec.mid * scale);
  const end = spec.end;
  const mask = {
    type: spec.type,
    feather: spec.feather,
    cornerRadius: spec.cornerRadius,
    native: true,
    plugin: false,
    expansionScale: scale,
    expansionStart: start,
    expansionMid: mid,
    expansionEnd: end,
    expansion: expansionKeys(opts.fps, opts.phases, start, mid, end),
    note: "Native AE mask expansion (ADBE Mask Offset). Soft edge, no vendor wipe."
  };
  if (spec.wipe) {
    mask.shift = shiftKeys(opts.fps, opts.phases, opts.direction, spec.shift);
    mask.shiftPx = spec.shift;
  }
  return mask;
}

function pack(opts, outgoingKeys, incomingKeys, travel, mask) {
  const outgoing = uiPush.restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest);
  const incoming = uiPush.restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest);
  incoming.mask = mask;
  incoming.set.maskExpansion = mask.expansion;
  incoming.set.maskFeather = mask.feather;
  if (mask.shift) incoming.set.maskShift = mask.shift;
  return {
    outgoing: outgoing,
    incoming: incoming,
    travel: travel,
    mask: mask
  };
}

function planMasked(opts, spec) {
  const fps = opts.fps;
  const phases = opts.phases;
  const mask = buildMask(opts, spec);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: spec.outMid, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: spec.wipe ? opts.direction : "center",
    distance: 0,
    mask: true,
    native: true,
    type: spec.type,
    feather: spec.feather,
    expansionStart: mask.expansionStart,
    expansionMid: mask.expansionMid,
    card: !!spec.card,
    crop: !!spec.crop,
    soft: !!spec.soft,
    fromCenter: !!spec.fromCenter,
    screenshot: !!spec.screenshot,
    quiet: !!spec.quiet,
    wipe: !!spec.wipe,
    opacityOnly: false,
    overshoot: 0
  }, mask);
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  return planMasked(next, specForId(resolved));
}

module.exports = {
  MASK_REVEAL_IDS,
  IMPLEMENTED_IDS: MASK_REVEAL_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  PHASE_PROFILE,
  SPEC_BY_ID,
  CARD_W,
  CARD_H,
  SHOT_W,
  SHOT_H,
  CORNER_RADIUS,
  SOFT_CORNER_RADIUS,
  CIRCLE_FEATHER,
  RECT_FEATHER,
  SOFT_FEATHER,
  EXPAND_FEATHER,
  IRIS_FEATHER,
  WIPE_FEATHER,
  CIRCLE_START,
  CIRCLE_MID,
  RECT_START,
  RECT_MID,
  SOFT_START,
  SOFT_MID,
  EXPAND_START,
  EXPAND_MID,
  IRIS_START,
  IRIS_MID,
  WIPE_START,
  WIPE_MID,
  EXPAND_END,
  CIRCLE_OUT_MID,
  RECT_OUT_MID,
  SOFT_OUT_MID,
  EXPAND_OUT_MID,
  IRIS_OUT_MID,
  WIPE_OUT_MID,
  WIPE_SHIFT,
  displayName,
  resolveId,
  isMaskRevealId,
  specForId,
  expansionScale,
  plan
};
