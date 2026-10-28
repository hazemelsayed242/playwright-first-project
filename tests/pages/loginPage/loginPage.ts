import BasePage from "../basePage";

export default class LoginPage extends BasePage {
  private readonly usernameField = this.page.locator('[id="user-name"]');
  private readonly passwordField = this.page.locator('[id="password"]');
  private readonly loginBtn = this.page.locator('[id="login-button"]');

  async login(username: string, password: string) {
    await this.enterTextToElement(this.usernameField, username);
    await this.enterTextToElement(this.passwordField, password);
  }
  async clickOnLoginButton() {
    await this.clickOnElement(this.loginBtn);
  }
}
