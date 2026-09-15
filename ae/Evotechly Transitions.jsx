#target aftereffects
/*
  Evotechly Transitions — companion ScriptUI (Transition Kit Phase 0–1).
  Window → Evotechly Transitions.
  Numbers mirrored from core/transitions/*.js — Node is source of truth.
  ExtendScript cannot require Node. Apply the six UI Push IDs here.
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
    EVT_UI_PUSH_DEPTH: 1
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
    { id: "EVT_UI_PUSH_LEFT", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Dashboard → next screen, iOS-style push left" },
    { id: "EVT_UI_PUSH_RIGHT", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Back navigation, previous screen from the left" },
    { id: "EVT_UI_PUSH_UP", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Sheet-like screen rise, settings stack" },
    { id: "EVT_UI_PUSH_DOWN", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: true, phase: 1, bestUse: "Dismiss upward stack, close overlay screen" },
    { id: "EVT_UI_PUSH_SCALE", category: "UI-Push", duration: "STANDARD", intensity: "subtle", implemented: true, phase: 1, bestUse: "Card or modal swap without a hard slide" },
    { id: "EVT_UI_PUSH_DEPTH", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: true, phase: 1, bestUse: "Recede outgoing, lift incoming — product tour" },
    { id: "EVT_UI_PUSH_SOFT", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 2, bestUse: "Same as left with longer settle" },
    { id: "EVT_UI_PUSH_SNAP", category: "UI-Push", duration: "FAST", intensity: "bold", implemented: false, phase: 2, bestUse: "Short product chrome, tab-to-tab" },
    { id: "EVT_UI_PUSH_OVERSHOOT", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: false, phase: 2, bestUse: "Push with a quieter elastic settle" },
    { id: "EVT_UI_PUSH_PARALLAX", category: "UI-Push", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 2, bestUse: "Foreground moves more than background" },
    { id: "EVT_UI_PUSH_FADE", category: "UI-Push", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 2, bestUse: "Push plus crossfade for busy UI" },
    { id: "EVT_UI_PUSH_COVER", category: "UI-Push", duration: "STANDARD", intensity: "standard", implemented: false, phase: 2, bestUse: "Incoming covers outgoing; outgoing stays" },
    { id: "EVT_SLIDE_CARD_LEFT", category: "UI-Slide", duration: "FAST", intensity: "subtle", implemented: false, phase: 3, bestUse: "Single card enters from right" },
    { id: "EVT_SLIDE_CARD_RIGHT", category: "UI-Slide", duration: "FAST", intensity: "subtle", implemented: false, phase: 3, bestUse: "Single card enters from left" },
    { id: "EVT_SLIDE_PANEL_IN", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: false, phase: 3, bestUse: "Side panel / inspector in" },
    { id: "EVT_SLIDE_PANEL_OUT", category: "UI-Slide", duration: "FAST", intensity: "standard", implemented: false, phase: 3, bestUse: "Side panel dismiss" },
    { id: "EVT_SLIDE_DRAWER", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: false, phase: 3, bestUse: "Nav drawer from leading edge" },
    { id: "EVT_SLIDE_SHEET_UP", category: "UI-Slide", duration: "STANDARD", intensity: "standard", implemented: false, phase: 3, bestUse: "Bottom sheet present" },
    { id: "EVT_SLIDE_STACK", category: "UI-Slide", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 3, bestUse: "Card stack peek + commit" },
    { id: "EVT_SLIDE_PEEK", category: "UI-Slide", duration: "MICRO", intensity: "subtle", implemented: false, phase: 3, bestUse: "Partial reveal, then hold" },
    { id: "EVT_ZOOM_IN", category: "Scale-Zoom", duration: "STANDARD", intensity: "standard", implemented: false, phase: 4, bestUse: "Plate scales up into frame" },
    { id: "EVT_ZOOM_OUT", category: "Scale-Zoom", duration: "STANDARD", intensity: "standard", implemented: false, phase: 4, bestUse: "Pull back to context" },
    { id: "EVT_ZOOM_TARGET", category: "Scale-Zoom", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 4, bestUse: "Frame a selected region (target required)" },
    { id: "EVT_ZOOM_MATCH", category: "Scale-Zoom", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 4, bestUse: "Match outgoing crop to incoming" },
    { id: "EVT_SCALE_POP", category: "Scale-Zoom", duration: "FAST", intensity: "standard", implemented: false, phase: 4, bestUse: "90→100 card present" },
    { id: "EVT_SCALE_BREATHE", category: "Scale-Zoom", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 4, bestUse: "Idle 100→102→100 — use sparingly" },
    { id: "EVT_SCALE_PUNCH", category: "Scale-Zoom", duration: "FAST", intensity: "bold", implemented: false, phase: 4, bestUse: "Short punch-in on a KPI" },
    { id: "EVT_SCALE_SETTLE", category: "Scale-Zoom", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 4, bestUse: "Oversize incoming eases to 100" },
    { id: "EVT_FADE_CROSS", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "Opacity swap, no travel" },
    { id: "EVT_FADE_SOFT", category: "Crossfade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 5, bestUse: "Longer dissolve for dense UI" },
    { id: "EVT_FADE_HOLD", category: "Crossfade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 5, bestUse: "Crossfade with a still hold" },
    { id: "EVT_FADE_DIP", category: "Crossfade", duration: "FAST", intensity: "standard", implemented: false, phase: 5, bestUse: "Brief dip to brand fill, then in" },
    { id: "EVT_DISSOLVE_UI", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "UI plate dissolve, keep chrome" },
    { id: "EVT_DISSOLVE_COLOR", category: "Crossfade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 5, bestUse: "Tinted dissolve, one brand color" },
    { id: "EVT_MASK_CIRCLE", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: false, phase: 6, bestUse: "Soft circular reveal on a card" },
    { id: "EVT_MASK_RECT", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: false, phase: 6, bestUse: "Rounded-rect expand" },
    { id: "EVT_MASK_SOFT_EDGE", category: "Mask-Reveal", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 6, bestUse: "Feathered matte, no hard wipe" },
    { id: "EVT_MASK_EXPAND", category: "Mask-Reveal", duration: "STANDARD", intensity: "standard", implemented: false, phase: 6, bestUse: "Mask expansion from center" },
    { id: "EVT_REVEAL_IRIS", category: "Mask-Reveal", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 6, bestUse: "Quiet iris on a screenshot" },
    { id: "EVT_REVEAL_WIPE_SOFT", category: "Mask-Reveal", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 6, bestUse: "Soft directional matte, not a bar wipe" },
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
    { id: "EVT_MODAL_IN", category: "Overlay-Modal", duration: "STANDARD", intensity: "standard", implemented: false, phase: 9, bestUse: "Dialog present + dim" },
    { id: "EVT_MODAL_OUT", category: "Overlay-Modal", duration: "FAST", intensity: "standard", implemented: false, phase: 9, bestUse: "Dialog dismiss" },
    { id: "EVT_SHEET_UP", category: "Overlay-Modal", duration: "STANDARD", intensity: "standard", implemented: false, phase: 9, bestUse: "Modal sheet from bottom" },
    { id: "EVT_SHEET_DOWN", category: "Overlay-Modal", duration: "FAST", intensity: "standard", implemented: false, phase: 9, bestUse: "Sheet dismiss" },
    { id: "EVT_OVERLAY_DIM", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: false, phase: 9, bestUse: "Dim plate only" },
    { id: "EVT_POPOVER_IN", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: false, phase: 9, bestUse: "Popover from a target" },
    { id: "EVT_TOAST_IN", category: "Overlay-Modal", duration: "FAST", intensity: "subtle", implemented: false, phase: 9, bestUse: "Toast from edge, then settle" },
    { id: "EVT_PAGE_PUSH", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: false, phase: 10, bestUse: "Full-page push using UI Push math" },
    { id: "EVT_PAGE_FADE", category: "Page-Screen", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 10, bestUse: "Full-page fade" },
    { id: "EVT_SCREEN_SWAP", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: false, phase: 10, bestUse: "Replace screen, keep app chrome" },
    { id: "EVT_NAV_FORWARD", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: false, phase: 10, bestUse: "Forward in an IA stack" },
    { id: "EVT_NAV_BACK", category: "Page-Screen", duration: "STANDARD", intensity: "standard", implemented: false, phase: 10, bestUse: "Back in an IA stack" },
    { id: "EVT_TAB_CROSS", category: "Page-Screen", duration: "FAST", intensity: "subtle", implemented: false, phase: 10, bestUse: "Tab content crossfade" },
    { id: "EVT_WIPE_SOFT_L", category: "Wipe-Split", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 11, bestUse: "Soft left wipe — no hard bar" },
    { id: "EVT_WIPE_SOFT_R", category: "Wipe-Split", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 11, bestUse: "Soft right wipe" },
    { id: "EVT_SPLIT_H", category: "Wipe-Split", duration: "STANDARD", intensity: "standard", implemented: false, phase: 11, bestUse: "Horizontal split reveal" },
    { id: "EVT_SPLIT_V", category: "Wipe-Split", duration: "STANDARD", intensity: "standard", implemented: false, phase: 11, bestUse: "Vertical split reveal" },
    { id: "EVT_WIPE_GRADIENT", category: "Wipe-Split", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 11, bestUse: "Native gradient wipe, Apple ease" },
    { id: "EVT_SPLIT_REVEAL", category: "Wipe-Split", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 11, bestUse: "Center split, incoming in the gap" },
    { id: "EVT_SHARED_CARD", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 12, bestUse: "Card bounds morph to detail" },
    { id: "EVT_SHARED_IMAGE", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 12, bestUse: "Image hero → gallery" },
    { id: "EVT_MATCH_CUT", category: "Shared-Element", duration: "FAST", intensity: "subtle", implemented: false, phase: 12, bestUse: "Match position/scale, cut the rest" },
    { id: "EVT_MORPH_BOUNDS", category: "Shared-Element", duration: "STANDARD", intensity: "standard", implemented: false, phase: 12, bestUse: "Rect morph only (no mesh)" },
    { id: "EVT_HERO_TO_DETAIL", category: "Shared-Element", duration: "SMOOTH", intensity: "standard", implemented: false, phase: 12, bestUse: "Marketing hero into app UI" },
    { id: "EVT_LIST_TO_DETAIL", category: "Shared-Element", duration: "STANDARD", intensity: "standard", implemented: false, phase: 12, bestUse: "Row expands into detail pane" },
    { id: "EVT_STAGGER_CARDS", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 13, bestUse: "Card row stagger in" },
    { id: "EVT_STAGGER_LIST", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 13, bestUse: "List rows cascade" },
    { id: "EVT_CASCADE_IN", category: "Stagger-Cascade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 13, bestUse: "Tree / nav cascade in" },
    { id: "EVT_CASCADE_OUT", category: "Stagger-Cascade", duration: "FAST", intensity: "subtle", implemented: false, phase: 13, bestUse: "Cascade out" },
    { id: "EVT_STAGGER_FADE", category: "Stagger-Cascade", duration: "STANDARD", intensity: "subtle", implemented: false, phase: 13, bestUse: "Opacity-only stagger" },
    { id: "EVT_WAVE_SOFT", category: "Stagger-Cascade", duration: "SMOOTH", intensity: "subtle", implemented: false, phase: 13, bestUse: "Soft delay wave, no bounce" },
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
  var filtered = [];

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
  function phaseFrames(d) {
    var anticipate, mid, settle;
    d = Math.max(2, Math.round(d));
    anticipate = Math.max(1, Math.round(d * 0.125));
    mid = Math.max(anticipate + 1, Math.round(d * 0.5));
    settle = Math.max(mid + 1, Math.round(d * 0.82));
    return {
      start: 0,
      anticipate: Math.min(anticipate, d - 1),
      mid: Math.min(mid, d - 1),
      settle: Math.min(settle, d - 1),
      end: d
    };
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
  function key(frame, fps, x, y, sx, opacity, blur, phase) {
    return { t: secondsFromFrames(frame, fps), frame: frame, x: x, y: y, sx: sx, sy: sx, opacity: opacity, blur: blur, phase: phase };
  }
  function planDirectional(dir, frames, fps, comp) {
    var ph = phaseFrames(frames);
    var distance = travelDistance(dir, comp, 100, 100);
    var anti = anticipatePx(distance);
    var over = overshootPx(distance, 6);
    var ax = 0, ay = 0;
    if (dir === "left") ax = -1;
    if (dir === "right") ax = 1;
    if (dir === "up") ay = -1;
    if (dir === "down") ay = 1;
    return {
      outgoing: [
        key(ph.start, fps, 0, 0, 100, 100, 0, "anticipate"),
        key(ph.anticipate, fps, -ax * anti, -ay * anti, 100, 100, 0, "action"),
        key(ph.mid, fps, ax * distance * 0.5, ay * distance * 0.5, 99.2, 55, 2, "crossover"),
        key(ph.end, fps, ax * distance, ay * distance, 98, 0, 6, "done")
      ],
      incoming: [
        key(ph.start, fps, -ax * distance, -ay * distance, 101.5, 0, 6, "anticipate"),
        key(ph.mid, fps, -ax * distance * 0.18, -ay * distance * 0.18, 100.4, 78, 2, "crossover"),
        key(ph.settle, fps, ax * over, ay * over, 100.2, 100, 0, "settle"),
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
  function remapId(id, dir) {
    if (id === "EVT_UI_PUSH_LEFT" || id === "EVT_UI_PUSH_RIGHT" || id === "EVT_UI_PUSH_UP" || id === "EVT_UI_PUSH_DOWN") {
      if (dir === "left") return "EVT_UI_PUSH_LEFT";
      if (dir === "right") return "EVT_UI_PUSH_RIGHT";
      if (dir === "up") return "EVT_UI_PUSH_UP";
      if (dir === "down") return "EVT_UI_PUSH_DOWN";
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
    var row, id, dir, group, frames, fps, ease, plan, t0, undo;
    if (!list.selection) { alert("Select a transition in the list."); return; }
    row = filtered[list.selection.index];
    if (!row) { alert("Select a transition in the list."); return; }
    dir = DIRS[dirList.selection ? dirList.selection.index : 0];
    id = remapId(row.id, dir);
    row = findCatalog(id) || row;
    if (!row.implemented) {
      alert(row.id + " is catalogued for Phase " + row.phase + ".\nPhase 1 applies the six UI Push IDs only.\nSee docs/TRANSITION_PHASES.md.");
      return;
    }
    if (sel.length < 2) { alert("Select outgoing, then incoming (two layers)."); return; }
    group = groupList.selection ? String(groupList.selection.text) : "STANDARD";
    fps = comp.frameRate || DEFAULT_FPS;
    frames = durationFrames(group, fps);
    ease = EASING_IDS[easeList.selection ? easeList.selection.index : 0] || "premium-smooth";
    t0 = comp.time;
    if (id === "EVT_UI_PUSH_SCALE") plan = planScale(frames, fps);
    else if (id === "EVT_UI_PUSH_DEPTH") plan = planDepth(frames, fps);
    else plan = planDirectional(dir, frames, fps, comp);
    undo = "Evotechly Transition · " + id;
    app.beginUndoGroup(undo);
    try {
      ensureControl(comp, frames, DIRS.indexOf(dir), EASING_IDS.indexOf(ease));
      applyLayerKeys(sel[0], plan.outgoing, t0, ease);
      applyLayerKeys(sel[1], plan.incoming, t0, ease);
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
    return (row.implemented ? "● " : "○ ") + row.id + "  ·  " + row.category;
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
      blob = (row.id + " " + row.category + " " + row.bestUse + " " + row.duration).toLowerCase();
      if (q && blob.indexOf(q) === -1) continue;
      filtered.push(row);
      list.add("item", catalogLabel(row));
    }
    if (filtered.length) list.selection = 0;
  }

  function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Evotechly Transitions", undefined, { resizeable: true });
    var intro, searchField, catList, list, g, groupList, dirList, easeList, foot, note;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 8;
    win.margins = 10;
    win.add("statictext", undefined, "EVOTECHLY  ·  Transitions");
    intro = win.add("statictext", undefined, "Phase 1 · six UI Push plans. Catalog is searchable. Companion to Motion OS — does not replace v0.32. Node is source of truth; this panel mirrors apply numbers.", { multiline: true });
    intro.characters = 46;

    g = win.add("group");
    g.add("statictext", undefined, "Search");
    searchField = g.add("edittext", undefined, "");
    searchField.characters = 18;
    catList = g.add("dropdownlist", undefined, CATEGORIES);
    catList.selection = 0;

    list = win.add("listbox", undefined, []);
    list.preferredSize = [340, 200];

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

    win.add("button", undefined, "Apply").onClick = function () { runApply(list, groupList, dirList, easeList); };

    note = win.add("statictext", undefined, "Select outgoing, then incoming. ● = Phase 1 apply. ○ = catalog only. Control null: EVOTECHLY_TRANSITION_CONTROL. SFX = markers only.", { multiline: true });
    note.characters = 46;

    foot = win.add("statictext", undefined, "Install: Scripts/ScriptUI Panels next to Motion OS Hub. Docs: TRANSITION_KIT.md · TRANSITION_PHASES.md.", { multiline: true });
    foot.characters = 46;

    function onFilter() { refreshList(list, searchField, catList); }
    searchField.onChanging = onFilter;
    catList.onChange = onFilter;
    refreshList(list, searchField, catList);

    win.onResizing = win.onResize = function () { this.layout.resize(); };
    if (win instanceof Window) { win.center(); win.show(); }
    else win.layout.layout(true);
    return win;
  }

  buildUI(thisObj);
})(this);
