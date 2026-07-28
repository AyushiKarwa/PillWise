import { Request, Response } from 'express';
import { dataStore } from '../services/dataStore';

export const medicineController = {
  async getAllMedicines(req: Request, res: Response) {
    try {
      const medicines = await dataStore.getMedicines();
      res.json({ success: true, data: medicines });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async getMedicineById(req: Request, res: Response) {
    try {
      const medicine = await dataStore.getMedicineById(req.params.id);
      if (!medicine) {
        return res.status(404).json({ success: false, error: 'Medicine not found' });
      }
      res.json({ success: true, data: medicine });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async createMedicine(req: Request, res: Response) {
    try {
      const { name, quantity, dosage, expiryDate } = req.body;
      if (!name || quantity === undefined || !dosage || !expiryDate) {
        return res.status(400).json({ success: false, error: 'Name, quantity, dosage, and expiryDate are required fields.' });
      }

      const created = await dataStore.createMedicine(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async updateMedicine(req: Request, res: Response) {
    try {
      const updated = await dataStore.updateMedicine(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Medicine not found' });
      }
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async deleteMedicine(req: Request, res: Response) {
    try {
      await dataStore.deleteMedicine(req.params.id);
      res.json({ success: true, message: 'Medicine deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async toggleFavorite(req: Request, res: Response) {
    try {
      const updated = await dataStore.toggleFavorite(req.params.id);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Medicine not found' });
      }
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async restockMedicine(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      const restockQty = Number(amount) || 1;
      const updated = await dataStore.adjustQuantity(req.params.id, restockQty);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async consumeMedicine(req: Request, res: Response) {
    try {
      const { quantityTaken, notes } = req.body;
      const med = await dataStore.getMedicineById(req.params.id);
      if (!med) {
        return res.status(404).json({ success: false, error: 'Medicine not found' });
      }
      const qty = Number(quantityTaken) || 1;
      const historyDoc = await dataStore.recordConsumption(med._id, med.name, qty, notes);
      const updatedMed = await dataStore.getMedicineById(req.params.id);

      res.json({ success: true, data: { history: historyDoc, medicine: updatedMed } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
