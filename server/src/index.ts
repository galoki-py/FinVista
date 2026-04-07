import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import policyRoutes from './routes/policyRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();
const PORT: string | number = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('FinVista Server is running');
});

// Fiscal Flow Engine placeholder
app.get('/api/fiscal-flow', (req: Request, res: Response) => {
  res.json({ message: 'Fiscal Flow Engine status: Operational' });
});

const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finvista';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on all interfaces at port ${PORT}`);
    });
  } catch (error) {
    console.error('Initial startup error:', error);
    process.exit(1);
  }
};

startServer();
