import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Remove this line - ithu dhaan error varudhu
// import { fetchRenewals } from '../api/renewalApi';  // <-- DELETE THIS LINE

type Service = {
  name: string;
  type: string;
  start: string;
  duration: number;
  durationType: string;
  amount: number;
  endDate: string;
};

type Client = {
  _id: string;
  companyName: string;
  email: string;
  contactPerson?: string;
  mobile?: string;
  services: Service[];
};

type RenewalItem = {
  id: string;
  clientId: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  serviceName: string;
  serviceType: string;
  amount: number;
  startDate: string;
  expiryDate: string;
  daysLeft: number;
  status: 'expired' | 'critical' | 'warning' | 'safe';
};

const RenewalReminder = () => {
  const [renewals, setRenewals] = useState<RenewalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'expired' | 'critical' | 'warning' | 'safe'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'daysLeft' | 'amount' | 'company'>('daysLeft');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedType, setSelectedType] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRenewals();
  }, []);

  const fetchRenewals = async () => {
    try {
      setError(null);
      setLoading(true); // Add loading state reset
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.get("http://localhost:5000/api/clients", {
        headers: {
          Authorization: `Bearer ${token}` // Add token for authentication
        }
      });
      
      const clients = response.data;
      const renewalList: RenewalItem[] = [];

      clients.forEach((client: Client) => {
        if (!client.services || client.services.length === 0) return;

        client.services.forEach((service: Service, index: number) => {
          if (service.endDate) {
            const daysLeft = calculateDaysLeft(service.endDate);
            const status = getStatus(daysLeft);
            
            renewalList.push({
              id: `${client._id}-${index}`,
              clientId: client._id,
              companyName: client.companyName,
              contactPerson: client.contactPerson || '-',
              mobile: client.mobile || '-',
              email: client.email,
              serviceName: service.name,
              serviceType: service.type || 'service',
              amount: service.amount || 0,
              startDate: service.start || '',
              expiryDate: service.endDate,
              daysLeft: daysLeft,
              status: status
            });
          }
        });
      });

      renewalList.sort((a, b) => a.daysLeft - b.daysLeft);
      setRenewals(renewalList);
    } catch (error: any) {
      console.error('Error fetching renewals:', error);
      
      // Handle 401 error - redirect to login
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
        return;
      }
      
      setError(error.response?.data?.message || error.message || 'Failed to fetch renewals');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(endDate);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatus = (daysLeft: number) => {
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 7) return 'critical';
    if (daysLeft <= 30) return 'warning';
    return 'safe';
  };

  const getStatusBadge = (status: string, daysLeft: number) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center";
    
    switch(status) {
      case 'expired':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-700`}>
            Expired • {Math.abs(daysLeft)}d ago
          </span>
        );
      case 'critical':
        return (
          <span className={`${baseClasses} bg-orange-50 text-orange-700`}>
            Critical • {daysLeft}d left
          </span>
        );
      case 'warning':
        return (
          <span className={`${baseClasses} bg-yellow-50 text-yellow-700`}>
            Warning • {daysLeft}d left
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700`}>
            Safe • {daysLeft}d left
          </span>
        );
    }
  };

  const getServiceTypes = () => {
    const types = new Set(renewals.map(r => r.serviceType));
    return ['all', ...Array.from(types)];
  };

  const handleSort = (field: 'daysLeft' | 'amount' | 'company') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedRenewals = () => {
    let filtered = renewals;
    
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.status === filter);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.serviceType === selectedType);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.companyName.toLowerCase().includes(term) ||
        r.contactPerson.toLowerCase().includes(term) ||
        r.serviceName.toLowerCase().includes(term) ||
        r.email.toLowerCase().includes(term)
      );
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch(sortBy) {
        case 'daysLeft':
          comparison = a.daysLeft - b.daysLeft;
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'company':
          comparison = a.companyName.localeCompare(b.companyName);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  const getStats = () => {
    return {
      total: renewals.length,
      expired: renewals.filter(r => r.status === 'expired').length,
      critical: renewals.filter(r => r.status === 'critical').length,
      warning: renewals.filter(r => r.status === 'warning').length,
      safe: renewals.filter(r => r.status === 'safe').length,
      totalAmount: renewals.reduce((sum, r) => sum + r.amount, 0)
    };
  };

  const stats = getStats();
  const serviceTypes = getServiceTypes();
  const displayedRenewals = filteredAndSortedRenewals();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 mt-3">Loading renewals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={fetchRenewals}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Renewal Reminder</h1>
        <p className="text-sm text-gray-500 mt-1">Track and manage service renewals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Expired</p>
          <p className="text-xl font-semibold text-red-600">{stats.expired}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Critical</p>
          <p className="text-xl font-semibold text-orange-600">{stats.critical}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Warning</p>
          <p className="text-xl font-semibold text-yellow-600">{stats.warning}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Safe</p>
          <p className="text-xl font-semibold text-green-600">{stats.safe}</p>
        </div>
        <div className="bg-blue-600 rounded-lg p-4">
          <p className="text-xs text-blue-100 mb-1">Total Value</p>
          <p className="text-xl font-semibold text-white">₹{stats.totalAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search company, contact, service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Service Type Filter */}
          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {serviceTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Services' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {[
          { key: 'all', label: 'All', color: 'blue' },
          { key: 'expired', label: 'Expired', color: 'red' },
          { key: 'critical', label: 'Critical', color: 'orange' },
          { key: 'warning', label: 'Warning', color: 'yellow' },
          { key: 'safe', label: 'Safe', color: 'green' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === tab.key
                ? `bg-${tab.color}-600 text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label} {tab.key !== 'all' && `(${stats[tab.key as keyof typeof stats]})`}
          </button>
        ))}
      </div>

      {/* Renewals Table */}
      {displayedRenewals.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-1">No renewal records found</p>
          <p className="text-xs text-gray-400">
            {renewals.length === 0 ? 'Add clients with services to see renewals' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('company')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Company
                      {sortBy === 'company' && (
                        <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Service</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Amount
                      {sortBy === 'amount' && (
                        <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Start</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      onClick={() => handleSort('daysLeft')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                    >
                      Status
                      {sortBy === 'daysLeft' && (
                        <span className="text-gray-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedRenewals.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/clients/view/${item.clientId}`)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.companyName}</div>
                      <div className="text-xs text-gray-500">{item.contactPerson}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-600">{item.mobile}</div>
                      <div className="text-xs text-gray-500">{item.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.serviceName}</div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.serviceType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.startDate ? new Date(item.startDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(item.expiryDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(item.status, item.daysLeft)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Showing {displayedRenewals.length} of {renewals.length} renewals
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RenewalReminder;