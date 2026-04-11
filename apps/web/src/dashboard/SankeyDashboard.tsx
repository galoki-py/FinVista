import React, { useEffect, useState, useCallback } from 'react';
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import type { SankeyData, Insight } from '@finvista/types';
import { Sparkles, AlertCircle, Info, Zap, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CustomNode = (props: any) => {
    const { x, y, width, height, index, payload, containerWidth } = props;
    const isOut = x + width + 6 > containerWidth;
    
    return (
        <Layer key={`sankey-node-${index}`}>
            <Rectangle
                x={x}
                y={y}
                width={width}
                height={height}
                fill={payload.fill || 'var(--primary)'}
                fillOpacity={0.9}
            />
            <text
                x={x + (isOut ? -6 : width + 6)}
                y={y + height / 2}
                textAnchor={isOut ? 'end' : 'start'}
                fill="var(--text-primary)"
                fontSize="12px"
                fontWeight={700}
                alignmentBaseline="middle"
            >
                {payload.name}
            </text>
        </Layer>
    );
};

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
            
            // Ensure color is assigned based on category for visibility
            const coloredNodes = response.data.nodes.map((node: any) => {
                let color = '#3498DB'; // Default Blue (Pool)
                const name = node.name.toLowerCase();
                if (name.includes('salary') || name.includes('income') || name.includes('earnings')) color = '#2ECC71'; // Green (Income)
                if (name.includes('spend') || name.includes('expense') || name.includes('rent') || name.includes('food')) color = '#E74C3C'; // Red (Expense)
                return { ...node, fill: color };
            });
            
            setData({ ...response.data, nodes: coloredNodes });
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

    if (loading) return (
        <div style={{ color: 'var(--text-secondary)', padding: '4rem', textAlign: 'center' }}>
            <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>Calculating money flow...</p>
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card" style={{ backgroundColor: 'white', minHeight: '600px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800 }}>Strategic Money Flow</h2>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Weekly spending visualized from income to category pools.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <span style={{ color: '#2ECC71', backgroundColor: '#E9F7EF', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Income</span>
                            <span style={{ color: '#3498DB', backgroundColor: '#EBF5FB', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Pool</span>
                            <span style={{ color: '#E74C3C', backgroundColor: '#FDEDEC', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Expense</span>
                        </div>
                    </div>

                    {!data || data.nodes.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
                            <Info size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                            <h3>No Transaction Data Found</h3>
                            <p>Log some spends on the mobile app to see your financial flow.</p>
                        </div>
                    ) : (
                        <div style={{ height: '450px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <Sankey
                                    data={data}
                                    nodeWidth={24}
                                    nodePadding={40}
                                    link={{ stroke: '#D4E6F1', strokeOpacity: 0.5 }}
                                    margin={{ top: 20, left: 20, right: 120, bottom: 20 }}
                                    node={<CustomNode />}
                                >
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                            fontWeight: 600
                                        }}
                                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
                                    />
                                </Sankey>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="card" style={{ 
                    background: 'linear-gradient(90deg, #FFFFFF 0%, #F4FBF7 100%)',
                    border: '1px solid var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '2rem',
                    borderRadius: '16px'
                }}>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ padding: '1.25rem', backgroundColor: 'white', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                            <Sparkles size={32} color="var(--primary)" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Gemini Fiscal Auditor</h3>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Instant intentional analysis of your recent spending flow.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={triggerAudit} 
                        className="btn btn-primary" 
                        disabled={auditing}
                        style={{ padding: '1rem 2rem', fontWeight: 800, minWidth: '240px', borderRadius: '12px' }}
                    >
                        {auditing ? <><RefreshCw size={18} className="spin" /> Auditing Flow...</> : <><Zap size={18} /> Trigger Gemini Audit</>}
                    </button>
                    <style>{`
                        .spin { animation: spin 1s linear infinite; margin-right: 0.5rem; }
                        @keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
                    `}</style>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {insights.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border-color)', backgroundColor: 'transparent', borderRadius: '16px' }}>
                        <div style={{ display: 'inline-block', padding: '1.5rem', backgroundColor: 'white', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Info size={32} color="var(--text-secondary)" />
                        </div>
                        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.25rem', fontWeight: 800 }}>Audit Pending</h4>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>Trigger the auditor to receive actionable fiscal advice based on your current money flow.</p>
                    </div>
                ) : (
                    <div className="card" style={{ border: '2px solid var(--primary-light)', backgroundColor: '#F4FBF7', borderRadius: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '8px' }}>
                                <Sparkles size={20} />
                            </div>
                            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem', fontWeight: 900 }}>Audit Results</h3>
                        </div>
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {insights.map((insight, idx) => (
                                <div key={idx} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '16px', borderLeft: '6px solid var(--primary)', boxShadow: '0 5px 15px rgba(0,0,0,0.04)' }}>
                                    <div style={{ fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)', fontSize: '1.05rem' }}>{insight.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>{insight.description}</div>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        gap: '0.75rem', 
                                        fontSize: '0.9rem', 
                                        color: 'var(--primary)', 
                                        fontWeight: 800,
                                        backgroundColor: '#F8F9FA',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #EDEDED'
                                    }}>
                                        <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} /> 
                                        <div>Rec: {insight.recommendation}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '2.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', opacity: 0.7 }}>
                            Insights based on your Active Saving Policies and Recent Transactions.
                        </p>
                    </div>
                )}

                <div className="card" style={{ borderRadius: '16px' }}>
                    <h4 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
                        <Info size={20} color="var(--primary)" /> How to read this chart
                    </h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                        <p style={{ marginBottom: '1rem' }}>The width of the lines indicates the total amount of money moving from one state to another.</p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#2ECC71' }}></div>
                                <span><b>Green nodes</b> are your income sources.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#3498DB' }}></div>
                                <span><b>Blue nodes</b> represent your main pool of funds.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#E74C3C' }}></div>
                                <span><b>Red nodes</b> are where your money is spent.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SankeyDashboard;
