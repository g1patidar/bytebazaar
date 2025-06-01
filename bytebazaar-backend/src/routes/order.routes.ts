import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/admin.middleware';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderStats
} from '../controllers/order.controller';

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Regular user routes
router.post('/', createOrder);
router.get('/my-orders', getOrders); // For regular users to get their own orders

// Admin routes
router.get('/', isAdmin, getOrders); // For admins to get all orders
router.get('/stats/overview', isAdmin, getOrderStats);
router.get('/:id', isAdmin, getOrderById);
router.put('/:id', isAdmin, updateOrder);
router.delete('/:id', isAdmin, deleteOrder);

export default router;
