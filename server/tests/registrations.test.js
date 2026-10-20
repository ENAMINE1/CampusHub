// API tests for registering: success, duplicate (409), full (422) and unknown event (404).
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { authHeaderFor, createClub, validEventBody } from './helpers.js';

const api = request(app);
let admin;
let clubId;
// Every event in this file belongs to one test club.
const body = (overrides) => validEventBody({ club: clubId, ...overrides });

beforeAll(async () => {
  admin = await authHeaderFor('admin');
  clubId = await createClub();
});

async function createEvent(overrides) {
  const res = await api
    .post('/api/v1/events')
    .set('Authorization', admin)
    .send(body(overrides));
  return res.body.id;
}

describe('POST /api/v1/events/:id/registrations', () => {
  it('registers, then refuses a duplicate and a full event', async () => {
    const id = await createEvent({ capacity: 1 });
    const url = `/api/v1/events/${id}/registrations`;

    const first = await api.post(url).send({ name: 'Asha', email: 'Asha@Campus.edu' });
    expect(first.status).toBe(201);
    expect(first.body.email).toBe('asha@campus.edu');

    const again = await api.post(url).send({ name: 'Asha', email: 'asha@campus.edu' });
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe('ALREADY_REGISTERED');

    const full = await api.post(url).send({ name: 'Ravi', email: 'ravi@campus.edu' });
    expect(full.status).toBe(422);
    expect(full.body.error.code).toBe('EVENT_FULL');

    const event = await api.get(`/api/v1/events/${id}`);
    expect(event.body.seatsLeft).toBe(0);
  });

  it('returns 404 for an event that does not exist', async () => {
    const res = await api
      .post('/api/v1/events/000000000000000000000000/registrations')
      .send({ name: 'Asha', email: 'asha@campus.edu' });
    expect(res.status).toBe(404);
  });

  it('validates the body', async () => {
    const id = await createEvent();
    const res = await api
      .post(`/api/v1/events/${id}/registrations`)
      .send({ name: 'A', email: 'not-an-email' });
    expect(res.status).toBe(422);
  });
});
