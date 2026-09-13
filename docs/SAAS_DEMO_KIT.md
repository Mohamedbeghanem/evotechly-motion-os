# SaaS Demo Kit — Phase 2 (+ Phase 3 seed)

Evotechly-owned tools so a product demo can do **cursor + click**, **depth reveal**, **stagger**, **carousel**, **glass panel**, **gradient wipe**, and **proximity hover** without Solair SaaS Kit and without paid plugins.

Nothing here is copied from Solair. Companions stay on vendor sites. This repo never vendors their scripts, `.mbr` packs, or binaries.

Liquid Glass remains an **optional external pack for personal use only**. It is not required. Native `glassPanel` is the product path.

## What we own vs companion

| Job | Evotechly (this kit) | Companion (optional, not shipped) |
|---|---|---|
| Pointer + click | Shape-layer cursor, move to target, scale-down on the clicked layer | UI Animator Pro (presets). Not required. |
| Depth / glass-ish focus | Native Fast Box Blur + Glow, `EVO_DEPTH` Focus / Strength | Deep Glow. Not required. |
| Frosted glass panel | Native Fill + Fast Box Blur / Gaussian + Tint/Levels, `EVO_GLASS` Opacity / Blur | Liquid Glass (personal). Not required. Never redistributed. |
| Linear wipe / reveal | Native Gradient Wipe, or shape matte + soft edge. Apple / Soft / Linear ease | Saber / QCA. Not required. |
| Proximity hover | `EVO_HOVER` + expressions; driver is Phase 1 `Cursor` | — |
| Multi-layer in / out / both | `staggerReveal` — frame offset + apple/soft/linear ease | UI Animator Pro, Animation Composer. Not required. |
| Slides / carousel | `EVO_CAROUSEL` Index + Gap, expressions on selected slides | Motion Bro packs, PaulPack ornaments. Not required. |
| SaaS hero timing | Main panel **Motion** tab — Scan / Apply, Figma→roles | — |
| Polish / click squash | Main panel **Polish** | — |
| Click / hover / drag sequences | Main panel **Interact** (v0.32) | — |
| Talking-head | Main panel **Person** | Crate Light Wrap (optional) |
| Captions AR+EN | Main panel **Captions** | Meow Captions, Vignette Typer Lite (optional) |
| Lockup pins | Main panel Logo lockup shot | PinRig (optional) |

**Rule:** native AE only in our code. Reminder + official URLs for free companions. See [EDITOR_FREE_KIT.md](EDITOR_FREE_KIT.md).

## How to run each tool

Install **both** JSX files into `Scripts/ScriptUI Panels`, restart After Effects:

1. `ae/Evotechly Motion OS.jsx` — v0.32 Reliability (do not replace with a stub).
2. `ae/SaaS Demo Tools.jsx` — this kit. **Window → SaaS Demo Tools**.

**Phase 3 — golden project seed.** There is no binary `.aep`. **File → Scripts → Run Script File…** → `ae/Seed Golden Project.jsx` (or the **Seed Golden Project** button on this panel). Creates `00_HOME`, `ERP_DEMO`, `TALKING_HEAD`, `REEL_9x16` if missing. Idempotent. Editor path: [QUICK_START.md](QUICK_START.md).

The v0.32 Polish tab also notes the companion. It does not reimplement these engines.

### Cursor + click — `createCursor`

1. Open the product-UI comp.
2. Select the layer that should receive the click (CTA, button, row).
3. SaaS Demo Tools → set Duration / Click at (defaults `0.55` / `0.55`) → **Cursor + click**.
4. A **shape** layer named `Cursor` is created if missing (triangle pointer, not a PNG). It keys from its current position to the target center. At `clickAt` both the cursor and the selected target get a scale-down, then recover.

Node plan (tests / tooling):

```js
const { createCursor } = require("../core/saasDemo");
createCursor({
  targetLayer: "CTA",
  startPos: [80, 90],
  endPos: [400, 320],
  duration: 0.55,
  clickAt: 0.55
});
```

### Depth reveal — `depthReveal`

1. Select layers in front-to-back order.
2. **Depth reveal (selected)**.
3. Guide null `EVO_DEPTH` gets **Focus** (0–100) and **Strength**. Each layer gets a **Depth** slider plus native Fast Box Blur (Gaussian Blur if Box Blur is missing) and native Glow.
4. Blur amount is `abs(Depth − Focus) * Strength`. No Deep Glow.

### Stagger reveal — `staggerReveal`

1. Select layers (first selected = first in).
2. Dir **In / Out / Both**, Frames (default `3`), Ease **Apple / Soft / Linear**.
3. **Stagger reveal (selected)**. Opacity + Y travel (`16px`, `0.42s`) with the same offset on every layer.

