// Shared test data. Dates are relative to "now" so the tests never expire.
const DAY = 24 * 60 * 60 * 1000;

export function daysFromNow(days) {
  return new Date(Date.now() + days * DAY).toISOString();
}

export function validEventBody(overrides = {}) {
  return {
    title: 'Testing Talk',
    description: 'How to write tests that help.',
    category: 'tech',
    club: 'code-club',
    venue: 'Lab 3',
    startsAt: daysFromNow(10),
    endsAt: daysFromNow(10.1),
    registrationDeadline: daysFromNow(9),
    capacity: 2,
    ...overrides,
  };
}
