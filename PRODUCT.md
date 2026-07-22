# PRODUCT.md — Argus QA Framework

Read this file in full before writing any code, and re-read it if you're resuming after a context reset. This is the source of truth for what this project is and is not.

## What this is

An enterprise-grade **hybrid API + UI test automation framework** built in **Playwright + TypeScript**, targeting real-world practice applications, to serve as a portfolio artifact demonstrating:
- TypeScript + Playwright proficiency (fixtures, `storageState`, POM)
- API contract testing (Zod)
- CI/CD design (tiered GitHub Actions pipelines)

The audience is a technical reviewer (hiring manager / senior SDET) evaluating engineering judgment, not just working code. Clean structure, idiomatic patterns, and restraint matter more than feature count.

## Target applications

- **Primary (API + UI):** https://automationexercise.com — REST API at `/api_list` plus full UI (login, products, cart, checkout).
- **Secondary (edge cases only):** https://the-internet.herokuapp.com — used ONLY for iframe, multi-tab/window, and dynamic-loading tests via `BasePage` helpers. Do not build full page objects or broad coverage against this site — it exists for 2-4 targeted edge-case tests, nothing more.

## Tech stack (fixed — do not substitute or add alternatives without asking)

- Playwright Test runner (native — no BDD/Cucumber layer)
- TypeScript, strict mode
- Zod for schema/contract validation and env validation
- dotenv for environment config
- ESLint + Prettier + Husky + lint-staged
- Allure for reporting
- Docker (Playwright's official image) for CI parity
- GitHub Actions for CI/CD

## Scope — in

- API contract tests for at least 2 endpoints (products, login)
- UI tests: one full checkout-style flow, tagged `@smoke`
- Edge-case UI tests: iframe + multi-tab, tagged `@regression`
- `storageState`-based auth via `global-setup.ts` (see ARCHITECTURE notes in README once written)
- Custom fixtures (`test.extend`) — page objects are never instantiated directly inside a test file
- Typed, Zod-validated env config across dev/staging/prod
- Two GitHub Actions workflows: PR smoke run, nightly full regression with Allure publish
- Dockerfile for local/CI parity
- README documenting architecture and the reasoning behind `storageState` over manual localStorage injection

## Scope — explicitly OUT (do not build these unless the user asks)

- No Cucumber/Gherkin/BDD layer
- No visual regression testing
- No accessibility (axe-core) testing
- No mobile emulation / responsive test suite
- No test data seeding beyond `@faker-js/faker` for form inputs
- No parallel cross-browser matrix beyond Chromium + Firefox
- No additional target applications beyond the two listed above
- No renaming the project, changing the folder structure, or introducing new top-level tools (e.g., swapping Zod for Joi, or Allure for a different reporter) without asking first

## Definition of done

Every item below must be true before this is considered complete:
1. `npx playwright test` passes locally against automationexercise.com
2. `npx playwright test --grep @smoke` completes in isolation
3. `npm run lint` and `npm run typecheck` both pass with zero errors
4. PR-triggered GitHub Actions workflow passes on a real PR
5. Nightly workflow is present, scheduled, and has been dry-run at least once (workflow_dispatch)
6. README explains: folder structure, auth pattern, how to run smoke vs. full suite, how to add a new page object + fixture
7. No file exists in the repo that isn't referenced by this document's scope

## Working agreement

If a step in the build seems to require something outside this document's scope, or a target site behaves differently than expected (selector doesn't exist, API shape differs), **stop and report the discrepancy instead of improvising a workaround that expands scope**. This document is the contract — deviations get flagged, not silently absorbed.
