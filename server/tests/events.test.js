// API tests for /api/v1/events. Supertest sends real HTTP requests to the app without opening a port.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { authHeaderFor, createClub, validEventBody } from './helpers.js';

const api = request(app);
let admin; // Authorization header of an admin, created once for this file
let clubId;
// Every event in this file belongs to one test club.
const body = (overrides) => validEventBody({ club: clubId, ...overrides });
let gitWorkshopId;

// Each test file starts with an empty database, so create the events these tests read.
beforeAll(async () => {
  admin = await authHeaderFor('admin');
  clubId = await createClub();
  const git = await api
    .post('/api/v1/events')
    .set('Authorization', admin)
    .send(body({ title: 'Intro to Git Workshop', category: 'workshop' }));
  gitWorkshopId = git.body.id;
  await api
    .post('/api/v1/events')
    .set('Authorization', admin)
    .send(body({ title: 'Hack Night', category: 'tech' }));
});

describe('GET /api/v1/health', () => {
  it('reports the server is up', async () => {
    const res = await api.get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('up');
  });

  it('gives every response a request id, reusing a safe one from the caller', async () => {
    const generated = await api.get('/api/v1/health');
    expect(generated.headers['x-request-id']).toMatch(/^[\w-]{8,}$/);
    const reused = await api.get('/api/v1/health').set('X-Request-Id', 'trace-123');
    expect(reused.headers['x-request-id']).toBe('trace-123');
    const unsafe = await api.get('/api/v1/health').set('X-Request-Id', 'a b"c');
    expect(unsafe.headers['x-request-id']).not.toBe('a b"c');
  });
});

describe('GET /api/v1/events', () => {
  it('lists events with a computed seatsLeft', async () => {
    const res = await api.get('/api/v1/events');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ page: 1, total: 2, totalPages: 1 });
    const [first] = res.body.data;
    expect(first.seatsLeft).toBe(first.capacity - first.seatsTaken);
  });

  it('filters by category and text search', async () => {
    const tech = await api.get('/api/v1/events?category=tech');
    expect(tech.body.data.every((e) => e.category === 'tech')).toBe(true);

    const search = await api.get('/api/v1/events?q=GIT');
    expect(search.body.data.map((e) => e.title)).toContain('Intro to Git Workshop');
  });

  it('rejects an unknown category with 422 and field details', async () => {
    const res = await api.get('/api/v1/events?category=food');
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details[0]).toMatchObject({
      location: 'query',
      path: 'category',
    });
  });
});

describe('GET /api/v1/events/:id', () => {
  it('returns one event', async () => {
    const res = await api.get(`/api/v1/events/${gitWorkshopId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Intro to Git Workshop');
  });

  it('returns 404 in the standard error shape for an id that does not exist', async () => {
    const res = await api.get('/api/v1/events/000000000000000000000000');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: 'Event not found.', details: [] },
    });
  });

  it('returns 422 for something that is not an id at all', async () => {
    const res = await api.get('/api/v1/events/nope');
    expect(res.status).toBe(422);
  });
});

describe('POST, PATCH and DELETE /api/v1/events', () => {
  it('creates, updates and deletes an event', async () => {
    const created = await api
      .post('/api/v1/events')
      .set('Authorization', admin)
      .send(body());
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ seatsTaken: 0, seatsLeft: 2 });
    // The club comes back populated: id, name and slug instead of a bare id.
    expect(created.body.club).toMatchObject({ id: clubId, name: expect.any(String) });
    const url = `/api/v1/events/${created.body.id}`;

    const updated = await api
      .patch(url)
      .set('Authorization', admin)
      .send({ title: 'Renamed Talk' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Renamed Talk');

    expect((await api.delete(url).set('Authorization', admin)).status).toBe(204);
    expect((await api.get(url)).status).toBe(404);
  });

  it('rejects invalid fields, unknown keys and impossible dates', async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', admin)
      .send(
        body({
          title: 'Hi',
          capacity: 0,
          seatsTaken: 99,
          endsAt: body().registrationDeadline,
        }),
      );
    expect(res.status).toBe(422);
    const paths = res.body.error.details.map((d) => d.path);
    expect(paths).toEqual(expect.arrayContaining(['title', 'capacity', 'endsAt']));
    expect(res.body.error.details.some((d) => d.message.includes('seatsTaken'))).toBe(
      true,
    );
  });

  it('answers broken JSON with 400', async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', admin)
      .set('Content-Type', 'application/json')
      .send('{oops');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_JSON');
  });
});

describe('unknown routes', () => {
  it('return 404 with code NOT_FOUND', async () => {
    const res = await api.get('/api/v1/nothing-here');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
