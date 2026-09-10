# Editor playbook — Evotechly Motion OS

Hand this file to the motion editor. You do not need to read the engine.

## What this is

A compiler for **SaaS product motion** (Stripe / Linear / Vercel style): short travel, soft ease-out, staggered cards, CTA last.

You still design and composite in After Effects. This tool only writes the **intro timing** so every cut of the same UI lands the same way.

It does **not** cut talking-head footage, captions, or podcasts.

## The deal

1. You name layers with the words below.
2. Someone compiles a JSON (or you run one command).
3. You run **Apply Evotechly Motion.jsx** on the active comp.
4. You keep directing: camera, grade, type, screenshots, music.

If a layer name does not match, that layer is skipped. Nothing else breaks.

## Layer names that trigger motion

| Name contains | Role | What you should see |
|---|---|---|
| `Eyebrow` / `Kicker` | eyebrow | Soft fade up first |
| `Title` / `Headline` | title | Main fade-up |
| `Subtitle` / `Subhead` | subtitle | Follows the title |
| `Nav` / `Navbar` | nav | Chrome in |
| `Sidebar` | sidebar | Slides in from the left |
| `Dashboard` | dashboard | App shell rises |
| `Screenshot` | screenshot | Slow zoom-out settle |
| `Card 1` `Card 2` `Card 3` | card | Scale-in, left-to-right stagger |
| `Metric` / `KPI` / `Stat` | metric | Numbers after cards |
| `Badge` | badge | Small pop |
| `Tooltip` | tooltip | Late hint |
| `Button` | button | Quiet scale-in |
| `CTA` | cta | Last clickable, after the group |
| `Cursor` | cursor | Moves in after the CTA |
| `Logo` | logo | First frame identity |

Numbers in the name are fine (`Card 2`, `Metric 1`). Matching is case-insensitive.

**Do not** name two layers the same thing. The script picks the first exact match.

## After Effects setup

Composition: **1920×1080** or **1440×900**, 30 fps is enough for product UI.

Build the frame as you already do (AEUX / Overlord / screenshots / rebuilt UI). Then rename layers to the table above.

Anchor points: center of each card / button. Position keys are offsets from the layer’s current position, so layout stays yours.

## Compile (once per shot)

On a machine with Node 18+:

```bash
cd evotechly-motion-os
node index.js examples/saas-hero.json --style stripe
```

That writes:

- `examples/preview.html` — open in a browser, hit Play
- `examples/ae-output.json` — what the AE script reads
- `examples/motion-output.json` — the plan (for version control)

Styles you can pass:

- `stripe` — default, premium SaaS
- `linear` — quieter, longer settles
- `vercel` — faster, snappier CTA

## Apply in After Effects

1. Open the comp.
2. **File → Scripts → Apply Evotechly Motion.jsx**
   First time: `File → Scripts → Install Script File…` and pick `ae/Apply Evotechly Motion.jsx`, then restart AE.
3. Choose `ae-output.json`.
4. Read the alert. Missing names are listed. Rename and run again.

The script overwrites Opacity, Position, and Scale keys on matched layers only.

## What you still do by hand

- Cursor click + hover states after the intro
- Screen recording inside the screenshot frame
- Type layout, colors, logo lockup
- Camera push on the dashboard
- Music and whooshes
- Export for Premiere / captions / social crop

This compiler owns the first 0.6–1.2 seconds of UI choreography. That is the part that usually drifts between editors.

## Shot recipe (SaaS hero)

Use `examples/saas-hero.json` as the board:

1. Eyebrow + Title + Subtitle
2. Screenshot settles
3. Three feature cards stagger
4. Metrics on the cards
5. CTA
6. Cursor arrives

If marketing changes copy, keep the layer names. Recompile only if the **set of layers** changed.

## Sending work back

Commit `motion-output.json` with the video. Same JSON = same timing next month. That is the point.
