import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  category: string;
  description?: string;
  type: 'income' | 'expense';
  timestamp: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['income', 'expense'], required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

TransactionSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
