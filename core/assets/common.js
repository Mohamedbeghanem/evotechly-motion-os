"use strict";

/**
 * Shared helpers for EvotechlyNative P1 plans.
 * Node is source of truth. JSX mirrors apply numbers.
 */

const { round4, clamp } = require("../saasDemo");
const { normalizeEase, easeInfluences, DEFAULT_EASE } = require("../transitions/easing");
const { durationFrames, secondsFromFrames, DEFAULT_FPS, normalizeFps, normalizeTimingGroup } = require("../transitions/timing");

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
  return String(id || "")
    .trim()
    .toUpperCase()
    .replace(/[-\s]+/g, "_");
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

function phaseFrames(durationFramesValue) {
  const d = Math.max(2, Number(durationFramesValue) || 15);
  const mid = Math.max(1, Math.round(d * 0.45));
  const settle = Math.max(mid + 1, Math.round(d * 0.78));
  return {
    start: 0,
    mid: Math.min(mid, d - 1),
    settle: Math.min(settle, d - 1),
    end: d
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
        tracking: pose.tracking == null ? null : round4(pose.tracking),
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

function resolveTiming(opts, defaultGroup, defaultEase) {
  opts = opts || {};
  const fps = normalizeFps(opts.fps || (opts.comp && opts.comp.fps) || DEFAULT_FPS);
  const group = normalizeTimingGroup(opts.group || opts.duration || defaultGroup || "STANDARD");
  const frames = opts.durationFrames != null ? Math.round(clamp(opts.durationFrames, 2, 240)) : durationFrames(group, fps);
  const ease = normalizeEase(opts.ease || defaultEase || DEFAULT_EASE);
  return {
    fps: fps,
    group: group,
    frames: frames,
    durationSec: secondsFromFrames(frames, fps),
    ease: ease,
    easeInfluences: easeInfluences(ease),
    phases: phaseFrames(frames),
    comp: {
      w: Number((opts.comp && (opts.comp.w || opts.comp.width)) || DEFAULT_COMP.w),
      h: Number((opts.comp && (opts.comp.h || opts.comp.height)) || DEFAULT_COMP.h),
      fps: fps
    }
  };
}

function wrapPlan(kind, id, timing, extra) {
  extra = extra || {};
  return Object.assign(
    {
      kind: kind,
      id: id,
      style: STYLE,
      sourceType: "native",
      commercialUse: true,
      implemented: true,
      fps: timing.fps,
      durationFrames: timing.frames,
      durationSec: timing.durationSec,
      group: timing.group,
      ease: timing.ease,
      easeInfluences: timing.easeInfluences,
      phases: timing.phases,
      undo: "Evotechly Asset · " + id,
      note: "Native AE keyframes. Node plan is source of truth. JSX mirrors P1 IDs. No vendor packs."
    },
    extra
  );
}

function nativeRegistryRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    folder: row.folder,
    sourceType: "native",
    owner: "Evotechly",
    commercialUse: true,
    redistributionAllowed: true,
    license: "MIT (Evotechly Motion OS)",
    licenseUrl: "LICENSE",
    licenseVerified: true,
    status: "OWNED",
    transitionKitId: row.transitionKitId || null,
    transitionKitPath: row.transitionKitPath,
    catalogPath: row.catalogPath || "Evotechly-SaaS-Assets/Metadata/asset-registry.json",
    implemented: row.implemented !== false,
    files: [],
    downloaded: false,
    notes: row.notes
  };
}

module.exports = {
  STYLE,
  DEFAULT_COMP,
  round4,
  clamp,
  layerName,
  layerRest,
  normalizeId,
  uniqueKeys,
  keyAt,
  phaseFrames,
  poseKeys,
  restRelativeOps,
  resolveTiming,
  wrapPlan,
  nativeRegistryRow,
  secondsFromFrames
};
