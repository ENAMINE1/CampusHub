// The login rate limit: the 6th attempt within 15 minutes from one IP gets 429.
// Its own file, so this test's attempts do not use up the limit for other tests.
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('POST /api/v1/auth/login rate limit', () => {
  it('allows 5 attempts, then answers 429 in the standard error shape', async () => {
    const attempt = () =>
      request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'guess@campus.edu', password: 'wrong-guess' });

    for (let i = 0; i < 5; i += 1) {
      expect((await attempt()).status).toBe(401);
    }
    const blocked = await attempt();
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('TOO_MANY_REQUESTS');
    expect(blocked.headers.ratelimit).toBeDefined();
  });
});
