import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Inventory from '../models/Inventory';
import { authMiddleware } from '../../middlewares/auth';

// Get all orders (user sees their own, admin sees all)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    let query: any = {};
    
    // If user is not admin, only show their own orders
    if (req.user?.role !== 'admin') {
      query.customer = req.user?._id;
    }
    
    const orders = await Order.find(query)
      .populate('customer', 'fullName email')
      .populate('items.product', 'name price imageUrls')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'fullName email')
      .populate('items.product', 'name price imageUrls');
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    // Check if user can view this order
    if (req.user?.role !== 'admin' && order.customer._id.toString() !== (req.user as any)?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400).json({ message: `Product ${item.product} not found` });
        return;
      }
      
      // Check inventory
      const inventory = await Inventory.findOne({ 
        product: item.product, 
        seller: product.seller 
      });
      
      if (!inventory || inventory.stock < item.quantity) {
        res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
        return;
      }
      
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }
    
    const orderData = {
      customer: (req.user as any)?._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod'
    };
    
    const order = new Order(orderData);
    await order.save();
    
    // Update inventory
    for (const item of orderItems) {
      await Inventory.findOneAndUpdate(
        { product: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }
    
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'fullName email')
      .populate('items.product', 'name price imageUrls');
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'fullName email')
     .populate('items.product', 'name price imageUrls');
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error });
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    // Check if user can cancel this order
    if (req.user?.role !== 'admin' && order.customer.toString() !== (req.user as any)?._id.toString()) {
      res.status(403).json({ message: 'Not authorized to cancel this order' });
      return;
    }
    
    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      res.status(400).json({ 
        message: 'Order cannot be cancelled in current status' 
      });
      return;
    }
    
    // Update order status
    order.status = 'cancelled';
    await order.save();
    
    // Restore inventory
    for (const item of order.items) {
      await Inventory.findOneAndUpdate(
        { product: item.product },
        { $inc: { stock: item.quantity } }
      );
    }
    
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error });
  }
};
