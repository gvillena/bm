import type { PolicyReason } from "../integration/policies.adapter.js";

export interface RuntimeContext {
  viewerContext: unknown;
  policySnapshotId?: string;
  featureFlags?: Record<string, boolean>;
  now: () => number;
}

export interface RuntimeState {
  readonly graphId: string;
  readonly currentNodeId: string;
  readonly startedAt: number;
  readonly updatedAt: number;
  readonly data: Record<string, unknown>;
  readonly history: TransitionRecord[];
  readonly sequence: number;
  readonly lastUi?: unknown;
}

export interface TransitionRecord {
  readonly from: string;
  readonly to: string;
  readonly at: number;
  readonly reasons?: PolicyReason[];
  readonly auditIds?: string[];
}

export const createInitialState = (graphId: string, startNodeId: string, now: number): RuntimeState => ({
  graphId,
  currentNodeId: startNodeId,
  startedAt: now,
  updatedAt: now,
  data: {},
  history: [],
  sequence: 0,
});

export const updateState = (
  state: RuntimeState,
  updates: Partial<Omit<RuntimeState, "graphId" | "startedAt" | "history">> & { history?: TransitionRecord[] }
): RuntimeState => ({
  ...state,
  ...updates,
  history: updates.history ?? state.history,
});
