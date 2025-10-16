import type { GuardRef, SceneNode } from "../graph/types.js";
import type { RuntimeState, TransitionRecord } from "../state/runtimeState.js";

export type RuntimeEventType =
  | "willExit"
  | "didExit"
  | "willEnter"
  | "didEnter"
  | "guard"
  | "transition"
  | "error";

export interface RuntimeEventBase<T extends RuntimeEventType, P> {
  readonly type: T;
  readonly payload: P;
  readonly timestamp: number;
}

export type GuardEventPayload = {
  readonly node: SceneNode;
  readonly guard: GuardRef;
  readonly outcome: "permit" | "deny" | "redact";
};

export type TransitionEventPayload = {
  readonly record: TransitionRecord;
  readonly state: RuntimeState;
};

export type RuntimeEvent =
  | RuntimeEventBase<"willExit", { node: SceneNode }>
  | RuntimeEventBase<"didExit", { node: SceneNode }>
  | RuntimeEventBase<"willEnter", { node: SceneNode }>
  | RuntimeEventBase<"didEnter", { node: SceneNode }>
  | RuntimeEventBase<"guard", GuardEventPayload>
  | RuntimeEventBase<"transition", TransitionEventPayload>
  | RuntimeEventBase<"error", { error: Error }>;
