require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });
const { chromium } = require('playwright');

const STORAGE_STATE = require('path').resolve(__dirname, '../playwright/.auth/user.json');

/**
 * Global setup to perform login and save storageState.
 */
async function globalSetup() {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env file');
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto('https://automationexercise.com/login');

    // Fill in login form
    await page.fill('input[data-qa="login-email"]', email);
    await page.fill('input[data-qa="login-password"]', password);
    await page.click('button[data-qa="login-button"]');

    // Wait for successful login - look for "Logged in as" indicator
    await page.waitForSelector('li > a:has-text("Logged in as")', { timeout: 10000 });

    // Save storage state (cookies and localStorage)
    await context.storageState({ path: STORAGE_STATE });
    console.log(`Storage state saved to ${STORAGE_STATE}`);
  } catch (error) {
    console.error('Failed to log in and save storage state:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

module.exports = globalSetup;

export {};
