// API tests for signing up and logging in.
import { describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';

const api = request(app);
const asha = { name: 'Asha', email: 'asha@campus.edu', password: 'longenough1' };

describe('POST /api/v1/auth/register', () => {
  it('creates a student and returns an access token, never the password hash', async () => {
    const res = await api.post('/api/v1/auth/register').send(asha);
    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({
      id: expect.any(String),
      name: 'Asha',
      email: 'asha@campus.edu',
      role: 'student',
    });
    expect(JSON.stringify(res.body)).not.toContain('longenough1');
    expect(jwt.decode(res.body.accessToken)).toMatchObject({ sub: res.body.user.id });
  });

  it('refuses a second account with the same email (409)', async () => {
    const res = await api
      .post('/api/v1/auth/register')
      .send({ ...asha, email: 'ASHA@campus.edu' });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('rejects a short password (422)', async () => {
    const res = await api
      .post('/api/v1/auth/register')
      .send({ name: 'Ravi', email: 'ravi@campus.edu', password: 'short' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('logs in with the right password', async () => {
    const res = await api
      .post('/api/v1/auth/login')
      .send({ email: asha.email, password: asha.password });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(expect.any(String));
  });

  it('gives the same 401 for a wrong password and an unknown email', async () => {
    const wrongPassword = await api
      .post('/api/v1/auth/login')
      .send({ email: asha.email, password: 'wrong-password' });
    const unknownEmail = await api
      .post('/api/v1/auth/login')
      .send({ email: 'nobody@campus.edu', password: 'whatever1' });

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownEmail.body);
  });
});

describe('refresh token cookie', () => {
  // An agent keeps cookies between requests, like a browser does.
  async function loggedInAgent(email) {
    const agent = request.agent(app);
    const res = await agent
      .post('/api/v1/auth/register')
      .send({ name: 'Cookie Tester', email, password: 'longenough1' });
    return { agent, setCookie: res.headers['set-cookie'][0] };
  }

  it('is httpOnly and limited to the auth path', async () => {
    const { setCookie } = await loggedInAgent('cookie1@campus.edu');
    expect(setCookie).toMatch(/^refreshToken=/);
    expect(setCookie).toMatch(/HttpOnly/i);
    expect(setCookie).toMatch(/Path=\/api\/v1\/auth/);
  });

  it('gives a new access token and rotates the cookie', async () => {
    const { agent, setCookie } = await loggedInAgent('cookie2@campus.edu');
    const res = await agent.post('/api/v1/auth/refresh');
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('cookie2@campus.edu');
    expect(res.body.accessToken).toEqual(expect.any(String));
    expect(res.headers['set-cookie'][0]).not.toBe(setCookie);
  });

  it('rejects a replayed old refresh token and ends the session', async () => {
    const { agent, setCookie } = await loggedInAgent('cookie3@campus.edu');
    const oldCookie = setCookie.split(';')[0];
    await agent.post('/api/v1/auth/refresh'); // rotates: the old token is now used up

    const replay = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', oldCookie);
    expect(replay.status).toBe(401);
    // Reuse ended every session, so even the newest cookie no longer works.
    expect((await agent.post('/api/v1/auth/refresh')).status).toBe(401);
  });

  it('returns 401 without a cookie', async () => {
    const res = await request(app).post('/api/v1/auth/refresh');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('SESSION_EXPIRED');
  });

  it('logout clears the cookie and the stored token', async () => {
    const { agent, setCookie } = await loggedInAgent('cookie4@campus.edu');
    expect((await agent.post('/api/v1/auth/logout')).status).toBe(204);

    const retry = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', setCookie.split(';')[0]);
    expect(retry.status).toBe(401);
  });
});
