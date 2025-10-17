import type { SceneFlowGraph } from "@bm/runtime";

export const agreementOfferGraph: SceneFlowGraph = {
  id: "agreementOffer",
  version: "1.0.0",
  start: "intro",
  nodes: {
    intro: {
      id: "intro",
      kind: "view",
      meta: {
        title: "Revisión de acuerdo",
        description: "Preparate para un repaso compartido del acuerdo."
      },
      transitions: [{ to: "diff", description: "Revisar" }]
    },
    diff: {
      id: "diff",
      kind: "aria",
      meta: {
        immersive: true
      },
      transitions: [{ to: "decision", description: "Continuar" }]
    },
    decision: {
      id: "decision",
      kind: "decision",
      meta: {
        guard: "server-authorize-agreement"
      },
      transitions: [{ to: "complete", description: "Cerrar" }]
    },
    complete: {
      id: "complete",
      kind: "view",
      meta: {
        title: "Acuerdo revisado",
        description: "Quedó registro de los compromisos"
      },
      transitions: []
    }
  }
};
