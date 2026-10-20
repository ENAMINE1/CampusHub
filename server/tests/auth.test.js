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
