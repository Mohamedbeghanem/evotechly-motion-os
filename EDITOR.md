# Editor playbook (one page) — v0.4

Art from Figma. Motion from Evotechly. Do not hand-key SaaS intros.

## Two tools

1. **Overlord or AEUX** — push the frame so AE has real text and shapes.
2. **Evotechly Motion OS** — Window → Evotechly Motion OS.

No Overlord? Panel → **Import JSON** from the Figma plugin. Replace solids later with same names.

## Names

`Title` `Subtitle` `Card 1` `Card 2` `CTA` `Screenshot` `Cursor`

Also: PricingCard, PrimaryButton, HeroTitle, AppScreenshot.

Never keyed: cameras, lights, locked layers, names with `EVO_SKIP`.
UNNAMED row → This layer is a → Rename.

## Loop

1. Load brand (`examples/evotechly.brand.json`) if you have one.
2. Style + Shot.
3. Scan. READY rows get motion.
4. Apply. Undo is one step. CTA hover/press is on by default.
5. Select a recording → Fit footage (needs Screenshot).
6. Make 9:16 or Queue renders.
7. Save plan next to the `.aep`.

## Shots

Hero · Feature row · Pricing · Dashboard tour · Logo lockup

Cursor flies to CTA when both exist.

## Install

Copy `Evotechly Motion OS.jsx` into **Scripts/ScriptUI Panels** (not Scripts). Restart AE. First run: **Demo comp → Apply**.
