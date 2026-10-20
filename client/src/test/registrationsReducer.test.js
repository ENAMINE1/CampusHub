// The registrations reducer is a pure function, so we can test it with plain inputs and outputs.
import { describe, expect, it } from 'vitest';
import { registrationsReducer } from '../features/registrations/registrationsReducer.js';
import { gitWorkshop } from './fixtures.js';

describe('registrationsReducer', () => {
  it('adds a registration', () => {
    const next = registrationsReducer([], { type: 'registered', event: gitWorkshop });
    expect(next).toEqual([
      {
        eventId: 'evt-1',
        title: 'Intro to Git Workshop',
        startsAt: gitWorkshop.startsAt,
        venue: 'Lab 2',
        status: 'registered',
      },
    ]);
  });

  it('cancels without removing the entry, and does not mutate the old state', () => {
    const before = registrationsReducer([], { type: 'registered', event: gitWorkshop });
    const after = registrationsReducer(before, { type: 'cancelled', eventId: 'evt-1' });
    expect(after[0].status).toBe('cancelled');
    expect(before[0].status).toBe('registered');
  });

  it('re-registering after cancelling flips the status instead of duplicating', () => {
    let state = registrationsReducer([], { type: 'registered', event: gitWorkshop });
    state = registrationsReducer(state, { type: 'cancelled', eventId: 'evt-1' });
    state = registrationsReducer(state, { type: 'registered', event: gitWorkshop });
    expect(state).toHaveLength(1);
    expect(state[0].status).toBe('registered');
  });

  it('throws on an unknown action, so typos fail loudly', () => {
    expect(() => registrationsReducer([], { type: 'registerd' })).toThrow(/Unknown/);
  });
});
