// Club lookups and the "who may manage which club" rule, backed by the Club model.
import Club from '../models/Club.js';

export async function clubExists(id) {
  return Boolean(await Club.exists({ _id: id }));
}

// Admins manage every club; a club admin only the clubs that list them in `admins` (SPEC.md FR-1.6).
export async function canManageClub(user, clubId) {
  if (user.role === 'admin') return true;
  if (user.role !== 'clubAdmin') return false;
  return Boolean(await Club.exists({ _id: clubId, admins: user._id }));
}
