"use strict";

/**
 * L2 Lockup — Evotechly-owned mark + type metrics.
 * PinRig-inspired only. No vendor code or binaries.
 *
 * v1: pins, optical gap, cap/x-height, baseline, guide list.
 * Applied when shot === "logoLockup" or "logoSting". Hero is untouched.
 */

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function lower(s) {
  return String(s || "").toLowerCase();
}

function isLockupSkip(name) {
  const n = lower(name);
  return n.indexOf("evo_skip") !== -1 || n.indexOf("evo_lockup") !== -1;
}

function lockupPart(layer) {
  const n = lower((layer && (layer.name || layer.layer)) || "");
  const role = lower((layer && layer.role) || "");
  if (n.indexOf("wordmark") !== -1) return "type";
  if (n.indexOf("logo") !== -1 || n.indexOf("mark") !== -1 || n.indexOf("icon") !== -1) {
    return "mark";
  }
  if (role === "logo") return "mark";
  if (role === "title" || role === "subtitle" || role === "eyebrow") return "type";
  return null;
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
    gapX: round4(markRight + Math.max(8, gap)),
    baseline: t.baseline,
    capHeight: t.capHeight,
    capY: round4(t.baseline - t.capHeight),
    xHeight: t.xHeight,
    xHeightY: round4(t.baseline - t.xHeight),
    align: "left"
  };
}

function guidesFromPins(pins) {
  if (!pins) return [];
  return [
    { id: "markCenter", axis: "point", x: pins.markCenter.x, y: pins.markCenter.y },
    { id: "opticalGap", axis: "x", x: pins.gapX },
    { id: "baseline", axis: "y", y: pins.baseline },
    { id: "capHeight", axis: "y", y: pins.capY },
    { id: "xHeight", axis: "y", y: pins.xHeightY }
  ];
}

function findPart(plan, part) {
  let fallback = null;
  for (let i = 0; i < plan.length; i++) {
    if (lockupPart(plan[i]) === part) {
      const n = lower(plan[i].name || plan[i].layer);
      if (part === "type" && n.indexOf("wordmark") !== -1) return plan[i];
      if (part === "mark" && n.indexOf("logo") !== -1) return plan[i];
      if (!fallback) fallback = plan[i];
    }
  }
  return fallback;
}

function applyLockup(plan, shot) {
  if ((shot !== "logoLockup" && shot !== "logoSting") || !plan || !plan.length) {
    return { applied: false, pins: null, guides: [] };
  }
  const mark = findPart(plan, "mark");
  const word = findPart(plan, "type");
  const pins = pinSet(mark, word);
  const guides = guidesFromPins(pins);

  let markCount = 0;
  let typeCount = 0;
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    const part = lockupPart(p);
    if (part === "mark") {
      p.delay = round4((shot === "logoSting" ? 0 : 0.02) + markCount * (shot === "logoSting" ? 0.03 : 0.05));
      p.lockup = { part: "mark", pins: pins };
      markCount += 1;
    } else if (part === "type") {
      p.delay = round4((shot === "logoSting" ? 0.08 : 0.16) + typeCount * (shot === "logoSting" ? 0.05 : 0.08));
      p.lockup = { part: "type", pins: pins };
      typeCount += 1;
    }
  }

  return {
    applied: true,
    pins: pins,
    guides: guides,
    marks: markCount,
    type: typeCount
  };
}

module.exports = {
  typeMetrics,
  pinSet,
  applyLockup,
  lockupPart,
  guidesFromPins,
  isLockupSkip
};
