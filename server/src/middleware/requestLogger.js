// Logs one line per request (method, URL, status, time), using morgan's compact "dev" format.
// Tests skip it so their output stays readable.
import morgan from 'morgan';
import config from '../config/index.js';

const requestLogger = config.isTest ? (req, res, next) => next() : morgan('dev');

export default requestLogger;
