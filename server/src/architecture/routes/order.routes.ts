import { Router } from 'express';
import { 
  getAllOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/order.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Order routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus); // Admin only
router.put('/:id/cancel', cancelOrder);

export default router;

