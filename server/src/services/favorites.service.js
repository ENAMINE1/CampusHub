// Server-side favorites (SPEC.md FR-5.3): a list of event ids on the user document.
import User from '../models/User.js';
import { toEvent, findEventRecord } from './events.service.js';

export async function listFavorites(user) {
  const { favorites } = await User.findById(user._id)
    .populate({ path: 'favorites', populate: { path: 'club', select: 'name slug' } })
    .lean();
  return favorites.map(toEvent);
}

// $addToSet only adds the id if it is not there yet, so calling this twice changes nothing:
// the request is idempotent, which is why the route uses PUT.
export async function addFavorite(user, eventId) {
  await findEventRecord(eventId); // 404 for an unknown event
  await User.updateOne({ _id: user._id }, { $addToSet: { favorites: eventId } });
}

// $pull removes it if present; removing something already gone is fine too.
export async function removeFavorite(user, eventId) {
  await User.updateOne({ _id: user._id }, { $pull: { favorites: eventId } });
}

// When an event is deleted, take it out of everyone's favorites.
export async function forgetEvent(eventId) {
  await User.updateMany({ favorites: eventId }, { $pull: { favorites: eventId } });
}
