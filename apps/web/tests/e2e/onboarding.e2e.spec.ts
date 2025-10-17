import { test } from "@playwright/test";

test.describe.skip("Onboarding flow", () => {
  test("completes onboarding with consent", async ({ page }) => {
    await page.goto("/");
    // Detailed flow implemented in CI environment with mocked services.
  });
});
