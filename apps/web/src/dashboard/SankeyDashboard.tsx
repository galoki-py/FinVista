import React, { useEffect, useState } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import type { SankeyData } from '@finvista/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SankeyDashboard: React.FC = () => {
  const { token } = useAuthStore();
  const [data, setData] = useState<SankeyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSankey = async () => {
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
    };
    fetchSankey();
  }, [token]);

  if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Calculating money flow...</div>;
  if (!data || data.nodes.length === 0) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h3 style={{ color: 'var(--text-primary)' }}>No Transaction Data</h3>
      <p style={{ color: 'var(--text-secondary)' }}>Log some spends on the mobile app to see your financial flow.</p>
    </div>
  );

  return (
    <div className="card" style={{ height: '500px', width: '100%', backgroundColor: 'white' }}>
      <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Strategic Money Flow</h2>
      <ResponsiveContainer width="100%" height="90%">
        <Sankey
          data={data}
          node={{ stroke: 'var(--border-color)', strokeWidth: 1 }}
          link={{ stroke: 'var(--sky-blue-dark)' }}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <span>Income Sources</span>
        <span>Total Pool</span>
        <span>Expense Categories</span>
      </div>
    </div>
  );
};

export default SankeyDashboard;
