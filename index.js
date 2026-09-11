#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { generateMotion, runEngine, exportAE, exportPreview } = require("./api/motionAPI");

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1 || !process.argv[i + 1]) return fallback;
  return process.argv[i + 1];
}

function positionalInput() {
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].indexOf("--") === 0) {
      i += 1;
      continue;
    }
    return process.argv[i];
  }
  return path.join(__dirname, "examples", "saas-hero.json");
}

const inputPath = positionalInput();
const style = arg("--style", null);
const direction = arg("--direction", null);
const shot = arg("--shot", null);
const outDir = arg("--out", path.join(__dirname, "examples"));

const input = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (style) input.style = style;
if (direction) input.direction = direction;
if (shot) input.shot = shot;

const motion = generateMotion(input);
const again = runEngine(input);
const ae = exportAE(input);
const preview = exportPreview(input);

if (JSON.stringify(motion) !== JSON.stringify(again)) {
  throw new Error("generateMotion !== runEngine");
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "motion-output.json"), JSON.stringify(motion, null, 2) + "\n");
fs.writeFileSync(path.join(outDir, "ae-output.json"), JSON.stringify(ae, null, 2) + "\n");
fs.writeFileSync(path.join(outDir, "preview.html"), preview);

const summary = motion.layers
  .map(function (l) {
    return l.layer + ":" + l.preset + "@" + l.delay;
  })
  .join(" ");
process.stdout.write(summary + "\n");
process.stdout.write("style=" + motion.style + " direction=" + motion.direction + " shot=" + motion.shot + " duration=" + motion.duration + "s\n");
process.stdout.write("wrote " + path.join(outDir, "motion-output.json") + "\n");
process.stdout.write("wrote " + path.join(outDir, "ae-output.json") + "\n");
process.stdout.write("wrote " + path.join(outDir, "preview.html") + "\n");
