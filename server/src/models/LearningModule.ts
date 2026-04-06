import mongoose, { Schema, Document } from 'mongoose';
import { LearningModule as ILearningModule } from '@finvista/types';

export interface ILearningModuleDocument extends ILearningModule, Document {}

const QuizQuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true }
});

const LearningModuleSchema: Schema = new Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['fd', 'sip', 'market', 'security', 'chitfund', 'realestate', 'gold', 'crypto', 'trading', 'mutualfunds', 'etfs']
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tier: { type: Number, required: true, min: 1, max: 4 },
  points: { type: Number, required: true },
  quiz: [QuizQuestionSchema]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<ILearningModuleDocument>('LearningModule', LearningModuleSchema);
