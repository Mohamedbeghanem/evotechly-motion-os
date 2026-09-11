# Editor playbook (one page) — v0.6 SaaS 10 + Reel

Art from Figma. Motion from Evotechly. Do not hand-key SaaS intros.

## Two tools

1. **Overlord or AEUX** — push the frame so AE has real text and shapes.
2. **Evotechly Motion OS** — Window → Evotechly Motion OS.

No Overlord? Panel → **Import JSON** from the Figma plugin. Replace solids later with same names.

## Names

`Title` `Subtitle` `Card 1` `Card 2` `CTA` `Screenshot` `Cursor`

Also: PricingCard, PrimaryButton, HeroTitle, AppScreenshot.

UI: `Modal`, `Toast`, `Row`, `Stack`, `Nav`.

Reel: `Caption`, `Caption 2`, `Logo`, `Wordmark`.

Never keyed: cameras, lights, locked layers, names with `EVO_SKIP`.
UNNAMED row → This layer is a → Rename.

## Loop

1. Load brand (`examples/evotechly.brand.json`) if you have one — tokens change gap / travel / stagger, not just the label.
2. Style + Shot + Direction (In / Out / Both). Default style is Stripe so old demos match.
3. Scan. READY rows get motion.
4. Apply. Undo is one step. CTA hover/press is on by default.
5. Select a recording → **Fit footage** (Screenshot / selected; cover crop, 9:16-safe).
6. Make 9:16 or Queue renders. Shot timing does not assume 16:9.
7. Save plan next to the `.aep`.

## Styles

| Pack | Use when |
|---|---|
| Stripe | Default premium SaaS hero |
| Linear | Quieter product UI |
| Vercel | Sharp, short travel |
| Evotechly | Quiet product-native (travel 0.62, CTA settles) |
| Calm / system | Tiny travel, long hold, no pop |

Default remains **Stripe**.

## Shots

SaaS: Hero · Feature row · Pricing · Dashboard tour · Logo lockup · UI screen

Reel: Hook · Kinetic type · UI punch-in · Logo sting · Captions

Cursor flies to CTA when both exist.

Logo lockup / sting: `Logo` + `Title` or `Wordmark`. Apply drops `EVO_SKIP_LOCKUP_*` guides.

## Direction

- In — appear
- Out — dismiss
- Both — SaaS: in then out. Reel: in → hold → out (loop-friendly)

## Fit footage

Cover-scale the footage layer to the comp (max scale, center). Crops edges. Safe on 9:16 and 16:9. Does not letterbox.

## Install

Copy `Evotechly Motion OS.jsx` into **Scripts/ScriptUI Panels** (not Scripts). Restart AE. First run: **Demo comp → Apply**.
