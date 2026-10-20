// Runs when no route matched: answer with the standard error shape instead of Express's HTML page.
export default function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `No route for ${req.method} ${req.path}`,
      details: [],
    },
  });
}
