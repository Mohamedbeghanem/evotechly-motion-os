"use strict";

/**
 * Transition Kit engine — deterministic plans.
 * Node is source of truth. JSX mirrors UI Push / UI-Slide / Scale-Zoom / Shared-Element / Overlay-Modal / Page-Screen / Stagger-Cascade / Mask-Reveal numbers.
 * Native AE only. No .ffx / .aep / vendor plugins.
 */

const { clamp } = require("../saasDemo");
const { normalizeEase, easeInfluences, DEFAULT_EASE } = require("./easing");
const { durationFrames, secondsFromFrames, DEFAULT_FPS, normalizeFps, normalizeTimingGroup } = require("./timing");
const { planTargetZoom } = require("./target");
const { planTransitionControl, CONTROL_NAME, DIRECTION_ENUM } = require("./control");
const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");
const scaleZoom = require("./scaleZoom");
const sharedElement = require("./sharedElement");
const overlayModal = require("./overlayModal");
const pageScreen = require("./pageScreen");
const staggerCascade = require("./staggerCascade");
const maskReveal = require("./maskReveal");

const IMPLEMENTED_IDS = uiPush.UI_PUSH_IDS.concat(uiSlide.UI_SLIDE_IDS)
  .concat(scaleZoom.SCALE_ZOOM_IDS)
  .concat(sharedElement.SHARED_ELEMENT_IDS)
  .concat(overlayModal.OVERLAY_MODAL_IDS)
  .concat(pageScreen.PAGE_SCREEN_IDS)
  .concat(staggerCascade.STAGGER_CASCADE_IDS)
  .concat(maskReveal.MASK_REVEAL_IDS);
const ANATOMY = uiPush.ANATOMY;
const STYLE = "premium-saas";
const DEFAULT_COMP = { w: 1920, h: 1080, fps: DEFAULT_FPS };

function layerName(layer, fallback) {
  if (layer == null) return fallback;
  if (typeof layer === "string") return layer;
  return layer.name || layer.layer || layer.id || fallback;
}

function layerRest(layer) {
  if (!layer || typeof layer === "string") return [0, 0];
  const pos = layer.position || layer.rest || layer.pos;
  if (Array.isArray(pos) && pos.length >= 2) return [Number(pos[0]) || 0, Number(pos[1]) || 0];
  if (layer.x != null || layer.y != null) return [Number(layer.x) || 0, Number(layer.y) || 0];
  return [0, 0];
}

function normalizeId(id) {
  const mask = maskReveal.resolveId(id);
  if (maskReveal.isMaskRevealId(mask)) return mask;
  const stagger = staggerCascade.resolveId(id);
  if (staggerCascade.isStaggerCascadeId(stagger)) return stagger;
  const page = pageScreen.resolveId(id);
  if (pageScreen.isPageScreenId(page)) return page;
  const overlay = overlayModal.resolveId(id);
  if (overlayModal.isOverlayModalId(overlay)) return overlay;
  const shared = sharedElement.resolveId(id);
  if (sharedElement.isSharedElementId(shared)) return shared;
  const zoom = scaleZoom.resolveId(id);
  if (scaleZoom.isScaleZoomId(zoom)) return zoom;
  const slide = uiSlide.resolveId(id);
  if (uiSlide.isUiSlideId(slide)) return slide;
  return uiPush.resolveId(id);
}

function defaultDirectionForId(id) {
  if (maskReveal.DEFAULT_DIRECTION_BY_ID[id]) return maskReveal.DEFAULT_DIRECTION_BY_ID[id];
  if (staggerCascade.DEFAULT_DIRECTION_BY_ID[id]) return staggerCascade.DEFAULT_DIRECTION_BY_ID[id];
  if (pageScreen.DEFAULT_DIRECTION_BY_ID[id]) return pageScreen.DEFAULT_DIRECTION_BY_ID[id];
  if (overlayModal.DEFAULT_DIRECTION_BY_ID[id]) return overlayModal.DEFAULT_DIRECTION_BY_ID[id];
  if (uiSlide.DEFAULT_DIRECTION_BY_ID[id]) return uiSlide.DEFAULT_DIRECTION_BY_ID[id];
  if (uiPush.DEFAULT_DIRECTION_BY_ID[id]) return uiPush.DEFAULT_DIRECTION_BY_ID[id];
  return "left";
}

