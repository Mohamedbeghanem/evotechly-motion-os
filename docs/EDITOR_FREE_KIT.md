# Editor Free Kit — install order (companions)

Optional tools an editor may install **on their own machine**. Evotechly Motion OS does **not** require them, does **not** bundle them, and does **not** redistribute their binaries, JSX, presets, or packs.

If a vendor page asks you to pay, skip it or use only the free / personal tier they publish. We do not ship workarounds or cracked copies.

Official URLs change. Prefer the vendor’s current site over a mirrored zip.

## Policy

- **Optional** — product demos ship with native Motion OS + [SaaS Demo Kit](SAAS_DEMO_KIT.md). Seed the four golden comps from [QUICK_START.md](QUICK_START.md) (`ae/Seed Golden Project.jsx`) — no `.aep` in the repo.
- **Not required** — cursor, depth, stagger, carousel, glass panel, gradient wipe, proximity hover, captions, Keylight, and lockup all have native paths.
- **Not redistributed** — never commit `.aex`, `.plugin`, encrypted JSX, AEJuice/Motion Bro packs, or third-party scripts.
- **Research matrix** — own vs companion vs skip, and the one-tool wrap plan: [KIT_CAPABILITY_MATRIX.md](KIT_CAPABILITY_MATRIX.md).

## Install order

Quit After Effects before installing native plugins. ScriptUI panels go in `Scripts/ScriptUI Panels`. Restart AE, then open each from **Window**.

| # | Companion | Official starting point | After it is installed… |
|---|---|---|---|
| 1 | **UI Animator Pro** | [whatstudio.gumroad.com](https://whatstudio.gumroad.com/) | Optional extra UI presets. Prefer **Window → SaaS Demo Tools / Motion OS Hub** stagger / cursor first. |
| 2 | **PinRig** | [whatstudio.gumroad.com](https://whatstudio.gumroad.com/) | Optional logo pins. Prefer Motion OS **Logo lockup** shot. |
| 3 | **AEJuice (free)** | [aejuice.com](https://aejuice.com) | Pack browser only. Do not copy packs into this repo. |
| 4 | **Motion Bro (free)** | [motionbro.com](https://motionbro.com) | Host for some free packs. Off talking-head. |
| 5 | **Animation Composer (free)** | [mrhorse.com/animation-composer](https://www.mrhorse.com/animation-composer/) | Preset browser. Hooks only. |
| 6 | **Crate Light Wrap** | [productioncrate.com — Light Wrap](https://www.productioncrate.com/plugins/crates-light-wrap) | Optional wrap. Prefer **Person → Light wrap** first. |
| 7 | **Meow Captions** | [sinopskyd.itch.io/meow-captions](https://sinopskyd.itch.io/meow-captions) | Optional keyword color. Prefer **Captions** tab + SRT. |
| 8 | **Presetify** | [kuldeepmp4.gumroad.com/l/Presetify](https://kuldeepmp4.gumroad.com/l/Presetify) | Optional text presets. Prefer Captions / Type / Polish Typewriter. |
| 9 | **Vignette Typer Lite** | [vignettestudio.gumroad.com/l/vignette-typer-lite](https://vignettestudio.gumroad.com/l/vignette-typer-lite) | Optional type-on. Prefer Polish **Typewriter**. |
| 10 | **Repeater** | Native shape Repeater, or [aaeplugins.com/plugins/repeater](https://aaeplugins.com/plugins/repeater/) | Optional. Not needed for SaaS Demo carousel. |
| 11 | **PaulPack** | [paulplane.gumroad.com/l/paulpackv1](https://paulplane.gumroad.com/l/paulpackv1) | Optional ornaments. |
| 12 | **Liquid Glass (personal)** | Vendor personal/free listing (e.g. [Bento Motion glass pack](https://bentomotion.gumroad.com/l/glass-ae)); some packs need Motion Bro | Optional **personal-use only**. Never redistributed. Native **Glass Panel** in SaaS Demo Tools is the product path. |

Already documented elsewhere (hooks only, never bundled): Saber, QCA3, Displacer Pro, FX Console — see [EDITOR.md](../EDITOR.md).

## Which Motion OS surface to use

### SaaS product demo

1. **Window → SaaS Demo Tools / Motion OS Hub** — cursor + click, depth, stagger, carousel, glass panel, gradient wipe, proximity hover. Kit Hub = official URLs only (copy / alert; never download).
2. **Motion** — Style / Direction / Shot / Scan / Apply (Figma names: `Title`, `Card 1`, `CTA`, `Screenshot`, `Cursor`).
3. **Polish** — Apple Ease, Add Cursor (static pointer), click squash.
4. **Interact** — click / hover / drag sequences (v0.32 panel).
5. **Recipes** — ERP demo reminder.

Skip AEJuice / Motion Bro / Liquid Glass until the native pass is done.

### Talking-head

1. **Person** — Cutout Prep or Keylight recipe, Light wrap, Talking-head stack.
2. **Captions** — AR+EN, SRT, lower-third.
3. **Motion** — Scan / Apply after layers are named.
4. **Polish** — ease only. Wet / Glow / Saber / QCA **off**.

Crate Light Wrap is optional after the native wrap recipe.

### Reel / hook

1. **Motion** — Hook, Kinetic type, UI punch-in, Logo sting, Captions.
2. **Captions** — hook / kinetic / AR+EN.
3. **Polish** — Wet look on hooks and logo sting only.
4. **Recipes** — 15s hook reminders.

Animation Composer / AEJuice / Motion Bro / Vignette Typer Lite / Meow Captions are optional extras. Never required to ship a reel from this kit.

## Motion OS install (required)

```
ae/Evotechly Motion OS.jsx      →  Window → Evotechly Motion OS   (v0.32, ~297 KB)
ae/SaaS Demo Tools.jsx          →  Window → SaaS Demo Tools / Motion OS Hub
ae/Seed Golden Project.jsx      →  File → Scripts → Run Script File…  (or Hub Home → Seed Golden Project)
```

Copy the two panels into `Scripts/ScriptUI Panels`. Seed is a run-script, not a panel. One-page editor path: [QUICK_START.md](QUICK_START.md). See [ae/INSTALL-AE.md](../ae/INSTALL-AE.md).
