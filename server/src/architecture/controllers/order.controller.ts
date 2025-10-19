import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Inventory from '../models/Inventory';
import { authMiddleware } from '../../middlewares/auth';
import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendNotFound,
  sendForbidden,
  sendServerError,
} from '../../utils/responseHelper';

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
    
    sendSuccess(res, 'Orders fetched successfully', orders);
  } catch (error) {
    sendServerError(res, 'Error fetching orders', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'fullName email')
      .populate('items.product', 'name price imageUrls');
    
    if (!order) {
      sendNotFound(res, 'Order not found', 'OrderNotFoundError');
      return;
    }
    
    // Check if user can view this order
    if (req.user?.role !== 'admin' && order.customer._id.toString() !== (req.user as any)?._id.toString()) {
      sendForbidden(res, 'Not authorized to view this order', 'UnauthorizedError');
      return;
    }
    
    sendSuccess(res, 'Order fetched successfully', order);
  } catch (error) {
    sendServerError(res, 'Error fetching order', error instanceof Error ? error.message : 'Unknown error');
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
        sendBadRequest(res, `Product ${item.product} not found`, 'ProductNotFoundError');
        return;
      }
      
      // Check inventory
      const inventory = await Inventory.findOne({ 
        product: item.product, 
        seller: product.seller 
      });
      
      if (!inventory || inventory.stock < item.quantity) {
        sendBadRequest(res, `Insufficient stock for product ${product.name}`, 'InsufficientStockError');
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
    
    sendCreated(res, 'Order created successfully', populatedOrder);
  } catch (error) {
    sendBadRequest(res, 'Error creating order', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== 'admin') {
      sendForbidden(res, 'Admin access required', 'AdminAccessRequiredError');
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
      sendNotFound(res, 'Order not found', 'OrderNotFoundError');
      return;
    }
    
    sendSuccess(res, 'Order status updated successfully', order);
  } catch (error) {
    sendBadRequest(res, 'Error updating order status', error instanceof Error ? error.message : 'Unknown error');
  }
};

// Cancel order
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      sendNotFound(res, 'Order not found', 'OrderNotFoundError');
      return;
    }
    
    // Check if user can cancel this order
    if (req.user?.role !== 'admin' && order.customer.toString() !== (req.user as any)?._id.toString()) {
      sendForbidden(res, 'Not authorized to cancel this order', 'UnauthorizedError');
      return;
    }
    
    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      sendBadRequest(res, 'Order cannot be cancelled in current status', 'OrderCancellationNotAllowedError');
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
    
    sendSuccess(res, 'Order cancelled successfully');
  } catch (error) {
    sendServerError(res, 'Error cancelling order', error instanceof Error ? error.message : 'Unknown error');
  }
};
