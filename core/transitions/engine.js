"use strict";

/**
 * Transition Kit engine — deterministic plans.
 * Node is source of truth. JSX mirrors these numbers for the 6 Phase 1 IDs.
 * Native AE only. No .ffx / .aep / vendor plugins.
 */

const { round4, clamp } = require("../saasDemo");
const { normalizeEase, easeInfluences, DEFAULT_EASE } = require("./easing");
const { durationFrames, secondsFromFrames, DEFAULT_FPS, normalizeFps, normalizeTimingGroup } = require("./timing");
const { planTargetZoom } = require("./target");
const { planTransitionControl, CONTROL_NAME, DIRECTION_ENUM } = require("./control");

const IMPLEMENTED_IDS = [
  "EVT_UI_PUSH_LEFT",
  "EVT_UI_PUSH_RIGHT",
  "EVT_UI_PUSH_UP",
  "EVT_UI_PUSH_DOWN",
  "EVT_UI_PUSH_SCALE",
  "EVT_UI_PUSH_DEPTH"
];

const ANATOMY = {
  anticipate: 0.125,
  action: 0.5,
  crossover: 0.5,
  settle: 1
};

const STYLE = "premium-saas";
const ANTICIPATE_RATIO = 0.04;
const OVERSHOOT_CAP = 24;
const DEFAULT_COMP = { w: 1920, h: 1080, fps: DEFAULT_FPS };

const AXIS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 }
};

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
  return String(id || "")
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_");
}

function normalizePushDirection(value, id) {
  const fromId = {
    EVT_UI_PUSH_LEFT: "left",
    EVT_UI_PUSH_RIGHT: "right",
    EVT_UI_PUSH_UP: "up",
    EVT_UI_PUSH_DOWN: "down"
  };
  if (value != null && value !== "") {
    const raw = String(value).toLowerCase();
    if (AXIS[raw]) return raw;
    const asNum = Number(value);
    if (asNum === asNum && DIRECTION_ENUM[asNum]) return DIRECTION_ENUM[asNum];
  }
  if (fromId[id]) return fromId[id];
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

function uniqueKeys(list) {
  const seen = {};
  const out = [];
  list.forEach(function (k) {
    const frame = k.frame;
    if (seen[frame]) {
      out[seen[frame] - 1] = k;
      return;
    }
    seen[frame] = out.length + 1;
    out.push(k);
  });
  return out.sort(function (a, b) {
    return a.frame - b.frame;
  });
}

function keyAt(frame, fps, fields) {
  const t = secondsFromFrames(frame, fps);
  const row = { t: t, frame: frame };
  Object.keys(fields).forEach(function (k) {
    row[k] = fields[k];
  });
  return row;
}

function travelDistance(direction, comp, distancePct, strengthPct) {
  const axis = direction === "up" || direction === "down" ? comp.h : comp.w;
  const dist = axis * (clamp(distancePct, 0, 200) / 100) * (clamp(strengthPct, 0, 200) / 100);
  return round4(Math.max(0, dist));
}

function anticipatePx(distance) {
  return round4(Math.min(16, distance * ANTICIPATE_RATIO));
}

function overshootPx(distance, overshootPct) {
  return round4(Math.min(OVERSHOOT_CAP, distance * (clamp(overshootPct, 0, 24) / 100)));
}

function phaseFrames(durationFramesValue) {
  const d = Math.max(2, Number(durationFramesValue) || 15);
  const anticipate = Math.max(1, Math.round(d * ANATOMY.anticipate));
  const mid = Math.max(anticipate + 1, Math.round(d * ANATOMY.crossover));
  const settle = Math.max(mid + 1, Math.round(d * 0.82));
  const end = d;
  return {
    start: 0,
    anticipate: Math.min(anticipate, d - 1),
    mid: Math.min(mid, d - 1),
    settle: Math.min(settle, d - 1),
    end: end
  };
}

function poseKeys(frames, fps, poses) {
  return uniqueKeys(
    poses.map(function (pose) {
      return keyAt(pose.frame, fps, {
        x: round4(pose.x || 0),
        y: round4(pose.y || 0),
        scale: [round4(pose.sx == null ? 100 : pose.sx), round4(pose.sy == null ? pose.sx == null ? 100 : pose.sx : pose.sy)],
        opacity: round4(pose.opacity == null ? 100 : pose.opacity),
        blur: round4(pose.blur || 0),
        phase: pose.phase
      });
    })
  );
}

function restRelativeOps(name, role, keys, rest) {
  return {
    name: name,
    role: role,
    rest: [round4(rest[0]), round4(rest[1])],
    set: {
      position: keys.map(function (k) {
        return { t: k.t, frame: k.frame, value: [round4(rest[0] + k.x), round4(rest[1] + k.y)], phase: k.phase };
      }),
      scale: keys.map(function (k) {
        return { t: k.t, frame: k.frame, value: k.scale.slice(), phase: k.phase };
      }),
      opacity: keys.map(function (k) {
        return { t: k.t, frame: k.frame, value: k.opacity, phase: k.phase };
      }),
      blur: keys.map(function (k) {
        return { t: k.t, frame: k.frame, value: k.blur, effect: "ADBE Fast Box Blur", property: "Blur Radius", phase: k.phase };
      })
    },
    keys: keys
  };
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

function planDirectionalPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction];
  const distance = opts.distance;
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outName = opts.outgoingName;
  const inName = opts.incomingName;

  const outKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.5, y: axis.y * distance * 0.5, opacity: 55, blur: 2, sx: 99.2, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 6, sx: 98, phase: "done" }
  ]);

  const inKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 6, sx: 101.5, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.18, y: -axis.y * distance * 0.18, opacity: 78, blur: 2, sx: 100.4, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);

  return {
    outgoing: restRelativeOps(outName, "outgoing", outKeys, opts.outgoingRest),
    incoming: restRelativeOps(inName, "incoming", inKeys, opts.incomingRest),
    travel: { direction: direction, distance: distance, anticipate: anti, overshoot: over }
  };
}

