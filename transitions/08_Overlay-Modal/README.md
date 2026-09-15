# Overlay-Modal (family H / 08)

Premium SaaS. No glitch / RGB / flares.

Phase for this family: **9** (see docs/TRANSITION_PHASES.md). **Done** — EvoCRM dialogs, sheets, dim, popover, toast.

Implemented IDs:

- `EVT_MODAL_IN` · STANDARD · Dialog present + dim
- `EVT_MODAL_OUT` · FAST · Dialog dismiss
- `EVT_SHEET_UP` · STANDARD · Modal sheet from bottom (reuses UI-Slide sheet math)
- `EVT_SHEET_DOWN` · FAST · Sheet dismiss
- `EVT_OVERLAY_DIM` · FAST · Dim plate only
- `EVT_POPOVER_IN` · FAST · Popover from a target (bounds-aware)
- `EVT_TOAST_IN` · FAST · Toast from edge, then settle

Plans: `core/transitions/overlayModal.js`. Apply: Transitions tab in `ae/Evotechly Transitions.jsx`.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
