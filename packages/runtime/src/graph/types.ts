import type { RuntimeActionRef as RuntimeActionReference } from "../actions/types.js";
import type { GuardExecutionResult } from "../guards/constraints.js";

export type SceneNodeKind = "form" | "view" | "decision" | "service" | "aria";

export type GuardRef = {
  name: string;
  params?: Record<string, unknown>;
};

export type RuntimeActionRef = RuntimeActionReference;

export interface SceneEdge {
  readonly to: string;
  readonly condition?: GuardRef;
  readonly action?: RuntimeActionRef;
  readonly description?: string;
}

export interface SceneNode {
  readonly id: string;
  readonly kind: SceneNodeKind;
  readonly meta?: Record<string, unknown>;
  readonly onEnter?: GuardRef[];
  readonly onExit?: GuardRef[];
  readonly transitions: SceneEdge[];
}

export interface SceneFlowGraph {
  readonly id: string;
  readonly version: string;
  readonly start: string;
  readonly nodes: Record<string, SceneNode>;
}

export interface GuardExecutionContext {
  readonly graph: SceneFlowGraph;
  readonly currentNode: SceneNode;
  readonly edge?: SceneEdge;
  readonly targetNode?: SceneNode;
  readonly params?: Record<string, unknown>;
}

export type GuardEvaluator = (context: GuardExecutionContext) => Promise<GuardExecutionResult>;
