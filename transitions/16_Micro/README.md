# Micro (family P / 16)

Premium SaaS. No glitch / RGB / flares. Soft chrome, no bounce loop.

Phase for this family: **17** (see docs/TRANSITION_PHASES.md). **Done** — every catalog ID has a real `applyTransitionPlan` generator.

Does not duplicate P1 `EVT_UI_*_HOVER` / `EVT_UI_*_CLICK`. Reuses those numbers only where they already match (button hover 102 / −2 px, button press 96 / 98, badge enter 90).

Implemented IDs:

- `EVT_MICRO_HOVER` · MICRO · Hover lift 1–2% (P1 button hover numbers)
- `EVT_MICRO_PRESS` · MICRO · Click squash, then recover (P1 button click numbers)
- `EVT_MICRO_TOGGLE` · MICRO · Toggle thumb settle (16 px)
- `EVT_MICRO_CHECK` · MICRO · Checkbox / check settle (88→100)
- `EVT_MICRO_BADGE` · FAST · Badge pop, no bounce loop (P1 badge enter 90)
- `EVT_MICRO_COUNTER` · FAST · KPI digit change (8 px, P1 metric y)
- `EVT_MICRO_FOCUS` · MICRO · Focus ring / field focus (100→101)
- `EVT_MICRO_SNAP` · MICRO · Snap into grid / alignment (8 px)

Plans: `core/transitions/micro.js`. JSX apply: one chrome layer, or outgoing + incoming for Counter.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
