import { Router } from 'express';
import { 
  getAllFeaturedItems, 
  getActiveFeaturedItems,
  getFeaturedItemById, 
  createFeaturedItem, 
  updateFeaturedItem, 
  deleteFeaturedItem,
  cleanupExpiredFeaturedItems
} from '../controllers/featuredItems.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// Public routes
router.get('/', getAllFeaturedItems);
router.get('/active', getActiveFeaturedItems);
router.get('/:id', getFeaturedItemById);

// Admin routes
router.use(authMiddleware);
router.post('/', createFeaturedItem);
router.put('/:id', updateFeaturedItem);
router.delete('/:id', deleteFeaturedItem);
router.delete('/cleanup/expired', cleanupExpiredFeaturedItems);

export default router;