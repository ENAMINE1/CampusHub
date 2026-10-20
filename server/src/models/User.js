// The User model. Secrets are marked select: false, so normal queries never load them;
// code that really needs them (login) must ask with .select('+passwordHash').
import mongoose from 'mongoose';
import toJSONOptions from '../utils/toJSONOptions.js';

export const ROLES = ['student', 'clubAdmin', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: 'student' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true },
);

userSchema.set('toJSON', toJSONOptions);

export default mongoose.model('User', userSchema);
