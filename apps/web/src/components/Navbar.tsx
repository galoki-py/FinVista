import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, Compass, PieChart, BookOpen, ShieldCheck, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user || !user.registrationStatus.isRegistered) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Compass size={20} /> },
    { name: 'Weekly Spends', path: '/spends', icon: <PieChart size={20} /> },
    { name: 'Learning Hub', path: '/learning', icon: <BookOpen size={20} /> },
    { name: 'The Vault', path: '/vault', icon: <ShieldCheck size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>FinVista</div>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{user.name}</span>
        <button onClick={logout} style={{ 
          backgroundColor: 'transparent', 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem'
        }}>
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
