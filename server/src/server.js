// Starts the API: connect to MongoDB, then serve HTTP and WebSocket (Socket.IO) on one port.
import http from 'node:http';
import config from './config/index.js';
import app from './app.js';
import { connectDB } from './db/connect.js';
import { attachSockets } from './sockets/seats.js';
import { startScheduler } from './jobs/scheduler.js';

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

// Socket.IO needs the raw HTTP server, so create it ourselves instead of calling app.listen().
const httpServer = http.createServer(app);
attachSockets(httpServer, config.clientUrl);

startScheduler();

httpServer.listen(config.port, () => {
  console.log(`CampusHub API listening on http://localhost:${config.port}`);
});
