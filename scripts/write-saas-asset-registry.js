"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const REGISTRY = path.join(ROOT, "Evotechly-SaaS-Assets", "Metadata", "asset-registry.json");
const LUCIDE_SVG = path.join(ROOT, "Evotechly-SaaS-Assets", "ThirdParty", "lucide", "svg");

const NATIVE_ZOOM = [
  { id: "EVT_ZOOM_IN", name: "Zoom In", implemented: true, phase: 4, bestUse: "Plate scales up into frame" },
  { id: "EVT_ZOOM_OUT", name: "Zoom Out", implemented: true, phase: 4, bestUse: "Pull back to context" },
  { id: "EVT_ZOOM_TARGET", name: "Zoom Target", implemented: true, phase: 4, bestUse: "Frame a selected region (target required)" },
  { id: "EVT_ZOOM_MATCH", name: "Zoom Match", implemented: true, phase: 4, bestUse: "Match outgoing crop to incoming" },
  { id: "EVT_SCALE_POP", name: "Scale Pop", implemented: true, phase: 4, bestUse: "90→100 card present" },
  { id: "EVT_SCALE_BREATHE", name: "Scale Breathe", implemented: true, phase: 4, bestUse: "Idle 100→102→100 — use sparingly" },
  { id: "EVT_SCALE_PUNCH", name: "Scale Punch", implemented: true, phase: 4, bestUse: "Short punch-in on a KPI" },
  { id: "EVT_SCALE_SETTLE", name: "Scale Settle", implemented: true, phase: 4, bestUse: "Oversize incoming eases to 100" }
];

const NATIVE_SHARED = [
  { id: "EVT_SHARED_CARD", name: "Shared Card", implemented: true, phase: 12, bestUse: "Card bounds morph to detail" },
  { id: "EVT_SHARED_IMAGE", name: "Shared Image", implemented: true, phase: 12, bestUse: "Image hero → gallery" },
  { id: "EVT_MATCH_CUT", name: "Match Cut", implemented: true, phase: 12, bestUse: "Match position/scale, cut the rest" },
  { id: "EVT_MORPH_BOUNDS", name: "Morph Bounds", implemented: true, phase: 12, bestUse: "Rect morph only (no mesh)" },
  { id: "EVT_HERO_TO_DETAIL", name: "Hero to Detail", implemented: true, phase: 12, bestUse: "Marketing hero into app UI" },
  { id: "EVT_LIST_TO_DETAIL", name: "List to Detail", implemented: true, phase: 12, bestUse: "Row expands into detail pane" }
];

const NATIVE_OVERLAY = [
  { id: "EVT_MODAL_IN", name: "Modal In", implemented: true, phase: 9, bestUse: "Dialog present + dim" },
  { id: "EVT_MODAL_OUT", name: "Modal Out", implemented: true, phase: 9, bestUse: "Dialog dismiss" },
  { id: "EVT_SHEET_UP", name: "Sheet Up", implemented: true, phase: 9, bestUse: "Modal sheet from bottom" },
  { id: "EVT_SHEET_DOWN", name: "Sheet Down", implemented: true, phase: 9, bestUse: "Sheet dismiss" },
  { id: "EVT_OVERLAY_DIM", name: "Overlay Dim", implemented: true, phase: 9, bestUse: "Dim plate only" },
  { id: "EVT_POPOVER_IN", name: "Popover In", implemented: true, phase: 9, bestUse: "Popover from a target" },
  { id: "EVT_TOAST_IN", name: "Toast In", implemented: true, phase: 9, bestUse: "Toast from edge, then settle" }
];

const NATIVE_PAGE = [
  { id: "EVT_PAGE_PUSH", name: "Page Push", implemented: true, phase: 10, bestUse: "Full-page push using UI Push math" },
  { id: "EVT_PAGE_FADE", name: "Page Fade", implemented: true, phase: 10, bestUse: "Full-page fade" },
  { id: "EVT_SCREEN_SWAP", name: "Screen Swap", implemented: true, phase: 10, bestUse: "Replace screen, keep app chrome" },
  { id: "EVT_NAV_FORWARD", name: "Nav Forward", implemented: true, phase: 10, bestUse: "Forward in an IA stack" },
  { id: "EVT_NAV_BACK", name: "Nav Back", implemented: true, phase: 10, bestUse: "Back in an IA stack" },
  { id: "EVT_TAB_CROSS", name: "Tab Cross", implemented: true, phase: 10, bestUse: "Tab content crossfade" }
];

