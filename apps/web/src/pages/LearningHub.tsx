import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { 
  TrendingUp, ShieldCheck, Landmark, PiggyBank, 
  Bitcoin, BarChart3, Layers, RefreshCw, 
  Users, Home, Coins, ChevronRight, CheckCircle2,
  Trophy, Zap, X, ChevronLeft
} from 'lucide-react';
import type { LearningModule } from '@finvista/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const categoryIcons: Record<string, React.ReactNode> = {
  fd: <Landmark size={24} />,
  sip: <PiggyBank size={24} />,
  market: <TrendingUp size={24} />,
  security: <ShieldCheck size={24} />,
  chitfund: <Users size={24} />,
  realestate: <Home size={24} />,
  gold: <Coins size={24} />,
  crypto: <Bitcoin size={24} />,
  trading: <BarChart3 size={24} />,
  mutualfunds: <Layers size={24} />,
  etfs: <RefreshCw size={24} />
};

const categoryLabels: Record<string, string> = {
  fd: 'Fixed Deposits',
  sip: 'SIPs',
  market: 'Stock Market',
  security: 'Securities',
  chitfund: 'Chit Funds',
  realestate: 'Real Estate',
  gold: 'Gold',
  crypto: 'Crypto',
  trading: 'Trading',
  mutualfunds: 'Mutual Funds',
  etfs: 'ETFs'
};

