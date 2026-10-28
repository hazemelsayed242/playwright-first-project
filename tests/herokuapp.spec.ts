import { test, expect } from "@playwright/test";
import path, { format } from "node:path";
import fs from "fs";

/**
 * ! Test With Codegen
 */
test("Heroku", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await expect(page.locator("h1")).toContainText("Welcome to the-internet");
  await page.getByRole("link", { name: "Form Authentication" }).click();
  await expect(page.getByRole("heading", { name: "Login Page" })).toBeVisible();
  await expect(page.locator("h2")).toContainText("Login Page");
  await expect(page.getByRole("textbox", { name: "Username" })).toBeVisible();
  await page.getByRole("textbox", { name: "Username" }).click();
  await page.getByRole("textbox", { name: "Username" }).fill("tomsmith");
  await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();
  await page.getByRole("textbox", { name: "Password" }).click();
  await page
    .getByRole("textbox", { name: "Password" })
    .fill("SuperSecretPassword!");
  await expect(page.getByRole("button", { name: " Login" })).toBeVisible();
  await page.getByRole("button", { name: " Login" }).click();
  await expect(page.getByText("You logged into a secure area")).toBeVisible();
  await expect(page.locator("#flash")).toContainText(
    "You logged into a secure area! ×",
  );
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
});

test("To Have Screenshot Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Hovers" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/hovers");
  await expect(page).toHaveScreenshot();
});

/**
 * ! _START_ Tests by Claude Learning Step By Step:
 */
test("Login test", async ({ page }) => {
  const username = page.getByRole("textbox", { name: "username" });
  const password = page.getByRole("textbox", { name: "password" });

  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Form Authentication" }).click();
  await expect(page.getByRole("heading", { name: "Login Page" })).toBeVisible();

  await username.fill("tomsmith");
  await password.fill("SuperSecretPassword!");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL("https://the-internet.herokuapp.com/secure");
  await expect(page.getByText("You logged into a secure area!")).toBeVisible();

  await page.getByRole("link", { name: "Logout" }).click();
});

test("Checkboxes Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");

  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Checkboxes" }).click();

  await expect(page).toHaveURL("https://the-internet.herokuapp.com/checkboxes");

  const checkboxes = page.getByRole("checkbox");
  const checkbox1 = checkboxes.nth(0);
  const checkbox2 = checkboxes.nth(1);

  await expect(checkbox1).not.toBeChecked();
  await expect(checkbox2).toBeChecked();

  await checkbox1.check();
  await checkbox2.uncheck();

  await expect(checkbox1).toBeChecked();
  await expect(checkbox2).not.toBeChecked();
});

test("Dynamic Loading Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");

  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Dynamic Loading" }).click();
  await expect(
    page.getByRole("heading", { name: "Dynamically Loaded Page Elements" }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Example 2: Element rendered after the fact" })
    .click();

  await expect(
    page.getByRole("heading", {
      name: "Example 2: Element rendered after the fact",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start" }).click();

  const loadingBar = page.locator("#loading");
  await expect(loadingBar).toBeVisible();
  await expect(loadingBar).toBeHidden({ timeout: 10000 });

  await expect(
    page.getByRole("heading", { name: "Hello World!" }),
  ).toBeVisible();
});

test("Dynamic Controls Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");

  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Dynamic Controls" }).click();

  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/dynamic_controls",
  );

  const checkboxSection = page.locator("#checkbox-example");
  const textboxSection = page.locator("#input-example");
  const checkboxLoader = checkboxSection.locator("#loading").first();
  // const textboxLoader = textboxSection.locator("#loading").first();

  // #Checkbox Section#
  const buttonRemove = checkboxSection.getByRole("button", { name: "Remove" });
  const checkBox = checkboxSection.locator("#checkbox");

  await buttonRemove.click();
  await expect(checkboxLoader).toBeVisible();
  await expect(checkboxLoader).toBeHidden({ timeout: 10000 });
  await expect(checkBox).not.toBeVisible();
  await expect(
    checkboxSection.getByText("It's gone!", { exact: true }),
  ).toBeVisible();
  const buttonAdd = checkboxSection.getByRole("button", { name: "Add" });
  await expect(buttonAdd).toBeVisible();

  await buttonAdd.click();
  await expect(checkboxLoader).toBeVisible();
  await expect(checkboxLoader).toBeHidden({ timeout: 10000 });
  await expect(checkBox).toBeVisible();
  await expect(
    checkboxSection.getByText("It's back!", { exact: true }),
  ).toBeVisible();
  await expect(buttonRemove).toBeVisible();

  // #Textbox Section#
  const buttonEnable = textboxSection.getByRole("button", { name: "Enable" });
  const input = textboxSection.getByRole("textbox");

  await buttonEnable.click();
  /* NOTE: the-internet.herokuapp.com has a bug — #loading divs accumulate
   and never get hidden in the Enable/Disable section. Skipping loading-bar
   visibility assertions here; relying on final state + timeout instead.
   */
  // await expect(textboxLoader).toBeVisible();
  // await expect(textboxLoader).toBeHidden({ timeout: 10000 });
  await expect(input).toBeEnabled();
  await expect(
    textboxSection.getByText("It's enabled!", { exact: true }),
  ).toBeVisible();

  const buttonDisable = textboxSection.getByRole("button", { name: "Disable" });
  await buttonDisable.click();
  /* NOTE: the-internet.herokuapp.com has a bug — #loading divs accumulate
   and never get hidden in the Enable/Disable section. Skipping loading-bar
   visibility assertions here; relying on final state + timeout instead.
   */
  // await expect(textboxLoader).toBeVisible();
  // await expect(textboxLoader).toBeHidden({ timeout: 10000 });
  await expect(input).toBeDisabled();
  await expect(
    textboxSection.getByText("It's disabled!", { exact: true }),
  ).toBeVisible();
});

