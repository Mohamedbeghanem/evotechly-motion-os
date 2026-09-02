"use strict";

const fs = require("fs");
const path = require("path");
const { generateMotion, runEngine, exportAE } = require("./api/motionAPI");

const input = JSON.parse(
  fs.readFileSync(path.join(__dirname, "examples", "figma-input.json"), "utf8")
);

const motion = generateMotion(input);
const again = runEngine(input);
const ae = exportAE(input);

if (JSON.stringify(motion) !== JSON.stringify(again)) {
  throw new Error("generateMotion !== runEngine");
}

fs.writeFileSync(
  path.join(__dirname, "examples", "motion-output.json"),
  JSON.stringify(motion, null, 2) + "\n"
);
fs.writeFileSync(
  path.join(__dirname, "examples", "ae-output.json"),
  JSON.stringify(ae, null, 2) + "\n"
);

const summary = motion.layers
  .map(function (l) { return l.layer + ":" + l.preset + "@" + l.delay; })
  .join(" ");
process.stdout.write(summary + "\n");
