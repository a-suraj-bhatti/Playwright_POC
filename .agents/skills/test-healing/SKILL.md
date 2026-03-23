---
name: test-healing
description: Use when the user asks to fix, heal, stabilize, debug, or repair a failing automated test in this repository. Focus on reproducing the failure, identifying the real cause, validating any locator changes with Playwright MCP, applying the smallest safe fix, and rerunning the affected test before finishing.
---

# Test Healing

Use this skill when a user asks to fix a failing test, stabilize flaky coverage, or debug a broken Playwright scenario.

## Goals

- Reproduce the failure before changing code.
- Fix the root cause, not just the symptom.
- Keep the repair as small and local as possible.
- Preserve existing coverage intent unless the user asks to change behavior.
- Validate every new or changed locator with Playwright MCP before it enters the codebase.

## Workflow

### 1. Reproduce the failure

- Run the narrowest command that reproduces the problem first.
- Prefer a single spec, single project, or focused grep over the full suite unless the user asked for the full suite.
- Capture the exact failing step, assertion, and error output.

### 2. Classify the failure

Identify which bucket the failure fits into before editing:

- Locator drift
- Timing or wait issue
- Test data or environment issue
- Product behavior change
- Assertion mismatch
- Fixture or setup regression
- Cross-test state pollution

Do not rewrite the test until the likely cause is understood.

### 3. Inspect the live UI when locators are involved

If the failure touches a locator, UI action, or visible assertion:

1. Navigate with Playwright MCP.
2. Inspect the page with `browser_snapshot`.
3. Prefer semantic locators first.
4. Validate uniqueness with `browser_run_code`.
5. Test the interaction with `browser_click` or `browser_fill_form`.
6. Scope the locator if page-level matches are not unique.

Never guess a replacement locator from code alone.

### 4. Repair with the smallest safe change

Prefer fixes in this order:

1. Correct an invalid locator
2. Add a missing wait tied to a real UI state
3. Move reusable setup into a fixture or Page Object
4. Tighten or correct an assertion that no longer matches intended behavior
5. Refactor only when a small fix cannot solve the issue cleanly

Avoid:

- Broad sleeps without a state-based reason
- Weakening assertions just to make the test pass
- Rewriting large parts of a stable test for a narrow failure
- Editing unrelated tests in the same pass unless they share the same root cause

## Repository Rules

- Keep `*.spec.ts` files focused on test flow and assertions.
- Put reusable logic in Page Objects, fixtures, or `utils/`.
- Read credentials from `process.env`, not hardcoded literals.
- When changing locators in Page Objects, add validation comments.

## Verification

Before finishing:

1. Rerun the exact failing test.
2. Rerun any directly affected nearby test if the change touched shared setup or a shared Page Object.
3. Run lint if files changed in a way that could affect formatting or rules.
4. Summarize the root cause and the specific fix made.

Do not claim a fix is complete if the repaired test was not rerun, unless tooling or environment prevents it. If verification is blocked, state exactly what was blocked.
