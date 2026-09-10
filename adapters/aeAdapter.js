"use strict";

const EASING_AE = {
  expoOut: "easeOut",
  expoOutSoft: "easeOut",
  cubicInOut: "easeInOut",
  backOut: "easeOut",
  sharpOut: "easeOut"
};

function pct(v, fallback) {
  if (v === undefined || v === null) return fallback;
  if (v <= 1) return Math.round(v * 100);
  return Math.round(v);
}

function axis(obj, key) {
  if (!obj) return 0;
  if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  return 0;
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
    const x0 = axis(from, "x");
    const x1 = axis(to, "x");
    const y0 = axis(from, "y");
    const y1 = axis(to, "y");
    const op0 = pct(from.opacity, 0);
    const op1 = pct(to.opacity, 100);
    const s0 = pct(from.scale, 100);
    const s1 = pct(to.scale, 100);
    const name = m.layer || m.name;
    out.push({
      layer: name,
      name: name,
      type: m.role || m.type,
      role: m.role || m.type,
      preset: m.preset,
      delay: delay,
      duration: duration,
      easing: a.easing,
      easingAE: a.easingAE || EASING_AE[a.easing] || "easeOut",
      from: {
        opacity: op0,
        x: x0,
        y: y0,
        positionX: x0,
        positionY: y0,
        scale: [s0, s0]
      },
      to: {
        opacity: op1,
        x: x1,
        y: y1,
        positionX: x1,
        positionY: y1,
        scale: [s1, s1]
      },
      keyframes: [
        {
          t: delay,
          opacity: op0,
          positionX: x0,
          positionY: y0,
          scale: [s0, s0]
        },
        {
          t: Math.round((delay + duration) * 10000) / 10000,
          opacity: op1,
          positionX: x1,
          positionY: y1,
          scale: [s1, s1]
        }
      ]
    });
  }
  return {
    schema: "evotechly.motion.ae.v1",
    sourceType: plan && plan.sourceType,
    style: plan && plan.style,
    duration: plan && plan.duration,
    layers: out
  };
}

module.exports = { toAE, EASING_AE };
