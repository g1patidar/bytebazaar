import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';

export const generateAccessToken = (payload: { userId: string; name: string }) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    { userId: user._id.toString(), name: user.name }, // ✅ structured like access token
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );
};
