import { Request, Response } from 'express';
import { generateFiscalInsight } from '../services/aiService';
import { financialContent } from '../data/financialContent';

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
  res.json(financialContent);
};