test("Dropdown Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Dropdown" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/dropdown");

  const select = page.getByRole("combobox");
  await select.selectOption("2");
  await expect(select).toHaveValue("2");
});

test("Add/Remove Elements Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Add/Remove Elements" }).click();
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/add_remove_elements/",
  );

  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  const addButton = page.getByRole("button", { name: "Add Element" });
  await addButton.click();
  await addButton.click();
  await addButton.click();
  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(3);
  await page.getByRole("button", { name: "Delete" }).last().click();
  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(2);
});

test("Hover Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Hovers" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/hovers");

  for (let i = 1; i <= 3; i++) {
    // const figure = page.locator(".figure").nth(i - 1);
    const figure = page
      .locator(".figure")
      .filter({ hasText: `name: user${i}` });
    const caption = figure.locator(".figcaption");

    await expect(caption).not.toBeVisible();
    await figure.getByRole("img", { name: "User Avatar" }).hover();
    await expect(caption).toBeVisible();
    await expect(caption.getByRole("link")).toHaveAttribute(
      "href",
      `/users/${i}`,
    );
  }

  // const firstFigure = page.locator(".figure").nth(0);
  // const firstCaption = firstFigure.locator(".figcaption");
  // await expect(firstCaption).not.toBeVisible();
  // await firstFigure.getByRole("img").hover();
  // await expect(firstCaption).toBeVisible();
  // await expect(firstCaption.getByRole("link")).toHaveAttribute(
  //   "href",
  //   "/users/1",
  // );

  // const secondFigure = page.locator(".figure").nth(1);
  // const secondCaption = secondFigure.locator(".figcaption");
  // await expect(secondCaption).not.toBeVisible();
  // await secondFigure.getByRole("img").hover();
  // await expect(secondCaption).toBeVisible();
  // await expect(secondCaption.getByRole("link")).toHaveAttribute(
  //   "href",
  //   "/users/2",
  // );

  // const thirdFigure = page.locator(".figure").nth(2);
  // const thirdCaption = thirdFigure.locator(".figcaption");
  // await expect(thirdCaption).not.toBeVisible();
  // await thirdFigure.getByRole("img").hover();
  // await expect(thirdCaption).toBeVisible();
  // await expect(thirdCaption.getByRole("link")).toHaveAttribute(
  //   "href",
  //   "/users/3",
  // );
});

test("File Upload Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "File Upload" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/upload");

  const fileName2 = "test-file.txt";
  await page.locator("#file-upload").setInputFiles({
    name: fileName2,
    mimeType: "text/plain",
    buffer: Buffer.from("This is test content for upload"),
  });
  await page.locator("#file-submit").click();
  await expect(
    page.getByRole("heading", { name: "File Uploaded!" }),
  ).toBeVisible();
  await expect(page.locator("#uploaded-files")).toHaveText(fileName2);

  // const filePath = path.join(__dirname, "fixtures", "file.md");
  // const fileName = path.basename(filePath);
  // await page.locator("#file-upload").setInputFiles(filePath);
  // await page.locator("#file-submit").click();
  // await expect(
  //   page.getByRole("heading", { name: "File Uploaded!" }),
  // ).toBeVisible();
  // await expect(page.locator("#uploaded-files")).toHaveText(fileName);
});

