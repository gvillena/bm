import type { SceneFlowGraph } from "@bm/runtime";

export const safeGraph: SceneFlowGraph = {
  id: "safe",
  version: "1.0.0",
  start: "pause",
  nodes: {
    pause: {
      id: "pause",
      kind: "view",
      meta: {
        title: "Modo contención",
        description: "Podés pausar todas las recomendaciones y comunicaciones."
      },
      transitions: [{ to: "resources", description: "Ver recursos" }]
    },
    resources: {
      id: "resources",
      kind: "view",
      meta: {
        title: "Recursos",
        description: "Encuentros, lecturas y contactos de apoyo"
      },
      transitions: [{ to: "complete", description: "Salir" }]
    },
    complete: {
      id: "complete",
      kind: "decision",
      transitions: []
    }
  }
};
