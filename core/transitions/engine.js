"use strict";

/**
 * Transition Kit engine — deterministic plans.
 * Node is source of truth. JSX mirrors UI Push family numbers.
 * Native AE only. No .ffx / .aep / vendor plugins.
 */

const { clamp } = require("../saasDemo");
const { normalizeEase, easeInfluences, DEFAULT_EASE } = require("./easing");
const { durationFrames, secondsFromFrames, DEFAULT_FPS, normalizeFps, normalizeTimingGroup } = require("./timing");
const { planTargetZoom } = require("./target");
const { planTransitionControl, CONTROL_NAME, DIRECTION_ENUM } = require("./control");
const uiPush = require("./uiPush");

const IMPLEMENTED_IDS = uiPush.UI_PUSH_IDS.slice();
const ANATOMY = uiPush.ANATOMY;
const STYLE = "premium-saas";
const DEFAULT_COMP = { w: 1920, h: 1080, fps: DEFAULT_FPS };

function layerName(layer, fallback) {
  if (layer == null) return fallback;
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || fallback;
}

function layerRest(layer) {
  if (!layer || typeof layer === "string") return [0, 0];
  const pos = layer.position || layer.rest || layer.pos;
  if (Array.isArray(pos) && pos.length >= 2) return [Number(pos[0]) || 0, Number(pos[1]) || 0];
  if (layer.x != null || layer.y != null) return [Number(layer.x) || 0, Number(layer.y) || 0];
  return [0, 0];
}

function normalizeId(id) {
  return uiPush.resolveId(id);
}

function normalizePushDirection(value, id) {
  const resolved = normalizeId(id);
  if (value != null && value !== "") {
    const raw = String(value).toLowerCase();
    if (uiPush.AXIS[raw]) return raw;
    const asNum = Number(value);
    if (asNum === asNum && DIRECTION_ENUM[asNum]) return DIRECTION_ENUM[asNum];
  }
  if (uiPush.DEFAULT_DIRECTION_BY_ID[resolved]) return uiPush.DEFAULT_DIRECTION_BY_ID[resolved];
  return "left";
}

function implementedIdForDirection(direction) {
  const map = {
    left: "EVT_UI_PUSH_LEFT",
    right: "EVT_UI_PUSH_RIGHT",
    up: "EVT_UI_PUSH_UP",
    down: "EVT_UI_PUSH_DOWN"
  };
  return map[direction] || "EVT_UI_PUSH_LEFT";
}

