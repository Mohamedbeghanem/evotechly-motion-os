"use strict";

const easing = require("./easing");
const timing = require("./timing");
const target = require("./target");
const control = require("./control");
const uiPush = require("./uiPush");
const uiSlide = require("./uiSlide");
const engine = require("./engine");
const registry = require("./registry");

module.exports = Object.assign({}, easing, timing, target, control, uiPush, engine, registry, {
  uiSlide: uiSlide,
  UI_SLIDE_IDS: uiSlide.UI_SLIDE_IDS,
  isUiSlideId: uiSlide.isUiSlideId
});
