import { Router } from 'express';
import { createTransaction, getSankeyData } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createTransaction);
router.get('/sankey', authMiddleware, getSankeyData);

export default router;
