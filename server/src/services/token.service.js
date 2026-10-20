// Creates and checks login tokens.
// - Access token: short-lived JWT, sent by the client in the Authorization header.
// - Refresh token: long-lived JWT in an httpOnly cookie, used only to get new access tokens.
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function createAccessToken(user) {
  // Put only what the server needs to authorise a request in the token: it is readable by anyone.
  return jwt.sign({ sub: user.id, role: user.role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessTtl,
  });
}

export function createRefreshToken(user) {
  // jti makes every token unique, even two created in the same second.
  return jwt.sign({ sub: user.id, jti: randomUUID() }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshTtl,
  });
}

// Returns the payload, or null if the token is missing, forged or expired.
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch {
    return null;
  }
}

// We store only a hash of the refresh token, like a password: a leaked database cannot be replayed.
// SHA-256 is enough here because the token is already long and random (bcrypt is for human passwords).
export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenMatchesHash(token, storedHash) {
  if (!storedHash) return false;
  // timingSafeEqual takes the same time whether the first or last character differs,
  // so an attacker cannot learn the hash by measuring response times.
  return timingSafeEqual(Buffer.from(hashToken(token)), Buffer.from(storedHash));
}
