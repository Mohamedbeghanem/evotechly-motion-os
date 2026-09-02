"use strict";

function parse(input) {
  if (typeof input === "string") return JSON.parse(input);
  return input;
}

function collectRawLayers(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.layers)) return payload.layers;
  if (Array.isArray(payload.frames)) {
    const out = [];
    for (let f = 0; f < payload.frames.length; f++) {
      const list = payload.frames[f].layers || [];
      for (let i = 0; i < list.length; i++) out.push(list[i]);
    }
    return out;
  }
  return [];
}

module.exports = { parse, collectRawLayers };
