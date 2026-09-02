"use strict";

const { createEngine } = require("../core/engine");
const { toAE } = require("../adapters/aeAdapter");
const { parse } = require("../pipeline/figmaParser");
const { normalize } = require("../pipeline/normalizer");

const defaultEngine = createEngine();

function isFigma(input) {
  if (Array.isArray(input)) return true;
  if (!input || typeof input !== "object") return false;
  return Boolean(
    input.frames ||
    input.frameName ||
    input.layers ||
    input.schema === "evotechly.motion.design.v1"
  );
}

function generateMotion(input) {
  const parsed = parse(input);
  if (isFigma(parsed)) {
    const layers = normalize(parsed);
    return defaultEngine.run(layers, "figma");
  }
  const layers = Array.isArray(parsed) ? parsed : ((parsed && parsed.layers) || []);
  return defaultEngine.run(layers, (parsed && parsed.sourceType) || "manual");
}

function runEngine(input) {
  return generateMotion(input);
}

function exportAE(input) {
  return toAE(generateMotion(input));
}

module.exports = {
  generateMotion,
  runEngine,
  exportAE
};
