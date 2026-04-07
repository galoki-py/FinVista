import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Banknote, 
  Flame, 
  ArrowRightLeft, 
  BarChart3, 
} from 'lucide-react';
import * as finUtils from '../utils/finance-utils';

const Tools: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<'Investment' | 'Loan' | 'Planning'>('Investment');
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    // Common state for inputs
    const [p, setP] = useState<number>(5000); 
    const [r, setR] = useState<number>(12);   
    const [n, setN] = useState<number>(10);   
    const [extra, setExtra] = useState<number>(5000); 
    const [inflation, setInflation] = useState<number>(6); 

    // Categories and their tools
    const toolCategories = [
        {
            name: 'Investment',
            icon: <TrendingUp size={20} />,
            color: '#2ECC71',
            tools: [
                { id: 'sip', name: 'SIP Calculator', description: 'Wealth building through monthly fixed investments' },
                { id: 'lumpsum', name: 'Lumpsum Return', description: 'One-time investment return calculation' },
                { id: 'stepup', name: 'Step-Up SIP', description: 'Impact of annual SIP increments as salary grows' }
            ]
        },
        {
            name: 'Loan',
            icon: <Banknote size={20} />,
            color: '#E74C3C',
            tools: [
                { id: 'emi', name: 'Standard EMI', description: 'For Home, Car, or Personal loans' },
                { id: 'prepayment', name: 'Loan Prepayment', description: 'Interest savings with extra monthly payments' },
                { id: 'reducing', name: 'Flat vs Reducing', description: 'Understand the "trick" banks use in rates' }
            ]
        },
        {
            name: 'Planning',
            icon: <Flame size={20} />,
            color: '#F39C12',
            tools: [
                { id: 'fire', name: 'FIRE Calculator', description: 'Corpus needed to stop working entirely' },
                { id: 'inflation', name: 'Inflation Impact', description: 'What ₹1 Lakh today will be worth in the future' },
                { id: 'stockAvg', name: 'Stock Average', description: 'Weighted purchase price for traders' }
            ]
        }
    ];

    // Select first tool of active category by default
    useEffect(() => {
        const cat = toolCategories.find(c => c.name === activeCategory);
        if (cat) setSelectedTool(cat.tools[0].id);
    }, [activeCategory]);

    // Memoize results to ensure they are always in sync with the selected tool and inputs
    const results = React.useMemo(() => {
        if (!selectedTool) return null;

        const res: any = (() => {
            switch (selectedTool) {
                case 'sip': return finUtils.calculateSIP(p, r, n);
                case 'lumpsum': return finUtils.calculateLumpsum(p, r, n);
                case 'stepup': return finUtils.calculateStepUpSIP(p, extra, r, n);
                case 'emi': return finUtils.calculateEMI(p, r, n);
                case 'prepayment': return finUtils.calculatePrepaymentSavings(p, r, n, extra);
                case 'fire': return finUtils.calculateFIRE(p, r || 4);
                case 'inflation': return finUtils.calculateInflation(p, inflation, n);
                case 'reducing': return { flat: p * (r/100) * n + p, reducing: finUtils.calculateEMI(p, r, n).totalPayment };
                case 'stockAvg': return finUtils.calculateStockAverage([{price: p, quantity: 100}, {price: p * 0.9, quantity: 100}]);
                default: return null;
            }
        })();
        return res;
    }, [selectedTool, p, r, n, extra, inflation]);

    const renderInputs = () => {
        switch (selectedTool) {
            case 'sip':
            case 'lumpsum':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Monthly/One-Time Amount (₹)</label><input type="range" min="500" max="100000" step="500" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{p.toLocaleString()}</div></div>
                        <div><label>Expected Return Rate (%)</label><input type="range" min="1" max="30" step="0.5" value={r} onChange={e => setR(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{r}%</div></div>
                        <div><label>Time Period (Years)</label><input type="range" min="1" max="40" step="1" value={n} onChange={e => setN(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{n} Years</div></div>
                    </div>
                );
            case 'stepup':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Initial Monthly SIP (₹)</label><input type="range" min="500" max="50000" step="500" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{p.toLocaleString()}</div></div>
                        <div><label>Annual Step-Up (%)</label><input type="range" min="1" max="25" step="1" value={extra} onChange={e => setExtra(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{extra}% every year</div></div>
                        <div><label>Expected Return Rate (%)</label><input type="range" min="1" max="30" step="0.5" value={r} onChange={e => setR(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{r}%</div></div>
                        <div><label>Time Period (Years)</label><input type="range" min="1" max="40" step="1" value={n} onChange={e => setN(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{n} Years</div></div>
                    </div>
                );
            case 'emi':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Loan Amount (₹)</label><input type="range" min="100000" max="50000000" step="100000" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{(p/100000).toFixed(1)} Lakhs</div></div>
                        <div><label>Interest Rate (%)</label><input type="range" min="1" max="20" step="0.1" value={r} onChange={e => setR(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{r}%</div></div>
                        <div><label>Tenure (Years)</label><input type="range" min="1" max="30" step="1" value={n} onChange={e => setN(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{n} Years</div></div>
                    </div>
                );
            case 'prepayment':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Outstanding Principal (₹)</label><input type="range" min="100000" max="10000000" step="100000" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{(p/100000).toFixed(1)} Lakhs</div></div>
                        <div><label>Monthly Prepayment (Extra ₹)</label><input type="range" min="1000" max="50000" step="1000" value={extra} onChange={e => setExtra(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>+ ₹{extra.toLocaleString()}/mo</div></div>
                        <div><label>Interest Rate (%)</label><input type="range" min="1" max="15" step="0.1" value={r} onChange={e => setR(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{r}%</div></div>
                        <div><label>Remaining Tenure (Yrs)</label><input type="range" min="1" max="30" step="1" value={n} onChange={e => setN(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{n} Years</div></div>
                    </div>
                );
            case 'fire':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Current Monthly Expenses (₹)</label><input type="range" min="5000" max="200000" step="1000" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{p.toLocaleString()}</div></div>
                        <div><label>Safe Withdrawal Rate (%)</label><input type="range" min="1" max="10" step="0.1" value={r} onChange={e => setR(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{r}%</div></div>
                    </div>
                );
            case 'inflation':
                return (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div><label>Current Amount (₹)</label><input type="range" min="1000" max="1000000" step="1000" value={p} onChange={e => setP(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>₹{p.toLocaleString()}</div></div>
                        <div><label>Inflation Rate (%)</label><input type="range" min="1" max="15" step="0.1" value={inflation} onChange={e => setInflation(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{inflation}%</div></div>
                        <div><label>Years from now</label><input type="range" min="1" max="30" step="1" value={n} onChange={e => setN(Number(e.target.value))} /> <div style={{fontWeight:800, fontSize:'1.2rem', color:'var(--primary)'}}>{n} Years</div></div>
                    </div>
                );
            default:
                return <p style={{color:'var(--text-secondary)'}}>Calculator inputs coming soon for this module.</p>;
        }
    }

    const renderResults = () => {
        if (!results) return null;

        return (
            <div style={{ 
                background: 'linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
                padding: '2rem',
                borderRadius: '24px',
                border: '1px solid var(--primary-light)',
                height: '100%'
            }}>
                <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BarChart3 size={20} color="var(--primary)" /> Projection Results
                </h3>
                
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {selectedTool === 'sip' || selectedTool === 'lumpsum' || selectedTool === 'stepup' ? (
                        <>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Maturity Value</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>₹{results.maturityValue?.toLocaleString()}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Invested Amount</div><div style={{ fontWeight: 700 }}>₹{results.totalInvestment?.toLocaleString()}</div></div>
                                <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Est. Returns</div><div style={{ fontWeight: 700, color: '#2ECC71' }}>₹{results.estimatedReturns?.toLocaleString()}</div></div>
                            </div>
                        </>
                    ) : selectedTool === 'emi' ? (
                        <>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Monthly EMI Payment</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#E74C3C' }}>₹{results.emi?.toLocaleString()}</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Principal Amount</div><div style={{ fontWeight: 700 }}>₹{p.toLocaleString()}</div></div>
                                <div><div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Interest</div><div style={{ fontWeight: 700, color: '#E74C3C' }}>₹{results.totalInterest?.toLocaleString()}</div></div>
                            </div>
                        </>
                    ) : selectedTool === 'prepayment' ? (
                        <>
                            <div style={{ padding: '1.5rem', backgroundColor: '#EBF5FB', borderRadius: '16px' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Interest Saved</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>₹{results.interestSaved?.toLocaleString()}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', border: '1px solid #ddd', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Original Tenure</div>
                                    <div style={{ fontWeight: 700 }}>{results.originalTenureMonths} Mo</div>
                                </div>
                                <ArrowRightLeft size={16} color="#aaa" />
                                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', border: '1px solid var(--primary-light)', borderRadius: '12px', backgroundColor: 'white' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>New Tenure</div>
                                    <div style={{ fontWeight: 800 }}>{results.newTenureMonths} Mo</div>
                                </div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
                                You save <b>{(results.monthsSaved / 12).toFixed(1)} years</b> of loan payments!
                            </p>
                        </>
                    ) : selectedTool === 'fire' ? (
                        <>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Required FIRE Corpus</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F39C12' }}>₹{(results.targetCorpus / 10000000).toFixed(2)} Cr</div>
                                <div style={{ fontSize: '0.85rem', color: '#F39C12', fontWeight: 600 }}>₹{results.targetCorpus?.toLocaleString()}</div>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                At a {r}% withdrawal rate, this corpus generates <b>₹{results.annualWithdrawal?.toLocaleString()}</b> per year, sustaining your lifestyle forever.
                            </p>
                        </>
                    ) : selectedTool === 'inflation' ? (
                        <>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Future Cost (₹)</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>₹{results.futureValue?.toLocaleString()}</div>
                            </div>
                            <div style={{ padding: '1.5rem', backgroundColor: '#FDF2F2', borderRadius: '16px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#E74C3C' }}>Purchasing Power Warning</div>
                                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                                    Today's ₹{p.toLocaleString()} will have the same purchasing power as <b>₹{results.purchasingPower?.toLocaleString()}</b> in {n} years.
                                </p>
                            </div>
                        </>
                    ) : null}
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <p><i>Note: These calculations are estimates and do not account for taxes or inflation (unless specified). Plan wisely!</i></p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>Precision Financial Tools</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Advanced calculators for every financial micro-decision.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2.5rem' }}>
                {/* Sidebar */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {toolCategories.map(cat => (
                        <div key={cat.name} style={{ marginBottom: '1rem' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem', 
                                padding: '0.5rem 1rem',
                                color: cat.color,
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {cat.icon} {cat.name}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {cat.tools.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => {
                                            setActiveCategory(cat.name as any);
                                            setSelectedTool(tool.id);
                                        }}
                                        className={selectedTool === tool.id ? 'active' : ''}
                                        style={{
                                            textAlign: 'left',
                                            padding: '1rem',
                                            borderRadius: '16px',
                                            backgroundColor: selectedTool === tool.id ? 'white' : 'transparent',
                                            border: selectedTool === tool.id ? '2px solid var(--primary)' : '2px solid transparent',
                                            boxShadow: selectedTool === tool.id ? '0 10px 20px rgba(0,0,0,0.05)' : 'none',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: selectedTool === tool.id ? 'var(--primary)' : 'var(--text-primary)' }}>{tool.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{tool.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Main Content Area */}
                <main style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                        <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.4rem', fontWeight: 800 }}>Calculator Input</h2>
                        {renderInputs()}
                    </div>
                    
                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        {renderResults()}
                    </div>
                </main>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                button:hover:not(.active) {
                    background-color: rgba(0,0,0,0.02) !important;
                    transform: translateX(4px);
                }
                input[type=range] {
                    width: 100%;
                    margin-bottom: 0.5rem;
                }
            `}} />
        </div>
    );
};

export default Tools;
