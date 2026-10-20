// Limits how often one IP address may try to log in: 5 attempts per 15 minutes (SPEC.md).
// Slows down password guessing without bothering real users.
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8', // tell clients how long to wait in a RateLimit header
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Try again in 15 minutes.',
      details: [],
    },
  },
});
