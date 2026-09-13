# Kit capability matrix — research before one-tool wrap

**Date:** 2026-09-13  
**Product:** Evotechly Motion OS **Ultimate 2.0.0** — **P0 + P1 (P1a–P1d) shipped on 2.0.0.**  
**Goal:** Extract capabilities from free kits already identified → classify **own / companion / skip** → wrap into **one** Evotechly Motion OS tool on top of v0.32 + SaaS Demo + Seed.  
**Hard rule:** never vendor third-party JSX / .aex / .mbr / packs into the repo. Reimplement native, or deep-link companion install URLs.

## Already owned (do not rebuild from scratch)

| Capability | Where |
|---|---|
| Figma→roles, Style / Direction / Shot, Scan→Apply | Main panel v0.32 |
| Polish ease, Person cutout/Keylight, Captions AR+EN, Recipes | Main panel |
| Cursor + click (shape pointer / hand / I-beam — P1d), depth, stagger, carousel | SaaS Demo Tools / `core/saasDemo.js` |
| **P1a UI presets (in / out / both + mirror)** | **own** — `applyUiPreset` / SaaS **Apply UI Preset** |
| Glass, gradient wipe, proximity hover | `core/saasDemoFx.js` |
| Home / SaaS / Kit Hub shell (P0) | **Window → Motion OS Hub** (`ae/SaaS Demo Tools.jsx`) |
| Flowing / coloured text reveal (P1b) | Hub SaaS panel / `core/textReveal.js` |
| Caption keyword color + in/out presets (P1c) | Caption Style Tools / `core/captionStyle.js` (separate companion) |
| Golden comps seed | `Seed Golden Project.jsx` |
| Asset register (P15) | Assets tab |
| Editor path + free-kit list | `QUICK_START`, `EDITOR_FREE_KIT`, `SAAS_DEMO_KIT`, `CAPTION_STYLE` |

## Kit → capability extract

| Kit | Price | Capabilities extracted | Classification | Motion OS wrap action |
|---|---|---|---|---|
| **Solair SaaS Kit** | Paid ~$49 | Figma ship, depth reveal, 3D cursor+click, stagger, carousel, flowing/coloured text, glass, gradient wipe, proximity, AI script, studio playbook | **Own** (feature map only) | Phases 1–2 + **P1a UI presets** + **P1b flowing/coloured text** done; still open: richer Figma ship, playbook docs. Never copy Solair. |
| **UI Animator Pro** (What? Studio) | $0 | UI presets in/out/both; custom presets (relative % / absolute); automation mode; mirror layout; auto ease + motion blur; duration live update; layer reorder; reset | **P1a own + companion extras** | **Own:** `fade-up`, `fade-scale`, `slide-left`, `slide-right`, `slide-up`, `pop` (90→100) + mirror. Companion: Gumroad for extras we did not reimplement. |
| **PinRig** | $0 | Logo/type pins, construction guides, typography metrics, anim presets | **Companion** | Kit Hub link. Low priority to reimplement. |
| **AEJuice Pack Manager + free Starter** | Free | 100+ drag assets: liquid/shape, transitions, slides, 2D/3D/text presets, flat icons, Motion Cafe UI/HUD; also free Auto Captions packs | **Companion (assets)** | Kit Hub install URL. Do **not** ship packs. Optional: Evotechly-owned HUD shapes later. |
| **Motion Bro** (free tier) | Free core + ~1400 starter presets | In-panel transitions, graphics, SFX; autofit resolution; paid packs separate | **Companion (assets)** | Kit Hub link. Liquid Glass packs often via Motion Bro — personal license only. |
| **Animation Composer** (Mister Horse) | Free base | Presets, transitions, text/shape, Keyframe Wingman easing, Keyframe Actions | **Companion** | Kit Hub link. Overlaps Polish ease — keep Polish as own. |
| **Crate’s Light Wrap** | Free, commercial OK | FG/BG light wrap for cutouts | **Companion** | Kit Hub + Person recipe tip. |
| **Meow Captions** | Free | SRT import, keyword color, 10 IN/OUT presets, subtitle box, STT via ElevenLabs | **Own (P1c) + companion** | Captions tab owns AR+EN + SRT. **P1c shipped:** `colorKeywords` + `captionInOut` (`fade` / `scale` / `slideUp` / `typewriter` / `blur`) via **Window → Caption Style Tools**. No Meow code. No ElevenLabs STT. Companion remains optional. |
| **Presetify** | $0+ | 7 one-click text presets | **Own (P1c) + companion** | In/out preset row on Caption Style Tools. Polish Typewriter stays for char-on. Companion optional. |
| **Vignette Typer Lite** | $0+ | Char/word/line anim; 10 presets; pos/opac/scale/tracking/blur | **Own gap + companion** | Extend Captions/Polish Kinetic/Typewriter. |
| **Repeater** (Plugin Everything) | $0 | Native .aex: repeat any live layer, mirror, time offset | **Companion** | Kit Hub only — hard to reimplement in JSX. |
| **PaulPack v1** | $0+ | 14 loopable shape UI elements | **Companion / own shapes later** | Prefer Evotechly shape recipes. |
| **Liquid Glass UI Kit** | $0 personal / paid commercial | Glass UI animations; often needs Motion Bro | **Companion** | Own glass is native frost (Phase 2). True refraction stays companion. |
| **CursorKit** | PWYW | Cursor types, click/drag, typewriter | **Skip / reference** | Own shape cursor. **P1d shipped:** pointer / hand / I-beam as native path data. No CursorKit code. |

