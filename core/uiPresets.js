"use strict";

/**
 * UI Preset Pack (P1a) — Evotechly-owned in / out / both plans.
 * Capability extract only. Not a port of UI Animator Pro.
 * Numbers only. SaaS Demo Tools applies these in After Effects.
 */

const { EASE, easePair } = require("./polish");
const { normalizeDirection } = require("./direction");
const { round4, clamp, framesToSeconds } = require("./saasDemo");

const UI_PRESET_IDS = [
  "fade-up",
  "fade-scale",
  "slide-left",
  "slide-right",
  "slide-up",
  "pop"
];

const UI_PRESET_DEFAULTS = {
  duration: 0.5,
  staggerFrames: 3,
  fps: 30,
  hold: 0.2,
  ease: "apple",
  compWidth: 1920
};

const LINEAR_EASE = { influenceIn: 16, influenceOut: 16 };

/**
 * Built-in poses. Offsets are rest-relative (px). Scale is AE percent.
 * pop is 90 → 100. Slides fade while they travel.
 */
const UI_PRESETS = {
  "fade-up": { id: "fade-up", opacityFrom: 0, x: 0, y: 16, scaleFrom: 100 },
  "fade-scale": { id: "fade-scale", opacityFrom: 0, x: 0, y: 0, scaleFrom: 92 },
  "slide-left": { id: "slide-left", opacityFrom: 0, x: 24, y: 0, scaleFrom: 100 },
  "slide-right": { id: "slide-right", opacityFrom: 0, x: -24, y: 0, scaleFrom: 100 },
  "slide-up": { id: "slide-up", opacityFrom: 0, x: 0, y: 24, scaleFrom: 100 },
  pop: { id: "pop", opacityFrom: 0, x: 0, y: 0, scaleFrom: 90 }
};

function layerName(layer, index) {
  if (layer == null) return "layer-" + index;
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || ("layer-" + index);
}

function normalizeLayers(list) {
  if (!list) return [];
  if (!Array.isArray(list)) return [];
  return list.map(function (layer, i) {
    if (layer == null) return { name: "layer-" + i };
    if (typeof layer === "string") return { name: layer };
    const copy = {};
    Object.keys(layer).forEach(function (k) {
      copy[k] = layer[k];
    });
    copy.name = layerName(layer, i);
    return copy;
  });
}

function clonePose(src) {
  src = src || {};
  const scale = Array.isArray(src.scale) ? src.scale : [100, 100];
  return {
    opacity: src.opacity == null ? 100 : src.opacity,
    x: src.x || 0,
    y: src.y || 0,
    scale: [scale[0], scale[1]]
  };
}

function normalizeUiEase(kind) {
  const k = String(kind == null ? UI_PRESET_DEFAULTS.ease : kind).toLowerCase();
  if (k === "soft" || k === "linear") return k;
  return "apple";
}

function easeInfluences(kind) {
  const k = normalizeUiEase(kind);
  if (k === "linear") return { influenceIn: LINEAR_EASE.influenceIn, influenceOut: LINEAR_EASE.influenceOut };
  return easePair(k);
}

function normalizePresetId(id) {
  const raw = String(id == null ? "fade-up" : id).trim();
  const kebab = raw
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
  if (UI_PRESETS[kebab]) return kebab;
  return "fade-up";
}

function listUiPresets() {
  return UI_PRESET_IDS.slice();
}

function getUiPreset(id) {
  const presetId = normalizePresetId(id);
  const src = UI_PRESETS[presetId];
  return {
    id: src.id,
    opacityFrom: src.opacityFrom,
    x: src.x,
    y: src.y,
    scaleFrom: src.scaleFrom
  };
}

function restPose() {
  return { opacity: 100, x: 0, y: 0, scale: [100, 100] };
}

function enterPose(spec) {
  const scaleFrom = spec.scaleFrom == null ? 100 : spec.scaleFrom;
  return {
    opacity: spec.opacityFrom == null ? 0 : spec.opacityFrom,
    x: spec.x || 0,
    y: spec.y || 0,
    scale: [scaleFrom, scaleFrom]
  };
}

