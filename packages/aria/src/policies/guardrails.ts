import type { UiDirectives, Tone } from "../presence/types.js";

export interface GuardrailContext {
  policySnapshotId?: string;
  nodeId?: string;
  graphId?: string;
}

export interface GuardrailTrigger {
  code: string;
  detail?: string;
}

export interface GuardrailResult {
  directives: UiDirectives;
  triggers: GuardrailTrigger[];
}

export interface Guardrails {
  apply(directives: UiDirectives, context: GuardrailContext): GuardrailResult;
}

const ANTHROPOMORPHIC_TERMS = ["siento", "siento que", "entiendo", "entiendo que", "pienso", "creo"];
const PROMISE_TERMS = [/garantizo/gi, /aseguro/gi];
const MAX_LENGTH = 280;

function replaceAnthropomorphic(text: string): string {
  let updated = text;
  for (const term of ANTHROPOMORPHIC_TERMS) {
    const pattern = new RegExp(`\\b${term}\\b`, "gi");
    updated = updated.replace(pattern, "puedo sugerir");
  }
  return updated;
}

function softenPromises(text: string): string {
  let updated = text;
  for (const pattern of PROMISE_TERMS) {
    updated = updated.replace(pattern, "podemos explorar la posibilidad");
  }
  return updated;
}

function limitLength(text: string): string {
  if (text.length <= MAX_LENGTH) {
    return text;
  }
  return `${text.slice(0, MAX_LENGTH - 1).trimEnd()}…`;
}

function ensureTransparency(directives: UiDirectives): UiDirectives {
  if (!directives.explain) {
    return {
      ...directives,
      explain: "Soy ARIA, una guía que sugiere pasos y recursos. La decisión final siempre es tuya."
    };
  }
  return directives;
}

function sanitizeTone(tone: Tone | undefined, context: GuardrailContext): Tone | undefined {
  if (!tone) {
    return tone;
  }
  if (tone === "protective" && !context.nodeId) {
    return "direct";
  }
  return tone;
}

function sanitizeCopy(texts: string[] | undefined): string[] | undefined {
  if (!texts) {
    return undefined;
  }
  const result = texts.map((text) => limitLength(softenPromises(replaceAnthropomorphic(text)))).filter((text) => text.length > 0);
  return result.length > 0 ? result : undefined;
}

function sanitizeExplain(text: string | undefined): string | undefined {
  if (!text) {
    return text;
  }
  return limitLength(softenPromises(replaceAnthropomorphic(text)));
}

export const defaultGuardrails: Guardrails = {
  apply(directives: UiDirectives, context: GuardrailContext): GuardrailResult {
    const triggers: GuardrailTrigger[] = [];
    const sanitizedHints = sanitizeCopy(directives.hints);
    if (sanitizedHints && directives.hints && sanitizedHints.join("|") !== directives.hints.join("|")) {
      triggers.push({ code: "rewrite.hints" });
    }
    const sanitizedExplain = sanitizeExplain(directives.explain);
    if (sanitizedExplain !== directives.explain) {
      triggers.push({ code: "rewrite.explain" });
    }
    const sanitizedActions = directives.actions?.map((action) => {
      const label = limitLength(softenPromises(replaceAnthropomorphic(action.label)));
      if (label !== action.label) {
        triggers.push({ code: "rewrite.action.label", detail: action.actionRef.name });
      }
      return { ...action, label };
    });

    const tone = sanitizeTone(directives.tone, context);
    if (tone !== directives.tone) {
      triggers.push({ code: "tone.adjusted" });
    }

    let nextDirectives: UiDirectives = {
      ...directives,
      hints: sanitizedHints,
      explain: sanitizedExplain,
      actions: sanitizedActions,
      tone
    };

    nextDirectives = ensureTransparency(nextDirectives);

    return {
      directives: nextDirectives,
      triggers
    };
  }
};

export type { Guardrails as GuardrailsInterface };
