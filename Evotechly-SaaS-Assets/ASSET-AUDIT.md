# Asset audit — P0 + P1 + P2b (no fake KEEP)

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

### EvotechlyNative P2b charts / device plates (ours)

| Field | Value |
|---|---|
| Verdict | **KEEP** |
| Score | **95** (20+25+15+15+10+10+0) |
| Downloaded? | N/A — generators in `core/assets/chartsDevices.js` |
| Notes | `sourceType: native`, `commercialUse: true`. 11 IDs: series enter, bar draw, column rise, line reveal, donut fill, KPI count, funnel in, spark, dash widget, laptop plate, phone plate. Apply: Evotechly Transitions → Charts. Reuses Scale-Zoom / Stagger-Cascade numbers. Not a vendor chart AEP. Not a 3D camera. |

P2b KEEP ID rows (all **OWNED**, implemented):

- Charts: `EVT_CHART_SERIES_ENTER`, `EVT_CHART_BAR_DRAW`, `EVT_CHART_COLUMN_RISE`, `EVT_CHART_LINE_REVEAL`, `EVT_CHART_DONUT_FILL`, `EVT_CHART_KPI_COUNT`, `EVT_CHART_FUNNEL_IN`, `EVT_CHART_SPARK`, `EVT_DASH_WIDGET_IN`
- Devices: `EVT_DEVICE_LAPTOP_IN`, `EVT_DEVICE_PHONE_IN`

### EvotechlyNative P1 text / UI / cursor (ours)

| Field | Value |
|---|---|
| Verdict | **KEEP** |
| Score | **95** (20+25+15+15+10+10+0) |
| Downloaded? | N/A — generators in `core/assets/` (`textAnimations.js`, `uiMicro.js`, `cursorPack.js`) |
| Notes | `sourceType: native`, `commercialUse: true`. IDs: 18 `EVT_TEXT_*`, 44 `EVT_UI_{ELEMENT}_{ACTION}`, 8 `EVT_CURSOR_*`. Apply: Evotechly Transitions tabs. Not a vendor preset dump. |

P1 KEEP ID rows (all **OWNED**, implemented):

- Text: `EVT_TEXT_FADE_UP`, `EVT_TEXT_FADE_DOWN`, `EVT_TEXT_MASK_REVEAL`, `EVT_TEXT_WORD_REVEAL`, `EVT_TEXT_LINE_REVEAL`, `EVT_TEXT_CHAR_REVEAL`, `EVT_TEXT_BLUR_IN`, `EVT_TEXT_BLUR_OUT`, `EVT_TEXT_SCALE_IN`, `EVT_TEXT_SLIDE_IN`, `EVT_TEXT_TRACKING_REVEAL`, `EVT_TEXT_HEADLINE_REVEAL`, `EVT_TEXT_SUBTITLE_REVEAL`, `EVT_TEXT_KINETIC_HEADLINE`, `EVT_TEXT_SWAP`, `EVT_TEXT_NUMBER_COUNTER`, `EVT_TEXT_PCT_COUNTER`, `EVT_TEXT_METRIC_COUNTER`
- UI: `EVT_UI_BUTTON_{ENTER,EXIT,HOVER,CLICK}`, `EVT_UI_CARD_{ENTER,EXIT,HOVER,CLICK,EXPAND,COLLAPSE}`, `EVT_UI_MODAL_{ENTER,EXIT,EXPAND,COLLAPSE}`, `EVT_UI_TOOLTIP_{ENTER,EXIT,HOVER}`, `EVT_UI_DROPDOWN_{ENTER,EXIT,EXPAND,COLLAPSE}`, `EVT_UI_SIDEBAR_{ENTER,EXIT,EXPAND,COLLAPSE}`, `EVT_UI_NAV_{ENTER,EXIT,HOVER}`, `EVT_UI_TABS_{ENTER,CLICK}`, `EVT_UI_ROW_{ENTER,EXIT,HOVER}`, `EVT_UI_METRIC_{ENTER,HOVER}`, `EVT_UI_BADGE_{ENTER,EXIT}`, `EVT_UI_NOTIFICATION_{ENTER,EXIT}`, `EVT_UI_SEARCH_{ENTER,EXPAND,COLLAPSE}`, `EVT_UI_AVATAR_{ENTER,HOVER}`
- Cursor: `EVT_CURSOR_MOVE`, `EVT_CURSOR_CLICK`, `EVT_CURSOR_DBLCLICK`, `EVT_CURSOR_HOVER`, `EVT_CURSOR_DRAG`, `EVT_CURSOR_SWIPE`, `EVT_CURSOR_SELECT`, `EVT_CURSOR_RIPPLE`

