# Argus QA Framework

An enterprise-grade hybrid API + UI test automation framework built in Playwright + TypeScript, designed as a portfolio artifact demonstrating engineering judgment in test automation.

## 🔖 Badges

![CI - PR Smoke](https://github.com/shoaibahmed/argus-qa-framework/actions/workflows/pr-smoke.yml/badge.svg)
![CI - Nightly Regression](https://github.com/shoaibahmed/argus-qa-framework/actions/workflows/nightly-regression.yml/badge.svg)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

## 🎯 Project Purpose

This framework serves as a showcase of TypeScript + Playwright proficiency, API contract testing with Zod, and CI/CD design principles. Rather than focusing on feature count, it emphasizes clean architecture, idiomatic patterns, and thoughtful technical decisions—making it ideal for demonstrating skills to technical reviewers or hiring managers.

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[Global Setup] -->|login via API| B(Browser Context)
    B -->|storageState| C[Authenticated Tests]
    B -->|storageState| D[Unauthenticated Tests]
    C --> E[API Layer (Zod Schemas)]
    C --> F[Fixtures (test.extend)]
    F --> G[Page Object Model]
    G --> H[UI Tests]
    E --> H
    H --> I[Test Files]
```

**Flow Explanation:**
1. **Global Setup** (`global-setup.ts`) authenticates via API and saves browser state to `storageState`
2. **Browser Context** is created with saved state for authenticated tests
3. **Fixtures** provide typed page objects and API helpers to tests via `test.extend()`
4. **Page Object Model** encapsulates UI interactions and selectors
5. **API Layer** uses Zod for contract validation of responses
6. **Tests** consume fixtures and execute against both API and UI layers

## 📁 Folder Structure

```
argus-qa-framework/
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD pipelines
│       ├── pr-smoke.yml           # PR-triggered smoke tests
│       └── nightly-regression.yml # Scheduled full regression with Allure reporting
├── src/
│   ├── api/
│   │   └── schemas/               # API contract schemas (Zod)
│   │       └── product.schema.ts
│   ├── config/
│   │   ├── environments/          # Environment-specific configs
│   │   │   ├── dev.env
│   │   │   ├── prod.env
│   │   │   └── staging.env
│   │   └── env.ts                 # Zod validation for environment variables
│   ├── fixtures/                  # Test fixtures using test.extend()
│   │   └── test-options.ts
│   └── pages/                     # Page Object Model classes
│       ├── base.page.ts           # Base class with helpers (iframes, new tabs)
│       ├── cart.page.ts
│       ├── login.page.ts
│       └── product.page.ts
├── tests/
│   ├── api/                       # API contract tests
│   │   └── products.contract.spec.ts
│   ├── ui/                        # UI tests
│   │   ├── checkout-flow.spec.ts  # Smoke test: full checkout flow (@smoke)
│   │   └── edge-cases.spec.ts     # Edge cases: iframe, multi-tab (@regression)
│   └── global-setup.ts            # Authentication setup (login via API → storageState)
├── playwright.config.ts           # Test configuration (HTML + Allure reporters)
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── .env.example                   # Template for environment variables
```

## 🔐 Authentication Strategy: storageState vs localStorage

This framework uses Playwright's `storageState` for authentication rather than manual localStorage injection to ensure realistic browser state (cookies, localStorage, IndexedDB) is preserved. Authentication occurs once during global setup via API login, with the resulting state persisted to `playwright/.auth/user.json` and reused across test workers for improved performance and reliability.

## ▶️ Running Tests

### Smoke Tests (Fast Feedback)
```bash
# Run only smoke-tagged tests (login → search → add to cart → checkout)
npx playwright test --grep @smoke
```

### Full Regression Suite
```bash
# Execute all tests (smoke + regression/edge cases)
npx playwright test
```

### Headed Mode (For Debugging)
```bash
npx playwright test --headed
```

### With Trace Viewer (Post-Failure Analysis)
```bash
# After a test failure, view the trace
npx playwright show-report
```

### Docker Execution
```bash
# Build and run in container (matches CI environment)
docker build -t argus-qa-framework .
docker run --env-file .env argus-qa-framework
```

## 🔧 Extending the Framework

### Adding a New Page Object
1. Create a new TypeScript file in `src/pages/` (e.g., `checkout.page.ts`)
2. Extend the base `BasePage` class to inherit helper methods:
   ```typescript
   import { BasePage } from './base.page';
   
   export class CheckoutPage extends BasePage {
     // Define locators as readonly properties
     readonly placeOrderButton = this.page.locator('#place_order');
     
     // Add page-specific methods
     async placeOrder() {
       await this.placeOrderButton.click();
     }
   }
   ```
3. Verify locators against the target application (automationexercise.com or the-internet.herokuapp.com for edge cases)
4. Add comprehensive JSDoc comments for maintainability

### Adding a New Fixture
1. Import your new page class in `src/fixtures/test-options.ts`
2. Add it to the fixture type definition:
   ```typescript
   import { TestOptions, test } from '@playwright/test';
   import { LoginPage } from '../pages/login.page';
   import { YourNewPage } from './your-new-page'; // New import
   
   type CustomTestOptions = {
     loginPage: LoginPage;
     yourNewPage: YourNewPage; // New fixture
   };
   
   export const test = test.extend<CustomTestOptions>({
     loginPage: async ({ page }, use) => {
       await use(new LoginPage(page));
     },
     yourNewPage: async ({ page }, use) => { // New fixture definition
       await use(new YourNewPage(page));
     },
   });
   
   export { expect } from '@playwright/test';
   ```
3. Use the fixture in your test files:
   ```typescript
   import { test, expect } from '../fixtures/test-options';
   
   test('new feature test', async ({ yourNewPage }) => {
     await yourNewPage.someAction();
     // ... assertions
   });
   ```

## 🛠️ Development Commands

```bash
# Install dependencies
npm ci

# Type checking
npm run typecheck

# Linting and formatting
npm run lint

# Update Playwright browsers
npx playwright install

# Generate trace viewer after test failure
npx playwright show-report
```

## 📝 Environment Configuration

Copy `.env.example` to `.env` and populate with your test credentials:

```env
BASE_URL=https://automationexercise.com
TEST_USER_EMAIL=your-test-email@example.com
TEST_USER_PASSWORD=your-secure-password
```

**Note**: Never commit actual credentials to version control. The `.env` file is gitignored, and CI environments should use secrets management.

## 🔧 Setup Instructions

Follow these exact steps to get started:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/argus-qa-framework.git
cd argus-qa-framework

# 2. Install dependencies
npm ci

# 3. Create environment file from template
cp .env.example .env

# 4. Add your test credentials to .env (never commit this file)
#    Get credentials from test environment or create test account at automationexercise.com
echo "BASE_URL=https://automationexercise.com" >> .env
echo "TEST_USER_EMAIL=your-test-email@example.com" >> .env
echo "TEST_USER_PASSWORD=your-secure-password" >> .env

# 5. Install Playwright browsers
npx playwright install
```

## 🏗️ Design Principles

- **Type Safety**: Strict TypeScript mode with Zod validation for runtime safety
- **Test Isolation**: Each test gets a clean browser context unless explicitly sharing storageState
- **Maintainability**: Page Object Model reduces selector duplication
- **CI/CD Ready**: Dockerized for consistency between local and CI environments
- **Portfolio Focus**: Every decision prioritizes demonstrating engineering judgment over feature completeness

## 🔄 CI/CD Pipelines

### PR Smoke Workflow (`.github/workflows/pr-smoke.yml`)
- **Trigger**: Pull requests targeting `main` or `master` branches
- **Actions**: 
  - Installs dependencies and Playwright browsers
  - Runs only smoke-tagged tests (`@smoke`) using `npx playwright test --grep @smoke`
  - Provides fast feedback on PR changes
- **Environment**: Uses secrets for `BASE_URL`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD`

### Nightly Regression Workflow (`.github/workflows/nightly-regression.yml`)
- **Trigger**: 
  - Scheduled: Daily at 2:00 AM UTC (`0 2 * * *`)
  - Manual: Can be triggered manually via `workflow_dispatch`
- **Actions**:
  - Installs dependencies and Playwright browsers
  - Runs full test suite (`npx playwright test`)
  - Generates Allure HTML report
  - Deploys both Allure and Playwright reports to GitHub Pages
  - Reports are available under:
      - Run-specific: `https://shoaibahmed.github.io/argus-qa-framework/<run_number>/[allure-report|playwright-report]/index.html`
      - Latest: `https://shoaibahmed.github.io/argus-qa-framework/[allure-report|playwright-report]/latest/index.html`
  - Uploads Allure results as an artifact named `allure-report` (retained for 30 days)
  - Uploads Playwright report as an artifact on failure (retained for 30 days)
- **Artifact Location**: After a workflow run, navigate to Actions → [workflow run] → Artifacts → `allure-report` or `playwright-report` to download and view locally
- **GitHub Pages**: The latest reports are always available at:
        - Allure: `https://shoaibahmed.github.io/argus-qa-framework/allure-report/latest/index.html`
        - Playwright: `https://shoaibahmed.github.io/argus-qa-framework/playwright-report/latest/index.html`
## ⚠️ Known Limitations

Per PRODUCT.md's explicit out-of-scope definition, this framework intentionally omits:

- **No BDD/Cucumber/Gherkin layer** - Focuses on pure TypeScript/Playwright for cleaner code and better debugging
- **No visual regression testing** - Deliberately excluded to maintain focus on core API/UI validation skills
- **No accessibility (axe-core) testing** - Outside scope for this portfolio piece - Not included to avoid scope creep beyond core testing competencies
- **No mobile emulation/responsive test suite** - Limited to desktop Chromium and Firefox as specified
- **Secondary site usage constraints**: The-internet.herokuapp.com is used ONLY for 2-4 targeted edge-case tests (iframe, multi-tab, dynamic loading) via BasePage helpers - no full page objects or broad coverage
- **Test data limited to `@faker-js/faker`** - No external data seeding or database fixtures
- **Cross-browser matrix limited to Chromium + Firefox** - No WebKit or additional browsers to keep setup simple
- **No additional tools beyond specified stack** - No swapping of Zod/Joi, Allure/other reporters, etc.

## ✅ Verification

A technical reviewer can reproduce the verification steps from PRODUCT.md's Definition of Done:

```bash
# 1. Verify full test suite passes locally
npx playwright test
# Expected: 8/8 tests passed

# 2. Verify smoke tests run in isolation  
npx playwright test --grep @smoke
# Expected: 2/2 tests passed

# 3. Verify linting and type checking pass
npm run lint
# Expected: No ESLint errors
npm run typecheck
# Expected: No TypeScript errors

# 4. Verify GitHub Actions workflows exist and are valid
cat .github/workflows/pr-smoke.yml
# Expected: Valid YAML with PR trigger and smoke test command
cat .github/workflows/nightly-regression.yml
# Expected: Valid YAML with schedule, workflow_dispatch, and full test suite

# 5. Verify README explains key concepts
grep -A 5 "storageState" README.md
# Expected: Explanation of auth pattern using storageState instead of localStorage injection

# 6. Verify no extra files exist outside PRODUCT.md scope
# Manual verification: All files in repo should be referenced in PRODUCT.md scope sections
```