test("JavaScript Alerts Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await expect(
    page.getByRole("heading", { name: "Welcome to the-internet" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "JavaScript Alerts" }).click();
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/javascript_alerts",
  );

  const result = page.locator("#result");

  // Alert:
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe("I am a JS Alert");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Click for JS Alert" }).click();
  await expect(result).toHaveText("You successfully clicked an alert");

  // page.once("dialog", (dialog) => dialog.accept()); // or dialog.dismiss(), or dialog.accept('text') for prompts
  // await page.getByRole("button", { name: "Click for JS Alert" }).click();
  // await expect(result).toContainText("You successfully clicked an alert");

  // Confirm (accept)
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("I am a JS Confirm");
    await dialog.accept();
  });
  await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  await expect(result).toHaveText("You clicked: Ok");

  // page.once("dialog", (confirm) => confirm.accept());
  // await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  // await expect(result).toContainText("You clicked: Ok");

  // Confirm (dismiss)
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("I am a JS Confirm");
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  await expect(result).toHaveText("You clicked: Cancel");

  // page.once("dialog", (confirm) => confirm.dismiss());
  // await page.getByRole("button", { name: "Click for JS Confirm" }).click();
  // await expect(result).toContainText("You clicked: Cancel");

  // Prompt Alert (accept):
  const promptInput = `Playwright_${Date.now()}`;
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe("I am a JS prompt");
    await dialog.accept(promptInput);
  });
  await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  await expect(result).toHaveText(`You entered: ${promptInput}`);

  // Prompt Alert (dismiss):
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("prompt");
    expect(dialog.message()).toBe("I am a JS prompt");
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  await expect(result).toHaveText("You entered: null");

  // page.once("dialog", (dialog) => dialog.dismiss());
  // await page.getByRole("button", { name: "Click for JS Prompt" }).click();
  // await expect(result).toHaveText("You entered: null");
});

test("Drag and Drop Test", async ({ page }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await page.getByRole("link", { name: "Drag and Drop" }).click();
  await expect(page).toHaveURL(
    "https://the-internet.herokuapp.com/drag_and_drop",
  );
  await expect(
    page.getByRole("heading", { name: "Drag and Drop" }),
  ).toBeVisible();

  const columnA = page.locator("#column-a");
  const columnB = page.locator("#column-b");

  await expect(columnA).toHaveText("A");
  await expect(columnB).toHaveText("B");

  await columnA.dragTo(columnB);
  await expect(columnA).toHaveText("B");
  await expect(columnB).toHaveText("A");

  await columnB.dragTo(columnA);
  await expect(columnA).toHaveText("A");
  await expect(columnB).toHaveText("B");
});

test("Multiple Windows Test", async ({ page, context }) => {
  await page.goto("https://the-internet.herokuapp.com/");
  await page.getByRole("link", { name: "Multiple Windows" }).click();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/windows");
  await expect(
    page.getByRole("heading", { name: "Opening a new window" }),
  ).toBeVisible();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Click Here" }).click(),
  ]);

  await newPage.waitForLoadState();
  await expect(
    newPage.getByRole("heading", { name: "New Window" }),
  ).toBeVisible();
  await expect(page).toHaveURL("https://the-internet.herokuapp.com/windows");
});

/**
 * * https://play1.automationcamp.ir/index.html
 * ? Mouse Actions and Hover
 * ? Drag
 * ? Frames
 * ? Popup
 */

test("Mouse Actions Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  const mouseActionsArea = page.locator("#click_area");
  const mouseClickType = page.locator("#click_type");

  await mouseActionsArea.click();
  await expect(mouseClickType).toHaveText("Click");

  await mouseActionsArea.dblclick();
  await expect(mouseClickType).toHaveText("Double-Click");

  await mouseActionsArea.click({ button: "right" });
  await expect(mouseClickType).toHaveText("Right-Click");
});

test("Mouse Hover Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/mouse_events.html");
  await page.getByRole("button", { name: "Choose Language" }).hover();
  await page.locator("#dd_java").click();
  await expect(page.locator("#hover_validate")).toHaveText("Java");
});

