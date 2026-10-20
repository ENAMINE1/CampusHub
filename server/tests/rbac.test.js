// Who may do what: 401 when we do not know who you are, 403 when we know but you are not allowed.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import {
  authHeaderFor,
  createClub,
  createUserWithAuth,
  validEventBody,
} from './helpers.js';

const api = request(app);
let student;
let clubAdmin; // manages codeClub only
let otherAdmin; // manages otherClub only
let codeClub;
let otherClub;
let freeClub; // nobody's club

beforeAll(async () => {
  student = await authHeaderFor('student');
  const lead = await createUserWithAuth('clubAdmin');
  const otherLead = await createUserWithAuth('clubAdmin');
  clubAdmin = lead.auth;
  otherAdmin = otherLead.auth;
  codeClub = await createClub([lead.user]);
  otherClub = await createClub([otherLead.user]);
  freeClub = await createClub();
});

describe('creating events', () => {
  it('401 without a token', async () => {
    const res = await api.post('/api/v1/events').send(validEventBody({ club: codeClub }));
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
      .send(validEventBody({ club: codeClub }));
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
      .send(validEventBody({ club: codeClub }));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it("201 for a club admin of the event's club", async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', clubAdmin)
      .send(validEventBody({ club: codeClub }));
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

describe('ownership (FR-1.6)', () => {
  async function codeClubEvent() {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', clubAdmin)
      .send(validEventBody({ club: codeClub }));
    return `/api/v1/events/${res.body.id}`;
  }

  it('403 when a club admin creates an event for another club', async () => {
    const res = await api
      .post('/api/v1/events')
      .set('Authorization', clubAdmin)
      .send(validEventBody({ club: otherClub }));
    expect(res.status).toBe(403);
  });

  it("403 when a club admin edits or deletes another club's event", async () => {
    const url = await codeClubEvent();
    expect(
      (await api.patch(url).set('Authorization', otherAdmin).send({ title: 'Mine now' }))
        .status,
    ).toBe(403);
    expect((await api.delete(url).set('Authorization', otherAdmin)).status).toBe(403);
  });

  it('403 when moving your event to a club you do not manage', async () => {
    const url = await codeClubEvent();
    const res = await api
      .patch(url)
      .set('Authorization', clubAdmin)
      .send({ club: freeClub });
    expect(res.status).toBe(403);
  });

  it('admins may edit any event', async () => {
    const url = await codeClubEvent();
    const admin = await authHeaderFor('admin');
    const res = await api
      .patch(url)
      .set('Authorization', admin)
      .send({ title: 'Admin edit' });
    expect(res.status).toBe(200);
  });

  it('only owners see the registrant list', async () => {
    const url = await codeClubEvent();
    expect((await api.get(`${url}/registrations`)).status).toBe(401);
    expect(
      (await api.get(`${url}/registrations`).set('Authorization', student)).status,
    ).toBe(403);
    expect(
      (await api.get(`${url}/registrations`).set('Authorization', clubAdmin)).status,
    ).toBe(200);
  });
});
