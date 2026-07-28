import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicineHistory extends Document {
  medicineId: string;
  medicineName: string;
  quantityTaken: number;
  date: string;
  time: string;
  notes?: string;
  createdAt: Date;
}

const MedicineHistorySchema = new Schema<IMedicineHistory>({
  medicineId: { type: String, required: true },
  medicineName: { type: String, required: true },
  quantityTaken: { type: Number, required: true, default: 1 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MedicineHistory || mongoose.model<IMedicineHistory>('MedicineHistory', MedicineHistorySchema);
