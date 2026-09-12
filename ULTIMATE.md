# Motion OS Ultimate

One After Effects panel. Not a separate “Vero Motion” SKU.

**Promise:** Art from Figma. Motion from Evotechly. Finish in one panel.

## Layers

| Layer | Name | Status |
|---|---|---|
| L0 | Compiler — Scan → Apply, roles, brand JSON, shots | shipped |
| L1 | UI Kit — In / Out / Both + UI layout presets (own code) | shipped |
| L2 | Lockup / Brand — own pins + type metrics + Scan→Apply guides | shipped |
| L3 | Taste packs — Evotechly product-native + Calm / system vs Stripe / Linear / Vercel | shipped |
| L3.1 | SaaS shot pack v2 + Reel grammar | shipped |
| L3.2 | Native Polish tab (ease / text / cursor / squash / wet) | this PR (v0.7) |
| L4 | Copilot — prompt → editable role plan only | stub |

## L3 taste (same hero layers)

| Pack | Travel | Title | Cards | CTA | Feel |
|---|---|---|---|---|---|
| Stripe | 1.00 | fadeUp 16px | scaleIn, 0.07 stagger | pop after group | premium SaaS default |
| Linear | 0.88 | slideUp | fadeUp | scaleIn | product-native, quieter scale |
| Vercel | 0.72 | fadeUp short | scaleIn tight | pop snappy | sharp reveal |
| Evotechly | **0.62** | fadeUpSoft | uiCard, 0.05 stagger | uiCard settle | quiet product-native |
| Calm / system | **0.38** | fadeUpCalm, longer | fadeUpCalm, 0.10 stagger | fadeUpCalm, big gap | expensive hold, no pop |

Default style stays **stripe**. Pick Evotechly or Calm explicitly.

Brand file `examples/evotechly.brand.json` (`evotechly.brand.v1`) now changes the plan: `gap`, `travel`, and per-role `base` / `stagger` / `durationScale` / `after`. CLI: `--brand examples/evotechly.brand.json`. Not loaded unless you pass it — stripe hero fixtures stay put.

## SaaS shots v2

Hero · Feature row · Pricing · Dashboard tour · Logo lockup · UI screen

Hints in `core/shots.js` (card stagger, screenshot zoom). Hero hints are 1 / no-op so Stripe demos do not move.

Timing is frame-agnostic. 9:16 is a crop, not a different delay table.

**Fit footage:** cover-scale the Screenshot / recording to the active comp, centered. Safe crop (no letterbox). Works on 16:9 and 9:16 comps.

Cursor still flies to CTA. CTA still waits for the group.

## Reel shots (new)

Hook · Kinetic type · UI punch-in · Logo sting · Captions

- **Hook** — 0–1s slam. Delays compressed, title uses `hookSlam`.
- **Kinetic type** — word/line builds on title / subtitle / caption / eyebrow.
- **UI punch-in** — product UI proof, 9:16-safe cover zoom (`punchIn`).
- **Logo sting** — short end card; L2 lockup with faster mark→type.
- **Captions** — `caption` role (append-only). Two-line stagger.

**Both:** SaaS Both is still in → out with no hold. Reel Both is in → hold → out (loop-friendly). Beat-sync from audio is later.

## Direction

- **in** (default) — `from → to`
- **out** — swap
- **both** — in, then out. Reel shots add `animation.hold` from the shot hint.

## L2 Lockup

`logoLockup` and `logoSting`. Own pins. No PinRig.

## L3.2 Native Polish (v0.7)

One panel. Replaces a separate EpicSaaS / polish kit for the tools we can do in stock AE:

Apple Ease · Soft Ease · Spring (Position expression) · Apple Text In · Typewriter + caret · Add Cursor · Click squash · Click ripple · Wet look (Glow + Noise adj layer).

**Not bundled:** Saber, QCA3, Displacer Pro, FX Console, Animation Composer. Reminder row in the panel only. Official sites.

## L4 Copilot (stub)

Later: a prompt becomes an **editable role plan**. Editors still Scan / Apply.

Out of scope now: Claude/API wiring, CEP/Premiere, baked frames, beat-sync.

## No third-party binary

MIT Evotechly code only. No `.aex`, encrypted JSX, or copied ScriptUI from paid plugins.
