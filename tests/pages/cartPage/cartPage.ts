import BasePage from "../basePage";

export default class CartPage extends BasePage {
  private readonly removeSauceLabsBackpack = this.page.locator(
    '[id="remove-sauce-labs-backpack"]',
  );

  async clickOnRemoveButton() {
    await this.clickOnElement(this.removeSauceLabsBackpack);
  }
}
