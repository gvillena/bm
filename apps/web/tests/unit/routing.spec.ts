import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { createAppRouter } from "@app/router/routes";

vi.mock("@services/policies", () => ({
  fetchPolicySnapshot: vi.fn().mockResolvedValue({ policySnapshotId: "test" }),
  authorizeViewMoment: vi.fn().mockResolvedValue({ decision: "PERMIT" })
}));

vi.mock("@app/router/guards", () => ({
  requireAuthenticatedUser: vi.fn().mockResolvedValue(undefined)
}));

describe("createAppRouter", () => {
  it("registers expected routes", () => {
    const queryClient = new QueryClient();
    const router = createAppRouter({ queryClient });
    const paths = router.routes.map((route) => route.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/onboarding");
    expect(paths).toContain("/moments/:id");
    expect(paths).toContain("/agreements/:id/review");
    expect(paths).toContain("/settings");
  });
});
