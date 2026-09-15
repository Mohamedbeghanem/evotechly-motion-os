# Asset audit — P0 (no fake KEEP)

Researched **2026-09-15**. Verdicts apply to **sources and capabilities**, not to files on disk (except Lucide SVGs and Evotechly-owned Transition Kit IDs).

`KEEP` on a third-party row means “keep as a documented companion or vendored MIT/ISC file,” **never** “we downloaded their AE pack.”

## Rubric (/100)

| Criterion | Points | What we score |
|---|---|---|
| License clarity | 20 | Official EULA readable without a purchase? Conflicts? |
| Evotechly commercial fit | 25 | Can we use it in client / product work **today**? |
| Redistribution in our zip | 15 | May raw files ship as Evotechly pack contents? |
| Taste (premium SaaS) | 15 | Linear / Stripe / Apple — not glitch / RGB / explode |
| Native rebuild feasibility | 10 | Can we own the job in `core/` + JSX? |
| Official source (not a reupload) | 10 | Vendor domain? |
| Vendor / maintenance risk | 5 | Freemium traps, eval limits, account TOS |

**Bands:** 80–100 strong · 60–79 usable with constraints · 40–59 companion or rebuild · <40 reject or block.

## Verdicts

| Verdict | Meaning |
|---|---|
| **KEEP** | Use (native, or vendored permissive icons, or editor companion with clear commercial + no git copy) |
| **REJECT** | Do not use for Evotechly (legal or taste) |
| **REBUILD** | Capability wanted; implement native (often already done) |
| **REQUIRES LICENSE REVIEW** | Official pages conflict or EULA is only in checkout |

A row can be **REBUILD** + **KEEP companion**.

---

## Pre-seeded rows

### Evotechly Transition Kit (ours)

| Field | Value |
|---|---|
| Verdict | **KEEP** |
| Score | **96** (20+25+15+15+10+10+1) — vendor risk n/a, tiny “we must not drift JSX” residual |
| Downloaded? | N/A — already in repo (`core/transitions`, catalog, `ae/Evotechly Transitions.jsx`) |
| Notes | `sourceType: native`. Full UI Push family implemented (Phase 2). Other families catalog-only. |

### Lucide curated SVGs

| Field | Value |
|---|---|
| Verdict | **KEEP** |
| Score | **92** (18+25+15+14+8+10+2) — license is ISC + Feather MIT (not “MIT-only”); rebuild still needed for AE shapes |
| Downloaded? | **Yes** — official GitHub raw, LICENSE copied, see `ThirdParty/lucide/` |
| Notes | Only third-party binaries/text we claim to have fetched in P0. |

### Phosphor / Heroicons

| Field | Value |
|---|---|
| Verdict | **REBUILD** (KEEP as MIT source list) |
| Score | **88** |
| Downloaded? | **No** (not vendored; Lucide covers P0) |
| Notes | Safe to vendor later with LICENSE. Do not scrape icon marketplaces. |

### AEJuice free / Starter / Pack Manager

| Field | Value |
|---|---|
| Verdict | **REQUIRES LICENSE REVIEW** |
| Score | **44** (8+8+0+10+8+10+0) |
| Downloaded? | **No** |
| Notes | EULA **Free Evaluation = no commercial**. Product pages say commercial Starter. Redistribution forbidden. Taste mix (VHS / urban transitions) is off-brand. **Do not KEEP as if packs were in the repo.** Companion URL only after legal reads the in-app license. |

### Mixkit (Free License SFX / video)

| Field | Value |
|---|---|
| Verdict | **KEEP** as editor-local SFX · **REJECT** as zip stock |
| Score | **74** (18+22+0+14+10+10+0) |
| Downloaded? | **No** |
| Notes | Commercial finished works OK. Check Restricted vs Free. No raw redistribute. |

### ProductionCrate free plugins / assets

| Field | Value |
|---|---|
| Verdict | **REQUIRES LICENSE REVIEW** (corporate TOS) · companion **KEEP** for solo editors |
| Score | **58** (16+10+0+12+10+10+0) |
| Downloaded? | **No** |
| Notes | Finished-media commercial OK for individuals. Jan 2026 TOS: Free/Personal/Pro **not** for corporate/employer work. No raw redistribute. |

### BentoMotion Liquid Glass

| Field | Value |
|---|---|
| Verdict | **REJECT** for Evotechly commercial (free SKU) |
| Score | **31** (16+0+0+10+5+10+0) |
| Downloaded? | **No** |
| Notes | Personal free / commercial paid. **BLOCKED_FOR_COMMERCIAL.** Native frost = **REBUILD** (already shipped). |

### Tools for Motion Liquid Glass

| Field | Value |
|---|---|
| Verdict | **KEEP** companion (editor install) · **REJECT** vendor |
| Score | **70** (18+22+0+14+6+10+0) |
| Downloaded? | **No** |
| Notes | Free commercial; no redistribute/repackage. Taste fits. Not in git. |

