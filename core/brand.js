"use strict";

/**
 * evotechly.brand.v1 — tokens that change the plan, not just a label.
 * gap, travel, easing, and per-role base/stagger/durationScale/after/preset.
 */

function cloneRoles(roles) {
  const out = {};
  Object.keys(roles || {}).forEach(function (k) {
    const r = roles[k] || {};
    out[k] = {
      preset: r.preset,
      base: r.base,
      stagger: r.stagger,
      durationScale: r.durationScale,
      after: r.after || null
    };
  });
  return out;
}

function cloneStyle(stylePack) {
  stylePack = stylePack || {};
  return {
    id: stylePack.id,
    label: stylePack.label,
    description: stylePack.description,
    gapAfterGroup: stylePack.gapAfterGroup,
    travel: stylePack.travel == null ? 1 : stylePack.travel,
    hold: stylePack.hold || 0,
    roles: cloneRoles(stylePack.roles)
  };
}

function parseBrand(input) {
  if (!input || typeof input !== "object") return null;
  if (input.schema && input.schema !== "evotechly.brand.v1") return null;
  if (!input.gap && !input.travel && !input.roles && input.easing == null) {
    return null;
  }
  return {
    schema: "evotechly.brand.v1",
    name: input.name || null,
    style: input.style || null,
    shot: input.shot || null,
    gap: input.gap != null ? Number(input.gap) : null,
    travel: input.travel != null ? Number(input.travel) : null,
    hold: input.hold != null ? Number(input.hold) : null,
    easing: input.easing || null,
    roles: input.roles || null
  };
}

function applyBrand(stylePack, brand) {
  const out = cloneStyle(stylePack);
  const tokens = parseBrand(brand);
  if (!tokens) return out;
  if (tokens.gap != null && !isNaN(tokens.gap)) out.gapAfterGroup = tokens.gap;
  if (tokens.travel != null && !isNaN(tokens.travel)) out.travel = tokens.travel;
  if (tokens.hold != null && !isNaN(tokens.hold)) out.hold = tokens.hold;
  if (tokens.roles) {
    Object.keys(tokens.roles).forEach(function (role) {
      const patch = tokens.roles[role] || {};
      const cur = out.roles[role] || {};
      out.roles[role] = {
        preset: patch.preset || cur.preset,
        base: patch.base !== undefined ? patch.base : cur.base,
        stagger: patch.stagger !== undefined ? patch.stagger : cur.stagger,
        durationScale: patch.durationScale !== undefined ? patch.durationScale : cur.durationScale,
        after: patch.after !== undefined ? patch.after : cur.after
      };
    });
  }
  return out;
}

module.exports = { parseBrand, applyBrand, cloneStyle };
