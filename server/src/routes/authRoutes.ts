import { Router } from 'express';
import { googleLogin, login, register, registerUser, getCurrentUser } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/google', googleLogin);
router.post('/login', login);
router.post('/register', register);
router.post('/profile', authMiddleware, registerUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;
