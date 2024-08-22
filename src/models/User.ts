import { Schema, model } from 'mongoose';
import { IUser } from '../types'; // Import IUser type
import bcrypt from 'bcryptjs';
import validator from 'validator';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Custom message for duplicate email
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [false, 'Password is required'],
    },
    profile_image: [{ type: String }],
    provider: {
      type: String,
    },
    phoneNumber: { type: Number },
    gender: { type: String },
    skills: [{ type: Number }],
    terms: { type: String },
    verification_token: { type: String },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    // gender: {
    //   type: String,
    // },
  },
  { timestamps: true },
);

//befor saving to database
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 12);
    //this.confirmPassword = undefined;
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = function (candidatePassword: never) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUser>('User', UserSchema);
export default User;
export type { IUser }; // Export IUser type