### Evotechly Transition Kit (ours)

| Field | Value |
|---|---|
| Verdict | **KEEP** |
| Score | **96** (20+25+15+15+10+10+1) — vendor risk n/a, tiny “we must not drift JSX” residual |
| Downloaded? | N/A — already in repo (`core/transitions`, catalog, `ae/Evotechly Transitions.jsx`) |
| Notes | `sourceType: native`, `commercialUse: true`. Full UI Push family (Phase 2) + UI-Slide card family (Phase 3) + Scale-Zoom (Phase 4) + Shared-Element (Phase 12) + Overlay-Modal (Phase 9) + Page-Screen (Phase 10) + Stagger-Cascade (Phase 13) + Mask-Reveal (Phase 6) + **Micro (Phase 17)**. Other families catalog-only. |

Phase 3 KEEP ID rows (all **OWNED**, implemented):

- Slide: `EVT_SLIDE_CARD_LEFT`, `EVT_SLIDE_CARD_RIGHT`, `EVT_SLIDE_PANEL_IN`, `EVT_SLIDE_PANEL_OUT`, `EVT_SLIDE_DRAWER`, `EVT_SLIDE_SHEET_UP`, `EVT_SLIDE_STACK`, `EVT_SLIDE_PEEK`

Phase 4 KEEP ID rows (all **OWNED**, implemented):

- Zoom: `EVT_ZOOM_IN`, `EVT_ZOOM_OUT`, `EVT_ZOOM_TARGET`, `EVT_ZOOM_MATCH`
- Scale: `EVT_SCALE_POP`, `EVT_SCALE_BREATHE`, `EVT_SCALE_PUNCH`, `EVT_SCALE_SETTLE`
- Shared: `EVT_SHARED_CARD`

Phase 12 KEEP ID rows (all **OWNED**, implemented):

- Shared: `EVT_SHARED_CARD`, `EVT_SHARED_IMAGE`, `EVT_MATCH_CUT`, `EVT_MORPH_BOUNDS`, `EVT_HERO_TO_DETAIL`, `EVT_LIST_TO_DETAIL`

Phase 9 KEEP ID rows (all **OWNED**, implemented):

- Overlay: `EVT_MODAL_IN`, `EVT_MODAL_OUT`, `EVT_SHEET_UP`, `EVT_SHEET_DOWN`, `EVT_OVERLAY_DIM`, `EVT_POPOVER_IN`, `EVT_TOAST_IN`

Phase 10 KEEP ID rows (all **OWNED**, implemented):

- Page: `EVT_PAGE_PUSH`, `EVT_PAGE_FADE`, `EVT_SCREEN_SWAP`, `EVT_NAV_FORWARD`, `EVT_NAV_BACK`, `EVT_TAB_CROSS`

Phase 13 KEEP ID rows (all **OWNED**, implemented):

- Stagger: `EVT_STAGGER_CARDS`, `EVT_STAGGER_LIST`, `EVT_CASCADE_IN`, `EVT_CASCADE_OUT`, `EVT_STAGGER_FADE`, `EVT_WAVE_SOFT`

Phase 6 KEEP ID rows (all **OWNED**, implemented):

- Mask: `EVT_MASK_CIRCLE`, `EVT_MASK_RECT`, `EVT_MASK_SOFT_EDGE`, `EVT_MASK_EXPAND`, `EVT_REVEAL_IRIS`, `EVT_REVEAL_WIPE_SOFT`

Phase 17 KEEP ID rows (all **OWNED**, implemented):

- Micro: `EVT_MICRO_HOVER`, `EVT_MICRO_PRESS`, `EVT_MICRO_TOGGLE`, `EVT_MICRO_CHECK`, `EVT_MICRO_BADGE`, `EVT_MICRO_COUNTER`, `EVT_MICRO_FOCUS`, `EVT_MICRO_SNAP`

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
| P2b native charts / devices | KEEP | 95 | Yes (`core/assets/chartsDevices.js` + registry) |
| P1 native text / UI / cursor | KEEP | 95 | Yes (`core/assets` + registry) |
| Transition Kit native (Push + Slide + Zoom + Shared + Overlay + Mask + Micro) | KEEP | 96 | Yes (Motion OS) |
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
