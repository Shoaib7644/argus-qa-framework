# MICRO_PROMPTS.md — Argus QA Framework

Paste these one at a time as separate messages to Claude Code, in order. Wait for each one to finish, verify, and log to `PROGRESS.md` before sending the next. Don't paste two in a row in the same message — that's the batching this whole approach is meant to avoid.

Before prompt 1, drop `PRODUCT.md` and `CLAUDE.md` into the empty project folder — Claude Code reads `CLAUDE.md` automatically.

---

### Prompt 1 — Init
Read PRODUCT.md and CLAUDE.md. Initialize the argus-qa-framework repo: `npm init playwright@latest -- --typescript`, then add zod, dotenv, @faker-js/faker, allure-playwright as dependencies. Do not write any test or page object code yet. Verify the install with `npx playwright --version` and report the output. Create PROGRESS.md from the template in CLAUDE.md and log this as Step 1.

### Prompt 2 — Lint/format/git hooks
Set up ESLint (TypeScript config), Prettier, and Husky + lint-staged so staged files are linted and formatted on commit. Verify with `npm run lint` on the current repo (should pass with zero files needing changes on this fresh scaffold). Log as Step 2.

### Prompt 3 — Env config layer
Create `src/config/env.ts` with a Zod schema validating BASE_URL, TEST_USER_EMAIL, TEST_USER_PASSWORD. Create `src/config/environments/dev.env`, `staging.env`, `prod.env` per PRODUCT.md, and `.env.example`. Do not wire this into playwright.config.ts yet — that's the next step. Verify by writing a throwaway script that imports env.ts and confirms it throws a clear error when a required var is missing, then delete the throwaway script. Log as Step 3.

### Prompt 4 — global-setup.ts + storageState wiring
Implement `tests/global-setup.ts` and wire `playwright.config.ts` for storageState auth, exactly per the pattern in the build brief (login via API in global setup, save storageState, reuse across projects, with an `unauthenticated` project for the login test itself). Before writing the login call, check automationexercise.com's actual `/api/login` request/response shape (it may differ from a generic guess) and note the real shape in PROGRESS.md. Verify by running the global setup in isolation and confirming `storage-state/user.json` is created. Log as Step 4, including the confirmed API shape.

### Prompt 5 — BasePage + helpers
Create `src/pages/base.page.ts` with `getFrameLocator()` and `performActionInNewTab()` helpers only — no site-specific logic. Verify it compiles (`npm run typecheck`). Log as Step 5.

### Prompt 6 — LoginPage
Create `src/pages/login.page.ts` against automationexercise.com's real login form (inspect actual field selectors — don't assume placeholder text matches the brief's earlier examples, which referenced a different site). Log the real selectors used in PROGRESS.md. Log as Step 6.

### Prompt 7 — ProductPage
Create `src/pages/product.page.ts` covering: navigate to products, search, add first result to cart. Verify selectors against the live site. Log as Step 7.

### Prompt 8 — CartPage
Create `src/pages/cart.page.ts` covering: view cart, proceed to checkout button visibility. Log as Step 8.

### Prompt 9 — Fixtures
Create `src/fixtures/test-options.ts` per the fixture pattern in the build brief, wiring loginPage/productPage/cartPage as fixtures. Verify with `npm run typecheck`. Log as Step 9.

### Prompt 10 — Product API schema
Create `src/api/schemas/product.schema.ts`. Before finalizing the Zod schema, actually call `GET https://automationexercise.com/api/productsList` (via curl or a throwaway script) and confirm the real response shape matches what's assumed — adjust the schema if not. Log the confirmed shape in PROGRESS.md. Log as Step 10.

### Prompt 11 — API contract test
Create `tests/api/products.contract.spec.ts` using the schema from Step 10, tagged `@smoke`. Run it and paste the actual pass/fail output into PROGRESS.md. Log as Step 11.

### Prompt 12 — UI smoke test
Create `tests/ui/checkout-flow.spec.ts` using the fixtures from Step 9, tagged `@smoke`. Run `npx playwright test --grep @smoke` and log actual output. Log as Step 12.

### Prompt 13 — Edge-case tests
Create `tests/ui/edge-cases.spec.ts` against the-internet.herokuapp.com: one iframe test, one multi-tab test, both using BasePage helpers from Step 5, tagged `@regression`. Do not add page objects for this site — call BasePage helpers directly from the test. Run and log output. Log as Step 13.

### Prompt 14 — Dockerfile
Create a Dockerfile based on the official Playwright image matching the installed Playwright version. Verify by building the image locally (`docker build .`) and report the result. Log as Step 14.

### Prompt 15 — PR smoke workflow
Create `.github/workflows/pr-smoke.yml` running `--grep @smoke` on pull_request. Do not create the nightly workflow yet. Log as Step 15.

### Prompt 16 — Nightly regression workflow
Create `.github/workflows/nightly-regression.yml` running the full suite on a cron schedule plus `workflow_dispatch`, publishing the Allure report as an artifact. Trigger it manually once via workflow_dispatch if possible and report the result. Log as Step 16.

### Prompt 17 — README
Write README.md: project purpose (one paragraph, portfolio framing per PRODUCT.md), folder structure, the storageState-vs-localStorage reasoning, how to run `@smoke` vs full suite, and how to add a new page object + fixture. Log as Step 17.

### Prompt 18 — Final verification pass
Go through PRODUCT.md's "Definition of done" checklist item by item. For each item, run the actual verification command and report pass/fail. Do not mark anything done without command output. Summarize any gaps found. Log as Step 18 — this is the last step.
