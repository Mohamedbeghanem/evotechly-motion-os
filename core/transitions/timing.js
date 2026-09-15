"use strict";

/**
 * Transition Kit timing groups at 30 fps.
 * Other fps values scale the 30 fps default (round to frames).
 */

const { round4, clamp } = require("../saasDemo");

const DEFAULT_FPS = 30;

const TIMING_GROUPS = {
  MICRO: { id: "MICRO", min: 4, max: 8, default: 6, feel: "Chrome, toggles, hover settle" },
  FAST: { id: "FAST", min: 8, max: 12, default: 10, feel: "Buttons, toasts, tab chrome" },
  STANDARD: { id: "STANDARD", min: 12, max: 18, default: 15, feel: "Card and screen push default" },
  SMOOTH: { id: "SMOOTH", min: 18, max: 24, default: 21, feel: "Dashboard tours, soft UI" },
  HERO: { id: "HERO", min: 24, max: 36, default: 30, feel: "Open, hold, product hero" }
};

const TIMING_GROUP_IDS = ["MICRO", "FAST", "STANDARD", "SMOOTH", "HERO"];
const DEFAULT_GROUP = "STANDARD";

function normalizeFps(fps) {
  return clamp(fps == null ? DEFAULT_FPS : fps, 1, 120);
}

function normalizeTimingGroup(group) {
  if (group == null || group === "") return DEFAULT_GROUP;
  if (typeof group === "number" && group === group) return DEFAULT_GROUP;
  const raw = String(group).trim().toUpperCase().replace(/[-\s]+/g, "_");
  if (TIMING_GROUPS[raw]) return raw;
  const compact = raw.toLowerCase();
  if (compact === "micro") return "MICRO";
  if (compact === "fast") return "FAST";
  if (compact === "standard" || compact === "std") return "STANDARD";
  if (compact === "smooth") return "SMOOTH";
  if (compact === "hero") return "HERO";
  return DEFAULT_GROUP;
}

function timingSpec(group) {
  const id = normalizeTimingGroup(group);
  const src = TIMING_GROUPS[id];
  return {
    id: src.id,
    min: src.min,
    max: src.max,
    default: src.default,
    feel: src.feel,
    fps: DEFAULT_FPS
  };
}

function durationFrames(group, fps) {
  const f = normalizeFps(fps);
  if (typeof group === "number" && group === group) {
    return Math.round(clamp(group, 1, 240));
  }
  const spec = timingSpec(group);
  return Math.round(spec.default * (f / DEFAULT_FPS));
}

function secondsFromFrames(frames, fps) {
  const f = normalizeFps(fps);
  return round4((Number(frames) || 0) / f);
}

function clampDurationFrames(frames, group, fps) {
  const spec = timingSpec(group);
  const f = normalizeFps(fps);
  const lo = Math.max(1, Math.round(spec.min * (f / DEFAULT_FPS)));
  const hi = Math.round(spec.max * (f / DEFAULT_FPS));
  return Math.round(clamp(frames == null ? spec.default * (f / DEFAULT_FPS) : frames, lo, hi));
}

module.exports = {
  TIMING_GROUPS,
  TIMING_GROUP_IDS,
  DEFAULT_GROUP,
  DEFAULT_FPS,
  normalizeFps,
  normalizeTimingGroup,
  timingSpec,
  durationFrames,
  secondsFromFrames,
  clampDurationFrames
};
