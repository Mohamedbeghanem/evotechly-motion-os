"use strict";

/**
 * One-shot helper to write transitions/Metadata/catalog.json.
 * Run: node scripts/write-transition-catalog.js
 */

const fs = require("fs");
const path = require("path");

const ASPECT = ["16:9", "9:16", "1:1", "4:5"];
const STYLE = "premium-saas";

function row(id, category, duration, intensity, targetRequired, bestUse, phase, implemented, sfx, name) {
  const rec = {
    id: id,
    category: category,
    style: STYLE,
    duration: duration,
    intensity: intensity,
    targetRequired: !!targetRequired,
    bestUse: bestUse,
    aspectRatios: ASPECT.slice(),
    sfx: sfx || [],
    phase: phase,
    implemented: implemented === true
  };
  if (name) rec.name = name;
  return rec;
}

const transitions = [
  // 01 UI-Push — Phase 2 implements the full family
  row("EVT_UI_PUSH_LEFT", "UI-Push", "STANDARD", "standard", false, "Dashboard → next screen, iOS-style push left", 1, true, ["ui-whoosh-soft"], "UI Push Left"),
  row("EVT_UI_PUSH_RIGHT", "UI-Push", "STANDARD", "standard", false, "Back navigation, previous screen from the left", 1, true, ["ui-whoosh-soft"], "UI Push Right"),
  row("EVT_UI_PUSH_UP", "UI-Push", "STANDARD", "standard", false, "Sheet-like screen rise, settings stack", 1, true, ["ui-whoosh-soft"], "UI Push Up"),
  row("EVT_UI_PUSH_DOWN", "UI-Push", "STANDARD", "standard", false, "Dismiss upward stack, close overlay screen", 1, true, ["ui-whoosh-soft"], "UI Push Down"),
  row("EVT_UI_PUSH_SCALE", "UI-Push", "STANDARD", "subtle", false, "Card or modal swap without a hard slide", 1, true, ["ui-cross"], "UI Push + Scale"),
  row("EVT_UI_PUSH_DEPTH", "UI-Push", "SMOOTH", "subtle", false, "Recede outgoing, lift incoming — product tour", 1, true, ["ui-cross"], "UI Push + Depth"),
  row("EVT_UI_PUSH_SOFT", "UI-Push", "SMOOTH", "subtle", false, "Same as left with longer settle", 2, true, ["ui-whoosh-soft"], "UI Push Soft"),
  row("EVT_UI_PUSH_SNAP", "UI-Push", "FAST", "bold", false, "Short product chrome, tab-to-tab", 2, true, ["ui-whoosh-soft"], "UI Push Snap"),
  row("EVT_UI_PUSH_OVERSHOOT", "UI-Push", "STANDARD", "standard", false, "Push with a quieter elastic settle", 2, true, ["ui-whoosh-soft"], "UI Push Overshoot"),
  row("EVT_UI_PUSH_PARALLAX", "UI-Push", "SMOOTH", "subtle", false, "Foreground moves more than background", 2, true, ["ui-whoosh-soft"], "UI Push Parallax"),
  row("EVT_UI_PUSH_FADE", "UI-Push", "STANDARD", "subtle", false, "Push plus crossfade for busy UI", 2, true, ["ui-cross"], "UI Push Fade"),
  row("EVT_UI_PUSH_COVER", "UI-Push", "STANDARD", "standard", false, "Incoming covers outgoing; outgoing stays", 2, true, ["ui-whoosh-soft"], "UI Push Cover"),
  row("EVT_UI_PUSH_PANEL", "UI-Push", "STANDARD", "standard", false, "Inspector / side panel covers content from the trailing edge", 2, true, ["ui-whoosh-soft"], "Panel Push"),
  row("EVT_UI_PUSH_DASHBOARD", "UI-Push", "SMOOTH", "standard", false, "Dashboard → next view with a quiet depth push", 2, true, ["ui-whoosh-soft"], "Dashboard Push"),
  row("EVT_UI_PUSH_SPLIT", "UI-Push", "STANDARD", "standard", false, "Master–detail split: panes part, incoming takes the open half", 2, true, ["ui-whoosh-soft"], "Split Panel Push"),

  // 02 UI-Slide — Phase 3 implements the card family
  row("EVT_SLIDE_CARD_LEFT", "UI-Slide", "FAST", "subtle", false, "Single card enters from right", 3, true, ["ui-whoosh-soft"], "Slide Card Left"),
  row("EVT_SLIDE_CARD_RIGHT", "UI-Slide", "FAST", "subtle", false, "Single card enters from left", 3, true, ["ui-whoosh-soft"], "Slide Card Right"),
  row("EVT_SLIDE_PANEL_IN", "UI-Slide", "STANDARD", "standard", false, "Side panel / inspector in", 3, true, ["ui-whoosh-soft"], "Slide Panel In"),
  row("EVT_SLIDE_PANEL_OUT", "UI-Slide", "FAST", "standard", false, "Side panel dismiss", 3, true, ["ui-whoosh-soft"], "Slide Panel Out"),
  row("EVT_SLIDE_DRAWER", "UI-Slide", "STANDARD", "standard", false, "Nav drawer from leading edge", 3, true, ["ui-whoosh-soft"], "Slide Drawer"),
  row("EVT_SLIDE_SHEET_UP", "UI-Slide", "STANDARD", "standard", false, "Bottom sheet present", 3, true, ["ui-whoosh-soft"], "Slide Sheet Up"),
  row("EVT_SLIDE_STACK", "UI-Slide", "SMOOTH", "subtle", false, "Card stack peek + commit", 3, true, ["ui-cross"], "Slide Stack"),
  row("EVT_SLIDE_PEEK", "UI-Slide", "MICRO", "subtle", false, "Partial reveal, then hold", 3, true, ["ui-soft-in"], "Slide Peek"),

  // 03 Scale-Zoom — Phase 4
  row("EVT_ZOOM_IN", "Scale-Zoom", "STANDARD", "standard", false, "Plate scales up into frame", 4, true, ["ui-whoosh-soft"], "Zoom In"),
  row("EVT_ZOOM_OUT", "Scale-Zoom", "STANDARD", "standard", false, "Pull back to context", 4, true, ["ui-whoosh-soft"], "Zoom Out"),
  row("EVT_ZOOM_TARGET", "Scale-Zoom", "SMOOTH", "standard", true, "Frame a selected region (target required)", 4, true, ["ui-whoosh-soft"], "Zoom Target"),
  row("EVT_ZOOM_MATCH", "Scale-Zoom", "STANDARD", "subtle", true, "Match outgoing crop to incoming", 4, true, ["ui-cross"], "Zoom Match"),
  row("EVT_SCALE_POP", "Scale-Zoom", "FAST", "standard", false, "90→100 card present", 4, true, ["ui-soft-in"], "Scale Pop"),
  row("EVT_SCALE_BREATHE", "Scale-Zoom", "SMOOTH", "subtle", false, "Idle 100→102→100 — use sparingly", 4, true, ["ui-soft-in"], "Scale Breathe"),
  row("EVT_SCALE_PUNCH", "Scale-Zoom", "FAST", "bold", true, "Short punch-in on a KPI", 4, true, ["ui-tick-soft"], "Scale Punch"),
  row("EVT_SCALE_SETTLE", "Scale-Zoom", "STANDARD", "subtle", false, "Oversize incoming eases to 100", 4, true, ["ui-cross"], "Scale Settle"),

  // 04 Crossfade
  row("EVT_FADE_CROSS", "Crossfade", "STANDARD", "subtle", false, "Opacity swap, no travel", 5, false, []),
  row("EVT_FADE_SOFT", "Crossfade", "SMOOTH", "subtle", false, "Longer dissolve for dense UI", 5, false, []),
  row("EVT_FADE_HOLD", "Crossfade", "SMOOTH", "subtle", false, "Crossfade with a still hold", 5, false, []),
  row("EVT_FADE_DIP", "Crossfade", "FAST", "standard", false, "Brief dip to brand fill, then in", 5, false, []),
  row("EVT_DISSOLVE_UI", "Crossfade", "STANDARD", "subtle", false, "UI plate dissolve, keep chrome", 5, false, []),
  row("EVT_DISSOLVE_COLOR", "Crossfade", "STANDARD", "subtle", false, "Tinted dissolve, one brand color", 5, false, []),

  // 05 Mask-Reveal
  row("EVT_MASK_CIRCLE", "Mask-Reveal", "STANDARD", "standard", true, "Soft circular reveal on a card", 6, false, []),
  row("EVT_MASK_RECT", "Mask-Reveal", "STANDARD", "standard", false, "Rounded-rect expand", 6, false, []),
  row("EVT_MASK_SOFT_EDGE", "Mask-Reveal", "SMOOTH", "subtle", false, "Feathered matte, no hard wipe", 6, false, []),
  row("EVT_MASK_EXPAND", "Mask-Reveal", "STANDARD", "standard", false, "Mask expansion from center", 6, false, []),
  row("EVT_REVEAL_IRIS", "Mask-Reveal", "SMOOTH", "subtle", true, "Quiet iris on a screenshot", 6, false, []),
  row("EVT_REVEAL_WIPE_SOFT", "Mask-Reveal", "STANDARD", "subtle", false, "Soft directional matte, not a bar wipe", 6, false, []),

  // 06 Blur-Focus
  row("EVT_BLUR_FOCUS", "Blur-Focus", "STANDARD", "subtle", false, "Outgoing blurs as incoming sharpens", 7, false, []),
  row("EVT_BLUR_PULL", "Blur-Focus", "SMOOTH", "subtle", false, "Focus pull toward the incoming plate", 7, false, []),
  row("EVT_BLUR_CROSS", "Blur-Focus", "STANDARD", "subtle", false, "Mid-cross blur, both plates", 7, false, []),
  row("EVT_FOCUS_RACK", "Blur-Focus", "SMOOTH", "subtle", true, "Rack between two depths", 7, false, []),
  row("EVT_FOCUS_TARGET", "Blur-Focus", "STANDARD", "subtle", true, "Sharpen the framed target", 7, false, []),
  row("EVT_BLUR_LIFT", "Blur-Focus", "FAST", "subtle", false, "Un-blur a frosted panel", 7, false, []),

  // 07 Depth-Parallax
  row("EVT_DEPTH_PUSH", "Depth-Parallax", "SMOOTH", "subtle", false, "Layers recede on Z-feel (scale+blur)", 8, false, []),
  row("EVT_DEPTH_PULL", "Depth-Parallax", "SMOOTH", "subtle", false, "Layers approach", 8, false, []),
  row("EVT_PARALLAX_X", "Depth-Parallax", "STANDARD", "subtle", false, "Horizontal parallax, small travel", 8, false, []),
  row("EVT_PARALLAX_Y", "Depth-Parallax", "STANDARD", "subtle", false, "Vertical parallax, small travel", 8, false, []),
  row("EVT_DEPTH_STACK", "Depth-Parallax", "SMOOTH", "standard", false, "Card stack depth sort", 8, false, []),
  row("EVT_DEPTH_CARD", "Depth-Parallax", "STANDARD", "subtle", false, "One card lifts off a grid", 8, false, []),

  // 08 Overlay-Modal — Phase 9
  row("EVT_MODAL_IN", "Overlay-Modal", "STANDARD", "standard", false, "Dialog present + dim", 9, true, ["ui-soft-in"], "Modal In"),
  row("EVT_MODAL_OUT", "Overlay-Modal", "FAST", "standard", false, "Dialog dismiss", 9, true, ["ui-soft-in"], "Modal Out"),
  row("EVT_SHEET_UP", "Overlay-Modal", "STANDARD", "standard", false, "Modal sheet from bottom", 9, true, ["ui-whoosh-soft"], "Sheet Up"),
  row("EVT_SHEET_DOWN", "Overlay-Modal", "FAST", "standard", false, "Sheet dismiss", 9, true, ["ui-whoosh-soft"], "Sheet Down"),
  row("EVT_OVERLAY_DIM", "Overlay-Modal", "FAST", "subtle", false, "Dim plate only", 9, true, ["ui-cross"], "Overlay Dim"),
  row("EVT_POPOVER_IN", "Overlay-Modal", "FAST", "subtle", true, "Popover from a target", 9, true, ["ui-soft-in"], "Popover In"),
  row("EVT_TOAST_IN", "Overlay-Modal", "FAST", "subtle", false, "Toast from edge, then settle", 9, true, ["ui-soft-in"], "Toast In"),

  // 09 Page-Screen — Phase 10
  row("EVT_PAGE_PUSH", "Page-Screen", "STANDARD", "standard", false, "Full-page push using UI Push math", 10, true, ["ui-whoosh-soft"], "Page Push"),
  row("EVT_PAGE_FADE", "Page-Screen", "SMOOTH", "subtle", false, "Full-page fade", 10, true, ["ui-cross"], "Page Fade"),
  row("EVT_SCREEN_SWAP", "Page-Screen", "STANDARD", "standard", false, "Replace screen, keep app chrome", 10, true, ["ui-whoosh-soft"], "Screen Swap"),
  row("EVT_NAV_FORWARD", "Page-Screen", "STANDARD", "standard", false, "Forward in an IA stack", 10, true, ["ui-whoosh-soft"], "Nav Forward"),
  row("EVT_NAV_BACK", "Page-Screen", "STANDARD", "standard", false, "Back in an IA stack", 10, true, ["ui-whoosh-soft"], "Nav Back"),
  row("EVT_TAB_CROSS", "Page-Screen", "FAST", "subtle", false, "Tab content crossfade", 10, true, ["ui-cross"], "Tab Cross"),

  // 10 Wipe-Split
  row("EVT_WIPE_SOFT_L", "Wipe-Split", "STANDARD", "subtle", false, "Soft left wipe — no hard bar", 11, false, []),
  row("EVT_WIPE_SOFT_R", "Wipe-Split", "STANDARD", "subtle", false, "Soft right wipe", 11, false, []),
  row("EVT_SPLIT_H", "Wipe-Split", "STANDARD", "standard", false, "Horizontal split reveal", 11, false, []),
  row("EVT_SPLIT_V", "Wipe-Split", "STANDARD", "standard", false, "Vertical split reveal", 11, false, []),
  row("EVT_WIPE_GRADIENT", "Wipe-Split", "SMOOTH", "subtle", false, "Native gradient wipe, Apple ease", 11, false, []),
  row("EVT_SPLIT_REVEAL", "Wipe-Split", "SMOOTH", "subtle", false, "Center split, incoming in the gap", 11, false, []),

  // 11 Shared-Element — Phase 12
  row("EVT_SHARED_CARD", "Shared-Element", "SMOOTH", "standard", true, "Card bounds morph to detail", 12, true, ["ui-whoosh-soft"], "Shared Card"),
  row("EVT_SHARED_IMAGE", "Shared-Element", "SMOOTH", "standard", true, "Image hero → gallery", 12, true, ["ui-whoosh-soft"], "Shared Image"),
  row("EVT_MATCH_CUT", "Shared-Element", "FAST", "subtle", true, "Match position/scale, cut the rest", 12, true, ["ui-cross"], "Match Cut"),
  row("EVT_MORPH_BOUNDS", "Shared-Element", "STANDARD", "standard", true, "Rect morph only (no mesh)", 12, true, ["ui-cross"], "Morph Bounds"),
  row("EVT_HERO_TO_DETAIL", "Shared-Element", "SMOOTH", "standard", true, "Marketing hero into app UI", 12, true, ["ui-whoosh-soft"], "Hero to Detail"),
  row("EVT_LIST_TO_DETAIL", "Shared-Element", "STANDARD", "standard", true, "Row expands into detail pane", 12, true, ["ui-whoosh-soft"], "List to Detail"),

  // 12 Stagger-Cascade — Phase 13
  row("EVT_STAGGER_CARDS", "Stagger-Cascade", "STANDARD", "subtle", false, "Card row stagger in", 13, true, ["ui-soft-in"], "Stagger Cards"),
  row("EVT_STAGGER_LIST", "Stagger-Cascade", "STANDARD", "subtle", false, "List rows cascade", 13, true, ["ui-soft-in"], "Stagger List"),
  row("EVT_CASCADE_IN", "Stagger-Cascade", "SMOOTH", "subtle", false, "Tree / nav cascade in", 13, true, ["ui-soft-in"], "Cascade In"),
  row("EVT_CASCADE_OUT", "Stagger-Cascade", "FAST", "subtle", false, "Cascade out", 13, true, ["ui-soft-in"], "Cascade Out"),
  row("EVT_STAGGER_FADE", "Stagger-Cascade", "STANDARD", "subtle", false, "Opacity-only stagger", 13, true, ["ui-cross"], "Stagger Fade"),
  row("EVT_WAVE_SOFT", "Stagger-Cascade", "SMOOTH", "subtle", false, "Soft delay wave, no bounce", 13, true, ["ui-soft-in"], "Wave Soft"),

  // 13 Camera-Dolly
  row("EVT_CAM_DOLLY_IN", "Camera-Dolly", "SMOOTH", "subtle", false, "Slow push on the UI plate", 14, false, []),
  row("EVT_CAM_DOLLY_OUT", "Camera-Dolly", "SMOOTH", "subtle", false, "Slow pull", 14, false, []),
  row("EVT_CAM_PAN_SOFT", "Camera-Dolly", "STANDARD", "subtle", false, "Small pan, no whip", 14, false, []),
  row("EVT_CAM_DRIFT", "Camera-Dolly", "HERO", "subtle", false, "Interview / hold drift", 14, false, []),
  row("EVT_CAM_REFRAME", "Camera-Dolly", "STANDARD", "standard", true, "Reframe to a target", 14, false, []),
  row("EVT_CAM_MICRO", "Camera-Dolly", "MICRO", "subtle", false, "Sub-8px settle", 14, false, []),

  // 14 Glass-Frost
  row("EVT_GLASS_IN", "Glass-Frost", "STANDARD", "subtle", false, "Frosted plate fades in", 15, false, []),
  row("EVT_GLASS_OUT", "Glass-Frost", "FAST", "subtle", false, "Frosted plate out", 15, false, []),
  row("EVT_FROST_REVEAL", "Glass-Frost", "SMOOTH", "subtle", false, "Blur + tint reveal", 15, false, []),
  row("EVT_GLASS_DIM", "Glass-Frost", "FAST", "subtle", false, "Glass dim over content", 15, false, []),
  row("EVT_BLUR_PANEL", "Glass-Frost", "STANDARD", "subtle", false, "Native frost panel (Phase 2 glass)", 15, false, []),
  row("EVT_GLASS_CROSS", "Glass-Frost", "SMOOTH", "subtle", false, "Cross through frost", 15, false, []),

  // 15 Hero
  row("EVT_HERO_ENTER", "Hero", "HERO", "standard", false, "Product hero in — long settle", 16, false, []),
  row("EVT_HERO_HOLD", "Hero", "HERO", "subtle", false, "Hold with micro drift", 16, false, []),
  row("EVT_HERO_EXIT", "Hero", "SMOOTH", "standard", false, "Hero out into product UI", 16, false, []),
  row("EVT_HERO_ZOOM", "Hero", "HERO", "standard", true, "Hero zoom to a feature", 16, false, []),
  row("EVT_HERO_TITLE", "Hero", "SMOOTH", "subtle", false, "Title lockup into UI", 16, false, []),
  row("EVT_HERO_PRODUCT", "Hero", "HERO", "standard", false, "Device / dashboard hero", 16, false, []),

  // 16 Micro
  row("EVT_MICRO_HOVER", "Micro", "MICRO", "subtle", false, "Hover lift 1–2%", 17, false, []),
  row("EVT_MICRO_PRESS", "Micro", "MICRO", "subtle", false, "Click squash, then recover", 17, false, []),
  row("EVT_MICRO_TOGGLE", "Micro", "MICRO", "subtle", false, "Toggle thumb settle", 17, false, []),
  row("EVT_MICRO_CHECK", "Micro", "MICRO", "subtle", false, "Checkbox / check settle", 17, false, []),
  row("EVT_MICRO_BADGE", "Micro", "FAST", "subtle", false, "Badge pop, no bounce loop", 17, false, []),
  row("EVT_MICRO_COUNTER", "Micro", "FAST", "subtle", false, "KPI digit change", 17, false, []),
  row("EVT_MICRO_FOCUS", "Micro", "MICRO", "subtle", false, "Focus ring / field focus", 17, false, []),
  row("EVT_MICRO_SNAP", "Micro", "MICRO", "standard", false, "Snap into grid / alignment", 17, false, [])
];

const out = {
  version: "phase-13",
  style: STYLE,
  aspectRatios: ASPECT,
  generated: "transitions/Metadata/catalog.json",
  note: "Phase 13 implements the Stagger-Cascade family (plus Phase 2–4 UI Push / UI-Slide / Scale-Zoom, Phase 9 Overlay-Modal, Phase 10 Page-Screen, and Phase 12 Shared-Element). Other rows are metadata for later phases and AI pairing.",
  transitions: transitions
};

const dest = path.join(__dirname, "..", "transitions", "Metadata", "catalog.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
process.stdout.write("wrote " + dest + " (" + transitions.length + " transitions)\n");
