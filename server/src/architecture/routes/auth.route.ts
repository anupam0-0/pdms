import { Router } from 'express';
import { register, login, logout, getMe, getProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);
router.get('/profile', authMiddleware, getProfile)

export default router;
