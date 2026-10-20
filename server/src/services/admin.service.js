// Platform statistics for admins (SPEC.md FR-8.2), computed inside MongoDB with aggregation
// pipelines: each stage transforms the documents and hands them to the next, like an assembly line.
import Registration from '../models/Registration.js';

// The first stages are shared: count only active registrations, then attach each one's event.
const withEvent = [
  { $match: { status: 'registered' } },
  { $lookup: { from: 'events', localField: 'event', foreignField: '_id', as: 'event' } },
  { $unwind: '$event' }, // $lookup returns an array; turn it into a single object
];

export async function getStats() {
  const perEvent = await Registration.aggregate([
    ...withEvent,
    {
      $group: {
        _id: '$event._id',
        title: { $first: '$event.title' },
        category: { $first: '$event.category' },
        registrations: { $sum: 1 },
      },
    },
    { $sort: { registrations: -1, title: 1 } },
    {
      $project: {
        _id: 0,
        eventId: { $toString: '$_id' },
        title: 1,
        category: 1,
        registrations: 1,
      },
    },
  ]);

  const perCategory = await Registration.aggregate([
    ...withEvent,
    { $group: { _id: '$event.category', registrations: { $sum: 1 } } },
    { $sort: { registrations: -1, _id: 1 } },
    { $project: { _id: 0, category: '$_id', registrations: 1 } },
  ]);

  return { perEvent, perCategory };
}
