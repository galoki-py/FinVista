import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  Target, 
  Plus, 
  Trash2, 
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import type { Policy, VaultStatus } from '@finvista/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Profile: React.FC = () => {
    const { user, token } = useAuthStore();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [vault, setVault] = useState<VaultStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [showNewPolicy, setShowNewPolicy] = useState(false);
    const [newPolicy, setNewPolicy] = useState({ name: '', targetAmount: 10000, category: 'Savings' });

    const fetchData = useCallback(async () => {
        try {
            const [policyRes, vaultRes] = await Promise.all([
                axios.get(`${API_URL}/policies`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/policies/vault`, { headers: { Authorization: `Bearer ${token}` } }) // Keep using vault status for balance
            ]);
            setPolicies(policyRes.data);
            setVault(vaultRes.data);
        } catch (err) {
            console.error('Failed to fetch profile data', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/policies`, newPolicy, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowNewPolicy(false);
            setNewPolicy({ name: '', targetAmount: 10000, category: 'Savings' });
            fetchData();
        } catch (err) {
            console.error('Failed to create policy', err);
        }
    };

    const handleDeletePolicy = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this target?')) return;
        try {
            await axios.delete(`${API_URL}/policies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error('Failed to delete policy', err);
        }
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading financial profile...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gap: '3rem' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--primary-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    border: '4px solid white',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                }}>
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0 }}>{user?.name}</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.2rem 0' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <span className="badge" style={{ backgroundColor: '#EBF5FB', color: 'var(--primary)' }}>Rank: {user?.rank}</span>
                        <span className="badge" style={{ backgroundColor: '#FDEDEC', color: '#E74C3C' }}>Points: {user?.points}</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                {/* Left Column: Personal Financial Stats */}
                <section style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShieldCheck size={20} color="var(--primary)" /> Profile Foundation
                        </h3>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <MapPin size={18} color="#aaa" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location</div>
                                    <div style={{ fontWeight: 600 }}>{user?.registrationStatus.location?.area}, {user?.registrationStatus.location?.city}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <IndianRupee size={18} color="#aaa" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Earnings</div>
                                    <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{user?.registrationStatus.monthlyEarnings?.toLocaleString()}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <GraduationCap size={18} color="#aaa" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Knowledge Rating</div>
                                    <div style={{ fontWeight: 600 }}>{user?.registrationStatus.financialKnowledgeRating}/5</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none' }}>
                        <h3 style={{ margin: '0 0 1rem 0', opacity: 0.9, fontSize: '1rem' }}>Net Investable Surplus</h3>
                        <div style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>₹{vault?.netBalance.toLocaleString()}</div>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Available across all accounts to fund your targets.</p>
                    </div>
                </section>

                {/* Right Column: Saving Policies & Targets */}
                <section>
                    <div className="card" style={{ minHeight: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Target size={20} color="var(--primary)" /> Saving Policies & Targets
                            </h3>
                            <button 
                                onClick={() => setShowNewPolicy(!showNewPolicy)}
                                style={{ 
                                    padding: '0.4rem 0.8rem', 
                                    fontSize: '0.8rem', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '0.4rem',
                                    backgroundColor: showNewPolicy ? 'var(--soft-white)' : 'var(--primary)',
                                    color: showNewPolicy ? 'var(--text-primary)' : 'white'
                                }}
                            >
                                {showNewPolicy ? 'Cancel' : <><Plus size={14} /> Add New Target</>}
                            </button>
                        </div>

                        {showNewPolicy && (
                            <form onSubmit={handleCreatePolicy} style={{ 
                                padding: '1.5rem', 
                                backgroundColor: 'var(--soft-white)', 
                                borderRadius: '12px', 
                                marginBottom: '2rem',
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem' }}>Target Name</label>
                                    <input value={newPolicy.name} onChange={e => setNewPolicy({...newPolicy, name: e.target.value})} placeholder="e.g. Dream House" required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Target Amount (₹)</label>
                                        <input type="number" value={newPolicy.targetAmount} onChange={e => setNewPolicy({...newPolicy, targetAmount: Number(e.target.value)})} required />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Category</label>
                                        <select value={newPolicy.category} onChange={e => setNewPolicy({...newPolicy, category: e.target.value})}>
                                            <option>Savings</option>
                                            <option>Retirement</option>
                                            <option>Emergency Fund</option>
                                            <option>Luxury</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="primary btn-block">Establish Target</button>
                            </form>
                        )}

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            {policies.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed #ddd', borderRadius: '16px' }}>
                                    <AlertCircle size={32} color="#aaa" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: 'var(--text-secondary)' }}>You haven't established any saving policies yet.</p>
                                </div>
                            )}
                            {policies.map(policy => {
                                const progress = vault && vault.netBalance > 0 ? Math.min(1, vault.netBalance / policy.targetAmount) : 0;
                                return (
                                    <div key={policy.id} style={{ 
                                        padding: '1.25rem', 
                                        borderRadius: '16px', 
                                        border: '1px solid var(--border-color)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
                                                    <TrendingUp size={16} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800 }}>{policy.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Goal: ₹{policy.targetAmount.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeletePolicy(policy.id)}
                                                style={{ padding: '0.3rem', backgroundColor: 'transparent', color: '#E74C3C' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div style={{ height: '6px', backgroundColor: 'var(--soft-white)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                                            <div style={{ height: '100%', backgroundColor: 'var(--primary)', width: `${progress * 100}%` }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{Math.round(progress * 100)}% coverage</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>₹{(policy.targetAmount - (vault?.netBalance || 0)).toLocaleString()} more needed</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            Tip: These targets are used by the Gemini AI to provide context-aware fiscal auditing.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;
