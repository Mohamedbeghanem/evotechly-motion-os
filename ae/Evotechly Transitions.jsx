#target aftereffects
/*
  Evotechly Transitions — companion ScriptUI (Transition Kit Phase 6 Mask-Reveal + Phase 13 Stagger-Cascade + Phase 10 Page-Screen + Phase 9 Overlay-Modal + Phase 12 Shared-Element + SaaS Assets P1 + P2b Charts/Devices).
  Window → Evotechly Transitions.
  Tabs: Transitions / Text / UI / Cursor / Charts.
  Numbers mirrored from core/transitions/*.js and core/assets/*.js — Node is source of truth.
  ExtendScript cannot require Node. Apply UI Push + UI-Slide + Scale-Zoom + Shared-Element + Overlay-Modal + Page-Screen + Stagger-Cascade + Mask-Reveal, P1 native assets, and P2b chart/device plates here.
  Native AE only. No .ffx / .aep / vendor plugins.
  Does not replace Evotechly Motion OS v0.32 (~297 KB).
*/
(function (thisObj) {
  var CONTROL_NAME = "EVOTECHLY_TRANSITION_CONTROL";
  var STYLE = "premium-saas";
  var ANTICIPATE_RATIO = 0.04;
  var OVERSHOOT_CAP = 24;
  var DEFAULT_FPS = 30;
  var EASING_IDS = ["premium-smooth", "apple-smooth", "fast-product", "soft-ui", "snappy", "elastic-micro"];
  var TIMING_DEFAULTS = { MICRO: 6, FAST: 10, STANDARD: 15, SMOOTH: 21, HERO: 30 };
  var CATEGORIES = ["All", "UI-Push", "UI-Slide", "Scale-Zoom", "Crossfade", "Mask-Reveal", "Blur-Focus", "Depth-Parallax", "Overlay-Modal", "Page-Screen", "Wipe-Split", "Shared-Element", "Stagger-Cascade", "Camera-Dolly", "Glass-Frost", "Hero", "Micro"];
  var DIRS = ["left", "right", "up", "down"];
  var IMPLEMENTED = {
    EVT_UI_PUSH_LEFT: 1,
    EVT_UI_PUSH_RIGHT: 1,
    EVT_UI_PUSH_UP: 1,
    EVT_UI_PUSH_DOWN: 1,
    EVT_UI_PUSH_SCALE: 1,
    EVT_UI_PUSH_DEPTH: 1,
    EVT_UI_PUSH_SOFT: 1,
    EVT_UI_PUSH_SNAP: 1,
    EVT_UI_PUSH_OVERSHOOT: 1,
    EVT_UI_PUSH_PARALLAX: 1,
    EVT_UI_PUSH_FADE: 1,
    EVT_UI_PUSH_COVER: 1,
    EVT_UI_PUSH_PANEL: 1,
    EVT_UI_PUSH_DASHBOARD: 1,
    EVT_UI_PUSH_SPLIT: 1,
    EVT_SLIDE_CARD_LEFT: 1,
    EVT_SLIDE_CARD_RIGHT: 1,
    EVT_SLIDE_PANEL_IN: 1,
    EVT_SLIDE_PANEL_OUT: 1,
    EVT_SLIDE_DRAWER: 1,
    EVT_SLIDE_SHEET_UP: 1,
    EVT_SLIDE_STACK: 1,
    EVT_SLIDE_PEEK: 1,
    EVT_ZOOM_IN: 1,
    EVT_ZOOM_OUT: 1,
    EVT_ZOOM_TARGET: 1,
    EVT_ZOOM_MATCH: 1,
    EVT_SCALE_POP: 1,
    EVT_SCALE_BREATHE: 1,
    EVT_SCALE_PUNCH: 1,
    EVT_SCALE_SETTLE: 1,
    EVT_SHARED_CARD: 1,
    EVT_SHARED_IMAGE: 1,
    EVT_MATCH_CUT: 1,
    EVT_MORPH_BOUNDS: 1,
    EVT_HERO_TO_DETAIL: 1,
    EVT_LIST_TO_DETAIL: 1,
    EVT_MODAL_IN: 1,
    EVT_MODAL_OUT: 1,
    EVT_SHEET_UP: 1,
    EVT_SHEET_DOWN: 1,
    EVT_OVERLAY_DIM: 1,
    EVT_POPOVER_IN: 1,
    EVT_TOAST_IN: 1,
    EVT_PAGE_PUSH: 1,
    EVT_PAGE_FADE: 1,
    EVT_SCREEN_SWAP: 1,
    EVT_NAV_FORWARD: 1,
    EVT_NAV_BACK: 1,
    EVT_TAB_CROSS: 1,
    EVT_STAGGER_CARDS: 1,
    EVT_STAGGER_LIST: 1,
    EVT_CASCADE_IN: 1,
    EVT_CASCADE_OUT: 1,
    EVT_STAGGER_FADE: 1,
    EVT_WAVE_SOFT: 1,
    EVT_MASK_CIRCLE: 1,
    EVT_MASK_RECT: 1,
    EVT_MASK_SOFT_EDGE: 1,
    EVT_MASK_EXPAND: 1,
    EVT_REVEAL_IRIS: 1,
    EVT_REVEAL_WIPE_SOFT: 1
  };
  /* influence pairs match core/transitions/easing.js + polish.js */
  var EASE = {
    "premium-smooth": { i: 88, o: 14 },
    "apple-smooth": { i: 80, o: 18 },
    "fast-product": { i: 72, o: 12 },
    "soft-ui": { i: 40, o: 40 },
    snappy: { i: 55, o: 8 },
    "elastic-micro": { i: 35, o: 78 },
    apple: { i: 80, o: 18 },
    soft: { i: 40, o: 40 },
    linear: { i: 16, o: 16 }
  };
  var CATALOG = [
    { id: "EVT_UI_PUSH_LEFT", name: "UI Push Left", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Dashboard → next screen, iOS-style push left" },
    { id: "EVT_UI_PUSH_RIGHT", name: "UI Push Right", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Back navigation, previous screen from the left" },
    { id: "EVT_UI_PUSH_UP", name: "UI Push Up", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Sheet-like screen rise, settings stack" },
    { id: "EVT_UI_PUSH_DOWN", name: "UI Push Down", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Dismiss upward stack, close overlay screen" },
    { id: "EVT_UI_PUSH_SCALE", name: "UI Push + Scale", category: "UI-Push", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 1, bestUse: "Card or modal swap without a hard slide" },
    { id: "EVT_UI_PUSH_DEPTH", name: "UI Push + Depth", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 1, bestUse: "Recede outgoing, lift incoming — product tour" },
    { id: "EVT_UI_PUSH_SOFT", name: "UI Push Soft", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 2, bestUse: "Same as left with longer settle" },
    { id: "EVT_UI_PUSH_SNAP", name: "UI Push Snap", category: "UI-Push", duration: "FAST", intensity: "bold", implemented: true, phase: 2, bestUse: "Short product chrome, tab-to-tab" },
    { id: "EVT_UI_PUSH_OVERSHOOT", name: "UI Push Overshoot", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 2, bestUse: "Push with a quieter elastic settle" },
    { id: "EVT_UI_PUSH_PARALLAX", name: "UI Push Parallax", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 2, bestUse: "Foreground moves more than background" },
    { id: "EVT_UI_PUSH_FADE", name: "UI Push Fade", category: "UI-Push", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 2, bestUse: "Push plus crossfade for busy UI" },
    { id: "EVT_UI_PUSH_COVER", name: "UI Push Cover", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 2, bestUse: "Incoming covers outgoing; outgoing stays" },
    { id: "EVT_UI_PUSH_PANEL", name: "Panel Push", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 2, bestUse: "Inspector / side panel covers content from the trailing edge" },
    { id: "EVT_UI_PUSH_DASHBOARD", name: "Dashboard Push", category: "UI-Push", duration: "SMOOTH", intensity: "standard", implemented: true, phase: 2, bestUse: "Dashboard → next view with a quiet depth push" },
    { id: "EVT_UI_PUSH_SPLIT", name: "Split Panel Push", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 2, bestUse: "Master–detail split: panes part, incoming takes the open half" },
    { id: "EVT_SLIDE_CARD_LEFT", name: "Slide Card Left", category: "UI-Slide", duration: "FAST", intensity: "subtle", implemented: true, phase: 3, bestUse: "Single card enters from right" },
    { id: "EVT_SLIDE_CARD_RIGHT", name: "Slide Card Right", category: "UI-Slide", duration: "FAST", intensity: "subtle", implemented: true, phase: 3, bestUse: "Single card enters from left" },
    { id: "EVT_SLIDE_PANEL_IN", name: "Slide Panel In", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: true, phase: 3, bestUse: "Side panel / inspector in" },
    { id: "EVT_SLIDE_PANEL_OUT", name: "Slide Panel Out", category: "UI-Slide", duration: "FAST", intensity: "standard", implemented: true, phase: 3, bestUse: "Side panel dismiss" },
    { id: "EVT_SLIDE_DRAWER", name: "Slide Drawer", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: true, phase: 3, bestUse: "Nav drawer from leading edge" },
    { id: "EVT_SLIDE_SHEET_UP", name: "Slide Sheet Up", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: true, phase: 3, bestUse: "Bottom sheet present" },
    { id: "EVT_SLIDE_STACK", name: "Slide Stack", category: "UI-Slide", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 3, bestUse: "Card stack peek + commit" },
    { id: "EVT_SLIDE_PEEK", name: "Slide Peek", category: "UI-Slide", duration: "MICRO", intensity: "subtle", implemented: true, phase: 3, bestUse: "Partial reveal, then hold" },
    { id: "EVT_ZOOM_IN", name: "Zoom In", category: "Scale-Zoom", duration: "STANDARD", intensity: "standard", implemented: true, phase: 4, bestUse: "Plate scales up into frame" },
    { id: "EVT_ZOOM_OUT", name: "Zoom Out", category: "Scale-Zoom", duration: "STANDARD", intensity: "standard", implemented: true, phase: 4, bestUse: "Pull back to context" },
    { id: "EVT_ZOOM_TARGET", name: "Zoom Target", category: "Scale-Zoom", duration: "SMOOTH", intensity: "standard", implemented: true, phase: 4, bestUse: "Frame a selected region (target required)" },
    { id: "EVT_ZOOM_MATCH", name: "Zoom Match", category: "Scale-Zoom", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 4, bestUse: "Match outgoing crop to incoming" },
    { id: "EVT_SCALE_POP", name: "Scale Pop", category: "Scale-Zoom", duration: "FAST", intensity: "standard", implemented: true, phase: 4, bestUse: "90→100 card present" },
    { id: "EVT_SCALE_BREATHE", name: "Scale Breathe", category: "Scale-Zoom", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 4, bestUse: "Idle 100→102→100 — use sparingly" },
    { id: "EVT_SCALE_PUNCH", name: "Scale Punch", category: "Scale-Zoom", duration: "FAST", intensity: "bold", implemented: true, phase: 4, bestUse: "Short punch-in on a KPI" },
    { id: "EVT_SCALE_SETTLE", name: "Scale Settle", category: "Scale-Zoom", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 4, bestUse: "Oversize incoming eases to 100" },
    { id: "EVT_FADE_CROSS", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "Opacity swap, no travel" },
    { id: "EVT_FADE_SOFT", category: "Crossfade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 5, bestUse: "Longer dissolve for dense UI" },
    { id: "EVT_FADE_HOLD", category: "Crossfade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 5, bestUse: "Crossfade with a still hold" },
    { id: "EVT_FADE_DIP", category: "Crossfade", duration: "FAST", intensity: "standard", implemented: false, phase: 5, bestUse: "Brief dip to brand fill, then in" },
    { id: "EVT_DISSOLVE_UI", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "UI plate dissolve, keep chrome" },
    { id: "EVT_DISSOLVE_COLOR", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "Tinted dissolve, one brand color" },
    { id: "EVT_MASK_CIRCLE", name: "Mask Circle", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: true, phase: 6, bestUse: "Soft circular reveal on a card" },
    { id: "EVT_MASK_RECT", name: "Mask Rect", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: true, phase: 6, bestUse: "Rounded-rect expand" },
    { id: "EVT_MASK_SOFT_EDGE", name: "Mask Soft Edge", category: "Mask-Reveal", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 6, bestUse: "Feathered matte, no hard wipe" },
    { id: "EVT_MASK_EXPAND", name: "Mask Expand", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: true, phase: 6, bestUse: "Mask expansion from center" },
    { id: "EVT_REVEAL_IRIS", name: "Reveal Iris", category: "Mask-Reveal", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 6, bestUse: "Quiet iris on a screenshot" },
    { id: "EVT_REVEAL_WIPE_SOFT", name: "Reveal Wipe Soft", category: "Mask-Reveal", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 6, bestUse: "Soft directional matte, not a bar wipe" },
    { id: "EVT_BLUR_FOCUS", category: "Blur-Focus", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 7, bestUse: "Outgoing blurs as incoming sharpens" },
    { id: "EVT_BLUR_PULL", category: "Blur-Focus", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 7, bestUse: "Focus pull toward the incoming plate" },
    { id: "EVT_BLUR_CROSS", category: "Blur-Focus", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 7, bestUse: "Mid-cross blur, both plates" },
    { id: "EVT_FOCUS_RACK", category: "Blur-Focus", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 7, bestUse: "Rack between two depths" },
    { id: "EVT_FOCUS_TARGET", category: "Blur-Focus", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 7, bestUse: "Sharpen the framed target" },
    { id: "EVT_BLUR_LIFT", category: "Blur-Focus", duration: "FAST", intensity: "subtle", implemented: false, phase: 7, bestUse: "Un-blur a frosted panel" },
    { id: "EVT_DEPTH_PUSH", category: "Depth-Parallax", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 8, bestUse: "Layers recede on Z-feel (scale+blur)" },
    { id: "EVT_DEPTH_PULL", category: "Depth-Parallax", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 8, bestUse: "Layers approach" },
    { id: "EVT_PARALLAX_X", category: "Depth-Parallax", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 8, bestUse: "Horizontal parallax, small travel" },
    { id: "EVT_PARALLAX_Y", category: "Depth-Parallax", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 8, bestUse: "Vertical parallax, small travel" },
    { id: "EVT_DEPTH_STACK", category: "Depth-Parallax", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 8, bestUse: "Card stack depth sort" },
    { id: "EVT_DEPTH_CARD", category: "Depth-Parallax", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 8, bestUse: "One card lifts off a grid" },
    { id: "EVT_MODAL_IN", name: "Modal In", category: "Overlay-Modal", duration: "STANDARD", intensity: "standard", implemented: true, phase: 9, bestUse: "Dialog present + dim" },
    { id: "EVT_MODAL_OUT", name: "Modal Out", category: "Overlay-Modal", duration: "FAST", intensity: "standard", implemented: true, phase: 9, bestUse: "Dialog dismiss" },
    { id: "EVT_SHEET_UP", name: "Sheet Up", category: "Overlay-Modal", duration: "STANDARD", intensity: "standard", implemented: true, phase: 9, bestUse: "Modal sheet from bottom" },
    { id: "EVT_SHEET_DOWN", name: "Sheet Down", category: "Overlay-Modal", duration: "FAST", intensity: "standard", implemented: true, phase: 9, bestUse: "Sheet dismiss" },
    { id: "EVT_OVERLAY_DIM", name: "Overlay Dim", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: true, phase: 9, bestUse: "Dim plate only" },
    { id: "EVT_POPOVER_IN", name: "Popover In", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: true, phase: 9, bestUse: "Popover from a target" },
    { id: "EVT_TOAST_IN", name: "Toast In", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: true, phase: 9, bestUse: "Toast from edge, then settle" },
    { id: "EVT_PAGE_PUSH", name: "Page Push", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: true, phase: 10, bestUse: "Full-page push using UI Push math" },
    { id: "EVT_PAGE_FADE", name: "Page Fade", category: "Page-Screen", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 10, bestUse: "Full-page fade" },
    { id: "EVT_SCREEN_SWAP", name: "Screen Swap", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: true, phase: 10, bestUse: "Replace screen, keep app chrome" },
    { id: "EVT_NAV_FORWARD", name: "Nav Forward", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: true, phase: 10, bestUse: "Forward in an IA stack" },
    { id: "EVT_NAV_BACK", name: "Nav Back", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: true, phase: 10, bestUse: "Back in an IA stack" },
    { id: "EVT_TAB_CROSS", name: "Tab Cross", category: "Page-Screen", duration: "FAST", intensity: "subtle", implemented: true, phase: 10, bestUse: "Tab content crossfade" },
    { id: "EVT_WIPE_SOFT_L", category: "Wipe-Split", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 11, bestUse: "Soft left wipe — no hard bar" },
    { id: "EVT_WIPE_SOFT_R", category: "Wipe-Split", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 11, bestUse: "Soft right wipe" },
    { id: "EVT_SPLIT_H", category: "Wipe-Split", duration: "STANDARD", intensity: "standard", implemented: false, phase: 11, bestUse: "Horizontal split reveal" },
    { id: "EVT_SPLIT_V", category: "Wipe-Split", duration: "STANDARD", intensity: "standard", implemented: false, phase: 11, bestUse: "Vertical split reveal" },
    { id: "EVT_WIPE_GRADIENT", category: "Wipe-Split", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 11, bestUse: "Native gradient wipe, Apple ease" },
    { id: "EVT_SPLIT_REVEAL", category: "Wipe-Split", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 11, bestUse: "Center split, incoming in the gap" },
    { id: "EVT_SHARED_CARD", name: "Shared Card", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: true, phase: 12, bestUse: "Card bounds morph to detail" },
    { id: "EVT_SHARED_IMAGE", name: "Shared Image", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: true, phase: 12, bestUse: "Image hero → gallery" },
    { id: "EVT_MATCH_CUT", name: "Match Cut", category: "Shared-Element", duration: "FAST", intensity: "subtle", implemented: true, phase: 12, bestUse: "Match position/scale, cut the rest" },
    { id: "EVT_MORPH_BOUNDS", name: "Morph Bounds", category: "Shared-Element", duration: "STANDARD", intensity: "standard", implemented: true, phase: 12, bestUse: "Rect morph only (no mesh)" },
    { id: "EVT_HERO_TO_DETAIL", name: "Hero to Detail", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: true, phase: 12, bestUse: "Marketing hero into app UI" },
    { id: "EVT_LIST_TO_DETAIL", name: "List to Detail", category: "Shared-Element", duration: "STANDARD", intensity: "standard", implemented: true, phase: 12, bestUse: "Row expands into detail pane" },
    { id: "EVT_STAGGER_CARDS", name: "Stagger Cards", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 13, bestUse: "Card row stagger in" },
    { id: "EVT_STAGGER_LIST", name: "Stagger List", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 13, bestUse: "List rows cascade" },
    { id: "EVT_CASCADE_IN", name: "Cascade In", category: "Stagger-Cascade", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 13, bestUse: "Tree / nav cascade in" },
    { id: "EVT_CASCADE_OUT", name: "Cascade Out", category: "Stagger-Cascade", duration: "FAST", intensity: "subtle", implemented: true, phase: 13, bestUse: "Cascade out" },
    { id: "EVT_STAGGER_FADE", name: "Stagger Fade", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 13, bestUse: "Opacity-only stagger" },
    { id: "EVT_WAVE_SOFT", name: "Wave Soft", category: "Stagger-Cascade", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 13, bestUse: "Soft delay wave, no bounce" },
    { id: "EVT_CAM_DOLLY_IN", category: "Camera-Dolly", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 14, bestUse: "Slow push on the UI plate" },
    { id: "EVT_CAM_DOLLY_OUT", category: "Camera-Dolly", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 14, bestUse: "Slow pull" },
    { id: "EVT_CAM_PAN_SOFT", category: "Camera-Dolly", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 14, bestUse: "Small pan, no whip" },
    { id: "EVT_CAM_DRIFT", category: "Camera-Dolly", duration: "HERO", intensity: "subtle", implemented: false, phase: 14, bestUse: "Interview / hold drift" },
    { id: "EVT_CAM_REFRAME", category: "Camera-Dolly", duration: "STANDARD", intensity: "standard", implemented: false, phase: 14, bestUse: "Reframe to a target" },
    { id: "EVT_CAM_MICRO", category: "Camera-Dolly", duration: "MICRO", intensity: "subtle", implemented: false, phase: 14, bestUse: "Sub-8px settle" },
    { id: "EVT_GLASS_IN", category: "Glass-Frost", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 15, bestUse: "Frosted plate fades in" },
    { id: "EVT_GLASS_OUT", category: "Glass-Frost", duration: "FAST", intensity: "subtle", implemented: false, phase: 15, bestUse: "Frosted plate out" },
    { id: "EVT_FROST_REVEAL", category: "Glass-Frost", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 15, bestUse: "Blur + tint reveal" },
    { id: "EVT_GLASS_DIM", category: "Glass-Frost", duration: "FAST", intensity: "subtle", implemented: false, phase: 15, bestUse: "Glass dim over content" },
    { id: "EVT_BLUR_PANEL", category: "Glass-Frost", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 15, bestUse: "Native frost panel (Phase 2 glass)" },
    { id: "EVT_GLASS_CROSS", category: "Glass-Frost", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 15, bestUse: "Cross through frost" },
    { id: "EVT_HERO_ENTER", category: "Hero", duration: "HERO", intensity: "standard", implemented: false, phase: 16, bestUse: "Product hero in — long settle" },
    { id: "EVT_HERO_HOLD", category: "Hero", duration: "HERO", intensity: "subtle", implemented: false, phase: 16, bestUse: "Hold with micro drift" },
    { id: "EVT_HERO_EXIT", category: "Hero", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 16, bestUse: "Hero out into product UI" },
    { id: "EVT_HERO_ZOOM", category: "Hero", duration: "HERO", intensity: "standard", implemented: false, phase: 16, bestUse: "Hero zoom to a feature" },
    { id: "EVT_HERO_TITLE", category: "Hero", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 16, bestUse: "Title lockup into UI" },
    { id: "EVT_HERO_PRODUCT", category: "Hero", duration: "HERO", intensity: "standard", implemented: false, phase: 16, bestUse: "Device / dashboard hero" },
    { id: "EVT_MICRO_HOVER", category: "Micro", duration: "MICRO", intensity: "subtle", implemented: false, phase: 17, bestUse: "Hover lift 1–2%" },
    { id: "EVT_MICRO_PRESS", category: "Micro", duration: "MICRO", intensity: "subtle", implemented: false, phase: 17, bestUse: "Click squash, then recover" },
    { id: "EVT_MICRO_TOGGLE", category: "Micro", duration: "MICRO", intensity: "subtle", implemented: false, phase: 17, bestUse: "Toggle thumb settle" },
    { id: "EVT_MICRO_CHECK", category: "Micro", duration: "MICRO", intensity: "subtle", implemented: false, phase: 17, bestUse: "Checkbox / check settle" },
    { id: "EVT_MICRO_BADGE", category: "Micro", duration: "FAST", intensity: "subtle", implemented: false, phase: 17, bestUse: "Badge pop, no bounce loop" },
    { id: "EVT_MICRO_COUNTER", category: "Micro", duration: "FAST", intensity: "subtle", implemented: false, phase: 17, bestUse: "KPI digit change" },
    { id: "EVT_MICRO_FOCUS", category: "Micro", duration: "MICRO", intensity: "subtle", implemented: false, phase: 17, bestUse: "Focus ring / field focus" },
    { id: "EVT_MICRO_SNAP", category: "Micro", duration: "MICRO", intensity: "standard", implemented: false, phase: 17, bestUse: "Snap into grid / alignment" }
  ];
  var TEXT_CATALOG = [
    { id: "EVT_TEXT_FADE_UP", name: "Text Fade Up", category: "Text", duration: "FAST", implemented: true, bestUse: "Quiet line in, 8–12 px lift" },
    { id: "EVT_TEXT_FADE_DOWN", name: "Text Fade Down", category: "Text", duration: "FAST", implemented: true, bestUse: "Caption drop-in from above" },
    { id: "EVT_TEXT_MASK_REVEAL", name: "Text Mask Reveal", category: "Text", duration: "STANDARD", implemented: true, bestUse: "Soft matte expand, no hard wipe" },
    { id: "EVT_TEXT_WORD_REVEAL", name: "Word Reveal", category: "Text", duration: "STANDARD", implemented: true, bestUse: "Product sentence, word selector" },
    { id: "EVT_TEXT_LINE_REVEAL", name: "Line Reveal", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Stacked headline, line selector" },
    { id: "EVT_TEXT_CHAR_REVEAL", name: "Character Reveal", category: "Text", duration: "STANDARD", implemented: true, bestUse: "Restrained type-on, char selector" },
    { id: "EVT_TEXT_BLUR_IN", name: "Text Blur In", category: "Text", duration: "STANDARD", implemented: true, bestUse: "Focus pull onto a title" },
    { id: "EVT_TEXT_BLUR_OUT", name: "Text Blur Out", category: "Text", duration: "FAST", implemented: true, bestUse: "Title leaves into blur" },
    { id: "EVT_TEXT_SCALE_IN", name: "Text Scale In", category: "Text", duration: "FAST", implemented: true, bestUse: "94→100 present, no pop bounce" },
    { id: "EVT_TEXT_SLIDE_IN", name: "Text Slide In", category: "Text", duration: "FAST", implemented: true, bestUse: "Short lateral enter, 16–20 px" },
    { id: "EVT_TEXT_TRACKING_REVEAL", name: "Tracking Reveal", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Tracking 28→0 with fade" },
    { id: "EVT_TEXT_HEADLINE_REVEAL", name: "Headline Reveal", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Hero title: char + slight scale settle" },
    { id: "EVT_TEXT_SUBTITLE_REVEAL", name: "Subtitle Reveal", category: "Text", duration: "FAST", implemented: true, bestUse: "Supporting line, word unit" },
    { id: "EVT_TEXT_KINETIC_HEADLINE", name: "Kinetic Headline", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Restrained tracking + lift — not glitch" },
    { id: "EVT_TEXT_SWAP", name: "Text Swap", category: "Text", duration: "STANDARD", implemented: true, bestUse: "Replace a label, outgoing up / incoming up" },
    { id: "EVT_TEXT_NUMBER_COUNTER", name: "Number Counter", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "KPI integer count-up" },
    { id: "EVT_TEXT_PCT_COUNTER", name: "Percent Counter", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Conversion / growth %" },
    { id: "EVT_TEXT_METRIC_COUNTER", name: "Metric Counter", category: "Text", duration: "SMOOTH", implemented: true, bestUse: "Prefixed SaaS metric ($12.4k)" }
  ];
  var UI_ELEMENTS = {
    button: { x: 0, y: 6, enterScale: 98, hoverScale: 102, hoverY: -2, clickScale: 96, expandSy: 92 },
    card: { x: 0, y: 12, enterScale: 97, hoverScale: 101.4, hoverY: -4, clickScale: 98.5, expandSy: 88 },
    modal: { x: 0, y: 14, enterScale: 96, hoverScale: 100.6, hoverY: -2, clickScale: 98, expandSy: 86 },
    tooltip: { x: 0, y: 4, enterScale: 98, hoverScale: 101, hoverY: -2, clickScale: 98, expandSy: 94 },
    dropdown: { x: 0, y: -8, enterScale: 99, hoverScale: 100.4, hoverY: -1, clickScale: 99, expandSy: 72 },
    sidebar: { x: 24, y: 0, enterScale: 100, hoverScale: 100.4, hoverY: 0, clickScale: 99, expandSy: 100 },
    nav: { x: 0, y: 4, enterScale: 100, hoverScale: 100.8, hoverY: -1, clickScale: 98.5, expandSy: 100 },
    tabs: { x: 0, y: 0, enterScale: 100, hoverScale: 100.6, hoverY: -1, clickScale: 98, expandSy: 100 },
    row: { x: 8, y: 0, enterScale: 100, hoverScale: 100.5, hoverY: 0, clickScale: 99, expandSy: 100 },
    metric: { x: 0, y: 8, enterScale: 96, hoverScale: 101.2, hoverY: -2, clickScale: 98, expandSy: 100 },
    badge: { x: 0, y: 0, enterScale: 90, hoverScale: 104, hoverY: -1, clickScale: 94, expandSy: 100 },
    notification: { x: 16, y: 0, enterScale: 98, hoverScale: 100.6, hoverY: 0, clickScale: 98, expandSy: 90 },
    search: { x: 0, y: 0, enterScale: 98, hoverScale: 100.4, hoverY: 0, clickScale: 99, expandSy: 100 },
    avatar: { x: 0, y: 0, enterScale: 94, hoverScale: 103, hoverY: -1, clickScale: 96, expandSy: 100 }
  };
  var UI_CATALOG = [
    { id: "EVT_UI_BUTTON_ENTER", name: "Button Enter", element: "button", action: "enter", duration: "FAST" },
    { id: "EVT_UI_BUTTON_EXIT", name: "Button Exit", element: "button", action: "exit", duration: "FAST" },
    { id: "EVT_UI_BUTTON_HOVER", name: "Button Hover", element: "button", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_BUTTON_CLICK", name: "Button Click", element: "button", action: "click", duration: "FAST" },
    { id: "EVT_UI_CARD_ENTER", name: "Card Enter", element: "card", action: "enter", duration: "STANDARD" },
    { id: "EVT_UI_CARD_EXIT", name: "Card Exit", element: "card", action: "exit", duration: "STANDARD" },
    { id: "EVT_UI_CARD_HOVER", name: "Card Hover", element: "card", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_CARD_CLICK", name: "Card Click", element: "card", action: "click", duration: "FAST" },
    { id: "EVT_UI_CARD_EXPAND", name: "Card Expand", element: "card", action: "expand", duration: "STANDARD" },
    { id: "EVT_UI_CARD_COLLAPSE", name: "Card Collapse", element: "card", action: "collapse", duration: "STANDARD" },
    { id: "EVT_UI_MODAL_ENTER", name: "Modal Enter", element: "modal", action: "enter", duration: "STANDARD" },
    { id: "EVT_UI_MODAL_EXIT", name: "Modal Exit", element: "modal", action: "exit", duration: "STANDARD" },
    { id: "EVT_UI_MODAL_EXPAND", name: "Modal Expand", element: "modal", action: "expand", duration: "STANDARD" },
    { id: "EVT_UI_MODAL_COLLAPSE", name: "Modal Collapse", element: "modal", action: "collapse", duration: "STANDARD" },
    { id: "EVT_UI_TOOLTIP_ENTER", name: "Tooltip Enter", element: "tooltip", action: "enter", duration: "MICRO" },
    { id: "EVT_UI_TOOLTIP_EXIT", name: "Tooltip Exit", element: "tooltip", action: "exit", duration: "MICRO" },
    { id: "EVT_UI_TOOLTIP_HOVER", name: "Tooltip Hover", element: "tooltip", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_DROPDOWN_ENTER", name: "Dropdown Enter", element: "dropdown", action: "enter", duration: "FAST" },
    { id: "EVT_UI_DROPDOWN_EXIT", name: "Dropdown Exit", element: "dropdown", action: "exit", duration: "FAST" },
    { id: "EVT_UI_DROPDOWN_EXPAND", name: "Dropdown Expand", element: "dropdown", action: "expand", duration: "FAST" },
    { id: "EVT_UI_DROPDOWN_COLLAPSE", name: "Dropdown Collapse", element: "dropdown", action: "collapse", duration: "FAST" },
    { id: "EVT_UI_SIDEBAR_ENTER", name: "Sidebar Enter", element: "sidebar", action: "enter", duration: "STANDARD" },
    { id: "EVT_UI_SIDEBAR_EXIT", name: "Sidebar Exit", element: "sidebar", action: "exit", duration: "STANDARD" },
    { id: "EVT_UI_SIDEBAR_EXPAND", name: "Sidebar Expand", element: "sidebar", action: "expand", duration: "STANDARD" },
    { id: "EVT_UI_SIDEBAR_COLLAPSE", name: "Sidebar Collapse", element: "sidebar", action: "collapse", duration: "STANDARD" },
    { id: "EVT_UI_NAV_ENTER", name: "Nav Enter", element: "nav", action: "enter", duration: "FAST" },
    { id: "EVT_UI_NAV_EXIT", name: "Nav Exit", element: "nav", action: "exit", duration: "FAST" },
    { id: "EVT_UI_NAV_HOVER", name: "Nav Hover", element: "nav", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_TABS_ENTER", name: "Tabs Enter", element: "tabs", action: "enter", duration: "MICRO" },
    { id: "EVT_UI_TABS_CLICK", name: "Tabs Click", element: "tabs", action: "click", duration: "MICRO" },
    { id: "EVT_UI_ROW_ENTER", name: "Row Enter", element: "row", action: "enter", duration: "FAST" },
    { id: "EVT_UI_ROW_EXIT", name: "Row Exit", element: "row", action: "exit", duration: "FAST" },
    { id: "EVT_UI_ROW_HOVER", name: "Row Hover", element: "row", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_METRIC_ENTER", name: "Metric Enter", element: "metric", action: "enter", duration: "FAST" },
    { id: "EVT_UI_METRIC_HOVER", name: "Metric Hover", element: "metric", action: "hover", duration: "MICRO" },
    { id: "EVT_UI_BADGE_ENTER", name: "Badge Enter", element: "badge", action: "enter", duration: "MICRO" },
    { id: "EVT_UI_BADGE_EXIT", name: "Badge Exit", element: "badge", action: "exit", duration: "MICRO" },
    { id: "EVT_UI_NOTIFICATION_ENTER", name: "Notification Enter", element: "notification", action: "enter", duration: "FAST" },
    { id: "EVT_UI_NOTIFICATION_EXIT", name: "Notification Exit", element: "notification", action: "exit", duration: "FAST" },
    { id: "EVT_UI_SEARCH_ENTER", name: "Search Enter", element: "search", action: "enter", duration: "FAST" },
    { id: "EVT_UI_SEARCH_EXPAND", name: "Search Expand", element: "search", action: "expand", duration: "FAST" },
    { id: "EVT_UI_SEARCH_COLLAPSE", name: "Search Collapse", element: "search", action: "collapse", duration: "FAST" },
    { id: "EVT_UI_AVATAR_ENTER", name: "Avatar Enter", element: "avatar", action: "enter", duration: "MICRO" },
    { id: "EVT_UI_AVATAR_HOVER", name: "Avatar Hover", element: "avatar", action: "hover", duration: "MICRO" }
  ];
  var CURSOR_CATALOG = [
    { id: "EVT_CURSOR_MOVE", name: "Cursor Move", duration: "STANDARD", bestUse: "Pointer travels start → end" },
    { id: "EVT_CURSOR_CLICK", name: "Cursor Click", duration: "FAST", bestUse: "Move + single press dip" },
    { id: "EVT_CURSOR_DBLCLICK", name: "Cursor Double Click", duration: "FAST", bestUse: "Two press dips, 6-frame gap" },
    { id: "EVT_CURSOR_HOVER", name: "Cursor Hover", duration: "MICRO", bestUse: "Settle on target, 2% lift" },
    { id: "EVT_CURSOR_DRAG", name: "Cursor Drag", duration: "STANDARD", bestUse: "Pressed scale while traveling" },
    { id: "EVT_CURSOR_SWIPE", name: "Cursor Swipe", duration: "FAST", bestUse: "Short flick with quiet settle" },
    { id: "EVT_CURSOR_SELECT", name: "Cursor Select", duration: "STANDARD", bestUse: "Down, drag range, up" },
    { id: "EVT_CURSOR_RIPPLE", name: "Cursor Ripple", duration: "FAST", bestUse: "Optional click halo — opacity + scale only" }
  ];
  var CHART_CATALOG = [
    { id: "EVT_CHART_SERIES_ENTER", name: "Chart Series Enter", duration: "STANDARD", bestUse: "EvoCRM series / bars stagger in — 3f offset, 16px lift" },
    { id: "EVT_CHART_BAR_DRAW", name: "Chart Bar Draw", duration: "STANDARD", bestUse: "Horizontal bar grows scaleX 0→100, no bounce" },
    { id: "EVT_CHART_COLUMN_RISE", name: "Chart Column Rise", duration: "STANDARD", bestUse: "Vertical column rises scaleY 0→100" },
    { id: "EVT_CHART_LINE_REVEAL", name: "Chart Line Reveal", duration: "SMOOTH", bestUse: "Line draw — native trim path 0→100" },
    { id: "EVT_CHART_DONUT_FILL", name: "Chart Donut Fill", duration: "SMOOTH", bestUse: "Donut / arc fill to a percent, no spin" },
    { id: "EVT_CHART_KPI_COUNT", name: "Chart KPI Count", duration: "SMOOTH", bestUse: "KPI widget present + linear count-up (pairs with Text counters)" },
    { id: "EVT_CHART_FUNNEL_IN", name: "Chart Funnel In", duration: "STANDARD", bestUse: "Pipeline funnel stages stagger in" },
    { id: "EVT_CHART_SPARK", name: "Chart Spark", duration: "FAST", bestUse: "Activity sparkline draw" },
    { id: "EVT_DASH_WIDGET_IN", name: "Dash Widget In", duration: "FAST", bestUse: "Dashboard widget present — Scale-Zoom 90→100" },
    { id: "EVT_DEVICE_LAPTOP_IN", name: "Device Laptop In", duration: "STANDARD", bestUse: "Laptop frame present — not a 3D camera" },
    { id: "EVT_DEVICE_PHONE_IN", name: "Device Phone In", duration: "FAST", bestUse: "Phone frame present — not a 3D camera" }
  ];
  var iUi;
  for (iUi = 0; iUi < UI_CATALOG.length; iUi++) {
    UI_CATALOG[iUi].category = "UI";
    UI_CATALOG[iUi].implemented = true;
    UI_CATALOG[iUi].bestUse = UI_CATALOG[iUi].bestUse || (UI_CATALOG[iUi].element + " " + UI_CATALOG[iUi].action);
  }
  var iCur;
  for (iCur = 0; iCur < CURSOR_CATALOG.length; iCur++) {
    CURSOR_CATALOG[iCur].category = "Cursor";
    CURSOR_CATALOG[iCur].implemented = true;
  }
  var iCh;
  for (iCh = 0; iCh < CHART_CATALOG.length; iCh++) {
    CHART_CATALOG[iCh].category = "Charts";
    CHART_CATALOG[iCh].implemented = true;
  }
  var filtered = [];
  var assetFiltered = [];

  function clamp(n, lo, hi) {
    n = Number(n);
    if (n !== n) return lo;
    if (n < lo) return lo;
    if (n > hi) return hi;
    return n;
  }
  function round4(n) {
    return Math.round(Number(n) * 10000) / 10000;
  }
  function activeComp() {
    var c = app.project && app.project.activeItem;
    if (c && c instanceof CompItem) return c;
    return null;
  }
  function requireComp() {
    var c = activeComp();
    if (!c) alert("Open a composition first.");
    return c;
  }
  function selectedLayers(comp) {
    var out = [], i;
    for (i = 1; i <= comp.numLayers; i++) if (comp.layer(i).selected) out.push(comp.layer(i));
    return out;
  }
  function findLayer(comp, name) {
    var want = String(name || "").toLowerCase(), i;
    for (i = 1; i <= comp.numLayers; i++) if (String(comp.layer(i).name).toLowerCase() === want) return comp.layer(i);
    return null;
  }
  function durationFrames(group, fps) {
    var g = String(group || "STANDARD").toUpperCase();
    var frames30 = TIMING_DEFAULTS[g] || 15;
    var f = clamp(fps == null ? DEFAULT_FPS : fps, 1, 120);
    return Math.round(frames30 * (f / DEFAULT_FPS));
  }
  function secondsFromFrames(frames, fps) {
    return Number(frames) / (fps || DEFAULT_FPS);
  }
  function phaseFrames(d, profile) {
    var anticipate, mid, settle, anticipateR, midR, settleR;
    d = Math.max(2, Math.round(d));
    anticipateR = 0.125;
    midR = 0.5;
    settleR = 0.82;
    if (profile === "soft") {
      anticipateR = 0.14;
      midR = 0.44;
      settleR = 0.64;
    } else if (profile === "snap") {
      anticipateR = 0.08;
      midR = 0.5;
      settleR = 0.9;
    }
    anticipate = Math.max(1, Math.round(d * anticipateR));
    mid = Math.max(anticipate + 1, Math.round(d * midR));
    settle = Math.max(mid + 1, Math.round(d * settleR));
    return {
      start: 0,
      anticipate: Math.min(anticipate, d - 1),
      mid: Math.min(mid, d - 1),
      settle: Math.min(settle, d - 1),
      end: d
    };
  }
  function axisOf(dir) {
    if (dir === "right") return { x: 1, y: 0 };
    if (dir === "up") return { x: 0, y: -1 };
    if (dir === "down") return { x: 0, y: 1 };
    return { x: -1, y: 0 };
  }
  function easeInf(kind) {
    return EASE[kind] || EASE["premium-smooth"];
  }
  function applyEase(prop, kind) {
    if (!prop || !prop.numKeys) return;
    var inf = easeInf(kind), n = 1, t, k, ins, outs, j;
    try { t = prop.propertyValueType; } catch (e) { return; }
    if (t === PropertyValueType.TwoD || t === PropertyValueType.TwoD_SPATIAL) n = 2;
    if (t === PropertyValueType.ThreeD || t === PropertyValueType.ThreeD_SPATIAL) n = 3;
    for (k = 1; k <= prop.numKeys; k++) {
      try {
        ins = []; outs = [];
        for (j = 0; j < n; j++) {
          ins.push(new KeyframeEase(0, inf.i));
          outs.push(new KeyframeEase(0, inf.o));
        }
        prop.setTemporalEaseAtKey(k, ins, outs);
      } catch (err) {}
    }
  }
  function addSlider(layer, name, value) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
      fx.name = name;
      fx.property("ADBE Slider Control-0001").setValue(value);
    } catch (e) {}
    return fx;
  }
  function ensureSlider(layer, name, value) {
    var fx;
    try {
      fx = layer.property("ADBE Effect Parade").property(name);
      if (fx) {
        fx.property("ADBE Slider Control-0001").setValue(value);
        return fx;
      }
    } catch (e0) {}
    return addSlider(layer, name, value);
  }
  function findEffect(layer, names) {
    var i, fx;
    for (i = 0; i < names.length; i++) {
      try {
        fx = layer.property("ADBE Effect Parade").property(names[i]);
        if (fx) return fx;
      } catch (e0) {}
    }
    return null;
  }
  function tryEffect(layer, names) {
    var existing = findEffect(layer, names), i, fx;
    if (existing) return existing;
    for (i = 0; i < names.length; i++) {
      try {
        fx = layer.property("ADBE Effect Parade").addProperty(names[i]);
        if (fx) return fx;
      } catch (e) {}
    }
    return null;
  }
  function ensureControl(comp, frames, dirIndex, easeIndex) {
    var layer = findLayer(comp, CONTROL_NAME);
    if (!layer) {
      layer = comp.layers.addNull();
      layer.name = CONTROL_NAME;
    }
    try { layer.shy = true; } catch (e0) {}
    try { layer.guideLayer = true; } catch (e1) {}
    try { layer.label = 8; } catch (e2) {}
    ensureSlider(layer, "Progress", 0);
    ensureSlider(layer, "Duration", frames);
    ensureSlider(layer, "Direction", dirIndex);
    ensureSlider(layer, "Strength", 100);
    ensureSlider(layer, "Distance", 100);
    ensureSlider(layer, "Scale", 100);
    ensureSlider(layer, "TargetScale", 100);
    ensureSlider(layer, "Blur", 0);
    ensureSlider(layer, "Overshoot", 6);
    ensureSlider(layer, "Depth", 50);
    ensureSlider(layer, "Opacity", 100);
    ensureSlider(layer, "CornerRadius", 12);
    ensureSlider(layer, "MaskExpansion", 0);
    ensureSlider(layer, "Stagger", 3);
    ensureSlider(layer, "Settle", 20);
    ensureSlider(layer, "Easing", easeIndex);
    return layer;
  }
  function addMarker(comp, t, name, comment) {
    var mv;
    try {
      mv = new MarkerValue(name);
      mv.comment = comment || "SFX hook only — no audio shipped";
      comp.markerProperty.setValueAtTime(t, mv);
    } catch (e) {}
  }
  function setBlurKeys(layer, keys, t0, ease) {
    var fx, prop, i;
    fx = tryEffect(layer, ["ADBE Fast Box Blur", "Fast Box Blur", "ADBE Gaussian Blur 2", "Gaussian Blur"]);
    if (!fx) return;
    try { fx.property("Repeat Edge Pixels").setValue(true); } catch (e0) {}
    prop = fx.property("Blur Radius");
    if (!prop) {
      try { prop = fx.property("Blurriness"); } catch (e1) { prop = null; }
    }
    if (!prop) return;
    for (i = 0; i < keys.length; i++) prop.setValueAtTime(t0 + keys[i].t, keys[i].blur);
    applyEase(prop, ease);
  }
  function applyLayerKeys(layer, keys, t0, ease) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var rest = pos.value;
    var i, k, scaleVal;
    for (i = 0; i < keys.length; i++) {
      k = keys[i];
      pos.setValueAtTime(t0 + k.t, [rest[0] + k.x, rest[1] + k.y].concat(rest.length > 2 ? [rest[2]] : []));
      scaleVal = [k.sx, k.sy == null ? k.sx : k.sy];
      if (sc.value.length > 2) scaleVal = scaleVal.concat([sc.value[2]]);
      sc.setValueAtTime(t0 + k.t, scaleVal);
      op.setValueAtTime(t0 + k.t, k.opacity);
    }
    applyEase(pos, ease);
    applyEase(sc, ease);
    applyEase(op, ease);
    setBlurKeys(layer, keys, t0, ease);
  }
  function assetPhaseFrames(d) {
    d = Math.max(2, Math.round(d));
    return {
      start: 0,
      mid: Math.min(Math.max(1, Math.round(d * 0.45)), d - 1),
      settle: Math.min(Math.max(2, Math.round(d * 0.78)), d - 1),
      end: d
    };
  }
  function isTextLayer(layer) {
    try { return layer instanceof TextLayer; } catch (e) { return false; }
  }
  function addTextAnimator(layer, name) {
    var animators, anim;
    animators = layer.property("ADBE Text Properties").property("ADBE Text Animators");
    anim = animators.addProperty("ADBE Text Animator");
    try { anim.name = name; } catch (e) {}
    return anim;
  }
  function configureRangeEnd(anim, unit, keys, ease) {
    var sel, endP, i;
    try {
      sel = anim.property("ADBE Text Selectors").property(1);
      try { sel.property("ADBE Text Range Type2").setValue(unit); } catch (e0) {}
      try { sel.property("ADBE Text Range Shape").setValue(2); } catch (e1) {}
      try {
        endP = sel.property("ADBE Text Range End 2");
        if (!endP) endP = sel.property("End");
        for (i = 0; i < keys.length; i++) endP.setValueAtTime(keys[i].t, keys[i].end);
        applyEase(endP, ease);
      } catch (e2) {}
    } catch (e) {}
    return sel;
  }
  function rangeUnit(unit) {
    if (unit === "line") return 4;
    if (unit === "word") return 3;
    return 1;
  }
  function applyTextAnimator(layer, name, unit, travel, tracking, t0, dur, ease) {
    var anim, props, op, pos, tr, keys;
    anim = addTextAnimator(layer, name);
    props = anim.property("ADBE Text Animator Properties");
    try {
      op = props.addProperty("ADBE Text Opacity");
      op.setValue(0);
    } catch (e0) {}
    if (travel) {
      try {
        pos = props.addProperty("ADBE Text Position 3D");
        if (!pos) pos = props.addProperty("ADBE Text Position");
        pos.setValue([0, travel, 0]);
      } catch (e1) {}
    }
    if (tracking) {
      try {
        tr = props.addProperty("ADBE Text Tracking Amount");
        tr.setValue(tracking);
      } catch (e2) {}
    }
    keys = [{ t: t0, end: 100 }, { t: t0 + dur, end: 0 }];
    configureRangeEnd(anim, rangeUnit(unit), keys, ease);
  }
  function applyMaskReveal(layer, t0, frames, fps) {
    var mask, exp, ph;
    ph = assetPhaseFrames(frames);
    try {
      mask = layer.Masks.addProperty("ADBE Mask Atom");
      mask.name = "EVO_TEXT_MASK";
      try { mask.property("ADBE Mask Feather").setValue([8, 8]); } catch (e0) {}
      exp = mask.property("ADBE Mask Offset");
      if (!exp) exp = mask.property("Mask Expansion");
      exp.setValueAtTime(t0, -72);
      exp.setValueAtTime(t0 + secondsFromFrames(ph.mid, fps), -18);
      exp.setValueAtTime(t0 + secondsFromFrames(ph.end, fps), 0);
    } catch (e) {}
  }
  function applySourceText(layer, t0, frames, fps, fromVal, toVal, kind) {
    var docProp, i, steps, u, n, text, t;
    steps = 5;
    try {
      docProp = layer.property("ADBE Text Properties").property("ADBE Text Document");
      for (i = 0; i <= steps; i++) {
        u = i / steps;
        n = fromVal + (toVal - fromVal) * u;
        if (kind === "pct") text = Math.round(n) + "%";
        else if (kind === "metric") text = "$" + n.toFixed(1) + "k";
        else text = String(Math.round(n));
        t = t0 + secondsFromFrames(Math.round(frames * u), fps);
        try {
          var doc = docProp.value;
          doc.text = text;
          docProp.setValueAtTime(t, doc);
        } catch (e1) {}
      }
    } catch (e) {}
  }
  function planTextKeys(id, frames, fps) {
    var ph = assetPhaseFrames(frames);
    if (id === "EVT_TEXT_FADE_DOWN") {
      return [
        key(ph.start, fps, 0, -10, 100, 0, 0, "start"),
        key(ph.mid, fps, 0, -2, 100, 82, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_BLUR_IN") {
      return [
        key(ph.start, fps, 0, 4, 100.6, 0, 10, "start"),
        key(ph.mid, fps, 0, 1, 100.2, 78, 3, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_BLUR_OUT") {
      return [
        key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
        key(ph.mid, fps, 0, -2, 99.4, 42, 5, "mid"),
        key(ph.end, fps, 0, -6, 98.5, 0, 10, "done")
      ];
    }
    if (id === "EVT_TEXT_SCALE_IN") {
      return [
        key(ph.start, fps, 0, 0, 94, 0, 0, "start"),
        key(ph.mid, fps, 0, 0, 100.6, 88, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_SLIDE_IN") {
      return [
        key(ph.start, fps, 18, 0, 100, 0, 0, "start"),
        key(ph.mid, fps, 3, 0, 100, 86, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_HEADLINE_REVEAL") {
      return [
        key(ph.start, fps, 0, 0, 102, 100, 0, "start"),
        key(ph.settle, fps, 0, 0, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_SUBTITLE_REVEAL") {
      return [
        key(ph.start, fps, 0, 4, 100, 0, 0, "start"),
        key(ph.mid, fps, 0, 1, 100, 80, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (id === "EVT_TEXT_KINETIC_HEADLINE") {
      return [
        key(ph.start, fps, 0, 6, 101.2, 100, 1, "start"),
        key(ph.mid, fps, 0, 1, 100.4, 100, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    return [
      key(ph.start, fps, 0, 10, 100, 0, 0, "start"),
      key(ph.mid, fps, 0, 2, 100, 82, 0, "mid"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
  }
  function planUiKeys(row, frames, fps) {
    var ph = assetPhaseFrames(frames);
    var el = UI_ELEMENTS[row.element] || UI_ELEMENTS.button;
    var action = row.action;
    if (action === "exit") {
      return [
        key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
        key(ph.mid, fps, el.x * 0.22, el.y * 0.22, el.enterScale + 1, 38, 0, "mid"),
        key(ph.end, fps, el.x, el.y, el.enterScale, 0, 0, "done")
      ];
    }
    if (action === "hover") {
      return [
        key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
        key(ph.end, fps, 0, el.hoverY, el.hoverScale, 100, 0, "done")
      ];
    }
    if (action === "click") {
      return [
        key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
        key(ph.mid, fps, 0, 1, el.clickScale, 100, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (action === "expand") {
      return [
        key(ph.start, fps, 0, 0, row.element === "search" ? 72 : 100, 0, 0, "start"),
        key(ph.mid, fps, 0, 0, 100.4, 90, 0, "mid"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ];
    }
    if (action === "collapse") {
      return [
        key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
        key(ph.mid, fps, 0, 0, 100.2, 52, 0, "mid"),
        key(ph.end, fps, 0, 0, row.element === "search" ? 72 : 100, 0, 0, "done")
      ];
    }
    return [
      key(ph.start, fps, el.x, el.y, el.enterScale, 0, 0, "start"),
      key(ph.mid, fps, el.x * 0.18, el.y * 0.18, Math.min(100.5, el.enterScale + 3), 86, 0, "mid"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
  }
  function planChartGrowKeys(axis, frames, fps) {
    var ph = assetPhaseFrames(frames);
    if (axis === "x") {
      return [
        key(ph.start, fps, 0, 0, 0, 80, 0, "start", 100),
        key(ph.mid, fps, 0, 0, 72, 100, 0, "mid", 100),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done", 100)
      ];
    }
    return [
      key(ph.start, fps, 0, 0, 100, 80, 0, "start", 0),
      key(ph.mid, fps, 0, 0, 100, 100, 0, "mid", 72),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done", 100)
    ];
  }
  function planChartPopKeys(startScale, liftY, frames, fps) {
    var ph = assetPhaseFrames(frames);
    var midScale = startScale + (100 - startScale) * 0.6;
    return [
      key(ph.start, fps, 0, liftY, startScale, 0, 2, "start"),
      key(ph.mid, fps, 0, liftY * 0.18, midScale, 84, 0, "mid"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
  }
  function planChartSeriesKeys(frames, fps, travel, enterScale) {
    var ph = assetPhaseFrames(frames);
    return [
      key(ph.start, fps, 0, travel, enterScale, 0, 0, "start"),
      key(ph.mid, fps, 0, travel * 0.22, enterScale + 1.2, 78, 0, "mid"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
  }
  function planChartFadeKeys(frames, fps) {
    var ph = assetPhaseFrames(frames);
    return [
      key(ph.start, fps, 0, 0, 100, 0, 0, "start"),
      key(ph.mid, fps, 0, 0, 100, 100, 0, "mid"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
  }
  function applyTrimPath(layer, frames, fps, t0, ease, fillPct) {
    var contents, group, vectors, trim, endP, ph, endVal, midVal;
    ph = assetPhaseFrames(frames);
    endVal = fillPct == null ? 100 : fillPct;
    midVal = endVal * 0.72;
    try {
      contents = layer.property("ADBE Root Vectors Group");
      if (!contents) return;
      try { group = contents.property(1); } catch (e0) { group = null; }
      vectors = null;
      if (group) {
        try { vectors = group.property("ADBE Vectors Group"); } catch (e1) { vectors = null; }
      }
      trim = null;
      if (vectors) {
        try { trim = vectors.addProperty("ADBE Vector Filter - Trim"); } catch (e2) { trim = null; }
      }
      if (!trim) {
        try { trim = contents.addProperty("ADBE Vector Filter - Trim"); } catch (e3) { trim = null; }
      }
      if (!trim) return;
      endP = trim.property("ADBE Vector Trim End");
      if (!endP) {
        try { endP = trim.property("End"); } catch (e4) { endP = null; }
      }
      if (!endP) return;
      endP.setValueAtTime(t0, 0);
      endP.setValueAtTime(t0 + secondsFromFrames(ph.mid, fps), midVal);
      endP.setValueAtTime(t0 + secondsFromFrames(ph.end, fps), endVal);
      applyEase(endP, ease);
    } catch (e) {}
  }
  function applyAssetLayer(layer, keys, t0, ease) {
    applyLayerKeys(layer, keys, t0, ease);
  }
  function applyCursorMotion(layer, id, t0, frames, fps, ease) {
    var pos = layer.property("ADBE Transform Group").property("ADBE Position");
    var sc = layer.property("ADBE Transform Group").property("ADBE Scale");
    var op = layer.property("ADBE Transform Group").property("ADBE Opacity");
    var rest = pos.value;
    var startP = rest;
    var endP = [rest[0] + 220, rest[1] + 80];
    var dur = secondsFromFrames(frames, fps);
    var mid = t0 + dur * 0.5;
    var press = 0.12;
    var dip = 88;
    if (id === "EVT_CURSOR_RIPPLE") {
      endP = rest;
    }
    pos.setValueAtTime(t0, startP);
    if (id === "EVT_CURSOR_SWIPE") {
      pos.setValueAtTime(mid, [endP[0] + 12, endP[1]]);
      pos.setValueAtTime(t0 + dur, endP);
    } else if (id === "EVT_CURSOR_DRAG" || id === "EVT_CURSOR_SELECT") {
      pos.setValueAtTime(t0 + dur * 0.12, startP);
      pos.setValueAtTime(t0 + dur * 0.88, endP);
      pos.setValueAtTime(t0 + dur, endP);
    } else if (id === "EVT_CURSOR_HOVER") {
      pos.setValueAtTime(t0 + dur * 0.7, endP);
      pos.setValueAtTime(t0 + dur, endP);
    } else {
      pos.setValueAtTime(t0 + dur, endP);
    }
    if (id === "EVT_CURSOR_CLICK" || id === "EVT_CURSOR_RIPPLE") {
      sc.setValueAtTime(t0 + dur * 0.72, [100, 100]);
      sc.setValueAtTime(t0 + dur * 0.72 + press * 0.45, [dip, dip]);
      sc.setValueAtTime(t0 + dur * 0.72 + press, [100, 100]);
    } else if (id === "EVT_CURSOR_DBLCLICK") {
      sc.setValueAtTime(t0 + dur * 0.55, [100, 100]);
      sc.setValueAtTime(t0 + dur * 0.55 + press * 0.45, [dip, dip]);
      sc.setValueAtTime(t0 + dur * 0.55 + press, [100, 100]);
      sc.setValueAtTime(t0 + dur * 0.55 + press + 0.2, [100, 100]);
      sc.setValueAtTime(t0 + dur * 0.55 + press + 0.2 + press * 0.45, [dip, dip]);
      sc.setValueAtTime(t0 + dur * 0.55 + press + 0.2 + press, [100, 100]);
    } else if (id === "EVT_CURSOR_DRAG" || id === "EVT_CURSOR_SELECT") {
      sc.setValueAtTime(t0, [100, 100]);
      sc.setValueAtTime(t0 + dur * 0.12, [dip, dip]);
      sc.setValueAtTime(t0 + dur * 0.88, [dip, dip]);
      sc.setValueAtTime(t0 + dur, [100, 100]);
    } else if (id === "EVT_CURSOR_HOVER") {
      sc.setValueAtTime(t0, [100, 100]);
      sc.setValueAtTime(t0 + dur, [102, 102]);
    } else if (id === "EVT_CURSOR_SWIPE") {
      sc.setValueAtTime(t0, [100, 100]);
      sc.setValueAtTime(mid, [96, 96]);
      sc.setValueAtTime(t0 + dur, [100, 100]);
    }
    applyEase(pos, ease);
    applyEase(sc, ease);
    if (id === "EVT_CURSOR_RIPPLE") {
      var ripple = layer.containingComp.layers.addShape();
      ripple.name = "EVO_CURSOR_RIPPLE";
      try { ripple.parent = layer; } catch (e0) {}
      try { ripple.property("ADBE Transform Group").property("ADBE Position").setValue([0, 0]); } catch (e1) {}
      var rsc = ripple.property("ADBE Transform Group").property("ADBE Scale");
      var rop = ripple.property("ADBE Transform Group").property("ADBE Opacity");
      rsc.setValueAtTime(t0, [20, 20]);
      rsc.setValueAtTime(t0 + dur, [140, 140]);
      rop.setValueAtTime(t0, 36);
      rop.setValueAtTime(t0 + dur, 0);
      applyEase(rsc, ease);
      applyEase(rop, ease);
    }
  }
  function runApplyAsset(tab, list, groupList, easeList) {
    var comp = requireComp();
    if (!comp) return;
    var sel = selectedLayers(comp);
    var catalog, row, id, group, frames, fps, ease, t0, undo, keys, ph;
    catalog = tab === "Text" ? TEXT_CATALOG : tab === "UI" ? UI_CATALOG : tab === "Charts" ? CHART_CATALOG : CURSOR_CATALOG;
    if (!list.selection) { alert("Select an asset in the list."); return; }
    row = assetFiltered[list.selection.index];
    if (!row) { alert("Select an asset in the list."); return; }
    id = row.id;
    if (sel.length < 1) { alert("Select a layer to apply " + id + "."); return; }
    if (id === "EVT_TEXT_SWAP" && sel.length < 2) { alert("Select outgoing, then incoming text for Text Swap."); return; }
    group = groupList.selection ? String(groupList.selection.text) : (row.duration || "STANDARD");
    fps = comp.frameRate || DEFAULT_FPS;
    frames = durationFrames(group, fps);
    ease = (id.indexOf("COUNTER") !== -1 || id === "EVT_CHART_KPI_COUNT") ? "linear" : (EASING_IDS[easeList.selection ? easeList.selection.index : 0] || "premium-smooth");
    t0 = comp.time;
    ph = assetPhaseFrames(frames);
    undo = "Evotechly Asset · " + id;
    app.beginUndoGroup(undo);
    try {
      if (tab === "Text") {
        if (id === "EVT_TEXT_SWAP") {
          applyAssetLayer(sel[0], [
            key(ph.start, fps, 0, 0, 100, 100, 0, "start"),
            key(ph.mid, fps, 0, -6, 99.2, 40, 2, "mid"),
            key(ph.end, fps, 0, -12, 98, 0, 4, "done")
          ], t0, ease);
          applyAssetLayer(sel[1], [
            key(ph.start, fps, 0, 10, 100.6, 0, 4, "start"),
            key(ph.mid, fps, 0, 2, 100.2, 72, 1, "mid"),
            key(ph.end, fps, 0, 0, 100, 100, 0, "done")
          ], t0, ease);
        } else if (id === "EVT_TEXT_MASK_REVEAL") {
          applyMaskReveal(sel[0], t0, frames, fps);
        } else if (id === "EVT_TEXT_WORD_REVEAL" || id === "EVT_TEXT_LINE_REVEAL" || id === "EVT_TEXT_CHAR_REVEAL" || id === "EVT_TEXT_TRACKING_REVEAL" || id === "EVT_TEXT_HEADLINE_REVEAL" || id === "EVT_TEXT_SUBTITLE_REVEAL" || id === "EVT_TEXT_KINETIC_HEADLINE") {
          if (!isTextLayer(sel[0])) { alert(id + " needs a text layer."); app.endUndoGroup(); return; }
          var unit = id === "EVT_TEXT_WORD_REVEAL" || id === "EVT_TEXT_SUBTITLE_REVEAL" ? "word" : id === "EVT_TEXT_LINE_REVEAL" ? "line" : "char";
          var travel = id === "EVT_TEXT_LINE_REVEAL" ? 10 : id === "EVT_TEXT_SUBTITLE_REVEAL" ? 6 : 8;
          var tracking = id === "EVT_TEXT_TRACKING_REVEAL" ? 28 : id === "EVT_TEXT_KINETIC_HEADLINE" ? 18 : 0;
          applyTextAnimator(sel[0], "EVO_TEXT", unit, travel, tracking, t0, secondsFromFrames(frames, fps), ease);
          keys = planTextKeys(id, frames, fps);
          if (id === "EVT_TEXT_HEADLINE_REVEAL" || id === "EVT_TEXT_SUBTITLE_REVEAL" || id === "EVT_TEXT_KINETIC_HEADLINE") applyAssetLayer(sel[0], keys, t0, ease);
        } else if (id === "EVT_TEXT_NUMBER_COUNTER" || id === "EVT_TEXT_PCT_COUNTER" || id === "EVT_TEXT_METRIC_COUNTER") {
          if (!isTextLayer(sel[0])) { alert(id + " needs a text layer."); app.endUndoGroup(); return; }
          applySourceText(sel[0], t0, frames, fps, 0, id === "EVT_TEXT_PCT_COUNTER" ? 48 : id === "EVT_TEXT_METRIC_COUNTER" ? 12.4 : 124, id === "EVT_TEXT_PCT_COUNTER" ? "pct" : id === "EVT_TEXT_METRIC_COUNTER" ? "metric" : "number");
          applyAssetLayer(sel[0], planTextKeys("EVT_TEXT_FADE_UP", frames, fps), t0, "linear");
        } else {
          applyAssetLayer(sel[0], planTextKeys(id, frames, fps), t0, ease);
        }
      } else if (tab === "UI") {
        applyAssetLayer(sel[0], planUiKeys(row, frames, fps), t0, ease);
      } else if (tab === "Charts") {
        if (id === "EVT_CHART_SERIES_ENTER" || id === "EVT_CHART_FUNNEL_IN") {
          keys = planChartSeriesKeys(frames, fps, id === "EVT_CHART_FUNNEL_IN" ? 12 : 16, id === "EVT_CHART_FUNNEL_IN" ? 97 : 98);
          for (var iChart = 0; iChart < sel.length; iChart++) {
            applyAssetLayer(sel[iChart], shiftKeysJs(keys, iChart * 3, fps), t0, ease);
          }
        } else if (id === "EVT_CHART_BAR_DRAW") {
          applyAssetLayer(sel[0], planChartGrowKeys("x", frames, fps), t0, ease);
        } else if (id === "EVT_CHART_COLUMN_RISE") {
          applyAssetLayer(sel[0], planChartGrowKeys("y", frames, fps), t0, ease);
        } else if (id === "EVT_CHART_LINE_REVEAL" || id === "EVT_CHART_SPARK" || id === "EVT_CHART_DONUT_FILL") {
          applyAssetLayer(sel[0], planChartFadeKeys(frames, fps), t0, ease);
          applyTrimPath(sel[0], frames, fps, t0, ease, id === "EVT_CHART_DONUT_FILL" ? 72 : 100);
        } else if (id === "EVT_CHART_KPI_COUNT") {
          if (isTextLayer(sel[0])) applySourceText(sel[0], t0, frames, fps, 0, 124, "number");
          applyAssetLayer(sel[0], planChartPopKeys(96, 8, frames, fps), t0, "linear");
        } else if (id === "EVT_DEVICE_PHONE_IN") {
          applyAssetLayer(sel[0], planChartPopKeys(92, 10, frames, fps), t0, ease);
        } else if (id === "EVT_DEVICE_LAPTOP_IN") {
          applyAssetLayer(sel[0], planChartPopKeys(90, 12, frames, fps), t0, ease);
        } else {
          applyAssetLayer(sel[0], planChartPopKeys(90, 8, frames, fps), t0, ease);
        }
      } else {
        applyCursorMotion(sel[0], id, t0, frames, fps, ease);
      }
    } catch (err) {
      alert(String(err));
      app.endUndoGroup();
      return;
    }
    app.endUndoGroup();
    alert(undo + "\n" + frames + "f @" + Math.round(fps) + "fps · " + ease + " · " + STYLE);
  }
  function refreshAssetList(list, searchField, catalog) {
    var q = String(searchField.text || "").toLowerCase();
    var i, row, blob;
    assetFiltered = [];
    list.removeAll();
    for (i = 0; i < catalog.length; i++) {
      row = catalog[i];
      blob = (row.id + " " + (row.name || "") + " " + (row.category || "") + " " + (row.bestUse || "") + " " + (row.element || "") + " " + (row.action || "")).toLowerCase();
      if (q && blob.indexOf(q) === -1) continue;
      assetFiltered.push(row);
      list.add("item", "● " + (row.name || row.id));
    }
    if (assetFiltered.length) list.selection = 0;
  }
  function travelDistance(dir, comp, distancePct, strengthPct) {
    var axis = (dir === "up" || dir === "down") ? comp.height : comp.width;
    return Math.max(0, axis * (clamp(distancePct, 0, 200) / 100) * (clamp(strengthPct, 0, 200) / 100));
  }
  function anticipatePx(distance) {
    return Math.min(16, distance * ANTICIPATE_RATIO);
  }
  function overshootPx(distance, overshootPct) {
    return Math.min(OVERSHOOT_CAP, distance * (clamp(overshootPct, 0, 24) / 100));
  }
  function key(frame, fps, x, y, sx, opacity, blur, phase, sy) {
    return { t: secondsFromFrames(frame, fps), frame: frame, x: x, y: y, sx: sx, sy: (sy == null ? sx : sy), opacity: opacity, blur: blur, phase: phase };
  }
  function r4(n) {
    return Math.round(Number(n) * 10000) / 10000;
  }
  function mixScale(from, to, strengthPct) {
    var t = clamp(strengthPct == null ? 100 : strengthPct, 0, 200) / 100;
    return r4(from + (to - from) * t);
  }
  function defaultTargetBounds() {
    return { l: 760, t: 340, r: 1160, b: 740 };
  }
  function defaultCardBounds() {
    return { l: 240, t: 300, r: 720, b: 660 };
  }
  function defaultDetailBounds() {
    return { l: 280, t: 80, r: 1640, b: 1000 };
  }
  function defaultImageBounds() {
    return { l: 640, t: 220, r: 1280, b: 700 };
  }
  function defaultGalleryBounds() {
    return { l: 360, t: 120, r: 1560, b: 960 };
  }
  function defaultHeroBounds() {
    return { l: 80, t: 60, r: 1840, b: 1020 };
  }
  function defaultHeroDetailBounds() {
    return { l: 520, t: 140, r: 1400, b: 900 };
  }
  function defaultListRowBounds() {
    return { l: 80, t: 360, r: 920, b: 440 };
  }
  function defaultListDetailBounds() {
    return { l: 720, t: 80, r: 1840, b: 1000 };
  }
  function defaultPopoverTargetBounds() {
    return { l: 1280, t: 200, r: 1440, b: 248 };
  }
  function defaultPopoverDestBounds() {
    return { l: 1120, t: 260, r: 1600, b: 540 };
  }
  function defaultFromBoundsForId(id) {
    if (id === "EVT_SHARED_IMAGE") return defaultImageBounds();
    if (id === "EVT_HERO_TO_DETAIL") return defaultHeroBounds();
    if (id === "EVT_LIST_TO_DETAIL") return defaultListRowBounds();
    if (id === "EVT_POPOVER_IN") return defaultPopoverTargetBounds();
    return defaultCardBounds();
  }
  function defaultToBoundsForId(id) {
    if (id === "EVT_SHARED_IMAGE") return defaultGalleryBounds();
    if (id === "EVT_HERO_TO_DETAIL") return defaultHeroDetailBounds();
    if (id === "EVT_LIST_TO_DETAIL") return defaultListDetailBounds();
    if (id === "EVT_POPOVER_IN") return defaultPopoverDestBounds();
    return defaultDetailBounds();
  }
  function defaultLayerBoundsForId(id) {
    if (id === "EVT_SHARED_CARD" || id === "EVT_SHARED_IMAGE" || id === "EVT_MATCH_CUT" || id === "EVT_MORPH_BOUNDS" || id === "EVT_HERO_TO_DETAIL" || id === "EVT_LIST_TO_DETAIL" || id === "EVT_POPOVER_IN") {
      return defaultFromBoundsForId(id);
    }
    return defaultTargetBounds();
  }
  function layerBoundsBox(layer, t) {
    var rect, pos, sc, w, h;
    try {
      rect = layer.sourceRectAtTime(t, false);
      pos = layer.property("ADBE Transform Group").property("ADBE Position").value;
      sc = layer.property("ADBE Transform Group").property("ADBE Scale").value;
      w = rect.width * ((sc[0] || 100) / 100);
      h = rect.height * ((sc[1] || sc[0] || 100) / 100);
      if (!(w > 1) || !(h > 1)) return null;
      return { l: pos[0] + rect.left * ((sc[0] || 100) / 100), t: pos[1] + rect.top * ((sc[1] || sc[0] || 100) / 100), r: pos[0] + rect.left * ((sc[0] || 100) / 100) + w, b: pos[1] + rect.top * ((sc[1] || sc[0] || 100) / 100) + h };
    } catch (e) {
      return null;
    }
  }
  function planTargetZoomJs(compW, compH, box, padding) {
    var width, height, availW, availH, scaleFactor, targetCenter, compCenter;
    padding = padding == null ? 80 : padding;
    box = box || defaultTargetBounds();
    width = box.r - box.l;
    height = box.b - box.t;
    if (!(compW > 0) || !(compH > 0) || !(width > 0) || !(height > 0)) {
      return { valid: false, scale: 100, dx: 0, dy: 0 };
    }
    availW = Math.max(1, compW - padding * 2);
    availH = Math.max(1, compH - padding * 2);
    scaleFactor = Math.min(availW / width, availH / height);
    targetCenter = [(box.l + box.r) / 2, (box.t + box.b) / 2];
    compCenter = [compW / 2, compH / 2];
    return {
      valid: true,
      scale: r4(scaleFactor * 100),
      dx: r4(-(targetCenter[0] - compCenter[0]) * scaleFactor) || 0,
      dy: r4(-(targetCenter[1] - compCenter[1]) * scaleFactor) || 0
    };
  }
  function planBoundsMorphJs(fromB, toB) {
    var fromW, fromH, toW, toH, fromC, toC;
    fromB = fromB || defaultCardBounds();
    toB = toB || defaultDetailBounds();
    fromW = fromB.r - fromB.l;
    fromH = fromB.b - fromB.t;
    toW = toB.r - toB.l;
    toH = toB.b - toB.t;
    if (!(fromW > 0) || !(fromH > 0) || !(toW > 0) || !(toH > 0)) {
      return { valid: false, dx: 0, dy: 0, sx: 100, sy: 100, invSx: 100, invSy: 100 };
    }
    fromC = [(fromB.l + fromB.r) / 2, (fromB.t + fromB.b) / 2];
    toC = [(toB.l + toB.r) / 2, (toB.t + toB.b) / 2];
    return {
      valid: true,
      dx: r4(toC[0] - fromC[0]) || 0,
      dy: r4(toC[1] - fromC[1]) || 0,
      sx: r4((toW / fromW) * 100),
      sy: r4((toH / fromH) * 100),
      invSx: r4((fromW / toW) * 100),
      invSy: r4((fromH / toH) * 100)
    };
  }
  function planDirectional(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100);
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 6);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 100, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.5, a.y * distance * 0.5, 99.2, 55, 2, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 98, 0, 6, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 101.5, 0, 6, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.18, -a.y * distance * 0.18, 100.4, 78, 2, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planScale(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 101.2, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 96, 42, 4, "crossover"),
        key(ph.end, fps, 0, 0, 88, 0, 8, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 110, 0, 8, "anticipate"),
        key(ph.mid, fps, 0, 0, 103, 72, 3, "crossover"),
        key(ph.settle, fps, 0, 0, 100.8, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planDepth(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 4, 100.6, 100, 1, "action"),
        key(ph.mid, fps, 0, 10, 96.5, 48, 8, "crossover"),
        key(ph.end, fps, 0, 18, 92, 0, 16, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, -16, 108, 0, 14, "anticipate"),
        key(ph.mid, fps, 0, -5, 103, 70, 5, "crossover"),
        key(ph.settle, fps, 0, 2, 100.6, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planSoft(dir, frames, fps, comp) {
    var ph = phaseFrames(frames, "soft");
    var distance = travelDistance(dir, comp, 100, 100) * 0.92;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 3);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 100.4, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.42, a.y * distance * 0.42, 99.6, 62, 1, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 98.8, 0, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 101.2, 12, 3, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.2, -a.y * distance * 0.2, 100.3, 80, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planSnap(dir, frames, fps, comp) {
    var ph = phaseFrames(frames, "snap");
    var distance = travelDistance(dir, comp, 100, 100) * 0.42;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 2);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti * 0.5, -a.y * anti * 0.5, 99.8, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.55, a.y * distance * 0.55, 99.6, 40, 0, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 99, 0, 1, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 100.6, 0, 1, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.08, -a.y * distance * 0.08, 100.2, 88, 0, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planOvershoot(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100);
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 16);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 100.3, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.52, a.y * distance * 0.52, 99, 48, 2, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 97.8, 0, 5, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 102.2, 0, 5, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.08, -a.y * distance * 0.08, 100.8, 84, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 101.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planParallax(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var foreground = travelDistance(dir, comp, 100, 100);
    var background = foreground * 0.28;
    var anti = anticipatePx(background);
    var over = overshootPx(foreground, 6);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti * 0.5, -a.y * anti * 0.5, 99.6, 100, 1, "action"),
        key(ph.mid, fps, a.x * background * 0.5, a.y * background * 0.5, 99, 62, 3, "crossover"),
        key(ph.end, fps, a.x * background, a.y * background, 97.5, 28, 6, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * foreground, -a.y * foreground, 102, 0, 4, "anticipate"),
        key(ph.mid, fps, -a.x * foreground * 0.16, -a.y * foreground * 0.16, 100.6, 82, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planFade(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.36;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 4);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 99.8, 88, 1, "action"),
        key(ph.mid, fps, a.x * distance * 0.35, a.y * distance * 0.35, 99.6, 38, 3, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 99, 0, 5, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 100.8, 0, 5, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.12, -a.y * distance * 0.12, 100.3, 62, 2, "crossover"),
        key(ph.settle, fps, a.x * over * 0.5, a.y * over * 0.5, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planCover(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100);
    var anti = anticipatePx(distance) * 0.4;
    var over = overshootPx(distance, 4);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 99.8, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 99.4, 100, 0, "crossover"),
        key(ph.end, fps, 0, 0, 98.8, 100, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.22, -a.y * distance * 0.22, 100, 100, 0, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planPanel(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.4;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 4);
    var from = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, from.x * anti * 0.4, from.y * anti * 0.4, 99.8, 100, 0, "action"),
        key(ph.mid, fps, -from.x * distance * 0.22, -from.y * distance * 0.22, 98.6, 74, 2, "crossover"),
        key(ph.end, fps, -from.x * distance * 0.32, -from.y * distance * 0.32, 97.8, 64, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, from.x * distance, from.y * distance, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, from.x * distance * 0.18, from.y * distance * 0.18, 100, 100, 0, "crossover"),
        key(ph.settle, fps, -from.x * over, -from.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planDashboard(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100);
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 6);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti + 3, 100.5, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.46, a.y * distance * 0.46 + 8, 97.2, 46, 5, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance + 14, 93.5, 0, 10, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance - 10, 105, 0, 7, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.16, -a.y * distance * 0.16 - 3, 101.6, 74, 2, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over + 1, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planSplit(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.55;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 5);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 99.6, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.5, a.y * distance * 0.5, 98.8, 82, 1, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 97.5, 0, 4, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 101.2, 0, 4, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.5, -a.y * distance * 0.5, 100.4, 88, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planCard(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.28;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 4);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti, -a.y * anti, 100.2, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.5, a.y * distance * 0.5, 99.4, 48, 1, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 98.6, 0, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 101.2, 0, 3, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.18, -a.y * distance * 0.18, 100.4, 82, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planPanelIn(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.32;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 4);
    var from = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, from.x * anti * 0.35, from.y * anti * 0.35, 99.8, 100, 0, "action"),
        key(ph.mid, fps, -from.x * distance * 0.12, -from.y * distance * 0.12, 98.8, 78, 1, "crossover"),
        key(ph.end, fps, -from.x * distance * 0.18, -from.y * distance * 0.18, 98.4, 68, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, from.x * distance, from.y * distance, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, from.x * distance * 0.16, from.y * distance * 0.16, 100, 100, 0, "crossover"),
        key(ph.settle, fps, -from.x * over, -from.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planPanelOut(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.32;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 3);
    var from = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -from.x * anti * 0.4, -from.y * anti * 0.4, 100.1, 100, 0, "action"),
        key(ph.mid, fps, from.x * distance * 0.45, from.y * distance * 0.45, 99.6, 52, 1, "crossover"),
        key(ph.end, fps, from.x * distance, from.y * distance, 99, 0, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, -from.x * distance * 0.18, -from.y * distance * 0.18, 98.4, 68, 2, "anticipate"),
        key(ph.mid, fps, -from.x * distance * 0.06, -from.y * distance * 0.06, 99.6, 88, 0, "crossover"),
        key(ph.settle, fps, from.x * over * 0.4, from.y * over * 0.4, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planDrawer(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.22;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 4);
    var from = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, from.x * anti * 0.3, from.y * anti * 0.3, 99.8, 100, 0, "action"),
        key(ph.mid, fps, -from.x * distance * 0.1, -from.y * distance * 0.1, 99.2, 80, 1, "crossover"),
        key(ph.end, fps, -from.x * distance * 0.14, -from.y * distance * 0.14, 98.8, 72, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, from.x * distance, from.y * distance, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, from.x * distance * 0.14, from.y * distance * 0.14, 100, 100, 0, "crossover"),
        key(ph.settle, fps, -from.x * over, -from.y * over, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planSheetUp(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.42;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 5);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, anti * 0.25, 99.8, 100, 0, "action"),
        key(ph.mid, fps, 0, -4, 98.6, 76, 2, "crossover"),
        key(ph.end, fps, 0, -8, 97.8, 64, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.16, -a.y * distance * 0.16, 100, 100, 0, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planStack(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.24;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 6);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti * 0.6, -a.y * anti * 0.6 + 2, 99.2, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.22, a.y * distance * 0.22 + 6, 96, 78, 2, "crossover"),
        key(ph.end, fps, a.x * distance * 0.28, a.y * distance * 0.28 + 10, 92, 58, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 96, 0, 3, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.2, -a.y * distance * 0.2, 99, 86, 1, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.6, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planPeek(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100) * 0.28;
    var hold = distance * 0.36;
    var anti = anticipatePx(distance);
    var over = overshootPx(hold, 2);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti * 0.4, -a.y * anti * 0.4, 99.8, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.05, a.y * distance * 0.05, 99.7, 96, 0, "crossover"),
        key(ph.end, fps, a.x * distance * 0.08, a.y * distance * 0.08, 99.6, 92, 1, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 100.4, 0, 2, "anticipate"),
        key(ph.mid, fps, -a.x * distance * 0.55, -a.y * distance * 0.55, 100.2, 78, 1, "crossover"),
        key(ph.settle, fps, -a.x * hold - a.x * over * 0.3, -a.y * hold - a.y * over * 0.3, 100.1, 100, 0, "settle"),
        key(ph.end, fps, -a.x * hold, -a.y * hold, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planZoomIn(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100.6, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 104, 42, 2, "crossover"),
        key(ph.end, fps, 0, 0, 108, 0, 4, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 88, 0, 4, "anticipate"),
        key(ph.mid, fps, 0, 0, mixScale(88, 100, 50), 72, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planZoomOut(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.6, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 96, 48, 2, "crossover"),
        key(ph.end, fps, 0, 0, 92, 0, 4, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 112, 0, 4, "anticipate"),
        key(ph.mid, fps, 0, 0, mixScale(112, 100, 50), 74, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planZoomTarget(frames, fps, comp, target) {
    var ph = phaseFrames(frames);
    var tz = planTargetZoomJs(comp.width, comp.height, (target && target.layerBounds) || defaultTargetBounds(), 80);
    var endSx = tz.valid ? tz.scale : 100;
    var endX = tz.valid ? tz.dx : 0;
    var endY = tz.valid ? tz.dy : 0;
    var midSx = r4(100 + (endSx - 100) * 0.5);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 101.2, 100, 0, "action"),
        key(ph.mid, fps, r4(endX * 0.5), r4(endY * 0.5), midSx, 88, 1, "crossover"),
        key(ph.end, fps, endX, endY, endSx, 72, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 0, 3, "anticipate"),
        key(ph.mid, fps, 0, 0, 100, 58, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planZoomMatch(frames, fps, comp, target) {
    var ph = phaseFrames(frames);
    var tz = planTargetZoomJs(comp.width, comp.height, (target && target.layerBounds) || defaultTargetBounds(), 80);
    var endSx = tz.valid ? tz.scale : 100;
    var endX = tz.valid ? tz.dx : 0;
    var endY = tz.valid ? tz.dy : 0;
    var midSx = r4(100 + (endSx - 100) * 0.5);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100.8, 100, 0, "action"),
        key(ph.mid, fps, r4(endX * 0.5), r4(endY * 0.5), midSx, 46, 2, "crossover"),
        key(ph.end, fps, endX, endY, endSx, 0, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 0, 3, "anticipate"),
        key(ph.mid, fps, 0, 0, 100, 62, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planScalePop(frames, fps) {
    var ph = phaseFrames(frames, "snap");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.6, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 98.8, 40, 1, "crossover"),
        key(ph.end, fps, 0, 0, 98, 0, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 90, 0, 2, "anticipate"),
        key(ph.mid, fps, 0, 0, mixScale(90, 100, 60), 84, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planScaleBreathe(frames, fps) {
    var ph = phaseFrames(frames, "soft");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, 100, 0, "crossover"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, 0, 0, 102, 100, 0, "crossover"),
        key(ph.settle, fps, 0, 0, mixScale(100, 102, 40), 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planScalePunch(frames, fps, comp, target) {
    var ph = phaseFrames(frames, "snap");
    var punchSx = 106;
    var punchX = 0;
    var punchY = 0;
    var tz;
    if (target && target.layerBounds) {
      tz = planTargetZoomJs(comp.width, comp.height, target.layerBounds, 80);
      if (tz.valid) {
        punchSx = r4(100 + (tz.scale - 100) * 0.18);
        punchX = r4(tz.dx * 0.18);
        punchY = r4(tz.dy * 0.18);
      }
    }
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.8, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 99.4, 86, 1, "crossover"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.mid, fps, punchX, punchY, punchSx, 100, 0, "crossover"),
        key(ph.settle, fps, r4(punchX * 0.2), r4(punchY * 0.2), 100.6, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planScaleSettle(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.4, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 97.5, 44, 2, "crossover"),
        key(ph.end, fps, 0, 0, 96, 0, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 108, 0, 3, "anticipate"),
        key(ph.mid, fps, 0, 0, mixScale(108, 100, 62), 78, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.6, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planSharedMorphJs(frames, fps, target, id, profile, overshootPct, phaseProfile) {
    var ph = phaseFrames(frames, phaseProfile);
    var morph = planBoundsMorphJs((target && target.layerBounds) || defaultFromBoundsForId(id), (target && target.destBounds) || defaultToBoundsForId(id));
    var dx = morph.valid ? morph.dx : 0;
    var dy = morph.valid ? morph.dy : 0;
    var outSx = morph.valid ? morph.sx : 100;
    var outSy = morph.valid ? morph.sy : 100;
    var inSx = morph.valid ? morph.invSx : 100;
    var inSy = morph.valid ? morph.invSy : 100;
    var over = overshootPx(Math.max(Math.abs(dx), Math.abs(dy), 24), overshootPct);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate", 100),
        key(ph.anticipate, fps, r4(dx * profile.antiTravel), r4(dy * profile.antiTravel), profile.antiScale, 100, 0, "action", profile.antiScale),
        key(ph.mid, fps, r4(dx * profile.midTravel), r4(dy * profile.midTravel), r4(100 + (outSx - 100) * profile.midOutScale), profile.midOutOpacity, profile.midOutBlur, "crossover", r4(100 + (outSy - 100) * profile.midOutScale)),
        key(ph.end, fps, dx, dy, outSx, profile.outEndOpacity, profile.outEndBlur, "done", outSy)
      ],
      incoming: [
        key(ph.start, fps, r4(-dx), r4(-dy), inSx, profile.inStartOpacity, profile.inStartBlur, "anticipate", inSy),
        key(ph.mid, fps, r4(-dx * profile.inMidTravel), r4(-dy * profile.inMidTravel), r4(inSx + (100 - inSx) * profile.inMidScale), profile.inMidOpacity, profile.inMidBlur, "crossover", r4(inSy + (100 - inSy) * profile.inMidScale)),
        key(ph.settle, fps, r4(dx === 0 ? 0 : (dx > 0 ? over : -over) * profile.settleOver), r4(dy === 0 ? 0 : (dy > 0 ? over : -over) * profile.settleOver), profile.settleScale, 100, 0, "settle", profile.settleScale),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done", 100)
      ],
      phases: ph
    };
  }
  function planSharedCard(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_SHARED_CARD", { antiTravel: 0.04, antiScale: 101.2, midTravel: 0.5, midOutScale: 0.5, midOutOpacity: 36, midOutBlur: 1, outEndOpacity: 0, outEndBlur: 2, inStartOpacity: 0, inStartBlur: 2, inMidTravel: 0.18, inMidScale: 0.72, inMidOpacity: 78, inMidBlur: 1, settleOver: 0.15, settleScale: 100.6 }, 4);
  }
  function planSharedImage(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_SHARED_IMAGE", { antiTravel: 0.02, antiScale: 100.8, midTravel: 0.5, midOutScale: 0.5, midOutOpacity: 52, midOutBlur: 1, outEndOpacity: 0, outEndBlur: 2, inStartOpacity: 0, inStartBlur: 2, inMidTravel: 0.22, inMidScale: 0.68, inMidOpacity: 70, inMidBlur: 1, settleOver: 0.1, settleScale: 100.4 }, 3);
  }
  function planMatchCut(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_MATCH_CUT", { antiTravel: 0, antiScale: 100, midTravel: 1, midOutScale: 1, midOutOpacity: 100, midOutBlur: 0, outEndOpacity: 0, outEndBlur: 0, inStartOpacity: 0, inStartBlur: 0, inMidTravel: 1, inMidScale: 0, inMidOpacity: 0, inMidBlur: 0, settleOver: 0, settleScale: 100 }, 0, "snap");
  }
  function planMorphBounds(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_MORPH_BOUNDS", { antiTravel: 0, antiScale: 100, midTravel: 0.5, midOutScale: 0.5, midOutOpacity: 100, midOutBlur: 0, outEndOpacity: 0, outEndBlur: 0, inStartOpacity: 0, inStartBlur: 0, inMidTravel: 0.5, inMidScale: 0.5, inMidOpacity: 100, inMidBlur: 0, settleOver: 0, settleScale: 100 }, 2);
  }
  function planHeroToDetail(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_HERO_TO_DETAIL", { antiTravel: 0.03, antiScale: 100.6, midTravel: 0.45, midOutScale: 0.45, midOutOpacity: 40, midOutBlur: 1, outEndOpacity: 0, outEndBlur: 3, inStartOpacity: 0, inStartBlur: 3, inMidTravel: 0.2, inMidScale: 0.65, inMidOpacity: 74, inMidBlur: 1, settleOver: 0.12, settleScale: 100.5 }, 3, "soft");
  }
  function planListToDetail(frames, fps, comp, target) {
    return planSharedMorphJs(frames, fps, target, "EVT_LIST_TO_DETAIL", { antiTravel: 0.04, antiScale: 100.8, midTravel: 0.5, midOutScale: 0.5, midOutOpacity: 32, midOutBlur: 1, outEndOpacity: 0, outEndBlur: 2, inStartOpacity: 0, inStartBlur: 2, inMidTravel: 0.16, inMidScale: 0.7, inMidOpacity: 80, inMidBlur: 1, settleOver: 0.12, settleScale: 100.4 }, 3);
  }
  function planModalIn(frames, fps) {
    var ph = phaseFrames(frames);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.8, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 99.2, 58, 2, "crossover"),
        key(ph.end, fps, 0, 0, 98.6, 36, 3, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 92, 0, 2, "anticipate"),
        key(ph.mid, fps, 0, 0, mixScale(92, 100, 60), 84, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100.4, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planModalOut(frames, fps) {
    var ph = phaseFrames(frames, "snap");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100.4, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 96, 40, 1, "crossover"),
        key(ph.end, fps, 0, 0, 92, 0, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 98.6, 36, 3, "anticipate"),
        key(ph.mid, fps, 0, 0, 99.4, 78, 1, "crossover"),
        key(ph.settle, fps, 0, 0, 100.2, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planOverlaySheetUp(dir, frames, fps, comp) {
    return planSheetUp(dir, frames, fps, comp);
  }
  function planOverlaySheetDown(dir, frames, fps, comp) {
    var ph = phaseFrames(frames, "snap");
    var distance = travelDistance(dir, comp, 100, 100) * 0.42;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 3);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -a.x * anti * 0.25, -a.y * anti * 0.25, 100.1, 100, 0, "action"),
        key(ph.mid, fps, a.x * distance * 0.45, a.y * distance * 0.45, 99.6, 52, 1, "crossover"),
        key(ph.end, fps, a.x * distance, a.y * distance, 99, 0, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, -8, 97.8, 64, 3, "anticipate"),
        key(ph.mid, fps, 0, -4, 99, 82, 1, "crossover"),
        key(ph.settle, fps, a.x * over * 0.3, a.y * over * 0.3, 100.1, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planOverlayDim(frames, fps) {
    var ph = phaseFrames(frames, "snap");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 99.6, 88, 1, "crossover"),
        key(ph.end, fps, 0, 0, 99.4, 78, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 0, 0, "anticipate"),
        key(ph.mid, fps, 0, 0, 100, 22, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100, 40, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 42, 0, "done")
      ],
      phases: ph
    };
  }
  function planPopoverIn(frames, fps, comp, target) {
    var ph = phaseFrames(frames, "snap");
    var morph = planBoundsMorphJs((target && target.layerBounds) || defaultPopoverTargetBounds(), (target && target.destBounds) || defaultPopoverDestBounds());
    var dx = morph.valid ? morph.dx : 0;
    var dy = morph.valid ? morph.dy : 0;
    var over = overshootPx(Math.max(Math.abs(dx), Math.abs(dy), 24), 2);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 99.8, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 99.4, 72, 1, "crossover"),
        key(ph.end, fps, 0, 0, 99, 58, 2, "done")
      ],
      incoming: [
        key(ph.start, fps, r4(-dx), r4(-dy), 88, 0, 2, "anticipate"),
        key(ph.mid, fps, r4(-dx * 0.22), r4(-dy * 0.22), mixScale(88, 100, 60), 82, 0, "crossover"),
        key(ph.settle, fps, r4(dx === 0 ? 0 : (dx > 0 ? over : -over) * 0.12), r4(dy === 0 ? 0 : (dy > 0 ? over : -over) * 0.12), 100.3, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planPageFade(frames, fps) {
    var ph = phaseFrames(frames, "soft");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, 42, 0, "crossover"),
        key(ph.end, fps, 0, 0, 100, 0, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 0, 0, "anticipate"),
        key(ph.mid, fps, 0, 0, 100, 72, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planTabCross(frames, fps) {
    var ph = phaseFrames(frames, "snap");
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, 58, 0, "crossover"),
        key(ph.end, fps, 0, 0, 100, 0, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 0, 0, "anticipate"),
        key(ph.mid, fps, 0, 0, 100, 70, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function planToastIn(dir, frames, fps, comp) {
    var ph = phaseFrames(frames, "snap");
    var distance = travelDistance(dir, comp, 100, 100) * 0.08;
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 3);
    var a = axisOf(dir);
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, 100, 0, "crossover"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, -a.x * distance, -a.y * distance, 96, 0, 1, "anticipate"),
        key(ph.anticipate, fps, -a.x * distance + a.x * anti * 0.2, -a.y * distance + a.y * anti * 0.2, 97.2, 12, 1, "action"),
        key(ph.mid, fps, -a.x * distance * 0.2, -a.y * distance * 0.2, 99.2, 86, 0, "crossover"),
        key(ph.settle, fps, a.x * over, a.y * over, 100.3, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph
    };
  }
  function isMaskId(id) {
    return id === "EVT_MASK_CIRCLE" || id === "EVT_MASK_RECT" || id === "EVT_MASK_SOFT_EDGE" || id === "EVT_MASK_EXPAND" || id === "EVT_REVEAL_IRIS" || id === "EVT_REVEAL_WIPE_SOFT";
  }
  function maskSpecForId(id) {
    if (id === "EVT_MASK_CIRCLE") return { type: "ellipse", feather: 10, start: -160, mid: -48, end: 0, outMid: 64, profile: null, targetAware: 1, defaultW: 360, defaultH: 240 };
    if (id === "EVT_MASK_RECT") return { type: "roundedRect", feather: 6, start: -140, mid: -36, end: 0, outMid: 58, profile: null };
    if (id === "EVT_MASK_SOFT_EDGE") return { type: "roundedRect", feather: 28, start: -120, mid: -32, end: 0, outMid: 78, profile: "soft" };
    if (id === "EVT_MASK_EXPAND") return { type: "ellipse", feather: 8, start: -180, mid: -50, end: 0, outMid: 52, profile: null };
    if (id === "EVT_REVEAL_IRIS") return { type: "ellipse", feather: 14, start: -280, mid: -90, end: 0, outMid: 88, profile: "soft", targetAware: 1, defaultW: 960, defaultH: 540 };
    return { type: "roundedRect", feather: 18, start: -200, mid: -56, end: 0, outMid: 70, profile: null, wipe: 1, shift: 80 };
  }
  function maskExpansionScale(spec, layer, t0) {
    var rect, cover, base, scale;
    if (!spec.targetAware) return 1;
    try {
      rect = layer.sourceRectAtTime(t0, false);
      cover = Math.max(rect.width, rect.height);
      base = Math.max(spec.defaultW, spec.defaultH);
      scale = cover / base;
      if (scale < 0.6) return 0.6;
      if (scale > 2.4) return 2.4;
      return r4(scale);
    } catch (e) {
      return 1;
    }
  }
  function planMaskReveal(id, dir, frames, fps) {
    var spec = maskSpecForId(id);
    var ph = phaseFrames(frames, spec.profile);
    var start = spec.start;
    var mid = spec.mid;
    var a = axisOf(dir);
    var mask = {
      type: spec.type,
      feather: spec.feather,
      start: start,
      mid: mid,
      end: spec.end,
      wipe: spec.wipe ? 1 : 0,
      shift: spec.shift || 0,
      dir: dir,
      expansion: [
        { t: secondsFromFrames(ph.start, fps), value: start },
        { t: secondsFromFrames(ph.anticipate, fps), value: start },
        { t: secondsFromFrames(ph.mid, fps), value: mid },
        { t: secondsFromFrames(ph.end, fps), value: spec.end }
      ]
    };
    if (spec.wipe) {
      mask.shiftKeys = [
        { t: secondsFromFrames(ph.start, fps), x: a.x * spec.shift, y: a.y * spec.shift },
        { t: secondsFromFrames(ph.anticipate, fps), x: a.x * spec.shift, y: a.y * spec.shift },
        { t: secondsFromFrames(ph.mid, fps), x: a.x * spec.shift * 0.28, y: a.y * spec.shift * 0.28 },
        { t: secondsFromFrames(ph.end, fps), x: 0, y: 0 }
      ];
    }
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, spec.outMid, 0, "crossover"),
        key(ph.end, fps, 0, 0, 100, 0, 0, "done")
      ],
      incoming: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, 0, 0, 100, 100, 0, "action"),
        key(ph.mid, fps, 0, 0, 100, 100, 0, "crossover"),
        key(ph.settle, fps, 0, 0, 100, 100, 0, "settle"),
        key(ph.end, fps, 0, 0, 100, 100, 0, "done")
      ],
      phases: ph,
      mask: mask
    };
  }
  function setEllipseMaskShape(mask, cx, cy, rx, ry) {
    var shape = new Shape();
    var k = 0.552284749831;
    shape.vertices = [[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]];
    shape.inTangents = [[-rx * k, 0], [0, -ry * k], [rx * k, 0], [0, ry * k]];
    shape.outTangents = [[rx * k, 0], [0, ry * k], [-rx * k, 0], [0, -ry * k]];
    shape.closed = true;
    mask.property("ADBE Mask Shape").setValue(shape);
    return shape;
  }
  function setRectMaskShape(mask, left, top, w, h) {
    var shape = new Shape();
    shape.vertices = [[left, top], [left + w, top], [left + w, top + h], [left, top + h]];
    shape.inTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape.outTangents = [[0, 0], [0, 0], [0, 0], [0, 0]];
    shape.closed = true;
    mask.property("ADBE Mask Shape").setValue(shape);
    return shape;
  }
  function translateShape(shape, dx, dy) {
    var next = new Shape();
    var i, v;
    next.vertices = [];
    next.inTangents = [];
    next.outTangents = [];
    for (i = 0; i < shape.vertices.length; i++) {
      v = shape.vertices[i];
      next.vertices.push([v[0] + dx, v[1] + dy]);
      next.inTangents.push(shape.inTangents[i]);
      next.outTangents.push(shape.outTangents[i]);
    }
    next.closed = true;
    return next;
  }
  function applyNativeMask(layer, mask, t0, ease, scale) {
    var m, exp, rect, cx, cy, rx, ry, base, i, path, s;
    if (!mask) return;
    scale = scale == null ? 1 : scale;
    try {
      m = layer.Masks.addProperty("ADBE Mask Atom");
      m.name = "EVO_MASK_REVEAL";
      try { m.maskMode = MaskMode.ADD; } catch (e0) {}
      try { rect = layer.sourceRectAtTime(t0, false); } catch (e1) { rect = { left: -100, top: -100, width: 200, height: 200 }; }
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      rx = rect.width / 2;
      ry = rect.height / 2;
      if (mask.type === "ellipse") base = setEllipseMaskShape(m, cx, cy, rx, ry);
      else base = setRectMaskShape(m, rect.left, rect.top, rect.width, rect.height);
      try { m.property("ADBE Mask Feather").setValue([mask.feather, mask.feather]); } catch (e2) {}
      exp = m.property("ADBE Mask Offset");
      if (!exp) exp = m.property("Mask Expansion");
      for (i = 0; i < mask.expansion.length; i++) exp.setValueAtTime(t0 + mask.expansion[i].t, mask.expansion[i].value * scale);
      applyEase(exp, ease);
      if (mask.shiftKeys && mask.shiftKeys.length) {
        path = m.property("ADBE Mask Shape");
        for (i = 0; i < mask.shiftKeys.length; i++) {
          s = mask.shiftKeys[i];
          path.setValueAtTime(t0 + s.t, translateShape(base, s.x, s.y));
        }
        applyEase(path, ease);
      }
    } catch (e) {}
  }
  function isStaggerId(id) {
    return id === "EVT_STAGGER_CARDS" || id === "EVT_STAGGER_LIST" || id === "EVT_CASCADE_IN" || id === "EVT_CASCADE_OUT" || id === "EVT_STAGGER_FADE" || id === "EVT_WAVE_SOFT";
  }
  function staggerOffsetForId(id) {
    return id === "EVT_WAVE_SOFT" ? 4 : 3;
  }
  function shiftKeysJs(keys, offsetFrames, fps) {
    var out = [], i, k, frame;
    for (i = 0; i < keys.length; i++) {
      k = keys[i];
      frame = k.frame + offsetFrames;
      out.push(key(frame, fps, k.x, k.y, k.sx, k.opacity, k.blur, k.phase, k.sy));
    }
    return out;
  }
  function packStaggerItem(item, offsetFrames, fps, ph) {
    return {
      outgoing: item,
      incoming: shiftKeysJs(item, offsetFrames, fps),
      item: item,
      offsetFrames: offsetFrames,
      phases: ph
    };
  }
  function planStaggerEnter(dir, frames, fps, travel, enterScale, profile, offsetFrames) {
    var ph = phaseFrames(frames, profile);
    var a = axisOf(dir);
    var startX = -a.x * travel;
    var startY = -a.y * travel;
    var item = [
      key(ph.start, fps, startX, startY, enterScale, 0, 0, "anticipate"),
      key(ph.anticipate, fps, r4(startX * 0.88), r4(startY * 0.88), enterScale + 0.6, 18, 0, "action"),
      key(ph.mid, fps, r4(startX * 0.22), r4(startY * 0.22), mixScale(enterScale, 100, 60), 78, 0, "crossover"),
      key(ph.settle, fps, 0, 0, 100, 100, 0, "settle"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
    return packStaggerItem(item, offsetFrames, fps, ph);
  }
  function planStaggerCards(dir, frames, fps) {
    return planStaggerEnter(dir, frames, fps, 16, 98, null, 3);
  }
  function planStaggerList(dir, frames, fps) {
    return planStaggerEnter(dir, frames, fps, 16, 100, null, 3);
  }
  function planCascadeIn(dir, frames, fps) {
    return planStaggerEnter(dir, frames, fps, 12, 97, "soft", 3);
  }
  function planCascadeOut(dir, frames, fps) {
    var ph = phaseFrames(frames, "snap");
    var a = axisOf(dir);
    var travel = 16;
    var item = [
      key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
      key(ph.anticipate, fps, r4(a.x * travel * 0.08), r4(a.y * travel * 0.08), 100, 100, 0, "action"),
      key(ph.mid, fps, r4(a.x * travel * 0.45), r4(a.y * travel * 0.45), 99.2, 40, 0, "crossover"),
      key(ph.end, fps, r4(a.x * travel), r4(a.y * travel), 98, 0, 0, "done")
    ];
    return packStaggerItem(item, 3, fps, ph);
  }
  function planStaggerFade(frames, fps) {
    var ph = phaseFrames(frames);
    var item = [
      key(ph.start, fps, 0, 0, 100, 0, 0, "anticipate"),
      key(ph.mid, fps, 0, 0, 100, 58, 0, "crossover"),
      key(ph.settle, fps, 0, 0, 100, 100, 0, "settle"),
      key(ph.end, fps, 0, 0, 100, 100, 0, "done")
    ];
    return packStaggerItem(item, 3, fps, ph);
  }
  function planWaveSoft(dir, frames, fps) {
    return planStaggerEnter(dir, frames, fps, 16, 100, "soft", 4);
  }
  function planForId(id, dir, frames, fps, comp, target) {
    if (id === "EVT_UI_PUSH_SCALE") return planScale(frames, fps);
    if (id === "EVT_UI_PUSH_DEPTH") return planDepth(frames, fps);
    if (id === "EVT_UI_PUSH_SOFT") return planSoft(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_SNAP") return planSnap(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_OVERSHOOT") return planOvershoot(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_PARALLAX") return planParallax(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_FADE") return planFade(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_COVER") return planCover(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_PANEL") return planPanel(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_DASHBOARD") return planDashboard(dir, frames, fps, comp);
    if (id === "EVT_UI_PUSH_SPLIT") return planSplit(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_CARD_LEFT" || id === "EVT_SLIDE_CARD_RIGHT") return planCard(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_PANEL_IN") return planPanelIn(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_PANEL_OUT") return planPanelOut(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_DRAWER") return planDrawer(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_SHEET_UP") return planSheetUp(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_STACK") return planStack(dir, frames, fps, comp);
    if (id === "EVT_SLIDE_PEEK") return planPeek(dir, frames, fps, comp);
    if (id === "EVT_ZOOM_IN") return planZoomIn(frames, fps);
    if (id === "EVT_ZOOM_OUT") return planZoomOut(frames, fps);
    if (id === "EVT_ZOOM_TARGET") return planZoomTarget(frames, fps, comp, target);
    if (id === "EVT_ZOOM_MATCH") return planZoomMatch(frames, fps, comp, target);
    if (id === "EVT_SCALE_POP") return planScalePop(frames, fps);
    if (id === "EVT_SCALE_BREATHE") return planScaleBreathe(frames, fps);
    if (id === "EVT_SCALE_PUNCH") return planScalePunch(frames, fps, comp, target);
    if (id === "EVT_SCALE_SETTLE") return planScaleSettle(frames, fps);
    if (id === "EVT_SHARED_CARD") return planSharedCard(frames, fps, comp, target);
    if (id === "EVT_SHARED_IMAGE") return planSharedImage(frames, fps, comp, target);
    if (id === "EVT_MATCH_CUT") return planMatchCut(frames, fps, comp, target);
    if (id === "EVT_MORPH_BOUNDS") return planMorphBounds(frames, fps, comp, target);
    if (id === "EVT_HERO_TO_DETAIL") return planHeroToDetail(frames, fps, comp, target);
    if (id === "EVT_LIST_TO_DETAIL") return planListToDetail(frames, fps, comp, target);
    if (id === "EVT_MODAL_IN") return planModalIn(frames, fps);
    if (id === "EVT_MODAL_OUT") return planModalOut(frames, fps);
    if (id === "EVT_SHEET_UP") return planOverlaySheetUp(dir, frames, fps, comp);
    if (id === "EVT_SHEET_DOWN") return planOverlaySheetDown(dir, frames, fps, comp);
    if (id === "EVT_OVERLAY_DIM") return planOverlayDim(frames, fps);
    if (id === "EVT_POPOVER_IN") return planPopoverIn(frames, fps, comp, target);
    if (id === "EVT_TOAST_IN") return planToastIn(dir, frames, fps, comp);
    if (id === "EVT_PAGE_PUSH" || id === "EVT_NAV_FORWARD" || id === "EVT_NAV_BACK") return planDirectional(dir, frames, fps, comp);
    if (id === "EVT_PAGE_FADE") return planPageFade(frames, fps);
    if (id === "EVT_SCREEN_SWAP") return planCard(dir, frames, fps, comp);
    if (id === "EVT_TAB_CROSS") return planTabCross(frames, fps);
    if (id === "EVT_STAGGER_CARDS") return planStaggerCards(dir, frames, fps);
    if (id === "EVT_STAGGER_LIST") return planStaggerList(dir, frames, fps);
    if (id === "EVT_CASCADE_IN") return planCascadeIn(dir, frames, fps);
    if (id === "EVT_CASCADE_OUT") return planCascadeOut(dir, frames, fps);
    if (id === "EVT_STAGGER_FADE") return planStaggerFade(frames, fps);
    if (id === "EVT_WAVE_SOFT") return planWaveSoft(dir, frames, fps);
    if (isMaskId(id)) return planMaskReveal(id, dir, frames, fps);
    return planDirectional(dir, frames, fps, comp);
  }
  function defaultDirForId(id) {
    if (id === "EVT_UI_PUSH_RIGHT") return "right";
    if (id === "EVT_UI_PUSH_UP") return "up";
    if (id === "EVT_UI_PUSH_DOWN") return "down";
    if (id === "EVT_UI_PUSH_PANEL") return "right";
    if (id === "EVT_SLIDE_CARD_RIGHT") return "right";
    if (id === "EVT_SLIDE_PANEL_IN" || id === "EVT_SLIDE_PANEL_OUT") return "right";
    if (id === "EVT_SLIDE_SHEET_UP" || id === "EVT_SHEET_UP") return "up";
    if (id === "EVT_SHEET_DOWN" || id === "EVT_TOAST_IN") return "down";
    if (id === "EVT_NAV_BACK") return "right";
    if (id === "EVT_CASCADE_OUT") return "down";
    if (id === "EVT_STAGGER_CARDS" || id === "EVT_STAGGER_LIST" || id === "EVT_CASCADE_IN" || id === "EVT_STAGGER_FADE" || id === "EVT_WAVE_SOFT") return "up";
    return "left";
  }
  function remapId(id, dir) {
    if (id === "EVT_UI_PUSH_LEFT" || id === "EVT_UI_PUSH_RIGHT" || id === "EVT_UI_PUSH_UP" || id === "EVT_UI_PUSH_DOWN") {
      if (dir === "left") return "EVT_UI_PUSH_LEFT";
      if (dir === "right") return "EVT_UI_PUSH_RIGHT";
      if (dir === "up") return "EVT_UI_PUSH_UP";
      if (dir === "down") return "EVT_UI_PUSH_DOWN";
    }
    if (id === "EVT_SLIDE_CARD_LEFT" || id === "EVT_SLIDE_CARD_RIGHT") {
      if (dir === "right") return "EVT_SLIDE_CARD_RIGHT";
      if (dir === "left") return "EVT_SLIDE_CARD_LEFT";
    }
    return id;
  }
  function findCatalog(id) {
    var i;
    for (i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
    return null;
  }
  function runApply(list, groupList, dirList, easeList) {
    var comp = requireComp();
    if (!comp) return;
    var sel = selectedLayers(comp);
    var row, id, dir, group, frames, fps, ease, plan, t0, undo, i;
    if (!list.selection) { alert("Select a transition in the list."); return; }
    row = filtered[list.selection.index];
    if (!row) { alert("Select a transition in the list."); return; }
    dir = DIRS[dirList.selection ? dirList.selection.index : 0];
    id = remapId(row.id, dir);
    row = findCatalog(id) || row;
    if (!row.implemented) {
      alert(row.id + " is catalogued for Phase " + row.phase + ".\nPhase 6 applies Mask-Reveal (plus UI Push / UI-Slide / Scale-Zoom / Shared-Element / Overlay-Modal / Page-Screen / Stagger-Cascade).\nSee docs/TRANSITION_PHASES.md.");
      return;
    }
    if (sel.length < 2) {
      alert(isStaggerId(id) ? "Select 2+ list/card rows (top of selection = first)." : "Select outgoing, then incoming (two layers).");
      return;
    }
    group = groupList.selection ? String(groupList.selection.text) : "STANDARD";
    fps = comp.frameRate || DEFAULT_FPS;
    frames = durationFrames(group, fps);
    ease = EASING_IDS[easeList.selection ? easeList.selection.index : 0] || "premium-smooth";
    t0 = comp.time;
    plan = planForId(id, dir, frames, fps, comp, {
      layerBounds: layerBoundsBox(sel[0], t0) || defaultLayerBoundsForId(id),
      destBounds: layerBoundsBox(sel[1], t0) || defaultToBoundsForId(id)
    });
    undo = "Evotechly Transition · " + id;
    app.beginUndoGroup(undo);
    try {
      ensureControl(comp, frames, DIRS.indexOf(dir), EASING_IDS.indexOf(ease));
      if (isStaggerId(id) && plan.item) {
        for (i = 0; i < sel.length; i++) applyLayerKeys(sel[i], shiftKeysJs(plan.item, i * plan.offsetFrames, fps), t0, ease);
      } else {
        applyLayerKeys(sel[0], plan.outgoing, t0, ease);
        applyLayerKeys(sel[1], plan.incoming, t0, ease);
        if (plan.mask) applyNativeMask(sel[1], plan.mask, t0, ease, maskExpansionScale(maskSpecForId(id), sel[1], t0));
      }
      addMarker(comp, t0 + secondsFromFrames(plan.phases.start, fps), "EVT_SFX_ANTICIPATE", "sfx:ui-soft-in");
      addMarker(comp, t0 + secondsFromFrames(plan.phases.anticipate, fps), "EVT_SFX_ACTION", "sfx:ui-whoosh-soft");
      addMarker(comp, t0 + secondsFromFrames(plan.phases.mid, fps), "EVT_SFX_CROSSOVER", "sfx:ui-cross");
      addMarker(comp, t0 + secondsFromFrames(plan.phases.end, fps), "EVT_SFX_SETTLE", "sfx:ui-tick-soft");
    } catch (err) {
      alert(String(err));
      app.endUndoGroup();
      return;
    }
    app.endUndoGroup();
    alert(undo + "\n" + frames + "f @" + Math.round(fps) + "fps · " + ease + " · " + STYLE + "\nanticipate→action→crossover→settle");
  }
  function catalogLabel(row) {
    return (row.implemented ? "● " : "○ ") + (row.name || row.id) + "  ·  " + row.category;
  }
  function refreshList(list, searchField, catList) {
    var q = String(searchField.text || "").toLowerCase();
    var cat = catList.selection ? String(catList.selection.text) : "All";
    var i, row, blob;
    filtered = [];
    list.removeAll();
    for (i = 0; i < CATALOG.length; i++) {
      row = CATALOG[i];
      if (cat !== "All" && row.category !== cat) continue;
      blob = (row.id + " " + (row.name || "") + " " + row.category + " " + row.bestUse + " " + row.duration).toLowerCase();
      if (q && blob.indexOf(q) === -1) continue;
      filtered.push(row);
      list.add("item", catalogLabel(row));
    }
    if (filtered.length) list.selection = 0;
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Evotechly Transitions", undefined, { resizeable: true });
    var intro, searchField, catList, list, g, groupList, dirList, easeList, foot, note;
    var tabs, transTab, textTab, uiTab, curTab, chartTab, textList, uiList, curList, chartList, activeTab;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY  ·  Transitions");
    intro = win.add("statictext", undefined, "Phase 6 Mask-Reveal + Phase 13 Stagger-Cascade + Phase 10 Page-Screen + Phase 9 Overlay-Modal + Phase 12 Shared-Element + Phase 4 Scale-Zoom + Phase 3 UI-Slide + Phase 2 UI Push + P1 native Text / UI / Cursor + P2b Charts / Devices. Catalog is searchable. Companion to Motion OS — does not replace v0.32. Node is source of truth; this panel mirrors apply numbers.", { multiline: true });
    intro.characters = 46;

    g = win.add("group");
    g.add("statictext", undefined, "Search");
    searchField = g.add("edittext", undefined, "");
    searchField.characters = 18;
    catList = g.add("dropdownlist", undefined, CATEGORIES);
    catList.selection = 0;

    tabs = win.add("tabbedpanel");
    tabs.alignChildren = ["fill", "fill"];
    transTab = tabs.add("tab", undefined, "Transitions");
    textTab = tabs.add("tab", undefined, "Text");
    uiTab = tabs.add("tab", undefined, "UI");
    curTab = tabs.add("tab", undefined, "Cursor");
    chartTab = tabs.add("tab", undefined, "Charts");
    transTab.orientation = "column";
    transTab.alignChildren = ["fill", "fill"];
    textTab.orientation = "column";
    textTab.alignChildren = ["fill", "fill"];
    uiTab.orientation = "column";
    uiTab.alignChildren = ["fill", "fill"];
    curTab.orientation = "column";
    curTab.alignChildren = ["fill", "fill"];
    chartTab.orientation = "column";
    chartTab.alignChildren = ["fill", "fill"];
    tabs.selection = transTab;
    activeTab = "Transitions";

    list = transTab.add("listbox", undefined, []);
    list.preferredSize = [340, 180];

    textList = textTab.add("listbox", undefined, []);
    textList.preferredSize = [340, 200];
    uiList = uiTab.add("listbox", undefined, []);
    uiList.preferredSize = [340, 200];
    curList = curTab.add("listbox", undefined, []);
    curList.preferredSize = [340, 200];
    chartList = chartTab.add("listbox", undefined, []);
    chartList.preferredSize = [340, 200];

    g = win.add("group");
    g.add("statictext", undefined, "Duration");
    groupList = g.add("dropdownlist", undefined, ["MICRO", "FAST", "STANDARD", "SMOOTH", "HERO"]);
    groupList.selection = 2;
    g.add("statictext", undefined, "Dir");
    dirList = g.add("dropdownlist", undefined, ["Left", "Right", "Up", "Down"]);
    dirList.selection = 0;

    g = win.add("group");
    g.add("statictext", undefined, "Ease");
    easeList = g.add("dropdownlist", undefined, ["premium-smooth", "apple-smooth", "fast-product", "soft-ui", "snappy", "elastic-micro"]);
    easeList.selection = 0;

    win.add("button", undefined, "Apply").onClick = function () {
      if (activeTab === "Transitions") runApply(list, groupList, dirList, easeList);
      else if (activeTab === "Text") runApplyAsset("Text", textList, groupList, easeList);
      else if (activeTab === "UI") runApplyAsset("UI", uiList, groupList, easeList);
      else if (activeTab === "Charts") runApplyAsset("Charts", chartList, groupList, easeList);
      else runApplyAsset("Cursor", curList, groupList, easeList);
    };

    note = win.add("statictext", undefined, "Transitions: select outgoing, then incoming. Stagger-Cascade: 2+ row layers (top = first). Text / UI / Cursor / Charts: select the target layer (Swap needs two; series/funnel stagger selected layers). ● = apply. Native only — no vendor packs.", { multiline: true });
    note.characters = 46;

    foot = win.add("statictext", undefined, "Install: Scripts/ScriptUI Panels next to Motion OS Hub. Docs: TRANSITION_KIT.md · TRANSITION_PHASES.md.", { multiline: true });
    foot.characters = 46;

    function onFilter() { refreshList(list, searchField, catList); }
    function onAssetFilter() {
      if (activeTab === "Text") refreshAssetList(textList, searchField, TEXT_CATALOG);
      else if (activeTab === "UI") refreshAssetList(uiList, searchField, UI_CATALOG);
      else if (activeTab === "Cursor") refreshAssetList(curList, searchField, CURSOR_CATALOG);
      else if (activeTab === "Charts") refreshAssetList(chartList, searchField, CHART_CATALOG);
    }
    searchField.onChanging = function () {
      if (activeTab === "Transitions") onFilter();
      else onAssetFilter();
    };
    catList.onChange = onFilter;
    list.onChange = function () {
      var row = list.selection ? filtered[list.selection.index] : null;
      var d;
      if (!row) return;
      d = defaultDirForId(row.id);
      dirList.selection = DIRS.indexOf(d);
    };
    tabs.onChange = function () {
      var title = tabs.selection ? String(tabs.selection.text) : "Transitions";
      activeTab = title;
      if (activeTab === "Transitions") onFilter();
      else onAssetFilter();
    };
    refreshList(list, searchField, catList);
    refreshAssetList(textList, searchField, TEXT_CATALOG);
    refreshAssetList(uiList, searchField, UI_CATALOG);
    refreshAssetList(curList, searchField, CURSOR_CATALOG);
    refreshAssetList(chartList, searchField, CHART_CATALOG);
    if (list.selection) list.onChange();

    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else win.layout.layout(true);
    return win;
  }

  buildUI(thisObj);
})(this);
