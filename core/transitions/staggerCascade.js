"use strict";

/**
 * Stagger-Cascade family — EvoCRM list / table rows (deal pipeline, contacts, activity).
 * Reuses saasDemo staggerReveal numbers (offset 3f, travel 16px, hold 0.2s).
 * Opacity-only for EVT_STAGGER_FADE. Soft delay wave, no bounce.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear). No glitch / RGB / flares.
 */

const { STAGGER, round4, clamp } = require("../saasDemo");
const { secondsFromFrames } = require("./timing");
const uiPush = require("./uiPush");

const STAGGER_CASCADE_IDS = [
  "EVT_STAGGER_CARDS",
  "EVT_STAGGER_LIST",
  "EVT_CASCADE_IN",
  "EVT_CASCADE_OUT",
  "EVT_STAGGER_FADE",
  "EVT_WAVE_SOFT"
];

const ID_ALIASES = {
  EVT_STAGGER: "EVT_STAGGER_CARDS",
  EVT_CARDS_STAGGER: "EVT_STAGGER_CARDS",
  EVT_LIST_STAGGER: "EVT_STAGGER_LIST",
  EVT_STAGGER_ROWS: "EVT_STAGGER_LIST",
  EVT_CASCADE: "EVT_CASCADE_IN",
  EVT_NAV_CASCADE: "EVT_CASCADE_IN",
  EVT_TREE_IN: "EVT_CASCADE_IN",
  EVT_TREE_OUT: "EVT_CASCADE_OUT",
  EVT_FADE_STAGGER: "EVT_STAGGER_FADE",
  EVT_WAVE: "EVT_WAVE_SOFT"
};

const DISPLAY_NAMES = {
  EVT_STAGGER_CARDS: "Stagger Cards",
  EVT_STAGGER_LIST: "Stagger List",
  EVT_CASCADE_IN: "Cascade In",
  EVT_CASCADE_OUT: "Cascade Out",
  EVT_STAGGER_FADE: "Stagger Fade",
  EVT_WAVE_SOFT: "Wave Soft"
};

const DEFAULT_GROUP_BY_ID = {
  EVT_STAGGER_CARDS: "STANDARD",
  EVT_STAGGER_LIST: "STANDARD",
  EVT_CASCADE_IN: "SMOOTH",
  EVT_CASCADE_OUT: "FAST",
  EVT_STAGGER_FADE: "STANDARD",
  EVT_WAVE_SOFT: "SMOOTH"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_STAGGER_CARDS: 0,
  EVT_STAGGER_LIST: 0,
  EVT_CASCADE_IN: 0,
  EVT_CASCADE_OUT: 0,
  EVT_STAGGER_FADE: 0,
  EVT_WAVE_SOFT: 0
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_STAGGER_CARDS: "up",
  EVT_STAGGER_LIST: "up",
  EVT_CASCADE_IN: "up",
  EVT_CASCADE_OUT: "down",
  EVT_STAGGER_FADE: "up",
  EVT_WAVE_SOFT: "up"
};

const PHASE_PROFILE = {
  EVT_CASCADE_IN: "soft",
  EVT_CASCADE_OUT: "snap",
  EVT_WAVE_SOFT: "soft"
};

/** saasDemo staggerReveal offset — default delay between items. */
const OFFSET_FRAMES = STAGGER.offsetFrames;
/** Softer wave than the default 3-frame list offset. */
const WAVE_OFFSET_FRAMES = 4;
/** saasDemo staggerReveal Y travel (px). */
const TRAVEL_PX = STAGGER.travel;
/** Quieter tree / nav cascade. */
const CASCADE_IN_TRAVEL_PX = 12;
const HOLD_SEC = STAGGER.hold;
const DEFAULT_ITEM_COUNT = 4;
const CARD_ENTER_SCALE = 98;
const CASCADE_ENTER_SCALE = 97;
const LIST_ENTER_SCALE = 100;
const FADE_IN_MID = 58;

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

function isStaggerCascadeId(id) {
  return STAGGER_CASCADE_IDS.indexOf(resolveId(id)) !== -1;
}

function offsetForId(id) {
  return resolveId(id) === "EVT_WAVE_SOFT" ? WAVE_OFFSET_FRAMES : OFFSET_FRAMES;
}

function travelForId(id) {
  const resolved = resolveId(id);
  if (resolved === "EVT_STAGGER_FADE") return 0;
  if (resolved === "EVT_CASCADE_IN") return CASCADE_IN_TRAVEL_PX;
  return TRAVEL_PX;
}

