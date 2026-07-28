import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const reminderController = {
  async getReminders(req: Request, res: Response) {
    try {
      const reminders = await dataStore.getReminders();
      res.json({ success: true, data: reminders });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async createReminder(req: Request, res: Response) {
    try {
      const { medicineName } = req.body;
      if (!medicineName) {
        return res.status(400).json({ success: false, error: 'medicineName is required.' });
      }

      const created = await dataStore.createReminder(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateReminderAction(req: Request, res: Response) {
    try {
      const { action } = req.body; // 'taken' | 'snooze' | 'reset'
      const updated = await dataStore.toggleReminderStatus(req.params.id, action || 'taken');
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateReminder(req: Request, res: Response) {
    try {
      const updated = await dataStore.updateReminder(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Reminder not found' });
      }
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async deleteReminder(req: Request, res: Response) {
    try {
      await dataStore.deleteReminder(req.params.id);
      res.json({ success: true, message: 'Reminder deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
