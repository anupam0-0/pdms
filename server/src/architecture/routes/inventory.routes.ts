import { Router } from 'express';
import { 
  getAllInventory, 
  getInventoryById, 
  createInventory, 
  updateInventory, 
  deleteInventory,
  getLowStockItems
} from '../controllers/inventory.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Inventory routes
router.get('/', getAllInventory);
router.get('/low-stock', getLowStockItems);
router.get('/:id', getInventoryById);
router.post('/', createInventory);
router.put('/:id', updateInventory);
router.delete('/:id', deleteInventory);

export default router;

