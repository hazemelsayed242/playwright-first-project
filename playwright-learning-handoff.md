# Playwright Automation X — Practical Learning Handoff

> **Purpose:** This is a practical context handoff for continuing Playwright mentoring on another ChatGPT account. It consolidates the available learning history and current project state; it is **not** a verbatim transcript of every conversation.
>
> **Primary authority:** [Playwright official documentation](https://playwright.dev/docs/). Use it over Selenium-era habits or unofficial snippets when advice conflicts.

## Learner Profile and Mentoring Preferences

- The learner has professional Selenium automation experience. Move at a reasonably fast pace and use Selenium comparisons only when they help replace a Selenium mental model with a Playwright one.
- Goal: production-quality Playwright skills, not merely green tests.
- Reply concisely and practically, but go deeper for important concepts.
- For exercises, provide hints/questions first. Give a full solution only when explicitly requested or clearly appropriate.
- For code reviews: explain the root cause first; classify the concern as a Playwright, locator, synchronization, test-design, or application/DOM issue; give the minimal fix, then the more robust option where useful.
- Do not recommend `locator.first()`, `locator.nth()`, `force`, `waitForTimeout()`, or similar shortcuts just to silence failures. Strict-mode violations normally mean the locator should become more specific.
- Prefer user-facing locators, web-first assertions, auto-waiting, test isolation, fixtures, and maintainable design.
- If the application DOM is invalid or unusual, distinguish that from a Playwright defect.

## Learning Progress

The study material covers the official-docs progression:

1. Getting started, writing tests, locators, actions, assertions, and auto-waiting.
2. Test isolation and fixtures.
3. Authentication, network/API work, Page Object Models, debugging/trace viewer, CI, and best practices.

Current hands-on work is a TypeScript Playwright Test project against SauceDemo, using custom fixtures and page objects. Recent topics were `test.describe`, `beforeEach`, `toHaveCount`, and tags.

### Core Playwright Thinking Reinforced

- A `Locator` is a resilient query, not a captured element handle. It is central to Playwright's auto-waiting and retryability. Prefer role/label/text/test-id locators where the UI contract supports them; CSS selectors are acceptable when they represent a stable contract.
- Assertions such as `await expect(locator).toBeVisible()` and `toHaveCount()` are web-first assertions: Playwright retries until they pass or the assertion timeout expires. This replaces most explicit waiting patterns common in Selenium.
- Each Playwright test gets an isolated browser context. Tests should independently arrange their required state; avoid making one test depend on another test's outcome.

Official references: [Locators](https://playwright.dev/docs/locators), [Assertions](https://playwright.dev/docs/test-assertions), [Test isolation](https://playwright.dev/docs/browser-contexts).

## SauceDemo Project: Current Design

### Confirmed Components

- Custom fixture import: `import { expect, test } from "../fixtures/fixture";`
- Test data import: `import testData from "./testData/testData.json";`
- Injected fixtures currently include `page`, `loginPage`, `productPage`, and `cartPage`.
- Page objects inherit from `BasePage` and delegate shared actions through helpers such as `enterTextToElement()` and `clickOnElement()`.
- The suite uses SauceDemo at `https://www.saucedemo.com/`.

### `LoginPage` Current Shape

```ts
export default class LoginPage extends BasePage {
  private readonly usernameField = this.page.locator('[id="user-name"]');
  private readonly passwordField = this.page.locator('[id="password"]');
  private readonly loginBtn = this.page.locator('[id="login-button"]');

  async enterUsernameAndPassword(username: string, password: string) {
    await this.enterTextToElement(this.usernameField, username);
    await this.enterTextToElement(this.passwordField, password);
  }

  async clickOnLoginButton() {
    await this.clickOnElement(this.loginBtn);
  }
}
```

This is a reasonable early POM boundary: locators are encapsulated, the login data entry is a meaningful operation, and the test retains readable business intent. A future optional refinement is a single `login(username, password)` method **only if** it improves repeated test intent; keeping the button click separate is also valid when tests need to verify validation behavior before submission.

### Current Shopping Cart Suite

The suite is grouped as `test.describe("Shopping Cart", ...)` and contains two independent scenarios:

1. A user can add `Sauce Labs Backpack` to the cart.
2. A user can remove it from the cart.

Shared setup in `beforeEach` logs the title and navigates to SauceDemo:

```ts
test.beforeEach("open start url", async ({ page }) => {
  console.log(`Running ${test.info().title}`);
  await page.goto("https://www.saucedemo.com/");
});
```

Each test logs in with JSON test data, asserts the `Products` heading is visible, adds a product through `productPage`, opens the cart, then asserts `Sauce Labs Backpack` is visible. The remove test then calls `cartPage.clickOnRemoveButton()`.

## Code Review Conclusions

### `toHaveCount(0)` After Removal

The final assertion is valid and is the preferred state assertion when the product's cart-item element should no longer exist:

```ts
await expect(
  page.getByText("Sauce Labs Backpack", { exact: true }),
).toHaveCount(0);
```

It is not merely a count check: it auto-retries until the locator resolves to zero elements. This is a Playwright web-first assertion and avoids fixed waits. `exact: true` is appropriate here because it prevents an accidental substring match.

Important distinction: use `toHaveCount(0)` when the desired DOM state is **no matching element**. Use `toBeHidden()` only when the element is expected to remain in the DOM but be visually hidden.

### Suite Organization

Using `test.describe("Shopping Cart", ...)` now is appropriate. It creates a clear report hierarchy and scopes the shared `beforeEach` to shopping-cart tests. It does **not** create shared test state: each test still receives an isolated `page`/context and must log in and add its own product.

This is the right use of a hook: navigate to the common start URL. Keep login/setup explicit in each test until there is a deliberate fixture or helper that makes the suite clearer without concealing important scenario setup. Do not use `test.describe.serial()` for these cases; independent tests are the desired design.

Official references: [Writing tests and hooks](https://playwright.dev/docs/writing-tests), [Page Object Models](https://playwright.dev/docs/pom), [Fixtures](https://playwright.dev/docs/test-fixtures).

## Tags

Tags classify tests for filtering and reporting. Every tag starts with `@`.

For the whole shopping-cart group:

```ts
test.describe("Shopping Cart", { tag: ["@cart", "@smoke"] }, () => {
  // tests
});
```

For one scenario only:

```ts
test("user can remove a product from the cart", { tag: "@regression" }, async ({
  page,
  loginPage,
  productPage,
  cartPage,
}) => {
  // test body
});
```

Run tagged tests:

```bash
npx playwright test --grep @smoke
npx playwright test --grep "@cart|@regression"
npx playwright test --grep "(?=.*@cart)(?=.*@smoke)"
```

Tags should describe a purposeful execution slice, such as `@smoke`, `@regression`, `@api`, `@ui`, or a feature name such as `@cart`. Avoid tagging everything indiscriminately. Tags are not the same as annotations: use annotations for richer metadata such as a linked issue.

Official reference: [Tags and annotations](https://playwright.dev/docs/test-annotations).

## API Testing Context and Lessons

The retrievable conversation preview does not include the earlier API-testing messages or specific endpoints, so no API implementation details are claimed here. Continue from this safe baseline and ask the learner to supply any existing API spec/tests if exact past code is needed.

- Playwright API tests use the built-in `request` fixture / `APIRequestContext` to send HTTP requests directly, without a browser page.
- Suitable uses: test a backend API, create server-side data before a UI test, or verify server-side effects after browser actions.
- Assert meaningful contract details: status, response body/schema, headers where relevant, and state transitions. Do not treat a `200` alone as complete validation.
- Keep API tests independent. Generate or clean up data deliberately rather than allowing tests to depend on execution order.
- For UI/API integration, distinguish the purpose: use real APIs when validating integration; mock or route network requests only when the test intentionally isolates a UI behavior or reliably simulates a difficult state.
- When waiting for a browser-triggered response, register `page.waitForResponse()` before the action that triggers it, preventing a race.

Official references: [API testing](https://playwright.dev/docs/api-testing) and [Network](https://playwright.dev/docs/network).

## Useful Next Steps

1. Add selectors and meaningful actions to `ProductPage` and `CartPage` with the same POM discipline; prefer user-facing locators when SauceDemo exposes them.
2. Make the cart assertions more specific to a cart-item container if another page can display the same product name; this protects the test intent without using `first()` or `nth()`.
3. Apply a small, intentional tag taxonomy (`@smoke`, `@regression`, `@cart`) and practise filtered runs.
4. Add a negative-login scenario and assert the error using a web-first assertion.
5. Resume API testing with one standalone request test, then use API setup only where it makes UI tests faster or more deterministic.
6. Practise debugging a deliberate locator failure in UI mode/Trace Viewer before adding CI.

## Source Map

- [Playwright documentation home](https://playwright.dev/docs/)
- [Writing tests](https://playwright.dev/docs/writing-tests)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [Auto-waiting](https://playwright.dev/docs/actionability)
- [Test fixtures](https://playwright.dev/docs/test-fixtures)
- [Test annotations and tags](https://playwright.dev/docs/test-annotations)
- [API testing](https://playwright.dev/docs/api-testing)
- [Network](https://playwright.dev/docs/network)
- [Page Object Models](https://playwright.dev/docs/pom)
