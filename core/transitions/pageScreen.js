"use strict";

/**
 * Page-Screen family — EvoCRM IA (dashboard → page, forward/back, tab content).
 * Full-page push reuses UI Push math. Fade is opacity-only.
 * Screen swap keeps app chrome (UI-Slide card-width). Nav is directional IA.
 * Tab cross is a quiet content fade. Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). No glitch / RGB / flares.
 */

const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");

const PAGE_SCREEN_IDS = [
  "EVT_PAGE_PUSH",
  "EVT_PAGE_FADE",
  "EVT_SCREEN_SWAP",
  "EVT_NAV_FORWARD",
  "EVT_NAV_BACK",
  "EVT_TAB_CROSS"
];

const ID_ALIASES = {
  EVT_PAGE: "EVT_PAGE_PUSH",
  EVT_SCREEN: "EVT_SCREEN_SWAP",
  EVT_NAV: "EVT_NAV_FORWARD",
  EVT_FORWARD: "EVT_NAV_FORWARD",
  EVT_BACK: "EVT_NAV_BACK",
  EVT_TAB: "EVT_TAB_CROSS",
  EVT_TAB_FADE: "EVT_TAB_CROSS"
};

const DISPLAY_NAMES = {
  EVT_PAGE_PUSH: "Page Push",
  EVT_PAGE_FADE: "Page Fade",
  EVT_SCREEN_SWAP: "Screen Swap",
  EVT_NAV_FORWARD: "Nav Forward",
  EVT_NAV_BACK: "Nav Back",
  EVT_TAB_CROSS: "Tab Cross"
};

const DEFAULT_GROUP_BY_ID = {
  EVT_PAGE_PUSH: "STANDARD",
  EVT_PAGE_FADE: "SMOOTH",
  EVT_SCREEN_SWAP: "STANDARD",
  EVT_NAV_FORWARD: "STANDARD",
  EVT_NAV_BACK: "STANDARD",
  EVT_TAB_CROSS: "FAST"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_PAGE_PUSH: 6,
  EVT_PAGE_FADE: 0,
  EVT_SCREEN_SWAP: 4,
  EVT_NAV_FORWARD: 6,
  EVT_NAV_BACK: 6,
  EVT_TAB_CROSS: 0
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_PAGE_PUSH: "left",
  EVT_PAGE_FADE: "left",
  EVT_SCREEN_SWAP: "left",
  EVT_NAV_FORWARD: "left",
  EVT_NAV_BACK: "right",
  EVT_TAB_CROSS: "left"
};

const PHASE_PROFILE = {
  EVT_PAGE_FADE: "soft",
  EVT_TAB_CROSS: "snap"
};

/** Scale-Zoom zoom-in mid opacities — fade is opacity-only. */
const PAGE_FADE_OUT_MID = 42;
const PAGE_FADE_IN_MID = 72;
/** Overlay-Modal quiet mid — tab content dissolve. */
const TAB_CROSS_OUT_MID = 58;
const TAB_CROSS_IN_MID = 70;

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

function isPageScreenId(id) {
  return PAGE_SCREEN_IDS.indexOf(resolveId(id)) !== -1;
}

function pack(opts, outgoingKeys, incomingKeys, travel) {
  return {
    outgoing: uiPush.restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest),
    incoming: uiPush.restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest),
    travel: travel
  };
}

function withTravel(built, extra) {
  built.travel = Object.assign({}, built.travel, extra);
  return built;
}

function planPagePush(opts) {
  return withTravel(uiPush.planDirectionalPush(opts), {
    page: true,
    fullPage: true
  });
}

function planNavForward(opts) {
  return withTravel(uiPush.planDirectionalPush(opts), {
    page: true,
    fullPage: true,
    nav: true,
    forward: true
  });
}

function planNavBack(opts) {
  return withTravel(uiPush.planDirectionalPush(opts), {
    page: true,
    fullPage: true,
    nav: true,
    back: true
  });
}

function planScreenSwap(opts) {
  const built = uiSlide.planCardSlide(Object.assign({}, opts, { id: "EVT_SLIDE_CARD_LEFT" }));
  return withTravel(built, {
    chromeStay: true,
    screenSwap: true
  });
}

function planOpacityCross(opts, outMid, inMid, travel) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: outMid, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "done" }
  ]);
  const inKeys = uiPush.poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: inMid, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, travel);
}

function planPageFade(opts) {
  return planOpacityCross(opts, PAGE_FADE_OUT_MID, PAGE_FADE_IN_MID, {
    direction: "fade",
    distance: 0,
    fade: true,
    page: true,
    opacityOnly: true
  });
}

function planTabCross(opts) {
  return planOpacityCross(opts, TAB_CROSS_OUT_MID, TAB_CROSS_IN_MID, {
    direction: "fade",
    distance: 0,
    fade: true,
    tab: true,
    quiet: true,
    opacityOnly: true
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_PAGE_FADE") return planPageFade(next);
  if (resolved === "EVT_SCREEN_SWAP") return planScreenSwap(next);
  if (resolved === "EVT_NAV_FORWARD") return planNavForward(next);
  if (resolved === "EVT_NAV_BACK") return planNavBack(next);
  if (resolved === "EVT_TAB_CROSS") return planTabCross(next);
  return planPagePush(next);
}

module.exports = {
  PAGE_SCREEN_IDS,
  IMPLEMENTED_IDS: PAGE_SCREEN_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  PHASE_PROFILE,
  PAGE_FADE_OUT_MID,
  PAGE_FADE_IN_MID,
  TAB_CROSS_OUT_MID,
  TAB_CROSS_IN_MID,
  displayName,
  resolveId,
  isPageScreenId,
  plan,
  planPagePush,
  planPageFade,
  planScreenSwap,
  planNavForward,
  planNavBack,
  planTabCross
};
