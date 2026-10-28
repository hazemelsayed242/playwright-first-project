import { expect, test } from "@playwright/test";

test("to be hidden", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/dynamic_loading/1");
  await expect(page.locator('[id="finish"]')).toBeHidden();
  await page.close();
});
