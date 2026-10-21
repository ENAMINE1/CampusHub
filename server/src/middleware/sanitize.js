// Removes keys that start with "$" or contain "." from request bodies, at any depth.
// MongoDB reads such keys as operators: { "email": { "$ne": null } } would match every user.
// Zod already rejects these shapes on our routes; this is a second lock on the same door.
// Query strings need no cleaning: Express 5's default parser never builds nested objects.

function isDangerous(key) {
  return key.startsWith('$') || key.includes('.');
}

export function stripOperators(value) {
  if (Array.isArray(value)) return value.map(stripOperators);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !isDangerous(key))
      .map(([key, child]) => [key, stripOperators(child)]),
  );
}

export default function sanitize(req, res, next) {
  if (req.body && typeof req.body === 'object') req.body = stripOperators(req.body);
  next();
}
