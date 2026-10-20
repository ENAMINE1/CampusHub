// Builds the Express app and exports it without starting a server.
// Keeping listen() out of here lets tests import the app and send it fake requests.
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import eventsRouter from './routes/events.routes.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();

// Order matters: each request flows through these top to bottom.
app.use(requestLogger);
app.use(helmet()); // safe default security headers
// Only our own front end may call the API from a browser, and it may send cookies.
// Classic mistake: cors() with no options allows every origin, and credentials will not work.
app.use(cors({ origin: [CLIENT_URL], credentials: true }));
app.use(express.json({ limit: '100kb' })); // parse JSON bodies, reject huge ones

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.use('/api/v1/events', eventsRouter);

app.use(notFound); // no route matched
app.use(errorHandler); // must be last

export default app;
