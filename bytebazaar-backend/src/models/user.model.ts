// src/models/user.model.ts
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    _id: string,
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // ✅
});

export default mongoose.model<IUser>('User', userSchema);
