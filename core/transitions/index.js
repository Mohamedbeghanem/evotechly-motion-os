"use strict";

const easing = require("./easing");
const timing = require("./timing");
const target = require("./target");
const control = require("./control");
const engine = require("./engine");
const registry = require("./registry");

module.exports = Object.assign({}, easing, timing, target, control, engine, registry);
