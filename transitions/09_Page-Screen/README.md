# Page-Screen (family I / 09)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **10** (see docs/TRANSITION_PHASES.md). **Implemented.**

EvoCRM IA: dashboard → page, stack forward/back, tab content. Charts / device plates stay P2b.

Implemented IDs:

- `EVT_PAGE_PUSH` · STANDARD · Full-page push using UI Push math
- `EVT_PAGE_FADE` · SMOOTH · Full-page fade (opacity-only)
- `EVT_SCREEN_SWAP` · STANDARD · Replace screen, keep app chrome
- `EVT_NAV_FORWARD` · STANDARD · Forward in an IA stack
- `EVT_NAV_BACK` · STANDARD · Back in an IA stack
- `EVT_TAB_CROSS` · FAST · Tab content crossfade

Plans: `core/transitions/pageScreen.js`. JSX apply: `ae/Evotechly Transitions.jsx` Transitions tab.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
