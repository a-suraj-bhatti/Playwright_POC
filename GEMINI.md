# Project Guidelines & Rules

This document outlines the standards, folder structure, and conventions used in the **Praveen_POC** Playwright project.

## 🏗 Project Structure

The project follows the **Page Object Model (POM)** pattern to ensure maintainability and scalability.

```text
/
├── .agents/             # AI Agent skills and workflows
├── .husky/              # Git hooks (pre-commit linting)
├── fixtures/            # Playwright test fixtures (baseTest, etc.)
├── pages/               # Page Object classes (selectors & actions)
├── tests/               # Test specifications (*.spec.ts)
├── utils/               # Common utility functions
├── playwright.config.ts # Playwright configuration
└── package.json         # Scripts and dependencies
```

## 📜 Coding Standards

### Naming Conventions
- **Pages**: Use `PascalCase` and suffix with `Page.ts`. (e.g., `EventHubLoginPage.ts`)
- **Tests**: Use `kebab-case` and suffix with `.spec.ts`. (e.g., `scrum-5.spec.ts`)
- **Locators**: Use `camelCase` for locator variables. (e.g., `signInButton`)

### Page Object Model (POM)
- Keep selectors inside the `constructor`.
- Methods should perform actions or retrieve data, not contain complex assertions.
- Reuse logic where possible.

### TypeScript
- Use strict typing.
- Prefer `Locator` and `Page` types from `@playwright/test`.

## 🛠 Tools & Commands

We use **ESLint** for linting and **Prettier** for formatting.

| Action | Command |
| :--- | :--- |
| **Run All Tests** | `npx playwright test` |
| **Run Specific Test** | `npx playwright test tests/filename.spec.ts` |
| **Lint Code** | `npm run lint` |
| **Fix Lint Issues** | `npm run lint:fix` |
| **Format Code** | `npm run format` |

## 🚀 Git Workflow & Hooks

- **Husky**: A pre-commit hook is configured to run `lint-staged`.
- **Pre-commit**: Automatically runs `eslint --fix` and `prettier --write` on staged files to ensure code quality before every commit.

---

## 🤖 Information for AI Agents

When generating code or adding new features, follow these instructions to maintain project integrity:

### 1. File Placement
- **New Page Objects**: Save in `pages/` (e.g., `pages/MyNewPage.ts`).
- **New Test Files**: Save in `tests/` (e.g., `tests/my-new-test.spec.ts`).
- **Utility Functions**: Save in `utils/` (e.g., `utils/dateHelpers.ts`).

### 2. Integration with Fixtures
**Crucial Step**: When you create a new Page Object class, you **MUST** register it in [baseTest.ts](fixtures/baseTest.ts) so it's available as a fixture in tests.
1. Import the new page class.
2. Add the page type to the `MyFixtures` type definition.
3. Extend the `test` object with the new page initialization.

### 3. Application Credentials
- All application credentials (e.g., usernames, passwords, API keys, base URLs) are **always** stored in the **`.env`** file located at the **project root**.
- When generating tests or utilities that require credentials, **always read them from `process.env`** — never hardcode credentials directly in test or page object files.
- **Important**: You **must** ensure `dotenv.config()` is called **before** any test executes so that the `dotenv` library loads the `.env` file and populates `process.env`. The recommended place to call this is at the top of `playwright.config.ts`:
  ```typescript
  import dotenv from 'dotenv';
  import path from 'path';
  dotenv.config({ path: path.resolve(__dirname, '.env') });
  ```
- Example usage in a test or page:
  ```typescript
  const username = process.env.USERNAME!;
  const password = process.env.PASSWORD!;
  ```

### 4. Code Generation Workflow
1. **Analyze Requirements**: Understand the page/test being requested.
2. **Generate Page Object**: Define locators and action methods.
3. **Update Fixtures**: Add the new page to `baseTest.ts`.
4. **Generate Test**: Create a `.spec.ts` file using the new fixture.
5. **Verify**: Ensure code follows the `PascalCase` for pages and `kebab-case` for tests.

---
