import { test, expect } from '../fixtures/baseTest';

test('has title', async ({ playwrightDev }) => {
  await playwrightDev.goto();

  // Expect a title "to contain" a substring.
  const title = await playwrightDev.pageTitle();
  expect(title).toMatch(/Playwright/);
});

test('get started link', async ({ playwrightDev }) => {
  await playwrightDev.goto();

  // Click the get started link.
  await playwrightDev.getStarted();

  // Add an assertion to satisfy ESLint rule: playwright/expect-expect
  // getStarted() already asserts visibility, so we can assert the URL to make it explicit in the test block
  await expect(playwrightDev.page).toHaveURL(/.*intro/);
});
