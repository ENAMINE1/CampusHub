// Starts the API: connect to MongoDB first, then accept HTTP requests.
import config from './config/index.js';
import app from './app.js';
import { connectDB } from './db/connect.js';

try {
  const where = await connectDB(config.mongoUri);
  console.log(`MongoDB connected: ${where}`);
} catch (error) {
  console.error(`Could not connect to MongoDB: ${error.message}`);
  console.error(
    'Check MONGODB_URI in server/.env (and your IP in Atlas Network Access).',
  );
  process.exit(1);
}

app.listen(config.port, () => {
  console.log(`CampusHub API listening on http://localhost:${config.port}`);
});
