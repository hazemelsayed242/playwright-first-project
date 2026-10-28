import BasePage from "../basePage";

export default class ProductPage extends BasePage {
  private readonly addToCartSauceLabsBackpack = this.page.locator(
    '[id="add-to-cart-sauce-labs-backpack"]',
  );
  private readonly shoppingCartBtn = this.page.locator(
    '[id="shopping_cart_container"]',
  );

  async clickOnAddToCart() {
    await this.clickOnElement(this.addToCartSauceLabsBackpack);
  }

  async clickOnShoppingCartButton() {
    await this.clickOnElement(this.shoppingCartBtn);
  }
}
