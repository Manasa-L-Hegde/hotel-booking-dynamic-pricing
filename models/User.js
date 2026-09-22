import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
  phone: { type: String, trim: true, unique: true, sparse: true },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phoneVerifiedAt: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
