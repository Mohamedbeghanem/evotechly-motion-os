"use strict";

/**
 * Native polish vocabulary used by the AE panel.
 * Numbers only — no vendor code. JSX applies these in After Effects.
 */
const EASE = {
  apple: { influenceIn: 80, influenceOut: 18 },
  soft: { influenceIn: 40, influenceOut: 40 }
};

const TEXT_IN = { duration: 0.42, travel: 8 };
const TYPEWRITER = { charsPerSecond: 18 };
const SQUASH = { dip: 0.06, recover: 0.16, scaleX: 0.88, scaleY: 1.06 };
const RIPPLE = { duration: 0.4 };
const SPRING = { freq: 8, damp: 0.7 };
const PLUGINS_REMINDER = [
  "Saber",
  "QCA3",
  "Displacer Pro",
  "FX Console",
  "Animation Composer (free)"
];

function easePair(kind) {
  return EASE[kind] || EASE.apple;
}

module.exports = {
  EASE,
  TEXT_IN,
  TYPEWRITER,
  SQUASH,
  RIPPLE,
  SPRING,
  PLUGINS_REMINDER,
  easePair
};
