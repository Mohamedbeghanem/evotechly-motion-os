"use strict";

/**
 * Scale-Zoom family — plate zoom, target frame, and quiet scale presents.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). Opacity + transform. No glitch / mesh / RGB.
 */

const { round4, clamp } = require("../saasDemo");
const { planTargetZoom, DEFAULT_PADDING } = require("./target");
const uiPush = require("./uiPush");

const SCALE_ZOOM_IDS = [
  "EVT_ZOOM_IN",
  "EVT_ZOOM_OUT",
  "EVT_ZOOM_TARGET",
  "EVT_ZOOM_MATCH",
  "EVT_SCALE_POP",
  "EVT_SCALE_BREATHE",
  "EVT_SCALE_PUNCH",
  "EVT_SCALE_SETTLE"
];

const ID_ALIASES = {
  EVT_ZOOM: "EVT_ZOOM_IN",
  EVT_SCALE: "EVT_SCALE_POP"
};

const DISPLAY_NAMES = {
  EVT_ZOOM_IN: "Zoom In",
  EVT_ZOOM_OUT: "Zoom Out",
  EVT_ZOOM_TARGET: "Zoom Target",
  EVT_ZOOM_MATCH: "Zoom Match",
  EVT_SCALE_POP: "Scale Pop",
  EVT_SCALE_BREATHE: "Scale Breathe",
  EVT_SCALE_PUNCH: "Scale Punch",
  EVT_SCALE_SETTLE: "Scale Settle"
};

const DEFAULT_TARGET_BOUNDS = { l: 760, t: 340, r: 1160, b: 740 };

const DEFAULT_GROUP_BY_ID = {
  EVT_ZOOM_IN: "STANDARD",
  EVT_ZOOM_OUT: "STANDARD",
  EVT_ZOOM_TARGET: "SMOOTH",
  EVT_ZOOM_MATCH: "STANDARD",
  EVT_SCALE_POP: "FAST",
  EVT_SCALE_BREATHE: "SMOOTH",
  EVT_SCALE_PUNCH: "FAST",
  EVT_SCALE_SETTLE: "STANDARD"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_ZOOM_IN: 4,
  EVT_ZOOM_OUT: 4,
  EVT_ZOOM_TARGET: 3,
  EVT_ZOOM_MATCH: 3,
  EVT_SCALE_POP: 2,
  EVT_SCALE_BREATHE: 2,
  EVT_SCALE_PUNCH: 2,
  EVT_SCALE_SETTLE: 3
};

const PHASE_PROFILE = {
  EVT_SCALE_POP: "snap",
  EVT_SCALE_PUNCH: "snap",
  EVT_SCALE_BREATHE: "soft"
};

const ZOOM_IN_IN = 88;
const ZOOM_IN_OUT = 108;
const ZOOM_OUT_IN = 112;
const ZOOM_OUT_OUT = 92;
const POP_START = 90;
const BREATHE_PEAK = 102;
const PUNCH_PEAK = 106;
const SETTLE_START = 108;
const PUNCH_TARGET_MIX = 0.18;

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

function isScaleZoomId(id) {
  return SCALE_ZOOM_IDS.indexOf(resolveId(id)) !== -1;
}

function strengthMix(from, to, strengthPct) {
  const t = clamp(strengthPct == null ? 100 : strengthPct, 0, 200) / 100;
  return round4(from + (to - from) * t);
}

function resolveTargetZoom(opts, comp) {
  const bounds = (opts && opts.target && opts.target.layerBounds) || DEFAULT_TARGET_BOUNDS;
  const padding =
    opts && opts.target && opts.target.padding != null ? opts.target.padding : DEFAULT_PADDING;
  return planTargetZoom({
    compW: comp.w,
    compH: comp.h,
    layerBounds: bounds,
    padding: padding
  });
}

function pack(opts, outgoingKeys, incomingKeys, travel, extra) {
  const row = {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest),
    travel: travel
  };
  if (extra) {
    Object.keys(extra).forEach(function (k) {
      row[k] = extra[k];
    });
  }
  return row;
}

function planZoomIn(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const inStart = strengthMix(100, ZOOM_IN_IN, strength);
  const outEnd = strengthMix(100, ZOOM_IN_OUT, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.6, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 42, blur: 2, sx: strengthMix(100, 104, strength), phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 4, sx: outEnd, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 4, sx: inStart, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 72, blur: 1, sx: strengthMix(inStart, 100, 50), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "in",
    distance: 0,
    incomingStart: inStart,
    outgoingEnd: outEnd,
    zoom: true
  });
}

function planZoomOut(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const inStart = strengthMix(100, ZOOM_OUT_IN, strength);
  const outEnd = strengthMix(100, ZOOM_OUT_OUT, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.6, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 48, blur: 2, sx: strengthMix(100, 96, strength), phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 4, sx: outEnd, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 4, sx: inStart, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 74, blur: 1, sx: strengthMix(inStart, 100, 50), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "out",
    distance: 0,
    incomingStart: inStart,
    outgoingEnd: outEnd,
    zoom: true
  });
}

