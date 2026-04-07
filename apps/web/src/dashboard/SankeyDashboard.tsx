import React, { useEffect, useState, useCallback } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import type { SankeyData, Insight } from '@finvista/types';
import { Sparkles, AlertCircle, Info, Zap, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SankeyDashboard: React.FC = () => {
    const { token } = useAuthStore();
    const [data, setData] = useState<SankeyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [auditing, setAuditing] = useState(false);
    const [insights, setInsights] = useState<Insight[]>([]);

    const fetchSankey = useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/transactions/sankey`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (err) {
            console.error('Failed to fetch Sankey data', err);
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
        fetchSankey();
    }, [fetchSankey]);

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Calculating money flow...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ height: '500px', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Strategic Money Flow</h2>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Weekly spending visualized from income to category pools.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            <span style={{ color: '#2ECC71' }}>Income</span>
                            <span style={{ color: 'var(--primary)' }}>Pool</span>
                            <span style={{ color: '#E74C3C' }}>Expense</span>
                        </div>
                    </div>

                    {!data || data.nodes.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <h3>No Transaction Data</h3>
                            <p>Log some spends on the mobile app to see your financial flow.</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="80%">
                            <Sankey
                                data={data}
                                node={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
                                link={{ stroke: 'var(--sky-blue-dark)', opacity: 0.2 }}
                                margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
                                nodePadding={50}
                            >
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        padding: '10px'
                                    }}
                                    formatter={(value: any) => `₹${value}`}
                                />
                            </Sankey>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="card" style={{ 
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #F4FBF7 100%)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <Sparkles size={32} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Gemini Fiscal Auditor</h3>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Instant intentional analysis of your recent spending flow.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={triggerAudit} 
                        className="btn btn-primary" 
                        disabled={auditing}
                        style={{ padding: '0.8rem 1.5rem', fontWeight: 800, minWidth: '220px' }}
                    >
                        {auditing ? <><RefreshCw size={16} className="spin" /> Auditing Flow...</> : <><Zap size={16} /> Trigger Gemini Audit</>}
                    </button>
                    <style>{`
                        .spin { animation: spin 1s linear infinite; margin-right: 0.5rem; }
                        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                    `}</style>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {insights.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', border: '1px dashed #ddd', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'inline-block', padding: '1rem', backgroundColor: 'white', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Info size={24} color="#aaa" />
                        </div>
                        <h4 style={{ margin: '0 0 0.5rem 0' }}>Expert Insights Pending</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Trigger the auditor to receive actionable fiscal advice based on your money flow.</p>
                    </div>
                ) : (
                    <div className="card" style={{ border: '2px solid var(--primary-light)', backgroundColor: '#F4FBF7' }}>
                        <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 800 }}>Audit Results</h3>
                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            {insights.map((insight, idx) => (
                                <div key={idx} style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '16px', borderLeft: '5px solid var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                    <div style={{ fontWeight: 800, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{insight.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>{insight.description}</div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        gap: '0.5rem', 
                                        fontSize: '0.8rem', 
                                        color: 'var(--primary)', 
                                        fontWeight: 700,
                                        backgroundColor: 'var(--soft-white)',
                                        padding: '0.75rem',
                                        borderRadius: '8px'
                                    }}>
                                        <AlertCircle size={14} style={{ marginTop: '2px' }} /> 
                                        <div>Rec: {insight.recommendation}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Insights based on your Active Saving Policies and Recent Transactions.
                        </p>
                    </div>
                )}

                <div className="card">
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={16} /> How to read this chart
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        The width of the lines indicates the total amount of money moving from one state to another.
                        <br /><br />
                        <b>Green nodes</b> on the left are your income sources.
                        <br />
                        <b>Blue nodes</b> in the center represent your main pool of funds.
                        <br />
                        <b>Red nodes</b> on the right are where your money is spent.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SankeyDashboard;
