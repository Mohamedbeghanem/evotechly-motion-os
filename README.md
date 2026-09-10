# Evotechly Motion OS

Deterministic compiler for **SaaS-style motion**. Figma-like JSON in. Timed plan + After Effects JSON + browser preview out. Same input, same bytes. No random, no clock.

This is the engine you hand to an editor who already builds product videos in After Effects.

**Editors: start at [EDITOR.md](EDITOR.md).**

## What it is for

Stripe / Linear / Vercel-style product shots:

- Title fades up 16px
- Cards scale in on a 50–70ms stagger
- CTA waits until the group has landed
- Cursor comes in last

It is not AutoCut. It does not cut silences, caption speech, or reframe talking heads. It choreographs **named UI layers**.

## Architecture

```
design JSON (named layers)
        |
        v
   parser + normalizer
        |
        v
 role pack × style pack × stagger
        |
        +--> motion plan JSON
        +--> After Effects JSON
        +--> preview.html
        +--> Apply Evotechly Motion.jsx  (in AE, by layer name)
```

## Install

Node 18+. No runtime dependencies.

```bash
git clone https://github.com/Mohamedbeghanem/evotechly-motion-os.git
cd evotechly-motion-os
npm install
npm test
```

## Compile a shot

```bash
node index.js examples/saas-hero.json --style stripe
```

Writes `examples/motion-output.json`, `examples/ae-output.json`, `examples/preview.html`.

```bash
node index.js examples/figma-input.json --style linear --out /tmp/shot
```

## API

```js
const { generateMotion, runEngine, exportAE, exportPreview } = require("./api/motionAPI");

generateMotion(figmaJson);
generateMotion(figmaJson, { style: "vercel" });
exportAE(figmaJson);
exportPreview(figmaJson);
```

## Style packs

| id | Feel |
|---|---|
| `stripe` | Short travel, expo-out, tight card stagger (default) |
| `linear` | Quieter scale, slightly longer settles |
| `vercel` | Faster, snappier CTA |

## Layer contract

Name the Figma or AE layer so the role is obvious: `Title`, `Card 2`, `CTA`, `Screenshot`, `Cursor`. Full table in EDITOR.md.

## After Effects

`ae/Apply Evotechly Motion.jsx` reads `ae-output.json` and writes opacity / position / scale keys on matching layer names.

## Use cases

- Compile a Figma frame JSON into a timed SaaS motion plan
- Give an editor a preview + AE script instead of a reference MP4
- Let an AI planner emit this JSON and drop it into the compiler
- Lock intro timing in git so every product video stays on-brand

MIT (c) 2026 Evotechly / Mohamed Beghanem
