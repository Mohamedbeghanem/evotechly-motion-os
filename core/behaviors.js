"use strict";

const DEFAULT_BEHAVIORS = {
  text: { preset: "fadeUp", stagger: 0.08, durationScale: 1 },
  card: { preset: "scaleIn", stagger: 0.06, durationScale: 1 },
  image: { preset: "zoomIn", stagger: 0.1, durationScale: 1 },
  dashboard: { preset: "slideUp", stagger: 0.05, durationScale: 1 },
  button: { preset: "scaleIn", stagger: 0.04, durationScale: 0.84 },
  cta: { preset: "scaleIn", stagger: 0.04, durationScale: 0.8 }
};

function detectType(layer) {
  const t = String((layer && layer.type) || "").toLowerCase();
  const n = String((layer && layer.name) || "").toLowerCase();
  if (t === "cta" || n.indexOf("cta") !== -1) return "cta";
  if (t === "button" || n.indexOf("button") !== -1) return "button";
  if (t === "dashboard" || n.indexOf("dashboard") !== -1) return "dashboard";
  if (t === "image" || n.indexOf("image") !== -1 || n.indexOf("screenshot") !== -1) return "image";
  if (t === "card" || n.indexOf("card") !== -1) return "card";
  if (t === "text" || n.indexOf("title") !== -1 || n.indexOf("heading") !== -1) return "text";
  if (DEFAULT_BEHAVIORS[t]) return t;
  return "card";
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