function layerAnchorX(layer) {
  if (!layer || typeof layer !== "object") return null;
  if (typeof layer.x === "number") return Number(layer.x);
  if (typeof layer.centerX === "number") return Number(layer.centerX);
  if (Array.isArray(layer.position) && layer.position.length) return Number(layer.position[0]) || 0;
  if (Array.isArray(layer.rest) && layer.rest.length) return Number(layer.rest[0]) || 0;
  return null;
}

function resolveCenterX(opts) {
  opts = opts || {};
  if (opts.compCenterX != null) return Number(opts.compCenterX);
  const width = opts.compWidth == null ? UI_PRESET_DEFAULTS.compWidth : opts.compWidth;
  return Number(width) / 2;
}

function shouldMirror(layer, mirror, centerX) {
  if (!mirror) return false;
  const x = layerAnchorX(layer);
  if (x == null) return false;
  return x < Number(centerX);
}

function mirrorPose(pose, mirrored) {
  const out = clonePose(pose);
  if (mirrored) out.x = -out.x;
  return out;
}

function directedPoses(enter, rest, direction) {
  const dir = normalizeDirection(direction);
  if (dir === "out") {
    return { from: clonePose(rest), to: clonePose(enter), out: null };
  }
  const poses = { from: clonePose(enter), to: clonePose(rest), out: null };
  if (dir === "both") {
    poses.out = { from: clonePose(rest), to: clonePose(enter) };
  }
  return poses;
}

function applyUiPreset(opts) {
  opts = opts || {};
  const layers = normalizeLayers(opts.layers || opts.selected || []);
  const presetId = normalizePresetId(opts.presetId);
  const spec = getUiPreset(presetId);
  const direction = normalizeDirection(opts.direction);
  const duration = round4(
    clamp(opts.duration == null ? UI_PRESET_DEFAULTS.duration : opts.duration, 0.05, 30)
  );
  const staggerFrames = Math.round(
    clamp(
      opts.staggerFrames == null ? UI_PRESET_DEFAULTS.staggerFrames : opts.staggerFrames,
      0,
      120
    )
  );
  const fps = clamp(opts.fps == null ? UI_PRESET_DEFAULTS.fps : opts.fps, 1, 120);
  const ease = normalizeUiEase(opts.ease);
  const mirror = !!opts.mirror;
  const hold = UI_PRESET_DEFAULTS.hold;
  const staggerSec = framesToSeconds(staggerFrames, fps);
  const centerX = resolveCenterX(opts);

  return {
    kind: "uiPreset",
    presetId: presetId,
    direction: direction,
    duration: duration,
    staggerFrames: staggerFrames,
    staggerSec: staggerSec,
    hold: hold,
    ease: ease,
    easeInfluences: easeInfluences(ease),
    mirror: mirror,
    compCenterX: centerX,
    layers: layers.map(function (layer, i) {
      const delay = framesToSeconds(i * staggerFrames, fps);
      const mirrored = shouldMirror(layer, mirror, centerX);
      const enter = mirrorPose(enterPose(spec), mirrored);
      const rest = restPose();
      const poses = directedPoses(enter, rest, direction);
      const item = {
        name: layer.name,
        index: i,
        delay: delay,
        delayFrames: i * staggerFrames,
        duration: duration,
        mirrored: mirrored,
        from: poses.from,
        to: poses.to,
        ease: ease
      };
      if (poses.out) {
        item.out = {
          delay: round4(delay + duration + hold),
          duration: duration,
          from: poses.out.from,
          to: poses.out.to
        };
      }
      return item;
    })
  };
}

module.exports = {
  UI_PRESET_IDS,
  UI_PRESET_DEFAULTS,
  UI_PRESETS,
  EASE,
  LINEAR_EASE,
  applyUiPreset,
  listUiPresets,
  getUiPreset,
  normalizePresetId,
  normalizeUiEase,
  easeInfluences,
  shouldMirror,
  mirrorPose,
  layerAnchorX,
  enterPose,
  restPose
};