test("Drag Me Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/mouse_events.html");

  const blueBox = page.getByRole("button", {
    name: "Drop me on to the green box",
  });
  const greenBox = page.locator("#drop_target");

  await expect(greenBox).toContainClass("bg-success");
  await expect(greenBox).toHaveText("Target");

  await blueBox.dragTo(greenBox);
  await expect(greenBox).toContainClass("bg-danger");
  await expect(greenBox).toHaveText("Drop is successful!");
});

test("Frames Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/frames.html");

  const button1 = page.frameLocator("#frame1").locator("#click_me_1");
  const button2 = page
    .frameLocator("#frame1")
    .frameLocator("#frame2")
    .locator("#click_me_2");
  const button4 = page
    .frameLocator("#frame1")
    .frameLocator("#frame3")
    .frameLocator("#frame4")
    .locator("#click_me_4");

  await button1.click();
  // console.log(await button1.count()); // *for Debugging only
  await expect(button1).toHaveText("Clicked");
  await expect(button1).toContainClass("btn-secondary");

  await button2.click();
  // console.log(await button2.count()); // *for Debugging only
  await expect(button2).toHaveText("Clicked");
  await expect(button2).toContainClass("btn-secondary");

  await button4.click();
  // console.log(await button4.count()); // *for Debugging only
  await expect(button4).toHaveText("Clicked");
  await expect(button4).toContainClass("btn-secondary");
});

test("Popup Windows Test", async ({ page, context }) => {
  await page.goto("https://play1.automationcamp.ir/multi_window.html");

  const [newPopup1] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Open New Window 1" }).click(),
  ]);

  await newPopup1.waitForLoadState();
  const button1 = newPopup1.locator("#click_me_2");
  await expect(button1).toBeVisible();
  await button1.click();
  await expect(button1).toHaveText("Clicked");
  await expect(button1).toContainClass("btn-secondary");

  const [newPopup2] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Open New Window 2" }).click(),
  ]);

  await newPopup2.waitForLoadState();
  const button2 = newPopup2.locator("#click_me_4");
  await expect(button2).toBeVisible();
  await button2.click();
  await expect(button2).toHaveText("Clicked");
  await expect(button2).toContainClass("btn-secondary");

  await expect(page).toHaveURL(
    "https://play1.automationcamp.ir/multi_window.html",
  );
});

test("Keyboard Actions Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/keyboard_events.html");
  const textArea = page.getByRole("textbox");
  const keyName = page.locator("#key");
  const keyCode = page.locator("#code");
  const metamodifier = page.locator("#meta");
  const controlmodifier = page.locator("#ctrl");
  const altmodifier = page.locator("#alt");
  const shiftmodifier = page.locator("#shift");

  await textArea.press("A");

  await expect(keyName).toHaveText("A");
  await expect(keyCode).toHaveText("KeyA");

  await expect(metamodifier).not.toBeVisible();
  await expect(controlmodifier).not.toBeVisible();
  await expect(altmodifier).not.toBeVisible();
  await expect(shiftmodifier).not.toBeVisible();

  await textArea.press("Shift+A");

  await expect(keyName).toHaveText("A");
  await expect(keyCode).toHaveText("KeyA");
  await expect(shiftmodifier).toBeVisible();

  await expect(metamodifier).not.toBeVisible();
  await expect(controlmodifier).not.toBeVisible();
  await expect(altmodifier).not.toBeVisible();
});

/**
 * ! Forms:
 * * Basic Form Controls
 * * Form with Validations
 * * Non-English Labels and Locators
 */
