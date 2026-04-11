import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      await loginWithGoogle(response.credential);
      navigate('/');
    } catch (err) {
      setError('Google login failed.');
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
      <div className="card" style={{ width: '100%', maxWidth: '450px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontWeight: 800, fontSize: '2.5rem' }}>FinVista</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Master your money flow.</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#FDEDEC', 
            color: '#E74C3C', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <Lock size={16} /> Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="primary" 
            disabled={isLoading}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginTop: '1rem',
              padding: '1rem'
            }}
          >
            {isLoading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid var(--border-color)' }}></div>
          <span style={{ position: 'relative', padding: '0 1rem', backgroundColor: 'white', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>OR</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <GoogleLogin 
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="outline"
            shape="rectangular"
            width="100%"
          />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