### What? Studio UI Animator Pro

| Field | Value |
|---|---|
| Verdict | **REBUILD** (done: UI presets) · companion **KEEP** extras · **REJECT** jsxbin in zip |
| Score | **68** (10+15+0+15+10+10+8) |
| Downloaded? | **No** |
| Notes | $0 Gumroad. Confirm commercial on accept. |

### What? Studio PinRig

| Field | Value |
|---|---|
| Verdict | **REBUILD** (lockup) · companion optional · **REJECT** vendor |
| Score | **62** |
| Downloaded? | **No** |
| Notes | $0; some indexes say demo. Confirm SKU. |

### PaulPack

| Field | Value |
|---|---|
| Verdict | **REQUIRES LICENSE REVIEW** · **REBUILD** ornaments |
| Score | **52** |
| Downloaded? | **No** |
| Notes | $0+. No EULA fetched. |

### Plugin Everything Repeater

| Field | Value |
|---|---|
| Verdict | **KEEP** companion · **REJECT** `.aex` in repo · native Repeater first |
| Score | **66** |
| Downloaded? | **No** |
| Notes | Public page says free; installer EULA unread. |

### Meow Captions

| Field | Value |
|---|---|
| Verdict | **REBUILD** (done: Caption Style Tools) · companion optional · **REJECT** CEP zip in git |
| Score | **64** |
| Downloaded? | **No** |
| Notes | itch free; commercial clause not on the listing. No ElevenLabs in Motion OS. |

### Presetify / Vignette Typer Lite

| Field | Value |
|---|---|
| Verdict | **REBUILD** (in/out + Typewriter) · **REQUIRES LICENSE REVIEW** for companion |
| Score | **55** |
| Downloaded? | **No** |
| Notes | $0+ Gumroad. |

### Mister Horse Animation Composer (free)

| Field | Value |
|---|---|
| Verdict | **KEEP** companion · **REJECT** preset dump |
| Score | **72** (16+20+0+12+8+10+6) |
| Downloaded? | **No** |
| Notes | FAQ allows commercial finished video on free plugin. No Package redistribute. Taste varies — stay off talking-head. |

### Motion Bro free starter

| Field | Value |
|---|---|
| Verdict | **REJECT** for Evotechly commercial on **personal** SKU · **REQUIRES LICENSE REVIEW** of commercial pack terms |
| Score | **38** (14+4+0+8+6+10+0) |
| Downloaded? | **No** |
| Notes | Freemium. Help: personal ≠ paid client work. Do not vendor. |

### LottieFiles free/public

| Field | Value |
|---|---|
| Verdict | **REQUIRES LICENSE REVIEW** per file · **REBUILD** preferred |
| Score | **50** |
| Downloaded? | **No** |
| Notes | Simple License ≠ every file. Free-plan **created** animations are non-commercial per Terms. No competing compilation. |

### Pixabay / Freesound SFX

| Field | Value |
|---|---|
| Verdict | **KEEP** editor-local (Pixabay Content License / Freesound CC0 or CC-BY) · **REJECT** NC · **REJECT** stock dump in zip |
| Score | **76** (Pixabay/CC0) / **0** (CC-BY-NC) |
| Downloaded? | **No** |
| Notes | Per-file license. |

---

## Scoring snapshot

| ID | Verdict | Score | On disk in P0? |
|---|---|---|---|
| Transition Kit native | KEEP | 96 | Yes (Motion OS) |
| Lucide curated | KEEP | 92 | Yes (`ThirdParty/lucide`) |
| Phosphor / Heroicons | REBUILD | 88 | No |
| Mixkit Free SFX | KEEP local / REJECT zip | 74 | No |
| Pixabay / Freesound CC0 | KEEP local | 76 | No |
| Mister Horse AC free | KEEP companion | 72 | No |
| TFM Liquid Glass | KEEP companion | 70 | No |
| UI Animator Pro | REBUILD + companion | 68 | No |
| Repeater | KEEP companion | 66 | No |
| Meow Captions | REBUILD + companion | 64 | No |
| PinRig | REBUILD + companion | 62 | No |
| ProductionCrate | REQUIRES LICENSE REVIEW | 58 | No |
| Presetify / Vignette | REBUILD + REVIEW | 55 | No |
| PaulPack | REQUIRES LICENSE REVIEW | 52 | No |
| LottieFiles | REQUIRES LICENSE REVIEW | 50 | No |
| AEJuice free/eval | REQUIRES LICENSE REVIEW | 44 | No |
| Motion Bro personal | REJECT commercial | 38 | No |
| BentoMotion free glass | REJECT commercial | 31 | No |

## Taste rejects (any source)

Glitch, RGB split, lens flare, explosion, 360 spin, bounce-loop, comic wipe, military HUD. Score **0** on taste → **REJECT** even if the license is free.
