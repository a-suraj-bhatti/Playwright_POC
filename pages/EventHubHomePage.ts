import { expect, type Locator, type Page } from '@playwright/test';

export class EventHubHomePage {
  readonly page: Page;
  readonly navigationMenu: Locator;
  readonly adminButton: Locator;
  readonly manageEventsLink: Locator;
  readonly manageBookingsLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // VALIDATED ✅ (count: 1, visible: true, scoped to header navigation)
    this.navigationMenu = page.locator('nav');
    // VALIDATED ✅ (count: 1, visible: true, scoped to nav menu)
    this.adminButton = this.navigationMenu.getByRole('button', { name: 'Admin' });
    // VALIDATED ✅ (count: 1, visible: true after expanding Admin, scoped to nav menu)
    this.manageEventsLink = this.navigationMenu.getByRole('link', { name: 'Manage Events' });
    // VALIDATED ✅ (count: 1, visible: true after expanding Admin, scoped to nav menu)
    this.manageBookingsLink = this.navigationMenu.getByRole('link', { name: 'Manage Bookings' });
  }

  async openAdminMenu(): Promise<void> {
    await this.adminButton.click();
    await expect(this.manageEventsLink).toBeVisible();
    await expect(this.manageBookingsLink).toBeVisible();
  }
}
