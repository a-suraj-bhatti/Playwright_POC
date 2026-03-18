import { expect, type Locator, type Page } from '@playwright/test';

export class EventHubLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // VALIDATED ✅ (count: 1, visible: true, getByLabel on login page)
    this.emailInput = page.getByLabel('Email');
    // VALIDATED ✅ (count: 1, visible: true, getByLabel on login page)
    this.passwordInput = page.getByLabel('Password');
    // VALIDATED ✅ (count: 1, visible: true, semantic role button)
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.page).toHaveURL('https://eventhub.rahulshettyacademy.com/');
  }

  async loginWithConfiguredCredentials(): Promise<void> {
    const email = process.env.EVENTHUB_USERNAME ?? process.env.USERNAME ?? process.env.username;
    const password = process.env.EVENTHUB_PASSWORD ?? process.env.PASSWORD ?? process.env.password;

    if (!email || !password) {
      throw new Error(
        'Missing EventHub credentials. Set EVENTHUB_USERNAME/EVENTHUB_PASSWORD or USERNAME/PASSWORD in .env.',
      );
    }

    await this.login(email, password);
  }
}
