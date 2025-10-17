import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CinematicLayout } from "@app/CinematicLayout";

vi.mock("@motion/gsap-orchestrator", () => ({
  enterScene: vi.fn(() => vi.fn()),
  exitScene: vi.fn()
}));

describe("CinematicLayout", () => {
  it("renders children with cinematic background", () => {
    render(
      <CinematicLayout prefersReducedMotion={false}>
        <p>content</p>
      </CinematicLayout>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
