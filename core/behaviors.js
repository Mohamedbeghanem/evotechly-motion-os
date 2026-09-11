"use strict";

const { detectRole } = require("./roles");

const DEFAULT_BEHAVIORS = {
  text: { preset: "fadeUp", stagger: 0.08, durationScale: 1 },
  card: { preset: "scaleIn", stagger: 0.06, durationScale: 1 },
  image: { preset: "zoomOut", stagger: 0.1, durationScale: 1 },
  dashboard: { preset: "slideUp", stagger: 0.05, durationScale: 1 },
  button: { preset: "scaleIn", stagger: 0.04, durationScale: 0.84 },
  cta: { preset: "pop", stagger: 0.04, durationScale: 0.8 },
  modal: { preset: "uiModal", stagger: 0, durationScale: 1 },
  toast: { preset: "uiToast", stagger: 0.04, durationScale: 1 },
  row: { preset: "uiRow", stagger: 0.05, durationScale: 1 },
  stack: { preset: "uiStack", stagger: 0.05, durationScale: 1 },
  nav: { preset: "uiNav", stagger: 0.03, durationScale: 0.8 }
};

function detectType(layer) {
  return detectRole(layer);
}

function behaviorFor(type, table) {
  const map = table || DEFAULT_BEHAVIORS;
  const b = map[type] || map.card || DEFAULT_BEHAVIORS.card;
  return { preset: b.preset, stagger: b.stagger, durationScale: b.durationScale };
}

function mergeBehaviors(extra) {
  const out = {};
  Object.keys(DEFAULT_BEHAVIORS).forEach(function (k) {
    const b = DEFAULT_BEHAVIORS[k];
    out[k] = { preset: b.preset, stagger: b.stagger, durationScale: b.durationScale };
  });
  if (extra) {
    Object.keys(extra).forEach(function (k) {
      const b = extra[k];
      out[k] = { preset: b.preset, stagger: b.stagger, durationScale: b.durationScale };
    });
  }
  return out;
}

module.exports = { detectType, behaviorFor, DEFAULT_BEHAVIORS, mergeBehaviors };
