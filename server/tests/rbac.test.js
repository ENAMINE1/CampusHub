// Who may do what: 401 when we do not know who you are, 403 when we know but you are not allowed.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { authHeaderFor, validEventBody } from './helpers.js';

const api = request(app);
let student;
let clubAdmin;

beforeAll(async () => {
  student = await authHeaderFor('student');
  clubAdmin = await authHeaderFor('clubAdmin');
});

describe('creating events', () => {
  it('401 without a token', async () => {
    const res = await api.post('/api/v1/events').send(validEventBody());
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });

  it('401 with a forged token', async () => {
    const forged = jwt.sign(
      { sub: 'x', role: 'admin' },
      'not-the-real-secret-at-all-000000',
    );
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${forged}`)
      .send(validEventBody());
    expect(res.status).toBe(401);
  });

  it('401 TOKEN_EXPIRED with an expired token, so the client knows to refresh', async () => {
    const expired = jwt.sign({ sub: 'x', role: 'admin' }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: -10,
    });
    const res = await api
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('TOKEN_EXPIRED');
  });

  it('403 for a logged-in student', async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', student)
      .send(validEventBody());
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('201 for a club admin', async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', clubAdmin)
      .send(validEventBody());
    expect(res.status).toBe(201);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('returns the logged-in user', async () => {
    const res = await api.get('/api/v1/auth/me').set('Authorization', student);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('student');
  });
});
