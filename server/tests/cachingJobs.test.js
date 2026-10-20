// Cache-Control headers, the reminder job (called directly, no cron), and toJSON transforms.
import { beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Event from '../src/models/Event.js';
import Registration from '../src/models/Registration.js';
import User from '../src/models/User.js';
import sendReminders from '../src/jobs/sendReminders.js';
import { createClub, createUserWithAuth } from './helpers.js';

const api = request(app);
const HOUR = 60 * 60 * 1000;

describe('Cache-Control', () => {
  it('lets guests cache public lists for 60 seconds', async () => {
    const res = await api.get('/api/v1/events');
    expect(res.headers['cache-control']).toBe('public, max-age=60');
    expect(res.headers.vary).toContain('Authorization');
    expect((await api.get('/api/v1/clubs')).headers['cache-control']).toBe(
      'public, max-age=60',
    );
  });

  it('never caches personal or logged-in responses', async () => {
    const { auth } = await createUserWithAuth('student');
    const mine = await api.get('/api/v1/me/registrations').set('Authorization', auth);
    expect(mine.headers['cache-control']).toBe('no-store');
    const list = await api.get('/api/v1/events').set('Authorization', auth);
    expect(list.headers['cache-control']).toBe('no-store');
  });
});

describe('sendReminders', () => {
  const now = new Date('2030-01-01T09:00:00Z');
  let soonEvent;
  let student;

  beforeAll(async () => {
    const club = await createClub();
    const makeEvent = (hoursAway, title) =>
      Event.create({
        title,
        category: 'tech',
        club,
        venue: 'Lab',
        startsAt: new Date(now.getTime() + hoursAway * HOUR),
        endsAt: new Date(now.getTime() + (hoursAway + 1) * HOUR),
        registrationDeadline: new Date(now.getTime() + (hoursAway - 1) * HOUR),
        capacity: 10,
      });
    soonEvent = await makeEvent(10, 'Soon Talk'); // inside the 24-hour window
    const laterEvent = await makeEvent(48, 'Later Talk'); // too far away
    student = (await createUserWithAuth('student')).user;
    const quitter = (await createUserWithAuth('student')).user;

    await Registration.create([
      { event: soonEvent._id, user: student._id },
      { event: laterEvent._id, user: student._id },
      { event: soonEvent._id, user: quitter._id, status: 'cancelled' },
    ]);
  });

  it('emails registrants of events starting within 24 hours, exactly once', async () => {
    const outbox = [];
    const mailer = { sendMail: async (message) => outbox.push(message) };

    expect(await sendReminders({ now, mailer })).toBe(1);
    expect(outbox[0]).toMatchObject({
      to: student.email,
      subject: 'Reminder: Soon Talk starts soon',
    });

    // The next run 15 minutes later sends nothing new: reminderSentAt was recorded.
    const later = new Date(now.getTime() + 15 * 60 * 1000);
    expect(await sendReminders({ now: later, mailer })).toBe(0);
    expect(outbox).toHaveLength(1);
    const saved = await Registration.findOne({ event: soonEvent._id, user: student._id });
    expect(saved.reminderSentAt).toEqual(now);
  });
});

describe('toJSON transforms', () => {
  it('turn _id into id and never output password or token hashes', async () => {
    const { user } = await createUserWithAuth('student');
    const withSecrets = await User.findById(user._id).select(
      '+passwordHash +refreshTokenHash',
    );
    const json = JSON.parse(JSON.stringify(withSecrets));
    expect(json.id).toBe(user._id.toString());
    expect(json).not.toHaveProperty('_id');
    expect(json).not.toHaveProperty('__v');
    expect(json).not.toHaveProperty('passwordHash');
    expect(json).not.toHaveProperty('refreshTokenHash');
  });
});
