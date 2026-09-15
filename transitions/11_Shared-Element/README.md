# Shared-Element (family K / 11)

Premium SaaS. No glitch / RGB / flares. Bounds match (position + scale) — not mesh warp.

Phase for this family: **12**. `EVT_SHARED_CARD` shipped early with Scale-Zoom (Phase 4) for the EvoCRM dashboard → card → detail path.

Implemented:

- `EVT_SHARED_CARD` · SMOOTH · Card bounds morph to detail

Still catalog-only:

- `EVT_SHARED_IMAGE` · SMOOTH · Image hero → gallery
- `EVT_MATCH_CUT` · FAST · Match position/scale, cut the rest
- `EVT_MORPH_BOUNDS` · STANDARD · Rect morph only (no mesh)
- `EVT_HERO_TO_DETAIL` · SMOOTH · Marketing hero into app UI
- `EVT_LIST_TO_DETAIL` · STANDARD · Row expands into detail pane

Plans: `core/transitions/sharedElement.js`. Morph math: `planBoundsMorph` in `core/transitions/target.js`.

Docs: [../../docs/TRANSITION_KIT.md](../../docs/TRANSITION_KIT.md)
