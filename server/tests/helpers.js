import { createUser } from '../src/services/user.service.js';
import { createAccessToken } from '../src/services/token.service.js';

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

// Creates a user with the given role and returns an "Authorization" header value for them.
// Calling the service directly is faster than going through /auth/register for every test.
let userCount = 0;
export async function authHeaderFor(
  role,
  email = `${role}${++userCount}@test.campushub`,
) {
  const user = await createUser({
    name: `Test ${role}`,
    email,
    password: 'longenough1',
    role,
  });
  return `Bearer ${createAccessToken(user)}`;
}
