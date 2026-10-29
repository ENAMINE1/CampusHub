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
  // The client (Vercel) and the API (Render) are different sites in production, so the browser only
  // sends this cookie on cross-site requests when SameSite=None (which requires Secure).
  // On localhost both run on one site, where 'lax' is the safer default.
  sameSite: config.isProduction ? 'none' : 'lax',
  path: '/api/v1/auth',
};

// Start (or continue) a session: rotate the refresh token, store its hash, send both tokens.
async function sendSession(res, status, user) {
  const refreshToken = tokenService.createRefreshToken(user);
  await userService.saveRefreshTokenHash(user, tokenService.hashToken(refreshToken));
  res.cookie(REFRESH_COOKIE, refreshToken, { ...cookieOptions, maxAge: SEVEN_DAYS_MS });
  // The access token goes in the JSON body; the client keeps it in memory only.
  res.status(status).json({
    user: userService.toPublicUser(user),
    accessToken: tokenService.createAccessToken(user),
  });
}

export async function register(req, res) {
  const user = await userService.createUser(req.validated.body);
  await sendSession(res, 201, user);
}

export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await userService.verifyCredentials(email, password);
  await sendSession(res, 200, user);
}

export async function refresh(req, res) {
  const token = req.cookies[REFRESH_COOKIE];
  const payload = token && tokenService.verifyRefreshToken(token);
  const user =
    payload && (await userService.findUserById(payload.sub, { withRefreshHash: true }));
  if (!user) throw new ApiError(401, 'SESSION_EXPIRED', 'Please log in again.');

  if (!tokenService.tokenMatchesHash(token, user.refreshTokenHash)) {
    // A valid but already-used token means it may have been stolen and replayed.
    // End every session for this user to be safe.
    await userService.saveRefreshTokenHash(user, null);
    res.clearCookie(REFRESH_COOKIE, cookieOptions);
    throw new ApiError(401, 'SESSION_EXPIRED', 'Please log in again.');
  }
  await sendSession(res, 200, user); // rotation: the old refresh token stops working now
}

export async function logout(req, res) {
  const payload = tokenService.verifyRefreshToken(req.cookies[REFRESH_COOKIE]);
  const user = payload && (await userService.findUserById(payload.sub));
  if (user) await userService.saveRefreshTokenHash(user, null);
  res.clearCookie(REFRESH_COOKIE, cookieOptions);
  res.status(204).end();
}

export function me(req, res) {
  res.json({ user: userService.toPublicUser(req.user) });
}
