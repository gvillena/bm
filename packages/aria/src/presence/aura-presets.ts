import type { AuraPreset, Tone, UiDirectives } from "./types.js";

export interface AuraPresetDefinition {
  id: AuraPreset;
  label: string;
  defaultTone: Tone;
  onboardingCopy: string;
  defaultDirectives?: Pick<UiDirectives, "hints" | "tone">;
  emphasis: "consent" | "clarity" | "protection";
}

export const AURA_PRESETS: Record<AuraPreset, AuraPresetDefinition> = {
  calm: {
    id: "calm",
    label: "Presencia serena",
    defaultTone: "warm",
    onboardingCopy:
      "Te acompañaré con calma, recordándote pausas y opciones sin presionarte.",
    defaultDirectives: {
      tone: "warm",
      hints: ["Puedes avanzar a tu propio ritmo."]
    },
    emphasis: "consent"
  },
  clear: {
    id: "clear",
    label: "Presencia clara",
    defaultTone: "neutral",
    onboardingCopy:
      "Ofrezco señales precisas y transparentes para que tomes decisiones informadas.",
    defaultDirectives: {
      tone: "neutral",
      hints: ["Haré visibles los siguientes pasos y motivos clave."]
    },
    emphasis: "clarity"
  },
  protective: {
    id: "protective",
    label: "Presencia protectora",
    defaultTone: "protective",
    onboardingCopy:
      "Priorizaré tu seguridad y consentimiento, avisándote cuando algo requiera atención.",
    defaultDirectives: {
      tone: "protective",
      hints: ["Si algo se siente sensible podemos pausar al instante."]
    },
    emphasis: "protection"
  }
};

export function getAuraPreset(preset: AuraPreset): AuraPresetDefinition {
  return AURA_PRESETS[preset];
}
