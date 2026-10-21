// Integration tests for registering (FR-3): full, duplicate, deadline passed, and the race for
// the last seat, where many students click at the same instant and exactly one may win.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Event from '../src/models/Event.js';
import Registration from '../src/models/Registration.js';
import { authHeaderFor, createClub, daysFromNow, validEventBody } from './helpers.js';

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
    .send(validEventBody({ club: clubId, ...overrides }))
    .expect(201);
  return res.body.id;
}

// A fresh request(app) each time: ten requests at once on one shared server trips Node's
// "too many listeners" warning.
const register = (id, auth) =>
  request(app).post(`/api/v1/events/${id}/registrations`).set('Authorization', auth);

describe('registering for an event', () => {
  it('refuses a full event with 422 EVENT_FULL', async () => {
    const id = await createEvent({ capacity: 1 });
    await register(id, await authHeaderFor('student')).expect(201);
    const res = await register(id, await authHeaderFor('student')).expect(422);
    expect(res.body.error.code).toBe('EVENT_FULL');
  });

  it('refuses a duplicate with 409 and keeps the seat count right', async () => {
    const id = await createEvent({ capacity: 5 });
    const student = await authHeaderFor('student');
    await register(id, student).expect(201);
    await register(id, student).expect(409);
    expect((await Event.findById(id)).seatsTaken).toBe(1);
  });

  it('refuses after the registration deadline with 422', async () => {
    const id = await createEvent({ capacity: 5 });
    // The API will not accept a past deadline, so move it straight in the database.
    await Event.updateOne({ _id: id }, { registrationDeadline: daysFromNow(-1) });
    const res = await register(id, await authHeaderFor('student')).expect(422);
    expect(res.body.error.code).toBe('REGISTRATION_CLOSED');
  });

  it('gives the last seat to exactly one of ten students clicking at once', async () => {
    const id = await createEvent({ capacity: 1 });
    const students = await Promise.all(
      Array.from({ length: 10 }, () => authHeaderFor('student')),
    );
    const results = await Promise.all(students.map((auth) => register(id, auth)));
    const statuses = results.map((res) => res.status);

    expect(statuses.filter((s) => s === 201)).toHaveLength(1);
    expect(statuses.filter((s) => s === 422)).toHaveLength(9);
    expect((await Event.findById(id)).seatsTaken).toBe(1);
    expect(await Registration.countDocuments({ event: id })).toBe(1);
  });
});