function defaultGroupForId(id) {
  return (
    maskReveal.DEFAULT_GROUP_BY_ID[id] ||
    staggerCascade.DEFAULT_GROUP_BY_ID[id] ||
    pageScreen.DEFAULT_GROUP_BY_ID[id] ||
    overlayModal.DEFAULT_GROUP_BY_ID[id] ||
    sharedElement.DEFAULT_GROUP_BY_ID[id] ||
    scaleZoom.DEFAULT_GROUP_BY_ID[id] ||
    uiSlide.DEFAULT_GROUP_BY_ID[id] ||
    uiPush.DEFAULT_GROUP_BY_ID[id] ||
    "STANDARD"
  );
}

function defaultOvershootForId(id) {
  if (maskReveal.DEFAULT_OVERSHOOT_BY_ID[id] != null) return maskReveal.DEFAULT_OVERSHOOT_BY_ID[id];
  if (staggerCascade.DEFAULT_OVERSHOOT_BY_ID[id] != null) return staggerCascade.DEFAULT_OVERSHOOT_BY_ID[id];
  if (pageScreen.DEFAULT_OVERSHOOT_BY_ID[id] != null) return pageScreen.DEFAULT_OVERSHOOT_BY_ID[id];
  if (overlayModal.DEFAULT_OVERSHOOT_BY_ID[id] != null) return overlayModal.DEFAULT_OVERSHOOT_BY_ID[id];
  if (sharedElement.DEFAULT_OVERSHOOT_BY_ID[id] != null) return sharedElement.DEFAULT_OVERSHOOT_BY_ID[id];
  if (scaleZoom.DEFAULT_OVERSHOOT_BY_ID[id] != null) return scaleZoom.DEFAULT_OVERSHOOT_BY_ID[id];
  if (uiSlide.DEFAULT_OVERSHOOT_BY_ID[id] != null) return uiSlide.DEFAULT_OVERSHOOT_BY_ID[id];
  if (uiPush.DEFAULT_OVERSHOOT_BY_ID[id] != null) return uiPush.DEFAULT_OVERSHOOT_BY_ID[id];
  return 6;
}

function familyCategory(id) {
  if (maskReveal.isMaskRevealId(id)) return "Mask-Reveal";
  if (staggerCascade.isStaggerCascadeId(id)) return "Stagger-Cascade";
  if (pageScreen.isPageScreenId(id)) return "Page-Screen";
  if (overlayModal.isOverlayModalId(id)) return "Overlay-Modal";
  if (sharedElement.isSharedElementId(id)) return "Shared-Element";
  if (scaleZoom.isScaleZoomId(id)) return "Scale-Zoom";
  if (uiSlide.isUiSlideId(id)) return "UI-Slide";
  if (uiPush.isUiPushId(id)) return "UI-Push";
  return "UI-Push";
}

function familyDisplayName(id) {
  if (maskReveal.isMaskRevealId(id)) return maskReveal.displayName(id);
  if (staggerCascade.isStaggerCascadeId(id)) return staggerCascade.displayName(id);
  if (pageScreen.isPageScreenId(id)) return pageScreen.displayName(id);
  if (overlayModal.isOverlayModalId(id)) return overlayModal.displayName(id);
  if (sharedElement.isSharedElementId(id)) return sharedElement.displayName(id);
  if (scaleZoom.isScaleZoomId(id)) return scaleZoom.displayName(id);
  if (uiSlide.isUiSlideId(id)) return uiSlide.displayName(id);
  return uiPush.displayName(id);
}

function familyPhaseProfile(id) {
  return (
    maskReveal.PHASE_PROFILE[id] ||
    staggerCascade.PHASE_PROFILE[id] ||
    pageScreen.PHASE_PROFILE[id] ||
    overlayModal.PHASE_PROFILE[id] ||
    uiPush.PHASE_PROFILE[id] ||
    scaleZoom.PHASE_PROFILE[id] ||
    sharedElement.PHASE_PROFILE[id]
  );
}

function normalizePushDirection(value, id) {
  const resolved = normalizeId(id);
  if (value != null && value !== "") {
    const raw = String(value).toLowerCase();
    if (uiPush.AXIS[raw]) return raw;
    const asNum = Number(value);
    if (asNum === asNum && DIRECTION_ENUM[asNum]) return DIRECTION_ENUM[asNum];
  }
  return defaultDirectionForId(resolved);
}

