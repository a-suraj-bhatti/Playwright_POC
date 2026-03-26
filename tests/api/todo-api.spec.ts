import { expect, test } from '@playwright/test';
import { todoSchema } from '../../schemas/todoSchema';

test('get todo returns a todo item', async ({ request }) => {
  const todoResponse = await request.get('/todos/1');

  expect(todoResponse.ok()).toBeTruthy();
  await expect(todoResponse).toMatchSchema(todoSchema);
});
