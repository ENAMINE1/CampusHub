// Zod schemas for sign-up and login bodies (SPEC.md FR-1.1).
import * as z from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email());

export const registerBody = z.strictObject({
  name: z.string().trim().min(2).max(60),
  email,
  // bcrypt only reads the first 72 bytes, so longer passwords would be silently cut.
  password: z.string().min(8).max(72),
});

export const loginBody = z.strictObject({
  email,
  password: z.string().min(1).max(72),
});
