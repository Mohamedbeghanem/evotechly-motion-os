# Release zip checklist — v2.0.0 Ultimate

Build the editor handoff zip from **`main`**. Tag name is **`v2.0.0`**.

**Do not omit SaaS Demo Tools / Motion OS Hub, Seed Golden Project, or Caption Style Tools.** Hub + Seed are on `main` (PRs [#8](https://github.com/Mohamedbeghanem/evotechly-motion-os/pull/8)–[#16](https://github.com/Mohamedbeghanem/evotechly-motion-os/pull/16)). Caption Style is P1c (separate companion). An earlier workspace zip left companions out — that was a pack error, not a repo gap. A zip with only the 297 KB panel is **not** a full Ultimate 2.0.0.

Soak after unpack (confidence, not a tag blocker): [SOAK_CHECKLIST.md](SOAK_CHECKLIST.md). Gate: [V2_RELEASE_GATE.md](../V2_RELEASE_GATE.md) — **SHIPPED v2.0.0 Ultimate with known limitations.** AE visual soak remains UNKNOWN ([issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11)).

## Required — four JSX files

| File | Role | Approx. size |
|---|---|---|
| `ae/Evotechly Motion OS.jsx` | Window → Evotechly Motion OS (v0.32 Reliability). Confirm **not** a stub / `PLACEHOLDER_SEE_FILE`. | ~297 KB |
| `ae/SaaS Demo Tools.jsx` | Window → SaaS Demo Tools / Motion OS Hub (Home seed, SaaS engines, Kit Hub URLs). | ~45 KB |
| `ae/Seed Golden Project.jsx` | File → Scripts → Run Script File… (or SaaS Demo → Seed). Builds the four golden comps. | ~8 KB |
| `ae/Caption Style Tools.jsx` | Window → Caption Style Tools (P1c keyword color + in/out). Native text animators. | ~14 KB |

The main panel does **not** replace the companions. A zip with only the 297 KB panel is **not** a full 2.0.0.

## Required — docs

| File | Role |
|---|---|
| `docs/QUICK_START.md` | One-page editor path (Ultimate 2.0) |
| `docs/SOAK_CHECKLIST.md` | Zero-code AE soak (Automation OFF) — confidence, not a tag blocker |
| `docs/RELEASE_ZIP_CHECKLIST.md` | This list — packer + editor can verify the zip |
| `docs/EDITOR_FREE_KIT.md` | Optional companions note — URLs only; **no** vendor binaries |
| `docs/SAAS_DEMO_KIT.md` | Native SaaS Demo engines vs companions |
| `docs/CAPTION_STYLE.md` | P1c keyword color + in/out |
| `docs/KIT_CAPABILITY_MATRIX.md` | Own vs companion vs skip; P0+P1 shipped on 2.0.0 |
| `V2_RELEASE_GATE.md` | SHIPPED v2.0.0 Ultimate with known limitations |
| `VERSION.md` | Ultimate 2.0.0 shipped list |
| `ae/INSTALL-PANEL-v032.md` | Panel install (Ultimate 2.0 + companions) |
| `ae/INSTALL-AE.md` | AE install order (all four JSX) |

## Optional in the zip (never required to ship)

- `assets/` + `examples/captions/` — caption pack (not required inside AE)
- `docs/` engine one-pagers, `EDITOR.md`, `README.md`

## Never put in the zip

- AEJuice / Motion Bro / Liquid Glass / UI Animator Pro / Meow Captions / Solair / Saber / QCA binaries, JSX, or packs
- A fabricated `.aep` (AE is not in CI; editors run Seed)
- A stub or placeholder in place of the 297 KB panel

## Packer checks before you ship

- [ ] Zip built from current `main` (includes P0 Hub + P1a–P1d), not an old workspace folder
- [ ] All **four** JSX files present and openable (panel + SaaS Demo / Hub + Seed + Caption Style)
- [ ] Main panel is ~297 KB (Reliability), not a 51 KB leftover
- [ ] SaaS Demo Tools, Seed, and Caption Style are **in the zip** (do not “leave companions for later”)
- [ ] Required docs above are present
- [ ] Tag / filename uses **`v2.0.0`**
- [ ] No third-party plugin binaries

## After the zip lands

Hand the editor [QUICK_START.md](QUICK_START.md) + [SOAK_CHECKLIST.md](SOAK_CHECKLIST.md). They install all four JSX files, seed the golden project, and record AE version + OS on [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11) for soak confidence (not a 2.0.0 tag blocker).
