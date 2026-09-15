# Stagger-Cascade (family L / 12)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **13** (see docs/TRANSITION_PHASES.md). **Implemented.**

EvoCRM list / table rows: deal pipeline cards, contacts, activity. Reuses `saasDemo.STAGGER` (offset 3f, travel 16px). Opacity-only for fade. Soft delay wave, no bounce. Charts / device plates stay P2b.

Implemented IDs:

- `EVT_STAGGER_CARDS` · STANDARD · Card row stagger in
- `EVT_STAGGER_LIST` · STANDARD · List rows cascade
- `EVT_CASCADE_IN` · SMOOTH · Tree / nav cascade in
- `EVT_CASCADE_OUT` · FAST · Cascade out
- `EVT_STAGGER_FADE` · STANDARD · Opacity-only stagger
- `EVT_WAVE_SOFT` · SMOOTH · Soft delay wave, no bounce

Plans: `core/transitions/staggerCascade.js`. JSX apply: `ae/Evotechly Transitions.jsx` Transitions tab (select 2+ row layers).

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
