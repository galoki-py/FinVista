import { Request, Response } from 'express';
import { generateFiscalInsight } from '../services/aiService';
import LearningModule from '../models/LearningModule';
import User from '../models/User';

export const getAIInsights = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const rawText = await generateFiscalInsight(userId);
    
    // Parse the raw text into structured insights
    const insightBlocks = rawText.split('---').map(block => {
        const lines = block.trim().split('\n');
        const insight: any = {};
        lines.forEach(line => {
            if (line.startsWith('TITLE:')) insight.title = line.replace('TITLE:', '').trim();
            if (line.startsWith('DESCRIPTION:')) insight.description = line.replace('DESCRIPTION:', '').trim();
            if (line.startsWith('RECOMMENDATION:')) insight.recommendation = line.replace('RECOMMENDATION:', '').trim();
        });
        return insight;
    }).filter(i => i.title);

    res.json(insightBlocks);
  } catch (error) {
    console.error('AI Controller error:', error);
    res.status(500).json({ error: 'Failed to fetch AI insights' });
  }
};

export const getLearningModules = async (req: Request, res: Response) => {
  try {
    const modules = await LearningModule.find().sort({ category: 1, tier: 1 });
    res.json(modules);
  } catch (error) {
    console.error('Fetch modules error:', error);
    res.status(500).json({ error: 'Failed to fetch learning modules' });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { moduleId, score } = req.body; // score is usually 1 (correct) or 0 (incorrect) or total for module

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const module = await LearningModule.findById(moduleId);
        if (!module) return res.status(404).json({ error: 'Module not found' });

        // If not already completed, award points
        if (!user.completedModules.includes(moduleId)) {
            user.completedModules.push(moduleId);
            user.points += module.points;
            
            // Recalculate Rank
            if (user.points < 500) user.rank = 'Novice';
            else if (user.points < 1500) user.rank = 'Apprentice';
            else if (user.points < 3000) user.rank = 'Strategist';
            else user.rank = 'Legend';

            await user.save();
        }

        res.json({ 
            message: 'Quiz submitted successfully', 
            user: { 
                points: user.points, 
                rank: user.rank,
                completedModules: user.completedModules
            } 
        });
    } catch (error) {
        console.error('Submit quiz error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

