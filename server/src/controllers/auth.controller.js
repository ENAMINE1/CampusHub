// HTTP layer for /api/v1/auth: sign up, log in, refresh the session and log out.
import config from '../config/index.js';
import ApiError from '../utils/ApiError.js';
import * as userService from '../services/user.service.js';
import * as tokenService from '../services/token.service.js';

const REFRESH_COOKIE = 'refreshToken';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// httpOnly: JavaScript in the page cannot read the cookie, so an XSS bug cannot steal it.
// path: the browser sends it only to /api/v1/auth, not with every API call.
const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction, // HTTPS only in production
  sameSite: 'lax',
  path: '/api/v1/auth',
};

// Start (or continue) a session: rotate the refresh token, store its hash, send both tokens.
function sendSession(res, status, user) {
  const refreshToken = tokenService.createRefreshToken(user);
  userService.saveRefreshTokenHash(user, tokenService.hashToken(refreshToken));
  res.cookie(REFRESH_COOKIE, refreshToken, { ...cookieOptions, maxAge: SEVEN_DAYS_MS });
  // The access token goes in the JSON body; the client keeps it in memory only.
  res.status(status).json({
    user: userService.toPublicUser(user),
    accessToken: tokenService.createAccessToken(user),
  });
}

export async function register(req, res) {
  const user = await userService.createUser(req.validated.body);
  sendSession(res, 201, user);
}

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await userService.verifyCredentials(email, password);
  sendSession(res, 200, user);
}

export function refresh(req, res) {
  const token = req.cookies[REFRESH_COOKIE];
  const payload = token && tokenService.verifyRefreshToken(token);
  const user = payload && userService.findUserById(payload.sub);
  if (!user) throw new ApiError(401, 'SESSION_EXPIRED', 'Please log in again.');

  if (!tokenService.tokenMatchesHash(token, user.refreshTokenHash)) {
    // A valid but already-used token means it may have been stolen and replayed.
    // End every session for this user to be safe.
    userService.saveRefreshTokenHash(user, null);
    res.clearCookie(REFRESH_COOKIE, cookieOptions);
    throw new ApiError(401, 'SESSION_EXPIRED', 'Please log in again.');
  }
  sendSession(res, 200, user); // rotation: the old refresh token stops working now
}

export function logout(req, res) {
  const payload = tokenService.verifyRefreshToken(req.cookies[REFRESH_COOKIE]);
  const user = payload && userService.findUserById(payload.sub);
  if (user) userService.saveRefreshTokenHash(user, null);
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: userService.toPublicUser(req.user) });
}
