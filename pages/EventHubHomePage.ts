import { type Locator, type Page } from '@playwright/test';

export class EventHubHomePage {
  readonly page: Page;
  readonly adminButton: Locator;
  readonly manageEventsLink: Locator;
  readonly manageBookingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // VALIDATED ✅ (count: 1, visible: true, semantic role button)
    this.adminButton = page.getByRole('button', { name: 'Admin' });
    const navigation = page.getByRole('navigation');
    // VALIDATED ✅ (count: 1, visible: true after opening Admin menu) - scoped to navigation to avoid footer duplicate
    this.manageEventsLink = navigation.getByRole('link', { name: 'Manage Events' });
    // VALIDATED ✅ (count: 1, visible: true after opening Admin menu) - scoped to navigation dropdown
    this.manageBookingsLink = navigation.getByRole('link', { name: 'Manage Bookings' });
  }

  async openAdminMenu() {
    await this.adminButton.click();
  }
}
