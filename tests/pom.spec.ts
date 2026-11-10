import { expect, test } from "../fixtures/fixture";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const baseUrl = process.env.BASE_URL;
const userName = process.env.LOGIN_USERNAME;
const password = process.env.LOGIN_PASSWORD;
if (!baseUrl) {
  throw new Error("Base_URL is missing or empty");
}
if (!userName || !password) {
  throw new Error("Login environment variables are missing or empty");
}

test.describe("Shopping Cart Suite", { tag: "@cart" }, () => {
  test.beforeEach("open start url", async ({ page }) => {
    await page.goto(baseUrl);
  });

  test("user can add a product to the cart", async ({
    page,
    loginPage,
    productPage,
  }) => {
    await loginPage.login(userName, password);
    await loginPage.clickOnLoginButton();
    await expect(page.getByText("Products", { exact: true })).toBeVisible();
    await productPage.clickOnAddToCart();
    await productPage.clickOnShoppingCartButton();
    await expect(
      page.getByText("Sauce Labs Backpack", { exact: true }),
    ).toBeVisible();
  });

  test("user can remove a product from the cart", async ({
    page,
    loginPage,
    productPage,
    cartPage,
  }) => {
    await loginPage.login(userName, password);
    await loginPage.clickOnLoginButton();
    await expect(page.getByText("Products", { exact: true })).toBeVisible();
    await productPage.clickOnAddToCart();
    await productPage.clickOnShoppingCartButton();
    await expect(
      page.getByText("Sauce Labs Backpack", { exact: true }),
    ).toBeVisible();
    await cartPage.clickOnRemoveButton();
    await expect(
      page.getByText("Sauce Labs Backpack", { exact: true }),
    ).toHaveCount(0);
  });
});

test("outside the suite @sanity", async () => {
  console.log("outside the suite sanity");
});
