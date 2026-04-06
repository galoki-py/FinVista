import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { Target, Wallet, ArrowUpCircle, ArrowDownCircle, Sparkles, AlertCircle } from 'lucide-react';
import type { Policy, VaultStatus, Insight } from '@finvista/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VaultDashboard: React.FC = () => {
  const { token } = useAuthStore();
  const [vault, setVault] = useState<VaultStatus | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [vaultRes, policyRes] = await Promise.all([
        axios.get(`${API_URL}/policies/vault`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/policies`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setVault(vaultRes.data);
      setPolicies(policyRes.data);
    } catch (err) {
      console.error('Failed to fetch vault data', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const triggerAudit = async () => {
    setAuditing(true);
    try {
      const res = await axios.get(`${API_URL}/ai/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInsights(res.data);
    } catch (err) {
      console.error('AI Audit failed', err);
    } finally {
      setAuditing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Opening the vault...</div>;

  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 2fr' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
           {/* ... existing vault info ... */}
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', opacity: 0.9 }}>
            <Wallet size={20} />
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Net Vault Balance</h3>
          </div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 1.5rem 0', fontWeight: 800 }}>₹{vault?.netBalance.toLocaleString()}</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
            <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>Income</div>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowUpCircle size={14} /> ₹{vault?.totalIncome.toLocaleString()}
                </div>
            </div>
            <div>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>Expenses</div>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowDownCircle size={14} /> ₹{vault?.totalExpense.toLocaleString()}
                </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ 
            background: 'linear-gradient(135deg, #EBF5FB 0%, #FFFFFF 100%)',
            border: '2px solid var(--primary-light)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                <Sparkles size={80} color="var(--primary)" />
            </div>
            <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" /> Gemini Fiscal Auditor
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                Analyze your recent spending patterns against your saving policies for personalized insights.
            </p>
            <button 
                onClick={triggerAudit} 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                disabled={auditing}
            >
                {auditing ? 'Auditing Fiscal Flows...' : 'Trigger Gemini Audit'}
            </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {insights.length > 0 && (
            <div className="card" style={{ border: '1px solid var(--primary-light)', backgroundColor: '#F4FBF7' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 800 }}>Audit Results</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {insights.map((insight, idx) => (
                        <div key={idx} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{insight.title}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{insight.description}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                                <AlertCircle size={14} /> Rec: {insight.recommendation}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="card">
          <h3 style={{ margin: '0 0 2rem 0', color: 'var(--text-primary)' }}>Saving Policies & Goals</h3>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* ... policies mapping ... */}
          {policies.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No saving policies defined yet.</p>}
          {policies.map(policy => {
            const progress = vault && vault.netBalance > 0 ? Math.min(1, vault.netBalance / policy.targetAmount) : 0;
            return (
              <div key={policy.id} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--sky-blue)', borderRadius: '8px', color: '#3498DB' }}>
                        <Target size={18} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{policy.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Target: ₹{policy.targetAmount.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{Math.round(progress * 100)}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Coverage</div>
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--soft-white)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                    <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${progress * 100}%`, transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {vault && vault.netBalance >= policy.targetAmount 
                        ? 'Goal fully achieved with current vault balance.' 
                        : `₹${(policy.targetAmount - (vault?.netBalance || 0)).toLocaleString()} more needed in the vault.`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
};

export default VaultDashboard;
