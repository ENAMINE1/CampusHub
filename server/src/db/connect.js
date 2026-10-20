// Opens (and closes) the one shared MongoDB connection. Mongoose keeps it open and reuses it
// for every query, so we connect once at startup instead of once per request.
import mongoose from 'mongoose';

export async function connectDB(uri) {
  await mongoose.connect(uri);
  const { host, name } = mongoose.connection;
  return `${host}/${name}`;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
