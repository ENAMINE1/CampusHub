// Shared test helpers. Dates are relative to "now" so the tests never expire.
import Club from '../src/models/Club.js';
import { createUser } from '../src/services/user.service.js';
import { createAccessToken } from '../src/services/token.service.js';

const DAY = 24 * 60 * 60 * 1000;

export function daysFromNow(days) {
  return new Date(Date.now() + days * DAY).toISOString();
}

// A valid POST /events body. Pass at least { club: clubId }.
export function validEventBody(overrides = {}) {
  return {
    title: 'Testing Talk',
    description: 'How to write tests that help.',
    category: 'tech',
    venue: 'Lab 3',
    startsAt: daysFromNow(10),
    endsAt: daysFromNow(10.1),
    registrationDeadline: daysFromNow(9),
    capacity: 2,
    ...overrides,
  };
}

// Creates a user with a role, plus the "Authorization" header value for them.
// Calling the service directly is faster than going through /auth/register for every test.
let count = 0;
export async function createUserWithAuth(role) {
  count += 1;
  const user = await createUser({
    name: `Test ${role} ${count}`,
    email: `${role}${count}@test.campushub.dev`,
    password: 'longenough1',
    role,
  });
  return { user, auth: `Bearer ${createAccessToken(user)}` };
}

export async function authHeaderFor(role) {
  return (await createUserWithAuth(role)).auth;
}

// Creates a club managed by the given users and returns its id as a string.
export async function createClub(admins = []) {
  count += 1;
  const club = await Club.create({
    name: `Test Club ${count}`,
    slug: `test-club-${count}`,
    admins: admins.map((user) => user._id),
  });
  return club._id.toString();
}
