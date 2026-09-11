# Motion OS Ultimate

One After Effects panel. Not a separate “Vero Motion” SKU.

**Promise:** Art from Figma. Motion from Evotechly. Finish in one panel.

## Layers

| Layer | Name | Status |
|---|---|---|
| L0 | Compiler — Scan → Apply, roles, brand JSON, shots | shipped |
| L1 | UI Kit — In / Out / Both + UI layout presets (own code) | this PR |
| L2 | Lockup / Brand — PinRig-class logo/type setup (rebuild) | next |
| L3 | Taste packs — Evotechly + Apple calm + Stripe / Linear / Vercel | this PR (packs) |
| L4 | Copilot — prompt → editable role plan only | stub |

## Build order

1. Keep L0 deterministic. Default style stays **stripe** so existing demos do not shift.
2. Direction `in` | `out` | `both` in the engine, then the panel.
3. UI presets + roles (`modal`, `toast`, `row`, `stack`) without changing SaaS `ROLE_ORDER` prefix.
4. Taste packs `evotechly` and `apple`.
5. Shot ids recorded on the plan (`core/shots.js`).
6. L2 lockup math in-house.
7. L4 docs only until a prompt path exists. Never bake image sequences.

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
