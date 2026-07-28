import { Router } from 'express';
import { medicineController } from '../controllers/medicineController';

const router = Router();

router.get('/', medicineController.getAllMedicines);
router.get('/:id', medicineController.getMedicineById);
router.post('/', medicineController.createMedicine);
router.put('/:id', medicineController.updateMedicine);
router.delete('/:id', medicineController.deleteMedicine);
router.patch('/:id/favorite', medicineController.toggleFavorite);
router.post('/:id/restock', medicineController.restockMedicine);
router.post('/:id/consume', medicineController.consumeMedicine);

export default router;
