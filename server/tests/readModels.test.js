// Reads that join collections: populated clubs, a club page, My Registrations and admin stats.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Club from '../src/models/Club.js';
import { authHeaderFor, createClub, daysFromNow, validEventBody } from './helpers.js';

const api = request(app);
let admin;
let student;
let clubId;
let techId;
let sportsId;

beforeAll(async () => {
  admin = await authHeaderFor('admin');
  student = await authHeaderFor('student');
  clubId = await createClub();
  await Club.updateOne({ _id: clubId }, { logoUrl: '/logos/test.png' });

  const create = async (overrides) =>
    (
      await api
        .post('/api/v1/events')
        .set('Authorization', admin)
        .send(validEventBody({ club: clubId, capacity: 10, ...overrides }))
    ).body.id;
  techId = await create({ title: 'Tech Talk', category: 'tech' });
  sportsId = await create({
    title: 'Sports Day',
    category: 'sports',
    startsAt: daysFromNow(20),
    endsAt: daysFromNow(20.1),
  });

  // Two registrations for the tech talk, one for sports day.
  const other = await authHeaderFor('student');
  await api.post(`/api/v1/events/${techId}/registrations`).set('Authorization', student);
  await api.post(`/api/v1/events/${techId}/registrations`).set('Authorization', other);
  await api
    .post(`/api/v1/events/${sportsId}/registrations`)
    .set('Authorization', student);
});

describe('GET /api/v1/events/:id', () => {
  it('populates the organising club with its logo', async () => {
    const res = await api.get(`/api/v1/events/${techId}`);
    expect(res.body.club).toMatchObject({ id: clubId, logoUrl: '/logos/test.png' });
    expect(res.body.seatsLeft).toBe(8);
  });
});

describe('clubs', () => {
  it('lists clubs and shows one club with its upcoming events', async () => {
    const list = await api.get('/api/v1/clubs');
    const club = list.body.find((c) => c.id === clubId);
    expect(club).toBeDefined();

    const page = await api.get(`/api/v1/clubs/${club.slug}`);
    expect(page.status).toBe(200);
    expect(page.body.upcomingEvents.map((e) => e.title)).toEqual([
      'Tech Talk',
      'Sports Day',
    ]);
  });

  it('404 for an unknown club', async () => {
    expect((await api.get('/api/v1/clubs/no-such-club')).status).toBe(404);
  });
});

describe('GET /api/v1/me/registrations', () => {
  it('lists my registrations with event details', async () => {
    const res = await api.get('/api/v1/me/registrations').set('Authorization', student);
    expect(res.status).toBe(200);
    expect(res.body.map((r) => r.event.title).sort()).toEqual([
      'Sports Day',
      'Tech Talk',
    ]);
    expect(res.body[0].event.club.id).toBe(clubId);
  });

  it('filters past registrations out of when=past', async () => {
    const res = await api
      .get('/api/v1/me/registrations?when=past')
      .set('Authorization', student);
    expect(res.body).toEqual([]);
  });

  it('needs a login', async () => {
    expect((await api.get('/api/v1/me/registrations')).status).toBe(401);
  });
});

describe('GET /api/v1/admin/stats', () => {
  it('counts registrations per event and per category', async () => {
    const res = await api.get('/api/v1/admin/stats').set('Authorization', admin);
    expect(res.status).toBe(200);
    expect(res.body.perEvent[0]).toMatchObject({
      eventId: techId,
      title: 'Tech Talk',
      registrations: 2,
    });
    expect(res.body.perCategory).toEqual([
      { category: 'tech', registrations: 2 },
      { category: 'sports', registrations: 1 },
    ]);
  });

  it('is for admins only', async () => {
    expect(
      (await api.get('/api/v1/admin/stats').set('Authorization', student)).status,
    ).toBe(403);
  });
});
