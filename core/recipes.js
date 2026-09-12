"use strict";

/**
 * Evotechly editor recipes. Native AE only.
 * Third-party names are reminders + official URLs, never binaries.
 */

const PERSON = {
  cutout: {
    id: "cutoutPrep",
    label: "Cutout Prep",
    layerName: "CUTOUT",
    steps: [
      "Duplicate talent → name CUTOUT",
      "Roto Brush 3: paint foreground",
      "Refine Edge, then Freeze",
      "Pre-render ProRes 4444 + Alpha"
    ]
  },
  keylight: {
    id: "keylight",
    label: "Keylight recipe",
    effect: "Keylight 1.2",
    screenGain: 1,
    clipBlack: 0,
    clipWhite: 100,
    spill: "Advanced Spill Suppressor"
  },
  lightWrap: {
    id: "lightWrap",
    label: "Light wrap",
    choker: 1.2,
    blur: 12,
    blend: "Screen",
    opacity: 35
  },
  talkingHead: {
    id: "talkingHead",
    label: "Talking-head stack",
    order: ["CUTOUT|keyed", "Captions", "Product UI / L3", "BG"],
    wetOff: true,
    saberOff: true
  }
};

const EDITOR_SHOTS = {
  founderGs: { id: "founderGs", label: "Founder GS", path: "keylight", wet: false },
  founderRoto: { id: "founderRoto", label: "Founder Roto", path: "cutout", wet: false },
  erpDemo: { id: "erpDemo", label: "ERP demo", path: "cursor+ease", plugins: [] },
  hook15: {
    id: "hook15",
    label: "15s hook",
    path: "reminders",
    plugins: ["Displacer Pro", "QCA3", "Saber"],
    wetOptional: true
  },
  featureCard: { id: "featureCard", label: "Feature card", path: "icon+arTitle+kpi" }
};

const KPI = { duration: 1.4, sliderName: "Target", expression: "count-up" };

function recipeIds() {
  return Object.keys(EDITOR_SHOTS);
}

module.exports = {
  PERSON,
  EDITOR_SHOTS,
  KPI,
  recipeIds
};
