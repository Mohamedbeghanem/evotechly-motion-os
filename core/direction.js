"use strict";

/**
 * Direction semantics (evotechly.motion.engine.v1)
 *
 *   in   — default. Play preset from → to (enter / appear).
 *   out  — Reverse from/to. Play preset to → from (leave / dismiss).
 *   both — in, then an out phase that reverses the same travel.
 *
 * Unknown values fall back to in. Does not mutate the source preset.
 */

const DIRECTIONS = ["in", "out", "both"];

function normalizeDirection(dir) {
  const d = String(dir || "in").toLowerCase();
  if (d === "out" || d === "both") return d;
  return "in";
}

function clonePose(src) {
  src = src || {};
  return {
    opacity: src.opacity,
    x: src.x || 0,
    y: src.y || 0,
    scale: src.scale
  };
}

function applyDirection(animation, dir) {
  const direction = normalizeDirection(dir);
  const from = clonePose(animation.from);
  const to = clonePose(animation.to);
  const out = {
    duration: animation.duration,
    easing: animation.easing,
    from: from,
    to: to,
    direction: direction
  };
  if (direction === "out") {
    out.from = to;
    out.to = from;
  } else if (direction === "both") {
    out.out = {
      duration: animation.duration,
      easing: animation.easing,
      from: clonePose(to),
      to: clonePose(from)
    };
  }
  return out;
}

module.exports = { DIRECTIONS, normalizeDirection, applyDirection, clonePose };
