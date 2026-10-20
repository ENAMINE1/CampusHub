// The last middleware. Express knows it handles errors because it takes FOUR arguments.
// Every thrown or rejected error ends up here and leaves as the same JSON shape.
export default function errorHandler(err, req, res, next) {
  // If the response already started streaming, let Express close the connection.
  if (res.headersSent) return next(err);

  // express.json() flags broken JSON bodies with type 'entity.parse.failed' and status 400.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'BAD_JSON',
        message: 'Request body is not valid JSON.',
        details: [],
      },
    });
  }

  // Anything else is a bug. Log the stack for us; never send it to the client.
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.', details: [] },
  });
}
