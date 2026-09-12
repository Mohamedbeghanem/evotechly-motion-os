"use strict";

/**
 * Selection Auto-Animate vocabulary.
 * JSX writes keyframes. Expression Mode is v0.9.
 */

const DIRECTIONS = {
  up: { x: 0, y: 28, s: 100 },
  down: { x: 0, y: -28, s: 100 },
  left: { x: 28, y: 0, s: 100 },
  right: { x: -28, y: 0, s: 100 },
  upLeft: { x: 20, y: 20, s: 100 },
  upRight: { x: -20, y: 20, s: 100 },
  downLeft: { x: 20, y: -20, s: 100 },
  downRight: { x: -20, y: -20, s: 100 },
  scale: { x: 0, y: 0, s: 92 }
};

const EASING = {
  apple: { influenceIn: 80, influenceOut: 18 },
  soft: { influenceIn: 40, influenceOut: 40 },
  expo: { influenceIn: 90, influenceOut: 10 },
  spring: { influenceIn: 80, influenceOut: 18, expression: true }
};

const DEFAULTS = {
  duration: 0.42,
  stagger: 0.06,
  travel: 1,
  mode: "keyframes"
};

const SEQUENCES = ["index", "topToBottom", "bottomToTop"];
const MODES = ["in", "out", "both"];

function offsetFor(dir, travel) {
  const d = DIRECTIONS[dir] || DIRECTIONS.up;
  const t = travel == null ? 1 : Number(travel);
  return {
    x: Math.round(d.x * t * 10000) / 10000,
    y: Math.round(d.y * t * 10000) / 10000,
    s: d.s
  };
}

function sortLayers(items, sequence) {
  const list = items.slice();
  if (sequence === "topToBottom") {
    list.sort(function (a, b) { return (a.y || 0) - (b.y || 0); });
  } else if (sequence === "bottomToTop") {
    list.sort(function (a, b) { return (b.y || 0) - (a.y || 0); });
  }
  return list;
}

function planAutoAnimate(items, options) {
  options = options || {};
  const dir = options.direction || "up";
  const mode = MODES.indexOf(options.mode) !== -1 ? options.mode : "in";
  const sequence = SEQUENCES.indexOf(options.sequence) !== -1 ? options.sequence : "index";
  const easing = EASING[options.easing] ? options.easing : "apple";
  const duration = options.duration != null ? Number(options.duration) : DEFAULTS.duration;
  const stagger = options.stagger != null ? Number(options.stagger) : DEFAULTS.stagger;
  const travel = options.travel != null ? Number(options.travel) : DEFAULTS.travel;
  const off = offsetFor(dir, travel);
  const sorted = sortLayers(items || [], sequence);
  return sorted.map(function (item, i) {
    return {
      name: item.name,
      delay: Math.round(i * stagger * 10000) / 10000,
      duration: duration,
      mode: mode,
      direction: dir,
      easing: easing,
      from: { o: 0, x: off.x, y: off.y, s: off.s },
      to: { o: 100, x: 0, y: 0, s: 100 }
    };
  });
}

module.exports = {
  DIRECTIONS,
  EASING,
  DEFAULTS,
  SEQUENCES,
  MODES,
  offsetFor,
  sortLayers,
  planAutoAnimate
};
