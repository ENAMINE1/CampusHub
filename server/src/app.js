// Builds the Express app and exports it without starting a server.
// Keeping listen() out of here lets tests import the app and send it fake requests.
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const eventsFile = path.join(import.meta.dirname, '..', 'data', 'events.json');

const app = express();

// Parse JSON request bodies into req.body.
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Express 5: if this async handler throws (say the file is missing), the error goes to
// Express's error handler automatically. Express 4 needed try/catch or a wrapper for that.
app.get('/api/events', async (req, res) => {
  const events = JSON.parse(await readFile(eventsFile, 'utf8'));
  res.json(events);
});

export default app;
