"use strict";

/**
 * Shared-Element family — bounds-match list / hero / image / card → detail.
 * Position + scale morph only. No mesh warp / Liquify / reshape.
 * Premium SaaS (Apple / Linear). EvoCRM: list row, hero, or card opens into detail.
 */

const { round4 } = require("../saasDemo");
const { planBoundsMorph } = require("./target");
const uiPush = require("./uiPush");

const SHARED_ELEMENT_IDS = [
  "EVT_SHARED_CARD",
  "EVT_SHARED_IMAGE",
  "EVT_MATCH_CUT",
  "EVT_MORPH_BOUNDS",
  "EVT_HERO_TO_DETAIL",
  "EVT_LIST_TO_DETAIL"
];

const ID_ALIASES = {
  EVT_SHARED_ELEMENT: "EVT_SHARED_CARD",
  EVT_CARD_TO_DETAIL: "EVT_SHARED_CARD",
  EVT_SHARED: "EVT_SHARED_CARD",
  EVT_IMAGE_TO_GALLERY: "EVT_SHARED_IMAGE",
  EVT_SHARED_IMG: "EVT_SHARED_IMAGE",
  EVT_MATCH: "EVT_MATCH_CUT",
  EVT_BOUNDS_MORPH: "EVT_MORPH_BOUNDS",
  EVT_HERO_DETAIL: "EVT_HERO_TO_DETAIL",
  EVT_LIST_DETAIL: "EVT_LIST_TO_DETAIL",
  EVT_ROW_TO_DETAIL: "EVT_LIST_TO_DETAIL"
};

const DISPLAY_NAMES = {
  EVT_SHARED_CARD: "Shared Card",
  EVT_SHARED_IMAGE: "Shared Image",
  EVT_MATCH_CUT: "Match Cut",
  EVT_MORPH_BOUNDS: "Morph Bounds",
  EVT_HERO_TO_DETAIL: "Hero to Detail",
  EVT_LIST_TO_DETAIL: "List to Detail"
};

const DEFAULT_CARD_BOUNDS = { l: 240, t: 300, r: 720, b: 660 };
const DEFAULT_DETAIL_BOUNDS = { l: 280, t: 80, r: 1640, b: 1000 };
const DEFAULT_IMAGE_BOUNDS = { l: 640, t: 220, r: 1280, b: 700 };
const DEFAULT_GALLERY_BOUNDS = { l: 360, t: 120, r: 1560, b: 960 };
const DEFAULT_HERO_BOUNDS = { l: 80, t: 60, r: 1840, b: 1020 };
const DEFAULT_HERO_DETAIL_BOUNDS = { l: 520, t: 140, r: 1400, b: 900 };
const DEFAULT_LIST_ROW_BOUNDS = { l: 80, t: 360, r: 920, b: 440 };
const DEFAULT_LIST_DETAIL_BOUNDS = { l: 720, t: 80, r: 1840, b: 1000 };

const DEFAULT_GROUP_BY_ID = {
  EVT_SHARED_CARD: "SMOOTH",
  EVT_SHARED_IMAGE: "SMOOTH",
  EVT_MATCH_CUT: "FAST",
  EVT_MORPH_BOUNDS: "STANDARD",
  EVT_HERO_TO_DETAIL: "SMOOTH",
  EVT_LIST_TO_DETAIL: "STANDARD"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_SHARED_CARD: 4,
  EVT_SHARED_IMAGE: 3,
  EVT_MATCH_CUT: 0,
  EVT_MORPH_BOUNDS: 2,
  EVT_HERO_TO_DETAIL: 3,
  EVT_LIST_TO_DETAIL: 3
};

const PHASE_PROFILE = {
  EVT_MATCH_CUT: "snap",
  EVT_HERO_TO_DETAIL: "soft"
};

