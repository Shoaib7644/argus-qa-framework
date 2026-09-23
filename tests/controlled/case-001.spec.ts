import { expect, test } from '@playwright/test';
import { renderCase001State } from './fixtures/case-001-state';

test.describe('case-001', () => {
  test('renders the expected state', async ({ page }, testInfo) => {
    expect(testInfo.project.name).toBe('unauthenticated');

    await page.setContent(renderCase001State());

    await expect(page.getByTestId('case-state')).toHaveAttribute('data-state', 'ready');
  });
});
