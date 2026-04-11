import { Router } from 'express';
import { getVaultStatus, createPolicy, getPolicies, deletePolicy, togglePolicyCompletion } from '../controllers/policyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/vault', authMiddleware, getVaultStatus);
router.post('/', authMiddleware, createPolicy);
router.get('/', authMiddleware, getPolicies);
router.delete('/:id', authMiddleware, deletePolicy);
router.patch('/:id/toggle', authMiddleware, togglePolicyCompletion);

export default router;
