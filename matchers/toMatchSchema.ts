import { expect, type APIResponse } from '@playwright/test';
import { type ZodType } from 'zod';

expect.extend({
  async toMatchSchema(received: APIResponse, schema: ZodType) {
    const response = await received.json();
    const result = await schema.safeParseAsync(response);

    if (result.success) {
      return {
        message: () => 'schema matched',
        pass: true,
      };
    }

    return {
      message: () =>
        'Result does not match schema: ' +
        result.error.issues.map((issue) => issue.message).join('\n') +
        '\nDetails: ' +
        JSON.stringify(result.error, null, 2),
      pass: false,
    };
  },
});
