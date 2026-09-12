# Editor playbook (one page) — v0.7 Editor Kit

One kit. Install Motion OS only. Art from Figma. Motion from Evotechly.

## Install

Quit AE. Copy `ae/Evotechly Motion OS.jsx` into **Scripts/ScriptUI Panels**. Window → Evotechly Motion OS (header **v0.7 Editor Kit**). Caption JSON + sample SRT live in `assets/` and `examples/captions/`.

## Tabs

| Tab | Use |
|---|---|
| Motion | Style / Direction / Shot / Scan / Apply / Fit footage |
| Polish | Apple Ease, Soft Ease, Spring, Text In, Typewriter, Cursor, squash, ripple, Wet look |
| Person | Cutout Prep, Keylight recipe, Light wrap, Talking-head stack |
| Captions | Templates, Import SRT, 9:16 safe, KPI count-up |
| Recipes | Founder GS / Roto, ERP demo, 15s hook reminders, Feature card |

## Names

`Title` `Subtitle` `Card 1` `Card 2` `CTA` `Screenshot` `Cursor` `Caption` `Logo` `Wordmark`

Never keyed: cameras, lights, locked layers, names with `EVO_SKIP`.

## Cutout vs Keylight

- **Keylight** — green/blue studio plate. Person tab → Keylight recipe (Keylight 1.2 + optional Advanced Spill Suppressor). Screen Matte: clip black ~0–15, clip white ~85–100.
- **Cutout** — no clean key. Person tab → Cutout Prep names `CUTOUT`. You paint Roto Brush 3, Refine, Freeze, pre-render ProRes 4444+Alpha. The panel does not paint strokes.

Talking-head stack (top → bottom): CUTOUT|keyed → Captions → Product UI / L3 → BG. Wet / Saber / QCA **off**.

## Captions (AR + EN)

Live AE text only. Do not bake PNG.

- Hook, kinetic, two-line AR+EN (toggle AR-top / EN-top), lower-third, burn-in.
- Import SRT is basic SubRip (index + timecode + text). No ASS.
- Set Paragraph direction in AE for Arabic. Fonts: Noto Naskh Arabic / Cairo / IBM Plex Sans Arabic if the machine has them. No font files in the repo.

After placing captions: Shot = Captions, Style = Evotechly or Calm, Scan, Apply.

## Polish

Native AE only. Wet look = Glow + Noise adj layer, hooks and logo sting only.

## Optional plugins (official sites, never in this zip)

Saber — videocopilot.net/products/saber  
QCA3 — aescripts.com/quick-chromatic-aberration  
Displacer Pro — aescripts.com/displacer-pro  
FX Console — aescripts.com/fx-console  
Animation Composer — mrhorse.com/animation-composer  

Hooks only. Off talking-head. Product UI stays Apple-clean.

## Loop

1. Style + Shot + Direction. Default style is Stripe.
2. Scan. Apply. Undo is one step.
3. Fit footage = cover crop, 9:16-safe.
4. Captions / Person / Polish as needed.
