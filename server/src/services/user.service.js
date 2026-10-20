// Users and passwords. Users live in memory until Video 63 moves them to MongoDB.
// Passwords are never stored: only a bcrypt hash, which cannot be turned back into the password.
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';
import ApiError from '../utils/ApiError.js';

// Cost 12 = 2^12 rounds: about a quarter of a second per hash. Slow on purpose, so guessing
// millions of passwords from a stolen hash takes years instead of minutes.
const BCRYPT_COST = 12;

const users = [];

// The only shape of a user that ever leaves the server: no password hash, no token hash.
export function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function findUserById(id) {
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser({ name, email, password }) {
  if (users.some((u) => u.email === email)) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists.');
  }
  const user = {
    id: randomUUID(),
    name,
    email,
    role: 'student',
    passwordHash: await bcrypt.hash(password, BCRYPT_COST),
    refreshTokenHash: null,
  };
  users.push(user);
  return user;
}

export async function verifyCredentials(email, password) {
  const user = users.find((u) => u.email === email);
  // Same message for "no such email" and "wrong password", so attackers cannot discover
  // which emails have accounts.
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok)
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  return user;
}
