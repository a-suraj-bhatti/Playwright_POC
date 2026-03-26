# Playwright_POC

This is a proof of concept project.

## Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Add a `.env` file in the project root for UI and API configuration.
4. Run the project.

## Environment Variables

The Playwright config already loads `.env` before tests run.

Example values:

```env
username=your-ui-username
password=your-ui-password
API_BASE_URL=https://jsonplaceholder.typicode.com
API_AUTH_TOKEN=
```

## API Testing

For a simple demo, the API example follows the Playwright + Zod todo scenario:

- Run only API tests: `npm run test:api`
- Example schema: [`schemas/todoSchema.ts`](/Users/surajbhatti/Documents/Prospect Info Systems_PW_Framework/schemas/todoSchema.ts)
- Example spec: [`tests/api/todo-api.spec.ts`](/Users/surajbhatti/Documents/Prospect Info Systems_PW_Framework/tests/api/todo-api.spec.ts)
- Custom matcher: [`matchers/toMatchSchema.ts`](/Users/surajbhatti/Documents/Prospect Info Systems_PW_Framework/matchers/toMatchSchema.ts)
- Matcher typing: [`global.d.ts`](/Users/surajbhatti/Documents/Prospect Info Systems_PW_Framework/global.d.ts)

The demo flow is:

1. Send the API request with Playwright.
2. Check the response is successful.
3. Validate the JSON shape with Zod using `expect(response).toMatchSchema(schema)`.
