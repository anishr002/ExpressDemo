import { Schema, model } from 'mongoose';
import { IUser } from '../types'; // Import IUser type

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUser>('User', UserSchema);
export default User;
export type { IUser }; // Export IUser type
