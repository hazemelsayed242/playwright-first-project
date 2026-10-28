# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: herokuapp.spec.ts >> Frames Test
- Location: tests\herokuapp.spec.ts:474:5

# Error details

```
Error: expect(locator).toContainClass(expected) failed

Locator: locator('#frame1').contentFrame().getByRole('button', { name: 'Click Me 1' })
Expected: "btn-secondary"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainClass" with timeout 5000ms
  - waiting for locator('#frame1').contentFrame().getByRole('button', { name: 'Click Me 1' })

```

```yaml
- navigation:
  - link "The Playground":
    - /url: index.html
- iframe
- navigation:
  - link "© 2019 Dinesh Velhal":
    - /url: http://www.linkedin.com/in/dineshvelhal
  - list:
    - listitem: "Coordinates:"
    - listitem:
      - link "":
        - /url: http://www.linkedin.com/in/dineshvelhal
    - listitem:
      - link "":
        - /url: https://twitter.com/dinesh_velhal
  - button " Thanks To"
  - button " Home"
```

# Test source

```ts
  383 |   // await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  384 |   // await expect(result).toHaveText("You entered: null");
  385 | });
  386 | 
  387 | test("Drag and Drop Test", async ({ page }) => {
  388 |   await page.goto("https://the-internet.herokuapp.com/");
  389 |   await page.getByRole("link", { name: "Drag and Drop" }).click();
  390 |   await expect(page).toHaveURL(
  391 |     "https://the-internet.herokuapp.com/drag_and_drop",
  392 |   );
  393 |   await expect(
  394 |     page.getByRole("heading", { name: "Drag and Drop" }),
  395 |   ).toBeVisible();
  396 | 
  397 |   const columnA = page.locator("#column-a");
  398 |   const columnB = page.locator("#column-b");
  399 | 
  400 |   await expect(columnA).toHaveText("A");
  401 |   await expect(columnB).toHaveText("B");
  402 | 
  403 |   await columnA.dragTo(columnB);
  404 |   await expect(columnA).toHaveText("B");
  405 |   await expect(columnB).toHaveText("A");
  406 | 
  407 |   await columnB.dragTo(columnA);
  408 |   await expect(columnA).toHaveText("A");
  409 |   await expect(columnB).toHaveText("B");
  410 | });
  411 | 
  412 | test("Multiple Windows Test", async ({ page, context }) => {
  413 |   await page.goto("https://the-internet.herokuapp.com/");
  414 |   await page.getByRole("link", { name: "Multiple Windows" }).click();
  415 |   await expect(page).toHaveURL("https://the-internet.herokuapp.com/windows");
  416 |   await expect(
  417 |     page.getByRole("heading", { name: "Opening a new window" }),
  418 |   ).toBeVisible();
  419 | 
  420 |   const [newPage] = await Promise.all([
  421 |     context.waitForEvent("page"),
  422 |     page.getByRole("link", { name: "Click Here" }).click(),
  423 |   ]);
  424 | 
  425 |   await newPage.waitForLoadState();
  426 |   await expect(
  427 |     newPage.getByRole("heading", { name: "New Window" }),
  428 |   ).toBeVisible();
  429 |   await expect(page).toHaveURL("https://the-internet.herokuapp.com/windows");
  430 | });
  431 | 
  432 | /* https://play1.automationcamp.ir/index.html
  433 |  *Mouse Actions
  434 |  *Frames
  435 |  */
  436 | test("Mouse Actions Test", async ({ page }) => {
  437 |   await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  438 |   const mouseActionsArea = page.locator("#click_area");
  439 |   const mouseClickType = page.locator("#click_type");
  440 | 
  441 |   await mouseActionsArea.click();
  442 |   await expect(mouseClickType).toHaveText("Click");
  443 | 
  444 |   await mouseActionsArea.dblclick();
  445 |   await expect(mouseClickType).toHaveText("Double-Click");
  446 | 
  447 |   await mouseActionsArea.click({ button: "right" });
  448 |   await expect(mouseClickType).toHaveText("Right-Click");
  449 | });
  450 | 
  451 | test("Mouse Hover Test", async ({ page }) => {
  452 |   await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  453 |   await page.getByRole("button", { name: "Choose Language" }).hover();
  454 |   await page.locator("#dd_java").click();
  455 |   await expect(page.locator("#hover_validate")).toHaveText("Java");
  456 | });
  457 | 
  458 | test("Drag Me Test", async ({ page }) => {
  459 |   await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  460 | 
  461 |   const blueBox = page.getByRole("button", {
  462 |     name: "Drop me on to the green box",
  463 |   });
  464 |   const greenBox = page.locator("#drop_target");
  465 | 
  466 |   await expect(greenBox).toContainClass("bg-success");
  467 |   await expect(greenBox).toHaveText("Target");
  468 | 
  469 |   await blueBox.dragTo(greenBox);
  470 |   await expect(greenBox).toContainClass("bg-danger");
  471 |   await expect(greenBox).toHaveText("Drop is successful!");
  472 | });
  473 | 
  474 | test("Frames Test", async ({ page }) => {
  475 |   await page.goto("https://play1.automationcamp.ir/frames.html");
  476 | 
  477 |   const button1 = page.frameLocator("#frame1").getByRole("button", {name: "Click Me 1"});
  478 |   const button2 = page.frameLocator("#frame1").frameLocator("#frame2").getByRole("button", {name: "Click Me 2"});
  479 |   const button4 = page.frameLocator("#frame1").frameLocator("#frame2").frameLocator("#frame4").getByRole("button", {name: "Click Me 4"});
  480 | 
  481 |   await button1.click();
  482 |   // await expect(button1).toHaveText("Clicked");
> 483 |   await expect(button1).toContainClass("btn-secondary");
      |                         ^ Error: expect(locator).toContainClass(expected) failed
  484 |   
  485 |   await button2.click();
  486 |   await expect(button2).toHaveText("Clicked");
  487 |   await expect(button2).toContainClass("btn-secondary");
  488 | 
  489 |   await button4.click();
  490 |   await expect(button4).toHaveText("Clicked");
  491 |   await expect(button4).toContainClass("btn-secondary");
  492 |   
  493 | });
  494 | 
  495 | /* #END# tests by claude learning step by step*/
  496 | 
```