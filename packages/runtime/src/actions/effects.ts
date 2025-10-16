import type { RuntimeActionExecutor, RuntimeActionRef, RuntimeActionResult } from "./types.js";

export interface EffectsAdapter {
  readonly execute: (action: RuntimeActionRef, signal?: AbortSignal) => Promise<RuntimeActionResult>;
}

export class NoopEffectsAdapter implements EffectsAdapter {
  async execute(action: RuntimeActionRef): Promise<RuntimeActionResult> {
    return { ui: { hints: [`${action.name}:noop`] } };
  }
}

export const createExecutor = (adapter?: EffectsAdapter): RuntimeActionExecutor => {
  const effectiveAdapter = adapter ?? new NoopEffectsAdapter();
  return async ({ action, signal }) => effectiveAdapter.execute(action, signal);
};
