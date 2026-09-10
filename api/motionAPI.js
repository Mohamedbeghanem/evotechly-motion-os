"use strict";

const { createEngine } = require("../core/engine");
const { toAE } = require("../adapters/aeAdapter");
const { toPreview } = require("../adapters/previewAdapter");
const { parse } = require("../pipeline/figmaParser");
const { normalize } = require("../pipeline/normalizer");

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

function optionsFrom(input, options) {
  options = options || {};
  const style = options.style || (input && input.style) || "stripe";
  return { style: style };
}

function generateMotion(input, options) {
  const parsed = parse(input);
  const opts = optionsFrom(parsed, options);
  const engine = createEngine(opts);
  if (isFigma(parsed)) {
    const layers = normalize(parsed);
    return engine.run(layers, "figma");
  }
  const layers = Array.isArray(parsed) ? parsed : ((parsed && parsed.layers) || []);
  return engine.run(layers, (parsed && parsed.sourceType) || "manual");
}

function runEngine(input, options) {
  return generateMotion(input, options);
}

function exportAE(input, options) {
  return toAE(generateMotion(input, options));
}

function exportPreview(input, options) {
  const parsed = parse(input);
  const plan = generateMotion(parsed, options);
  return toPreview(plan, {
    width: parsed.width || parsed.frameWidth || 1440,
    height: parsed.height || parsed.frameHeight || 900
  });
}

module.exports = {
  generateMotion,
  runEngine,
  exportAE,
  exportPreview
};
