import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, Wallet, Target, Star, UserPlus, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    city: '',
    area: '',
    monthlyEarnings: '',
    averageMonthlySpending: '',
    savingPolicies: '',
    investmentTargets: '',
    financialKnowledgeRating: 3
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Please fill in your basic account details.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signup({
        ...formData,
        monthlyEarnings: Number(formData.monthlyEarnings),
        averageMonthlySpending: Number(formData.averageMonthlySpending),
        investmentTargets: Number(formData.investmentTargets),
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: 'var(--soft-white)',
      padding: '2rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 800 }}>Join FinVista</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Step {step} of 2: {step === 1 ? 'Account Security' : 'Financial Profile'}</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            <div style={{ height: '4px', width: '40px', backgroundColor: step === 1 ? 'var(--primary)' : 'var(--border-color)', borderRadius: '2px' }}></div>
            <div style={{ height: '4px', width: '40px', backgroundColor: step === 2 ? 'var(--primary)' : 'var(--border-color)', borderRadius: '2px' }}></div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FDEDEC', color: '#E74C3C', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><User size={16} /> Full Name</label>
                <input name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Mail size={16} /> Email Address</label>
                <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Lock size={16} /> Password</label>
                <input name="password" type="password" placeholder="Create a password" value={formData.password} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Lock size={16} /> Confirm Password</label>
                <input name="confirmPassword" type="password" placeholder="Verify password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
              <button type="button" className="primary" onClick={handleNext} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><MapPin size={16} /> City</label>
                  <input name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={handleChange} required />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><MapPin size={16} /> Area</label>
                  <input name="area" placeholder="e.g. Bandra" value={formData.area} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Wallet size={16} /> Monthly Earnings (₹)</label>
                  <input name="monthlyEarnings" type="number" placeholder="50000" value={formData.monthlyEarnings} onChange={handleChange} required />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Wallet size={16} /> Monthly Spending (₹)</label>
                  <input name="averageMonthlySpending" type="number" placeholder="30000" value={formData.averageMonthlySpending} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Target size={16} /> Investment Targets (₹)</label>
                <input name="investmentTargets" type="number" placeholder="10000" value={formData.investmentTargets} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}><Star size={16} /> Financial Knowledge (1-5)</label>
                <select name="financialKnowledgeRating" value={formData.financialKnowledgeRating} onChange={handleChange}>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v} - {v === 1 ? 'Beginner' : v === 5 ? 'Expert' : 'Intermediate'}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>Saving Policies / Goals</label>
                <textarea 
                  name="savingPolicies" 
                  placeholder="e.g. Save 20% for emergency fund, 10% for travel." 
                  value={formData.savingPolicies} 
                  onChange={handleChange}
                  style={{ width: '100%', height: '80px', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleBack} style={{ backgroundColor: 'var(--soft-white)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button type="submit" className="primary" disabled={isLoading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  {isLoading ? 'Creating Account...' : <><UserPlus size={18} /> Complete Registration</>}
                </button>
              </div>
            </div>
          )}
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2rem', marginBottom: 0 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
