import type { SceneEdge, SceneFlowGraph, SceneNode } from "./types.js";

class GraphValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphValidationError";
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const ensureString = (value: unknown, message: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new GraphValidationError(message);
  }
  return value;
};

const ensureOptionalGuardArray = (value: unknown, message: string) => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new GraphValidationError(message);
  }
  value.forEach(validateGuardRef);
  return value as { name: string; params?: Record<string, unknown> }[];
};

const validateGuardRef = (guard: unknown) => {
  if (!isRecord(guard) || typeof guard.name !== "string") {
    throw new GraphValidationError("Guard must include a name");
  }
};

const parseGuardRef = (guard: unknown) => {
  if (guard === undefined) return undefined;
  validateGuardRef(guard);
  return guard as { name: string; params?: Record<string, unknown> };
};

const parseEdge = (edge: unknown): SceneEdge => {
  if (!isRecord(edge)) {
    throw new GraphValidationError("Edge must be an object");
  }
  const to = ensureString(edge.to, "Edge requires `to`");
  const condition = parseGuardRef(edge.condition);
  return {
    to,
    condition,
    action: edge.action as SceneEdge["action"],
    description: typeof edge.description === "string" ? edge.description : undefined,
  };
};

const parseNode = (node: unknown): SceneNode => {
  if (!isRecord(node)) {
    throw new GraphValidationError("Node must be an object");
  }
  const id = ensureString(node.id, "Node requires id");
  const kind = ensureString(node.kind, "Node requires kind");
  if (!["form", "view", "decision", "service", "aria"].includes(kind)) {
    throw new GraphValidationError(`Invalid node kind: ${kind}`);
  }
  const transitionsRaw = Array.isArray(node.transitions) ? node.transitions : undefined;
  if (!transitionsRaw) {
    throw new GraphValidationError(`Node ${id} must declare transitions array`);
  }
  return {
    id,
    kind: kind as SceneNode["kind"],
    meta: isRecord(node.meta) ? (node.meta as Record<string, unknown>) : undefined,
    onEnter: ensureOptionalGuardArray(node.onEnter, "onEnter must be guard array"),
    onExit: ensureOptionalGuardArray(node.onExit, "onExit must be guard array"),
    transitions: transitionsRaw.map(parseEdge),
  };
};

export const validateGraph = (graph: unknown): SceneFlowGraph => {
  if (!isRecord(graph)) {
    throw new GraphValidationError("Graph must be an object");
  }

  const id = ensureString(graph.id, "Graph requires id");
  const version = ensureString(graph.version, "Graph requires version");
  const start = ensureString(graph.start, "Graph requires start node");

  if (!isRecord(graph.nodes)) {
    throw new GraphValidationError("Graph nodes must be an object");
  }

  const nodes: Record<string, SceneNode> = {};
  for (const [key, value] of Object.entries(graph.nodes)) {
    nodes[key] = parseNode(value);
  }

  if (!nodes[start]) {
    throw new GraphValidationError(`Start node ${start} is not defined in nodes`);
  }

  return { id, version, start, nodes };
};
