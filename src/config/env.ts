import { z } from 'zod';

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
  TEST_USER_EMAIL: z.string().email(),
  TEST_USER_PASSWORD: z.string().min(1),
});

export const env = EnvSchema.parse(process.env);
