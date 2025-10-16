import type { SceneFlowGraph } from "./types.js";

export const OnboardingGraph: SceneFlowGraph = {
  id: "onboarding",
  version: "1.0.0",
  start: "profile",
  nodes: {
    profile: {
      id: "profile",
      kind: "form",
      transitions: [{ to: "moment", description: "Continuar" }],
    },
    moment: {
      id: "moment",
      kind: "form",
      onEnter: [{ name: "guardNodeAccess", params: { resource: "momentDraft" } }],
      transitions: [
        { to: "visibility" },
        { to: "profile", description: "Atrás" },
      ],
    },
    visibility: {
      id: "visibility",
      kind: "decision",
      transitions: [{ to: "consent" }],
    },
    consent: {
      id: "consent",
      kind: "service",
      onEnter: [{ name: "guardActionPolicy", params: { action: "confirmConsent" } }],
      transitions: [{ to: "review" }],
    },
    review: {
      id: "review",
      kind: "aria",
      transitions: [],
    },
  },
};

export const GraphRegistry = {
  onboarding: OnboardingGraph,
} as const;
