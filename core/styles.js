"use strict";

const STYLES = {
  stripe: {
    id: "stripe",
    label: "Stripe / premium SaaS",
    description: "Short travel, expo-out, tight card stagger.",
    gapAfterGroup: 0.12,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.9 },
      eyebrow: { preset: "fadeUp", base: 0.02, stagger: 0, durationScale: 0.85 },
      title: { preset: "fadeUp", base: 0.06, stagger: 0, durationScale: 1 },
      subtitle: { preset: "fadeUpSoft", base: 0.14, stagger: 0, durationScale: 1 },
      nav: { preset: "fadeUp", base: 0.08, stagger: 0.03, durationScale: 0.8 },
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
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 1, after: "cta" }
    }
  },
  linear: {
    id: "linear",
    label: "Linear / product-native",
    description: "Slightly longer settles, quieter scale.",
    gapAfterGroup: 0.1,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.9 },
      eyebrow: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.8 },
      title: { preset: "slideUp", base: 0.04, stagger: 0, durationScale: 0.95 },
      subtitle: { preset: "fadeUpSoft", base: 0.12, stagger: 0, durationScale: 1 },
      nav: { preset: "fadeUp", base: 0.06, stagger: 0.03, durationScale: 0.8 },
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
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 1, after: "cta" }
    }
  },
  vercel: {
    id: "vercel",
    label: "Vercel / sharp reveal",
    description: "Faster, less travel, snappier CTA.",
    gapAfterGroup: 0.08,
    roles: {
      logo: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.75 },
      eyebrow: { preset: "fadeUp", base: 0, stagger: 0, durationScale: 0.7 },
      title: { preset: "fadeUp", base: 0.04, stagger: 0, durationScale: 0.85 },
      subtitle: { preset: "fadeUpSoft", base: 0.1, stagger: 0, durationScale: 0.9 },
      nav: { preset: "fadeUp", base: 0.04, stagger: 0.02, durationScale: 0.7 },
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
      cursor: { preset: "cursorIn", base: null, stagger: 0, durationScale: 0.9, after: "cta" }
    }
  }
};

function getStyle(id) {
  return STYLES[id] || STYLES.stripe;
}

module.exports = { STYLES, getStyle };