test("Basic Form Controls Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/forms.html");

  // const inputExperience = page.locator("#exp");
  // const experienceText = page.locator("#exp_help");
  // await inputExperience.pressSequentially("15 years");
  // await expect(experienceText).toHaveText("15 years");

  // const checkJava = page.getByRole("checkbox", { name: "Java", exact: true });
  // const checkPython = page.getByRole("checkbox", {
  //   name: "Python",
  //   exact: true,
  // });
  // const checkJS = page.getByRole("checkbox", {
  //   name: "JavaScript",
  //   exact: true,
  // });
  // const checkValidate = page.locator("#check_validate");
  // await expect(checkJava).toBeDisabled();
  // await checkPython.check();
  // await expect(checkPython).toBeChecked();
  // await checkJS.check();
  // await expect(checkJS).toBeChecked();
  // await expect(checkValidate).toHaveText("PYTHON JAVASCRIPT");

  // const radioSelenium = page.getByRole("radio", { name: "Selenium" });
  // const radioProtractor = page.getByRole("radio", { name: "Protractor" });
  // const radioValidate = page.locator("#rad_validate");
  // await radioSelenium.check();
  // await expect(radioSelenium).toBeChecked();
  // await expect(radioValidate).toHaveText("SELENIUM");

  // await radioProtractor.check();
  // await expect(radioProtractor).toBeChecked();
  // await expect(radioSelenium).not.toBeChecked();
  // await expect(radioValidate).toHaveText("PROTRACTOR");

  // const selectTool = page.getByLabel("Primary Skill");
  // const validateSelectTool = page.locator("#select_tool_validate");
  // // await selectTool.selectOption({ label: "Selenium" }); // selectOpt with "label" with key value.
  // // await selectTool.selectOption("Selenium");            // selectOpt with "label" without key value.
  // // await selectTool.selectOption("sel");                 // selectOpt with "value" without key value.
  // await selectTool.selectOption({ value: "sel" }); // selectOpt with "value" with key value.
  // await expect(validateSelectTool).toHaveText("sel");

  // const selectLanguage = page.getByLabel("Choose Language");
  // const validateSelectLang = page.locator("#select_lang_validate");
  // await selectLanguage.selectOption(["java", "typescript"]);
  // await expect(validateSelectLang).toHaveText("java,typescript");

  // const textArea = page.getByPlaceholder("Notes");
  // const validateAreaNotes = page.locator("#area_notes_validate");
  // await textArea.pressSequentially("Hi Hazem, How are you?");
  // await expect(validateAreaNotes).toHaveText("Hi Hazem, How are you?");

  // const readOnlyTextbox = page.getByPlaceholder("Common Sense");
  // await expect(readOnlyTextbox).not.toBeEditable();

  // const germanSwitch = page.getByRole("checkbox", { name: "Speaks German?" });
  // const germanLabel = page.getByText("Speaks German?", { exact: true });
  // const validateGerman = page.locator("#german_validate");
  // await germanLabel.click();
  // await expect(germanSwitch).toBeChecked();
  // await expect(validateGerman).toHaveText("true");
  // await germanLabel.click();
  // await expect(germanSwitch).not.toBeChecked();
  // await expect(validateGerman).toHaveText("false");

  // const slider = page.getByRole("slider");
  // const validateSlider = page.locator("#fluency_validate");
  // await slider.fill("4");
  // await expect(validateSlider).toHaveText("4");

  // const singleFileUpload = page.getByLabel("Upload CV (SINGLE FILE)");
  // const validateCV = page.locator("#validate_cv");
  // // with path.join (Statically):
  // const filePath = path.join(__dirname, "fixtures", "file.md");
  // await singleFileUpload.setInputFiles(filePath);
  // await expect(singleFileUpload).toHaveValue(/file.md/);
  // await expect(validateCV).toHaveText(path.basename(filePath));
  // // with Buffer (Dynamically):
  // const fileName = "testFile.csv";
  // const fileContent = `name, email
  // hazem, haz@gmail.com
  // alaa, alaa@gmail.com`;
  // await singleFileUpload.setInputFiles({
  //   name: fileName,
  //   mimeType: "text/csv",
  //   buffer: Buffer.from(fileContent),
  // });
  // await expect(validateCV).toHaveText(fileName);

  // const multyFilesUpload = page.getByLabel(
  //   "Upload Certificates (MULTIPLE FILES)",
  // );
  // const files = [
  //   path.join(__dirname, "fixtures", "file1.txt"),
  //   path.join(__dirname, "fixtures", "file2.txt"),
  //   path.join(__dirname, "fixtures", "file.md"),
  //   path.join(__dirname, "fixtures", "error-context.md"),
  // ];
  // await multyFilesUpload.setInputFiles(files);
  // const validateFiles = page.locator("#validate_files");
  // const expectFileNames = files.map((file) => path.basename(file)).join(" ");
  // await expect(validateFiles).toHaveText(expectFileNames);

  // const downloadLink = page.getByRole("link", {
  //   name: " Click here to Download",
  // });
  // const downloadPromise = page.waitForEvent("download");
  // await downloadLink.click();
  // const download = await downloadPromise;
  // expect(download.suggestedFilename()).toBe("sample_text.txt");
  // const filePath = path.join(
  //   __dirname,
  //   "fixtures",
  //   download.suggestedFilename(),
  // );
  // await download.saveAs(filePath);
  // expect(fs.existsSync(filePath)).toBe(true);

  // await page.goto("https://the-internet.herokuapp.com/download");
  // const fileLink = page.getByRole("link", {name: "file.php.jpg"});
  // const downloadPromise = page.waitForEvent("download");
  // await fileLink.click();
  // const download = await downloadPromise;
  // expect(download.suggestedFilename()).toBe("file.php.jpg");
  // const filePath = path.join(__dirname, "fixtures", download.suggestedFilename());
  // await download.saveAs(filePath);
  // expect(fs.existsSync(filePath)).toBe(true);

  // const inputDisabled = page.getByLabel("Current Salary (Disabled TextBox)");
  // await expect(inputDisabled).toBeDisabled();
  // const inputHidden = page.locator("#invisible");
  // await expect(inputHidden).toBeHidden();
});

