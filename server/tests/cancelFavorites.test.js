// Cancelling frees a seat, re-registering takes it again, favorites are idempotent, /me/clubs.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import {
  authHeaderFor,
  createClub,
  createUserWithAuth,
  validEventBody,
} from './helpers.js';

const api = request(app);
let admin;
let clubId;

beforeAll(async () => {
  admin = await authHeaderFor('admin');
  clubId = await createClub();
});

async function createEvent(overrides) {
  const res = await api
    .post('/api/v1/events')
    .set('Authorization', admin)
    .send(validEventBody({ club: clubId, capacity: 1, ...overrides }));
  return res.body.id;
}

const seatsLeft = async (id) => (await api.get(`/api/v1/events/${id}`)).body.seatsLeft;

describe('DELETE /api/v1/events/:id/registrations/me', () => {
  it('frees the seat, and registering again takes it back', async () => {
    const id = await createEvent();
    const student = await authHeaderFor('student');
    const url = `/api/v1/events/${id}/registrations`;

    await api.post(url).set('Authorization', student);
    expect(await seatsLeft(id)).toBe(0);

    expect((await api.delete(`${url}/me`).set('Authorization', student)).status).toBe(
      204,
    );
    expect(await seatsLeft(id)).toBe(1);

    expect((await api.post(url).set('Authorization', student)).status).toBe(201);
    expect(await seatsLeft(id)).toBe(0);
  });

  it('404 when you are not registered, and the counter never goes negative', async () => {
    const id = await createEvent();
    const student = await authHeaderFor('student');
    const res = await api
      .delete(`/api/v1/events/${id}/registrations/me`)
      .set('Authorization', student);
    expect(res.status).toBe(404);
    expect(await seatsLeft(id)).toBe(1);
  });

  it('a refused duplicate gives its seat back', async () => {
    const id = await createEvent({ capacity: 5 });
    const student = await authHeaderFor('student');
    const url = `/api/v1/events/${id}/registrations`;
    await api.post(url).set('Authorization', student);
    expect((await api.post(url).set('Authorization', student)).status).toBe(409);
    expect(await seatsLeft(id)).toBe(4);
  });
});

describe('/api/v1/me/favorites', () => {
  it('adds idempotently, lists populated events and removes', async () => {
    const id = await createEvent();
    const student = await authHeaderFor('student');

    expect(
      (await api.put(`/api/v1/me/favorites/${id}`).set('Authorization', student)).status,
    ).toBe(204);
    await api.put(`/api/v1/me/favorites/${id}`).set('Authorization', student); // twice: no duplicate
    const list = await api.get('/api/v1/me/favorites').set('Authorization', student);
    expect(list.body.map((e) => e.id)).toEqual([id]);
    expect(list.body[0].club.id).toBe(clubId);

    await api.delete(`/api/v1/me/favorites/${id}`).set('Authorization', student);
    await api.delete(`/api/v1/me/favorites/${id}`).set('Authorization', student); // twice: still fine
    expect(
      (await api.get('/api/v1/me/favorites').set('Authorization', student)).body,
    ).toEqual([]);
  });

  it('404 for an event that does not exist', async () => {
    const student = await authHeaderFor('student');
    const res = await api
      .put('/api/v1/me/favorites/000000000000000000000000')
      .set('Authorization', student);
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/me/clubs', () => {
  it('lists only the clubs a club admin manages', async () => {
    const lead = await createUserWithAuth('clubAdmin');
    const ownClub = await createClub([lead.user]);
    const res = await api.get('/api/v1/me/clubs').set('Authorization', lead.auth);
    expect(res.body.map((c) => c.id)).toEqual([ownClub]);
  });

  it('is not for students', async () => {
    const student = await authHeaderFor('student');
    expect((await api.get('/api/v1/me/clubs').set('Authorization', student)).status).toBe(
      403,
    );
  });
});
