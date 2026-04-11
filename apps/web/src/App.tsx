import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Navbar from './components/Navbar';
import Registration from './pages/Registration';
import SankeyDashboard from './dashboard/SankeyDashboard';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import LearningHub from './pages/LearningHub';
import IntentLoggingForm from './components/IntentLoggingForm';
import DailySpendingSummary from './components/DailySpendingSummary';
import { useState } from 'react';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user && !user.registrationStatus.isRegistered) {
      navigate('/registration');
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--soft-white)' }}>
      <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading FinVista...</div>
    </div>
  );

  return (
    <div>
      {isAuthenticated && <Navbar />}
      <main style={{ padding: isAuthenticated ? '2rem' : '0' }}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
          
          <Route path="/registration" element={isAuthenticated ? <Registration /> : <Navigate to="/login" />} />
          <Route path="/" element={
            isAuthenticated ? (
              user?.registrationStatus.isRegistered ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                  <IntentLoggingForm onSuccess={() => setRefreshTrigger(p => p + 1)} />
                  <DailySpendingSummary refreshTrigger={refreshTrigger} />
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>Please complete your registration.</div>
              )
            ) : (
              <LoginPage />
            )
          } />
          <Route path="/spends" element={isAuthenticated ? <SankeyDashboard /> : <Navigate to="/login" />} />
          <Route path="/tools" element={isAuthenticated ? <Tools /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/learning" element={isAuthenticated ? <LearningHub /> : <Navigate to="/login" />} />
          <Route path="*" element={<div>Page coming soon.</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
