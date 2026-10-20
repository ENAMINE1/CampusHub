// Runs in every test file: connect to the in-memory MongoDB with a database of the file's own,
// so files running in parallel never see each other's data. The database is dropped afterwards.
import { afterAll, beforeAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: `test-${randomUUID()}` });
  // Build every model's indexes before the tests run: unique emails and $text search need them.
  await mongoose.connection.syncIndexes();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
