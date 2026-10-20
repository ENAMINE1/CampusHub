// Pure reducer for "my registrations". Given the current list and an action, it returns the next list.
// Pure means no fetch, no random ids, no mutation: easy to test and to reason about.

export const initialRegistrations = [];

export function registrationsReducer(registrations, action) {
  switch (action.type) {
    // The server's list replaces whatever we had (after login or a page reload).
    case 'loaded':
      return action.registrations.map(({ event }) => ({
        eventId: event.id,
        title: event.title,
        startsAt: event.startsAt,
        venue: event.venue,
        status: 'registered',
      }));
    case 'registered': {
      const existing = registrations.find((r) => r.eventId === action.event.id);
      // Registering again after cancelling flips the status back instead of adding a duplicate.
      if (existing) {
        return registrations.map((r) =>
          r.eventId === action.event.id ? { ...r, status: 'registered' } : r,
        );
      }
      const { id, title, startsAt, venue } = action.event;
      return [
        ...registrations,
        { eventId: id, title, startsAt, venue, status: 'registered' },
      ];
    }
    case 'cancelled':
      return registrations.map((r) =>
        r.eventId === action.eventId ? { ...r, status: 'cancelled' } : r,
      );
    default:
      throw new Error(`Unknown registrations action: ${action.type}`);
  }
}
