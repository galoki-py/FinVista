import { GoogleGenerativeAI } from '@google/generative-ai';
import Transaction from '../models/Transaction';
import Policy from '../models/Policy';
import User from '../models/User';
import mongoose from 'mongoose';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateFiscalInsight = async (userId: string) => {
  try {
    const [user, transactions, policies] = await Promise.all([
      User.findById(userId),
      Transaction.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ timestamp: -1 }).limit(10),
      Policy.find({ userId: new mongoose.Types.ObjectId(userId) })
    ]);

    if (!user) throw new Error('User not found');

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Falling back to 1.5 stable as 2.0 might be exp/limited
        systemInstruction: "You are the FinVista Fiscal Auditor. Your goal is to analyze user spending and provide high-impact, intentional financial advice. Use the user's localized 'Saving Policies' to justify your recommendations. Be concise, firm, and encouraging."
    });

    const context = `
      User Stats:
      - Monthly Earnings: ₹${user.registrationStatus?.monthlyEarnings || 0}
      - Avg Monthly Spending: ₹${user.registrationStatus?.averageMonthlySpending || 0}
      - Knowledge Level: ${user.registrationStatus?.financialKnowledgeRating || 1}/5

      Active Saving Policies:
      ${policies.map(p => `- ${p.name}: Target ₹${p.targetAmount}`).join('\n')}

      Recent Transactions:
      ${transactions.map(t => `- ${t.type === 'expense' ? 'Spend' : 'Income'}: ₹${t.amount} on ${t.category}`).join('\n')}
    `;

    const prompt = `Based on the context, provide 3 key fiscal insights. Format each as: 
    TITLE: [Short Title]
    DESCRIPTION: [Concise Explanation]
    RECOMMENDATION: [Actionable Step]
    Separate insights with '---'`;

    const result = await model.generateContent([context, prompt]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Insight Error:', error);
    return "TITLE: Connection Error\nDESCRIPTION: We're having trouble reaching the Fiscal Auditor.\nRECOMMENDATION: Try again in a few minutes.";
  }
};
