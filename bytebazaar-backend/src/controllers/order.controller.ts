// POST /api/orders/:projectId
import { Request, Response } from 'express';
import Order from '../models/order.model';
import Project from '../models/project.model';

// POST /api/orders/:projectId
export const placeOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const existingOrder = await Order.findOne({ user: userId, project: projectId });
    if (existingOrder) return res.status(400).json({ message: 'You already ordered this project' });

    const newOrder = await Order.create({
      user: userId,
      project: project._id,
      price: project.price,
    });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err });
  }
};

// Get all orders with pagination
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('project', 'title price category thumbnail')
      .skip(skip)
      .limit(limit)
      .sort({ purchasedAt: -1 });

    const total = await Order.countDocuments();

    res.status(200).json({
      orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('project', 'title price category thumbnail');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.body;
    const userId = req.user?.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const existingOrder = await Order.findOne({ buyer: userId, project: projectId });
    if (existingOrder) {
      res.status(400).json({ message: 'You already ordered this project' });
      return;
    }

    const newOrder = await Order.create({
      buyer: userId,
      project: projectId,
      amount: project.price
    });

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('buyer', 'name email')
      .populate('project', 'title price category thumbnail');

    res.status(201).json({ message: 'Order created successfully', order: populatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Update order status
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    )
      .populate('buyer', 'name email')
      .populate('project', 'title price category thumbnail');

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

// Get order statistics
export const getOrderStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get orders in the last 7 days
    const lastWeekOrders = await Order.countDocuments({
      purchasedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Get revenue by day for the last 7 days
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          purchasedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$purchasedAt' } },
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      lastWeekOrders,
      dailyRevenue,
      averageOrderValue: totalOrders > 0 ? (revenue[0]?.total || 0) / totalOrders : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order statistics', error });
  }
};
  