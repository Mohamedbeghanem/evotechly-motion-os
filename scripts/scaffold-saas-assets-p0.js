"use strict";

/**
 * P0 SaaS Assets pack folder + README stubs.
 * Run from repo root: node scripts/scaffold-saas-assets-p0.js
 * Does not download vendor packs.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "Evotechly-SaaS-Assets");

const FOLDERS = [
  {
    dir: "01_Transitions",
    title: "Transitions",
    intent:
      "Screen-to-screen SaaS motion (dashboard → card → analytics). Premium, short travel, no glitch / RGB / flares.",
    examples: [
      "EVT_UI_PUSH_LEFT — already owned in Transition Kit Phase 1",
      "EVT_UI_PUSH_DASHBOARD — already owned in Transition Kit Phase 2",
      "EVT_UI_PUSH_SPLIT — already owned (master–detail)",
      "EVT_XFADE_SOFT — catalog only until Transition Kit Phase 5"
    ],
    native: "core/transitions + ae/Evotechly Transitions.jsx. Registry IDs must match transitions/Metadata/catalog.json.",
    thirdParty: "Do not drop AEJuice / Motion Bro / Animation Composer presets here. Those stay MANUAL companion installs."
  },
  {
    dir: "02_Text-Animations",
    title: "Text animations",
    intent:
      "Product-taste text: flowing reveal, coloured keyword, typewriter, fade/scale/slide. Not kinetic-glitch packs.",
    examples: [
      "EVT_TEXT_FLOWING — native core/textReveal.js",
      "EVT_TEXT_COLOURED — native colouredReveal",
      "EVT_CAPTION_TYPEWRITER — native captionStyle / Polish Typewriter",
      "EVT_TEXT_FADE_UP — P1 later native generator"
    ],
    native: "core/textReveal.js, core/captionStyle.js, Hub SaaS + Caption Style Tools.",
    thirdParty: "Presetify / Vignette Typer Lite / Meow stay companion-only. Do not vendor their JSX."
  },
  {
    dir: "03_UI-Elements",
    title: "UI elements",
    intent:
      "Nav, tabs, pills, toasts, input focus, toggle chrome. Linear / Stripe taste. Rebuild as AE shapes + our presets.",
    examples: [
      "EVT_UI_TAB_SWITCH",
      "EVT_UI_TOAST_IN",
      "EVT_UI_PILL_SELECT",
      "EVT_UI_TOGGLE_SETTLE"
    ],
    native: "core/uiPresets.js (fade-up, slide-*, pop) + staggerReveal. Expand generators in P1.",
    thirdParty: "UI Animator Pro is $0 companion install only — never vendor jsxbin."
  },
  {
    dir: "04_Icons",
    title: "Icons",
    intent:
      "Static SaaS icons (CRM, users, charts, billing). Prefer Lucide / Phosphor / Heroicons as shape sources, then rebuild as AE shape layers.",
    examples: [
      "EVT_ICON_LUCIDE_USERS",
      "EVT_ICON_LUCIDE_LAYOUT_DASHBOARD",
      "EVT_ICON_LUCIDE_CREDIT_CARD",
      "EVT_ICON_AE_SHAPE_CHART — P1 native rebuild"
    ],
    native: "P1: convert curated SVGs to AE shape descriptors. Do not ship 1000-icon dumps.",
    thirdParty: "Vendored Lucide set lives in ThirdParty/lucide (ISC + Feather MIT). Phosphor / Heroicons listed in SOURCES.md — do not scrape paid icon packs."
  },
  {
    dir: "05_Buttons-CTAs",
    title: "Buttons and CTAs",
    intent:
      "Primary / ghost / pill CTAs: hover lift, press squash, focus ring. Product UI, not bumper stingers.",
    examples: [
      "EVT_CTA_PRESS",
      "EVT_CTA_HOVER_LIFT",
      "EVT_CTA_POP",
      "EVT_BTN_GHOST_FADE"
    ],
    native: "Hub click squash + applyUiPreset pop / fade-scale. P1 generators write keys on selected shape layers.",
    thirdParty: "No Envato button packs. PaulPack ornaments are MANUAL and must not be copied into this folder."
  },
  {
    dir: "06_Cards",
    title: "Cards",
    intent:
      "Dashboard cards: lift, stack, swap, soft scale. Bounds-based only — no mesh warp.",
    examples: [
      "EVT_CARD_LIFT",
      "EVT_CARD_SWAP_SCALE",
      "EVT_CARD_STACK_IN",
      "EVT_UI_PUSH_SCALE — already owned"
    ],
    native: "Reuse UI Push + Scale / Cover. P1 card-specific settle.",
    thirdParty: "Reject glitch card packs. AEJuice slides stay in the vendor browser."
  },
  {
    dir: "07_Modals-Overlays",
    title: "Modals and overlays",
    intent:
      "Dialog in/out, dimmer, sheet, popover. Quiet overshoot. Overlay-Modal family is Transition Kit Phase 9 metadata today.",
    examples: [
      "EVT_MODAL_IN",
      "EVT_MODAL_OUT",
      "EVT_SHEET_UP",
      "EVT_DIMMER_FADE"
    ],
    native: "transitions catalog Overlay-Modal IDs + Hub glassPanel for frost behind modal.",
    thirdParty: "BentoMotion Liquid Glass is personal-free only — not for Evotechly commercial."
  },
  {
    dir: "08_Charts-Dashboards",
    title: "Charts and dashboards",
    intent:
      "KPI count-up, bar draw, sparkline, donut sweep. Native expressions / trim paths later — no stock chart AEPs.",
    examples: [
      "EVT_CHART_BAR_DRAW",
      "EVT_CHART_KPI_COUNT",
      "EVT_CHART_LINE_REVEAL",
      "EVT_DASH_WIDGET_IN"
    ],
    native: "P1 generators + Lucide chart icons as placeholders.",
    thirdParty: "Do not vendor Lottie chart files into the release zip without per-file license review."
  },
  {
    dir: "09_Captions",
    title: "Captions",
    intent:
      "Keyword color + in/out (fade, scale, slideUp, typewriter, blur). AR+EN captions stay on the main panel.",
    examples: [
      "EVT_CAPTION_COLOR_KEYWORDS — native captionStyle",
      "EVT_CAPTION_IN_FADE",
      "EVT_CAPTION_OUT_SLIDE_UP",
      "EVT_CAPTION_TYPEWRITER"
    ],
    native: "core/captionStyle.js + Window → Caption Style Tools. assets/caption-templates.json.",
    thirdParty: "Meow Captions is optional companion (itch.io). Never vendor the CEP zip."
  },
  {
    dir: "10_Lower-Thirds",
    title: "Lower thirds",
    intent:
      "Talking-head name plates and product lower-thirds. Quiet, high-contrast type. No broadcast news wipes.",
    examples: [
      "EVT_L3_NAME_IN",
      "EVT_L3_ROLE_FADE",
      "EVT_L3_PRODUCT_PILL"
    ],
    native: "Captions tab lower-third + P1 native L3 generators.",
    thirdParty: "Animation Composer titles stay in the vendor plugin. Do not copy presets here."
  },
  {
    dir: "11_Cursors",
    title: "Cursors",
    intent:
      "Pointer / hand / I-beam plus click squash. Shape layers only — no PNG cursor packs.",
    examples: [
      "EVT_CURSOR_POINTER — native createCursor({ style: 'pointer' })",
      "EVT_CURSOR_HAND",
      "EVT_CURSOR_IBEAM",
      "EVT_CURSOR_CLICK"
    ],
    native: "core/saasDemo.js CURSOR.styles. Hub SaaS Style dropdown.",
    thirdParty: "CursorKit is skip / reference only. Do not vendor."
  },
  {
    dir: "12_Glass-Frost",
    title: "Glass and frost",
    intent:
      "Native frost (Fill + Fast Box Blur + Tint/Levels). True refraction stays an editor-installed companion.",
    examples: [
      "EVT_GLASS_PANEL — native glassPanel",
      "EVT_GLASS_FROST_SOFT — Transition Kit Glass-Frost family (catalog)",
      "EVT_GLASS_MODAL_BACKDROP"
    ],
    native: "core/saasDemoFx.js glassPanel. Transition Kit family N / 14.",
    thirdParty: "BentoMotion = BLOCKED_FOR_COMMERCIAL without paid license. Tools for Motion Liquid Glass = editor install, never redistributed."
  },
  {
    dir: "13_Logos-Lockups",
    title: "Logos and lockups",
    intent:
      "Brand lockup construction, quiet sting. Prefer Motion OS Logo lockup shot over PinRig unless the editor installed it.",
    examples: [
      "EVT_LOCKUP_BUILD",
      "EVT_LOGO_STING",
      "EVT_WORDMARK_FADE"
    ],
    native: "core/lockup.js + Motion Logo lockup shot.",
    thirdParty: "PinRig is $0 companion. Do not vendor jsxbin."
  },
  {
    dir: "14_Backgrounds",
    title: "Backgrounds",
    intent:
      "Soft product gradients and licensed plates. Empty on purpose in P0. No scraped stock.",
    examples: [
      "EVT_BG_SOFT_GRADIENT",
      "EVT_BG_GRID_FAINT",
      "EVT_BG_OFFICE_PLATE — MANUAL licensed still only"
    ],
    native: "assets/bg/ is the existing drop folder. P1 may add shape-grid generators.",
    thirdParty: "Mixkit / Pixabay plates: commercial finished works OK; do not redistribute raw files in our zip."
  },
  {
    dir: "15_Overlays-HUD",
    title: "Overlays and HUD",
    intent:
      "Soft vignette, focus ring, faint grid, SaaS HUD chrome. Own shapes. Not military / sci-fi HUD packs.",
    examples: [
      "EVT_HUD_FOCUS_RING",
      "EVT_HUD_SAFE_GRID",
      "EVT_OVERLAY_VIGNETTE_SOFT"
    ],
    native: "P1 Evotechly shape recipes.",
    thirdParty: "AEJuice Motion Cafe UI/HUD stays in Pack Manager. Do not copy into git."
  },
  {
    dir: "16_SFX",
    title: "Sound effects",
    intent:
      "UI whoosh / tick / cross markers first. Audio files only after a verified CC0 or Mixkit Free License download on the editor machine.",
    examples: [
      "EVT_SFX_ANTICIPATE — marker hook ui-soft-in",
      "EVT_SFX_ACTION — ui-whoosh-soft",
      "EVT_SFX_CROSSOVER — ui-cross",
      "EVT_SFX_SETTLE — ui-tick-soft"
    ],
    native: "Transition Kit SFX markers only today. No WAV/MP3 in this repo for P0.",
    thirdParty: "See MANUAL-DOWNLOADS.md Mixkit / Pixabay / Freesound candidates. Never commit files whose license forbids redistribution."
  },
  {
    dir: "17_Presets-Expressions",
    title: "Presets and expressions",
    intent:
      "Own expression snippets and later .jsx apply helpers. Never check in vendor .ffx / .aep.",
    examples: [
      "EVT_EXPR_PROGRESS_DRIVER — reserved (Transition Kit later phase)",
      "EVT_EXPR_SAFE_MARGIN",
      "EVT_PRESET_APPLE_EASE — already in core/polish.js"
    ],
    native: "core/transitions/easing.js, polish ease. Pack-level expressions land in Engine/ later.",
    thirdParty: "Animation Composer / AEJuice presets are companion browsers only."
  },
  {
    dir: "18_Shapes-Ornaments",
    title: "Shapes and ornaments",
    intent:
      "Loopable product ornaments (dots, underlines, soft rules). Rebuild PaulPack-class shapes ourselves.",
    examples: [
      "EVT_SHAPE_DOT_PULSE",
      "EVT_SHAPE_RULE_DRAW",
      "EVT_SHAPE_CORNER_ACCENT"
    ],
    native: "P1 native shape recipes.",
    thirdParty: "PaulPack Gumroad $0+ is MANUAL. Do not copy their AEP/shapes into this folder."
  },
  {
    dir: "19_Particles-Accents",
    title: "Particles and accents",
    intent:
      "Subtle dust / sparkle accents only. No explosions, no confetti cannons, no glitch particles.",
    examples: [
      "EVT_ACCENT_SOFT_SPARKLE",
      "EVT_ACCENT_DUST_DRIFT",
      "EVT_ACCENT_LINE_SWEEP"
    ],
    native: "P1 optional. Prefer none over taste violations.",
    thirdParty: "Reject AEJuice VFX starter for product UI unless a specific clip is license-reviewed and not redistributed."
  },
  {
    dir: "20_Camera-Moves",
    title: "Camera moves",
    intent:
      "Plate push/pull / target zoom. Not a 3D camera rig. Transition Kit Camera-Dolly family is catalog (Phase 14).",
    examples: [
      "EVT_CAM_DOLLY_IN — catalog",
      "EVT_ZOOM_TARGET — planTargetZoom math exists; JSX apply later",
      "EVT_CAM_PUSH_SOFT"
    ],
    native: "core/transitions/target.js + Camera-Dolly catalog IDs.",
    thirdParty: "No paid camera-rig plugins. No Motion Bro camera packs in git."
  }
];

const SUPPORT = [
  {
    dir: "Engine",
    body: `# Engine

Reserved for P1+ native generators that emit Transition Kit–compatible plans (JSON), then JSX apply.

P0: empty on purpose. Do not drop vendor plugins, \`.aex\`, or \`.jsxbin\` here.

Source of truth for transition numbers remains \`core/transitions/\` in Motion OS. This folder will *call* those IDs later, not fork them.
`
  },
  {
    dir: "Presets",
    body: `# Presets

Reserved for Evotechly-authored preset JSON (not After Effects \`.ffx\`).

P0: no binaries. AE cannot apply \`.ffx\` in CI. Vendor presets stay on vendor machines.
`
  },
  {
    dir: "Scripts",
    body: `# Scripts

Reserved for future Evotechly-authored helper JSX that *installs or maps* this pack onto the Evotechly Transitions panel.

P0: no scripts that download third-party packs. Kit Hub already copies official URLs only (\`core/kitHub.js\`).
`
  },
  {
    dir: "Metadata",
    body: `# Metadata

- \`asset-registry.json\` — pack registry (schema + native stubs + optional Lucide rows)
- \`asset-registry.schema.json\` — JSON Schema for CI

Transition Kit catalog stays at \`transitions/Metadata/catalog.json\`. This registry *points at* those IDs; it does not replace them.
`
  },
  {
    dir: "Previews",
    body: `# Previews

Reserved for stills / MP4s of **Evotechly-native** assets once they exist.

P0: empty. Do not commit vendor pack preview reels (copyright + false “we own this” signal).
`
  },
  {
    dir: "Licenses",
    body: `# Licenses

Pointer folder.

- Evotechly Motion OS: repo root \`LICENSE\` (MIT)
- Vendored Lucide: \`../ThirdParty/lucide/LICENSE\` (ISC + Feather MIT)
- Every other third-party license lives with the editor’s official download — record the URL in \`../SOURCES.md\`, do not invent a LICENSE file for files we did not fetch

Never rewrite a vendor EULA as Evotechly-owned.
`
  },
  {
    dir: "Sources",
    body: `# Sources

Research notes and official URL snapshots belong in \`../SOURCES.md\`.

This folder is reserved for *provenance notes* of files we actually fetched (date, URL, license hash). P0 Lucide provenance: \`../ThirdParty/lucide/SOURCES.md\`.
`
  },
  {
    dir: "Documentation",
    body: `# Documentation

- [INSTALL.md](INSTALL.md) — macOS / Windows paths, Transitions panel, ThirdParty policy
- Pack legal: [../SOURCES.md](../SOURCES.md), [../MANUAL-DOWNLOADS.md](../MANUAL-DOWNLOADS.md), [../ASSET-AUDIT.md](../ASSET-AUDIT.md)
- Motion OS pointer: [../../docs/SAAS_ASSETS_P0.md](../../docs/SAAS_ASSETS_P0.md)
`
  }
];

function writeFile(rel, contents) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
}

function numberedReadme(f) {
  return `# ${f.title} (\`${f.dir}\`)

${f.intent}

## Intended contents (P0 = docs only)

Nothing binary ships in this folder in P0. P1 fills **EvotechlyNative** generators and optional editor-local ThirdParty installs.

## EVT_ naming examples

${f.examples.map((e) => `- \`${e.split(" — ")[0]}\` — ${e.includes(" — ") ? e.split(" — ").slice(1).join(" — ") : "planned"}`).join("\n")}

## Native path

${f.native}

## Third-party path

${f.thirdParty}

## Registry

Add a row to \`../Metadata/asset-registry.json\` before claiming an asset exists. \`downloaded: true\` is allowed only after a real fetch + license verification.

See [../SOURCES.md](../SOURCES.md) and [../ASSET-AUDIT.md](../ASSET-AUDIT.md).
`;
}

FOLDERS.forEach(function (f) {
  writeFile(path.join(f.dir, "README.md"), numberedReadme(f));
});

SUPPORT.forEach(function (s) {
  writeFile(path.join(s.dir, "README.md"), s.body);
});

console.log("scaffolded", FOLDERS.length, "numbered folders +", SUPPORT.length, "support folders under", ROOT);
