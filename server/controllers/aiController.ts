import { Request, Response } from 'express';
import { geminiService } from '../services/geminiService';
import { dataStore } from '../services/dataStore';

export const aiController = {
  async evaluateSymptoms(req: Request, res: Response) {
    try {
      const { symptoms } = req.body;
      if (!symptoms || typeof symptoms !== 'string') {
        return res.status(400).json({ success: false, error: 'Symptoms string is required.' });
      }

      const cabinet = await dataStore.getMedicines();
      const aiResult = await geminiService.analyzeSymptoms(symptoms, cabinet);

      // Save to AI History
      await dataStore.recordAiSearch(symptoms, aiResult);

      res.json({ success: true, data: aiResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async scanMedicineOcr(req: Request, res: Response) {
    try {
      const { image, rawText } = req.body;
      const scanResult = await geminiService.scanMedicineBox(image, rawText);
      res.json({ success: true, data: scanResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async parsePrescriptionOcr(req: Request, res: Response) {
    try {
      const { image, rawText } = req.body;
      const prescriptionResult = await geminiService.parsePrescription(image, rawText);
      res.json({ success: true, data: prescriptionResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async checkInteractions(req: Request, res: Response) {
    try {
      const { medicines } = req.body;
      if (!Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide an array of medicine names.' });
      }

      const interactionResult = await geminiService.checkDrugInteractions(medicines);
      res.json({ success: true, data: interactionResult });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async chat(req: Request, res: Response) {
    try {
      const { message, selectedMedicine } = req.body;
      if (!message) {
        return res.status(400).json({ success: false, error: 'Message is required.' });
      }

      const cabinet = await dataStore.getMedicines();
      const reply = await geminiService.chatWithAi(message, cabinet, selectedMedicine);

      res.json({ success: true, reply });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
