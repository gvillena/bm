import type { PresenceController } from "../presence/controller.js";
import type { RuntimeCtx, RuntimeSignal, UiDirectives } from "../presence/types.js";

export interface RawRuntimeEvent {
  type: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export type RuntimeEventHandler = (directives: UiDirectives | null, signal: RuntimeSignal) => void;

export function mapRuntimeEvent(event: RawRuntimeEvent): RuntimeSignal | null {
  const { type, payload, timestamp } = event;
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return null;
  }
  const asRecord = payload as Record<string, unknown>;
  const nodePayload = asRecord.node as { id?: string } | undefined;
  switch (type) {
    case "willEnter":
    case "didEnter":
    case "willExit":
    case "didExit": {
      const nodeId = String(asRecord.nodeId ?? nodePayload?.id ?? "");
      if (!nodeId) {
        return null;
      }
      return {
        type,
        payload: { nodeId },
        timestamp
      };
    }
    case "guard": {
      const guardPayload = asRecord.guard as { id?: string } | undefined;
      const nodeId = String(asRecord.nodeId ?? nodePayload?.id ?? "");
      const guardId = String(asRecord.guardId ?? guardPayload?.id ?? "");
      const outcome = asRecord.outcome === "deny" || asRecord.outcome === "redact" ? (asRecord.outcome as "deny" | "redact") : "permit";
      if (!nodeId || !guardId) {
        return null;
      }
      return {
        type,
        payload: { nodeId, guardId, outcome },
        timestamp
      };
    }
    case "action": {
      const actionPayload = asRecord.action as { name?: string } | undefined;
      const nodeId = String(asRecord.nodeId ?? nodePayload?.id ?? "");
      const actionName = String(asRecord.actionName ?? actionPayload?.name ?? "");
      if (!nodeId || !actionName) {
        return null;
      }
      const result = asRecord.result === "rejected" ? "rejected" : asRecord.result === "completed" ? "completed" : undefined;
      return {
        type,
        payload: { nodeId, actionName, result },
        timestamp
      };
    }
    case "error": {
      const nodeId = asRecord.nodeId ? String(asRecord.nodeId) : undefined;
      const error = asRecord.error instanceof Error ? asRecord.error : new Error(String(asRecord.error ?? "Runtime error"));
      return {
        type,
        payload: { nodeId, error },
        timestamp
      };
    }
    default:
      return null;
  }
}

export function createRuntimeAdapter(
  controller: PresenceController,
  handler?: RuntimeEventHandler
): (event: RawRuntimeEvent, ctx: RuntimeCtx) => UiDirectives | null {
  return (event, ctx) => {
    const signal = mapRuntimeEvent(event);
    if (!signal) {
      return null;
    }
    const directives = controller.onRuntimeEvent(signal, ctx);
    if (handler) {
      handler(directives, signal);
    }
    return directives;
  };
}
