import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', isAuthenticated, isAdmin, createCategory);
router.put('/:id', isAuthenticated, isAdmin, updateCategory);
router.delete('/:id', isAuthenticated, isAdmin, deleteCategory);

export default router;
