import { Router } from 'express';
import { reminderController } from '../controllers/reminderController';

const router = Router();

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.put('/:id', reminderController.updateReminder);
router.patch('/:id/action', reminderController.updateReminderAction);
router.delete('/:id', reminderController.deleteReminder);

export default router;
