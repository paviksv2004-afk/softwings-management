import { useState, useEffect } from "react";
import axios from "axios";
import PageMeta from "../components/common/PageMeta";

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
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const clientsRes = await axios.get(`${API_URL}/clients`, {
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ?{profitData.totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Total Expenses</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              ?{profitData.totalExpenses.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500">Net Profit</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              ?{profitData.netProfit.toLocaleString('en-IN')}
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
                  <span>?{item.value.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`${item.color} h-2 rounded-full`} 
                    style={{ width: `${profitData.totalRevenue > 0 ? (item.value / profitData.totalRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profit;
