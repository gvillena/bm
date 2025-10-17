import "@testing-library/jest-dom/vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SceneRenderer } from "../src/components/runtime/SceneRenderer.js";
function createEngine(nodes, startId) {
    let currentId = startId;
    const state = { currentNodeId: startId };
    const engine = {
        currentNode: () => nodes[currentId],
        transition: async (to) => {
            currentId = to;
            state.currentNodeId = to;
            return { ok: true, state, ui: null };
        },
        next: async () => {
            const node = nodes[currentId];
            const edge = node.transitions[0];
            return engine.transition(edge?.to ?? currentId);
        },
        getState: () => state
    };
    return engine;
}
describe("SceneRenderer", () => {
    test("advances on action", async () => {
        const nodes = {
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
        };
        const engine = createEngine(nodes, "start");
        render(engine, { engine } /  > );
        expect(screen.getByText(/start/i)).toBeInTheDocument();
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Continue" }));
        });
        expect(screen.getByText(/next/i)).toBeInTheDocument();
    });
});