Both = in, short hold (`0.2s`), then out.

### Carousel — `carouselSetup`

1. Select slide layers in index order (first = `0`).
2. Axis **X** or **Y** → **Carousel setup (selected)**.
3. Guide null `EVO_CAROUSEL` gets **Index** and **Gap** (comp width or height). Each slide position is driven by an expression. Key **Index** to change slides.

### Glass panel — `glassPanel` (Phase 2)

Native frosted glass. No Liquid Glass `.mbr`, no Deep Glow.

1. Select the card / screenshot / solid to frost (or select nothing to spawn a rounded **Glass Panel** shape).
2. **Glass Panel (selected)**.
3. Guide null `EVO_GLASS` gets **Opacity** (default `42`) and **Blur** (default `18`). Each layer gets Fast Box Blur (Gaussian fallback), Tint, Levels, and optional Fill. Opacity and blur are expression-linked to the controller.

```js
const { glassPanel } = require("../core/saasDemo");
glassPanel({ layer: "Card 1", opacity: 42, blur: 18 });
```

### Gradient wipe — `gradientWipeReveal` (Phase 2)

Linear reveal using native **Gradient Wipe**, or a moving shape matte with a Fast Box Blur soft edge if the effect is missing.

1. Select the layer(s) to reveal.
2. Dir **Left / Right / Up / Down** (wipe side) or **In / Out / Both** (Phase 1 timing). Dur default `0.55`. Ease **Apple / Soft / Linear** (same influences as stagger: 80/18, 40/40, 16/16).
3. **Gradient Wipe (selected)**. Transition Completion keys `100 → 0` for a reveal. Out is `0 → 100`. Both = reveal, `0.2s` hold, then hide.

```js
const { gradientWipeReveal } = require("../core/saasDemo");
gradientWipeReveal({ layer: "Screenshot", duration: 0.55, direction: "left" });
```

### Proximity hover — `proximityHover` (Phase 2)

Layers scale and brighten when a driver is near.

1. Run **Cursor + click** first (Phase 1) so a shape `Cursor` exists — that is the driver.
2. Select the cards / buttons that should react. Set Radius (`140`), Scale boost (`6`), Opacity boost (`18`).
3. **Proximity Hover (selected)**. Guide null `EVO_HOVER` holds the three sliders. Scale / Opacity expressions measure distance to `Cursor`. If Cursor is missing, `EVO_HOVER` itself is the driver (move that null).

Pairing: animate the Phase 1 cursor across a row of cards. Each card’s scale is `value + ScaleBoost * (1 − distance / Radius)`. Opacity is the same with **Opacity Boost** (clamped 0–100). Leave opacity at 100 to use scale-only; drop rest opacity if you want a fade-up.

```js
const { proximityHover } = require("../core/saasDemo");
proximityHover({
  layers: ["Card 1", "Card 2", "Card 3"],
  radius: 140,
  scaleBoost: 6,
  opacityBoost: 18
});
```

## Architecture

| File | Role |
|---|---|
| `core/saasDemo.js` | Phase 1 plans + re-exports of Phase 2. Node-testable. |
| `core/saasDemoFx.js` | Phase 2: `glassPanel`, `gradientWipeReveal`, `proximityHover`. |
| `core/editorFreeKit.js` | Companion install order + which Motion OS tab to use. |
| `core/goldenProject.js` | Phase 3 seed names, sizes, layer roles, idempotency. |
| `ae/SaaS Demo Tools.jsx` | ScriptUI that applies the same numbers in AE. **Seed Golden Project** button evals the sibling script. |
| `ae/Seed Golden Project.jsx` | File → Run Script. Builds the four golden comps. No `.aep`. |
| `tests/saas-demo.test.js` | Phase 1–2 helper tests. |
| `tests/golden-project.test.js` | Phase 3 naming / idempotency / job map. |

JSX cannot `require()` Node modules. Constants in the companion match `core/saasDemo.js` / `core/saasDemoFx.js` (`0.55` move, `0.12` press, `0.88` / `0.94` click scales, `3` frame stagger, glass `42` / `18`, wipe softness `12`, hover `140` / `6` / `18`, `EVO_DEPTH` / `EVO_CAROUSEL` / `EVO_GLASS` / `EVO_HOVER`).

## Main panel (v0.32) — when to stay there

Use **SaaS Demo Tools** for the seven engines above. Keep using Motion OS for Figma roles, Style / Direction / Shot, Polish ease, Person, Captions, Recipes, Interact, Assets.

Do not paste Solair, UI Animator Pro, AEJuice, Motion Bro, Liquid Glass, CursorKit, Deep Glow, Saber, QCA, or TFM into this repo.
