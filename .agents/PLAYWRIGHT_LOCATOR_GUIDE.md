# Playwright Locator Guide

This is the single source of truth for locator discovery, validation, and usage in this repository.

## Core Rules

1. Never guess locators.
2. Always inspect the page with Playwright MCP before writing a locator.
3. Prefer semantic locators over CSS or XPath.
4. Validate every locator before it enters the codebase.
5. Add a validation comment for every page object locator.

## Required Workflow

### 1. Navigate and inspect

Use MCP to open the page and inspect its structure before writing any locator.

```text
mcp_playwright_browser_navigate()
mcp_playwright_browser_wait_for()
mcp_playwright_browser_snapshot()
```

Do not create selectors from assumptions, screenshots, or guessed HTML.

### 2. Create the initial locator

Use this priority order:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `locator()` with CSS
6. `locator()` with XPath

Examples:

```typescript
page.getByRole('button', { name: 'Sign In' });
page.getByLabel('Email');
page.getByPlaceholder('Enter email');
page.getByText('Manage Events');
```

Avoid brittle selectors such as:

```typescript
page.locator('button').nth(0);
page.locator('#email-input');
page.locator('//button[1]');
```

### 3. Validate uniqueness

Before a locator is used in code, verify that it matches exactly one element.

```javascript
mcp_playwright_browser_run_code({
  code: `async (page) => {
    const locator = page.getByRole('button', { name: 'Sign In' });
    const count = await locator.count();
    const isVisible = await locator.isVisible().catch(() => false);
    const boundingBox = await locator.boundingBox().catch(() => null);

    return {
      count,
      isVisible,
      isInteractive: boundingBox !== null,
      uniqueMatch: count === 1
    };
  }`
})
```

Expected result:

- `count === 1`
- `isVisible === true`
- `isInteractive === true`
- `uniqueMatch === true`

### 4. Refine when count is not 1

If the locator matches multiple elements, scope it to the correct container or make it more specific.

```typescript
// Too broad
page.getByRole('link', { name: 'Manage Events' });

// Better: scoped to the correct region
const navMenu = page.locator('header, nav').first();
navMenu.getByRole('link', { name: 'Manage Events' });
```

If the locator matches zero elements:

1. Re-check the snapshot.
2. Confirm the element is rendered in the current state.
3. Wait for it if it is dynamic.
4. Check whether it is inside an iframe or shadow DOM.
5. Try the next-best semantic locator.

### 5. Test the interaction

After uniqueness is confirmed, test that the locator works through MCP.

```text
mcp_playwright_browser_click()
mcp_playwright_browser_fill_form()
```

This confirms the element is not only present, but usable.

### 6. Add the locator to the page object

Keep locators in the constructor and include validation comments.

```typescript
import { type Locator, type Page } from '@playwright/test';

export class MyPage {
  readonly signInButton: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    // VALIDATED ✅ (count: 1, visible: true, semantic role)
    this.signInButton = page.getByRole('button', { name: 'Sign In' });

    // VALIDATED ✅ (count: 1, visible: true, placeholder)
    this.emailInput = page.getByPlaceholder('Enter email');
  }
}
```

## Validation Checklist

Before finalizing any locator:

- Page inspected with `mcp_playwright_browser_snapshot()`
- Semantic locator attempted first
- Uniqueness verified with `mcp_playwright_browser_run_code()`
- `count === 1`
- Element is visible
- Element is interactable
- Locator tested with click or fill when applicable
- Validation comment added in the page object
- Locator scoped if multiple similar elements exist

## Common Problems

### Multiple matches

Symptoms:

- `count > 1`

Fixes:

- Scope to a parent container
- Use more specific accessible name
- Use exact text when appropriate
- Filter to the correct region before selecting the child

### Element not found

Symptoms:

- `count === 0`

Fixes:

- Re-check the snapshot
- Wait for the UI to settle
- Trigger the action that reveals the element
- Check iframe or shadow DOM
- Try another semantic strategy

### Works in MCP but fails in test

Symptoms:

- Timing or state issues in real test execution

Fixes:

```typescript
await this.signInButton.waitFor({ state: 'visible', timeout: 5000 });
await this.signInButton.click();
```

## Red Flags

Do not merge locators that rely on:

- `.nth(0)` or index-based selection
- brittle IDs or transient classes without necessity
- guessed CSS or XPath
- unvalidated text matches
- comments missing validation evidence

## When To Escalate Or Clarify

Pause and clarify if:

- multiple identical elements are all valid matches
- the element appears only after a user-specific flow
- the element is inside an iframe or shadow DOM
- the visible text changes often and no stable attribute exists

## Quick Example

```text
1. Navigate to the page
2. Take a snapshot
3. Try getByRole()
4. Validate with run_code()
5. Confirm count === 1
6. Test click/fill
7. Add to page object with // VALIDATED ✅
```

## Final Standard

Every locator in this repository must have a validation story. If it was not inspected with MCP and verified as unique before being added to code, it should not be used.
