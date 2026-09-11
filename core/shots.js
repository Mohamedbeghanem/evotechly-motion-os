"use strict";

/**
 * Shot taxonomy + timing hints.
 * SaaS family does not change Hero + stripe defaults (hints are 1 / no-op).
 * Reel family is additive. Timing is 9:16-safe (no 16:9-only math).
 */

const SHOTS = {
  hero: {
    id: "hero",
    label: "Hero",
    family: "saas",
    hints: { hold: 0, cardStagger: 1, screenshotZoom: 1 }
  },
  featureRow: {
    id: "featureRow",
    label: "Feature row",
    family: "saas",
    hints: { hold: 0.2, cardStagger: 1.15, screenshotZoom: 1 }
  },
  pricing: {
    id: "pricing",
    label: "Pricing",
    family: "saas",
    hints: { hold: 0.24, cardStagger: 1.2, screenshotZoom: 1 }
  },
  dashboardTour: {
    id: "dashboardTour",
    label: "Dashboard tour",
    family: "saas",
    hints: { hold: 0.36, cardStagger: 1, screenshotZoom: 1.08 }
  },
  logoLockup: {
    id: "logoLockup",
    label: "Logo lockup",
    family: "saas",
    hints: { hold: 0.2, lockup: true }
  },
  uiScreen: {
    id: "uiScreen",
    label: "UI screen",
    family: "saas",
    hints: { hold: 0.18, cardStagger: 1, screenshotZoom: 1.04 }
  },
  hook: {
    id: "hook",
    label: "Hook",
    family: "reel",
    hints: { hold: 0.12, slam: true, durationScale: 0.55 }
  },
  kineticType: {
    id: "kineticType",
    label: "Kinetic type",
    family: "reel",
    hints: { hold: 0.1, typeStagger: 0.07 }
  },
  uiPunchIn: {
    id: "uiPunchIn",
    label: "UI punch-in",
    family: "reel",
    hints: { hold: 0.22, screenshotZoom: 1.12, safe: "9:16" }
  },
  logoSting: {
    id: "logoSting",
    label: "Logo sting",
    family: "reel",
    hints: { hold: 0.28, lockup: true }
  },
  captions: {
    id: "captions",
    label: "Captions",
    family: "reel",
    hints: { hold: 0.4, captionStagger: 0.1 }
  }
};

const SHOT_ORDER = [
  "hero",
  "featureRow",
  "pricing",
  "dashboardTour",
  "logoLockup",
  "uiScreen",
  "hook",
  "kineticType",
  "uiPunchIn",
  "logoSting",
  "captions"
];

const SAAS_SHOTS = SHOT_ORDER.slice(0, 6);
const REEL_SHOTS = SHOT_ORDER.slice(6);

function getShot(id) {
  return SHOTS[id] || SHOTS.hero;
}

function normalizeShot(id) {
  if (id && SHOTS[id]) return id;
  return "hero";
}

function round4(n) {
  return Math.round(n * 10000) / 10000;
}

function applyShot(plan, shotId) {
  const shot = getShot(shotId);
  const hints = shot.hints || {};
  if (!plan || !plan.length) {
    return { applied: false, id: shot.id, family: shot.family, hints: hints };
  }

  if (hints.cardStagger && hints.cardStagger !== 1) {
    const cards = [];
    for (let i = 0; i < plan.length; i++) {
      if (plan[i].role === "card") cards.push(plan[i]);
    }
    if (cards.length > 1) {
      const base = cards[0].delay;
      const step = round4((cards[1].delay - cards[0].delay) * hints.cardStagger);
      for (let c = 1; c < cards.length; c++) {
        cards[c].delay = round4(base + step * c);
      }
    }
  }

  if (hints.screenshotZoom && hints.screenshotZoom !== 1) {
    for (let j = 0; j < plan.length; j++) {
      const p = plan[j];
      if (p.role === "screenshot" || p.role === "dashboard" || p.role === "image") {
        if (p.animation && p.animation.from) {
          p.animation.from.scale = hints.screenshotZoom;
        }
      }
    }
  }

  if (shot.id === "hook") {
    const scale = hints.durationScale || 0.55;
    for (let h = 0; h < plan.length; h++) {
      const p = plan[h];
      p.delay = round4(p.delay * 0.35);
      if (p.animation) {
        p.animation.duration = round4((p.animation.duration || 0.4) * scale);
        if (p.role === "title" || p.role === "eyebrow") {
          p.preset = "hookSlam";
          if (p.animation.from) {
            p.animation.from.y = 22;
            p.animation.from.scale = 0.86;
          }
        }
      }
    }
  }

  if (shot.id === "kineticType") {
    const types = [];
    for (let k = 0; k < plan.length; k++) {
      const role = plan[k].role;
      if (role === "eyebrow" || role === "title" || role === "subtitle" || role === "caption") {
        types.push(plan[k]);
      }
    }
    const step = hints.typeStagger || 0.07;
    for (let t = 0; t < types.length; t++) {
      types[t].delay = round4(0.02 + t * step);
      if (types[t].animation) {
        types[t].animation.duration = round4(Math.min(types[t].animation.duration || 0.4, 0.36));
        types[t].preset = types[t].preset === "hookSlam" ? types[t].preset : "typeBuild";
      }
    }
  }

  if (shot.id === "uiPunchIn") {
    for (let u = 0; u < plan.length; u++) {
      const p = plan[u];
      if (p.role === "screenshot" || p.role === "dashboard" || p.role === "image") {
        p.preset = "punchIn";
        p.delay = 0.04;
        if (p.animation && p.animation.from) {
          p.animation.from.scale = hints.screenshotZoom || 1.12;
          p.animation.duration = round4(Math.max(p.animation.duration || 0.6, 0.62));
        }
      } else if (p.role === "title" || p.role === "caption" || p.role === "eyebrow") {
        p.delay = round4(Math.min(p.delay, 0.08));
      }
    }
  }

  if (shot.id === "captions") {
    const caps = [];
    for (let n = 0; n < plan.length; n++) {
      if (plan[n].role === "caption" || plan[n].role === "subtitle" || plan[n].role === "title") {
        caps.push(plan[n]);
      }
    }
    const capStep = hints.captionStagger || 0.1;
    for (let x = 0; x < caps.length; x++) {
      caps[x].delay = round4(0.04 + x * capStep);
      caps[x].preset = "captionIn";
      if (caps[x].animation) caps[x].animation.duration = 0.28;
    }
  }

  if (shot.family === "reel" && hints.hold) {
    for (let r = 0; r < plan.length; r++) {
      if (plan[r].animation && plan[r].animation.out) {
        plan[r].animation.hold = hints.hold;
      }
    }
  }

  return { applied: true, id: shot.id, family: shot.family, hints: hints };
}

module.exports = {
  SHOTS,
  SHOT_ORDER,
  SAAS_SHOTS,
  REEL_SHOTS,
  getShot,
  normalizeShot,
  applyShot
};
