import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  registrationStatus: {
    isRegistered: boolean;
    location?: {
      city: string;
      area: string;
    };
    monthlyEarnings?: number;
    averageMonthlySpending?: number;
    savingPolicies?: string;
    investmentTargets?: number;
    financialKnowledgeRating?: number;
  };
  points: number;
  completedModules: string[];
  quizAttempts: Array<{ moduleId: string; lastAttemptAt: Date }>;
  rank: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: { type: String },
  registrationStatus: {
    isRegistered: { type: Boolean, default: false },
    location: {
      city: { type: String },
      area: { type: String }
    },
    monthlyEarnings: { type: Number },
    averageMonthlySpending: { type: Number },
    savingPolicies: { type: String },
    investmentTargets: { type: Number },
    financialKnowledgeRating: { type: Number, min: 1, max: 5 }
  },
  points: { type: Number, default: 0 },
  completedModules: [{ type: String }],
  quizAttempts: [{
    moduleId: { type: String, required: true },
    lastAttemptAt: { type: Date, required: true }
  }],
  rank: { type: String, default: 'Novice' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model<IUser>('User', UserSchema);
