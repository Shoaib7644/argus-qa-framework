import { Page, FrameLocator } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get a frame locator by selector.
   * @param frameSelector - CSS selector or selector string for the iframe
   * @returns FrameLocator for interacting with elements inside the iframe
   */
  protected getFrameLocator(frameSelector: string): FrameLocator {
    return this.page.frameLocator(frameSelector);
  }

  /**
   * Perform an action that opens a new tab and return the new page.
   * @param callback - Function that performs the action (e.g., clicking a link) that opens a new tab
   * @returns Promise that resolves to the new page
   */
  protected async performActionInNewTab(callback: () => Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([this.page.waitForEvent('popup'), callback()]);
    await newPage.waitForLoadState();
    return newPage;
  }
}
