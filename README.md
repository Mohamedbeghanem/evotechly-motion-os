# Evotechly Motion OS — Ultimate 2.0.0

Deterministic compiler for **SaaS-style motion**, plus a dockable After Effects panel.

**Ultimate 2.0.0** ships the v0.32 Reliability panel plus Motion OS Hub, Seed Golden Project, and Caption Style Tools (P0 + P1a–P1d). AE visual soak is still UNKNOWN — [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11). See [VERSION.md](VERSION.md) and [V2_RELEASE_GATE.md](V2_RELEASE_GATE.md).

v0.7 Editor Kit: one panel for SaaS + reels + native polish + captions. See [ULTIMATE.md](ULTIMATE.md). Does not include Saber / QCA3 / Displacer.

**Editors: one-page path is [docs/QUICK_START.md](docs/QUICK_START.md). Install the Ultimate 2.0.0 files plus `ae/Evotechly Transitions.jsx` for the Transition Kit. Then [EDITOR.md](EDITOR.md) / [docs/SAAS_DEMO_KIT.md](docs/SAAS_DEMO_KIT.md) / [docs/CAPTION_STYLE.md](docs/CAPTION_STYLE.md) / [docs/TRANSITION_KIT.md](docs/TRANSITION_KIT.md) / [ae/INSTALL-AE.md](ae/INSTALL-AE.md).**

## After Effects app

Copy `ae/Evotechly Motion OS.jsx`, `ae/SaaS Demo Tools.jsx`, `ae/Caption Style Tools.jsx`, and `ae/Evotechly Transitions.jsx` into `Scripts/ScriptUI Panels`, restart AE.

- **Window > Evotechly Motion OS** — v0.32 Reliability (Figma roles, Motion, Polish, Person, Captions, Recipes).
- **Window > SaaS Demo Tools / Motion OS Hub** — Home (Seed), SaaS (cursor, depth, stagger, UI presets, carousel, glass, wipe, hover, flowing text, coloured reveal), Kit Hub (official URLs only). See [docs/SAAS_DEMO_KIT.md](docs/SAAS_DEMO_KIT.md). Does not replace the v0.32 panel.
- **Window > Caption Style Tools** — P1c keyword color + in/out presets (separate companion). See [docs/CAPTION_STYLE.md](docs/CAPTION_STYLE.md).
- **Window > Evotechly Transitions** — Transition Kit (UI Push through Stagger-Cascade) plus P1 Text / UI / Cursor and P2b Charts tabs. See [docs/TRANSITION_KIT.md](docs/TRANSITION_KIT.md), [docs/SAAS_ASSETS_P1.md](docs/SAAS_ASSETS_P1.md), and [docs/SAAS_ASSETS_P2B.md](docs/SAAS_ASSETS_P2B.md). Does not replace the v0.32 panel.

Name layers `Title`, `Card 1`, `CTA`, `Screenshot`, `Cursor`, `Caption`. Motion tab: Style / Direction / Shot / Scan / Apply / Fit footage. Optional companions: [docs/EDITOR_FREE_KIT.md](docs/EDITOR_FREE_KIT.md) (not bundled). Caption pack: `assets/` + `examples/captions/`.

No Node on the editor machine.

## Node compiler (optional)

```bash
node index.js examples/saas-hero.json --style stripe
node index.js examples/saas-hero.json --style evotechly --brand examples/evotechly.brand.json
node index.js examples/saas-hero.json --style apple --direction both --shot hook
```

Default style is `stripe` so existing hero demos stay put.

MIT (c) 2026 Evotechly / Mohamed Beghanem
