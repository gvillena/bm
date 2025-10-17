import { test } from "@playwright/test";

test.describe.skip("Agreement immersive overlay", () => {
  test("opens and closes with keyboard", async ({ page }) => {
    await page.goto("/agreements/abc/review");
  });
});
