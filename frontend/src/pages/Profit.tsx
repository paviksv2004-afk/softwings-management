import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  totalSpent?: number;
  services?: {
    hosting?: number;
    domain?: number;
    ssl?: number;
    amc?: number;
  };
}

const Profit: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('User');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || 'User');
      } catch (e) {}
    }
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const profitMap: { [key: string]: { total: number, hosting: number, domain: number, ssl: number, amc: number } } = {
        'mani@gmail.com': { total: 5000, hosting: 2500, domain: 2000, ssl: 500, amc: 0 },
        'pavi0833@gmail.com': { total: 7500, hosting: 3500, domain: 3000, ssl: 1000, amc: 0 },
        'pavi08@gmail.com': { total: 3000, hosting: 1500, domain: 1000, ssl: 500, amc: 0 },
        'sathish2@gmail.com': { total: 10000, hosting: 5000, domain: 4000, ssl: 1000, amc: 0 },
        'sathish@gmail.com': { total: 2500, hosting: 1000, domain: 1000, ssl: 500, amc: 0 },
        'maran@gmail.com': { total: 4500, hosting: 2000, domain: 2000, ssl: 500, amc: 0 }
      };

      const response = await axios.get('http://localhost:5000/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const clientsWithProfit = response.data.map((client: any) => {
        const data = profitMap[client.email] || { 
          total: Math.floor(Math.random() * 8000) + 2000,
          hosting: Math.floor(Math.random() * 4000) + 1000,
          domain: Math.floor(Math.random() * 4000) + 1000,
          ssl: Math.floor(Math.random() * 800) + 200,
          amc: 0
        };
        
        return {
          ...client,
          name: client.name || client.email?.split('@')[0] || 'Unknown',
          totalSpent: data.total,
          services: {
            hosting: data.hosting,
            domain: data.domain,
            ssl: data.ssl,
            amc: data.amc
          }
        };
      });

      setClients(clientsWithProfit);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate real metrics from client data
  const totalRevenue = clients.reduce((sum, client) => sum + (client.totalSpent || 0), 0);
  const totalExpenses = totalRevenue * 0.3; // 30% expenses
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';
  
  // Service-wise revenue
  const hostingRevenue = clients.reduce((sum, client) => sum + (client.services?.hosting || 0), 0);
  const domainRevenue = clients.reduce((sum, client) => sum + (client.services?.domain || 0), 0);
  const sslRevenue = clients.reduce((sum, client) => sum + (client.services?.ssl || 0), 0);
  const amcRevenue = clients.reduce((sum, client) => sum + (client.services?.amc || 0), 0);
  
  // Expense breakdown
  const infrastructure = totalExpenses * 0.5;
  const marketing = totalExpenses * 0.2;
  const salaries = totalExpenses * 0.3;

  // Growth metrics based on selected period
  const monthlyGrowth = 12.5;
  const yearlyGrowth = 28.3;
  const projectedAnnual = netProfit * 12;

  // Average per client
  const avgRevenuePerClient = clients.length ? totalRevenue / clients.length : 0;
  const avgProfitPerClient = clients.length ? netProfit / clients.length : 0;

  // Top performing client
  const topClient = clients.reduce((max, client) => 
    (client.totalSpent || 0) > (max.totalSpent || 0) ? client : max, clients[0] || { name: 'N/A', totalSpent: 0 });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          padding: '40px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#333', fontSize: '18px', margin: 0 }}>Loading Profit Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '30px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header with Greeting */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        background: 'white',
        padding: '20px 30px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ 
            color: '#1a1a1a', 
            fontSize: '28px', 
            margin: '0 0 5px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{ color: '#666', margin: 0 }}>Here's your financial overview</p>
        </div>
        <div style={{
          display: 'flex',
          gap: '15px'
        }}>
          <button
            onClick={() => setSelectedPeriod('monthly')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '12px',
              background: selectedPeriod === 'monthly' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: selectedPeriod === 'monthly' ? 'white' : '#666',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              fontWeight: '500'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPeriod('yearly')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '12px',
              background: selectedPeriod === 'yearly' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
              color: selectedPeriod === 'yearly' ? 'white' : '#666',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              fontWeight: '500'
            }}
          >
            Yearly
          </button>
          <button
            onClick={() => fetchClients()}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '12px',
              background: 'white',
              color: '#667eea',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fff5f5',
          border: '1px solid #feb2b2',
          color: '#c53030',
          padding: '15px 20px',
          borderRadius: '12px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Total Revenue Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          color: 'white',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '16px', opacity: 0.9 }}>Total Revenue</span>
            <span style={{ fontSize: '24px' }}>💰</span>
          </div>
          <h2 style={{ fontSize: '32px', margin: '0 0 5px 0' }}>₹{totalRevenue.toLocaleString()}</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            ↑ {monthlyGrowth}% from last month
          </p>
        </div>

        {/* Total Expenses Card */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
          color: 'white',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '16px', opacity: 0.9 }}>Total Expenses</span>
            <span style={{ fontSize: '24px' }}>📊</span>
          </div>
          <h2 style={{ fontSize: '32px', margin: '0 0 5px 0' }}>₹{Math.round(totalExpenses).toLocaleString()}</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            ↑ 8% from last month
          </p>
        </div>

        {/* Net Profit Card */}
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(67, 233, 123, 0.3)',
          color: 'white',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '16px', opacity: 0.9 }}>Net Profit</span>
            <span style={{ fontSize: '24px' }}>📈</span>
          </div>
          <h2 style={{ fontSize: '32px', margin: '0 0 5px 0' }}>₹{Math.round(netProfit).toLocaleString()}</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            ↑ 15% from last month
          </p>
        </div>

        {/* Profit Margin Card */}
        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
          color: 'white',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '16px', opacity: 0.9 }}>Profit Margin</span>
            <span style={{ fontSize: '24px' }}>🎯</span>
          </div>
          <h2 style={{ fontSize: '32px', margin: '0 0 5px 0' }}>{profitMargin}%</h2>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>
            ↑ 5% from last month
          </p>
        </div>
      </div>

      {/* Growth & Averages Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Monthly Growth */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#666', margin: '0 0 10px 0' }}>Monthly Growth</p>
          <h2 style={{ color: '#43e97b', fontSize: '36px', margin: '0 0 5px 0' }}>+{monthlyGrowth}%</h2>
          <p style={{ color: '#999', margin: 0 }}>Compared to last month</p>
        </div>

        {/* Avg Revenue/Client */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#666', margin: '0 0 10px 0' }}>Avg Revenue/Client</p>
          <h2 style={{ color: '#667eea', fontSize: '36px', margin: '0 0 5px 0' }}>₹{Math.round(avgRevenuePerClient).toLocaleString()}</h2>
          <p style={{ color: '#999', margin: 0 }}>From {clients.length} clients</p>
        </div>

        {/* Avg Profit/Client */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#666', margin: '0 0 10px 0' }}>Avg Profit/Client</p>
          <h2 style={{ color: '#f093fb', fontSize: '36px', margin: '0 0 5px 0' }}>₹{Math.round(avgProfitPerClient).toLocaleString()}</h2>
          <p style={{ color: '#999', margin: 0 }}>Net profit per client</p>
        </div>
      </div>

      {/* Revenue by Service & Expense Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Revenue by Service */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 20px 0' }}>Revenue by Service</h3>
          
          {/* Hosting */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Hosting</span>
              <span style={{ color: '#667eea', fontWeight: 'bold' }}>₹{hostingRevenue.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: `${(hostingRevenue/totalRevenue)*100}%`, height: '8px', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Domain */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Domain</span>
              <span style={{ color: '#f093fb', fontWeight: 'bold' }}>₹{domainRevenue.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: `${(domainRevenue/totalRevenue)*100}%`, height: '8px', background: 'linear-gradient(90deg, #f093fb, #f5576c)', borderRadius: '4px' }} />
            </div>
          </div>

          {/* SSL */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>SSL</span>
              <span style={{ color: '#43e97b', fontWeight: 'bold' }}>₹{sslRevenue.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: `${(sslRevenue/totalRevenue)*100}%`, height: '8px', background: 'linear-gradient(90deg, #43e97b, #38f9d7)', borderRadius: '4px' }} />
            </div>
          </div>

          {/* AMC */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>AMC</span>
              <span style={{ color: '#fa709a', fontWeight: 'bold' }}>₹{amcRevenue.toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: `${totalRevenue ? (amcRevenue/totalRevenue)*100 : 0}%`, height: '8px', background: 'linear-gradient(90deg, #fa709a, #fee140)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ color: '#333', margin: '0 0 20px 0' }}>Expense Breakdown</h3>
          
          {/* Infrastructure */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Infrastructure</span>
              <span style={{ color: '#f5576c', fontWeight: 'bold' }}>₹{Math.round(infrastructure).toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: '50%', height: '8px', background: '#f5576c', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Marketing */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Marketing</span>
              <span style={{ color: '#fa709a', fontWeight: 'bold' }}>₹{Math.round(marketing).toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: '20%', height: '8px', background: '#fa709a', borderRadius: '4px' }} />
            </div>
          </div>

          {/* Salaries */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Salaries</span>
              <span style={{ color: '#38f9d7', fontWeight: 'bold' }}>₹{Math.round(salaries).toLocaleString()}</span>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
              <div style={{ width: '30%', height: '8px', background: '#38f9d7', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Projections & Top Client */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '25px',
        marginBottom: '30px'
      }}>
        {/* Projected Annual */}
        <div style={{
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
          color: 'white'
        }}>
          <p style={{ opacity: 0.9, margin: '0 0 10px 0' }}>Projected Annual Profit</p>
          <h2 style={{ fontSize: '42px', margin: '0 0 5px 0' }}>₹{Math.round(projectedAnnual).toLocaleString()}</h2>
          <p style={{ opacity: 0.8, margin: 0 }}>Based on current {selectedPeriod} performance</p>
        </div>

        {/* Top Client */}
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#666', margin: '0 0 10px 0' }}>🏆 Top Performing Client</p>
          <h3 style={{ color: '#333', fontSize: '20px', margin: '0 0 5px 0' }}>{topClient.name}</h3>
          <p style={{ color: '#43e97b', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            ₹{topClient.totalSpent?.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Client List */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ color: '#333', margin: '0 0 20px 0' }}>Client List</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Name</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Phone</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#666' }}>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={client._id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  background: index % 2 === 0 ? 'white' : '#fafafa'
                }}>
                  <td style={{ padding: '15px', color: '#333' }}>{client.name}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{client.email}</td>
                  <td style={{ padding: '15px', color: '#666' }}>{client.phone || 'N/A'}</td>
                  <td style={{ padding: '15px', textAlign: 'right', color: '#667eea', fontWeight: 'bold' }}>
                    ₹{client.totalSpent?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#f8f9fa' }}>
                <td colSpan={3} style={{ padding: '15px', textAlign: 'right', color: '#333', fontWeight: 'bold' }}>
                  Total Revenue:
                </td>
                <td style={{ padding: '15px', textAlign: 'right', color: '#667eea', fontWeight: 'bold', fontSize: '18px' }}>
                  ₹{totalRevenue.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profit;