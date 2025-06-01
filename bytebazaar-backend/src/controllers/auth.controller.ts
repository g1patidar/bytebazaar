import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body, "req.body");
    const { name, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    console.log(password, confirmPassword);

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ name, email, password: hashedPassword, confirmPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { userId: string; name: string };
    const newAccessToken = generateAccessToken({ userId: payload.userId, name: payload.name });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Getting an error while generating the refresh token :", err)
    res.sendStatus(403); // Invalid token
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user: IUser | null = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken({ userId: user._id.toString(), name: user.name });
  const refreshToken = generateRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({ accessToken, name: user.name, email: user.email, isAdmin: user.isAdmin });

}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response): Promise<any> => {
  // `req.user` should be populated from `isAuthenticated` middleware
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  

  res.status(200).json({name: user.name as string , email: user.email as string, isAdmin: user.isAdmin as boolean});
};