# Motion OS Ultimate

One After Effects panel. Not a separate “Vero Motion” SKU.

**Promise:** Art from Figma. Motion from Evotechly. Finish in one panel.

## Layers

| Layer | Name | Status |
|---|---|---|
| L0 | Compiler — Scan → Apply, roles, brand JSON, shots | shipped |
| L1 | UI Kit — In / Out / Both + UI layout presets (own code) | this PR |
| L2 | Lockup / Brand — own pins + type metrics + Scan→Apply guides | this PR (v1 landed) |
| L3 | Taste packs — Evotechly + Apple calm + Stripe / Linear / Vercel | this PR (packs) |
| L4 | Copilot — prompt → editable role plan only | stub |

## Build order

1. Keep L0 deterministic. Default style stays **stripe** so existing demos do not shift.
2. Direction `in` | `out` | `both` in the engine, then the panel.
3. UI presets + roles (`modal`, `toast`, `row`, `stack`) without changing SaaS `ROLE_ORDER` prefix.
4. Taste packs `evotechly` and `apple`.
5. Shot ids recorded on the plan (`core/shots.js`).
6. L2 lockup math in-house (`core/lockup.js`). Active when shot is `logoLockup`.
7. L4 docs only until a prompt path exists. Never bake image sequences.

## L2 Lockup (v1 landed)

Own code in `core/lockup.js` + the ScriptUI panel. No PinRig / What? Studio files.

Name `Logo` (mark) and `Wordmark` or `Title` (type). Shot = **Logo lockup**. Scan → Apply.

Landed:

- Pins: mark center, optical gap, gapX, baseline, cap-height, x-height.
- `lockupPart`: Wordmark is type even though the role alias is `logo`.
- Mark keys first (~0.02s); type follows (~0.16s).
- Scan reads `sourceRectAtTime` for metrics. Apply writes 5 shy guide nulls (`EVO_SKIP_LOCKUP_*`). Next Scan ignores them.
- AE JSON carries `lockup` when shot is `logoLockup`.
- Hero / Stripe demos do not use this path.

## Direction

- **in** (default) — play preset `from → to` (appear).
- **out** — swap `from` / `to` (dismiss).
- **both** — `in`, then an `animation.out` phase that reverses the same travel.

Schema remains `evotechly.motion.engine.v1`. Plan fields: `style`, `direction`, `shot`.

## UI presets (L1)

Own implementations in `core/presets.js`: `uiRow`, `uiStack`, `uiCard`, `uiModal`, `uiNav`, `uiToast`.

Inspired by common UI-animator layout ideas. **Do not vendor, copy, or ship What? Studio / UI Animator Pro / Gumroad binaries or source.**

## L4 Copilot (stub)

Later: a prompt becomes an **editable role plan** (layers + roles + delays). Editors still Scan / Apply.

Out of scope now: Claude/API wiring, CEP/Premiere, baked frames.

## No third-party binary

This repo is MIT Evotechly code only. No `.aex`, encrypted JSX from other vendors, or copied ScriptUI from paid plugins.