function implementedIdForDirection(direction) {
  const map = {
    left: "EVT_UI_PUSH_LEFT",
    right: "EVT_UI_PUSH_RIGHT",
    up: "EVT_UI_PUSH_UP",
    down: "EVT_UI_PUSH_DOWN"
  };
  return map[direction] || "EVT_UI_PUSH_LEFT";
}

function remapDirectionalId(id, direction, explicitDirection) {
  if (id === "EVT_UI_PUSH_LEFT" || id === "EVT_UI_PUSH_RIGHT" || id === "EVT_UI_PUSH_UP" || id === "EVT_UI_PUSH_DOWN") {
    if (explicitDirection != null && direction !== defaultDirectionForId(id)) {
      return implementedIdForDirection(direction);
    }
  }
  if (id === "EVT_SLIDE_CARD_LEFT" || id === "EVT_SLIDE_CARD_RIGHT") {
    if (explicitDirection != null && (direction === "left" || direction === "right") && direction !== defaultDirectionForId(id)) {
      return direction === "right" ? "EVT_SLIDE_CARD_RIGHT" : "EVT_SLIDE_CARD_LEFT";
    }
  }
  return id;
}

function sfxMarkers(fps, phases) {
  return [
    { name: "EVT_SFX_ANTICIPATE", t: secondsFromFrames(phases.start, fps), frame: phases.start, hook: "ui-soft-in", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_ACTION", t: secondsFromFrames(phases.anticipate, fps), frame: phases.anticipate, hook: "ui-whoosh-soft", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_CROSSOVER", t: secondsFromFrames(phases.mid, fps), frame: phases.mid, hook: "ui-cross", comment: "SFX hook only — no audio shipped" },
    { name: "EVT_SFX_SETTLE", t: secondsFromFrames(phases.end, fps), frame: phases.end, hook: "ui-tick-soft", comment: "SFX hook only — no audio shipped" }
  ];
}

function anatomyWindow(phases, fps) {
  return {
    anticipate: { startFrame: phases.start, endFrame: phases.anticipate, start: secondsFromFrames(phases.start, fps), end: secondsFromFrames(phases.anticipate, fps) },
    action: { startFrame: phases.anticipate, endFrame: phases.mid, start: secondsFromFrames(phases.anticipate, fps), end: secondsFromFrames(phases.mid, fps) },
    crossover: { startFrame: phases.mid, endFrame: phases.mid, start: secondsFromFrames(phases.mid, fps), end: secondsFromFrames(phases.mid, fps) },
    settle: { startFrame: phases.mid, endFrame: phases.end, start: secondsFromFrames(phases.mid, fps), end: secondsFromFrames(phases.end, fps) }
  };
}

