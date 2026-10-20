// Fills the database with sample clubs, demo users and events, replacing what is there.
// DEVELOPMENT ONLY. Video 67 grows it into the full seed from SPEC.md.
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

// Deleting everything is fine on a laptop and a disaster on a real site.
if (config.isProduction) {
  console.error('Refusing to seed: NODE_ENV is production.');
  process.exit(1);
}

const dataDir = path.join(import.meta.dirname, '..', 'data');
const readJson = async (file) =>
  JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));

await connectDB(config.mongoUri);
await Promise.all([
  Event.deleteMany({}),
  Club.deleteMany({}),
  User.deleteMany({}),
  Registration.deleteMany({}),
]);

const users = {};
for (const demo of await readJson('demo-users.json')) {
  const user = await createUser({ ...demo, password: DEMO_PASSWORD });
  users[user.email] = user;
}

const clubIds = {};
for (const { adminEmails, ...club } of await readJson('clubs.json')) {
  const created = await Club.create({
    ...club,
    admins: adminEmails.map((e) => users[e]._id),
  });
  clubIds[club.slug] = created._id;
}

// The JSON stores each event's club by slug and has ids like evt-101 that MongoDB does not use.
const events = (await readJson('events.json')).map(({ id, club, ...event }) => ({
  ...event,
  club: clubIds[club.slug],
}));
await Event.insertMany(events);

console.log(
  `Seeded ${Object.keys(clubIds).length} clubs, ${events.length} events and these demo users`,
);
console.log(
  `(development only, password "${DEMO_PASSWORD}"): ${Object.keys(users).join(', ')}`,
);
await disconnectDB();
