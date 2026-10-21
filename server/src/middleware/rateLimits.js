// Rate limits (SPEC.md): every IP may make 300 API requests per 15 minutes, and only 5 login
// attempts. Slows down scraping and password guessing without bothering real users.
import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

function limiter(limit, message) {
  return rateLimit({
    windowMs: FIFTEEN_MINUTES,
    limit,
    standardHeaders: 'draft-8', // tell clients how long to wait in a RateLimit header
    legacyHeaders: false,
    message: { error: { code: 'TOO_MANY_REQUESTS', message, details: [] } },
  });
}

export const apiLimiter = limiter(300, 'Too many requests. Try again in 15 minutes.');
export const loginLimiter = limiter(
  5,
  'Too many login attempts. Try again in 15 minutes.',
);
