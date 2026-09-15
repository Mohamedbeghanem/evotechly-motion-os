"use strict";

/**
 * Transition Kit easing — AE influence pairs only.
 * apple / soft match core/polish.js. linear matches uiPresets LINEAR_EASE.
 * New premium IDs are influence numbers, not vendor curves.
 */

const POLISH_APPLE = { influenceIn: 80, influenceOut: 18 };
const POLISH_SOFT = { influenceIn: 40, influenceOut: 40 };
const LINEAR_EASE = { influenceIn: 16, influenceOut: 16 };

const EASING = {
  "premium-smooth": { id: "premium-smooth", influenceIn: 88, influenceOut: 14, note: "Quieter than Apple. Default UI Push." },
  "apple-smooth": { id: "apple-smooth", influenceIn: POLISH_APPLE.influenceIn, influenceOut: POLISH_APPLE.influenceOut, note: "polish.js apple" },
  apple: { id: "apple", influenceIn: POLISH_APPLE.influenceIn, influenceOut: POLISH_APPLE.influenceOut, note: "Alias of apple-smooth" },
  "fast-product": { id: "fast-product", influenceIn: 72, influenceOut: 12, note: "Vercel / Linear product snap" },
  "soft-ui": { id: "soft-ui", influenceIn: POLISH_SOFT.influenceIn, influenceOut: POLISH_SOFT.influenceOut, note: "polish.js soft" },
  soft: { id: "soft", influenceIn: POLISH_SOFT.influenceIn, influenceOut: POLISH_SOFT.influenceOut, note: "Alias of soft-ui" },
  snappy: { id: "snappy", influenceIn: 55, influenceOut: 8, note: "Short UI chrome" },
  "elastic-micro": { id: "elastic-micro", influenceIn: 35, influenceOut: 78, note: "Micro settle. Not a bounce preset." },
  linear: { id: "linear", influenceIn: LINEAR_EASE.influenceIn, influenceOut: LINEAR_EASE.influenceOut, note: "uiPresets linear" }
};

const EASING_IDS = [
  "premium-smooth",
  "apple-smooth",
  "fast-product",
  "soft-ui",
  "snappy",
  "elastic-micro"
];

const DEFAULT_EASE = "premium-smooth";

const ALIASES = {
  apple: "apple-smooth",
  soft: "soft-ui",
  linear: "linear",
  "apple-smooth": "apple-smooth",
  "premium-smooth": "premium-smooth",
  "fast-product": "fast-product",
  "soft-ui": "soft-ui",
  snappy: "snappy",
  "elastic-micro": "elastic-micro"
};

function normalizeEase(id) {
  const raw = String(id == null ? DEFAULT_EASE : id)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
  if (ALIASES[raw]) return ALIASES[raw];
  if (EASING[raw]) return raw;
  return DEFAULT_EASE;
}

function easeInfluences(id) {
  const key = normalizeEase(id);
  const src = EASING[key] || EASING[DEFAULT_EASE];
  return { influenceIn: src.influenceIn, influenceOut: src.influenceOut };
}

function getEasing(id) {
  const key = normalizeEase(id);
  const src = EASING[key] || EASING[DEFAULT_EASE];
  return {
    id: src.id,
    influenceIn: src.influenceIn,
    influenceOut: src.influenceOut,
    note: src.note
  };
}

function listEasing() {
  return EASING_IDS.slice();
}

function easeIndex(id) {
  const key = normalizeEase(id);
  const i = EASING_IDS.indexOf(key);
  return i === -1 ? 0 : i;
}

function easeFromIndex(index) {
  const i = Number(index);
  if (i !== i || i < 0) return DEFAULT_EASE;
  return EASING_IDS[Math.min(EASING_IDS.length - 1, Math.round(i))] || DEFAULT_EASE;
}

module.exports = {
  EASING,
  EASING_IDS,
  DEFAULT_EASE,
  POLISH_APPLE,
  POLISH_SOFT,
  LINEAR_EASE,
  normalizeEase,
  easeInfluences,
  getEasing,
  listEasing,
  easeIndex,
  easeFromIndex
};
