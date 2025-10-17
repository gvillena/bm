import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import type { TransitionResult } from "@bm/runtime";
import type { SceneNode } from "@bm/runtime/graph/types";
import { SceneRenderer } from "../src/components/runtime/SceneRenderer.js";

function createEngine(nodes: Record<string, SceneNode>, startId: string) {
  let currentId = startId;
  const state = { currentNodeId: startId } as any;
  const engine = {
    currentNode: () => nodes[currentId],
    transition: async (to: string): Promise<TransitionResult> => {
      currentId = to;
      state.currentNodeId = to;
      return { ok: true, state, ui: null } as TransitionResult;
    },
    next: async (): Promise<TransitionResult> => {
      const node = nodes[currentId];
      const edge = node.transitions[0];
      return engine.transition(edge?.to ?? currentId);
    },
    getState: () => state
  } as unknown as import("@bm/runtime").ExperienceEngine;
  return engine;
}

describe("SceneRenderer", () => {
  test("advances on action", async () => {
    const nodes: Record<string, SceneNode> = {
      start: {
        id: "start",
        kind: "view",
        transitions: [{ to: "next", description: "Continue" }]
      },
      next: {
        id: "next",
        kind: "view",
        transitions: []
      }
    } as Record<string, SceneNode>;
    const engine = createEngine(nodes, "start");
    render(<SceneRenderer engine={engine} />);
    expect(screen.getByText(/start/i)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    });
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });
});
