// Lets the request through only with a valid access token: "Authorization: Bearer <token>".
// On success, req.user holds the logged-in user. No token or a bad token means 401 Unauthorized.
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../services/token.service.js';
import { findUserById } from '../services/user.service.js';

export default function requireAuth(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Please log in.');
  }
  const payload = verifyAccessToken(token);
  // Look the user up again: the account may have been deleted or changed since the token was made.
  const user = findUserById(payload.sub);
  if (!user) throw new ApiError(401, 'UNAUTHENTICATED', 'Please log in.');
  req.user = user;
  next();
}
