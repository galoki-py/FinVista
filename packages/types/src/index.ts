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
  
  points: number;
  completedModules: string[];
  quizAttempts: Array<{ moduleId: string; lastAttemptAt: Date }>;
  rank: string;
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
  surplus?: number;
  details?: {
    earnings: number;
    avgSpending: number;
    bufferAmount: number;
    currentMonthActualSpending: number;
    bufferPercent: number;
  };
}

export type LearningCategory = 'fd' | 'sip' | 'market' | 'security' | 'chitfund' | 'realestate' | 'gold' | 'crypto' | 'trading' | 'mutualfunds' | 'etfs';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LearningModule {
  id: string;
  category: LearningCategory;
  title: string;
  content: string;
  tier: number;
  points: number;
  quiz: QuizQuestion[];
}

export interface Insight {
  id: string;
  userId: string;
  title: string;
  description: string;
  recommendation: string;
  timestamp: Date;
}
