import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicy extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  isCompleted: boolean;
}

const PolicySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  category: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

PolicySchema.index({ userId: 1 });

export default mongoose.model<IPolicy>('Policy', PolicySchema);
