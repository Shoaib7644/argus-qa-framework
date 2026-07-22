import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { ProductPage } from '../../src/pages/product.page';
import { CartPage } from '../../src/pages/cart.page';

test.describe('Checkout Flow (@smoke)', () => {
  test('should complete a user login, search for product, add to cart, and proceed to checkout', async ({
    page,
  }: {
    page: Page;
  }) => {
    // Create page objects
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Login with valid credentials (if not already logged in)
    await loginPage.goto();
    // Check if we are already logged in by looking for the "Logged in as" indicator
    const loggedInIndicator = page.locator('li > a:has-text("Logged in as")');
    const isLoggedIn = await loggedInIndicator.isVisible();
    if (!isLoggedIn) {
      // Need to log in
      await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);
      // Verify login was successful
      await expect(loggedInIndicator).toBeVisible();
    }

    // Navigate to products page
    await productPage.goto();

    // Search for a product (search for 'top' which should return results)
    await productPage.searchProduct('top');

    // Add the first product to cart
    await productPage.addFirstProductToCart();

    // Wait for the success modal to appear and then close it (click outside or wait a bit)
    await page.waitForTimeout(2000); // Brief wait for modal to settle

    // Navigate to cart page
    await cartPage.goto();

    // Verify cart is not empty (should have at least one item)
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeFalsy();

    // Verify proceed to checkout button is visible
    const isCheckoutVisible = await cartPage.isCheckoutButtonVisible();
    expect(isCheckoutVisible).toBeTruthy();

    // Click proceed to checkout button
    await cartPage.clickCheckoutButton();

    // Verify navigation to checkout page
    // Based on the site behavior, it should redirect to /checkout
    await page.waitForURL('**/checkout', { timeout: 10000 });
  });
});

// Empty line for Prettier
