"use strict";

/**
 * Motion OS Hub — Kit Hub URL matrix.
 * Official vendor sites only. Never download or vendor binaries.
 * Sourced from docs/EDITOR_FREE_KIT.md + docs/KIT_CAPABILITY_MATRIX.md
 * (same rows as core/editorFreeKit.js INSTALL_ORDER).
 */

const { INSTALL_ORDER, POLICY, GOLDEN_SEED } = require("./editorFreeKit");

const HUB_POLICY =
  "Official URLs only. Copy to clipboard or alert. Never download or vendor binaries, JSX, .aex, .plugin, or packs.";

const HUB_SURFACE = {
  window: "Window → SaaS Demo Tools (Motion OS Hub)",
  alias: "Window → Motion OS Hub / SaaS Demo Tools",
  file: "ae/SaaS Demo Tools.jsx",
  mainPanel: "ae/Evotechly Motion OS.jsx",
  seed: GOLDEN_SEED.script,
  note: "Companion hub. Does not replace v0.32. Main-panel SaaS / Home / Kit Hub tabs deferred — do not stub the 297 KB panel."
};

const SAAS_ACTIONS = [
  { id: "cursor", name: "Cursor + click" },
  { id: "depth", name: "Depth reveal" },
  { id: "stagger", name: "Stagger reveal" },
  { id: "uiPreset", name: "Apply UI Preset" },
  { id: "carousel", name: "Carousel setup" },
  { id: "glass", name: "Glass Panel" },
  { id: "wipe", name: "Gradient Wipe" },
  { id: "hover", name: "Proximity Hover" },
  { id: "flowing", name: "Flowing Text" },
  { id: "coloured", name: "Coloured Reveal" }
];

function kitHubEntries() {
  return INSTALL_ORDER.map(function (c) {
    return {
      id: c.id,
      name: c.name,
      url: c.url,
      job: c.job
    };
  });
}

function findEntry(idOrName) {
  const want = String(idOrName || "").toLowerCase();
  let i;
  let c;
  for (i = 0; i < INSTALL_ORDER.length; i++) {
    c = INSTALL_ORDER[i];
    if (c.id.toLowerCase() === want || c.name.toLowerCase() === want) {
      return {
        id: c.id,
        name: c.name,
        url: c.url,
        job: c.job
      };
    }
  }
  return null;
}

function officialUrl(idOrName) {
  const c = findEntry(idOrName);
  return c ? c.url : null;
}

function clipboardText(idOrName) {
  return officialUrl(idOrName);
}

function companionAlert(idOrName) {
  const c = findEntry(idOrName);
  if (!c) return null;
  return (
    c.name +
    "\n" +
    c.url +
    "\n\nOfficial site only. Evotechly never downloads or vendors this companion."
  );
}

function isOfficialUrl(url) {
  const s = String(url || "");
  if (!/^https:\/\//i.test(s)) return false;
  if (/\.(aex|plugin|zip|jsxbin|mbr)(\?|#|$)/i.test(s)) return false;
  return true;
}

function saasActionIds() {
  return SAAS_ACTIONS.map(function (a) {
    return a.id;
  });
}

function kitHubNames() {
  return kitHubEntries().map(function (c) {
    return c.name;
  });
}

module.exports = {
  HUB_POLICY,
  HUB_SURFACE,
  SAAS_ACTIONS,
  POLICY,
  GOLDEN_SEED,
  kitHubEntries,
  kitHubNames,
  findEntry,
  officialUrl,
  clipboardText,
  companionAlert,
  isOfficialUrl,
  saasActionIds
};
