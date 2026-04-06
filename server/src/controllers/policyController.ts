import { Request, Response } from 'express';
import Policy from '../models/Policy';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

export const getVaultStatus = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) });
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const netBalance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, netBalance });
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
