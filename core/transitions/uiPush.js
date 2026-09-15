"use strict";

/**
 * UI Push family — complete keyframe plans.
 * Node is source of truth. JSX mirrors these numbers.
 * Premium SaaS (Apple / Linear / Stripe). No glitch / RGB / flares.
 */

const { round4, clamp } = require("../saasDemo");
const { secondsFromFrames } = require("./timing");

const UI_PUSH_IDS = [
  "EVT_UI_PUSH_LEFT",
  "EVT_UI_PUSH_RIGHT",
  "EVT_UI_PUSH_UP",
  "EVT_UI_PUSH_DOWN",
  "EVT_UI_PUSH_SCALE",
  "EVT_UI_PUSH_DEPTH",
  "EVT_UI_PUSH_SOFT",
  "EVT_UI_PUSH_SNAP",
  "EVT_UI_PUSH_OVERSHOOT",
  "EVT_UI_PUSH_PARALLAX",
  "EVT_UI_PUSH_FADE",
  "EVT_UI_PUSH_COVER",
  "EVT_UI_PUSH_PANEL",
  "EVT_UI_PUSH_DASHBOARD",
  "EVT_UI_PUSH_SPLIT"
];

const ID_ALIASES = {
  EVT_PANEL_PUSH: "EVT_UI_PUSH_PANEL",
  EVT_DASHBOARD_PUSH: "EVT_UI_PUSH_DASHBOARD",
  EVT_SPLIT_PANEL_PUSH: "EVT_UI_PUSH_SPLIT"
};

const DISPLAY_NAMES = {
  EVT_UI_PUSH_LEFT: "UI Push Left",
  EVT_UI_PUSH_RIGHT: "UI Push Right",
  EVT_UI_PUSH_UP: "UI Push Up",
  EVT_UI_PUSH_DOWN: "UI Push Down",
  EVT_UI_PUSH_SCALE: "UI Push + Scale",
  EVT_UI_PUSH_DEPTH: "UI Push + Depth",
  EVT_UI_PUSH_SOFT: "UI Push Soft",
  EVT_UI_PUSH_SNAP: "UI Push Snap",
  EVT_UI_PUSH_OVERSHOOT: "UI Push Overshoot",
  EVT_UI_PUSH_PARALLAX: "UI Push Parallax",
  EVT_UI_PUSH_FADE: "UI Push Fade",
  EVT_UI_PUSH_COVER: "UI Push Cover",
  EVT_UI_PUSH_PANEL: "Panel Push",
  EVT_UI_PUSH_DASHBOARD: "Dashboard Push",
  EVT_UI_PUSH_SPLIT: "Split Panel Push"
};

const PHASE1_IDS = [
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

const ANTICIPATE_RATIO = 0.04;
const OVERSHOOT_CAP = 24;

const AXIS = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 }
};

const PHASE_PROFILE = {
  EVT_UI_PUSH_SOFT: "soft",
  EVT_UI_PUSH_SNAP: "snap"
};

const DEFAULT_GROUP_BY_ID = {
  EVT_UI_PUSH_DEPTH: "SMOOTH",
  EVT_UI_PUSH_SOFT: "SMOOTH",
  EVT_UI_PUSH_SNAP: "FAST",
  EVT_UI_PUSH_PARALLAX: "SMOOTH",
  EVT_UI_PUSH_DASHBOARD: "SMOOTH"
};

const DEFAULT_OVERSHOOT_BY_ID = {
  EVT_UI_PUSH_OVERSHOOT: 16,
  EVT_UI_PUSH_SOFT: 3,
  EVT_UI_PUSH_SNAP: 2,
  EVT_UI_PUSH_COVER: 4,
  EVT_UI_PUSH_PANEL: 4,
  EVT_UI_PUSH_FADE: 4,
  EVT_UI_PUSH_SPLIT: 5
};

const DEFAULT_DIRECTION_BY_ID = {
  EVT_UI_PUSH_LEFT: "left",
  EVT_UI_PUSH_RIGHT: "right",
  EVT_UI_PUSH_UP: "up",
  EVT_UI_PUSH_DOWN: "down",
  EVT_UI_PUSH_PANEL: "right"
};

