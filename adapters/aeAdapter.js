"use strict";

const EASING_AE = {
  expoOut: "smoothSaaSPremium",
  cubicInOut: "easeInOutCubic",
  expoOutSoft: "softExpoFlow",
  sharpOut: "sharpProductReveal"
};

function pct(v, fallback) {
  if (v === undefined || v === null) return fallback;
  if (v <= 1) return Math.round(v * 100);
  return Math.round(v);
}

function yOf(obj) {
  if (!obj) return 0;
  if (obj.positionY !== undefined && obj.positionY !== null) return obj.positionY;
  return obj.y || 0;
}

function toAE(plan) {
  const layers = (plan && plan.layers) || [];
  const out = [];
  for (let i = 0; i < layers.length; i++) {
    const m = layers[i];
    const a = m.animation || {};
    const from = a.from || {};
    const to = a.to || {};
    const delay = m.delay || 0;
    const duration = a.duration || 0.55;
    const y0 = yOf(from);
    const y1 = yOf(to);
    const op0 = pct(from.opacity, 0);
    const op1 = pct(to.opacity, 100);
    const s0 = pct(from.scale, 100);
    const s1 = pct(to.scale, 100);
    const name = m.layer;
    out.push({
      layer: name,
      name: name,
      type: m.type,
      preset: m.preset,
      delay: delay,
      duration: duration,
      easing: a.easing,
      easingAE: a.easingAE || EASING_AE[a.easing] || "smoothSaaSPremium",
      from: { opacity: op0, y: y0, positionY: y0, scale: [s0, s0] },
      to: { opacity: op1, y: y1, positionY: y1, scale: [s1, s1] },
      keyframes: [
        { t: delay, opacity: op0, positionY: y0, scale: [s0, s0] },
        { t: Math.round((delay + duration) * 10000) / 10000, opacity: op1, positionY: y1, scale: [s1, s1] }
      ]
    });
  }
  return {
    schema: "evotechly.motion.ae.v1",
    sourceType: plan && plan.sourceType,
    style: plan && plan.style,
    layers: out
  };
}

module.exports = { toAE, EASING_AE };
