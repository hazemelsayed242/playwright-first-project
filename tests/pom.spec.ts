import { log } from "console";
import { expect, test } from "../fixtures/fixture";
import testData from "./testData/testData.json";

test.describe("Shopping Cart Suite", { tag: "@cart" }, () => {
  test.beforeEach("open start url", async ({ page }) => {
    console.log(`Running ${test.info().title}`);
    await page.goto("https://www.saucedemo.com/");
  });

  test(
    "user can add a product to the cart",
    { tag: "@smoke" },
    async ({ page, loginPage, productPage }) => {
      await loginPage.login(testData.username, testData.password);
      await loginPage.clickOnLoginButton();
      await expect(page.getByText("Products", { exact: true })).toBeVisible();
      await productPage.clickOnAddToCart();
      await productPage.clickOnShoppingCartButton();
      await expect(
        page.getByText("Sauce Labs Backpack", { exact: true }),
      ).toBeVisible();
    },
  );

  test("user can remove a product from the cart", async ({
    page,
    loginPage,
    productPage,
    cartPage,
  }) => {
    await loginPage.login(testData.username, testData.password);
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