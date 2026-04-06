import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import type { RegistrationData } from '@finvista/types';

const Registration: React.FC = () => {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    city: '',
    area: '',
    monthlyEarnings: 0,
    averageMonthlySpending: 0,
    savingPolicies: '',
    investmentTargets: 0,
    financialKnowledgeRating: 3
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'white' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Complete Your Profile</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Welcome to FinVista! Please provide these details to unlock your financial ecosystem.</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 600 }}>Location (City & Specific Area)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                placeholder="City (e.g. Hyderabad)" 
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
                required 
              />
              <input 
                placeholder="Area (e.g. Gachibowli)" 
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Monthly Earnings (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 25000"
              value={formData.monthlyEarnings || ''}
              onChange={e => setFormData({...formData, monthlyEarnings: Number(e.target.value)})}
              required 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Avg. Monthly Spending (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 15000"
              value={formData.averageMonthlySpending || ''}
              onChange={e => setFormData({...formData, averageMonthlySpending: Number(e.target.value)})}
              required 
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontWeight: 600 }}>Current Saving Policies/Methods</label>
            <input 
              placeholder="e.g. FD, Mutual Funds, Cash-in-hand" 
              value={formData.savingPolicies}
              onChange={e => setFormData({...formData, savingPolicies: e.target.value})}
              required 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Investment Target (₹)</label>
            <input 
              type="number" 
              placeholder="Target Amount"
              value={formData.investmentTargets || ''}
              onChange={e => setFormData({...formData, investmentTargets: Number(e.target.value)})}
              required 
            />
          </div>

          <div>
            <label style={{ fontWeight: 600 }}>Finance Knowledge (1-5)</label>
            <select 
              value={formData.financialKnowledgeRating}
              onChange={e => setFormData({...formData, financialKnowledgeRating: Number(e.target.value) as any})}
              required
            >
              <option value="1">1 - Novice</option>
              <option value="2">2 - Basic</option>
              <option value="3">3 - Intermediate</option>
              <option value="4">4 - Advanced</option>
              <option value="5">5 - Expert</option>
            </select>
          </div>

          <button type="submit" className="primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
