"use strict";

/**
 * Overlay-Modal family — EvoCRM dialogs, sheets, dim, popover, toast.
 * Dim plate + scale/opacity present. Sheet reuses UI-Slide sheet math.
 * Popover is target-aware (bounds helpers, not mesh).
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). No glitch / RGB / flares.
 */

const { round4 } = require("../saasDemo");
const { planBoundsMorph } = require("./target");
const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");
const scaleZoom = require("./scaleZoom");

const OVERLAY_MODAL_IDS = [
  "EVT_MODAL_IN",
  "EVT_MODAL_OUT",
  "EVT_SHEET_UP",
  "EVT_SHEET_DOWN",
  "EVT_OVERLAY_DIM",
  "EVT_POPOVER_IN",
  "EVT_TOAST_IN"
];

const ID_ALIASES = {
  EVT_DIALOG_IN: "EVT_MODAL_IN",
  EVT_DIALOG_OUT: "EVT_MODAL_OUT",
  EVT_MODAL: "EVT_MODAL_IN",
  EVT_MODAL_SHEET: "EVT_SHEET_UP",
  EVT_SHEET: "EVT_SHEET_UP",
  EVT_DIM: "EVT_OVERLAY_DIM",
  EVT_DIMMER: "EVT_OVERLAY_DIM",
  EVT_POPOVER: "EVT_POPOVER_IN",
  EVT_TOAST: "EVT_TOAST_IN"
};

const DISPLAY_NAMES = {
  EVT_MODAL_IN: "Modal In",
  EVT_MODAL_OUT: "Modal Out",
  EVT_SHEET_UP: "Sheet Up",
  EVT_SHEET_DOWN: "Sheet Down",
  EVT_OVERLAY_DIM: "Overlay Dim",
  EVT_POPOVER_IN: "Popover In",
  EVT_TOAST_IN: "Toast In"
};

const DEFAULT_POPOVER_TARGET = { l: 1280, t: 200, r: 1440, b: 248 };
const DEFAULT_POPOVER_DEST = { l: 1120, t: 260, r: 1600, b: 540 };

const DEFAULT_GROUP_BY_ID = {
  EVT_MODAL_IN: "STANDARD",
  EVT_MODAL_OUT: "FAST",
  EVT_SHEET_UP: "STANDARD",
  EVT_SHEET_DOWN: "FAST",
  EVT_OVERLAY_DIM: "FAST",
  EVT_POPOVER_IN: "FAST",
  EVT_TOAST_IN: "FAST"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_MODAL_IN: 2,
  EVT_MODAL_OUT: 2,
  EVT_SHEET_UP: 5,
  EVT_SHEET_DOWN: 3,
  EVT_OVERLAY_DIM: 0,
  EVT_POPOVER_IN: 2,
  EVT_TOAST_IN: 3
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_MODAL_IN: "left",
  EVT_MODAL_OUT: "left",
  EVT_SHEET_UP: "up",
  EVT_SHEET_DOWN: "down",
  EVT_OVERLAY_DIM: "left",
  EVT_POPOVER_IN: "left",
  EVT_TOAST_IN: "down"
};

const PHASE_PROFILE = {
  EVT_MODAL_OUT: "snap",
  EVT_SHEET_DOWN: "snap",
  EVT_OVERLAY_DIM: "snap",
  EVT_POPOVER_IN: "snap",
  EVT_TOAST_IN: "snap"
};

const MODAL_POP_START = 92;
const MODAL_DIM_OPACITY = 36;
const DIM_PLATE_OPACITY = 42;
const TOAST_TRAVEL_RATIO = 0.08;
const POPOVER_POP_START = 88;

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

function isOverlayModalId(id) {
  return OVERLAY_MODAL_IDS.indexOf(resolveId(id)) !== -1;
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

function resolvePopoverMorph(targetOpts) {
  const fromBounds = (targetOpts && (targetOpts.fromBounds || targetOpts.layerBounds)) || DEFAULT_POPOVER_TARGET;
  const toBounds = (targetOpts && (targetOpts.toBounds || targetOpts.destBounds)) || DEFAULT_POPOVER_DEST;
  return planBoundsMorph({ fromBounds: fromBounds, toBounds: toBounds });
}

function planModalIn(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const start = scaleZoom.strengthMix(100, MODAL_POP_START, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 58, blur: 2, sx: 99.2, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: MODAL_DIM_OPACITY, blur: 3, sx: 98.6, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 2, sx: start, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 84, blur: 0, sx: scaleZoom.strengthMix(start, 100, 60), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "in",
    distance: 0,
    incomingStart: start,
    dimOpacity: MODAL_DIM_OPACITY,
    overlay: true,
    dim: true,
    modal: true,
    present: true
  });
}

function planModalOut(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const end = scaleZoom.strengthMix(100, MODAL_POP_START, strength);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.4, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 40, blur: 1, sx: 96, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 2, sx: end, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: MODAL_DIM_OPACITY, blur: 3, sx: 98.6, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 78, blur: 1, sx: 99.4, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "out",
    distance: 0,
    outgoingEnd: end,
    dimOpacity: MODAL_DIM_OPACITY,
    overlay: true,
    dim: true,
    modal: true,
    dismiss: true
  });
}

function planSheetUp(opts) {
  const built = uiSlide.planSheetUp(Object.assign({}, opts, { id: "EVT_SLIDE_SHEET_UP" }));
  built.travel = Object.assign({}, built.travel, {
    overlay: true,
    modalSheet: true,
    sheet: true
  });
  return built;
}

