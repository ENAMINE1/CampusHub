// Integration test of a whole session, only through HTTP like the React app does it:
// sign up, call a protected route, refresh, log out, and check the old session is dead.
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

const cookieFrom = (res) => res.headers['set-cookie'][0].split(';')[0];

describe('a full login session', () => {
  it('sign up → /me → refresh → /me → logout → refresh refused', async () => {
    // One agent per browser tab: the test passes cookies by hand to show exactly what moves.
    const api = request(app);
    const signup = await api
      .post('/api/v1/auth/register')
      .send({ name: 'Nia', email: 'nia@int.test', password: 'longenough1' })
      .expect(201);
    expect(signup.body.user).toMatchObject({ email: 'nia@int.test', role: 'student' });

    const me = await api
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${signup.body.accessToken}`)
      .expect(200);
    expect(me.body.user.email).toBe('nia@int.test');

    const refreshed = await api
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookieFrom(signup))
      .expect(200);
    await api
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${refreshed.body.accessToken}`)
      .expect(200);

    await api
      .post('/api/v1/auth/logout')
      .set('Cookie', cookieFrom(refreshed))
      .expect(204);
    await api
      .post('/api/v1/auth/refresh')
      .set('Cookie', cookieFrom(refreshed))
      .expect(401);
  });

  it('logs in with the account just created, and never leaks the password hash', async () => {
    const api = request(app);
    await api
      .post('/api/v1/auth/register')
      .send({ name: 'Omar', email: 'omar@int.test', password: 'longenough1' })
      .expect(201);
    const login = await api
      .post('/api/v1/auth/login')
      .send({ email: 'omar@int.test', password: 'longenough1' })
      .expect(200);
    expect(JSON.stringify(login.body)).not.toMatch(/passwordHash|refreshTokenHash/);
  });

  it('a garbage token is 401, a student on an admin route is 403', async () => {
    const api = request(app);
    await api.get('/api/v1/auth/me').set('Authorization', 'Bearer not-a-jwt').expect(401);
    const signup = await api
      .post('/api/v1/auth/register')
      .send({ name: 'Pia', email: 'pia@int.test', password: 'longenough1' });
    await api
      .get('/api/v1/admin/stats')
      .set('Authorization', `Bearer ${signup.body.accessToken}`)
      .expect(403);
  });
});
