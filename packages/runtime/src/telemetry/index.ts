import type { GuardRef, SceneNode } from "../graph/types.js";
import type { RuntimeState, TransitionRecord } from "../state/runtimeState.js";
import type { PolicyReason } from "../integration/policies.adapter.js";

export interface Telemetry {
  readonly onTransition?: (input: { record: TransitionRecord; state: RuntimeState }) => void;
  readonly onGuard?: (input: {
    node: SceneNode;
    guard: GuardRef;
    outcome: "permit" | "deny" | "redact";
    reasons?: PolicyReason[];
  }) => void;
  readonly onAction?: (input: { action: string; durationMs: number }) => void;
  readonly onError?: (input: { error: Error }) => void;
}

export class ConsoleTelemetry implements Telemetry {
  onTransition(input: { record: TransitionRecord; state: RuntimeState }): void {
    console.info("runtime.transition", input);
  }

  onGuard(input: { node: SceneNode; guard: GuardRef; outcome: "permit" | "deny" | "redact" }): void {
    console.info("runtime.guard", input);
  }

  onAction(input: { action: string; durationMs: number }): void {
    console.info("runtime.action", input);
  }

  onError(input: { error: Error }): void {
    console.error("runtime.error", input);
  }
}
