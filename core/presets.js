"use strict";

const PRESETS = {
  fadeUp: {
    duration: 0.55,
    easing: "expoOut",
    from: { opacity: 0, y: 16, scale: 1 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  scaleIn: {
    duration: 0.5,
    easing: "expoOut",
    from: { opacity: 0, y: 0, scale: 0.96 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  slideUp: {
    duration: 0.6,
    easing: "expoOut",
    from: { opacity: 0, y: 28, scale: 1 },
    to: { opacity: 1, y: 0, scale: 1 }
  },
  zoomIn: {
    duration: 0.9,
    easing: "cubicInOut",
    from: { opacity: 0, y: 0, scale: 1.08 },
    to: { opacity: 1, y: 0, scale: 1 }
  }
};

function clonePreset(src) {
  return {
    duration: src.duration,
    easing: src.easing,
    from: { opacity: src.from.opacity, y: src.from.y, scale: src.from.scale },
    to: { opacity: src.to.opacity, y: src.to.y, scale: src.to.scale }
  };
}

function getPreset(id, table) {
  const src = (table && table[id]) || PRESETS[id] || PRESETS.fadeUp;
  return clonePreset(src);
}

function mergePresets(base, extra) {
  const out = {};
  const src = base || PRESETS;
  Object.keys(src).forEach(function (k) { out[k] = clonePreset(src[k]); });
  if (extra) Object.keys(extra).forEach(function (k) { out[k] = clonePreset(extra[k]); });
  return out;
}

module.exports = { PRESETS, getPreset, clonePreset, mergePresets };
