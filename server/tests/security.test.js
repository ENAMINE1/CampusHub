// Security pass (Video 69): operator injection, ownership on every route that takes an event id,
// and the global rate limit headers.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { stripOperators } from '../src/middleware/sanitize.js';
import { createClub, createUserWithAuth, validEventBody } from './helpers.js';

const api = request(app);

describe('sanitize', () => {
  it('drops $ and dotted keys at any depth and keeps the rest', () => {
    const dirty = {
      email: { $ne: null },
      'a.b': 1,
      list: [{ $gt: 1, ok: 2 }],
      name: 'x',
    };
    expect(stripOperators(dirty)).toEqual({ email: {}, list: [{ ok: 2 }], name: 'x' });
  });

  it('a login with { $ne: null } as the email is a 422, never a match', async () => {
    const res = await api
      .post('/api/v1/auth/login')
      .send({ email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(422);
  });
});

describe('ownership on every event id route', () => {
  let otherAuth;
  let eventId;
  let myClub;

  beforeAll(async () => {
    const owner = await createUserWithAuth('clubAdmin');
    const other = await createUserWithAuth('clubAdmin');
    otherAuth = other.auth;
    myClub = await createClub([other.user]);
    const club = await createClub([owner.user]);
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', owner.auth)
      .send(validEventBody({ club }));
    eventId = res.body.id;
  });

  it.each([
    ['patch', ''],
    ['delete', ''],
    ['post', '/poster'],
    ['get', '/registrations'],
  ])('%s /events/:id%s by another club admin is 403', async (method, suffix) => {
    const res = await api[method](`/api/v1/events/${eventId}${suffix}`)
      .set('Authorization', otherAuth)
      .send(method === 'patch' ? { title: 'Taken over' } : undefined);
    expect(res.status).toBe(403);
  });

  it('cannot create an event in a club you do not manage', async () => {
    const owner = await createUserWithAuth('clubAdmin');
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', owner.auth)
      .send(validEventBody({ club: myClub }));
    expect(res.status).toBe(403);
  });
});

describe('global rate limit', () => {
  it('announces the 300 per 15 minutes budget on every API response', async () => {
    const res = await api.get('/api/v1/health').expect(200);
    expect(res.headers['ratelimit-policy']).toMatch(/q=300/);
  });
});
