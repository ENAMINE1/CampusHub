// The last middleware. Express knows it handles errors because it takes FOUR arguments.
// Every thrown or rejected error ends up here and leaves as the same JSON shape.
import multer from 'multer';
import ApiError from '../utils/ApiError.js';

function send(res, status, code, message, details = []) {
  res.status(status).json({ error: { code, message, details } });
}

export default function errorHandler(err, req, res, next) {
  // If the response already started streaming, let Express close the connection.
  if (res.headersSent) return next(err);

  // Errors we threw on purpose carry their own status and code.
  if (err instanceof ApiError) {
    return send(res, err.status, err.code, err.message, err.details);
  }
  // express.json() flags broken JSON bodies with type 'entity.parse.failed' and status 400.
  if (err.type === 'entity.parse.failed') {
    return send(res, 400, 'BAD_JSON', 'Request body is not valid JSON.');
  }
  // Upload problems: too big, too many files, wrong field name.
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Poster must be 2 MB or smaller.'
        : 'Upload one image in the poster field.';
    return send(
      res,
      422,
      err.code === 'LIMIT_FILE_SIZE' ? 'FILE_TOO_LARGE' : 'INVALID_FILE',
      message,
    );
  }
  if (err.type === 'entity.too.large') {
    return send(res, 413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
  }

  // Anything else is a bug. Log the stack for us; never send it to the client.
  console.error(err);
  send(res, 500, 'INTERNAL_ERROR', 'Something went wrong.');
}