const LearningHub: React.FC = () => {
  const { token, user: authUser, setUser } = useAuthStore();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'next' | 'prev'>('none');
  const [submitting, setSubmitting] = useState(false);

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

  const categories = Array.from(new Set(modules.map(m => m.category)));
  const filteredModules = activeCategory 
    ? modules.filter(m => m.category === activeCategory)
    : modules;

  const getCooldownTime = (moduleId: string) => {
    const attempt = authUser?.quizAttempts?.find(a => a.moduleId === moduleId);
    if (!attempt) return null;
    const lastAt = new Date(attempt.lastAttemptAt).getTime();
    const now = new Date().getTime();
    const diff = now - lastAt;
    const limit = 24 * 60 * 60 * 1000;
    if (diff < limit) {
      return limit - diff;
    }
    return null;
  };

  const formatCooldown = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleStartQuiz = () => {
    if (!selectedModule) return;
    const cooldown = getCooldownTime(selectedModule.id);
    if (cooldown) {
        alert(`You must wait ${formatCooldown(cooldown)} before retaking this quiz.`);
        return;
    }
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setSelectedOptions({});
    setQuizCompleted(false);
  };

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestionIndex]: optionIdx }));
  };

  const navigateQuestion = (dir: 'next' | 'prev') => {
    setSlideDirection(dir);
    setTimeout(() => {
        if (dir === 'next') setCurrentQuestionIndex(prev => prev + 1);
        else setCurrentQuestionIndex(prev => prev - 1);
        setSlideDirection('none');
    }, 200);
  };

  const submitQuiz = async () => {
    if (!selectedModule) return;
    setSubmitting(true);
    try {
      let score = 0;
      selectedModule.quiz.forEach((q, idx) => {
        if (selectedOptions[idx] === q.correctIndex) score++;
      });

      const res = await axios.post(`${API_URL}/ai/learning/submit-quiz`, {
        moduleId: selectedModule.id,
        score: score
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.user && authUser) {
        setUser({ ...authUser, ...res.data.user });
      }
      setQuizCompleted(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to submit quiz';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>Loading modules...</div>;

  return (
    <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header & User Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Learning Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Master financial genres and earn your Legend rank through interactive quizzes.</p>
        </div>
        
        <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            background: 'var(--soft-white)', 
            padding: '1rem 1.5rem', 
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Points</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Zap size={20} fill="var(--primary)" /> {authUser?.points || 0}
                </div>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Your Rank</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F1C40F', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <Trophy size={20} fill="#F1C40F" /> {authUser?.rank || 'Novice'}
                </div>
            </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div style={{ 
        display: 'flex', 
        gap: '0.75rem', 
        marginBottom: '2.5rem', 
        overflowX: 'auto', 
        paddingBottom: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        <button 
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeCategory === null ? 'var(--primary)' : 'var(--soft-white)',
            color: activeCategory === null ? 'white' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap'
          }}
        >All Topics</button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: activeCategory === cat ? 'var(--primary)' : 'var(--soft-white)',
              color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filteredModules.map(module => {
          const isCompleted = authUser?.completedModules?.includes(module.id);
          const cooldown = getCooldownTime(module.id);
          return (
            <div 
              key={module.id} 
              className="card" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid var(--border-color)',
                position: 'relative',
                opacity: cooldown ? 0.7 : 1,
              }}
              onClick={() => {
                setSelectedModule(module);
                setShowQuiz(false);
                setQuizCompleted(false);
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isCompleted && (
                <div style={{ 
                  position: 'absolute', 
                  top: '1rem', 
                  right: '1rem', 
                  color: '#27AE60',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  <CheckCircle2 size={16} /> DONE
                </div>
              )}
              {cooldown && (
                <div style={{ 
                    position: 'absolute', 
                    bottom: '1rem', 
                    right: '1rem', 
                    backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                    color: '#E74C3C',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    fontWeight: 700
                }}>
                  LOCK: {formatCooldown(cooldown)}
                </div>
              )}
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '10px', 
                backgroundColor: isCompleted ? '#E8F6EF' : 'var(--soft-white)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: isCompleted ? '#27AE60' : 'var(--primary)',
                marginBottom: '1.25rem'
              }}>
                {categoryIcons[module.category]}
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{module.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ 
                      fontSize: '0.65rem', 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '20px', 
                      backgroundColor: 'rgba(52, 152, 219, 0.1)', 
                      color: '#3498DB',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                  }}>Tier {module.tier}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Zap size={14} /> 50 pts potential
                  </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up Modal for Content & Quiz */}
      {selectedModule && (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                borderRadius: '32px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                {/* Close Button */}
                <button 
                    onClick={() => { setSelectedModule(null); setShowQuiz(false); }}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'var(--soft-white)',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                ><X size={20} /></button>

                {!showQuiz ? (
                    <div style={{ overflowY: 'auto', flex: 1, padding: '3rem' }}>
                        <div style={{ 
                            color: 'var(--primary)', 
                            fontWeight: 700, 
                            fontSize: '0.9rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '1px',
                            marginBottom: '0.5rem'
                        }}>
                            {categoryLabels[selectedModule.category]} • Module {selectedModule.tier}
                        </div>
                        <h2 style={{ fontSize: '2.5rem', margin: '0 0 2rem 0', color: 'var(--text-primary)', lineHeight: '1.2' }}>{selectedModule.title}</h2>
                        <div style={{ lineHeight: '1.8', fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', whiteSpace: 'pre-wrap' }}>
                            {selectedModule.content}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
                            <button 
                                onClick={handleStartQuiz}
                                style={{ 
                                    backgroundColor: 'var(--primary)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '1.2rem 3rem', 
                                    borderRadius: '16px', 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700, 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 10px 20px rgba(71, 107, 255, 0.2)'
                                }}
                            >
                                Start Module Quiz <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {!quizCompleted ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '3rem' }}>
                                {/* Quiz Header */}
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Question {currentQuestionIndex + 1}/{selectedModule.quiz.length}</span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{Object.keys(selectedOptions).length * 10} Points Earned</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--soft-white)', borderRadius: '4px' }}>
                                        <div style={{ 
                                            width: `${((currentQuestionIndex + 1) / selectedModule.quiz.length) * 100}%`, 
                                            height: '100%', 
                                            background: 'var(--primary)', 
                                            borderRadius: '4px',
                                            transition: 'width 0.4s ease'
                                        }} />
                                    </div>
                                </div>

                                {/* Question Area - Scrollable if options are many */}
                                <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                                    <div style={{
                                        transition: 'all 0.3s ease',
                                        transform: slideDirection === 'next' ? 'translateX(-100px)' : slideDirection === 'prev' ? 'translateX(100px)' : 'translateX(0)',
                                        opacity: slideDirection !== 'none' ? 0 : 1
                                    }}>
                                        <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '2.5rem' }}>
                                            {selectedModule.quiz[currentQuestionIndex].question}
                                        </h2>
                                        <div style={{ display: 'grid', gap: '1rem', paddingBottom: '1rem' }}>
                                            {selectedModule.quiz[currentQuestionIndex].options.map((opt, idx) => {
                                                const isSelected = selectedOptions[currentQuestionIndex] === idx;
                                                return (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => handleOptionSelect(idx)}
                                                        style={{
                                                            padding: '1.25rem 1.5rem',
                                                            borderRadius: '16px',
                                                            border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                                                            background: isSelected ? 'rgba(71, 107, 255, 0.05)' : 'white',
                                                            textAlign: 'left',
                                                            fontSize: '1.1rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            color: isSelected ? 'var(--primary)' : 'var(--text-primary)'
                                                        }}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation Footer */}
                                <div style={{ 
                                    paddingTop: '2rem', 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    backgroundColor: 'white' 
                                }}>
                                    <div>
                                        {currentQuestionIndex > 0 && (
                                            <button 
                                                onClick={() => navigateQuestion('prev')}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    fontWeight: 700
                                                }}
                                            >
                                                <ChevronLeft size={20} /> Back
                                            </button>
                                        )}
                                    </div>

                                    {selectedOptions[currentQuestionIndex] !== undefined && (
                                        <button 
                                            onClick={currentQuestionIndex === selectedModule.quiz.length - 1 ? submitQuiz : () => navigateQuestion('next')}
                                            disabled={submitting}
                                            style={{
                                                backgroundColor: 'var(--text-primary)',
                                                color: 'white',
                                                padding: '1rem 2.5rem',
                                                borderRadius: '14px',
                                                border: 'none',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                transition: 'all 0.2s',
                                                opacity: submitting ? 0.7 : 1
                                            }}
                                        >
                                            {currentQuestionIndex === selectedModule.quiz.length - 1 ? (submitting ? 'Submitting...' : 'Submit Quiz') : 'Next Question'}
                                            {currentQuestionIndex < selectedModule.quiz.length - 1 && <ChevronRight size={20} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '4rem', textAlign: 'center', overflowY: 'auto' }}>
                                <div style={{ 
                                    width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E8F6EF', color: '#27AE60', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto'
                                }}>
                                    <Trophy size={50} fill="#27AE60" />
                                </div>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>Great Work!</h2>
                                <p style={{ fontSize: '1.3rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                                    Quiz Submitted! You've successfully added this module to your specialized knowledge base.
                                </p>
                                <button 
                                    onClick={() => { setSelectedModule(null); setShowQuiz(false); }}
                                    style={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'white',
                                        padding: '1.2rem 4rem',
                                        borderRadius: '16px',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >Continue Learning</button>
                            </div>
                        )}
                    </div>
                )}
                
                <style>{`
                    @keyframes modalPop {
                        from { transform: scale(0.9); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `}</style>
            </div>
        </div>
      )}
    </div>
  );
};

// Helper for mobile scrolling inside modal
const ScrollView: React.FC<{ children: React.ReactNode, style?: React.CSSProperties }> = ({ children, style }) => (
    <div style={{ overflowY: 'auto', flex: 1, ...style }}>{children}</div>
);

export default LearningHub;
