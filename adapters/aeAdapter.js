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

function poseKeys(from, to, delay, duration) {
  const x0 = axis(from, "x");
  const x1 = axis(to, "x");
  const y0 = axis(from, "y");
  const y1 = axis(to, "y");
  const op0 = pct(from.opacity, 0);
  const op1 = pct(to.opacity, 100);
  const s0 = pct(from.scale, 100);
  const s1 = pct(to.scale, 100);
  return {
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
  };
}

function toAE(plan) {
  const layers = (plan && plan.layers) || [];
  const out = [];
  for (let i = 0; i < layers.length; i++) {
    const m = layers[i];
    const a = m.animation || {};
    const delay = m.delay || 0;
    const duration = a.duration || 0.55;
    const posed = poseKeys(a.from || {}, a.to || {}, delay, duration);
    const keyframes = posed.keyframes.slice();
    if (a.out) {
      const tOut = Math.round((delay + duration) * 10000) / 10000;
      const outPose = poseKeys(a.out.from || {}, a.out.to || {}, tOut, a.out.duration || duration);
      keyframes.push(outPose.keyframes[1]);
    }
    const name = m.layer || m.name;
    out.push({
      layer: name,
      name: name,
      type: m.role || m.type,
      role: m.role || m.type,
      preset: m.preset,
      direction: m.direction || (plan && plan.direction) || "in",
      delay: delay,
      duration: duration,
      easing: a.easing,
      easingAE: a.easingAE || EASING_AE[a.easing] || "easeOut",
      from: posed.from,
      to: posed.to,
      lockup: m.lockup || null,
      keyframes: keyframes
    });
  }
  const result = {
    schema: "evotechly.motion.ae.v1",
    sourceType: plan && plan.sourceType,
    style: plan && plan.style,
    direction: plan && plan.direction,
    shot: plan && plan.shot,
    duration: plan && plan.duration,
    layers: out
  };
  if (plan && plan.lockup && plan.lockup.applied) result.lockup = plan.lockup;
  return result;
}

module.exports = { toAE, EASING_AE };