function planScalePush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 101.2, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 42, blur: 4, sx: 96, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 8, sx: 88, phase: "done" }
  ]);
  const inKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 8, sx: 110, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 72, blur: 3, sx: 103, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.8, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return {
    outgoing: restRelativeOps(opts.outgoingName, "outgoing", outKeys, opts.outgoingRest),
    incoming: restRelativeOps(opts.incomingName, "incoming", inKeys, opts.incomingRest),
    travel: { direction: "scale", distance: 0, anticipate: 0, overshoot: 0 }
  };
}

function planDepthPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 4, opacity: 100, blur: 1, sx: 100.6, phase: "action" },
    { frame: phases.mid, x: 0, y: 10, opacity: 48, blur: 8, sx: 96.5, phase: "crossover" },
    { frame: phases.end, x: 0, y: 18, opacity: 0, blur: 16, sx: 92, phase: "done" }
  ]);
  const inKeys = poseKeys(phases, fps, [
    { frame: phases.start, x: 0, y: -16, opacity: 0, blur: 14, sx: 108, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: -5, opacity: 70, blur: 5, sx: 103, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 2, opacity: 100, blur: 0, sx: 100.6, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return {
    outgoing: restRelativeOps(opts.outgoingName, "outgoing", outKeys, opts.outgoingRest),
    incoming: restRelativeOps(opts.incomingName, "incoming", inKeys, opts.incomingRest),
    travel: { direction: "depth", distance: 0, anticipate: 4, overshoot: 2 }
  };
}

function emptyLayer(name, role, rest) {
  return restRelativeOps(name, role, [], rest || [0, 0]);
}

function applyTransitionPlan(opts) {
  opts = opts || {};
  let id = normalizeId(opts.id);
  const fps = normalizeFps(opts.fps || (opts.comp && opts.comp.fps) || DEFAULT_FPS);
  const group = normalizeTimingGroup(opts.group || opts.duration || "STANDARD");
  const frames = opts.durationFrames != null ? Math.round(clamp(opts.durationFrames, 2, 240)) : durationFrames(group, fps);
  const ease = normalizeEase(opts.ease || DEFAULT_EASE);
  const comp = {
    w: Number((opts.comp && (opts.comp.w || opts.comp.width)) || DEFAULT_COMP.w),
    h: Number((opts.comp && (opts.comp.h || opts.comp.height)) || DEFAULT_COMP.h),
    fps: fps
  };
  const strength = opts.strength == null ? 100 : opts.strength;
  const distancePct = opts.distance == null ? 100 : opts.distance;
  const overshoot = opts.overshoot == null ? 6 : opts.overshoot;

  if (id === "EVT_UI_PUSH_LEFT" || id === "EVT_UI_PUSH_RIGHT" || id === "EVT_UI_PUSH_UP" || id === "EVT_UI_PUSH_DOWN") {
    const dir = normalizePushDirection(opts.direction, id);
    if (opts.direction != null && dir !== normalizePushDirection(null, id)) {
      id = implementedIdForDirection(dir);
    }
  }

  const implemented = IMPLEMENTED_IDS.indexOf(id) !== -1;
  const direction = normalizePushDirection(opts.direction, id);
  const outgoingName = layerName(opts.outgoing, "Outgoing");
  const incomingName = layerName(opts.incoming, "Incoming");
  const outgoingRest = layerRest(opts.outgoing);
  const incomingRest = layerRest(opts.incoming);
  const phases = phaseFrames(frames);
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
    outgoing: emptyLayer(outgoingName, "outgoing", outgoingRest),
    incoming: emptyLayer(incomingName, "incoming", incomingRest),
    note: "Native AE keyframes. Node plan is source of truth. JSX mirrors Phase 1 IDs."
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
    shared.description = id + " is catalogued. Plan generator lands in a later phase.";
    shared.layers = [shared.outgoing, shared.incoming];
    return shared;
  }

  const ctx = {
    fps: fps,
    phases: phases,
    direction: direction,
    distance: travelDistance(direction, comp, distancePct, strength),
    overshoot: overshoot,
    outgoingName: outgoingName,
    incomingName: incomingName,
    outgoingRest: outgoingRest,
    incomingRest: incomingRest
  };

  let built;
  if (id === "EVT_UI_PUSH_SCALE") built = planScalePush(ctx);
  else if (id === "EVT_UI_PUSH_DEPTH") built = planDepthPush(ctx);
  else built = planDirectionalPush(ctx);

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