function enterScaleForId(id) {
  const resolved = resolveId(id);
  if (resolved === "EVT_STAGGER_CARDS") return CARD_ENTER_SCALE;
  if (resolved === "EVT_CASCADE_IN") return CASCADE_ENTER_SCALE;
  return LIST_ENTER_SCALE;
}

function isLeaveId(id) {
  return resolveId(id) === "EVT_CASCADE_OUT";
}

function isOpacityOnlyId(id) {
  return resolveId(id) === "EVT_STAGGER_FADE";
}

function shiftKeys(keys, offsetFrames, fps) {
  const offset = Math.round(clamp(offsetFrames, 0, 120));
  return keys.map(function (k) {
    const frame = k.frame + offset;
    const copy = Object.assign({}, k, {
      frame: frame,
      t: secondsFromFrames(frame, fps)
    });
    if (k.scale) copy.scale = k.scale.slice();
    return copy;
  });
}

function layerName(layer, fallback) {
  if (layer == null) return fallback;
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || fallback;
}

function resolveItemNames(opts, count) {
  const list = opts.layers || opts.items;
  if (Array.isArray(list) && list.length) {
    return list.map(function (layer, i) {
      return layerName(layer, "Item " + i);
    });
  }
  const names = [];
  let i;
  for (i = 0; i < count; i++) {
    if (i === 0) names.push(opts.outgoingName || "Outgoing");
    else if (i === 1) names.push(opts.incomingName || "Incoming");
    else names.push("Item " + i);
  }
  return names;
}

