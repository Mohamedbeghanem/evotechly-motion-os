"use strict";

function brief(opts) {
  const o = opts || {};
  return { brand: o.brand || "evocrm", goal: o.goal || "productDemo", energy: o.energy || "standard", format: o.format || "9:16" };
}

function scoreRecommendation(rec, context) {
  let score = 0;
  const c = context || {};
  if (c.brandFit && rec) score += c.brandFit[rec.action] || 0;
  return Math.max(0, score);
}

module.exports = { brief, scoreRecommendation };
