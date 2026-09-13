# Caption Style — P1c keyword color + in/out

Evotechly-owned **keyword color** and **in/out presets** so a reel or talking-head can do Meow / Presetify-class caption helpers **without their code**. Native After Effects text animators only. No ElevenLabs. No vendor JSX.

The 297 KB Motion OS panel is unchanged. Place text on the **Captions** tab (or import SRT), then apply style from the companion.

## What we own vs companion

| Job | Evotechly (this PR) | Companion (optional, not shipped) |
|---|---|---|
| Place captions / AR+EN / SRT | Main panel **Captions** tab | Meow Captions (optional) |
| Keyword color | `colorKeywords` — Fill Color animator + character range | Meow keyword color. Not required. |
| In / out presets | `captionInOut` — `fade` / `scale` / `slideUp` / `typewriter` / `blur`, dir in/out/both | Presetify, Vignette Typer Lite. Not required. |
| Speech-to-text | — (out of scope) | ElevenLabs / Meow STT. Never used here. |

**Rule:** live AE text only. Do not bake PNG. Arabic stays shaped text — typewriter falls back to fade.

## How to run

Install into **Scripts/ScriptUI Panels**, restart After Effects:

1. `ae/Evotechly Motion OS.jsx` — v0.32 Reliability (do not replace with a stub).
2. `ae/Caption Style Tools.jsx` — this kit. **Window → Caption Style Tools**.

**Window → SaaS Demo Tools / Motion OS Hub** (P0) stays the Home / SaaS / Kit Hub companion. Caption Style is a **separate** ScriptUI — not a Hub tab, and not folded into the 297 KB panel.

### 1. Place text (Captions tab)

1. Open `TALKING_HEAD` or `REEL_9x16` (or any comp).
2. Motion OS **Captions** — Hook / kinetic / AR+EN / lower-third / Import SRT.
3. Select the live text layer(s).

### 2. Keyword color — `colorKeywords`

1. Caption Style Tools → Keywords (comma-separated) → Hex (default `#3DDC97`).
2. **Color keywords**.
3. Each hit gets an `EVO_CAP_COLOR_*` animator: Fill Color + range selector on those characters.

```js
const { colorKeywords } = require("../core/captionStyle");
colorKeywords({
  text: "Ship FAST. Ship calm.",
  keywords: ["ship", "FAST"],
  colorHex: "#3DDC97"
});
```

Case-insensitive. Longer keywords win when they overlap. Invalid hex falls back to `#3DDC97`.

### 3. In / out preset — `captionInOut`

1. Preset **Fade / Scale / Slide Up / Typewriter / Blur**.
2. Dir **In / Out / Both**. Frames (default `12` @ comp fps).
3. **Apply in/out**.

Both = in, `0.2s` hold, then out. Typewriter on Arabic copy uses fade (shaping). Color animators are left in place.

```js
const { captionInOut } = require("../core/captionStyle");
captionInOut({ preset: "slideUp", direction: "both", frames: 12 });
```

| Preset | Animator |
|---|---|
| fade | Opacity 0 → 100 |
| scale | Scale 80 → 100 |
| slideUp | Opacity + Position Y `16px` |
| typewriter | Opacity 0 + character range End 0 → 100 |
| blur | Opacity + Blur `12` → 0 |

## Architecture

| File | Role |
|---|---|
| `core/captionStyle.js` | Deterministic plans. Node-testable. |
| `core/captions.js` | Re-exports `colorKeywords` / `captionInOut` next to templates + SRT. |
| `ae/Caption Style Tools.jsx` | ScriptUI that applies the same numbers in AE. |
| `tests/caption-style.test.js` | Pure helper tests. |

JSX cannot `require()` Node modules. Constants match the core (`#3DDC97`, `12` frames, `0.2s` hold, scale `80`, slide `16`, blur `12`, `EVO_CAP_*`).

## Main panel (v0.32) — when to stay there

Use **Captions** for templates, SRT, 9:16 safe, KPI. Use **Caption Style Tools** for keyword color and the in/out row. Do not paste Meow, Presetify, or ElevenLabs into this repo.
