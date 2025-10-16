export const COPY = {
  explainStep: {
    default:
      "Este paso te ayuda a decidir qué mostrar y a quién. Puedo sugerirte una configuración segura.",
    consentReminder: "Recuerda que puedes ajustar quién ve este momento en cualquier instante."
  },
  consent: {
    needConfirm:
      "Para continuar, necesitamos confirmar el consentimiento. ¿Quieres revisarlo ahora?",
    confirmAction: "Revisar consentimiento"
  },
  coCreate: {
    starter:
      "Podemos bosquejar juntos este momento: define el objetivo y a quién invitarás.",
    structure: "Sugiero definir teaser, acuerdos clave y límites visibles."
  },
  reviewLimits: {
    summary:
      "Tomemos un minuto para revisar límites globales y asegurar que todos los entiendan.",
    checklist: "Repasa visibilidad, requisitos de acceso y cómo pedir ayuda si algo cambia."
  },
  safe: {
    offerPause: "Si te sientes saturado, podemos pausar y retomar cuando estés listo.",
    escalate: "Puedo mostrar recursos de ayuda si lo prefieres.",
    contactHuman: "Contactar a alguien del equipo de apoyo"
  },
  celebrate: {
    gentle: "Buen avance. Puedes reconocer el esfuerzo sin presionarte a más.",
    shareOption: "¿Quieres compartir este progreso con alguien de confianza?"
  },
  guardrails: {
    transparency:
      "Soy ARIA, una guía que sugiere pasos y recursos. La decisión final siempre es tuya.",
    consentOptOut: "Puedes silenciar mis recordatorios cuando lo necesites."
  },
  actions: {
    invite:
      "Enviar invitación",
    requestAccess:
      "Solicitar acceso",
    pause:
      "Pausar ahora",
    resume:
      "Retomar cuando esté listo",
    viewResources:
      "Ver recursos de ayuda"
  }
} as const;

export type CopyNamespace = typeof COPY;
