// Lets the request through only if the logged-in user has one of the given roles.
// Use it after requireAuth. Logged in but not allowed means 403 Forbidden (not 401).
import ApiError from '../utils/ApiError.js';

export default function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to do this.');
    }
    next();
  };
}
