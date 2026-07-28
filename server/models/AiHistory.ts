import mongoose, { Schema, Document } from 'mongoose';

export interface IAiHistory extends Document {
  symptoms: string;
  aiResponse: any;
  timestamp: Date;
}

const AiHistorySchema = new Schema<IAiHistory>({
  symptoms: { type: String, required: true },
  aiResponse: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.AiHistory || mongoose.model<IAiHistory>('AiHistory', AiHistorySchema);
