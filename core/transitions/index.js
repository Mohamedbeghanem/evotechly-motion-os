"use strict";

const easing = require("./easing");
const timing = require("./timing");
const target = require("./target");
const control = require("./control");
const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");
const scaleZoom = require("./scaleZoom");
const sharedElement = require("./sharedElement");
const engine = require("./engine");
const registry = require("./registry");

module.exports = Object.assign({}, easing, timing, target, control, uiPush, engine, registry, {
  uiSlide: uiSlide,
  scaleZoom: scaleZoom,
  sharedElement: sharedElement,
  UI_SLIDE_IDS: uiSlide.UI_SLIDE_IDS,
  SCALE_ZOOM_IDS: scaleZoom.SCALE_ZOOM_IDS,
  SHARED_ELEMENT_IDS: sharedElement.SHARED_ELEMENT_IDS,
  isUiSlideId: uiSlide.isUiSlideId,
  isScaleZoomId: scaleZoom.isScaleZoomId,
  isSharedElementId: sharedElement.isSharedElementId
});
