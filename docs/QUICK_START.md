# Quick start — editor path (Phase 3)

One page. No third-party plugin binaries. Art from Figma; motion from Evotechly.

## 1. Install order (required)

Quit After Effects. Copy these into **Scripts/ScriptUI Panels**, then restart:

| # | File | Open from |
|---|---|---|
| 1 | `ae/Evotechly Motion OS.jsx` | **Window → Evotechly Motion OS** (v0.32 Reliability, ~297 KB — do not replace with a stub) |
| 2 | `ae/SaaS Demo Tools.jsx` | **Window → SaaS Demo Tools** |

Optional: copy `ae/Seed Golden Project.jsx` into **Scripts** (not ScriptUI Panels) so it appears under **File → Scripts**.

Details: [ae/INSTALL-AE.md](../ae/INSTALL-AE.md). Caption pack (not required in AE): `assets/` + `examples/captions/`.

## 2. Optional companions

Do **not** need AEJuice, Motion Bro, Liquid Glass, UI Animator Pro, or Meow Captions to ship. Those stay on vendor sites and are never in this repo.

Summary + official URLs: [EDITOR_FREE_KIT.md](EDITOR_FREE_KIT.md). Native engines: [SAAS_DEMO_KIT.md](SAAS_DEMO_KIT.md).

## 3. Seed the golden project

There is no checked-in `.aep`. After Effects is not available in CI. The seed script **builds** the four comps when you run it.

**File → Scripts → Run Script File…** → `ae/Seed Golden Project.jsx`

Or **Window → SaaS Demo Tools → Seed Golden Project** (needs the seed JSX next to the panel).

Creates (skips a name if it already exists — run twice is safe):

| Comp | Size | What’s inside |
|---|---|---|
| `00_HOME` | 1920×1080 | Desktop picker + shy guide null `EVO_GOLDEN_META` (required tabs) |
| `ERP_DEMO` | 1920×1080 | Shape placeholders named for Motion OS roles (`Title`, `Card 1`…`Card 3`, `CTA`, `Screenshot`, `Cursor`, `Nav`, `Sidebar`) |
| `TALKING_HEAD` | 1920×1080 | `VIDEO_PLACEHOLDER` solid, `CUTOUT`, mid-stack `Caption` / AR / EN notes, `Product UI / L3`, `BG` |
| `REEL_9x16` | 1080×1920 | `SAFE_TOP` / `SAFE_BOTTOM` / `SAFE_LEFT` / `SAFE_RIGHT` guides + Hook / Kinetic / Caption layers |

Replace solids with footage. Name new layers the same way (`Title`, `CTA`, `Caption`, `CUTOUT`). Never key cameras, lights, locked layers, or names containing `EVO_SKIP`.

## 4. Job map

| Job | Comp | Motion OS tab | SaaS Demo button |
|---|---|---|---|
| **SaaS shot** | `ERP_DEMO` | **Motion** — Style / Direction / Shot / Scan / Apply. **Polish** — Apple Ease, click squash. **Interact** — click / hover / drag. **Recipes** — ERP demo. | **Cursor + click** (select `CTA`). **Stagger reveal** (select `Card 1`–`Card 3`). **Depth reveal** (front → back). **Carousel setup** (slides). **Glass Panel** (`Screenshot` / a card). **Gradient Wipe**. **Proximity Hover** (cards; run Cursor first). |
| **Talking-head** | `TALKING_HEAD` | **Person** — Cutout Prep or Keylight, Light wrap, Talking-head stack. **Captions** — AR+EN, SRT, lower-third. **Motion** — Scan / Apply after names exist. **Polish** — ease only (Wet / Glow / Saber / QCA **off**). | None required. |
| **Reel / hook** | `REEL_9x16` | **Motion** — Hook, Kinetic type, UI punch-in, Logo sting, Captions. **Captions** — hook / kinetic / AR+EN. **Polish** — Wet look on hooks and logo sting only. **Recipes** — 15s hook. | Optional **Stagger reveal** or **Gradient Wipe** on type. Stay inside the `SAFE_*` guides. |

Loop: pick Style + Shot + Direction → Scan → Apply (one undo). Fit footage = cover crop.

## Names that Scan understands

`Title` `Subtitle` `Card 1` `Card 2` `CTA` `Screenshot` `Cursor` `Caption` `Logo` `Wordmark` `CUTOUT`