## Capability backlog for ONE tool

### P0 — unify shell — **shipped on 2.0.0** (companion hub)

Main-panel Home / SaaS / Kit Hub tabs were **deferred**. Do not rewrite or stub the 297 KB v0.32 panel.

1. **Window → SaaS Demo Tools / Motion OS Hub** — `ae/SaaS Demo Tools.jsx` (palette title **Motion OS Hub**).
2. **Home** — Seed Golden Project (reuses `ae/Seed Golden Project.jsx`).
3. **SaaS** — existing engines: cursor (P1d Style dropdown: pointer / hand / I-beam), depth, stagger, **UI presets**, carousel, glass, wipe, hover, flowing text, coloured reveal.
4. **Kit Hub** — companion names + official URLs only (`core/kitHub.js`). Copy / alert. Never download or vendor binaries.

Target one-tool IA (later, after soak) still wants those sections inside v0.32. P0 ships the companion hub instead.

### P1 — reimplement high-ROI gaps — **shipped on 2.0.0**
1. **P1a own — shipped on 2.0.0** — UI preset pack (UI Animator–class in/out/both + mirror). `core/uiPresets.js` + Hub **Apply UI Preset**.
2. Flowing / coloured text reveal. **P1b — shipped on 2.0.0** (`core/textReveal.js` + Hub SaaS buttons).
3. Caption keyword color + IN/OUT row. **P1c — shipped on 2.0.0.** `core/captionStyle.js` + `ae/Caption Style Tools.jsx`. Apply after Captions tab (templates / SRT). Separate companion — not a Hub tab. Does not edit the 297 KB panel.
4. **P1d Cursor styles** (pointer / hand / I-beam) — **shipped on 2.0.0.** `createCursor({ style })` + SaaS Demo Tools Style dropdown. Native path descriptors. Default remains pointer. No PNG. No CursorKit.

### P2 — companion forever
AEJuice, Motion Bro, Repeater, Animation Composer, PinRig, Liquid Glass refraction, external STT.

### P3 — skip for now
Solair AI script, Overlord Figma clone, Auto-Animate until soak passes.

## One-tool IA

**P0 shipped on 2.0.0:** v0.32 tabs unchanged + **Window → Motion OS Hub / SaaS Demo Tools** (Home | SaaS | Kit Hub).

**P1a shipped on 2.0.0:** Hub **Apply UI Preset** (`core/uiPresets.js`).

**P1b shipped on 2.0.0:** Hub SaaS **Flowing Text** / **Coloured Reveal** (`core/textReveal.js`).

**P1c shipped on 2.0.0:** **Window → Caption Style Tools** — separate companion (keyword color + in/out). Not a Hub tab. Do not fold into the 297 KB panel.

**P1d shipped on 2.0.0:** Hub SaaS **Style** dropdown — pointer / hand / I-beam.

**Later (do not stub v0.32 to get here):** Home | Motion | SaaS | Polish | Person | Captions | Recipes | Assets | Kit Hub

## Legal
Research ≠ copy. Companions never in release zip. Shipped as **Ultimate 2.0.0** (v0.32 panel + Hub + Seed + Caption Style). Do not vendor third-party plugins.

## Next
**P0 + P1 shipped on 2.0.0.** P0 companion hub, **P1a** UI presets, **P1b** flowing / coloured text, **P1c** Caption Style Tools, **P1d** cursor styles. AE soak is still UNKNOWN — [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11) remains the tracker (confidence, not a 2.0.0 tag blocker). Do not fold the hub or Caption Style into the 297 KB panel.
