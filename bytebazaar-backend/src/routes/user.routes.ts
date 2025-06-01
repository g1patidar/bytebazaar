import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/user.controller';

const router = express.Router();

// Public routes
router.get('/:id', getUserById);

// Protected routes (require authentication)
router.use(isAuthenticated);
router.get('/', getUsers);
router.post('/', isAdmin, createUser);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);
router.get('/stats/overview', isAdmin, getUserStats);

export default router; 