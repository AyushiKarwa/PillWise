import { Router } from 'express';
import { pharmacyController } from '../controllers/pharmacyController';

const router = Router();

router.get('/prices', pharmacyController.comparePrices);
router.get('/nearby', pharmacyController.getNearbyPharmacies);

export default router;
