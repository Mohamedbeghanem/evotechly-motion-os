"use strict";

const TERMS = {
  P2: "Interaction",
  P3: "Frame",
  P6: "Text",
  P8: "Edit",
  P12: "Check",
  P13: "Director",
  P14: "Variants",
  P15: "Assets",
  P16: "Review",
  P17: "Produce",
  P18: "Learn"
};

const QUICK_ACTIONS = {
  text: ["Fade up", "Word reveal", "Keyword pop"],
  ui: ["Hover", "Click", "Cursor click"],
  cards: ["Stagger in", "Scale in", "UI card reveal"],
  none: ["Animate selection", "New edit", "Open existing"]
};

function label(phase) {
  return TERMS[phase] || phase;
}

function actionsFor(kind) {
  return QUICK_ACTIONS[kind] || QUICK_ACTIONS.none;
}

function classify(sel) {
  const n = String(sel || "").toLowerCase();
  if (/text|title|hook|caption/.test(n)) return "text";
  if (/btn|button|cta|click/.test(n)) return "ui";
  if (/card|tile|row/.test(n)) return "cards";
  return "none";
}

function nextIssue(issues) {
  const list = issues || [];
  const block = list.filter(function (i) { return i.severity === "BLOCKING"; });
  return block[0] || list[0] || null;
}

module.exports = { TERMS, QUICK_ACTIONS, label, actionsFor, classify, nextIssue };
