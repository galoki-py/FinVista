import { Request, Response } from 'express';
import Policy from '../models/Policy';
import Transaction from '../models/Transaction';
import User from '../models/User';
import mongoose from 'mongoose';

export const getVaultStatus = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allTransactions, currentMonthTransactions] = await Promise.all([
      Transaction.find({ userId: new mongoose.Types.ObjectId(userId) }),
      Transaction.find({ 
        userId: new mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startOfMonth },
        type: 'expense'
      })
    ]);
    
    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const netBalance = totalIncome - totalExpense;

    // Advanced Surplus Calculation
    const earnings = user.registrationStatus.monthlyEarnings || 0;
    const avgSpending = user.registrationStatus.averageMonthlySpending || 0;
    const currentMonthActualSpending = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Buffer Logic: 5% if earnings < 80k OR if (earnings - avgSpending) is high
    const spareReserves = earnings - avgSpending;
    const isHighReserves = spareReserves > (earnings * 0.5); // High if more than 50% left
    const bufferPercent = (earnings < 80000 || isHighReserves) ? 0.05 : 0.08;
    const bufferAmount = earnings * bufferPercent;

    const surplus = earnings - avgSpending - bufferAmount - currentMonthActualSpending;

    res.json({ 
      totalIncome, 
      totalExpense, 
      netBalance, 
      surplus: Math.max(0, surplus),
      details: {
        earnings,
        avgSpending,
        bufferAmount,
        currentMonthActualSpending,
        bufferPercent: bufferPercent * 100
      }
    });
  } catch (error) {
    console.error('Vault status error:', error);
    res.status(500).json({ error: 'Failed to fetch vault status' });
  }
};

export const createPolicy = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name, targetAmount, category } = req.body;

  try {
    const policy = await Policy.create({
      userId,
      name,
      targetAmount,
      category
    });
    res.status(201).json(policy);
  } catch (error) {
    console.error('Create policy error:', error);
    res.status(500).json({ error: 'Failed to create policy' });
  }
};

export const getPolicies = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const policies = await Policy.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json(policies);
  } catch (error) {
    console.error('Get policies error:', error);
    res.status(500).json({ error: 'Failed to fetch policies' });
  }
};

export const deletePolicy = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Policy.findByIdAndDelete(id);
        res.json({ message: 'Policy deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete policy' });
    }
}

export const togglePolicyCompletion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  try {
    const policy = await Policy.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
    if (!policy) {
      return res.status(404).json({ error: 'Policy not found' });
    }

    policy.isCompleted = !policy.isCompleted;
    await policy.save();

    res.json(policy);
  } catch (error) {
    console.error('Toggle policy error:', error);
    res.status(500).json({ error: 'Failed to toggle policy completion' });
  }
};
