"use strict";

const { collectRawLayers } = require("./figmaParser");
const { mapFigmaType } = require("./typeMapper");
const { ROLE_ORDER } = require("../core/roles");

function resolveType(l) {
  if (l.role) return l.role;
  const raw = String(l.figmaType || l.type || "").toLowerCase();
  if (ROLE_ORDER.indexOf(raw) !== -1) return raw;
  return mapFigmaType(raw);
}

function normalize(payload) {
  const raw = collectRawLayers(payload);
  const mapped = [];
  for (let i = 0; i < raw.length; i++) {
    const l = raw[i] || {};
    mapped.push({
      id: l.id || null,
      name: l.name || l.id || ("layer-" + i),
      type: resolveType(l),
      role: l.role || null,
      preset: l.preset || null,
      delay: l.delay,
      x: l.x || 0,
      y: l.y || 0,
      width: l.width || 0,
      height: l.height || 0,
      parentId: l.parentId || null,
      _i: i
    });
  }
  mapped.sort(function (a, b) {
    if (a.y !== b.y) return a.y - b.y;
    if (a.x !== b.x) return a.x - b.x;
    return a._i - b._i;
  });
  for (let j = 0; j < mapped.length; j++) delete mapped[j]._i;
  return mapped;
}

module.exports = { normalize };
