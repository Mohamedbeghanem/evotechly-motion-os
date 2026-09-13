# Release zip checklist — v0.32.0-rc

Build the editor handoff zip from **`main`**. Tag name is **`v0.32.0-rc`**, not `v2.0.0` and not `v2.0.0-rc1`.

**Do not omit SaaS Demo Tools or Seed Golden Project.** Both are on `main` (PRs [#8](https://github.com/Mohamedbeghanem/evotechly-motion-os/pull/8), [#9](https://github.com/Mohamedbeghanem/evotechly-motion-os/pull/9), [#10](https://github.com/Mohamedbeghanem/evotechly-motion-os/pull/10)). An earlier workspace zip left them out — that was a pack error, not a repo gap. A zip with only the 297 KB panel is **not** a full RC.

Soak after unpack: [SOAK_CHECKLIST.md](SOAK_CHECKLIST.md). Gate: [V2_RELEASE_GATE.md](../V2_RELEASE_GATE.md).

## Required — three JSX files

| File | Role | Approx. size |
|---|---|---|
| `ae/Evotechly Motion OS.jsx` | Window → Evotechly Motion OS (v0.32 Reliability). Confirm **not** a stub / `PLACEHOLDER_SEE_FILE`. | ~297 KB |
| `ae/SaaS Demo Tools.jsx` | Window → SaaS Demo Tools / Motion OS Hub (Home seed, SaaS engines, Kit Hub URLs). | ~28 KB |
| `ae/Seed Golden Project.jsx` | File → Scripts → Run Script File… (or SaaS Demo → Seed). Builds the four golden comps. | ~8 KB |

All three must be in the zip. The main panel does **not** replace the other two.

## Required — docs

| File | Role |
|---|---|
| `docs/QUICK_START.md` | One-page editor path |
| `docs/SOAK_CHECKLIST.md` | Zero-code AE soak (Automation OFF) |
| `docs/RELEASE_ZIP_CHECKLIST.md` | This list — packer + editor can verify the zip |
| `docs/EDITOR_FREE_KIT.md` | Optional companions note — URLs only; **no** vendor binaries |
| `docs/SAAS_DEMO_KIT.md` | Native SaaS Demo engines vs companions |
| `V2_RELEASE_GATE.md` | Why this is RC-not-v2 |
| `VERSION.md` | Panel / phase notes |
| `ae/INSTALL-PANEL-v032.md` | Panel install (v0.32 + companions) |
| `ae/INSTALL-AE.md` | AE install order |

## Optional in the zip (never required to ship)

- `assets/` + `examples/captions/` — caption pack (not required inside AE)
- `docs/` engine one-pagers, `EDITOR.md`, `README.md`

## Never put in the zip

- AEJuice / Motion Bro / Liquid Glass / UI Animator Pro / Meow Captions / Solair / Saber / QCA binaries, JSX, or packs
- A fabricated `.aep` (AE is not in CI; editors run Seed)
- A stub or placeholder in place of the 297 KB panel

## Packer checks before you ship

- [ ] Zip built from current `main` (includes PRs #8–#10), not an old workspace folder
- [ ] All **three** JSX files present and openable
- [ ] Main panel is ~297 KB (Reliability), not a 51 KB leftover
- [ ] SaaS Demo Tools and Seed are **in the zip** (do not “leave companions for later”)
- [ ] Required docs above are present
- [ ] Tag / filename uses **`v0.32.0-rc`**, not `v2.0.0`
- [ ] No third-party plugin binaries

## After the zip lands

Hand the editor [QUICK_START.md](QUICK_START.md) + [SOAK_CHECKLIST.md](SOAK_CHECKLIST.md). They install both panels, seed the golden project, and record AE version + OS on [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11).
