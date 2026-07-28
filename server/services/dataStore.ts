import MedicineModel, { IMedicine } from '../models/Medicine';
import MedicineHistoryModel, { IMedicineHistory } from '../models/MedicineHistory';
import AiHistoryModel, { IAiHistory } from '../models/AiHistory';
import ReminderModel, { IReminder } from '../models/Reminder';
import { getIsMongoConnected } from '../config/db';

// Initial empty cabinet data - user starts fresh to add their own medicines
const initialMedicines: any[] = [];
const initialHistory: any[] = [];
const initialReminders: any[] = [];
const initialAiHistory: any[] = [];

// Memory store
let localMedicines: any[] = [];
let localHistory: any[] = [];
let localReminders: any[] = [];
let localAiHistory: any[] = [];

export const dataStore = {
  // --- MEDICINES ---
  async getMedicines() {
    if (getIsMongoConnected()) {
      return await (MedicineModel as any).find().sort({ createdAt: -1 });
    }
    return localMedicines;
  },

  async getMedicineById(id: string) {
    if (getIsMongoConnected()) {
      return await (MedicineModel as any).findById(id);
    }
    return localMedicines.find((m) => m._id === id) || null;
  },

  async createMedicine(data: any) {
    if (getIsMongoConnected()) {
      const doc = new (MedicineModel as any)(data);
      return await doc.save();
    }
    const newItem = {
      ...data,
      _id: 'med-' + Date.now(),
      createdAt: new Date().toISOString(),
      favorite: data.favorite ?? false,
      lowStockThreshold: data.lowStockThreshold ?? 3,
      uses: data.uses || [data.purpose || 'General medical use'],
      sideEffects: data.sideEffects || ['Consult doctor or pharmacist for side effect details'],
      storageInfo: data.storageInfo || 'Store in a cool, dry place.',
      precautions: data.precautions || ['Keep out of reach of children'],
      alternatives: data.alternatives || []
    };
    localMedicines.unshift(newItem);
    return newItem;
  },

  async updateMedicine(id: string, updates: any) {
    if (getIsMongoConnected()) {
      return await (MedicineModel as any).findByIdAndUpdate(id, updates, { new: true });
    }
    const index = localMedicines.findIndex((m) => m._id === id);
    if (index !== -1) {
      localMedicines[index] = { ...localMedicines[index], ...updates };
      return localMedicines[index];
    }
    return null;
  },

  async deleteMedicine(id: string) {
    if (getIsMongoConnected()) {
      await (MedicineModel as any).findByIdAndDelete(id);
      return true;
    }
    localMedicines = localMedicines.filter((m) => m._id !== id);
    localReminders = localReminders.filter((r) => r.medicineId !== id);
    return true;
  },

  async toggleFavorite(id: string) {
    const med = await this.getMedicineById(id);
    if (med) {
      const newFav = !med.favorite;
      return await this.updateMedicine(id, { favorite: newFav });
    }
    return null;
  },

  async adjustQuantity(id: string, amount: number) {
    const med = await this.getMedicineById(id);
    if (med) {
      const newQty = Math.max(0, med.quantity + amount);
      return await this.updateMedicine(id, { quantity: newQty });
    }
    return null;
  },

  // --- MEDICINE CONSUMPTION HISTORY ---
  async getHistory() {
    if (getIsMongoConnected()) {
      return await MedicineHistoryModel.find().sort({ createdAt: -1 });
    }
    return localHistory;
  },

  async recordConsumption(medicineId: string, medicineName: string, quantityTaken: number, notes?: string) {
    // 1. Log consumption item
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let historyDoc;
    if (getIsMongoConnected()) {
      const doc = new MedicineHistoryModel({
        medicineId,
        medicineName,
        quantityTaken,
        date: today,
        time: timeStr,
        notes: notes || 'Confirmed taking medicine'
      });
      historyDoc = await doc.save();
    } else {
      historyDoc = {
        _id: 'hist-' + Date.now(),
        medicineId,
        medicineName,
        quantityTaken,
        date: today,
        time: timeStr,
        notes: notes || 'Confirmed taking medicine',
        createdAt: new Date().toISOString()
      };
      localHistory.unshift(historyDoc);
    }

    // 2. Reduce inventory count by user-confirmed quantity
    await this.adjustQuantity(medicineId, -quantityTaken);

    return historyDoc;
  },

  // --- REMINDERS ---
  async getReminders() {
    if (getIsMongoConnected()) {
      return await (ReminderModel as any).find().sort({ createdAt: -1 });
    }
    return localReminders;
  },

  async createReminder(data: any) {
    const reminderData = {
      medicineId: data.medicineId || '',
      medicineName: data.medicineName,
      time: data.time || data.timeString || '09:00 AM',
      dosage: data.dosage || '1 Tablet after food',
      purpose: data.purpose || '',
      repeat: data.repeat || 'Daily',
      timings: data.timings || data.repeat || 'Daily',
      timeString: data.time || data.timeString || '09:00 AM',
      dosageToTake: data.dosageToTake || 1,
      completed: false,
      lastTakenDate: '',
      notes: data.notes || ''
    };

    if (getIsMongoConnected()) {
      const doc = new (ReminderModel as any)(reminderData);
      return await doc.save();
    }
    const newRem = {
      ...reminderData,
      _id: 'rem-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    localReminders.unshift(newRem);
    return newRem;
  },

  async toggleReminderStatus(id: string, action: 'taken' | 'snooze' | 'reset') {
    let reminder = null;
    if (getIsMongoConnected()) {
      reminder = await (ReminderModel as any).findById(id);
    } else {
      reminder = localReminders.find((r) => r._id === id);
    }

    if (!reminder) return null;

    if (action === 'taken') {
      const today = new Date().toISOString().split('T')[0];
      const dosage = reminder.dosageToTake || 1;

      // 1. Record consumption & reduce inventory
      await this.recordConsumption(reminder.medicineId, reminder.medicineName, dosage, `Taken via ${reminder.timings} reminder`);

      // 2. Mark reminder completed
      if (getIsMongoConnected()) {
        return await (ReminderModel as any).findByIdAndUpdate(
          id,
          { completed: true, lastTakenDate: today },
          { new: true }
        );
      } else {
        reminder.completed = true;
        reminder.lastTakenDate = today;
        return reminder;
      }
    } else if (action === 'reset') {
      if (getIsMongoConnected()) {
        return await (ReminderModel as any).findByIdAndUpdate(
          id,
          { completed: false },
          { new: true }
        );
      } else {
        reminder.completed = false;
        return reminder;
      }
    }
    return reminder;
  },

  async deleteReminder(id: string) {
    if (getIsMongoConnected()) {
      await (ReminderModel as any).findByIdAndDelete(id);
      return true;
    }
    localReminders = localReminders.filter((r) => r._id !== id);
    return true;
  },

  async updateReminder(id: string, updates: any) {
    if (getIsMongoConnected()) {
      return await (ReminderModel as any).findByIdAndUpdate(id, updates, { new: true });
    }
    const idx = localReminders.findIndex((r) => r._id === id);
    if (idx !== -1) {
      localReminders[idx] = { ...localReminders[idx], ...updates };
      return localReminders[idx];
    }
    return null;
  },

  // --- AI HISTORY ---
  async getAiHistory() {
    if (getIsMongoConnected()) {
      return await (AiHistoryModel as any).find().sort({ timestamp: -1 });
    }
    return localAiHistory;
  },

  async recordAiSearch(symptoms: string, aiResponse: any) {
    if (getIsMongoConnected()) {
      const doc = new (AiHistoryModel as any)({
        symptoms,
        aiResponse,
        timestamp: new Date()
      });
      return await doc.save();
    }
    const newAiRecord = {
      _id: 'ai-' + Date.now(),
      symptoms,
      aiResponse,
      timestamp: new Date().toISOString()
    };
    localAiHistory.unshift(newAiRecord);
    return newAiRecord;
  }
};
