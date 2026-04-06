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
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