function sfxMarkers(fps, phases) {
  return [
    { name: "EVT_SFX_ANTICIPATE", t: secondsFromFrames(phases.start, fps), frame: phases.start, hook: "ui-soft-in", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_ACTION", t: secondsFromFrames(phases.anticipate, fps), frame: phases.anticipate, hook: "ui-whoosh-soft", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_CROSSOVER", t: secondsFromFrames(phases.mid, fps), frame: phases.mid, hook: "ui-cross", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_SETTLE", t: secondsFromFrames(phases.end, fps), frame: phases.end, hook: "ui-tick-soft", comment: "SFX hook only — no audio shipped" }
  ];
}

function anatomyWindow(phases, fps) {
  return {
    anticipate: { startFrame: phases.start, endFrame: phases.anticipate, start: secondsFromFrames(phases.start, fps), end: secondsFromFrames(phases.anticipate, fps) },
    action: { startFrame: phases.anticipate, endFrame: phases.mid, start: secondsFromFrames(phases.anticipate, fps), end: secondsFromFrames(phases.mid, fps) },
    crossover: { startFrame: phases.mid, endFrame: phases.mid, start: secondsFromFrames(phases.mid, fps), end: secondsFromFrames(phases.mid, fps) },
    settle: { startFrame: phases.mid, endFrame: phases.end, start: secondsFromFrames(phases.mid, fps), end: secondsFromFrames(phases.end, fps) }
  };
}

function applyTransitionPlan(opts) {
  opts = opts || {};
  let id = normalizeId(opts.id);
  const fps = normalizeFps(opts.fps || (opts.comp && opts.comp.fps) || DEFAULT_FPS);
  const ease = normalizeEase(opts.ease || DEFAULT_EASE);
  const comp = {
    w: Number((opts.comp && (opts.comp.w || opts.comp.width)) || DEFAULT_COMP.w),
    h: Number((opts.comp && (opts.comp.h || opts.comp.height)) || DEFAULT_COMP.h),
    fps: fps
  };
  const strength = opts.strength == null ? 100 : opts.strength;
  const distancePct = opts.distance == null ? 100 : opts.distance;

  if (id === "EVT_UI_PUSH_LEFT" || id === "EVT_UI_PUSH_RIGHT" || id === "EVT_UI_PUSH_UP" || id === "EVT_UI_PUSH_DOWN") {
    const dir = normalizePushDirection(opts.direction, id);
    if (opts.direction != null && dir !== normalizePushDirection(null, id)) {
      id = implementedIdForDirection(dir);
    }
  }

  const implemented = IMPLEMENTED_IDS.indexOf(id) !== -1;
  const direction = normalizePushDirection(opts.direction, id);
  const group = normalizeTimingGroup(opts.group || opts.duration || uiPush.DEFAULT_GROUP_BY_ID[id] || "STANDARD");
  const frames = opts.durationFrames != null ? Math.round(clamp(opts.durationFrames, 2, 240)) : durationFrames(group, fps);
  const overshoot = opts.overshoot == null ? uiPush.DEFAULT_OVERSHOOT_BY_ID[id] || 6 : opts.overshoot;
  const outgoingName = layerName(opts.outgoing, "Outgoing");
  const incomingName = layerName(opts.incoming, "Incoming");
  const outgoingRest = layerRest(opts.outgoing);
  const incomingRest = layerRest(opts.incoming);
  const phases = uiPush.phaseFrames(frames, uiPush.PHASE_PROFILE[id]);
  const control = planTransitionControl({
    durationFrames: frames,
    fps: fps,
    ease: ease,
    direction: direction,
    sliders: {
      Strength: strength,
      Distance: distancePct,
      Overshoot: overshoot
    }
  });

  const shared = {
    kind: "transition",
    id: id,
    name: uiPush.displayName(id),
    category: "UI-Push",
    style: STYLE,
    implemented: implemented,
    fps: fps,
    durationFrames: frames,
    durationSec: secondsFromFrames(frames, fps),
    group: group,
    direction: direction,
    ease: ease,
    easeInfluences: easeInfluences(ease),
    anatomy: anatomyWindow(phases, fps),
    phases: phases,
    control: { name: CONTROL_NAME, shy: true, sliders: control.sliders },
    undo: "Evotechly Transition · " + id,
    description: "",
    markers: sfxMarkers(fps, phases),
    target: null,
    layers: [],
    outgoing: uiPush.emptyLayer(outgoingName, "outgoing", outgoingRest),
    incoming: uiPush.emptyLayer(incomingName, "incoming", incomingRest),
    note: "Native AE keyframes. Node plan is source of truth. JSX mirrors the UI Push family."
  };

  if (opts.target && opts.target.layerBounds) {
    shared.target = planTargetZoom({
      compW: comp.w,
      compH: comp.h,
      layerBounds: opts.target.layerBounds,
      padding: opts.target.padding
    });
  }

  if (!implemented) {
    shared.name = id;
    shared.description = id + " is catalogued. Plan generator lands in a later phase.";
    shared.layers = [shared.outgoing, shared.incoming];
    return shared;
  }

  const ctx = {
    fps: fps,
    phases: phases,
    direction: direction,
    distance: uiPush.travelDistance(direction, comp, distancePct, strength),
    overshoot: overshoot,
    outgoingName: outgoingName,
    incomingName: incomingName,
    outgoingRest: outgoingRest,
    incomingRest: incomingRest
  };

  const built = uiPush.plan(id, ctx);
  shared.outgoing = built.outgoing;
  shared.incoming = built.incoming;
  shared.travel = built.travel;
  shared.layers = [built.outgoing, built.incoming];
  shared.description =
    "Apply " +
    id +
    " · " +
    frames +
    "f @" +
    fps +
    "fps · " +
    ease +
    " · anticipate→action→crossover→settle";
  return shared;
}

function isImplemented(id) {
  return IMPLEMENTED_IDS.indexOf(normalizeId(id)) !== -1;
}

module.exports = {
  IMPLEMENTED_IDS,
  ANATOMY,
  STYLE,
  applyTransitionPlan,
  isImplemented,
  normalizeId,
  normalizePushDirection
};
