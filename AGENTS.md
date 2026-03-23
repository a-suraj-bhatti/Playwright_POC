---

## ⚠️ CRITICAL RULES FOR AI AGENTS

### Rule 1: NO GUESSED LOCATORS
- **ALWAYS** use Playwright MCP tools to inspect the page before writing ANY locator
- **NEVER** hardcode selectors based on assumptions
- **ALWAYS** validate uniqueness (count === 1) before finalizing
- Reference: [.agents/PLAYWRIGHT_LOCATOR_GUIDE.md](.agents/PLAYWRIGHT_LOCATOR_GUIDE.md)

### Rule 2: MANDATORY LOCATOR VALIDATION WORKFLOW
Before a locator enters the codebase:
1. ✅ Page navigated and inspected with `mcp_playwright_browser_snapshot()`
2. ✅ Locator uniqueness verified with `mcp_playwright_browser_run_code()` (count must equal 1)
3. ✅ Locator tested with `mcp_playwright_browser_click()` or `mcp_playwright_browser_fill_form()`
4. ✅ No other elements on page match this locator (scoped if necessary)

### Rule 3: SEMANTIC LOCATORS FIRST
Always use this priority order:
1. `getByRole()` - Most robust
2. `getByLabel()` - For form inputs
3. `getByPlaceholder()` - For input fields
4. `getByText()` - For text content
5. `locator()` CSS - When semantic fails
6. `locator()` XPath - Last resort only

### Rule 4: DOCUMENT VALIDATION
When adding locators to page objects, include validation comments:
```typescript
// VALIDATED ✅ (count: 1, visible: true) - scoped to nav menu
this.manageEventsLink = navMenu.getByRole('link', { name: 'Manage Events' });
```

---

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
- `*.spec.ts` files must contain test declarations and test assertions only. Do not add helper functions, credential readers, data builders, or reusable workflow logic inside spec files.
- If test setup logic is reusable, move it into a Page Object, fixture, or `utils/` module before finalizing the spec.
- Credential access must not be implemented in spec files. Read `process.env` in a Page Object, fixture, or utility helper and expose a test-friendly method from there.

### TypeScript

- Use strict typing.
- Prefer `Locator` and `Page` types from `@playwright/test`.

## 🛠 Tools & Commands

We use **ESLint** for linting and **Prettier** for formatting.

| Action                | Command                                      |
| :-------------------- | :------------------------------------------- |
| **Run All Tests**     | `npx playwright test`                        |
| **Run Specific Test** | `npx playwright test tests/filename.spec.ts` |
| **Lint Code**         | `npm run lint`                               |
| **Fix Lint Issues**   | `npm run lint:fix`                           |
| **Format Code**       | `npm run format`                             |

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
- **Spec File Boundary**: Keep `tests/*.spec.ts` focused on scenario flow and assertions. If you are about to add a top-level function, stop and move that logic elsewhere.

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

### 4. Locator Generation Using Playwright MCP (CRITICAL)

**NEVER guess locators.** Refer to [.agents/PLAYWRIGHT_LOCATOR_GUIDE.md](.agents/PLAYWRIGHT_LOCATOR_GUIDE.md) for the complete locator workflow, validation steps, examples, and troubleshooting guidance.

### 4.1 Quick Code Generation Workflow

1. **Analyze Requirements**: Understand the page/test being requested.
2. **Inspect with MCP**: Follow the locator guide in `.agents/PLAYWRIGHT_LOCATOR_GUIDE.md`
3. **Generate Page Object**: Define locators using validated Playwright MCP tools
4. **Update Fixtures**: Add the new page to `baseTest.ts`
5. **Generate Test**: Create a `.spec.ts` file using the new fixture
6. **Verify**: Run test against actual application to confirm locators work

---

## 🤖 Agent Skills & Workflows

### JIRA Integration

**When user asks to fetch JIRA data or automate tests based on JIRA stories:**

You MUST use the **JIRA_Skill** located at `.agents/skills/JIRA_Skill/skill.md`. This skill provides:
- Fetching JIRA story details (summary, description, acceptance criteria)
- Retrieving linked "QAlity Test" work items with full test case descriptions
- Structured output for ground-truth test requirements

**Usage**: If user requests anything like:
- "Fetch JIRA story SCRUM-5"
- "Get test cases from JIRA"
- "Automate tests for JIRA story"
- "Pull requirements from JIRA"

Use the JIRA_Skill to retrieve all context before generating test code.

### Playwright Locator Generation

For detailed guidance on creating, validating, and troubleshooting Playwright locators, refer to:
- **Single Reference**: [.agents/PLAYWRIGHT_LOCATOR_GUIDE.md](.agents/PLAYWRIGHT_LOCATOR_GUIDE.md)

---
