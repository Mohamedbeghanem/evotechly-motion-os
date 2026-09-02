"use strict";

const { getPreset } = require("./presets");
const { detectType, behaviorFor } = require("./behaviors");

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function resolveMotion(layer, index, ctx) {
  ctx = ctx || {};
  const type = detectType(layer);
  const behavior = behaviorFor(type, ctx.behaviors);
  const animation = getPreset(behavior.preset, ctx.presets);
  animation.duration = round4(animation.duration * behavior.durationScale);
  const delay = round4(index * behavior.stagger);
  return {
    layer: (layer && (layer.name || layer.id)) || ("layer-" + index),
    type: type,
    preset: behavior.preset,
    animation: animation,
    delay: delay
  };
}

module.exports = { resolveMotion };
