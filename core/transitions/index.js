"use strict";

const easing = require("./easing");
const timing = require("./timing");
const target = require("./target");
const control = require("./control");
const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");
const scaleZoom = require("./scaleZoom");
const sharedElement = require("./sharedElement");
const overlayModal = require("./overlayModal");
const pageScreen = require("./pageScreen");
const staggerCascade = require("./staggerCascade");
const maskReveal = require("./maskReveal");
const engine = require("./engine");
const registry = require("./registry");

module.exports = Object.assign({}, easing, timing, target, control, uiPush, engine, registry, {
  uiSlide: uiSlide,
  scaleZoom: scaleZoom,
  sharedElement: sharedElement,
  overlayModal: overlayModal,
  pageScreen: pageScreen,
  staggerCascade: staggerCascade,
  maskReveal: maskReveal,
  UI_SLIDE_IDS: uiSlide.UI_SLIDE_IDS,
  SCALE_ZOOM_IDS: scaleZoom.SCALE_ZOOM_IDS,
  SHARED_ELEMENT_IDS: sharedElement.SHARED_ELEMENT_IDS,
  OVERLAY_MODAL_IDS: overlayModal.OVERLAY_MODAL_IDS,
  PAGE_SCREEN_IDS: pageScreen.PAGE_SCREEN_IDS,
  STAGGER_CASCADE_IDS: staggerCascade.STAGGER_CASCADE_IDS,
  MASK_REVEAL_IDS: maskReveal.MASK_REVEAL_IDS,
  isUiSlideId: uiSlide.isUiSlideId,
  isScaleZoomId: scaleZoom.isScaleZoomId,
  isSharedElementId: sharedElement.isSharedElementId,
  isOverlayModalId: overlayModal.isOverlayModalId,
  isPageScreenId: pageScreen.isPageScreenId,
  isStaggerCascadeId: staggerCascade.isStaggerCascadeId,
  isMaskRevealId: maskReveal.isMaskRevealId
});
