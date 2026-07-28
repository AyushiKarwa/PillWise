import { Router } from 'express';
import { aiController } from '../controllers/aiController';

const router = Router();

router.post('/symptoms', aiController.evaluateSymptoms);
router.post('/scan-medicine', aiController.scanMedicineOcr);
router.post('/parse-prescription', aiController.parsePrescriptionOcr);
router.post('/check-interactions', aiController.checkInteractions);
router.post('/chat', aiController.chat);

export default router;
