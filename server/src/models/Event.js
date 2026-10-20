// The Event model: the shape of an event document and the rules MongoDB data must follow.
// Zod checks requests at the door; these validators protect the database from any other code path.
import mongoose from 'mongoose';
import { CATEGORIES } from '../validators/event.schemas.js';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 5000, default: '' },
    category: { type: String, required: true, enum: CATEGORIES },
    // A reference: only the club's _id is stored. populate() swaps it for the club document when reading.
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    venue: { type: String, required: true, trim: true, maxlength: 200 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 5000,
      validate: {
        validator: Number.isInteger,
        message: 'capacity must be a whole number',
      },
    },
    seatsTaken: { type: Number, default: 0, min: 0 },
    posterUrl: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatically
);

export default mongoose.model('Event', eventSchema);
