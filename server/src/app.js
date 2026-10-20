// Builds the Express app and exports it without starting a server.
// Keeping listen() out of here lets tests import the app and send it fake requests.
import express from 'express';
import eventsRouter from './routes/events.routes.js';

const app = express();

// Parse JSON request bodies into req.body.
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Everything about events lives in its own router, mounted under the versioned base path.
app.use('/api/v1/events', eventsRouter);

export default app;
