import type { SceneFlowGraph } from "@bm/runtime";

export const onboardingGraph: SceneFlowGraph = {
  id: "onboarding",
  version: "1.0.0",
  start: "welcome",
  nodes: {
    welcome: {
      id: "welcome",
      kind: "view",
      meta: {
        title: "Bienvenida",
        description: "Introducción a la experiencia de Beneficio Mutuo"
      },
      transitions: [{ to: "consent", description: "Continuar" }]
    },
    consent: {
      id: "consent",
      kind: "form",
      meta: {
        fields: [
          { id: "scope", label: "Alcance", type: "textarea" },
          { id: "allowSharing", label: "Permitir compartir insights", type: "checkbox" }
        ]
      },
      transitions: [{ to: "profile", description: "Aceptar" }]
    },
    profile: {
      id: "profile",
      kind: "form",
      meta: {
        fields: [
          { id: "displayName", label: "Nombre visible", type: "text" },
          { id: "pronouns", label: "Pronombres", type: "text" },
          { id: "intent", label: "Intención", type: "textarea" }
        ]
      },
      transitions: [{ to: "summary", description: "Guardar" }]
    },
    summary: {
      id: "summary",
      kind: "view",
      meta: {
        title: "Listo",
        description: "Tu onboarding está completo."
      },
      transitions: [{ to: "complete", description: "Finalizar" }]
    },
    complete: {
      id: "complete",
      kind: "decision",
      meta: {
        message: "Persistiendo preferencias"
      },
      transitions: []
    }
  }
};