const NATIVE_STAGGER = [
  { id: "EVT_STAGGER_CARDS", name: "Stagger Cards", implemented: true, phase: 13, bestUse: "Card row stagger in" },
  { id: "EVT_STAGGER_LIST", name: "Stagger List", implemented: true, phase: 13, bestUse: "List rows cascade" },
  { id: "EVT_CASCADE_IN", name: "Cascade In", implemented: true, phase: 13, bestUse: "Tree / nav cascade in" },
  { id: "EVT_CASCADE_OUT", name: "Cascade Out", implemented: true, phase: 13, bestUse: "Cascade out" },
  { id: "EVT_STAGGER_FADE", name: "Stagger Fade", implemented: true, phase: 13, bestUse: "Opacity-only stagger" },
  { id: "EVT_WAVE_SOFT", name: "Wave Soft", implemented: true, phase: 13, bestUse: "Soft delay wave, no bounce" }
];

const NATIVE_SLIDE = [
  { id: "EVT_SLIDE_CARD_LEFT", name: "Slide Card Left", implemented: true, phase: 3, bestUse: "Single card enters from right" },
  { id: "EVT_SLIDE_CARD_RIGHT", name: "Slide Card Right", implemented: true, phase: 3, bestUse: "Single card enters from left" },
  { id: "EVT_SLIDE_PANEL_IN", name: "Slide Panel In", implemented: true, phase: 3, bestUse: "Side panel / inspector in" },
  { id: "EVT_SLIDE_PANEL_OUT", name: "Slide Panel Out", implemented: true, phase: 3, bestUse: "Side panel dismiss" },
  { id: "EVT_SLIDE_DRAWER", name: "Slide Drawer", implemented: true, phase: 3, bestUse: "Nav drawer from leading edge" },
  { id: "EVT_SLIDE_SHEET_UP", name: "Slide Sheet Up", implemented: true, phase: 3, bestUse: "Bottom sheet present" },
  { id: "EVT_SLIDE_STACK", name: "Slide Stack", implemented: true, phase: 3, bestUse: "Card stack peek + commit" },
  { id: "EVT_SLIDE_PEEK", name: "Slide Peek", implemented: true, phase: 3, bestUse: "Partial reveal, then hold" }
];

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

const assets = require("../core/assets/index");

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

const P1_NATIVE = assets.catalogRows();

function lucideId(file) {
  const stem = file.replace(/\.svg$/, "");
  return "EVT_ICON_LUCIDE_" + stem.toUpperCase().replace(/-/g, "_");
}

function nativeKitRow(row, planFile) {
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
      "Ours. Plan generator in core/transitions (" +
      planFile +
      "). Companion apply: ae/Evotechly Transitions.jsx. No binary in this pack. " +
      row.bestUse +
      "."
  };
}

function nativePushRow(row) {
  return nativeKitRow(row, "uiPush.js");
}

function nativeSlideRow(row) {
  return nativeKitRow(row, "uiSlide.js");
}

function nativeZoomRow(row) {
  return nativeKitRow(row, "scaleZoom.js");
}

function nativeSharedRow(row) {
  return nativeKitRow(row, "sharedElement.js");
}

function nativeOverlayRow(row) {
  const rec = nativeKitRow(row, "overlayModal.js");
  rec.category = "Modals-Overlays";
  rec.folder = "07_Modals-Overlays";
  return rec;
}

function nativePageRow(row) {
  return nativeKitRow(row, "pageScreen.js");
}

function nativeStaggerRow(row) {
  return nativeKitRow(row, "staggerCascade.js");
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
  version: "0.3.0-p2b",
  phase: "P2b",
  product: "Evotechly SaaS Assets Pack",
  style: "premium-saas",
  schemaVersion: 1,
  note:
    "P2b native charts / device plates + P1 text / UI / cursor + Transition Kit Phase 13 Stagger-Cascade (plus Phase 2–4 UI Push / UI-Slide / Scale-Zoom, Phase 9 Overlay-Modal, Phase 10 Page-Screen, and Phase 12 Shared-Element). sourceType native, commercialUse true. No AEJuice / Motion Bro / Bento binaries.",
  fields: {
    id: "EVT_* unique pack id",
    sourceType: "native | thirdParty",
    status: "OWNED | VENDORED | MANUAL | BLOCKED_FOR_COMMERCIAL | REQUIRES_LICENSE_REVIEW | NATIVE_BUILD_INSTEAD",
    downloaded: "true only after a real fetch + license verification",
    transitionKitId: "optional link into transitions/Metadata/catalog.json"
  },
  assets: NATIVE_PUSH.map(nativePushRow)
    .concat(NATIVE_SLIDE.map(nativeSlideRow))
    .concat(NATIVE_ZOOM.map(nativeZoomRow))
    .concat(NATIVE_SHARED.map(nativeSharedRow))
    .concat(NATIVE_OVERLAY.map(nativeOverlayRow))
    .concat(NATIVE_PAGE.map(nativePageRow))
    .concat(NATIVE_STAGGER.map(nativeStaggerRow))
    .concat(OTHER_NATIVE.map(otherNativeRow))
    .concat(P1_NATIVE.map(otherNativeRow))
    .concat(lucideRows())
};

fs.mkdirSync(path.dirname(REGISTRY), { recursive: true });
fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + "\n");
console.log("wrote", REGISTRY, "assets=", registry.assets.length);