const TRAVEL_SCALE = {
  EVT_UI_PUSH_SOFT: 0.92,
  EVT_UI_PUSH_SNAP: 0.42,
  EVT_UI_PUSH_FADE: 0.36,
  EVT_UI_PUSH_PANEL: 0.4,
  EVT_UI_PUSH_SPLIT: 0.55,
  EVT_UI_PUSH_PARALLAX: 1
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

function phaseFrames(durationFramesValue, profile) {
  const d = Math.max(2, Number(durationFramesValue) || 15);
  let anticipateR = ANATOMY.anticipate;
  let midR = ANATOMY.crossover;
  let settleR = 0.82;
  if (profile === "soft") {
    anticipateR = 0.14;
    midR = 0.44;
    settleR = 0.64;
  } else if (profile === "snap") {
    anticipateR = 0.08;
    midR = 0.5;
    settleR = 0.9;
  }
  const anticipate = Math.max(1, Math.round(d * anticipateR));
  const mid = Math.max(anticipate + 1, Math.round(d * midR));
  const settle = Math.max(mid + 1, Math.round(d * settleR));
  const end = d;
  return {
    start: 0,
    anticipate: Math.min(anticipate, d - 1),
    mid: Math.min(mid, d - 1),
    settle: Math.min(settle, d - 1),
    end: end
  };
}

function poseKeys(fps, poses) {
  return uniqueKeys(
    poses.map(function (pose) {
      return keyAt(pose.frame, fps, {
        x: round4(pose.x || 0),
        y: round4(pose.y || 0),
        scale: [round4(pose.sx == null ? 100 : pose.sx), round4(pose.sy == null ? (pose.sx == null ? 100 : pose.sx) : pose.sy)],
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

function emptyLayer(name, role, rest) {
  return restRelativeOps(name, role, [], rest || [0, 0]);
}

function pack(opts, outgoingKeys, incomingKeys, travel) {
  return {
    outgoing: restRelativeOps(opts.outgoingName, "outgoing", outgoingKeys, opts.outgoingRest),
    incoming: restRelativeOps(opts.incomingName, "incoming", incomingKeys, opts.incomingRest),
    travel: travel
  };
}

function planDirectionalPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = opts.distance;
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 100, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.5, y: axis.y * distance * 0.5, opacity: 55, blur: 2, sx: 99.2, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 6, sx: 98, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 6, sx: 101.5, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.18, y: -axis.y * distance * 0.18, opacity: 78, blur: 2, sx: 100.4, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over });
}

function planScalePush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 0, opacity: 100, blur: 0, sx: 101.2, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 42, blur: 4, sx: 96, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 0, blur: 8, sx: 88, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 0, blur: 8, sx: 110, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: 0, opacity: 72, blur: 3, sx: 103, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 0, opacity: 100, blur: 0, sx: 100.8, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: "scale", distance: 0, anticipate: 0, overshoot: 0 });
}

function planDepthPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: 0, y: 4, opacity: 100, blur: 1, sx: 100.6, phase: "action" },
    { frame: phases.mid, x: 0, y: 10, opacity: 48, blur: 8, sx: 96.5, phase: "crossover" },
    { frame: phases.end, x: 0, y: 18, opacity: 0, blur: 16, sx: 92, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: -16, opacity: 0, blur: 14, sx: 108, phase: "anticipate" },
    { frame: phases.mid, x: 0, y: -5, opacity: 70, blur: 5, sx: 103, phase: "crossover" },
    { frame: phases.settle, x: 0, y: 2, opacity: 100, blur: 0, sx: 100.6, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: "depth", distance: 0, anticipate: 4, overshoot: 2 });
}

function planSoftPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = round4(opts.distance * 0.92);
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 100.4, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.42, y: axis.y * distance * 0.42, opacity: 62, blur: 1, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 3, sx: 98.8, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 12, blur: 3, sx: 101.2, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.2, y: -axis.y * distance * 0.2, opacity: 80, blur: 1, sx: 100.3, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, profile: "soft" });
}

function planSnapPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = round4(opts.distance * 0.42);
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti * 0.5, y: -axis.y * anti * 0.5, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.55, y: axis.y * distance * 0.55, opacity: 40, blur: 0, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 1, sx: 99, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 1, sx: 100.6, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.08, y: -axis.y * distance * 0.08, opacity: 88, blur: 0, sx: 100.2, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, profile: "snap" });
}

function planOvershootPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = opts.distance;
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 100.3, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.52, y: axis.y * distance * 0.52, opacity: 48, blur: 2, sx: 99, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 5, sx: 97.8, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 5, sx: 102.2, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.08, y: -axis.y * distance * 0.08, opacity: 84, blur: 1, sx: 100.8, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 101.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, feel: "elastic-quiet" });
}

function planParallaxPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const foreground = opts.distance;
  const background = round4(opts.distance * 0.28);
  const anti = anticipatePx(background);
  const over = overshootPx(foreground, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti * 0.5, y: -axis.y * anti * 0.5, opacity: 100, blur: 1, sx: 99.6, phase: "action" },
    { frame: phases.mid, x: axis.x * background * 0.5, y: axis.y * background * 0.5, opacity: 62, blur: 3, sx: 99, phase: "crossover" },
    { frame: phases.end, x: axis.x * background, y: axis.y * background, opacity: 28, blur: 6, sx: 97.5, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * foreground, y: -axis.y * foreground, opacity: 0, blur: 4, sx: 102, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * foreground * 0.16, y: -axis.y * foreground * 0.16, opacity: 82, blur: 1, sx: 100.6, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: foreground,
    background: background,
    foreground: foreground,
    anticipate: anti,
    overshoot: over
  });
}

function planFadePush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = round4(opts.distance * 0.36);
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 88, blur: 1, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.35, y: axis.y * distance * 0.35, opacity: 38, blur: 3, sx: 99.6, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 5, sx: 99, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 5, sx: 100.8, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.12, y: -axis.y * distance * 0.12, opacity: 62, blur: 2, sx: 100.3, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over * 0.5, y: axis.y * over * 0.5, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over });
}

function planCoverPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = opts.distance;
  const anti = round4(anticipatePx(distance) * 0.4);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: 0, y: 0, opacity: 100, blur: 0, sx: 99.4, phase: "crossover" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 98.8, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.22, y: -axis.y * distance * 0.22, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, outgoingStays: true });
}

function planPanelPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const from = AXIS[direction] || AXIS.right;
  const distance = round4(opts.distance * 0.4);
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: from.x * anti * 0.4, y: from.y * anti * 0.4, opacity: 100, blur: 0, sx: 99.8, phase: "action" },
    { frame: phases.mid, x: -from.x * distance * 0.22, y: -from.y * distance * 0.22, opacity: 74, blur: 2, sx: 98.6, phase: "crossover" },
    { frame: phases.end, x: -from.x * distance * 0.32, y: -from.y * distance * 0.32, opacity: 64, blur: 3, sx: 97.8, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: from.x * distance, y: from.y * distance, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.mid, x: from.x * distance * 0.18, y: from.y * distance * 0.18, opacity: 100, blur: 0, sx: 100, phase: "crossover" },
    { frame: phases.settle, x: -from.x * over, y: -from.y * over, opacity: 100, blur: 0, sx: 100.1, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, {
    direction: direction,
    distance: distance,
    anticipate: anti,
    overshoot: over,
    edge: direction,
    outgoingStays: true
  });
}

function planDashboardPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = opts.distance;
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti + 3, opacity: 100, blur: 0, sx: 100.5, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.46, y: axis.y * distance * 0.46 + 8, opacity: 46, blur: 5, sx: 97.2, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance + 14, opacity: 0, blur: 10, sx: 93.5, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance - 10, opacity: 0, blur: 7, sx: 105, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.16, y: -axis.y * distance * 0.16 - 3, opacity: 74, blur: 2, sx: 101.6, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over + 1, opacity: 100, blur: 0, sx: 100.4, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, depth: true });
}