function planZoomTarget(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const target = resolveTargetZoom(opts, opts.comp);
  const endSx = target.valid ? target.scale[0] : 100;
  const endX = target.valid ? target.positionDelta[0] : 0;
  const endY = target.valid ? target.positionDelta[1] : 0;
  const midSx = round4(100 + (endSx - 100) * 0.5);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 101.2, phase: "action" },
    { frame: phases.mid, x: round4(endX * 0.5), y: round4(endY * 0.5), opacity: 88, blur: 1, sx: midSx, phase: "crossover" },
    { frame: phases.end, x: endX, y: endY, opacity: 72, blur: 2, sx: endSx, sy: endSx, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 3, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 58, blur: 1, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(
    opts,
    outKeys,
    inKeys,
    {
      direction: "target",
      distance: 0,
      zoom: true,
      targetZoom: true,
      outgoingStays: true
    },
    { target: target }
  );
}

function planZoomMatch(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const target = resolveTargetZoom(opts, opts.comp);
  const endSx = target.valid ? target.scale[0] : 100;
  const endX = target.valid ? target.positionDelta[0] : 0;
  const endY = target.valid ? target.positionDelta[1] : 0;
  const midSx = round4(100 + (endSx - 100) * 0.5);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.8, phase: "action" },
    { frame: phases.mid, x: round4(endX * 0.5), y: round4(endY * 0.5), opacity: 46, blur: 2, sx: midSx, phase: "crossover" },
    { frame: phases.end, x: endX, y: endY, opacity: 0, blur: 3, sx: endSx, sy: endSx, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 3, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 62, blur: 1, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(
    opts,
    outKeys,
    inKeys,
    {
      direction: "match",
      distance: 0,
      zoom: true,
      match: true
    },
    { target: target }
  );
}

function planScalePop(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const start = strengthMix(100, POP_START, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.6, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 40, blur: 1, sx: 98.8, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 2, sx: 98, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 2, sx: start, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 84, blur: 0, sx: strengthMix(start, 100, 60), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "pop",
    distance: 0,
    incomingStart: start,
    pop: true
  });
}

function planScaleBreathe(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const peak = strengthMix(100, BREATHE_PEAK, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: peak, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: strengthMix(100, peak, 40), phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "breathe",
    distance: 0,
    peak: peak,
    outgoingStays: true,
    breathe: true
  });
}

function planScalePunch(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const hasTarget = !!(opts.target && opts.target.layerBounds);
  const target = resolveTargetZoom(opts, opts.comp);
  const peak = strengthMix(100, PUNCH_PEAK, strength);
  let punchSx = peak;
  let punchX = 0;
  let punchY = 0;
  if (hasTarget && target.valid) {
    punchSx = round4(100 + (target.scale[0] - 100) * PUNCH_TARGET_MIX * (clamp(strength, 0, 200) / 100));
    punchX = round4(target.positionDelta[0] * PUNCH_TARGET_MIX);
    punchY = round4(target.positionDelta[1] * PUNCH_TARGET_MIX);
  }
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 86, blur: 1, sx: 99.4, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: punchX, y: punchY, opacity: 100, blur: 0, sx: punchSx, phase: "crossover" },
    { frame: phases.settle, x: round4(punchX * 0.2), y: round4(punchY * 0.2), opacity: 100, blur: 0, sx: 100.6, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(
    opts,
    outKeys,
    inKeys,
    {
      direction: "punch",
      distance: 0,
      peak: punchSx,
      punch: true,
      outgoingStays: true
    },
    { target: target }
  );
}

function planScaleSettle(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const start = strengthMix(100, SETTLE_START, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.4, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 44, blur: 2, sx: 97.5, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 3, sx: 96, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 3, sx: start, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 78, blur: 1, sx: strengthMix(start, 100, 62), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.6, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "settle",
    distance: 0,
    incomingStart: start,
    settle: true
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_ZOOM_OUT") return planZoomOut(next);
  if (resolved === "EVT_ZOOM_TARGET") return planZoomTarget(next);
  if (resolved === "EVT_ZOOM_MATCH") return planZoomMatch(next);
  if (resolved === "EVT_SCALE_POP") return planScalePop(next);
  if (resolved === "EVT_SCALE_BREATHE") return planScaleBreathe(next);
  if (resolved === "EVT_SCALE_PUNCH") return planScalePunch(next);
  if (resolved === "EVT_SCALE_SETTLE") return planScaleSettle(next);
  return planZoomIn(next);
}

module.exports = {
  SCALE_ZOOM_IDS,
  IMPLEMENTED_IDS: SCALE_ZOOM_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_TARGET_BOUNDS,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  PHASE_PROFILE,
  ZOOM_IN_IN,
  ZOOM_IN_OUT,
  ZOOM_OUT_IN,
  ZOOM_OUT_OUT,
  POP_START,
  BREATHE_PEAK,
  PUNCH_PEAK,
  SETTLE_START,
  PUNCH_TARGET_MIX,
  displayName,
  resolveId,
  isScaleZoomId,
  strengthMix,
  resolveTargetZoom,
  plan,
  planZoomIn,
  planZoomOut,
  planZoomTarget,
  planZoomMatch,
  planScalePop,
  planScaleBreathe,
  planScalePunch,
  planScaleSettle
};
