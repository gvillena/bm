import { COPY } from "./system-copy.js";
import type { FormattedPrompt, PromptSlots, PromptTemplate } from "./types.js";

const SLOT_PATTERN = /{(\w+)}/g;

function resolveSlot(slots: PromptSlots | undefined, key: string): string {
  if (!slots || typeof slots[key] === "undefined") {
    return `{${key}}`;
  }
  const value = slots[key];
  return String(value);
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function formatPrompt(template: PromptTemplate, slots?: PromptSlots): FormattedPrompt {
  const text = template.text.replace(SLOT_PATTERN, (_, key: string) => resolveSlot(slots, key));
  return {
    id: template.id,
    text: normalizeWhitespace(text)
  };
}

export function formatCopy(path: readonly string[], slots?: PromptSlots): FormattedPrompt {
  let current: unknown = COPY;
  for (const key of path) {
    if (typeof current !== "object" || current === null || !(key in (current as Record<string, unknown>))) {
      throw new Error(`Copy path not found: ${path.join(".")}`);
    }
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current !== "string") {
    throw new Error(`Copy path must resolve to string: ${path.join(".")}`);
  }
  return {
    id: path.join("."),
    text: normalizeWhitespace(current.replace(SLOT_PATTERN, (_, key: string) => resolveSlot(slots, key)))
  };
}

export function mergePrompts(prompts: FormattedPrompt[]): FormattedPrompt {
  const text = normalizeWhitespace(prompts.map((prompt) => prompt.text).join(" "));
  return {
    id: prompts.map((prompt) => prompt.id).join("+"),
    text
  };
}