function applyTransitionPlan(opts) {
  opts = opts || {};
  let id = normalizeId(opts.id);
  const fps = normalizeFps(opts.fps || (opts.comp && opts.comp.fps) || DEFAULT_FPS);
  const ease = normalizeEase(opts.ease || DEFAULT_EASE);
  const comp = {
    w: Number((opts.comp && (opts.comp.w || opts.comp.width)) || DEFAULT_COMP.w),
    h: Number((opts.comp && (opts.comp.h || opts.comp.height)) || DEFAULT_COMP.h),
    fps: fps
  };
  const strength = opts.strength == null ? 100 : opts.strength;
  const distancePct = opts.distance == null ? 100 : opts.distance;

  const direction = normalizePushDirection(opts.direction, id);
  id = remapDirectionalId(id, direction, opts.direction);

  const implemented = IMPLEMENTED_IDS.indexOf(id) !== -1;
  const group = normalizeTimingGroup(opts.group || opts.duration || defaultGroupForId(id));
  const frames = opts.durationFrames != null ? Math.round(clamp(opts.durationFrames, 2, 240)) : durationFrames(group, fps);
  const overshoot = opts.overshoot == null ? defaultOvershootForId(id) : opts.overshoot;
  const outgoingName = layerName(opts.outgoing, "Outgoing");
  const incomingName = layerName(opts.incoming, "Incoming");
  const outgoingRest = layerRest(opts.outgoing);
  const incomingRest = layerRest(opts.incoming);
  const phases = uiPush.phaseFrames(frames, familyPhaseProfile(id));
  const control = planTransitionControl({
    durationFrames: frames,
    fps: fps,
    ease: ease,
    direction: direction,
    sliders: {
      Strength: strength,
      Distance: distancePct,
      Overshoot: overshoot,
      Stagger: staggerCascade.isStaggerCascadeId(id)
        ? Math.round(
            clamp(
              opts.offsetFrames != null
                ? opts.offsetFrames
                : opts.stagger != null
                  ? opts.stagger
                  : staggerCascade.offsetForId(id),
              0,
              120
            )
          )
        : 3
    }
  });

  const shared = {
    kind: "transition",
    id: id,
    name: familyDisplayName(id),
    category: familyCategory(id),
    style: STYLE,
    implemented: implemented,
    fps: fps,
    durationFrames: frames,
    durationSec: secondsFromFrames(frames, fps),
    group: group,
    direction: direction,
    ease: ease,
    easeInfluences: easeInfluences(ease),
    anatomy: anatomyWindow(phases, fps),
    phases: phases,
    control: { name: CONTROL_NAME, shy: true, sliders: control.sliders },
    undo: "Evotechly Transition · " + id,
    description: "",
    markers: sfxMarkers(fps, phases),
    target: null,
    layers: [],
    outgoing: uiPush.emptyLayer(outgoingName, "outgoing", outgoingRest),
    incoming: uiPush.emptyLayer(incomingName, "incoming", incomingRest),
    note: "Native AE keyframes. Node plan is source of truth. JSX mirrors UI Push, UI-Slide, Scale-Zoom, Shared-Element, Overlay-Modal, Page-Screen, Stagger-Cascade, and Mask-Reveal."
  };

  if (opts.target && opts.target.layerBounds) {
    shared.target = planTargetZoom({
      compW: comp.w,
      compH: comp.h,
      layerBounds: opts.target.layerBounds,
      padding: opts.target.padding
    });
  }

  if (!implemented) {
    shared.name = id;
    shared.description = id + " is catalogued. Plan generator lands in a later phase.";
    shared.layers = [shared.outgoing, shared.incoming];
    return shared;
  }

  const ctx = {
    fps: fps,
    phases: phases,
    direction: direction,
    distance: uiPush.travelDistance(direction, comp, distancePct, strength),
    overshoot: overshoot,
    outgoingName: outgoingName,
    incomingName: incomingName,
    outgoingRest: outgoingRest,
    incomingRest: incomingRest,
    id: id,
    strength: strength,
    comp: comp,
    target: opts.target,
    offsetFrames: staggerCascade.isStaggerCascadeId(id)
      ? Math.round(
          clamp(
            opts.offsetFrames != null
              ? opts.offsetFrames
              : opts.stagger != null
                ? opts.stagger
                : staggerCascade.offsetForId(id),
            0,
            120
          )
        )
      : undefined,
    staggerCount: opts.staggerCount || opts.itemCount,
    layers: opts.layers || opts.items
  };

  let built;
  if (maskReveal.isMaskRevealId(id)) built = maskReveal.plan(id, ctx);
  else if (staggerCascade.isStaggerCascadeId(id)) built = staggerCascade.plan(id, ctx);
  else if (pageScreen.isPageScreenId(id)) built = pageScreen.plan(id, ctx);
  else if (overlayModal.isOverlayModalId(id)) built = overlayModal.plan(id, ctx);
  else if (uiSlide.isUiSlideId(id)) built = uiSlide.plan(id, ctx);
  else if (scaleZoom.isScaleZoomId(id)) built = scaleZoom.plan(id, ctx);
  else if (sharedElement.isSharedElementId(id)) built = sharedElement.plan(id, ctx);
  else built = uiPush.plan(id, ctx);
  shared.outgoing = built.outgoing;
  shared.incoming = built.incoming;
  shared.travel = built.travel;
  if (built.target) shared.target = built.target;
  if (built.morph) shared.morph = built.morph;
  if (built.stagger) shared.stagger = built.stagger;
  if (built.mask) shared.mask = built.mask;
  shared.layers = [built.outgoing, built.incoming];
  shared.description =
    "Apply " +
    id +
    " · " +
    frames +
    "f @" +
    fps +
    "fps · " +
    ease +
    " · anticipate→action→crossover→settle";
  return shared;
}

function isImplemented(id) {
  return IMPLEMENTED_IDS.indexOf(normalizeId(id)) !== -1;
}

module.exports = {
  IMPLEMENTED_IDS,
  ANATOMY,
  STYLE,
  applyTransitionPlan,
  isImplemented,
  normalizeId,
  normalizePushDirection
};
