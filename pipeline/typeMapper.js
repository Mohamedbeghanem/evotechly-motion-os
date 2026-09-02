"use strict";

const TYPE_MAP = {
  text: "text",
  rectangle: "card",
  ellipse: "card",
  vector: "card",
  group: "dashboard",
  frame: "dashboard",
  component: "dashboard",
  instance: "dashboard",
  image: "image"
};

function mapFigmaType(type) {
  const t = String(type || "").toLowerCase();
  return TYPE_MAP[t] || "card";
}

module.exports = { TYPE_MAP, mapFigmaType };