function planSplitPush(opts) {
  const fps = opts.fps;
  const phases = opts.phases;
  const direction = opts.direction;
  const axis = AXIS[direction] || AXIS.left;
  const distance = round4(opts.distance * 0.55);
  const anti = anticipatePx(distance);
  const over = overshootPx(distance, opts.overshoot);
  const outKeys = poseKeys(fps, [
    { frame: phases.start, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "anticipate" },
    { frame: phases.anticipate, x: -axis.x * anti, y: -axis.y * anti, opacity: 100, blur: 0, sx: 99.6, phase: "action" },
    { frame: phases.mid, x: axis.x * distance * 0.5, y: axis.y * distance * 0.5, opacity: 82, blur: 1, sx: 98.8, phase: "crossover" },
    { frame: phases.end, x: axis.x * distance, y: axis.y * distance, opacity: 0, blur: 4, sx: 97.5, phase: "done" }
  ]);
  const inKeys = poseKeys(fps, [
    { frame: phases.start, x: -axis.x * distance, y: -axis.y * distance, opacity: 0, blur: 4, sx: 101.2, phase: "anticipate" },
    { frame: phases.mid, x: -axis.x * distance * 0.5, y: -axis.y * distance * 0.5, opacity: 88, blur: 1, sx: 100.4, phase: "crossover" },
    { frame: phases.settle, x: axis.x * over, y: axis.y * over, opacity: 100, blur: 0, sx: 100.2, phase: "settle" },
    { frame: phases.end, x: 0, y: 0, opacity: 100, blur: 0, sx: 100, phase: "done" }
  ]);
  return pack(opts, outKeys, inKeys, { direction: direction, distance: distance, anticipate: anti, overshoot: over, split: true });
}

function plan(id, ctx) {
  if (id === "EVT_UI_PUSH_SCALE") return planScalePush(ctx);
  if (id === "EVT_UI_PUSH_DEPTH") return planDepthPush(ctx);
  if (id === "EVT_UI_PUSH_SOFT") return planSoftPush(ctx);
  if (id === "EVT_UI_PUSH_SNAP") return planSnapPush(ctx);
  if (id === "EVT_UI_PUSH_OVERSHOOT") return planOvershootPush(ctx);
  if (id === "EVT_UI_PUSH_PARALLAX") return planParallaxPush(ctx);
  if (id === "EVT_UI_PUSH_FADE") return planFadePush(ctx);
  if (id === "EVT_UI_PUSH_COVER") return planCoverPush(ctx);
  if (id === "EVT_UI_PUSH_PANEL") return planPanelPush(ctx);
  if (id === "EVT_UI_PUSH_DASHBOARD") return planDashboardPush(ctx);
  if (id === "EVT_UI_PUSH_SPLIT") return planSplitPush(ctx);
  return planDirectionalPush(ctx);
}

function isUiPushId(id) {
  return UI_PUSH_IDS.indexOf(resolveId(id)) !== -1;
}

module.exports = {
  UI_PUSH_IDS,
  IMPLEMENTED_IDS: UI_PUSH_IDS.slice(),
  ID_ALIASES,
  DISPLAY_NAMES,
  PHASE1_IDS,
  ANATOMY,
  AXIS,
  ANTICIPATE_RATIO,
  OVERSHOOT_CAP,
  PHASE_PROFILE,
  DEFAULT_GROUP_BY_ID,
  DEFAULT_OVERSHOOT_BY_ID,
  DEFAULT_DIRECTION_BY_ID,
  TRAVEL_SCALE,
  displayName,
  resolveId,
  uniqueKeys,
  keyAt,
  travelDistance,
  anticipatePx,
  overshootPx,
  phaseFrames,
  poseKeys,
  restRelativeOps,
  emptyLayer,
  plan,
  planDirectionalPush,
  planScalePush,
  planDepthPush,
  planSoftPush,
  planSnapPush,
  planOvershootPush,
  planParallaxPush,
  planFadePush,
  planCoverPush,
  planPanelPush,
  planDashboardPush,
  planSplitPush,
  isUiPushId
};
