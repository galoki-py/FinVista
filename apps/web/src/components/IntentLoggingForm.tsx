import React, { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Heart, Meh, Frown, Sparkles, AlertCircle, Info } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categories = [
  'Food & Chai',
  'Transport (Metro/Auto)',
  'Education & Copies',
  'Social & Hanging Out',
  'Personal Care',
  'Others'
];

interface IntentLoggingFormProps {
  onSuccess: () => void;
}

const IntentLoggingForm: React.FC<IntentLoggingFormProps> = ({ onSuccess }) => {
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food & Chai',
    description: '',
    reflection: '',
    emotion: 'Neutral' as 'Satisfied' | 'Neutral' | 'Regret',
    isEssential: false
  });
  const [loading, setLoading] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/transactions`, {
        ...formData,
        amount: Number(formData.amount),
        type: 'expense'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        amount: '',
        category: 'Food & Chai',
        description: '',
        reflection: '',
        emotion: 'Neutral',
        isEssential: false
      });
      setShowReflection(false);
      onSuccess();
    } catch (err) {
      console.error('Failed to log transaction', err);
    } finally {
      setLoading(false);
    }
  };

  const emotions = [
    { id: 'Satisfied', icon: Heart, label: 'Satisfied', color: '#2ECC71' },
    { id: 'Neutral', icon: Meh, label: 'Neutral', color: '#3498DB' },
    { id: 'Regret', icon: Frown, label: 'Regret', color: '#E74C3C' }
  ];

  return (
    <div className="card" style={{ 
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F7FA 100%)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', borderRadius: '10px' }}>
            <Sparkles size={20} color="var(--primary)" />
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>Log with Intent</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pause. Reflect. Master your flow.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
                <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    style={{ 
                        width: '100%', 
                        fontSize: '1.5rem', 
                        fontWeight: 700, 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'white',
                        color: 'var(--primary)'
                    }}
                    required
                />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Category</label>
                <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{ 
                        width: '100%', 
                        padding: '1.15rem', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--border-color)',
                        backgroundColor: 'white',
                        fontSize: '0.95rem'
                    }}
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
        </div>

        <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
            <input 
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="e.g. Samosa at canteen"
                style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'white'
                }}
            />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--soft-white)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Essential Expense?</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Is this a "Need" or a "Want"?</div>
            </div>
            <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                <input 
                    type="checkbox" 
                    checked={formData.isEssential}
                    onChange={(e) => setFormData({...formData, isEssential: e.target.checked})}
                    style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: formData.isEssential ? 'var(--primary)' : '#ccc',
                    transition: '.4s',
                    borderRadius: '34px'
                }}>
                    <span style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px', width: '16px',
                        left: formData.isEssential ? '30px' : '4px',
                        bottom: '4px',
                        backgroundColor: 'white',
                        transition: '.4s',
                        borderRadius: '50%'
                    }} />
                </span>
            </label>
        </div>

        {!showReflection ? (
            <button 
                type="button"
                onClick={() => setShowReflection(true)}
                className="btn btn-primary"
                style={{ 
                    backgroundColor: 'white', 
                    color: 'var(--primary)', 
                    border: '1.5px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                <Info size={16} /> Add Intent & Emotion
            </button>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.85rem', color: 'var(--text-secondary)' }}>How do you feel about this spend?</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {emotions.map((emo) => (
                            <button
                                key={emo.id}
                                type="button"
                                onClick={() => setFormData({...formData, emotion: emo.id as any})}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: formData.emotion === emo.id ? `2px solid ${emo.color}` : '1.5px solid var(--border-color)',
                                    backgroundColor: formData.emotion === emo.id ? `${emo.color}10` : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <emo.icon size={24} color={formData.emotion === emo.id ? emo.color : '#95A5A6'} />
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: formData.emotion === emo.id ? emo.color : '#7F8C8D' }}>{emo.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Reflect: Why this spend? Did you really need it?</label>
                    <textarea 
                        value={formData.reflection}
                        onChange={(e) => setFormData({...formData, reflection: e.target.value})}
                        placeholder="I was hungry between classes..."
                        style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            borderRadius: '12px', 
                            border: '1.5px solid var(--border-color)',
                            minHeight: '100px',
                            resize: 'vertical'
                        }}
                    />
                </div>
            </div>
        )}

        <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
                padding: '1.25rem', 
                fontSize: '1rem', 
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.3)'
            }}
            disabled={loading}
        >
            {loading ? 'Logging Strategically...' : 'Log with Intent'}
        </button>
      </form>
    </div>
  );
};

export default IntentLoggingForm;
