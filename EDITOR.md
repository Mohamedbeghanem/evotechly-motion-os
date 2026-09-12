# Editor playbook (one page) — v0.8

One kit. Install Motion OS only. Art from Figma. Motion from Evotechly.

## Install

Quit AE. Copy `ae/Evotechly Motion OS.jsx` into **Scripts/ScriptUI Panels**. Window → Evotechly Motion OS (header **v0.8**). Caption JSON + sample SRT live in `assets/` and `examples/captions/`.

## Tabs

| Tab | Use |
|---|---|
| Motion | Style / Direction / Shot / Scan / Apply / Fit footage (named roles) |
| Animate | Selected layers, no names. In/Out/Both, 8-way + Scale, Apple/Soft/Expo/Spring, sequence |
| Polish | Apple Ease, Soft Ease, Spring, Text In, Typewriter, Cursor, squash, ripple, Wet look |
| Person | Cutout Prep, Keylight recipe, Light wrap, Talking-head stack |
| Captions | Templates, Import SRT, 9:16 safe, KPI count-up |
| Recipes | Founder GS / Roto, ERP demo, 15s hook reminders, Feature card |
| Assets | Local templates + SRT sample paths. No CDN |

## Animate vs Scan → Apply

- **Scan → Apply** — named SaaS/reel roles, style packs, shots, CTA-after-group.
- **Animate** — any selected layers. Keyframe mode only (v0.8). Expression In/Out is v0.9.
- They coexist. Animate does not rewrite the compiler plan.

## Names

`Title` `Subtitle` `Card 1` `Card 2` `CTA` `Screenshot` `Cursor` `Caption` `Logo` `Wordmark`

Never keyed: cameras, lights, locked layers, names with `EVO_SKIP`.

## Cutout vs Keylight

- **Keylight** — green/blue studio plate. Person tab → Keylight recipe.
- **Cutout** — Person tab → Cutout Prep names `CUTOUT`. Paint Roto Brush 3 yourself.

Talking-head stack: CUTOUT|keyed → Captions → Product UI / L3 → BG. Wet / Saber / QCA **off**.

## Captions (AR + EN)

Live AE text only. Assets tab applies the same templates. Import SRT is basic SubRip.

## Companions (official sites, never in this zip)

TFM Liquid Glass + Comp Exporter — aescripts.com/tools-for-motion  
Saber — videocopilot.net/products/saber  
QCA3 — aescripts.com/quick-chromatic-aberration  
Displacer Pro — aescripts.com/displacer-pro  
Animation Composer — mrhorse.com/animation-composer
