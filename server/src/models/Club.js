// The Club model. Events point to a club by its _id (a reference) instead of copying its name,
// so renaming a club updates every event at once.
import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'slug may only contain a-z, 0-9 and dashes'],
    },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    logoUrl: { type: String, default: '' },
    // Users who may manage this club's events (SPEC.md FR-1.6).
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export default mongoose.model('Club', clubSchema);
