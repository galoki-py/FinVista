import { Router } from 'express';
import { getVaultStatus, createPolicy, getPolicies, deletePolicy } from '../controllers/policyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/vault', authMiddleware, getVaultStatus);
router.post('/', authMiddleware, createPolicy);
router.get('/', authMiddleware, getPolicies);
router.delete('/:id', authMiddleware, deletePolicy);

export default router;
