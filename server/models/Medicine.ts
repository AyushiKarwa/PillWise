import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  quantity: number;
  dosage: string;
  expiryDate: string;
  formType?: string;
  salt?: string;
  purpose?: string;
  image?: string;
  favorite: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  uses?: string[];
  sideEffects?: string[];
  storageInfo?: string;
  precautions?: string[];
  alternatives?: string[];
}

const MedicineSchema = new Schema<IMedicine>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  dosage: { type: String, required: true, default: '1 tablet' },
  expiryDate: { type: String, required: true },
  formType: { type: String, default: 'Tablet' },
  salt: { type: String, default: '' },
  purpose: { type: String, default: '' },
  image: { type: String, default: '' },
  favorite: { type: Boolean, default: false },
  lowStockThreshold: { type: Number, default: 3 },
  createdAt: { type: Date, default: Date.now },
  uses: [{ type: String }],
  sideEffects: [{ type: String }],
  storageInfo: { type: String, default: 'Store in a cool, dry place away from direct sunlight.' },
  precautions: [{ type: String }],
  alternatives: [{ type: String }],
});

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);
