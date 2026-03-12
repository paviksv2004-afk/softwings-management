import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

const Profit = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      
      const token = localStorage.getItem("token");
      
      // 🔥 FIXED: Hardcoded Render URL for testing
      const API_URL = 'https://softwings-management-1.onrender.com/api';
      
      console.log("Fetching from:", API_URL); // Debug log
      
      const clientsRes = await axios.get(`${API_URL}/clients`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      console.log("Clients data:", clientsRes.data); // Debug log
      
      const clients = clientsRes.data;
      
      let totalRevenue = 0;
      let hostingRevenue = 0, domainRevenue = 0, sslRevenue = 0, amcRevenue = 0;

      clients.forEach((client: any) => {
        totalRevenue += client.totalAmount || 0;
        
        const services = Array.isArray(client.services) ? client.services : [];
        services.forEach((service: any) => {
          const amount = Number(service.amount) || 0;
          switch(service.type) {
            case 'hosting':
              hostingRevenue += amount;
              break;
            case 'domain':
              domainRevenue += amount;
              break;
            case 'ssl':
              sslRevenue += amount;
              break;
            case 'amc':
              amcRevenue += amount;
              break;
          }
        });
      });

      const totalExpenses = totalRevenue * 0.3; // 30% expenses estimate
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

    } catch (error: any) {
      console.error("Error fetching profit data:", error);
      setError(error.message || "Failed to fetch data");
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

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">❌ Error: {error}</p>
          <button
            onClick={fetchProfitData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <PageMeta
        title="Profit Overview | SoftWings Management"
        description="Track your revenue, expenses, and profit margins"
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Profit & Analytics</h1>
          <p className="text-gray-500 mt-1">Track your revenue, expenses, and profit margins</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {formatCurrency(profitData.totalRevenue)}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(profitData.totalExpenses)}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Net Profit</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {formatCurrency(profitData.netProfit)}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Profit Margin</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {profitData.profitMargin.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Service</h3>
          <div className="space-y-4">
            {[
              { name: 'Hosting', value: profitData.hostingRevenue, color: 'bg-blue-600' },
              { name: 'Domain', value: profitData.domainRevenue, color: 'bg-green-600' },
              { name: 'SSL', value: profitData.sslRevenue, color: 'bg-purple-600' },
              { name: 'AMC', value: profitData.amcRevenue, color: 'bg-orange-600' }
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-300`} 
                    style={{ width: `${profitData.totalRevenue > 0 ? (item.value / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <button
            onClick={fetchProfitData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>
    </>
  );
};

export default Profit;