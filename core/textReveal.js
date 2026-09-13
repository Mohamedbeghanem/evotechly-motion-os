"use strict";

/**
 * P1b — Flowing + coloured text reveal.
 * Deterministic plans. Native AE text animators / fills only.
 * Numbers only. The companion JSX applies these in After Effects.
 * No vendor code. Not a Solair port.
 */

const { EASE, easePair } = require("./polish");
const { normalizeDirection } = require("./direction");

const FLOWING = {
  animator: "EVO_FLOW",
  duration: 0.8,
  travel: 12,
  hold: 0.2,
  ease: "apple",
  unit: "char",
  direction: "in",
  shape: "rampUp",
  shapeValue: 2,
  matchName: "ADBE Text Animator",
  opacity: "ADBE Text Opacity",
  position: "ADBE Text Position 3D",
  positionFallback: "ADBE Text Position"
};

const COLOURED = {
  animator: "EVO_COLOUR",
  duration: 0.6,
  colorHex: "#FF6A00",
  mode: "fill",
  strokeWidth: 2,
  unit: "char",
  matchName: "ADBE Text Animator",
  fill: "ADBE Text Fill Color",
  stroke: "ADBE Text Stroke Color",
  strokeWidthMatch: "ADBE Text Stroke Width"
};

const UNITS = {
  char: 1,
  word: 3,
  line: 4
};

const MODES = ["fill", "stroke", "both"];

const LINEAR_EASE = { influenceIn: 16, influenceOut: 16 };

function round4(n) {
  return Math.round(Number(n) * 10000) / 10000;
}

function clamp(n, lo, hi) {
  const x = Number(n);
  if (x !== x) return lo;
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

function layerName(layer, index) {
  if (layer == null) return "layer-" + (index == null ? 0 : index);
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || ("layer-" + (index == null ? 0 : index));
}

function normalizeEase(kind) {
  if (kind === "soft" || kind === "linear") return kind;
  return "apple";
}

function easeInfluences(kind) {
  const e = normalizeEase(kind);
  if (e === "linear") return { influenceIn: LINEAR_EASE.influenceIn, influenceOut: LINEAR_EASE.influenceOut };
  return easePair(e);
}

function normalizeUnit(unit) {
  const u = String(unit == null ? FLOWING.unit : unit).toLowerCase();
  if (u === "word" || u === "words") return "word";
  if (u === "line" || u === "lines") return "line";
  return "char";
}

function rangeBasedOn(unit) {
  return UNITS[normalizeUnit(unit)];
}

function normalizeMode(mode) {
  const m = String(mode == null ? COLOURED.mode : mode).toLowerCase();
  if (m === "stroke" || m === "both") return m;
  return "fill";
}

function normalizeHex(hex) {
  let s = String(hex == null ? "" : hex).trim().replace(/^#/, "").toUpperCase();
  if (/^[0-9A-F]{3}$/.test(s)) {
    s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  }
  if (!/^[0-9A-F]{6}$/.test(s)) s = COLOURED.colorHex.slice(1);
  return "#" + s;
}

function hexToRgb(hex) {
  const s = normalizeHex(hex).slice(1);
  return [
    round4(parseInt(s.slice(0, 2), 16) / 255),
    round4(parseInt(s.slice(2, 4), 16) / 255),
    round4(parseInt(s.slice(4, 6), 16) / 255)
  ];
}

function durationOf(value, fallback) {
  return round4(clamp(value == null ? fallback : value, 0.05, 30));
}

function endKeys(direction, duration, hold) {
  const dur = durationOf(duration, FLOWING.duration);
  const gap = round4(clamp(hold == null ? FLOWING.hold : hold, 0, 8));
  const dir = normalizeDirection(direction);
  if (dir === "out") {
    return [
      { t: 0, end: 0 },
      { t: dur, end: 100 }
    ];
  }
  const keys = [
    { t: 0, end: 100 },
    { t: dur, end: 0 }
  ];
  if (dir === "both") {
    keys.push({ t: round4(dur + gap), end: 0 });
    keys.push({ t: round4(dur + gap + dur), end: 100 });
  }
  return keys;
}

function colourEndKeys(duration) {
  const dur = durationOf(duration, COLOURED.duration);
  return [
    { t: 0, end: 0 },
    { t: dur, end: 100 }
  ];
}

function flowingText(opts) {
  opts = opts || {};
  const unit = normalizeUnit(opts.unit);
  const duration = durationOf(opts.duration, FLOWING.duration);
  const ease = normalizeEase(opts.ease);
  const direction = normalizeDirection(opts.direction);
  const name = layerName(opts.layer, 0);
  const keys = endKeys(direction, duration, FLOWING.hold);

  return {
    kind: "flowingText",
    note: "Native AE text animator. Range selector + opacity/position. No vendor presets.",
    layer: name,
    unit: unit,
    basedOn: rangeBasedOn(unit),
    duration: duration,
    ease: ease,
    easeInfluences: easeInfluences(ease),
    direction: direction,
    hold: direction === "both" ? FLOWING.hold : 0,
    animator: {
      name: FLOWING.animator,
      matchName: FLOWING.matchName,
      shape: FLOWING.shape,
      shapeValue: FLOWING.shapeValue,
      selector: {
        basedOn: unit,
        basedOnValue: rangeBasedOn(unit),
        endKeys: keys
      },
      properties: [
        { matchName: FLOWING.opacity, value: 0 },
        { matchName: FLOWING.position, fallback: FLOWING.positionFallback, value: [0, FLOWING.travel, 0] }
      ]
    }
  };
}

function colouredReveal(opts) {
  opts = opts || {};
  const mode = normalizeMode(opts.mode);
  const duration = durationOf(opts.duration, COLOURED.duration);
  const colorHex = normalizeHex(opts.colorHex);
  const colorRgb = hexToRgb(colorHex);
  const name = layerName(opts.layer, 0);
  const keys = colourEndKeys(duration);
  const properties = [];

  if (mode === "fill" || mode === "both") {
    properties.push({ matchName: COLOURED.fill, value: colorRgb.slice() });
  }
  if (mode === "stroke" || mode === "both") {
    properties.push({ matchName: COLOURED.stroke, value: colorRgb.slice() });
    properties.push({ matchName: COLOURED.strokeWidthMatch, value: COLOURED.strokeWidth });
  }

  return {
    kind: "colouredReveal",
    note: "Native AE text fill / stroke via text animator. No vendor presets.",
    layer: name,
    colorHex: colorHex,
    colorRgb: colorRgb,
    duration: duration,
    mode: mode,
    enableStroke: mode !== "fill",
    strokeWidth: mode === "fill" ? 0 : COLOURED.strokeWidth,
    animator: {
      name: COLOURED.animator,
      matchName: COLOURED.matchName,
      selector: {
        basedOn: COLOURED.unit,
        basedOnValue: rangeBasedOn(COLOURED.unit),
        endKeys: keys
      },
      properties: properties
    }
  };
}

module.exports = {
  FLOWING,
  COLOURED,
  UNITS,
  MODES,
  EASE,
  round4,
  clamp,
  layerName,
  normalizeEase,
  easeInfluences,
  normalizeUnit,
  rangeBasedOn,
  normalizeMode,
  normalizeHex,
  hexToRgb,
  durationOf,
  endKeys,
  colourEndKeys,
  flowingText,
  colouredReveal
};
