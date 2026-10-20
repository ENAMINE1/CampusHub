// Fills the database with the sample events from data/events.json, replacing what is there.
// A small first version; Video 67 grows it into the full seed with clubs, users and registrations.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import config from '../src/config/index.js';
import { connectDB, disconnectDB } from '../src/db/connect.js';
import Event from '../src/models/Event.js';

// Deleting everything is fine on a laptop and a disaster on a real site.
if (config.isProduction) {
  console.error('Refusing to seed: NODE_ENV is production.');
  process.exit(1);
}

const file = path.join(import.meta.dirname, '..', 'data', 'events.json');
const events = JSON.parse(await readFile(file, 'utf8'));

await connectDB(config.mongoUri);
await Event.deleteMany({});
// The JSON ids (evt-101...) are not MongoDB ids, so drop them and let MongoDB create _id.
const inserted = await Event.insertMany(events.map(({ id, ...event }) => event));
console.log(`Seeded ${inserted.length} events.`);
await disconnectDB();