const PROFILES = {
  EVT_SHARED_CARD: {
    antiTravel: 0.04,
    antiScale: 101.2,
    midTravel: 0.5,
    midOutScale: 0.5,
    midOutOpacity: 36,
    midOutBlur: 1,
    outEndOpacity: 0,
    outEndBlur: 2,
    inStartOpacity: 0,
    inStartBlur: 2,
    inMidTravel: 0.18,
    inMidScale: 0.72,
    inMidOpacity: 78,
    inMidBlur: 1,
    settleOver: 0.15,
    settleScale: 100.6
  },
  EVT_SHARED_IMAGE: {
    antiTravel: 0.02,
    antiScale: 100.8,
    midTravel: 0.5,
    midOutScale: 0.5,
    midOutOpacity: 52,
    midOutBlur: 1,
    outEndOpacity: 0,
    outEndBlur: 2,
    inStartOpacity: 0,
    inStartBlur: 2,
    inMidTravel: 0.22,
    inMidScale: 0.68,
    inMidOpacity: 70,
    inMidBlur: 1,
    settleOver: 0.1,
    settleScale: 100.4
  },
  EVT_MATCH_CUT: {
    antiTravel: 0,
    antiScale: 100,
    midTravel: 1,
    midOutScale: 1,
    midOutOpacity: 100,
    midOutBlur: 0,
    outEndOpacity: 0,
    outEndBlur: 0,
    inStartOpacity: 0,
    inStartBlur: 0,
    inMidTravel: 1,
    inMidScale: 0,
    inMidOpacity: 0,
    inMidBlur: 0,
    settleOver: 0,
    settleScale: 100
  },
  EVT_MORPH_BOUNDS: {
    antiTravel: 0,
    antiScale: 100,
    midTravel: 0.5,
    midOutScale: 0.5,
    midOutOpacity: 100,
    midOutBlur: 0,
    outEndOpacity: 0,
    outEndBlur: 0,
    inStartOpacity: 0,
    inStartBlur: 0,
    inMidTravel: 0.5,
    inMidScale: 0.5,
    inMidOpacity: 100,
    inMidBlur: 0,
    settleOver: 0,
    settleScale: 100
  },
  EVT_HERO_TO_DETAIL: {
    antiTravel: 0.03,
    antiScale: 100.6,
    midTravel: 0.45,
    midOutScale: 0.45,
    midOutOpacity: 40,
    midOutBlur: 1,
    outEndOpacity: 0,
    outEndBlur: 3,
    inStartOpacity: 0,
    inStartBlur: 3,
    inMidTravel: 0.2,
    inMidScale: 0.65,
    inMidOpacity: 74,
    inMidBlur: 1,
    settleOver: 0.12,
    settleScale: 100.5
  },
  EVT_LIST_TO_DETAIL: {
    antiTravel: 0.04,
    antiScale: 100.8,
    midTravel: 0.5,
    midOutScale: 0.5,
    midOutOpacity: 32,
    midOutBlur: 1,
    outEndOpacity: 0,
    outEndBlur: 2,
    inStartOpacity: 0,
    inStartBlur: 2,
    inMidTravel: 0.16,
    inMidScale: 0.7,
    inMidOpacity: 80,
    inMidBlur: 1,
    settleOver: 0.12,
    settleScale: 100.4
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

function isSharedElementId(id) {
  return SHARED_ELEMENT_IDS.indexOf(resolveId(id)) !== -1;
}

function defaultFromBounds(id) {
  const resolved = resolveId(id);
  if (resolved === "EVT_SHARED_IMAGE") return DEFAULT_IMAGE_BOUNDS;
  if (resolved === "EVT_HERO_TO_DETAIL") return DEFAULT_HERO_BOUNDS;
  if (resolved === "EVT_LIST_TO_DETAIL") return DEFAULT_LIST_ROW_BOUNDS;
  return DEFAULT_CARD_BOUNDS;
}

function defaultToBounds(id) {
  const resolved = resolveId(id);
  if (resolved === "EVT_SHARED_IMAGE") return DEFAULT_GALLERY_BOUNDS;
  if (resolved === "EVT_HERO_TO_DETAIL") return DEFAULT_HERO_DETAIL_BOUNDS;
  if (resolved === "EVT_LIST_TO_DETAIL") return DEFAULT_LIST_DETAIL_BOUNDS;
  return DEFAULT_DETAIL_BOUNDS;
}

function resolveMorph(targetOpts, id) {
  const fromBounds = (targetOpts && (targetOpts.fromBounds || targetOpts.layerBounds)) || defaultFromBounds(id);
  const toBounds = (targetOpts && (targetOpts.toBounds || targetOpts.destBounds)) || defaultToBounds(id);
  return planBoundsMorph({ fromBounds: fromBounds, toBounds: toBounds });
}

function travelFlags(id) {
  return {
    shared: true,
    boundsMatch: true,
    mesh: false,
    image: id === "EVT_SHARED_IMAGE",
    matchCut: id === "EVT_MATCH_CUT",
    morphBounds: id === "EVT_MORPH_BOUNDS",
    hero: id === "EVT_HERO_TO_DETAIL",
    list: id === "EVT_LIST_TO_DETAIL"
  };
}

function planSharedMorph(opts, id) {
  const resolved = resolveId(id || opts.id);
  const profile = PROFILES[resolved] || PROFILES.EVT_SHARED_CARD;
  const fps = opts.fps;
  const phases = opts.phases;
  const morph = resolveMorph(opts.target, resolved);
  const dx = morph.valid ? morph.positionDelta[0] : 0;
  const dy = morph.valid ? morph.positionDelta[1] : 0;
  const outSx = morph.valid ? morph.scale[0] : 100;
  const outSy = morph.valid ? morph.scale[1] : 100;
  const inSx = morph.valid ? morph.inverseScale[0] : 100;
  const inSy = morph.valid ? morph.inverseScale[1] : 100;
  const over = uiPush.overshootPx(Math.max(Math.abs(dx), Math.abs(dy), 24), opts.overshoot);
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "anticipate" },
    {
      frame: phases.anticipate,
      x: round4(dx * profile.antiTravel),
      y: round4(dy * profile.antiTravel),
      opacity: 100,
      blur: 0,
      sx: profile.antiScale,
      sy: profile.antiScale,
      phase: "action"
    },
    {
      frame: phases.mid,
      x: round4(dx * profile.midTravel),
      y: round4(dy * profile.midTravel),
      opacity: profile.midOutOpacity,
      blur: profile.midOutBlur,
      sx: round4(100 + (outSx - 100) * profile.midOutScale),
      sy: round4(100 + (outSy - 100) * profile.midOutScale),
      phase: "crossover"
    },
    {
      frame: phases.end,
      x: dx,
      y: dy,
      opacity: profile.outEndOpacity,
      blur: profile.outEndBlur,
      sx: outSx,
      sy: outSy,
      phase: "done"
    }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    {
      frame: phases.start,
      x: round4(-dx),
      y: round4(-dy),
      opacity: profile.inStartOpacity,
      blur: profile.inStartBlur,
      sx: inSx,
      sy: inSy,
      phase: "anticipate"
    },
    {
      frame: phases.mid,
      x: round4(-dx * profile.inMidTravel),
      y: round4(-dy * profile.inMidTravel),
      opacity: profile.inMidOpacity,
      blur: profile.inMidBlur,
      sx: round4(inSx + (100 - inSx) * profile.inMidScale),
      sy: round4(inSy + (100 - inSy) * profile.inMidScale),
      phase: "crossover"
    },
    {
      frame: phases.settle,
      x: round4(dx === 0 ? 0 : (dx > 0 ? over : -over) * profile.settleOver),
      y: round4(dy === 0 ? 0 : (dy > 0 ? over : -over) * profile.settleOver),
      opacity: 100,
      blur: 0,
      sx: profile.settleScale,
      sy: profile.settleScale,
      phase: "settle"
    },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, sy: 100, phase: "done" }
  ]);
  return {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", inKeys, opts.incomingRest),
    travel: Object.assign(
      {
        direction: "bounds",
        distance: round4(Math.sqrt(dx * dx + dy * dy)),
        dx: dx,
        dy: dy,
        scale: [outSx, outSy],
        inverseScale: [inSx, inSy]
      },
      travelFlags(resolved)
    ),
    morph: morph
  };
}

