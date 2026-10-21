// Fills the database with the full demo data set from SPEC.md: 3 clubs, 1 admin, 2 club admins,
// 5 students, 24 events (some past, some full) and their registrations. DEVELOPMENT ONLY.
// Idempotent: it empties the collections first, so running it twice gives the same result.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import config from '../src/config/index.js';
import { connectDB, disconnectDB } from '../src/db/connect.js';
import Club from '../src/models/Club.js';
import Event from '../src/models/Event.js';
import Registration from '../src/models/Registration.js';
import User from '../src/models/User.js';
import { createUser } from '../src/services/user.service.js';

const DEMO_PASSWORD = 'campushub-demo';
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Deleting everything is fine on a laptop and a disaster on a real site.
if (config.isProduction) {
  console.error('Refusing to seed: NODE_ENV is production.');
  process.exit(1);
}

const dataDir = path.join(import.meta.dirname, '..', 'data');
const readJson = async (file) =>
  JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));

// Dates are relative to today at 17:00, so the demo always has upcoming and past events.
const base = new Date();
base.setHours(17, 0, 0, 0);
function datesFor({ startsInDays, hours }) {
  const startsAt = new Date(base.getTime() + startsInDays * DAY);
  return {
    startsAt,
    endsAt: new Date(startsAt.getTime() + hours * HOUR),
    registrationDeadline: new Date(startsAt.getTime() - 2 * HOUR),
  };
}

await connectDB(config.mongoUri);
await Promise.all([Event, Club, User, Registration].map((Model) => Model.deleteMany({})));

const users = {};
for (const demo of await readJson('seed-users.json')) {
  users[demo.email] = await createUser({ ...demo, password: DEMO_PASSWORD });
}
const students = Object.values(users).filter((u) => u.role === 'student');

const clubIds = {};
for (const { adminEmails, ...club } of await readJson('clubs.json')) {
  const admins = adminEmails.map((email) => users[email]._id);
  clubIds[club.slug] = (await Club.create({ ...club, admins }))._id;
}

// `registrations` says how many students sign up; when it equals capacity the event is full.
// Each event starts at a different student, so everyone ends up with a mix of events.
const seedEvents = await readJson('seed-events.json');
let registrationCount = 0;
for (const [
  i,
  { club, startsInDays, hours, registrations, ...fields },
] of seedEvents.entries()) {
  const event = await Event.create({
    ...fields,
    ...datesFor({ startsInDays, hours }),
    club: clubIds[club],
    seatsTaken: registrations,
  });
  const attendees = students
    .slice(i % students.length)
    .concat(students)
    .slice(0, registrations);
  await Registration.insertMany(
    attendees.map((student) => ({ event: event._id, user: student._id })),
  );
  registrationCount += registrations;
}

console.log(
  `Seeded ${Object.keys(clubIds).length} clubs, ${seedEvents.length} events and ` +
    `${registrationCount} registrations.`,
);
console.log(`Demo logins (development only), password "${DEMO_PASSWORD}":`);
console.table(Object.values(users).map(({ email, role }) => ({ email, role })));
await disconnectDB();
