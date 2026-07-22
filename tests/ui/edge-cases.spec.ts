import { test, expect } from '@playwright/test';

test.describe('Edge Cases (@regression)', () => {
  test('should interact with nested iframes using frame locators', async ({ page }) => {
    // Navigate to the nested frames page
    await page.goto('https://the-internet.herokuapp.com/nested_frames');

    // Wait for frames to load
    await page.waitForLoadState('networkidle');

    // Access frames using name attribute instead, access the top frame by name
    const topFrame = page.frame({ name: 'frame-top' });
    // Instead of expecting not to be null, let's check if it exists and handle the case
    if (!topFrame) {
      throw new Error('Top frame not found');
    }

    // Access the left frame within the top frameset by name
    const leftFrame = topFrame.childFrames().find((frame) => frame.name() === 'frame-left');
    if (!leftFrame) {
      throw new Error('Left frame not found');
    }
    const leftFrameText = (await leftFrame.locator('body').textContent()) ?? '';
    expect(leftFrameText.trim()).toContain('LEFT');

    // Access the bottom frame directly by name
    const bottomFrame = page.frame({ name: 'frame-bottom' });
    if (!bottomFrame) {
      throw new Error('Bottom frame not found');
    }
    const bottomFrameText = (await bottomFrame.locator('body').textContent()) ?? '';
    expect(bottomFrameText.trim()).toBe('BOTTOM');
  });

  test('should handle multiple tabs using window/popup events', async ({ page }) => {
    // Navigate to the windows page
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Store the original page reference
    const originalPage = page;

    // Wait for the popup event and click the link that opens a new window
    const [newPage] = await Promise.all([
      originalPage.waitForEvent('popup'),
      originalPage.locator('a[href="/windows/new"]').click(),
    ]);

    // Wait for the new page to load
    await newPage.waitForLoadState();

    // Verify we're in the new window/tab
    await expect(newPage).toHaveURL(/.*\/windows\/new/);

    // Verify content in the new window
    const heading = newPage.locator('h3');
    await expect(heading).toHaveText('New Window');

    // Close the new window and verify we're back to the original
    await newPage.close();
    await expect(originalPage).toHaveURL('https://the-internet.herokuapp.com/windows');
  });
});
