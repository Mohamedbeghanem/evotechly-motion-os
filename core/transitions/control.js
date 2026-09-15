"use strict";

/**
 * Plan for shy null EVOTECHLY_TRANSITION_CONTROL.
 * JSX wires Slider Control effects. Easing is metadata (slider index → id).
 */

const { EASING_IDS, DEFAULT_EASE, easeIndex, easeFromIndex, normalizeEase } = require("./easing");
const { DEFAULT_GROUP, durationFrames } = require("./timing");

const CONTROL_NAME = "EVOTECHLY_TRANSITION_CONTROL";

const CONTROL_SLIDERS = [
  { name: "Progress", value: 0, min: 0, max: 100, unit: "percent", note: "Reserved. Phase 1 keys are time-based." },
  { name: "Duration", value: 15, min: 4, max: 36, unit: "frames", note: "At 30 fps unless fps override." },
  { name: "Direction", value: 0, min: 0, max: 3, unit: "enum", note: "0 left · 1 right · 2 up · 3 down" },
  { name: "Strength", value: 100, min: 0, max: 200, unit: "percent" },
  { name: "Distance", value: 100, min: 0, max: 200, unit: "percent", note: "Percent of axis travel (comp W/H)." },
  { name: "Scale", value: 100, min: 50, max: 150, unit: "percent" },
  { name: "TargetScale", value: 100, min: 50, max: 250, unit: "percent" },
  { name: "Blur", value: 0, min: 0, max: 32, unit: "px" },
  { name: "Overshoot", value: 6, min: 0, max: 24, unit: "percent" },
  { name: "Depth", value: 50, min: 0, max: 100, unit: "percent" },
  { name: "Opacity", value: 100, min: 0, max: 100, unit: "percent" },
  { name: "CornerRadius", value: 12, min: 0, max: 64, unit: "px" },
  { name: "MaskExpansion", value: 0, min: -64, max: 64, unit: "px" },
  { name: "Stagger", value: 3, min: 0, max: 24, unit: "frames" },
  { name: "Settle", value: 20, min: 0, max: 40, unit: "percent", note: "Share of duration used to settle." },
  { name: "Easing", value: 0, min: 0, max: 5, unit: "enum", note: "Index into EASING_IDS. Not a curve plugin." }
];

const DIRECTION_ENUM = ["left", "right", "up", "down"];

function sliderMap(list) {
  const out = {};
  list.forEach(function (s) {
    out[s.name] = s.value;
  });
  return out;
}

function mergeSliders(overrides) {
  const extras = overrides || {};
  return CONTROL_SLIDERS.map(function (src) {
    const copy = {
      name: src.name,
      value: src.value,
      min: src.min,
      max: src.max,
      unit: src.unit
    };
    if (src.note) copy.note = src.note;
    if (extras[src.name] != null) copy.value = extras[src.name];
    return copy;
  });
}

function planTransitionControl(opts) {
  opts = opts || {};
  const easeId = normalizeEase(opts.ease || opts.easing || DEFAULT_EASE);
  const frames = opts.durationFrames != null ? opts.durationFrames : durationFrames(opts.group || DEFAULT_GROUP, opts.fps);
  const extras = Object.assign({}, opts.sliders || {});
  if (opts.durationFrames != null || opts.group) extras.Duration = frames;
  if (opts.direction != null) {
    const d = String(opts.direction).toLowerCase();
    const idx = DIRECTION_ENUM.indexOf(d);
    extras.Direction = idx === -1 ? Number(opts.direction) || 0 : idx;
  }
  extras.Easing = easeIndex(easeId);
  const sliders = mergeSliders(extras);

  return {
    kind: "transitionControl",
    name: CONTROL_NAME,
    shy: true,
    guide: true,
    comment: "Evotechly Transition Kit — shy control null. Slider Control effects in JSX.",
    sliders: sliders,
    values: sliderMap(sliders),
    easing: {
      id: easeId,
      index: easeIndex(easeId),
      ids: EASING_IDS.slice(),
      fromIndex: easeFromIndex
    },
    directionEnum: DIRECTION_ENUM.slice(),
    note: "Easing is metadata. JSX maps the Easing slider index to EASING_IDS. No pseudo-effect plugin."
  };
}

module.exports = {
  CONTROL_NAME,
  CONTROL_SLIDERS,
  DIRECTION_ENUM,
  planTransitionControl
};