function itemPoseKeys(opts, spec) {
  const fps = opts.fps;
  const phases = opts.phases;
  const axis = uiPush.AXIS[opts.direction] || uiPush.AXIS.up;
  const travel = spec.travel;
  const startX = -axis.x * travel;
  const startY = -axis.y * travel;
  const enterScale = spec.enterScale;
  const opacityOnly = spec.opacityOnly;
  const leave = spec.leave;

  if (opacityOnly) {
    if (leave) {
      return uiPush.poseKeys(fps, [
        { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
        { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "action" },
        { frame: phases.mid, x: 0, y: 0, opacity: FADE_IN_MID, blur: 0, sx: 100, phase: "crossover" },
        { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "done" }
      ]);
    }
    return uiPush.poseKeys(fps, [
      { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 0, sx: 100, phase: "anticipate" },
      { frame: phases.mid, x: 0, y: 0, opacity: FADE_IN_MID, blur: 0, sx: 100, phase: "crossover" },
      { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
      { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
    ]);
  }

  if (leave) {
    return uiPush.poseKeys(fps, [
      { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
      { frame: phases.anticipate, x: axis.x * travel * 0.08, y: axis.y * travel * 0.08, opacity: 100, blur: 0, sx: 100, phase: "action" },
      { frame: phases.mid, x: axis.x * travel * 0.45, y: axis.y * travel * 0.45, opacity: 40, blur: 0, sx: 99.2, phase: "crossover" },
      { frame: phases.end, x: axis.x * travel, y: axis.y * travel, opacity: 0, blur: 0, sx: 98, phase: "done" }
    ]);
  }

  return uiPush.poseKeys(fps, [
    { frame: phases.start, x: startX, y: startY, opacity: 0, blur: 0, sx: enterScale, phase: "anticipate" },
    { frame: phases.anticipate, x: startX * 0.88, y: startY * 0.88, opacity: 18, blur: 0, sx: enterScale + 0.6, phase: "action" },
    { frame: phases.mid, x: startX * 0.22, y: startY * 0.22, opacity: 78, blur: 0, sx: mixToward100(enterScale, 60), phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
}

function mixToward100(from, strengthPct) {
  const t = clamp(strengthPct == null ? 100 : strengthPct, 0, 200) / 100;
  return round4(from + (100 - from) * t);
}

function restForIndex(opts, index) {
  if (index === 0) return opts.outgoingRest || [0, 0];
  if (index === 1) return opts.incomingRest || [0, 0];
  return opts.incomingRest || [0, 0];
}

function buildStagger(opts, spec) {
  const fps = opts.fps;
  const resolved = resolveId(opts.id);
  const offsetFrames = Math.round(
    clamp(opts.offsetFrames == null ? offsetForId(resolved) : opts.offsetFrames, 0, 120)
  );
  const travel = spec.travel;
  const names = resolveItemNames(opts, Math.max(2, Math.round(opts.staggerCount || opts.itemCount || DEFAULT_ITEM_COUNT)));
  const baseKeys = itemPoseKeys(opts, spec);
  const items = names.map(function (name, i) {
    const keys = shiftKeys(baseKeys, i * offsetFrames, fps);
    return {
      name: name,
      index: i,
      delayFrames: i * offsetFrames,
      delaySec: secondsFromFrames(i * offsetFrames, fps),
      role: i === 0 ? "outgoing" : i === 1 ? "incoming" : "item",
      keys: keys,
      layer: uiPush.restRelativeOps(name, i === 0 ? "outgoing" : i === 1 ? "incoming" : "item", keys, restForIndex(opts, i))
    };
  });
  const outgoing = items[0].layer;
  const incoming = items[1].layer;
  return {
    outgoing: outgoing,
    incoming: incoming,
    travel: {
      direction: opts.direction,
      distance: travel,
      travelPx: travel,
      offsetFrames: offsetFrames,
      holdSec: HOLD_SEC,
      stagger: true,
      noBounce: true,
      overshoot: 0,
      cards: resolved === "EVT_STAGGER_CARDS",
      list: resolved === "EVT_STAGGER_LIST",
      cascade: resolved === "EVT_CASCADE_IN" || resolved === "EVT_CASCADE_OUT",
      cascadeIn: resolved === "EVT_CASCADE_IN",
      cascadeOut: resolved === "EVT_CASCADE_OUT",
      fade: resolved === "EVT_STAGGER_FADE",
      wave: resolved === "EVT_WAVE_SOFT",
      opacityOnly: !!spec.opacityOnly,
      leave: !!spec.leave
    },
    stagger: {
      offsetFrames: offsetFrames,
      travelPx: travel,
      holdSec: HOLD_SEC,
      itemCount: items.length,
      noBounce: true,
      opacityOnly: !!spec.opacityOnly,
      leave: !!spec.leave,
      items: items.map(function (item) {
        return {
          name: item.name,
          index: item.index,
          delayFrames: item.delayFrames,
          delaySec: item.delaySec,
          role: item.role
        };
      })
    }
  };
}

function planStaggerCards(opts) {
  return buildStagger(opts, {
    travel: TRAVEL_PX,
    enterScale: CARD_ENTER_SCALE,
    opacityOnly: false,
    leave: false
  });
}

function planStaggerList(opts) {
  return buildStagger(opts, {
    travel: TRAVEL_PX,
    enterScale: LIST_ENTER_SCALE,
    opacityOnly: false,
    leave: false
  });
}

function planCascadeIn(opts) {
  return buildStagger(opts, {
    travel: CASCADE_IN_TRAVEL_PX,
    enterScale: CASCADE_ENTER_SCALE,
    opacityOnly: false,
    leave: false
  });
}

function planCascadeOut(opts) {
  return buildStagger(opts, {
    travel: TRAVEL_PX,
    enterScale: LIST_ENTER_SCALE,
    opacityOnly: false,
    leave: true
  });
}

function planStaggerFade(opts) {
  return buildStagger(opts, {
    travel: 0,
    enterScale: LIST_ENTER_SCALE,
    opacityOnly: true,
    leave: false
  });
}

function planWaveSoft(opts) {
  return buildStagger(opts, {
    travel: TRAVEL_PX,
    enterScale: LIST_ENTER_SCALE,
    opacityOnly: false,
    leave: false
  });
}

function plan(id, ctx) {
  const resolved = resolveId(id);
  const next = Object.assign({}, ctx, { id: resolved });
  if (resolved === "EVT_STAGGER_LIST") return planStaggerList(next);
  if (resolved === "EVT_CASCADE_IN") return planCascadeIn(next);
  if (resolved === "EVT_CASCADE_OUT") return planCascadeOut(next);
  if (resolved === "EVT_STAGGER_FADE") return planStaggerFade(next);
  if (resolved === "EVT_WAVE_SOFT") return planWaveSoft(next);
  return planStaggerCards(next);
}

module.exports = {
  STAGGER_CASCADE_IDS,
  IMPLEMENTED_IDS: STAGGER_CASCADE_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  PHASE_PROFILE,
  OFFSET_FRAMES,
  WAVE_OFFSET_FRAMES,
  TRAVEL_PX,
  CASCADE_IN_TRAVEL_PX,
  HOLD_SEC,
  DEFAULT_ITEM_COUNT,
  CARD_ENTER_SCALE,
  CASCADE_ENTER_SCALE,
  LIST_ENTER_SCALE,
  FADE_IN_MID,
  displayName,
  resolveId,
  isStaggerCascadeId,
  offsetForId,
  travelForId,
  enterScaleForId,
  isLeaveId,
  isOpacityOnlyId,
  shiftKeys,
  plan,
  planStaggerCards,
  planStaggerList,
  planCascadeIn,
  planCascadeOut,
  planStaggerFade,
  planWaveSoft
};
