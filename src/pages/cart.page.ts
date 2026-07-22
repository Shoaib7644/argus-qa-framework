import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CartPage extends BasePage {
  private readonly cartItemsSection = this.page.locator('#cart_items');
  private readonly emptyCartMessage = this.page.locator('#empty_cart');
  private readonly proceedToCheckoutButton = this.page.locator('.check_out');
  private readonly viewCartLink = this.page.locator('a[href="/view_cart"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the cart page.
   */
  async goto() {
    await this.page.goto('https://automationexercise.com/view_cart');
  }

  /**
   * Click on the cart link in the navigation to go to cart page.
   */
  async clickCartLink() {
    await this.viewCartLink.click();
    await this.cartItemsSection.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if the cart is empty.
   * @returns true if cart is empty, false otherwise
   */
  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }

  /**
   * Check if the proceed to checkout button is visible.
   * @returns true if button is visible, false otherwise
   */
  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.proceedToCheckoutButton.isVisible();
  }

  /**
   * Click the proceed to checkout button.
   */
  async clickCheckoutButton() {
    await this.proceedToCheckoutButton.click();
    // Wait for navigation to checkout page or modal to appear
    await this.page.waitForURL('**/checkout', { timeout: 10000 });
  }

  /**
   * Wait for the cart page to load completely.
   */
  async waitForCartLoaded() {
    await this.cartItemsSection.waitFor({ state: 'visible', timeout: 10000 });
  }
}
