import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

router.get('/consumption', historyController.getConsumptionHistory);
router.post('/consumption', historyController.recordConsumption);
router.get('/ai', historyController.getAiHistory);

export default router;
