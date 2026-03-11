import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../../components/common/PageMeta";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Icons
const HostingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const DomainIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SSLIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const AMCIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">₹{entry.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [monthlyProfitData, setMonthlyProfitData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalRevenue: 0,
    hostingCount: 0,
    domainCount: 0,
    sslCount: 0,
    amcCount: 0,
    hostingRevenue: 0,
    domainRevenue: 0,
    sslRevenue: 0,
    amcRevenue: 0,
    profit: 0,
    profitMargin: 0,
    avgRevenue: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const clientsRes = await axios.get("http://localhost:5000/api/clients", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const clients = clientsRes.data;
      
      let totalRevenue = 0;
      let hostingCount = 0, domainCount = 0, sslCount = 0, amcCount = 0;
      let hostingRevenue = 0, domainRevenue = 0, sslRevenue = 0, amcRevenue = 0;

      // Monthly profit calculation
      const monthlyProfit: { [key: string]: number } = {};
      
      // Get all months with data
      clients.forEach((client: any) => {
        totalRevenue += client.totalAmount || 0;
        
        const services = Array.isArray(client.services) ? client.services : [];
        services.forEach((service: any) => {
          // Count services
          switch(service.type) {
            case 'hosting':
              hostingCount++;
              hostingRevenue += service.amount || 0;
              break;
            case 'domain':
              domainCount++;
              domainRevenue += service.amount || 0;
              break;
            case 'ssl':
              sslCount++;
              sslRevenue += service.amount || 0;
              break;
            case 'amc':
              amcCount++;
              amcRevenue += service.amount || 0;
              break;
          }

          // Calculate monthly profit based on service start date
          if (service.start && service.amount) {
            const startDate = new Date(service.start);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            if (!isNaN(startDate.getTime())) {
              const monthYear = `${months[startDate.getMonth()]} ${startDate.getFullYear()}`;
              
              // 30% assumed as expense, 70% profit
              const profitFromService = service.amount * 0.7;
              
              monthlyProfit[monthYear] = (monthlyProfit[monthYear] || 0) + profitFromService;
            }
          }
        });
      });

      // Calculate expenses and profit
      const expenses = totalRevenue * 0.3;
      const profit = totalRevenue - expenses;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      const avgRevenue = clients.length > 0 ? totalRevenue / clients.length : 0;

      // Format monthly profit data for chart
      const chartData = Object.entries(monthlyProfit)
        .map(([name, value]) => ({
          name,
          profit: Math.round(value),
          revenue: Math.round(value * 1.3) // Approx revenue (profit is 70% of revenue)
        }))
        .filter(item => item.profit > 0) // Show only months with profit
        .sort((a, b) => {
          // Sort by date
          const dateA = new Date(a.name);
          const dateB = new Date(b.name);
          return dateA.getTime() - dateB.getTime();
        });

      setStats({
        totalClients: clients.length,
        totalRevenue,
        hostingCount,
        domainCount,
        sslCount,
        amcCount,
        hostingRevenue,
        domainRevenue,
        sslRevenue,
        amcRevenue,
        profit,
        profitMargin,
        avgRevenue
      });

      setMonthlyProfitData(chartData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard"
        description="Overview of your clients, services, and revenue"
      />
      
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h1>
              <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-600">Total Profit</p>
              <p className="text-xl font-bold text-blue-600">₹{stats.profit.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Clients Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalClients}</p>
                <p className="text-xs text-green-600 mt-2">+{stats.totalClients > 0 ? '12%' : '0%'} from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-2">From all services</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Services Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Services</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stats.hostingCount + stats.domainCount + stats.sslCount + stats.amcCount}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">H:{stats.hostingCount}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">D:{stats.domainCount}</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">S:{stats.sslCount}</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">A:{stats.amcCount}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
            </div>
          </div>

          {/* Profit Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">₹{stats.profit.toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-600 mt-2">Margin: {stats.profitMargin.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Profit Chart - FIXED */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Monthly Profit Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">Profit trends over the months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs text-gray-600">Profit (70%)</span>
              </div>
            </div>
          </div>

          {monthlyProfitData.length > 0 ? (
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyProfitData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickFormatter={(value) => `₹${value/1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3B82F6" 
                    name="Revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#10B981" 
                    name="Profit"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ width: '100%', height: '400px' }} className="flex flex-col items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No profit data available for chart</p>
              <p className="text-xs text-gray-400">Make sure services have valid start dates</p>
            </div>
          )}
        </div>

        {/* Service Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Overview Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Revenue Breakdown</h3>
            
            {/* Hosting */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <HostingIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Hosting</p>
                  <p className="text-xs text-gray-500">{stats.hostingCount} services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{stats.hostingRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalRevenue > 0 ? ((stats.hostingRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>

            {/* Domain */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <DomainIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Domain</p>
                  <p className="text-xs text-gray-500">{stats.domainCount} services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{stats.domainRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalRevenue > 0 ? ((stats.domainRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>

            {/* SSL */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                  <SSLIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">SSL</p>
                  <p className="text-xs text-gray-500">{stats.sslCount} services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{stats.sslRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalRevenue > 0 ? ((stats.sslRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>

            {/* AMC */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <AMCIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">AMC</p>
                  <p className="text-xs text-gray-500">{stats.amcCount} services</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{stats.amcRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500">
                  {stats.totalRevenue > 0 ? ((stats.amcRevenue / stats.totalRevenue) * 100).toFixed(1) : 0}% of total
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Quick Insights</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-blue-100 text-sm">Average Revenue per Client</p>
                <p className="text-3xl font-bold mt-1">
                  ₹{stats.avgRevenue.toLocaleString('en-IN')}
                </p>
              </div>
              
              <div className="h-px bg-white/20 my-4"></div>
              
              <div>
                <p className="text-blue-100 text-sm">Profit Margin</p>
                <p className="text-3xl font-bold mt-1 text-green-300">
                  {stats.profitMargin.toFixed(1)}%
                </p>
              </div>
              
              <div className="h-px bg-white/20 my-4"></div>
              
              <div>
                <p className="text-blue-100 text-sm">Most Profitable Service</p>
                <p className="text-xl font-bold mt-1">
                  {stats.hostingRevenue > stats.domainRevenue && 
                   stats.hostingRevenue > stats.sslRevenue && 
                   stats.hostingRevenue > stats.amcRevenue ? 'Hosting' :
                   stats.domainRevenue > stats.sslRevenue && 
                   stats.domainRevenue > stats.amcRevenue ? 'Domain' :
                   stats.sslRevenue > stats.amcRevenue ? 'SSL' : 'AMC'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}