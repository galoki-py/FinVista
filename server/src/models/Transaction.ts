import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  type: 'income' | 'expense';
  reflection?: string;
  emotion?: 'Satisfied' | 'Neutral' | 'Regret';
  isEssential: boolean;
  timestamp: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' },
  reflection: { type: String },
  emotion: { type: String, enum: ['Satisfied', 'Neutral', 'Regret'] },
  isEssential: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

TransactionSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
