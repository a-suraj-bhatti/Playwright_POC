import { expect } from '@playwright/test';
import { test } from '../fixtures/baseTest';

test.describe('SCRUM-5 Admin menu labels', () => {
  test('SCRUM-8: shows renamed Admin dropdown options after successful login', async ({
    eventHubHomePage,
    eventHubLoginPage,
    page,
  }) => {
    await eventHubLoginPage.goto();
    await eventHubLoginPage.loginWithDefaultUser();

    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/');

    await eventHubHomePage.openAdminMenu();

    await expect(eventHubHomePage.manageEventsLink).toBeVisible();
    await expect(eventHubHomePage.manageEventsLink).toHaveText('Manage Events');
    await expect(eventHubHomePage.manageBookingsLink).toBeVisible();
    await expect(eventHubHomePage.manageBookingsLink).toHaveText('Manage Bookings');
  });

  test('SCRUM-9: shows an error toast for invalid login', async ({ eventHubLoginPage, page }) => {
    await eventHubLoginPage.goto();
    await eventHubLoginPage.login('invalid@example.com', 'WrongPass123!');

    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/login');
    await expect(eventHubLoginPage.invalidCredentialsToast).toBeVisible();
    await expect(eventHubLoginPage.invalidCredentialsToast).toHaveText('Invalid email or password');
  });
});
