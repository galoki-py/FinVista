import { Router } from 'express';
import { createTransaction, getSankeyData, getDailySummary } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createTransaction);
router.get('/sankey', authMiddleware, getSankeyData);
router.get('/daily', authMiddleware, getDailySummary);

export default router;
