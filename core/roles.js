"use strict";

/**
 * Editor-facing roles. Name the AE / Figma layer with one of these
 * words and the compiler picks timing + preset.
 *
 * ROLE_ORDER prefix (logo…cursor) is frozen for SaaS hero sort.
 * UI roles append after cursor so existing indexes stay put.
 */
const ROLE_ORDER = [
  "logo",
  "eyebrow",
  "title",
  "subtitle",
  "nav",
  "sidebar",
  "dashboard",
  "screenshot",
  "image",
  "card",
  "metric",
  "badge",
  "tooltip",
  "button",
  "cta",
  "cursor",
  "modal",
  "toast",
  "row",
  "stack",
  "caption"
];

const ROLE_ALIASES = [
  { role: "caption", match: ["caption", "burn-in", "lower third", "subtitle line"] },
  { role: "cta", match: ["cta", "get started", "start free", "book demo"] },
  { role: "button", match: ["button", "btn", "primarybutton"] },
  { role: "cursor", match: ["cursor", "pointer", "mouse"] },
  { role: "modal", match: ["modal", "dialog", "sheet"] },
  { role: "toast", match: ["toast", "snackbar", "notice"] },
  { role: "row", match: ["uirow", "feature row", "row"] },
  { role: "stack", match: ["uistack", "stack"] },
  { role: "tooltip", match: ["tooltip", "hint"] },
  { role: "badge", match: ["badge", "chip", "tag"] },
  { role: "metric", match: ["metric", "kpi", "stat", "number"] },
  { role: "card", match: ["card"] },
  { role: "screenshot", match: ["screenshot", "product shot", "ui shot"] },
  { role: "image", match: ["image", "photo"] },
  { role: "dashboard", match: ["dashboard", "app shell", "canvas"] },
  { role: "sidebar", match: ["sidebar"] },
  { role: "nav", match: ["navbar", "nav", "menu"] },
  { role: "subtitle", match: ["subtitle", "subhead", "subheading", "deck"] },
  { role: "title", match: ["title", "headline", "heading", "h1"] },
  { role: "eyebrow", match: ["eyebrow", "kicker", "label"] },
  { role: "logo", match: ["logo", "wordmark"] }
];

function detectRole(layer) {
  if (layer && layer.role) return String(layer.role).toLowerCase();
  const n = String((layer && layer.name) || "").toLowerCase();
  for (let i = 0; i < ROLE_ALIASES.length; i++) {
    const aliases = ROLE_ALIASES[i].match;
    for (let j = 0; j < aliases.length; j++) {
      if (n.indexOf(aliases[j]) !== -1) return ROLE_ALIASES[i].role;
    }
  }
  const t = String((layer && layer.type) || "").toLowerCase();
  if (ROLE_ORDER.indexOf(t) !== -1) return t;
  if (t === "text") return "title";
  if (t === "frame" || t === "group" || t === "component" || t === "instance") {
    return "dashboard";
  }
  return "card";
}

function roleIndex(role) {
  const i = ROLE_ORDER.indexOf(role);
  return i === -1 ? ROLE_ORDER.indexOf("card") : i;
}

module.exports = { ROLE_ORDER, ROLE_ALIASES, detectRole, roleIndex };
