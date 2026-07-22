import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  private readonly emailInput = this.page.locator('input[data-qa="login-email"]');
  private readonly passwordInput = this.page.locator('input[data-qa="login-password"]');
  private readonly loginButton = this.page.locator('button[data-qa="login-button"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page.
   */
  async goto() {
    await this.page.goto('https://automationexercise.com/login');
  }

  /**
   * Fill the email field.
   * @param email - The email address to enter
   */
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill the password field.
   * @param password - The password to enter
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button.
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Perform login with email and password.
   * @param email - The email address
   * @param password - The password
   */
  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}
