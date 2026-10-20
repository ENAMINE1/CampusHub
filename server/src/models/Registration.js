// The Registration model: which user registered for which event. Its own collection, because
// it links two others (many students, many events) and carries its own data (status, reminder).
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
    reminderSentAt: { type: Date },
  },
  { timestamps: true },
);

// One registration per user per event, enforced by MongoDB itself: even two requests at the
// same instant cannot create a duplicate.
registrationSchema.index({ event: 1, user: 1 }, { unique: true });
// "My registrations, newest first" reads by user.
registrationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Registration', registrationSchema);
