# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pom.spec.ts >> Shopping Cart Suite >> E2E
- Location: tests\pom.spec.ts:37:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\User\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```

```
TypeError: Cannot read properties of undefined (reading 'close')
```

# Test source

```ts
  1  | import { expect, test } from "../fixtures/fixture";
  2  | import * as dotenv from "dotenv";
  3  | import LoginPage from "./pages/loginPage/loginPage";
  4  | import ProductPage from "./pages/productPage/productPage";
  5  | import CartPage from "./pages/cartPage/cartPage";
  6  | 
  7  | let page: any;
  8  | let loginPage: LoginPage;
  9  | let productPage: ProductPage;
  10 | let cartPage: CartPage;
  11 | 
  12 | dotenv.config({ path: "./.env" });
  13 | 
  14 | const baseUrl = process.env.BASE_URL;
  15 | if (!baseUrl) {
  16 |   throw new Error("Base_URL is missing or empty");
  17 | }
  18 | const userName = process.env.LOGIN_USERNAME;
  19 | const password = process.env.LOGIN_PASSWORD;
  20 | if (!userName || !password) {
  21 |   throw new Error("Login environment variables are missing or empty");
  22 | }
  23 | 
  24 | test.describe("Shopping Cart Suite", { tag: "@cart" }, () => {
  25 |   test.beforeEach("open start url", async ({ browser }) => {
  26 |     page = await browser.newPage();
  27 |     loginPage = new LoginPage(page);
  28 |     productPage = new ProductPage(page);
  29 |     cartPage = new CartPage(page);
  30 |     await page.goto(baseUrl);
  31 |   });
  32 | 
  33 |   test.afterEach(async () => {
> 34 |     await page.close();
     |                ^ TypeError: Cannot read properties of undefined (reading 'close')
  35 |   });
  36 | 
  37 |   test("E2E", async () => {
  38 |     await loginPage.login(userName, password);
  39 |     await loginPage.clickOnLoginButton();
  40 |     await expect(page.getByText("Products", { exact: true })).toBeVisible();
  41 |     await productPage.clickOnAddToCart();
  42 |     await productPage.clickOnShoppingCartButton();
  43 |     await expect(
  44 |       page.getByText("Sauce Labs Backpack", { exact: true }),
  45 |     ).toBeVisible();
  46 |   });
  47 | 
  48 |   test("user can remove a product from the cart", async () => {
  49 |     await loginPage.login(userName, password);
  50 |     await loginPage.clickOnLoginButton();
  51 |     await expect(page.getByText("Products", { exact: true })).toBeVisible();
  52 |     await productPage.clickOnAddToCart();
  53 |     await productPage.clickOnShoppingCartButton();
  54 |     await expect(
  55 |       page.getByText("Sauce Labs Backpack", { exact: true }),
  56 |     ).toBeVisible();
  57 |     await cartPage.clickOnRemoveButton();
  58 |     await expect(
  59 |       page.getByText("Sauce Labs Backpack", { exact: true }),
  60 |     ).toHaveCount(0);
  61 |   });
  62 | });
  63 | 
  64 | test("outside the suite @sanity", async () => {
  65 |   console.log("outside the suite sanity");
  66 | });
  67 | 
```