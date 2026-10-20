// Logs one line per request (method, URL, status, time), using morgan's compact "dev" format.
// Tests skip it so their output stays readable.
import morgan from 'morgan';

const requestLogger =
  process.env.NODE_ENV === 'test' ? (req, res, next) => next() : morgan('dev');

export default requestLogger;
