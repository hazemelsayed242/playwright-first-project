import { test as baseTest } from "@playwright/test";
import LoginPage from "../tests/pages/loginPage/loginPage";
import ProductPage from "../tests/pages/productPage/productPage";
import CartPage from "../tests/pages/cartPage/cartPage";

type Pages = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
};

const testPages = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});
export const test = testPages;
export const expect = testPages.expect;
