import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import User from '../models/User';
import mongoose from 'mongoose';

export const createTransaction = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { amount, category, description, type, reflection, emotion, isEssential } = req.body;

  try {
    const transaction = await Transaction.create({
      userId,
      amount,
      category,
      description,
      type: type || 'expense',
      reflection,
      emotion,
      isEssential
    });
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const getSankeyData = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) });

    // Sankey Flow: Income Sources -> Total Pool -> Expense Categories
    const nodes: { name: string }[] = [{ name: 'Total Pool' }];
    const links: { source: number; target: number; value: number }[] = [];

    const incomeCategories = new Set<string>();
    const expenseCategories = new Set<string>();

    transactions.forEach(t => {
      if (t.type === 'income') incomeCategories.add(t.category);
      else expenseCategories.add(t.category);
    });

    const incomeList = Array.from(incomeCategories);
    const expenseList = Array.from(expenseCategories);

    // Map names to indices
    // 0: Total Pool
    // 1 to N: Income Categories
    // N+1 to M: Expense Categories

    incomeList.forEach((cat, i) => nodes.push({ name: cat }));
    expenseList.forEach((cat, i) => nodes.push({ name: cat }));

    const incomeOffset = 1;
    const expenseOffset = 1 + incomeList.length;

    // Links for Income -> Total Pool
    incomeList.forEach((cat, i) => {
      const sum = transactions
        .filter(t => t.type === 'income' && t.category === cat)
        .reduce((acc, t) => acc + t.amount, 0);
      links.push({ source: incomeOffset + i, target: 0, value: sum });
    });

    // Links for Total Pool -> Expense Categories
    expenseList.forEach((cat, i) => {
      const sum = transactions
        .filter(t => t.type === 'expense' && t.category === cat)
        .reduce((acc, t) => acc + t.amount, 0);
      links.push({ source: 0, target: expenseOffset + i, value: sum });
    });

    res.json({ nodes, links });
  } catch (error) {
    console.error('Sankey data error:', error);
    res.status(500).json({ error: 'Failed to fetch Sankey data' });
  }
};

export const getDailySummary = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const transactions = await Transaction.find({
      userId,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ timestamp: -1 });

    const totalSpent = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      transactions,
      totalSpent,
      date: startOfDay
    });
  } catch (error) {
    console.error('Daily summary error:', error);
    res.status(500).json({ error: 'Failed to fetch daily summary' });
  }
};
