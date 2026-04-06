import { Router } from 'express';
import { getAIInsights, getLearningModules, submitQuiz } from '../controllers/aiController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/insights', authMiddleware, getAIInsights);
router.get('/learning', authMiddleware, getLearningModules);
router.post('/learning/submit-quiz', authMiddleware, submitQuiz);

export default router;
