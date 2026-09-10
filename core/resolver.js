"use strict";

const { getPreset } = require("./presets");
const { detectRole } = require("./roles");
const { getStyle } = require("./styles");

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function parentDelay(layer, byName, byId) {
  const pid = layer && layer.parentId;
  if (!pid) return 0;
  const parent = byId[pid] || byName[pid];
  if (!parent || parent._delay == null) return 0;
  return parent._delay + Math.min(parent._duration || 0.5, 0.18);
}

function resolveMotion(layer, index, ctx) {
  ctx = ctx || {};
  const style = ctx.stylePack || getStyle(ctx.style);
  const role = detectRole(layer);
  const roleRule = (style.roles && style.roles[role]) || style.roles.card;
  const presetId = (layer && layer.preset) || roleRule.preset;
  const animation = getPreset(presetId, ctx.presets);
  animation.duration = round4(animation.duration * (roleRule.durationScale || 1));

  let delay;
  if (layer && layer.delay != null) {
    delay = Number(layer.delay);
  } else {
    const sibling = ctx.siblingIndex != null ? ctx.siblingIndex : index;
    const base = roleRule.base == null ? 0 : roleRule.base;
    delay = base + sibling * (roleRule.stagger || 0);
    if (ctx.useParent && layer && layer.parentId) {
      delay = round4(delay + parentDelay(layer, ctx.byName || {}, ctx.byId || {}));
    }
  }

  return {
    layer: (layer && (layer.name || layer.id)) || ("layer-" + index),
    name: (layer && (layer.name || layer.id)) || ("layer-" + index),
    type: role,
    role: role,
    preset: presetId,
    animation: animation,
    delay: round4(delay),
    x: layer && layer.x,
    y: layer && layer.y,
    width: layer && layer.width,
    height: layer && layer.height,
    parentId: (layer && layer.parentId) || null
  };
}

function resolveAfterRules(planLayers, stylePack) {
  const style = stylePack || getStyle("stripe");
  const gap = style.gapAfterGroup || 0.12;
  let groupEnd = 0;
  let ctaEnd = 0;

  for (let i = 0; i < planLayers.length; i++) {
    const L = planLayers[i];
    const rule = style.roles[L.role] || {};
    if (rule.after) continue;
    const end = L.delay + L.animation.duration;
    if (end > groupEnd) groupEnd = end;
  }

  for (let j = 0; j < planLayers.length; j++) {
    const L = planLayers[j];
    const rule = style.roles[L.role] || {};
    if (rule.after === "group") {
      L.delay = round4(groupEnd + gap - L.animation.duration * 0.15);
      if (L.delay < 0) L.delay = 0;
    }
  }

  for (let k = 0; k < planLayers.length; k++) {
    const L = planLayers[k];
    if (L.role === "cta") {
      const end = L.delay + L.animation.duration;
      if (end > ctaEnd) ctaEnd = end;
    }
  }
  if (ctaEnd === 0) ctaEnd = groupEnd;

  for (let m = 0; m < planLayers.length; m++) {
    const L = planLayers[m];
    const rule = style.roles[L.role] || {};
    if (rule.after === "cta") {
      L.delay = round4(ctaEnd + 0.06);
    }
  }
  return planLayers;
}

module.exports = { resolveMotion, resolveAfterRules, round4 };
