"use strict";

/**
 * Shot taxonomy. Panel + engine record the id; timing still comes
 * from style role rules. Keep this list small.
 */
const SHOTS = {
  hero: { id: "hero", label: "Hero" },
  featureRow: { id: "featureRow", label: "Feature row" },
  pricing: { id: "pricing", label: "Pricing" },
  dashboardTour: { id: "dashboardTour", label: "Dashboard tour" },
  logoLockup: { id: "logoLockup", label: "Logo lockup" },
  uiScreen: { id: "uiScreen", label: "UI screen" }
};

const SHOT_ORDER = [
  "hero",
  "featureRow",
  "pricing",
  "dashboardTour",
  "logoLockup",
  "uiScreen"
];

function getShot(id) {
  return SHOTS[id] || SHOTS.hero;
}

function normalizeShot(id) {
  if (id && SHOTS[id]) return id;
  return "hero";
}

module.exports = { SHOTS, SHOT_ORDER, getShot, normalizeShot };
