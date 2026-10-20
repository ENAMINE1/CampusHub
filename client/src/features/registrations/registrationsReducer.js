// Pure reducer for "my registrations". Given the current list and an action, it returns the next list.
// Pure means no fetch, no random ids, no mutation: easy to test and to reason about.

export const initialRegistrations = [];

export function registrationsReducer(registrations, action) {
  switch (action.type) {
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
