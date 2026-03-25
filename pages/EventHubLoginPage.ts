import { type Locator, type Page } from '@playwright/test';

export class EventHubLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly invalidCredentialsToast: Locator;

  constructor(page: Page) {
    this.page = page;
    // VALIDATED ✅ (count: 1, visible: true, semantic role textbox)
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    // VALIDATED ✅ (count: 1, visible: true, semantic role textbox)
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    // VALIDATED ✅ (count: 1, visible: true, semantic role button)
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    // VALIDATED ✅ (count: 1, visible: true after invalid login, semantic text)
    this.invalidCredentialsToast = page.getByText('Invalid email or password', {
      exact: true,
    });
  }

  async goto() {
    await this.page.goto('https://eventhub.rahulshettyacademy.com/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async loginWithDefaultUser() {
    const email = process.env.username;
    const password = process.env.password;

    if (!email || !password) {
      throw new Error('Missing EventHub credentials in .env: username and password are required.');
    }

    await this.login(email, password);
  }
}
