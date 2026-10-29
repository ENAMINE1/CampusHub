// Logs one line per request. In development it is morgan's compact "dev" format, easy to read.
// In production it is one JSON object per line with a request id, which log tools can search.
// Tests skip it so their output stays readable.
import { randomUUID } from 'node:crypto';
import morgan from 'morgan';
import config from '../config/index.js';

// Gives every request an id and returns it in the X-Request-Id header, so a user's bug report
// can be matched to one log line. An id sent by a proxy is reused only if it looks safe.
export function requestId(req, res, next) {
  const incoming = req.get('x-request-id');
  req.id = incoming && /^[\w-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  res.set('X-Request-Id', req.id);
  next();
}

const jsonFormat = (tokens, req, res) =>
  JSON.stringify({
    time: new Date().toISOString(),
    requestId: req.id,
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number(tokens.status(req, res)),
    ms: Number(tokens['response-time'](req, res)),
  });

const logger = config.isProduction ? morgan(jsonFormat) : morgan('dev');

const requestLogger = config.isTest ? (req, res, next) => next() : logger;

export default requestLogger;
