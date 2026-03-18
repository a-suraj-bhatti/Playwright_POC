import { test as base } from '@playwright/test';
import { EventHubHomePage } from '../pages/EventHubHomePage';
import { EventHubLoginPage } from '../pages/EventHubLoginPage';
import { PlaywrightDevPage } from '../pages/PlaywrightDevPage';

// Declare the types of your page objects
type MyFixtures = {
  eventHubHomePage: EventHubHomePage;
  eventHubLoginPage: EventHubLoginPage;
  playwrightDev: PlaywrightDevPage;
};

// Extend base test by providing our initialized page objects
export const test = base.extend<MyFixtures>({
  eventHubHomePage: async ({ page }, use) => {
    const eventHubHomePage = new EventHubHomePage(page);
    await use(eventHubHomePage);
  },

  eventHubLoginPage: async ({ page }, use) => {
    const eventHubLoginPage = new EventHubLoginPage(page);
    await use(eventHubLoginPage);
  },

  playwrightDev: async ({ page }, use) => {
    const playwrightDev = new PlaywrightDevPage(page);
    await use(playwrightDev);
  },
});

export { expect } from '@playwright/test';
