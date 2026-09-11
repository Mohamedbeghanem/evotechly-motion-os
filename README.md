# Evotechly Motion OS

Deterministic compiler for **SaaS-style motion**, plus a dockable After Effects panel.

SaaS 10 + Reel grammar (L3 distinct taste + reel shots): see [ULTIMATE.md](ULTIMATE.md).

**Editors: install `ae/Evotechly Motion OS.jsx` and read [EDITOR.md](EDITOR.md) + [ae/INSTALL-AE.md](ae/INSTALL-AE.md).**

## After Effects app

Copy `ae/Evotechly Motion OS.jsx` into `Scripts/ScriptUI Panels`, restart AE, open **Window > Evotechly Motion OS**.

Name layers `Title`, `Card 1`, `CTA`, `Screenshot`, `Cursor`, `Caption`. Pick Stripe / Linear / Vercel / Evotechly / Calm. Direction In / Out / Both. SaaS or Reel shot. Scan. Apply. Fit footage = cover crop.

No Node on the editor machine.

## Node compiler (optional)

```bash
node index.js examples/saas-hero.json --style stripe
node index.js examples/saas-hero.json --style evotechly --brand examples/evotechly.brand.json
node index.js examples/saas-hero.json --style apple --direction both --shot hook
```

Default style is `stripe` so existing hero demos stay put.

MIT (c) 2026 Evotechly / Mohamed Beghanem
