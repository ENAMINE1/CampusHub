// Clubs: listing, one club with its upcoming events, admin create/edit, and the
// "who may manage which club" rule.
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { toEvent } from './events.service.js';

function toClub(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    logoUrl: doc.logoUrl,
  };
}

export async function listClubs() {
  const clubs = await Club.find().sort({ name: 1 }).lean();
  return clubs.map(toClub);
}

export async function getClubBySlug(slug) {
  const club = await Club.findOne({ slug }).lean();
  if (!club) throw ApiError.notFound('Club not found.');
  const upcoming = await Event.find({ club: club._id, startsAt: { $gte: new Date() } })
    .sort({ startsAt: 1 })
    .populate('club', 'name slug logoUrl')
    .lean();
  return { ...toClub(club), upcomingEvents: upcoming.map(toEvent) };
}

export async function clubExists(id) {
  return Boolean(await Club.exists({ _id: id }));
}

// Admins manage every club; a club admin only the clubs that list them in `admins` (SPEC.md FR-1.6).
export async function canManageClub(user, clubId) {
  if (user.role === 'admin') return true;
  if (user.role !== 'clubAdmin') return false;
  return Boolean(await Club.exists({ _id: clubId, admins: user._id }));
}

export async function listManagedClubs(user) {
  const filter = user.role === 'admin' ? {} : { admins: user._id };
  const clubs = await Club.find(filter).sort({ name: 1 }).lean();
  return clubs.map(toClub);
}

// --- Admin: create and edit clubs (SPEC.md FR-4.2) ---

const DUPLICATE_KEY = 11000;

function toAdminClub(doc) {
  return { ...toClub(doc), adminEmails: doc.admins.map((admin) => admin.email) };
}

// Admins are assigned by email. Unknown emails are a 422 (typo?), and a student who is
// given a club becomes a club admin so the dashboard opens for them.
async function usersForEmails(emails) {
  const users = await User.find({ email: { $in: emails } });
  const missing = emails.filter((email) => !users.some((u) => u.email === email));
  if (missing.length > 0) {
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some admin emails have no account.', [
      {
        location: 'body',
        path: 'adminEmails',
        message: `No account: ${missing.join(', ')}`,
      },
    ]);
  }
  await User.updateMany(
    { _id: { $in: users.map((u) => u._id) }, role: 'student' },
    { role: 'clubAdmin' },
  );
  return users.map((u) => u._id);
}

async function saveClub(write) {
  try {
    const club = await write();
    if (!club) throw ApiError.notFound('Club not found.');
    return toAdminClub(await club.populate('admins', 'email'));
  } catch (err) {
    if (err.code === DUPLICATE_KEY) {
      throw new ApiError(
        409,
        'CLUB_TAKEN',
        'A club with this name or slug already exists.',
      );
    }
    throw err;
  }
}

export async function listClubsWithAdmins() {
  const clubs = await Club.find().sort({ name: 1 }).populate('admins', 'email').lean();
  return clubs.map(toAdminClub);
}

export async function createClub({ adminEmails, ...fields }) {
  const admins = await usersForEmails(adminEmails);
  return saveClub(() => Club.create({ ...fields, admins }));
}

export async function updateClub(id, { adminEmails, ...fields }) {
  const changes = { ...fields };
  if (adminEmails) changes.admins = await usersForEmails(adminEmails);
  return saveClub(() =>
    Club.findByIdAndUpdate(id, changes, { returnDocument: 'after', runValidators: true }),
  );
}
