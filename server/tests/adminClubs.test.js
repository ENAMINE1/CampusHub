// Admin club management (FR-4.2): create, edit, assign admins by email, and who may do it.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import { authHeaderFor, createUserWithAuth } from './helpers.js';

const api = request(app);
let admin;
let student;

beforeAll(async () => {
  admin = await authHeaderFor('admin');
  student = await createUserWithAuth('student');
});

describe('admin club management', () => {
  let clubId;

  it('creates a club and promotes the assigned student to club admin', async () => {
    const res = await api
      .post('/api/v1/clubs')
      .set('Authorization', admin)
      .send({ name: 'Robotics', slug: 'robotics', adminEmails: [student.user.email] })
      .expect(201);
    expect(res.body).toMatchObject({
      slug: 'robotics',
      adminEmails: [student.user.email],
    });
    expect((await User.findById(student.user._id)).role).toBe('clubAdmin');
    clubId = res.body.id;
  });

  it('rejects a duplicate slug with 409 and an unknown email with 422', async () => {
    await api
      .post('/api/v1/clubs')
      .set('Authorization', admin)
      .send({ name: 'Robotics Two', slug: 'robotics' })
      .expect(409);
    await api
      .patch(`/api/v1/clubs/${clubId}`)
      .set('Authorization', admin)
      .send({ adminEmails: ['nobody@test.campushub.dev'] })
      .expect(422);
  });

  it('edits only the fields sent and lists clubs with admin emails', async () => {
    await api
      .patch(`/api/v1/clubs/${clubId}`)
      .set('Authorization', admin)
      .send({ description: 'We build robots.' })
      .expect(200);
    const res = await api
      .get('/api/v1/admin/clubs')
      .set('Authorization', admin)
      .expect(200);
    expect(res.body[0]).toMatchObject({
      name: 'Robotics',
      description: 'We build robots.',
      adminEmails: [student.user.email],
    });
  });

  it('is admin only: 401 without a token, 403 for a club admin', async () => {
    await api.post('/api/v1/clubs').send({ name: 'X1', slug: 'x1' }).expect(401);
    await api
      .post('/api/v1/clubs')
      .set('Authorization', student.auth)
      .send({ name: 'X1', slug: 'x1' })
      .expect(403);
  });
});
