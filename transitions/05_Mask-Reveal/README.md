# Mask-Reveal (family E / 05)

Premium SaaS. No glitch / RGB / flares. Native AE masks only — no plugins, no vendor wipe.

Phase for this family: **6** (see docs/TRANSITION_PHASES.md). **Done** — every catalog ID has a real `applyTransitionPlan` generator.

Implemented IDs:

- `EVT_MASK_CIRCLE` · STANDARD · Soft circular reveal on a card (ellipse + expansion, target-aware)
- `EVT_MASK_RECT` · STANDARD · Rounded-rect expand (card crop reveal)
- `EVT_MASK_SOFT_EDGE` · SMOOTH · Feathered matte, no hard wipe
- `EVT_MASK_EXPAND` · STANDARD · Mask expansion from center
- `EVT_REVEAL_IRIS` · SMOOTH · Quiet iris on a screenshot (ellipse, target-aware)
- `EVT_REVEAL_WIPE_SOFT` · STANDARD · Soft directional matte from bounds, not a bar wipe

Plans: `core/transitions/maskReveal.js`. JSX apply: select outgoing, then incoming — incoming gets the native mask.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
