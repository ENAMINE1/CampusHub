// Creates and checks the short-lived access token (a JWT the client sends on every request).
import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export function createAccessToken(user) {
  // Put only what the server needs to authorise a request in the token: it is readable by anyone.
  return jwt.sign({ sub: user.id, role: user.role }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessTtl,
  });
}
