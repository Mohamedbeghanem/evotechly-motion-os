"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REGISTRY = path.join(ROOT, "Evotechly-SaaS-Assets", "Metadata", "asset-registry.json");
const LUCIDE_SVG = path.join(ROOT, "Evotechly-SaaS-Assets", "ThirdParty", "lucide", "svg");

const NATIVE_PUSH = [
  { id: "EVT_UI_PUSH_LEFT", name: "UI Push Left", implemented: true, phase: 1, bestUse: "Dashboard → next screen" },
  { id: "EVT_UI_PUSH_RIGHT", name: "UI Push Right", implemented: true, phase: 1, bestUse: "Back navigation" },
  { id: "EVT_UI_PUSH_UP", name: "UI Push Up", implemented: true, phase: 1, bestUse: "Sheet-like screen rise" },
  { id: "EVT_UI_PUSH_DOWN", name: "UI Push Down", implemented: true, phase: 1, bestUse: "Dismiss upward stack" },
  { id: "EVT_UI_PUSH_SCALE", name: "UI Push + Scale", implemented: true, phase: 1, bestUse: "Card/modal swap without a hard slide" },
  { id: "EVT_UI_PUSH_DEPTH", name: "UI Push + Depth", implemented: true, phase: 1, bestUse: "Recede outgoing, lift incoming" },
  { id: "EVT_UI_PUSH_SOFT", name: "UI Push Soft", implemented: true, phase: 2, bestUse: "Longer settle" },
  { id: "EVT_UI_PUSH_SNAP", name: "UI Push Snap", implemented: true, phase: 2, bestUse: "Tab-to-tab chrome" },
  { id: "EVT_UI_PUSH_OVERSHOOT", name: "UI Push Overshoot", implemented: true, phase: 2, bestUse: "Quiet elastic settle" },
  { id: "EVT_UI_PUSH_PARALLAX", name: "UI Push Parallax", implemented: true, phase: 2, bestUse: "Foreground travels more" },
  { id: "EVT_UI_PUSH_FADE", name: "UI Push Fade", implemented: true, phase: 2, bestUse: "Push plus crossfade" },
  { id: "EVT_UI_PUSH_COVER", name: "UI Push Cover", implemented: true, phase: 2, bestUse: "Incoming covers outgoing" },
  { id: "EVT_UI_PUSH_PANEL", name: "Panel Push", implemented: true, phase: 2, bestUse: "Inspector / side panel" },
  { id: "EVT_UI_PUSH_DASHBOARD", name: "Dashboard Push", implemented: true, phase: 2, bestUse: "Dashboard → next view" },
  { id: "EVT_UI_PUSH_SPLIT", name: "Split Panel Push", implemented: true, phase: 2, bestUse: "Master–detail split" }
];

const OTHER_NATIVE = [
  {
    id: "EVT_TEXT_FLOWING",
    name: "Flowing text reveal",
    category: "Text-Animations",
    folder: "02_Text-Animations",
    transitionKitId: null,
    transitionKitPath: "core/textReveal.js",
    implemented: true,
    notes: "Already owned (P1b). Not a Transition Kit ID. Hub SaaS → Flowing Text."
  },
  {
    id: "EVT_CURSOR_POINTER",
    name: "Cursor pointer",
    category: "Cursors",
    folder: "11_Cursors",
    transitionKitId: null,
    transitionKitPath: "core/saasDemo.js",
    implemented: true,
    notes: "Already owned (P1d). createCursor({ style: 'pointer' })."
  },
  {
    id: "EVT_GLASS_PANEL",
    name: "Glass panel frost",
    category: "Glass-Frost",
    folder: "12_Glass-Frost",
    transitionKitId: null,
    transitionKitPath: "core/saasDemoFx.js",
    implemented: true,
    notes: "Already owned native frost. Not BentoMotion / TFM binaries."
  }
];

function lucideId(file) {
  const stem = file.replace(/\.svg$/, "");
  return "EVT_ICON_LUCIDE_" + stem.toUpperCase().replace(/-/g, "_");
}

function nativePushRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: "Transitions",
    folder: "01_Transitions",
    sourceType: "native",
    owner: "Evotechly",
    commercialUse: true,
    redistributionAllowed: true,
    license: "MIT (Evotechly Motion OS)",
    licenseUrl: "LICENSE",
    licenseVerified: true,
    status: "OWNED",
    transitionKitId: row.id,
    transitionKitPath: "core/transitions",
    catalogPath: "transitions/Metadata/catalog.json",
    implemented: row.implemented,
    files: [],
    downloaded: false,
    notes:
      "Ours. Plan generator in core/transitions (uiPush.js). Companion apply: ae/Evotechly Transitions.jsx. No binary in this pack. " +
      row.bestUse +
      "."
  };
}

function otherNativeRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    folder: row.folder,
    sourceType: "native",
    owner: "Evotechly",
    commercialUse: true,
    redistributionAllowed: true,
    license: "MIT (Evotechly Motion OS)",
    licenseUrl: "LICENSE",
    licenseVerified: true,
    status: "OWNED",
    transitionKitId: row.transitionKitId,
    transitionKitPath: row.transitionKitPath,
    catalogPath: row.transitionKitId ? "transitions/Metadata/catalog.json" : null,
    implemented: row.implemented,
    files: [],
    downloaded: false,
    notes: row.notes
  };
}

function lucideRows() {
  const files = fs
    .readdirSync(LUCIDE_SVG)
    .filter(function (f) {
      return f.endsWith(".svg");
    })
    .sort();
  return files.map(function (file) {
    const rel = "ThirdParty/lucide/svg/" + file;
    return {
      id: lucideId(file),
      name: "Lucide " + file.replace(/\.svg$/, ""),
      category: "Icons",
      folder: "04_Icons",
      sourceType: "thirdParty",
      owner: "Lucide Contributors / Feather (where listed)",
      commercialUse: true,
      redistributionAllowed: true,
      license: "ISC (Lucide) + MIT (Feather-derived icons listed in LICENSE)",
      licenseUrl: "Evotechly-SaaS-Assets/ThirdParty/lucide/LICENSE",
      licenseVerified: true,
      status: "VENDORED",
      attribution: "Icons from Lucide (https://lucide.dev) — see ThirdParty/lucide/LICENSE",
      files: [rel],
      downloaded: true,
      notes: "Fetched 2026-09-15 from official GitHub raw. Rebuild as AE shapes in P1. Not Evotechly artwork."
    };
  });
}

const registry = {
  version: "0.1.0-p0",
  phase: "P0",
  product: "Evotechly SaaS Assets Pack",
  style: "premium-saas",
  schemaVersion: 1,
  note:
    "P0: schema + Evotechly-native Transition Kit stubs + optional Lucide SVGs. Empty of AE vendor packs. downloaded:true only when a file was actually fetched. Integration with the Transition Kit apply path is later.",
  fields: {
    id: "EVT_* unique pack id",
    sourceType: "native | thirdParty",
    status: "OWNED | VENDORED | MANUAL | BLOCKED_FOR_COMMERCIAL | REQUIRES_LICENSE_REVIEW | NATIVE_BUILD_INSTEAD",
    downloaded: "true only after a real fetch + license verification",
    transitionKitId: "optional link into transitions/Metadata/catalog.json"
  },
  assets: NATIVE_PUSH.map(nativePushRow).concat(OTHER_NATIVE.map(otherNativeRow)).concat(lucideRows())
};

fs.mkdirSync(path.dirname(REGISTRY), { recursive: true });
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + "\n");
console.log("wrote", REGISTRY, "assets=", registry.assets.length);