test("Form with Validations Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/forms.html");
  const formHeading = page.getByRole("heading", {
    name: "Form with Validations",
  });
  const cityInput = page.locator("#validationCustom03");
  const cityInvalidFeedback = page.locator("#invalid_city");
  const stateInput = page.locator("#validationCustom04");
  const stateInvalidFeedback = page.locator("#invalid_state");
  const zipInput = page.locator("#validationCustom05");
  const zipInvalidFeedback = page.locator("#invalid_zip");
  const termsCheckbox = page.getByLabel("Agree to terms and conditions");
  const termsInvalidFeedback = page.locator("#invalid_terms");
  const submitButton = page.getByRole("button", { name: "Submit Form" });
  // Scenario 1 — Invalid form / required validation
  await expect(formHeading).toBeVisible();
  await termsCheckbox.uncheck();
  await submitButton.click();
  await expect(cityInvalidFeedback).toHaveText("Please provide a valid city.");
  await expect(stateInvalidFeedback).toHaveText(
    "Please provide a valid state.",
  );
  await expect(zipInvalidFeedback).toHaveText("Please provide a valid zip.");
  await expect(termsInvalidFeedback).toHaveText(
    "You must agree before submitting.",
  );
  // Scenario 2 — Valid form submission
  await expect(formHeading).toBeVisible();
  await cityInput.fill("Cairo");
  await stateInput.fill("New Cairo");
  await zipInput.fill("11834");
  await termsCheckbox.check();
  await submitButton.click();
  await expect(page).toHaveURL("https://play1.automationcamp.ir/forms.html?");
});

test("Non-English Labels and Locators Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/forms.html");

  const inputLabel = page.getByLabel("आपले नांव लिहा", { exact: true });
  const textvalidation = page.locator("#नाव_तपासा");
  await inputLabel.pressSequentially("Hazem Elmasry");
  await expect(textvalidation).toHaveText("Hazem Elmasry");

  const firstCheckbox = page.getByLabel("मराठी");
  const secondCheckbox = page.getByLabel("ગુજરાતી");
  const thirdCheckbox = page.getByLabel("ਪੰਜਾਬੀ");
  const validateChecked = page.locator("#check_validate_non_english");
  await firstCheckbox.check();
  await secondCheckbox.check();
  await thirdCheckbox.check();
  await expect(validateChecked).toHaveText("मराठी ગુજરાતી ਪੰਜਾਬੀ");
});

test("Advanced UI Features Test", async ({ page }) => {
  await page.goto("https://play1.automationcamp.ir/advanced.html");

  // 1. Define the locator for the main element holding the pseudo-element
  const starRating = page.locator("label.star-rating");
  //2. Execute JavaScript code in the page, to Evaluate the computed style of the pseudo-element:
  const aftreText = await starRating.evaluate((element) => {
    const computedStyle = window.getComputedStyle(element, ":after");
    return computedStyle.getPropertyValue("content").replace(/^"|"$/g, "");
  });
  // console.log("psudo element text: " + aftreText);

  const textbox = page.getByRole("textbox");
  await textbox.fill(aftreText);

  const checkRatingButton = page.getByRole("button", { name: "Check Rating" });
  await checkRatingButton.click();
  const validateRating = page.locator("#validate_rating");
  // 3. Perform the assertion:
  await expect(validateRating).toHaveText("Well done!");
});

//
/**
 * ! _END_ Tests by Claude Learning Step By Step:
 */
