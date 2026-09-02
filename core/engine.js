"use strict";

const { resolveMotion } = require("./resolver");
const { PRESETS, mergePresets } = require("./presets");
const { mergeBehaviors } = require("./behaviors");

function createEngine(config) {
  config = config || {};
  const presets = mergePresets(PRESETS, config.presets || null);
  const behaviors = mergeBehaviors(config.behaviors || null);

  function run(layers, sourceType) {
    const list = Array.isArray(layers) ? layers : [];
    const ctx = { presets: presets, behaviors: behaviors };
    const plan = [];
    for (let i = 0; i < list.length; i++) {
      plan.push(resolveMotion(list[i], i, ctx));
    }
    return {
      schema: "evotechly.motion.engine.v1",
      sourceType: sourceType || "manual",
      style: config.style || "stripe",
      layers: plan
    };
  }

  function runMotion(layers) {
    return run(layers, "manual").layers;
  }

  return { run: run, runMotion: runMotion };
}

function runMotion(layers) {
  if (!Array.isArray(layers)) throw new Error("runMotion(layers) expects an array");
  const plan = [];
  for (let i = 0; i < layers.length; i++) plan.push(resolveMotion(layers[i], i));
  return plan;
}

module.exports = { createEngine, runMotion };
