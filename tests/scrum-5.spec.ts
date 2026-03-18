import { expect, test } from '../fixtures/baseTest';

test.describe('SCRUM-5 - Admin menu labels', () => {
  test('shows Manage Events and Manage Bookings under the Admin dropdown', async ({
    eventHubHomePage,
    eventHubLoginPage,
  }) => {
    await eventHubLoginPage.goto();
    await eventHubLoginPage.loginWithConfiguredCredentials();

    await eventHubHomePage.openAdminMenu();

    await expect(eventHubHomePage.manageEventsLink).toHaveText('Manage Events');
    await expect(eventHubHomePage.manageEventsLink).toHaveAttribute('href', '/admin/events');

    await expect(eventHubHomePage.manageBookingsLink).toHaveText('Manage Bookings');
    await expect(eventHubHomePage.manageBookingsLink).toHaveAttribute('href', '/admin/bookings');
  });
});
