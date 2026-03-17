import { test as base } from '@playwright/test';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

// Declare the types of your page objects
type MyFixtures = {
  playwrightDev: PlaywrightDevPage;
};

// Extend base test by providing our initialized page objects
export const test = base.extend<MyFixtures>({
  playwrightDev: async ({ page }, use) => {
    // Set up the fixture
    const playwrightDev = new PlaywrightDevPage(page);

    // Use the fixture value in the test
    await use(playwrightDev);
  },
});

export { expect } from '@playwright/test';
