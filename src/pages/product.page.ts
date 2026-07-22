import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class ProductPage extends BasePage {
  private readonly searchInput = this.page.locator('#search_product');
  private readonly searchButton = this.page.locator('#submit_search');
  private readonly firstProductAddToCart = this.page
    .locator('.productinfo.text-center .btn.btn-default.add-to-cart')
    .first();

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the products page.
   */
  async goto() {
    await this.page.goto('https://automationexercise.com/products');
  }

  /**
   * Search for a product by name.
   * @param productName - The name of the product to search for
   */
  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    // Wait for results to load - wait for at least one product to be visible
    await this.firstProductAddToCart.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Add the first visible product to cart.
   */
  async addFirstProductToCart() {
    await this.firstProductAddToCart.click();
    // Wait for the success modal or confirmation
    await this.page.waitForSelector('.modal-content', { state: 'visible', timeout: 5000 });
  }

  /**
   * Search for a product and add the first result to cart.
   * @param productName - The name of the product to search for
   */
  async searchAndAddFirstProductToCart(productName: string) {
    await this.searchProduct(productName);
    await this.addFirstProductToCart();
  }
}
