"use strict";

function uiRoles(cardPreset) {
  return {
    modal: { preset: "uiModal", base: 0.2, stagger: 0, durationScale: 1 },
    toast: { preset: "uiToast", base: 0.52, stagger: 0.04, durationScale: 0.9 },
    row: { preset: "uiRow", base: 0.22, stagger: 0.05, durationScale: 1 },
    stack: { preset: "uiStack", base: 0.22, stagger: 0.05, durationScale: 1 },
    cardUi: { preset: cardPreset || "uiCard", base: 0.28, stagger: 0.07, durationScale: 1 }
  };
}

const STYLES = {
  stripe: {
    id: "stripe",
    label: "Stripe / premium SaaS",
    description: "Short travel, expo-out, tight card stagger.",
    gapAfterGroup: 0.12,
    travel: 1,
    hold: 0,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.9 },
      eyebrow: { preset: "fadeUp", base: 0.02, stagger: 0, durationScale: 0.85 },
      title: { preset: "fadeUp", base: 0.06, stagger: 0, durationScale: 1 },
      subtitle: { preset: "fadeUpSoft", base: 0.14, stagger: 0, durationScale: 1 },
      nav: { preset: "uiNav", base: 0.08, stagger: 0.03, durationScale: 0.8 },
      sidebar: { preset: "slideRight", base: 0.12, stagger: 0, durationScale: 1 },
      dashboard: { preset: "slideUp", base: 0.18, stagger: 0, durationScale: 1 },
      screenshot: { preset: "zoomOut", base: 0.16, stagger: 0, durationScale: 1 },
      image: { preset: "zoomOut", base: 0.16, stagger: 0.08, durationScale: 1 },
      card: { preset: "scaleIn", base: 0.28, stagger: 0.07, durationScale: 1 },
      metric: { preset: "slideUp", base: 0.34, stagger: 0.05, durationScale: 0.9 },
      badge: { preset: "pop", base: 0.4, stagger: 0.04, durationScale: 0.8 },
      tooltip: { preset: "fadeUpSoft", base: 0.48, stagger: 0.04, durationScale: 0.75 },
      button: { preset: "scaleIn", base: 0.5, stagger: 0.04, durationScale: 0.84 },
      cta: { preset: "pop", base: null, stagger: 0, durationScale: 0.8, after: "group" },
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 1, after: "cta" },
      modal: { preset: "uiModal", base: 0.2, stagger: 0, durationScale: 1 },
      toast: { preset: "uiToast", base: 0.52, stagger: 0.04, durationScale: 0.9 },
      row: { preset: "uiRow", base: 0.22, stagger: 0.05, durationScale: 1 },
      stack: { preset: "uiStack", base: 0.22, stagger: 0.05, durationScale: 1 },
      caption: { preset: "captionIn", base: 0.1, stagger: 0.08, durationScale: 0.85 }
    }
  },
  linear: {
    id: "linear",
    label: "Linear / product-native",
    description: "Slightly longer settles, quieter scale.",
    gapAfterGroup: 0.1,
    travel: 0.88,
    hold: 0,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.9 },
      eyebrow: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.8 },
      title: { preset: "slideUp", base: 0.04, stagger: 0, durationScale: 0.95 },
      subtitle: { preset: "fadeUpSoft", base: 0.12, stagger: 0, durationScale: 1 },
      nav: { preset: "uiNav", base: 0.06, stagger: 0.03, durationScale: 0.8 },
      sidebar: { preset: "slideRight", base: 0.1, stagger: 0, durationScale: 1 },
      dashboard: { preset: "fadeUp", base: 0.16, stagger: 0, durationScale: 1.1 },
      screenshot: { preset: "zoomOut", base: 0.14, stagger: 0, durationScale: 1.05 },
      image: { preset: "zoomOut", base: 0.14, stagger: 0.08, durationScale: 1 },
      card: { preset: "fadeUp", base: 0.24, stagger: 0.06, durationScale: 1 },
      metric: { preset: "fadeUp", base: 0.3, stagger: 0.05, durationScale: 0.9 },
      badge: { preset: "pop", base: 0.36, stagger: 0.04, durationScale: 0.75 },
      tooltip: { preset: "fadeUpSoft", base: 0.44, stagger: 0.04, durationScale: 0.75 },
      button: { preset: "scaleIn", base: 0.46, stagger: 0.04, durationScale: 0.84 },
      cta: { preset: "scaleIn", base: null, stagger: 0, durationScale: 0.8, after: "group" },
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 1, after: "cta" },
      modal: { preset: "uiModal", base: 0.18, stagger: 0, durationScale: 1 },
      toast: { preset: "uiToast", base: 0.48, stagger: 0.04, durationScale: 0.9 },
      row: { preset: "uiRow", base: 0.2, stagger: 0.05, durationScale: 1 },
      stack: { preset: "uiStack", base: 0.2, stagger: 0.05, durationScale: 1 },
      caption: { preset: "captionIn", base: 0.08, stagger: 0.07, durationScale: 0.85 }
    }
  },
  vercel: {
    id: "vercel",
    label: "Vercel / sharp reveal",
    description: "Faster, less travel, snappier CTA.",
    gapAfterGroup: 0.08,
    travel: 0.72,
    hold: 0,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.75 },
      eyebrow: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.7 },
      title: { preset: "fadeUp", base: 0.04, stagger: 0, durationScale: 0.85 },
      subtitle: { preset: "fadeUpSoft", base: 0.1, stagger: 0, durationScale: 0.9 },
      nav: { preset: "uiNav", base: 0.04, stagger: 0.02, durationScale: 0.7 },
      sidebar: { preset: "slideRight", base: 0.08, stagger: 0, durationScale: 0.85 },
      dashboard: { preset: "scaleIn", base: 0.12, stagger: 0, durationScale: 0.9 },
      screenshot: { preset: "zoomOut", base: 0.1, stagger: 0, durationScale: 0.85 },
      image: { preset: "zoomOut", base: 0.1, stagger: 0.06, durationScale: 0.85 },
      card: { preset: "scaleIn", base: 0.2, stagger: 0.05, durationScale: 0.9 },
      metric: { preset: "slideUp", base: 0.24, stagger: 0.04, durationScale: 0.8 },
      badge: { preset: "pop", base: 0.3, stagger: 0.03, durationScale: 0.7 },
      tooltip: { preset: "fadeUpSoft", base: 0.36, stagger: 0.03, durationScale: 0.7 },
      button: { preset: "pop", base: 0.38, stagger: 0.03, durationScale: 0.75 },
      cta: { preset: "pop", base: null, stagger: 0, durationScale: 0.72, after: "group" },
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 0.9, after: "cta" },
      modal: { preset: "uiModal", base: 0.14, stagger: 0, durationScale: 0.9 },
      toast: { preset: "uiToast", base: 0.4, stagger: 0.03, durationScale: 0.8 },
      row: { preset: "uiRow", base: 0.16, stagger: 0.04, durationScale: 0.9 },
      stack: { preset: "uiStack", base: 0.16, stagger: 0.04, durationScale: 0.9 },
      caption: { preset: "captionIn", base: 0.06, stagger: 0.05, durationScale: 0.75 }
    }
  },
  evotechly: {
    id: "evotechly",
    label: "Evotechly / product-native",
    description: "Quiet product-native: short travel, soft expo, tighter card stagger, CTA settles.",
    gapAfterGroup: 0.16,
    travel: 0.62,
    hold: 0,
    roles: {
      logo: { preset: "fadeUpSoft", base: 0, stagger: 0, durationScale: 0.85 },
      eyebrow: { preset: "fadeUpSoft", base: 0.03, stagger: 0, durationScale: 0.8 },
      title: { preset: "fadeUpSoft", base: 0.08, stagger: 0, durationScale: 0.92 },
      subtitle: { preset: "fadeUpSoft", base: 0.16, stagger: 0, durationScale: 0.95 },
      nav: { preset: "uiNav", base: 0.05, stagger: 0.03, durationScale: 0.8 },
      sidebar: { preset: "slideRight", base: 0.1, stagger: 0, durationScale: 0.9 },
      dashboard: { preset: "uiCard", base: 0.14, stagger: 0, durationScale: 0.95 },
      screenshot: { preset: "zoomOut", base: 0.12, stagger: 0, durationScale: 0.92 },
      image: { preset: "zoomOut", base: 0.12, stagger: 0.06, durationScale: 0.92 },
      card: { preset: "uiCard", base: 0.24, stagger: 0.05, durationScale: 0.95 },
      metric: { preset: "fadeUpSoft", base: 0.3, stagger: 0.04, durationScale: 0.85 },
      badge: { preset: "fadeUpSoft", base: 0.36, stagger: 0.03, durationScale: 0.8 },
      tooltip: { preset: "fadeUpSoft", base: 0.42, stagger: 0.03, durationScale: 0.75 },
      button: { preset: "uiCard", base: 0.46, stagger: 0.03, durationScale: 0.84 },
      cta: { preset: "uiCard", base: null, stagger: 0, durationScale: 0.95, after: "group" },
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 0.95, after: "cta" },
      modal: { preset: "uiModal", base: 0.16, stagger: 0, durationScale: 0.95 },
      toast: { preset: "uiToast", base: 0.48, stagger: 0.03, durationScale: 0.85 },
      row: { preset: "uiRow", base: 0.18, stagger: 0.04, durationScale: 0.95 },
      stack: { preset: "uiStack", base: 0.18, stagger: 0.04, durationScale: 0.95 },
      caption: { preset: "captionIn", base: 0.08, stagger: 0.07, durationScale: 0.85 }
    }
  },
  apple: {
    id: "apple",
    label: "Calm / system",
    description: "Calm pack: tiny travel, long settle, no pop. Hold feels expensive.",
    gapAfterGroup: 0.22,
    travel: 0.38,
    hold: 0.12,
    roles: {
      logo: { preset: "fadeUpCalm", base: 0, stagger: 0, durationScale: 1.05 },
      eyebrow: { preset: "fadeUpCalm", base: 0.06, stagger: 0, durationScale: 1 },
      title: { preset: "fadeUpCalm", base: 0.1, stagger: 0, durationScale: 1.2 },
      subtitle: { preset: "fadeUpCalm", base: 0.2, stagger: 0, durationScale: 1.18 },
      nav: { preset: "uiNav", base: 0.08, stagger: 0.05, durationScale: 1.1 },
      sidebar: { preset: "fadeUpCalm", base: 0.12, stagger: 0, durationScale: 1.15 },
      dashboard: { preset: "fadeUpCalm", base: 0.18, stagger: 0, durationScale: 1.2 },
      screenshot: { preset: "fadeUpCalm", base: 0.16, stagger: 0, durationScale: 1.25 },
      image: { preset: "fadeUpCalm", base: 0.16, stagger: 0.08, durationScale: 1.2 },
      card: { preset: "fadeUpCalm", base: 0.3, stagger: 0.1, durationScale: 1.15 },
      metric: { preset: "fadeUpCalm", base: 0.4, stagger: 0.08, durationScale: 1.1 },
      badge: { preset: "fadeUpSoft", base: 0.48, stagger: 0.06, durationScale: 1 },
      tooltip: { preset: "fadeUpCalm", base: 0.54, stagger: 0.05, durationScale: 0.95 },
      button: { preset: "fadeUpCalm", base: 0.56, stagger: 0.05, durationScale: 1.05 },
      cta: { preset: "fadeUpCalm", base: null, stagger: 0, durationScale: 1.1, after: "group" },
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 1.15, after: "cta" },
      modal: { preset: "uiModal", base: 0.22, stagger: 0, durationScale: 1.2 },
      toast: { preset: "uiToast", base: 0.56, stagger: 0.06, durationScale: 1.1 },
      row: { preset: "uiRow", base: 0.24, stagger: 0.07, durationScale: 1.1 },
      stack: { preset: "uiStack", base: 0.24, stagger: 0.07, durationScale: 1.1 },
      caption: { preset: "captionIn", base: 0.12, stagger: 0.1, durationScale: 1.05 }
    }
  }
};

function getStyle(id) {
  return STYLES[id] || STYLES.stripe;
}

module.exports = { STYLES, getStyle, uiRoles };
