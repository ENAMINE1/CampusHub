// Builds the Express app and exports it without starting a server.
// Keeping listen() out of here lets tests import the app and send it fake requests.
import express from 'express';
import config from './config/index.js';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import sanitize from './middleware/sanitize.js';
import { apiLimiter } from './middleware/rateLimits.js';
import eventsRouter from './routes/events.routes.js';
import authRouter from './routes/auth.routes.js';
import clubsRouter from './routes/clubs.routes.js';
import meRouter from './routes/me.routes.js';
import adminRouter from './routes/admin.routes.js';

const app = express();

// Order matters: each request flows through these top to bottom.
app.use(requestLogger);
app.use(helmet()); // safe default security headers
// Only our own front end may call the API from a browser, and it may send cookies.
// Classic mistake: cors() with no options allows every origin, and credentials will not work.
app.use(cors({ origin: [config.clientUrl], credentials: true }));
app.use(express.json({ limit: '100kb' })); // parse JSON bodies, reject huge ones
app.use(cookieParser()); // read cookies into req.cookies
app.use(sanitize); // drop $-operators from bodies before any code sees them

// Uploaded posters. CORP 'cross-origin' lets a front end on another domain show them in <img>;
// helmet's default (same-origin) would block that.
app.use(
  '/uploads',
  express.static(config.uploadDir, {
    setHeaders: (res) => res.set('Cross-Origin-Resource-Policy', 'cross-origin'),
  }),
);

// Every API route shares one budget per IP. Posters and Socket.IO are outside /api.
app.use('/api', apiLimiter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/events', eventsRouter);
app.use('/api/v1/clubs', clubsRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/admin', adminRouter);

app.use(notFound); // no route matched
app.use(errorHandler); // must be last

export default app;
