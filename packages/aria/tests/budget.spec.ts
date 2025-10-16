import { PresenceBudget } from "../src/presence/budget.js";

const NOW = 1000;

describe("PresenceBudget", () => {
  it("applies backoff after dismiss and recovers", () => {
    const budget = new PresenceBudget({ perMinute: 5, perNode: 3, backoffMs: 5_000 });
    expect(budget.canShow(NOW, "node-1")).toBe(true);
    budget.recordShown(NOW, "node-1");
    budget.recordDismiss(NOW, "node-1");

    expect(budget.canShow(NOW + 1000, "node-1")).toBe(false);
    expect(budget.canShow(NOW + 6_000, "node-1")).toBe(true);
  });
});
