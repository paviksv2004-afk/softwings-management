import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

// Simple chart components (if you don't want to install recharts)
// You can use this simple version without charts first

const Profit = () => {
  const [loading, setLoading] = useState(true);
  const [profitData, setProfitData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    hostingRevenue: 0,
    domainRevenue: 0,
    sslRevenue: 0,
    amcRevenue: 0,
    monthlyGrowth: 12.5,
    yearlyGrowth: 28.3
  });

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const clientsRes = await axios.get("http://localhost:5000/api/clients", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      const clients = clientsRes.data;
      
      let totalRevenue = 0;
      let hostingRevenue = 0, domainRevenue = 0, sslRevenue = 0, amcRevenue = 0;

      clients.forEach((client: any) => {
        totalRevenue += client.totalAmount || 0;
        
        const services = Array.isArray(client.services) ? client.services : [];
        services.forEach((service: any) => {
          switch(service.type) {
            case 'hosting':
              hostingRevenue += service.amount || 0;
              break;
            case 'domain':
              domainRevenue += service.amount || 0;
              break;
            case 'ssl':
              sslRevenue += service.amount || 0;
              break;
            case 'amc':
              amcRevenue += service.amount || 0;
              break;
          }
        });
      });

      const totalExpenses = totalRevenue * 0.3;
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      setProfitData({
        totalRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        hostingRevenue,
        domainRevenue,
        sslRevenue,
        amcRevenue,
        monthlyGrowth: 12.5,
        yearlyGrowth: 28.3
      });

    } catch (error) {
      console.error("Error fetching profit data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading profit data...</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Profit Overview | SoftWings Management"
        description="Track your revenue, expenses, and profit margins"
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Profit & Analytics</h1>
          <p className="text-gray-500 mt-1">Track your revenue, expenses, and profit margins</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  ₹{profitData.totalRevenue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↑ {profitData.monthlyGrowth}%</span>
              <span className="text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  ₹{profitData.totalExpenses.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-red-600 text-sm">↑ 8%</span>
              <span className="text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₹{profitData.netProfit.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↑ 15%</span>
              <span className="text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>

          {/* Profit Margin */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  {profitData.profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm">↑ 5%</span>
              <span className="text-gray-400 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Service */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Service</h3>
            <div className="space-y-4">
              {/* Hosting */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Hosting</span>
                  <span className="text-sm font-medium">₹{profitData.hostingRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${profitData.totalRevenue > 0 ? (profitData.hostingRevenue / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Domain */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Domain</span>
                  <span className="text-sm font-medium">₹{profitData.domainRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${profitData.totalRevenue > 0 ? (profitData.domainRevenue / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* SSL */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">SSL</span>
                  <span className="text-sm font-medium">₹{profitData.sslRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${profitData.totalRevenue > 0 ? (profitData.sslRevenue / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* AMC */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">AMC</span>
                  <span className="text-sm font-medium">₹{profitData.amcRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${profitData.totalRevenue > 0 ? (profitData.amcRevenue / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expense Breakdown</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Infrastructure</span>
                  <span className="text-sm font-medium">₹{(profitData.totalExpenses * 0.5).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Marketing</span>
                  <span className="text-sm font-medium">₹{(profitData.totalExpenses * 0.2).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Salaries</span>
                  <span className="text-sm font-medium">₹{(profitData.totalExpenses * 0.3).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-pink-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm">Monthly Growth</p>
            <p className="text-3xl font-bold mt-1">+{profitData.monthlyGrowth}%</p>
            <p className="text-blue-100 text-sm mt-2">Compared to last month</p>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-green-100 text-sm">Yearly Growth</p>
            <p className="text-3xl font-bold mt-1">+{profitData.yearlyGrowth}%</p>
            <p className="text-green-100 text-sm mt-2">Compared to last year</p>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-purple-100 text-sm">Projected Annual Profit</p>
            <p className="text-3xl font-bold mt-1">₹{(profitData.netProfit * 12).toLocaleString('en-IN')}</p>
            <p className="text-purple-100 text-sm mt-2">Based on current month</p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Profit Summary</h3>
          <p className="text-3xl font-bold mb-2">₹{profitData.netProfit.toLocaleString('en-IN')}</p>
          <p className="text-indigo-100">Net Profit after expenses ({profitData.profitMargin.toFixed(1)}% margin)</p>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-indigo-100 text-sm">Revenue</p>
              <p className="font-semibold text-lg">₹{profitData.totalRevenue.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Expenses</p>
              <p className="font-semibold text-lg">₹{profitData.totalExpenses.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Margin</p>
              <p className="font-semibold text-lg">{profitData.profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profit;