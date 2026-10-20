// Pagination, sorting and text search on GET /api/v1/events, and proof that indexes are used.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Event from '../src/models/Event.js';
import { authHeaderFor, createClub, daysFromNow, validEventBody } from './helpers.js';

const api = request(app);
let clubId;

beforeAll(async () => {
  const admin = await authHeaderFor('admin');
  clubId = await createClub();
  // 15 events, one day apart, titled in reverse alphabetical order.
  for (let i = 0; i < 15; i += 1) {
    await api
      .post('/api/v1/events')
      .set('Authorization', admin)
      .send(
        validEventBody({
          club: clubId,
          title: `Event ${String.fromCharCode(90 - i)}`, // Event Z, Event Y, ...
          category: i % 3 === 0 ? 'sports' : 'tech',
          startsAt: daysFromNow(10 + i),
          endsAt: daysFromNow(10.1 + i),
          registrationDeadline: daysFromNow(9 + i),
        }),
      );
  }
});

describe('GET /api/v1/events paging', () => {
  it('returns 12 per page by default with page info', async () => {
    const res = await api.get('/api/v1/events');
    expect(res.body).toMatchObject({ page: 1, totalPages: 2, total: 15 });
    expect(res.body.data).toHaveLength(12);
  });

  it('returns the rest on page 2', async () => {
    const res = await api.get('/api/v1/events?page=2');
    expect(res.body.data).toHaveLength(3);
  });

  it('caps limit at 50', async () => {
    expect((await api.get('/api/v1/events?limit=500')).status).toBe(422);
  });

  it('sorts by date by default, or by title', async () => {
    const byDate = await api.get('/api/v1/events?limit=2');
    expect(byDate.body.data.map((e) => e.title)).toEqual(['Event Z', 'Event Y']);
    const byTitle = await api.get('/api/v1/events?limit=2&sort=title');
    expect(byTitle.body.data.map((e) => e.title)).toEqual(['Event L', 'Event M']);
  });

  it('combines filters with paging', async () => {
    const res = await api.get(`/api/v1/events?category=sports&club=${clubId}`);
    expect(res.body.total).toBe(5);
  });

  it('searches whole words with the text index', async () => {
    const res = await api.get('/api/v1/events?q=event');
    expect(res.body.total).toBe(15);
  });
});

describe('indexes', () => {
  it('a category query sorted by date uses an index (IXSCAN, not COLLSCAN)', async () => {
    const plan = await Event.find({ category: 'tech' }).sort({ startsAt: 1 }).explain();
    const text = JSON.stringify(plan[0]?.queryPlanner ?? plan.queryPlanner);
    expect(text).toContain('IXSCAN');
    expect(text).not.toContain('COLLSCAN');
  });
});
