import type { SceneFlowGraph } from "@bm/runtime";

export const momentGraph: SceneFlowGraph = {
  id: "moment",
  version: "1.0.0",
  start: "draft",
  nodes: {
    draft: {
      id: "draft",
      kind: "form",
      meta: {
        fields: [
          { id: "title", label: "Título", type: "text" },
          { id: "teaser", label: "Avance", type: "textarea" },
          { id: "visibility", label: "Visibilidad", type: "select", options: ["PUBLIC", "CIRCLE"] }
        ]
      },
      transitions: [
        { to: "policies", description: "Evaluar políticas" },
        { to: "save", description: "Guardar" }
      ]
    },
    policies: {
      id: "policies",
      kind: "decision",
      meta: {
        guard: "server-authorize-view-moment"
      },
      transitions: [{ to: "publish", description: "Habilitar" }]
    },
    publish: {
      id: "publish",
      kind: "service",
      meta: {
        action: "publishMoment"
      },
      transitions: [{ to: "complete", description: "Terminar" }]
    },
    save: {
      id: "save",
      kind: "service",
      meta: {
        action: "saveMomentDraft"
      },
      transitions: [{ to: "complete", description: "Finalizar" }]
    },
    complete: {
      id: "complete",
      kind: "view",
      meta: {
        title: "Momento listo",
        description: "Podés compartirlo cuando quieras"
      },
      transitions: []
    }
  }
};
