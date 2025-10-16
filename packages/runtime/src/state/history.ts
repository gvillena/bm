import type { TransitionRecord } from "./runtimeState.js";

export const appendRecord = (
  history: readonly TransitionRecord[],
  record: TransitionRecord
): TransitionRecord[] => [...history, record];

export const lastRecord = (history: readonly TransitionRecord[]): TransitionRecord | undefined =>
  history[history.length - 1];
