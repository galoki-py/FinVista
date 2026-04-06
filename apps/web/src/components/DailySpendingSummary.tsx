import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingBag, Heart, Meh, Frown, CheckCircle, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Transaction {
  _id: string;
  amount: number;
  category: string;
  description: string;
  timestamp: string;
  emotion?: 'Satisfied' | 'Neutral' | 'Regret';
  isEssential: boolean;
  reflection?: string;
}

interface DailySummaryProps {
  refreshTrigger: number;
}

const DailySpendingSummary: React.FC<DailySummaryProps> = ({ refreshTrigger }) => {
  const { token } = useAuthStore();
  const [summary, setSummary] = useState<{ transactions: Transaction[], totalSpent: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/daily`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to fetch daily summary', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary, refreshTrigger]);

  const emotionIcons = {
    Satisfied: { Icon: Heart, color: '#2ECC71' },
    Neutral: { Icon: Meh, color: '#3498DB' },
    Regret: { Icon: Frown, color: '#E74C3C' }
  };

  if (loading && !summary) return <div>Loading today's flow...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="card" style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'white', 
          border: 'none',
          boxShadow: '0 10px 30px rgba(46, 204, 113, 0.2)'
      }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.5rem' }}>Today's Total Spend</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>₹{summary?.totalSpent.toLocaleString() || '0'}</div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            Today's Intentional Spends
        </h3>

        {summary?.transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No spending logged today. Pure liquidity!
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {summary?.transactions.map(t => {
                    const EmotionIcon = t.emotion ? emotionIcons[t.emotion].Icon : Meh;
                    const emotionColor = t.emotion ? emotionIcons[t.emotion].color : '#95A5A6';

                    return (
                        <div key={t._id} style={{ 
                            padding: '1rem', 
                            border: '1.5px solid var(--border-color)', 
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{t.category}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.description || 'No description'}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{t.amount.toLocaleString()}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                                    {t.isEssential ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#3498DB' }}>
                                            <CheckCircle size={12} /> Essential
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#95A5A6' }}>
                                            <XCircle size={12} /> Luxury/Want
                                        </div>
                                    )}
                                </div>

                                {t.emotion && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600, color: emotionColor }}>
                                        <EmotionIcon size={14} /> {t.emotion}
                                    </div>
                                )}
                            </div>

                            {t.reflection && (
                                <div style={{ 
                                    fontSize: '0.8rem', 
                                    fontStyle: 'italic', 
                                    color: 'var(--text-secondary)',
                                    backgroundColor: 'var(--soft-white)',
                                    padding: '0.75rem',
                                    borderRadius: '8px' 
                                }}>
                                    "{t.reflection}"
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default DailySpendingSummary;
