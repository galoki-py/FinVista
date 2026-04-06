import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuthStore } from './store/useAuthStore';
import Navbar from './components/Navbar';
import Registration from './pages/Registration';
import SankeyDashboard from './dashboard/SankeyDashboard';
import VaultDashboard from './dashboard/VaultDashboard';
import LearningHub from './pages/LearningHub';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const { user, isAuthenticated, setAuth, checkAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user && !user.registrationStatus.isRegistered) {
      navigate('/registration');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLoginSuccess = async (response: any) => {
    try {
      const res = await axios.post(`${API_URL}/auth/google`, {
        idToken: response.credential
      });
      setAuth(res.data.user, res.data.token);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--soft-white)' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading FinVista...</div>
    </div>
  );

  if (!isAuthenticated) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--soft-white)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: 'white' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: 800 }}>FinVista</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Master your money with agentic intelligence.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin 
            onSuccess={handleLoginSuccess}
            onError={() => { console.error('Login Failed'); }}
            theme="outline"
            shape="rectangular"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={
            user?.registrationStatus.isRegistered ? (
              <div className="card">
                <h2>Welcome to your Dashboard, {user.name}</h2>
                <p>Strategic money flow visualization coming soon.</p>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>Please complete your registration.</div>
            )
          } />
          <Route path="/spends" element={<SankeyDashboard />} />
          <Route path="/vault" element={<VaultDashboard />} />
          <Route path="/learning" element={<LearningHub />} />
          <Route path="*" element={<div>Page coming soon.</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
