export interface User {
  id: string;
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  
  // Registration Gate Fields
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
    financialKnowledgeRating?: 1 | 2 | 3 | 4 | 5;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegistrationData {
  city: string;
  area: string;
  monthlyEarnings: number;
  averageMonthlySpending: number;
  savingPolicies: string;
  investmentTargets: number;
  financialKnowledgeRating: 1 | 2 | 3 | 4 | 5;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  type: TransactionType;
  timestamp: Date;
}

export interface SankeyData {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
}

export interface Policy {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  isCompleted: boolean;
}

export interface VaultStatus {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

export type LearningCategory = 'fd' | 'sip' | 'market' | 'security' | 'chitfund' | 'realestate' | 'gold';

export interface LearningModule {
  id: string;
  category: LearningCategory;
  title: string;
  content: string;
  tier: number;
}

export interface Insight {
  id: string;
  userId: string;
  title: string;
  description: string;
  recommendation: string;
  timestamp: Date;
}