function planSheetDown(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction === "up" ? "up" : "down";
  const axis = uiPush.AXIS[direction] || uiPush.AXIS.down;
  const distance = uiSlide.scaledDistance("EVT_SLIDE_SHEET_UP", opts.distance);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti * 0.25, y: -axis.y * anti * 0.25, opacity: 100, blur: 0, sx: 100.1, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.45, y: axis.y * distance * 0.45, opacity: 52, blur: 1, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 2, sx: 99, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: -8, opacity: 64, blur: 3, sx: 97.8, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: -4, opacity: 82, blur: 1, sx: 99, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over * 0.3, y: axis.y * over * 0.3, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    overlay: true,
    modalSheet: true,
    sheet: true,
    dismiss: true,
    cardWidth: true
  });
}

function planOverlayDim(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 88, blur: 1, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 78, blur: 2, sx: 99.4, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 22, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 40, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: DIM_PLATE_OPACITY, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: "dim",
    distance: 0,
    dimOpacity: DIM_PLATE_OPACITY,
    overlay: true,
    dim: true,
    outgoingStays: true
  });
}

function planPopoverIn(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const strength = opts.strength == null ? 100 : opts.strength;
  const morph = resolvePopoverMorph(opts.target);
  const dx = morph.valid ? morph.positionDelta[0] : 0;
  const dy = morph.valid ? morph.positionDelta[1] : 0;
  const start = scaleZoom.strengthMix(100, POPOVER_POP_START, strength);
  const over = uiPush.overshootPx(Math.max(Math.abs(dx), Math.abs(dy), 24), opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 72, blur: 1, sx: 99.4, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 58, blur: 2, sx: 99, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    {
      frame: phases.start,
      x: round4(-dx),
      y: round4(-dy),
      opacity: 0,
      blur: 2,
      sx: start,
      phase: "anticipate"
    },
    {
      frame: phases.mid,
      x: round4(-dx * 0.22),
      y: round4(-dy * 0.22),
      opacity: 82,
      blur: 0,
      sx: scaleZoom.strengthMix(start, 100, 60),
      phase: "crossover"
    },
    {
      frame: phases.settle,
      x: round4(dx === 0 ? 0 : (dx > 0 ? over : -over) * 0.12),
      y: round4(dy === 0 ? 0 : (dy > 0 ? over : -over) * 0.12),
      opacity: 100,
      blur: 0,
      sx: 100.3,
      phase: "settle"
    },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(
    opts,
    outKeys,
    inKeys,
    {
      direction: "target",
      distance: round4(Math.sqrt(dx * dx + dy * dy)),
      dx: dx,
      dy: dy,
      incomingStart: start,
      overlay: true,
      popover: true,
      targetAware: true,
      dim: true
    },
    { morph: morph }
  );
}

function planToastIn(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction === "up" || opts.direction === "left" || opts.direction === "right" ? opts.direction : "down";
  const axis = uiPush.AXIS[direction] || uiPush.AXIS.down;
  const distance = round4(opts.distance * TOAST_TRAVEL_RATIO);
  const anti = uiPush.anticipatePx(distance);
  const over = uiPush.overshootPx(distance, opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    {
      frame: phases.start,
      x: -axis.x * distance,
      y: -axis.y * distance,
      opacity: 0,
      blur: 1,
      sx: 96,
      phase: "anticipate"
    },
    {
      frame: phases.anticipate,
      x: -axis.x * distance + axis.x * anti * 0.2,
      y: -axis.y * distance + axis.y * anti * 0.2,
      opacity: 12,
      blur: 1,
      sx: 97.2,
      phase: "action"
    },
    {
      frame: phases.mid,
      x: -axis.x * distance * 0.2,
      y: -axis.y * distance * 0.2,
      opacity: 86,
      blur: 0,
      sx: 99.2,
      phase: "crossover"
    },
    {
      frame: phases.settle,
      x: axis.x * over,
      y: axis.y * over,
      opacity: 100,
      blur: 0,
      sx: 100.3,
      phase: "settle"
    },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    overlay: true,
    toast: true,
    outgoingStays: true
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_MODAL_OUT") return planModalOut(next);
  if (resolved === "EVT_SHEET_UP") return planSheetUp(next);
  if (resolved === "EVT_SHEET_DOWN") return planSheetDown(next);
  if (resolved === "EVT_OVERLAY_DIM") return planOverlayDim(next);
  if (resolved === "EVT_POPOVER_IN") return planPopoverIn(next);
  if (resolved === "EVT_TOAST_IN") return planToastIn(next);
  return planModalIn(next);
}

module.exports = {
  OVERLAY_MODAL_IDS,
  IMPLEMENTED_IDS: OVERLAY_MODAL_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_POPOVER_TARGET,
  DEFAULT_POPOVER_DEST,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  PHASE_PROFILE,
  MODAL_POP_START,
  MODAL_DIM_OPACITY,
  DIM_PLATE_OPACITY,
  TOAST_TRAVEL_RATIO,
  POPOVER_POP_START,
  displayName,
  resolveId,
  isOverlayModalId,
  resolvePopoverMorph,
  plan,
  planModalIn,
  planModalOut,
  planSheetUp,
  planSheetDown,
  planOverlayDim,
  planPopoverIn,
  planToastIn
};
