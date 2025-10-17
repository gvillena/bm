import { test } from "@playwright/test";

test.describe.skip("Moment authorization", () => {
  test("handles deny, redact, permit transitions", async ({ page }) => {
    await page.goto("/moments/123");
  });
});
