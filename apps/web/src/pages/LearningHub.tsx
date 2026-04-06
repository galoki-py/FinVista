import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { 
  TrendingUp, ShieldCheck, Landmark, PiggyBank, 
  Bitcoin, BarChart3, Layers, RefreshCw, 
  Users, Home, Coins, ChevronRight, CheckCircle2, Award,
  Trophy, Zap
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
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

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

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleAnswer = (index: number) => {
    if (index === selectedModule?.quiz[currentQuestionIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIndex + 1 < (selectedModule?.quiz.length || 0)) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post(`${API_URL}/ai/learning/submit-quiz`, {
        moduleId: selectedModule?.id,
        score: quizScore
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local user state if rank/points changed
      if (res.data.user && authUser) {
        setUser({ ...authUser, ...res.data.user });
      }
      setQuizCompleted(true);
    } catch (err) {
      console.error('Failed to submit quiz', err);
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Master 10+ financial genres and earn your Legend rank.</p>
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
          return (
            <div 
              key={module.id} 
              className="card" 
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: selectedModule?.id === module.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                position: 'relative',
                opacity: isCompleted ? 0.9 : 1,
                transform: selectedModule?.id === module.id ? 'scale(1.02)' : 'scale(1)'
              }}
              onClick={() => {
                setSelectedModule(module);
                setShowQuiz(false);
                setQuizCompleted(false);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
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
                    <Award size={14} /> {module.points} pts
                  </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading & Quiz Section */}
      {selectedModule && (
        <div style={{ 
          marginTop: '4rem', 
          backgroundColor: 'white', 
          borderRadius: '24px', 
          padding: '3rem', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
          border: '1px solid var(--border-color)',
          maxWidth: '900px',
          margin: '4rem auto 0 auto'
        }}>
          {!showQuiz ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
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
                  <h2 style={{ fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)', lineHeight: '1.2' }}>{selectedModule.title}</h2>
                </div>
                <button 
                    onClick={() => setSelectedModule(null)}
                    style={{ background: 'var(--soft-white)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 600 }}
                >Close</button>
              </div>
              <div style={{ lineHeight: '1.9', fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                {selectedModule.content}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                    boxShadow: '0 10px 20px rgba(71, 107, 255, 0.2)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Start Module Quiz <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {!quizCompleted ? (
                <>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                      Question {currentQuestionIndex + 1} of {selectedModule.quiz.length}
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--soft-white)', borderRadius: '3px' }}>
                      <div style={{ 
                        width: `${((currentQuestionIndex + 1) / selectedModule.quiz.length) * 100}%`, 
                        height: '100%', 
                        background: 'var(--primary)', 
                        borderRadius: '3px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '2.5rem', color: 'var(--text-primary)' }}>
                    {selectedModule.quiz[currentQuestionIndex].question}
                  </h2>
                  <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                    {selectedModule.quiz[currentQuestionIndex].options.map((option, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        style={{ 
                          padding: '1.2rem', 
                          borderRadius: '14px', 
                          border: '2px solid var(--border-color)', 
                          background: 'white', 
                          cursor: 'pointer', 
                          fontSize: '1.1rem', 
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.backgroundColor = 'var(--soft-white)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: '2rem' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    backgroundColor: '#E8F6EF', 
                    color: '#27AE60', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 2rem auto'
                  }}>
                    <Trophy size={40} fill="#27AE60" />
                  </div>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Module Mastered!</h2>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                    You earned <strong>{selectedModule.points} points</strong> and moved closer to the next rank.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedModule(null);
                      setShowQuiz(false);
                    }}
                    style={{ 
                      backgroundColor: 'var(--text-primary)', 
                      color: 'white', 
                      border: 'none', 
                      padding: '1rem 2.5rem', 
                      borderRadius: '12px', 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      cursor: 'pointer'
                    }}
                  >Continue Learning</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningHub;
