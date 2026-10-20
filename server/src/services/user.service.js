// Users and passwords, stored in MongoDB through the User model.
// Passwords are never stored: only a bcrypt hash, which cannot be turned back into the password.
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

// Cost 12 = 2^12 rounds: about a quarter of a second per hash. Slow on purpose, so guessing
// millions of passwords from a stolen hash takes years instead of minutes.
const BCRYPT_COST = 12;
const DUPLICATE_KEY = 11000; // MongoDB's error code when a unique index is violated

// The only shape of a user that ever leaves the server: no password hash, no token hash.
export function toPublicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
}

// withRefreshHash: also load the (normally hidden) refresh token hash.
export async function findUserById(id, { withRefreshHash = false } = {}) {
  if (!mongoose.isValidObjectId(id)) return null;
  const query = User.findById(id);
  if (withRefreshHash) query.select('+refreshTokenHash');
  return query;
}

// role is only ever passed by server code (seed, tests); sign-up always creates students.
export async function createUser({ name, email, password, role = 'student' }) {
  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    return await User.create({ name, email, role, passwordHash });
  } catch (err) {
    // The unique index on email is the real guard: it also wins when two sign-ups race.
    if (err.code === DUPLICATE_KEY) {
      throw new ApiError(
        409,
        'EMAIL_TAKEN',
        'An account with this email already exists.',
      );
    }
    throw err;
  }
}

export async function verifyCredentials(email, password) {
  const user = await User.findOne({ email }).select('+passwordHash');
  // Same message for "no such email" and "wrong password", so attackers cannot discover
  // which emails have accounts.
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok)
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  return user;
}

// Remember (or forget, with null) the hash of the user's current refresh token.
export async function saveRefreshTokenHash(user, hash) {
  await User.updateOne({ _id: user._id }, { refreshTokenHash: hash });
}
