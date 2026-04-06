import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, TrendingUp, ShieldCheck, Landmark, PiggyBank, Briefcase, Gem } from 'lucide-react';
import type { LearningModule, LearningCategory } from '@finvista/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categoryIcons: Record<LearningCategory, React.ReactNode> = {
  fd: <Landmark size={24} />,
  sip: <PiggyBank size={24} />,
  market: <TrendingUp size={24} />,
  security: <ShieldCheck size={24} />,
  chitfund: <Briefcase size={24} />,
  realestate: <BookOpen size={24} />,
  gold: <Gem size={24} />
};

const LearningHub: React.FC = () => {
  const { token } = useAuthStore();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get(`${API_URL}/ai/learning`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModules(res.data);
      } catch (err) {
        console.error('Failed to fetch learning modules', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [token]);

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading modules...</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Learning Hub</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Master your finances with tiered modules designed for undergraduate clarity.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {modules.map(module => (
          <div 
            key={module.id} 
            className="card" 
            style={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              border: selectedModule?.id === module.id ? '2px solid var(--primary)' : '1px solid var(--border-color)'
            }}
            onClick={() => setSelectedModule(module)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '12px', 
              backgroundColor: 'var(--soft-white)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.5rem'
            }}>
              {categoryIcons[module.category]}
            </div>
            <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-primary)' }}>{module.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '20px', 
                    backgroundColor: 'var(--sky-blue)', 
                    color: '#3498DB',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>Tier {module.tier}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>5 min read</span>
            </div>
          </div>
        ))}
      </div>

      {selectedModule && (
        <div style={{ 
          marginTop: '3rem', 
          backgroundColor: 'white', 
          borderRadius: '20px', 
          padding: '3rem', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>{selectedModule.title}</h2>
            <button 
                onClick={() => setSelectedModule(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}
            >Close</button>
          </div>
          <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            {selectedModule.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningHub;
