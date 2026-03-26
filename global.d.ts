import { type ZodType } from 'zod';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toMatchSchema(schema: ZodType): Promise<R>;
    }
  }
}

export {};
