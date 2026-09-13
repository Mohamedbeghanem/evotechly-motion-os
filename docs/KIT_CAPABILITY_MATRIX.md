# Kit capability matrix — research before one-tool wrap

**Date:** 2026-09-13  
**Goal:** Extract capabilities from free kits already identified → classify **own / companion / skip** → wrap into **one** Evotechly Motion OS tool on top of v0.32 + SaaS Demo + Seed.  
**Hard rule:** never vendor third-party JSX / .aex / .mbr / packs into the repo. Reimplement native, or deep-link companion install URLs.

## Already owned (do not rebuild from scratch)

| Capability | Where |
|---|---|
| Figma→roles, Style / Direction / Shot, Scan→Apply | Main panel v0.32 |
| Polish ease, Person cutout/Keylight, Captions AR+EN, Recipes | Main panel |
| Cursor + click (shape pointer), depth, stagger, carousel | SaaS Demo Tools / `core/saasDemo.js` |
| Glass, gradient wipe, proximity hover | `core/saasDemoFx.js` |
| Golden comps seed | `Seed Golden Project.jsx` |
| Asset register (P15) | Assets tab |
| Editor path + free-kit list | `QUICK_START`, `EDITOR_FREE_KIT`, `SAAS_DEMO_KIT` |

## Kit → capability extract

| Kit | Price | Capabilities extracted | Classification | Motion OS wrap action |
|---|---|---|---|---|
| **Solair SaaS Kit** | Paid ~$49 | Figma ship, depth reveal, 3D cursor+click, stagger, carousel, flowing/coloured text, glass, gradient wipe, proximity, AI script, studio playbook | **Own** (feature map only) | Phases 1–2 done; still open: flowing/coloured text explode, richer Figma ship, playbook docs. Never copy Solair. |
| **UI Animator Pro** (What? Studio) | $0 | UI presets in/out/both; custom presets (relative % / absolute); automation mode; mirror layout; auto ease + motion blur; duration live update; layer reorder; reset | **Own gap + companion** | Own: preset library + mirror automation (Phase 4). Companion: deep-link Gumroad until reimplemented. |
| **PinRig** | $0 | Logo/type pins, construction guides, typography metrics, anim presets | **Companion** | Kit Hub link. Low priority to reimplement. |
| **AEJuice Pack Manager + free Starter** | Free | 100+ drag assets: liquid/shape, transitions, slides, 2D/3D/text presets, flat icons, Motion Cafe UI/HUD; also free Auto Captions packs | **Companion (assets)** | Kit Hub install URL. Do **not** ship packs. Optional: Evotechly-owned HUD shapes later. |
| **Motion Bro** (free tier) | Free core + ~1400 starter presets | In-panel transitions, graphics, SFX; autofit resolution; paid packs separate | **Companion (assets)** | Kit Hub link. Liquid Glass packs often via Motion Bro — personal license only. |
| **Animation Composer** (Mister Horse) | Free base | Presets, transitions, text/shape, Keyframe Wingman easing, Keyframe Actions | **Companion** | Kit Hub link. Overlaps Polish ease — keep Polish as own. |
| **Crate’s Light Wrap** | Free, commercial OK | FG/BG light wrap for cutouts | **Companion** | Kit Hub + Person recipe tip. |
| **Meow Captions** | Free | SRT import, keyword color, 10 IN/OUT presets, subtitle box, STT via ElevenLabs | **Own gap + companion** | Captions tab owns AR+EN. Gap: keyword color + IN/OUT pack. Companion until then. |
| **Presetify** | $0+ | 7 one-click text presets | **Own gap + companion** | Map into Polish / Captions preset row. |
| **Vignette Typer Lite** | $0+ | Char/word/line anim; 10 presets; pos/opac/scale/tracking/blur | **Own gap + companion** | Extend Captions/Polish Kinetic/Typewriter. |
| **Repeater** (Plugin Everything) | $0 | Native .aex: repeat any live layer, mirror, time offset | **Companion** | Kit Hub only — hard to reimplement in JSX. |
| **PaulPack v1** | $0+ | 14 loopable shape UI elements | **Companion / own shapes later** | Prefer Evotechly shape recipes. |
| **Liquid Glass UI Kit** | $0 personal / paid commercial | Glass UI animations; often needs Motion Bro | **Companion** | Own glass is native frost (Phase 2). True refraction stays companion. |
| **CursorKit** | PWYW | Cursor types, click/drag, typewriter | **Skip / reference** | Own shape cursor; add hand/I-beam as own shapes. |

## Capability backlog for ONE tool

### P0 — unify shell
1. Fold SaaS Demo Tools into main panel as **SaaS** tab.
2. **Kit Hub** section: companion URLs only.
3. Seed on Home.

### P1 — reimplement high-ROI gaps
1. UI preset pack (UI Animator–class in/out/both + mirror).
2. Flowing / coloured text reveal.
3. Caption keyword color + IN/OUT row.
4. Cursor styles (arrow / hand / I-beam).

### P2 — companion forever
AEJuice, Motion Bro, Repeater, Animation Composer, PinRig, Liquid Glass refraction, external STT.

### P3 — skip for now
Solair AI script, Overlord Figma clone, Auto-Animate until soak passes.

## One-tool IA
Home | Motion | SaaS | Polish | Person | Captions | Recipes | Assets | Kit Hub

## Legal
Research ≠ copy. Companions never in release zip. Build on v0.32.0-rc.

## Next
Research complete → P0 unify shell → P1 PRs → soak #11 before v2.
