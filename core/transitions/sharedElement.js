"use strict";

/**
 * Shared-Element — bounds-match card → detail.
 * Position + scale morph only. No mesh warp / Liquify / reshape.
 * Premium SaaS (Apple / Linear). EvoCRM: dashboard card opens into detail.
 */

const { round4 } = require("../saasDemo");
const { planBoundsMorph } = require("./target");
const uiPush = require("./uiPush");

const SHARED_ELEMENT_IDS = ["EVT_SHARED_CARD"];

const ID_ALIASES = {
  EVT_SHARED_ELEMENT: "EVT_SHARED_CARD",
  EVT_CARD_TO_DETAIL: "EVT_SHARED_CARD",
  EVT_SHARED: "EVT_SHARED_CARD"
};

const DISPLAY_NAMES = {
  EVT_SHARED_CARD: "Shared Card"
};

const DEFAULT_CARD_BOUNDS = { l: 240, t: 300, r: 720, b: 660 };
const DEFAULT_DETAIL_BOUNDS = { l: 280, t: 80, r: 1640, b: 1000 };

const DEFAULT_GROUP_BY_ID = {
  EVT_SHARED_CARD: "SMOOTH"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_SHARED_CARD: 4
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

function isSharedElementId(id) {
  return SHARED_ELEMENT_IDS.indexOf(resolveId(id)) !== -1;
}

function resolveMorph(targetOpts) {
  const fromBounds = (targetOpts && (targetOpts.fromBounds || targetOpts.layerBounds)) || DEFAULT_CARD_BOUNDS;
  const toBounds = (targetOpts && (targetOpts.toBounds || targetOpts.destBounds)) || DEFAULT_DETAIL_BOUNDS;
  return planBoundsMorph({ fromBounds: fromBounds, toBounds: toBounds });
}

function planSharedCard(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const morph = resolveMorph(opts.target);
  const dx = morph.valid ? morph.positionDelta[0] : 0;
  const dy = morph.valid ? morph.positionDelta[1] : 0;
  const outSx = morph.valid ? morph.scale[0] : 100;
  const outSy = morph.valid ? morph.scale[1] : 100;
  const inSx = morph.valid ? morph.inverseScale[0] : 100;
  const inSy = morph.valid ? morph.inverseScale[1] : 100;
  const over = uiPush.overshootPx(Math.max(Math.abs(dx), Math.abs(dy), 24), opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: round4(dx * 0.04), y: round4(dy * 0.04), opacity: 100, blur: 0, sx: 101.2, sy: 101.2, phase: "action" },
    {
      frame: phases.mid,
      x: round4(dx * 0.5),
      y: round4(dy * 0.5),
      opacity: 36,
      blur: 1,
      sx: round4(100 + (outSx - 100) * 0.5),
      sy: round4(100 + (outSy - 100) * 0.5),
      phase: "crossover"
    },
    { frame: phases.end, x: dx, y: dy, opacity: 0, blur: 2, sx: outSx, sy: outSy, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: round4(-dx), y: round4(-dy), opacity: 0, blur: 2, sx: inSx, sy: inSy, phase: "anticipate" },
    {
      frame: phases.mid,
      x: round4(-dx * 0.18),
      y: round4(-dy * 0.18),
      opacity: 78,
      blur: 1,
      sx: round4(inSx + (100 - inSx) * 0.72),
      sy: round4(inSy + (100 - inSy) * 0.72),
      phase: "crossover"
    },
    {
      frame: phases.settle,
      x: round4(dx === 0 ? 0 : (dx > 0 ? over : -over) * 0.15),
      y: round4(dy === 0 ? 0 : (dy > 0 ? over : -over) * 0.15),
      opacity: 100,
      blur: 0,
      sx: 100.6,
      sy: 100.6,
      phase: "settle"
    },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "done" }
  ]);
  return {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", inKeys, opts.incomingRest),
    travel: {
      direction: "bounds",
      distance: round4(Math.sqrt(dx * dx + dy * dy)),
      dx: dx,
      dy: dy,
      scale: [outSx, outSy],
      inverseScale: [inSx, inSy],
      shared: true,
      boundsMatch: true,
      mesh: false
    },
    morph: morph
  };
}

function plan(id, ctx) {
  return planSharedCard(Object.assign({}, ctx, { id: resolveId(id) }));
}

module.exports = {
  SHARED_ELEMENT_IDS,
  IMPLEMENTED_IDS: SHARED_ELEMENT_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_CARD_BOUNDS,
  DEFAULT_DETAIL_BOUNDS,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  displayName,
  resolveId,
  isSharedElementId,
  resolveMorph,
  plan,
  planSharedCard
};
