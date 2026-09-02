# Evotechly Motion OS

Deterministic Figma to motion to After Effects compiler. One engine, same JSON, no random, no clock.

## Architecture

```
Figma JSON
    |
    v
figmaParser.parse / collectRawLayers
    |
    v
normalizer  (flatten, keep parentId, sort y then x)
    |
    v
typeMapper  (text / card / dashboard / image)
    |
    v
engine.run + resolver  (presets x behaviors x stagger = index * stagger)
    |
    +--> generateMotion / runEngine  ->  motion plan JSON
    +--> exportAE                    ->  After Effects JSON
```

## Install

Requires Node 18+. No runtime dependencies.
```bash
git clone https://github.com/Mohamedbeghanem/evotechly-motion-os.git
cd evotechly-motion-os
npm install
```

## Run

```bash
node index.js
npm start
npm test
```

`node index.js` compiles `examples/figma-input.json` and writes `examples/motion-output.json` and `examples/ae-output.json`.

## API

```javascript
const { generateMotion, runEngine, exportAE } = require("./api/motionAPI");

generateMotion(figmaJson); // motion plan
runEngine(figmaJson);      // alias of generateMotion
exportAE(figmaJson);       // After Effects JSON
```

## Figma to motion to AE

`examples/figma-input.json` (Title, two cards, CTA) compiles to:

- Title fadeUp @0
- Card 1 scaleIn @0.06
- Card 2 scaleIn @0.12
- CTA scaleIn @0.12

`exportAE` stamps `schema: evotechly.motion.ae.v1`, matching `name` + `layer`, two keyframes, and `easingAE`. Run it twice, same bytes.

## Use cases

- Compile a Figma frame JSON into a timed motion plan
- Drive a SaaS product video from the same layer list
- Let an AI planner emit this JSON and drop it into the compiler
- Apply the AE export in ScriptUI by layer name

MIT (c) 2026 Evotechly / Mohamed Beghanem
