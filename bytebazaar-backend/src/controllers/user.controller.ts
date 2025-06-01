import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';

// Get all users with pagination
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}, { password: 0, confirmPassword: 0 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id, { password: 0, confirmPassword: 0 });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const user = new User({
      name,
      email,
      password,
      confirmPassword: password,
      isAdmin
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user: { 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin 
    }});
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, isAdmin } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, isAdmin },
      { new: true, select: '-password -confirmPassword' }
    );

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Get user statistics
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = await User.countDocuments({ isAdmin: false });

    // Get users registered in the last 7 days
    const lastWeekUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      totalUsers,
      adminUsers,
      regularUsers,
      lastWeekUsers,
      adminPercentage: (adminUsers / totalUsers) * 100,
      regularPercentage: (regularUsers / totalUsers) * 100
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user statistics', error });
  }
};
