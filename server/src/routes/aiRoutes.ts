import { Router } from 'express';
import { getAIInsights, getLearningModules } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/insights', authMiddleware, getAIInsights);
router.get('/learning', authMiddleware, getLearningModules);

export default router;
