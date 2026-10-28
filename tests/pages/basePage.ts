import { Locator, Page } from "@playwright/test";

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected async clickOnElement(element: Locator) {
    await element.click();
  }
  protected async enterTextToElement(element: Locator, text: string) {
    await element.fill(text);
  }
  public async takePageScreenshot(filePath: string) {
    await this.page.screenshot({ path: filePath });
  }
}