function planSharedCard(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_SHARED_CARD" }), "EVT_SHARED_CARD");
}

function planSharedImage(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_SHARED_IMAGE" }), "EVT_SHARED_IMAGE");
}

function planMatchCut(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_MATCH_CUT" }), "EVT_MATCH_CUT");
}

function planMorphBounds(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_MORPH_BOUNDS" }), "EVT_MORPH_BOUNDS");
}

function planHeroToDetail(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_HERO_TO_DETAIL" }), "EVT_HERO_TO_DETAIL");
}

function planListToDetail(opts) {
  return planSharedMorph(Object.assign({}, opts, { id: "EVT_LIST_TO_DETAIL" }), "EVT_LIST_TO_DETAIL");
}

function plan(id, ctx) {
  return planSharedMorph(Object.assign({}, ctx, { id: resolveId(id) }), resolveId(id));
}

module.exports = {
  SHARED_ELEMENT_IDS,
  IMPLEMENTED_IDS: SHARED_ELEMENT_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_CARD_BOUNDS,
  DEFAULT_DETAIL_BOUNDS,
  DEFAULT_IMAGE_BOUNDS,
  DEFAULT_GALLERY_BOUNDS,
  DEFAULT_HERO_BOUNDS,
  DEFAULT_HERO_DETAIL_BOUNDS,
  DEFAULT_LIST_ROW_BOUNDS,
  DEFAULT_LIST_DETAIL_BOUNDS,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  PHASE_PROFILE,
  PROFILES,
  displayName,
  resolveId,
  isSharedElementId,
  defaultFromBounds,
  defaultToBounds,
  resolveMorph,
  plan,
  planSharedMorph,
  planSharedCard,
  planSharedImage,
  planMatchCut,
  planMorphBounds,
  planHeroToDetail,
  planListToDetail
};
