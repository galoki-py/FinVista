import { Router } from 'express';
import { googleLogin, registerUser, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/google', googleLogin);
router.post('/register', authMiddleware, registerUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
