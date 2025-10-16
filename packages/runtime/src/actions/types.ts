import type { UiDirectives } from "../integration/aria/directives.js";

export interface RuntimeActionRef {
  readonly name: string;
  readonly params?: Record<string, unknown>;
}

export interface RuntimeActionContext {
  readonly action: RuntimeActionRef;
  readonly signal?: AbortSignal;
}

export interface RuntimeActionResult {
  readonly ui?: UiDirectives;
  readonly obligations?: string[];
}

export type RuntimeActionExecutor = (
  context: RuntimeActionContext
) => Promise<RuntimeActionResult | void>;

export interface RuntimeActionRegistry {
  readonly execute: (ref: RuntimeActionRef, signal?: AbortSignal) => Promise<RuntimeActionResult>;
}
