import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const historyController = {
  async getConsumptionHistory(req: Request, res: Response) {
    try {
      const history = await dataStore.getHistory();
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async recordConsumption(req: Request, res: Response) {
    try {
      const { medicineId, medicineName, quantityTaken, notes } = req.body;
      if (!medicineId || !medicineName) {
        return res.status(400).json({ success: false, error: 'medicineId and medicineName are required.' });
      }

      const qty = Number(quantityTaken) || 1;
      const doc = await dataStore.recordConsumption(medicineId, medicineName, qty, notes);
      res.status(201).json({ success: true, data: doc });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getAiHistory(req: Request, res: Response) {
    try {
      const aiHist = await dataStore.getAiHistory();
      res.json({ success: true, data: aiHist });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
