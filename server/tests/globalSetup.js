// Runs once before all test files: starts a throwaway MongoDB in memory (no Atlas needed)
// and shares its address through MONGODB_URI. The first run downloads a MongoDB binary.
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

export async function setup() {
  mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
}

export async function teardown() {
  await mongo.stop();
}
