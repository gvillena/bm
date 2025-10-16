import type { UiAction, UiDirectives } from "../presence/types.js";

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_PATTERN = /\+?\d[\d\s().-]{6,}/g;
const MAX_HINTS = 3;

function redact(text: string): string {
  return text
    .replace(EMAIL_PATTERN, "[correo oculto]")
    .replace(PHONE_PATTERN, "[contacto oculto]");
}

function sanitizeHints(hints: string[] | undefined): string[] | undefined {
  if (!hints || hints.length === 0) {
    return undefined;
  }
  const seen = new Set<string>();
  const sanitized: string[] = [];
  for (const hint of hints) {
    const clean = redact(hint).trim();
    if (clean.length === 0) {
      continue;
    }
    const key = clean.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    sanitized.push(clean);
    if (sanitized.length >= MAX_HINTS) {
      break;
    }
  }
  return sanitized.length > 0 ? sanitized : undefined;
}

function sanitizeActions(actions: UiAction[] | undefined): UiAction[] | undefined {
  if (!actions || actions.length === 0) {
    return undefined;
  }
  const sanitized: UiAction[] = [];
  const seen = new Set<string>();
  for (const action of actions) {
    const label = redact(action.label).trim();
    if (label.length === 0) {
      continue;
    }
    const key = `${label}|${action.actionRef.name}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    sanitized.push({ ...action, label });
  }
  return sanitized.length > 0 ? sanitized : undefined;
}

export function filterDirectives(directives: UiDirectives): UiDirectives {
  const hints = sanitizeHints(directives.hints);
  const actions = sanitizeActions(directives.actions);
  const explain = directives.explain ? redact(directives.explain).trim() : undefined;
  return {
    ...directives,
    hints,
    actions,
    explain: explain && explain.length > 0 ? explain : undefined
  };
}
