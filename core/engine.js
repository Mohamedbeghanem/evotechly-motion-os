"use strict";

const { resolveMotion, resolveAfterRules, layerSpan } = require("./resolver");
const { PRESETS, mergePresets } = require("./presets");
const { mergeBehaviors } = require("./behaviors");
const { detectRole, roleIndex } = require("./roles");
const { getStyle } = require("./styles");
const { normalizeDirection } = require("./direction");
const { normalizeShot } = require("./shots");
const { applyLockup } = require("./lockup");

function sortForMotion(layers) {
  const list = layers.slice();
  list.sort(function (a, b) {
    const ra = roleIndex(detectRole(a));
    const rb = roleIndex(detectRole(b));
    if (ra !== rb) return ra - rb;
    const ay = a.y || 0;
    const by = b.y || 0;
    if (ay !== by) return ay - by;
    const ax = a.x || 0;
    const bx = b.x || 0;
    if (ax !== bx) return ax - bx;
    return (a._i || 0) - (b._i || 0);
  });
  return list;
}

function siblingIndexes(sorted) {
  const counts = {};
  const out = [];
  for (let i = 0; i < sorted.length; i++) {
    const role = detectRole(sorted[i]);
    if (counts[role] == null) counts[role] = 0;
    out.push(counts[role]);
    counts[role] += 1;
  }
  return out;
}

function createEngine(config) {
  config = config || {};
  const styleId = config.style || "stripe";
  const stylePack = getStyle(styleId);
  const presets = mergePresets(PRESETS, config.presets || null);
  const behaviors = mergeBehaviors(config.behaviors || null);
  const direction = normalizeDirection(config.direction);
  const shot = normalizeShot(config.shot);

  function run(layers, sourceType) {
    const raw = Array.isArray(layers) ? layers : [];
    const tagged = raw.map(function (l, i) {
      const copy = {};
      Object.keys(l || {}).forEach(function (k) {
        copy[k] = l[k];
      });
      copy._i = i;
      return copy;
    });
    const sorted = sortForMotion(tagged);
    const siblings = siblingIndexes(sorted);
    const byName = {};
    const byId = {};
    const ctx = {
      presets: presets,
      behaviors: behaviors,
      style: styleId,
      stylePack: stylePack,
      direction: direction,
      shot: shot,
      byName: byName,
      byId: byId,
      useParent: true
    };

    const plan = [];
    for (let i = 0; i < sorted.length; i++) {
      ctx.siblingIndex = siblings[i];
      const item = resolveMotion(sorted[i], i, ctx);
      item._duration = layerSpan(item);
      item._delay = item.delay;
      byName[item.layer] = item;
      if (sorted[i].id) byId[sorted[i].id] = item;
      plan.push(item);
    }
    resolveAfterRules(plan, stylePack);
    const lockup = applyLockup(plan, shot);

    for (let j = 0; j < plan.length; j++) {
      delete plan[j]._duration;
      delete plan[j]._delay;
    }

    const ends = plan.map(function (p) {
      return p.delay + layerSpan(p);
    });
    const duration = ends.length ? Math.max.apply(null, ends) : 0;

    const out = {
      schema: "evotechly.motion.engine.v1",
      sourceType: sourceType || "manual",
      style: styleId,
      direction: direction,
      shot: shot,
      duration: Math.round(duration * 10000) / 10000,
      layers: plan
    };
    if (lockup && lockup.applied) out.lockup = lockup;
    return out;
  }

  function runMotion(layers) {
    return run(layers, "manual").layers;
  }

  return { run: run, runMotion: runMotion };
}

function runMotion(layers) {
  if (!Array.isArray(layers)) throw new Error("runMotion(layers) expects an array");
  return createEngine().runMotion(layers);
}

module.exports = { createEngine, runMotion, sortForMotion };
