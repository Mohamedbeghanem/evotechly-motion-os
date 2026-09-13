# Evotechly Motion OS — Ultimate 2.0.0

Deterministic compiler for **SaaS-style motion**, plus a dockable After Effects panel.

**Ultimate 2.0.0** ships the v0.32 Reliability panel plus Motion OS Hub, Seed Golden Project, and Caption Style Tools (P0 + P1a–P1d). AE visual soak is still UNKNOWN — [issue #11](https://github.com/Mohamedbeghanem/evotechly-motion-os/issues/11). See [VERSION.md](VERSION.md) and [V2_RELEASE_GATE.md](V2_RELEASE_GATE.md).

v0.7 Editor Kit: one panel for SaaS + reels + native polish + captions. See [ULTIMATE.md](ULTIMATE.md). Does not include Saber / QCA3 / Displacer.

**Editors: one-page path is [docs/QUICK_START.md](docs/QUICK_START.md). Install all four: `ae/Evotechly Motion OS.jsx`, `ae/SaaS Demo Tools.jsx` (Hub), `ae/Seed Golden Project.jsx`, and `ae/Caption Style Tools.jsx`. Then [EDITOR.md](EDITOR.md) / [docs/SAAS_DEMO_KIT.md](docs/SAAS_DEMO_KIT.md) / [docs/CAPTION_STYLE.md](docs/CAPTION_STYLE.md) / [ae/INSTALL-AE.md](ae/INSTALL-AE.md).**

## After Effects app

Copy `ae/Evotechly Motion OS.jsx`, `ae/SaaS Demo Tools.jsx`, and `ae/Caption Style Tools.jsx` into `Scripts/ScriptUI Panels`, restart AE.

- **Window > Evotechly Motion OS** — v0.32 Reliability (Figma roles, Motion, Polish, Person, Captions, Recipes).
- **Window > SaaS Demo Tools / Motion OS Hub** — Home (Seed), SaaS (cursor, depth, stagger, UI presets, carousel, glass, wipe, hover, flowing text, coloured reveal), Kit Hub (official URLs only). See [docs/SAAS_DEMO_KIT.md](docs/SAAS_DEMO_KIT.md). Does not replace the v0.32 panel.
- **Window > Caption Style Tools** — P1c keyword color + in/out presets (separate companion). See [docs/CAPTION_STYLE.md](docs/CAPTION_STYLE.md).

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
