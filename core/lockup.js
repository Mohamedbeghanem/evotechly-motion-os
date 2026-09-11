"use strict";

/**
 * L2 Lockup — Evotechly-owned mark + type metrics.
 * PinRig-inspired only. No vendor code or binaries.
 *
 * v1: pins, optical gap, cap/x-height, baseline.
 * Applied when shot === "logoLockup". Does not change hero defaults.
 */

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function typeMetrics(layer) {
  const h = Number(layer && layer.height) || 48;
  const w = Number(layer && layer.width) || h;
  const y = Number(layer && layer.y) || 0;
  const x = Number(layer && layer.x) || 0;
  return {
    x: x,
    y: y,
    width: w,
    height: h,
    capHeight: round4(h * 0.72),
    xHeight: round4(h * 0.52),
    baseline: round4(y + h * 0.82),
    trackingHint: round4(Math.max(0, w / Math.max(h, 1) - 3) * 0.012)
  };
}

function pinSet(mark, word) {
  const m = typeMetrics(mark || {});
  const t = typeMetrics(word || mark || {});
  const markRight = m.x + m.width;
  const gap = word ? (t.x - markRight) : m.height * 0.28;
  return {
    markCenter: { x: round4(m.x + m.width / 2), y: round4(m.y + m.height / 2) },
    opticalGap: round4(Math.max(8, gap)),
    baseline: t.baseline,
    capHeight: t.capHeight,
    xHeight: t.xHeight,
    align: "left"
  };
}

function findPart(plan, role) {
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].role === role) return plan[i];
  }
  return null;
}

function applyLockup(plan, shot) {
  if (shot !== "logoLockup" || !plan || !plan.length) {
    return { applied: false, pins: null };
  }
  const mark = findPart(plan, "logo");
  const word = findPart(plan, "title") || findPart(plan, "subtitle");
  const pins = pinSet(mark, word);

  let markCount = 0;
  let typeCount = 0;
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    if (p.role === "logo") {
      p.delay = round4(0.02 + markCount * 0.05);
      p.lockup = { part: "mark", pins: pins };
      markCount += 1;
    } else if (p.role === "title" || p.role === "subtitle" || p.role === "eyebrow") {
      p.delay = round4(0.16 + typeCount * 0.08);
      p.lockup = { part: "type", pins: pins };
      typeCount += 1;
    }
  }

  return {
    applied: true,
    pins: pins,
    marks: markCount,
    type: typeCount
  };
}

module.exports = { typeMetrics, pinSet, applyLockup };
