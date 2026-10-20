// API tests for registering: login required, success, duplicate (409), full (422), unknown event (404),
// re-registering after a cancel, and cascade delete.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Registration from '../src/models/Registration.js';
import { authHeaderFor, createClub, validEventBody } from './helpers.js';

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
    .send(validEventBody({ club: clubId, ...overrides }));
  return res.body.id;
}

describe('POST /api/v1/events/:id/registrations', () => {
  it('needs a logged-in student', async () => {
    const url = `/api/v1/events/${await createEvent()}/registrations`;
    expect((await api.post(url)).status).toBe(401);
    expect((await api.post(url).set('Authorization', admin)).status).toBe(403);
  });

  it('registers, then refuses a duplicate and a full event', async () => {
    const id = await createEvent({ capacity: 1 });
    const url = `/api/v1/events/${id}/registrations`;
    const asha = await authHeaderFor('student');

    const first = await api.post(url).set('Authorization', asha);
    expect(first.status).toBe(201);
    expect(first.body).toMatchObject({ eventId: id, status: 'registered' });

    const again = await api.post(url).set('Authorization', asha);
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe('ALREADY_REGISTERED');

    const ravi = await authHeaderFor('student');
    const full = await api.post(url).set('Authorization', ravi);
    expect(full.status).toBe(422);
    expect(full.body.error.code).toBe('EVENT_FULL');

    const event = await api.get(`/api/v1/events/${id}`);
    expect(event.body.seatsLeft).toBe(0);
  });

  it('flips a cancelled registration back instead of creating a second one', async () => {
    const id = await createEvent();
    const student = await authHeaderFor('student');
    const url = `/api/v1/events/${id}/registrations`;
    const first = await api.post(url).set('Authorization', student);
    await Registration.updateOne({ _id: first.body.id }, { status: 'cancelled' });

    const again = await api.post(url).set('Authorization', student);
    expect(again.status).toBe(201);
    expect(again.body.id).toBe(first.body.id);
  });

  it('returns 404 for an event that does not exist', async () => {
    const student = await authHeaderFor('student');
    const res = await api
      .post('/api/v1/events/000000000000000000000000/registrations')
      .set('Authorization', student);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/v1/events/:id', () => {
  it('also deletes the event registrations (FR-2.4)', async () => {
    const id = await createEvent();
    await api
      .post(`/api/v1/events/${id}/registrations`)
      .set('Authorization', await authHeaderFor('student'));
    expect(await Registration.countDocuments({ event: id })).toBe(1);

    await api.delete(`/api/v1/events/${id}`).set('Authorization', admin);
    expect(await Registration.countDocuments({ event: id })).toBe(0);
  });
});
