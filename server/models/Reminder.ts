import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  medicineId?: string;
  medicineName: string;
  time: string;
  dosage: string;
  purpose?: string;
  repeat?: string;
  timings?: string;
  timeString?: string;
  dosageToTake?: number;
  completed: boolean;
  lastTakenDate?: string;
  notes?: string;
  createdAt: Date;
}

const ReminderSchema = new Schema<IReminder>({
  medicineId: { type: String, default: '' },
  medicineName: { type: String, required: true },
  time: { type: String, default: '09:00 AM' },
  dosage: { type: String, default: '1 Tablet after food' },
  purpose: { type: String, default: '' },
  repeat: { type: String, default: 'Daily' },
  timings: { type: String, default: 'Daily' },
  timeString: { type: String, default: '09:00 AM' },
  dosageToTake: { type: Number, default: 1 },
  completed: { type: Boolean, default: false },
  lastTakenDate: { type: String, default: '' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
