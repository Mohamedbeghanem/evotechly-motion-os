"use strict";

const { collectRawLayers } = require("./figmaParser");
const { mapFigmaType } = require("./typeMapper");

function normalize(payload) {
  const raw = collectRawLayers(payload);
  const mapped = [];
  for (let i = 0; i < raw.length; i++) {
    const l = raw[i] || {};
    mapped.push({
      name: l.name || l.id || ("layer-" + i),
      type: mapFigmaType(l.type),
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
