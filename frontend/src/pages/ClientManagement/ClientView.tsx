import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type Service = {
  _id?: string;
  name: string;
  type: string;
  start: string;
  duration: number;
  durationType: string;
  amount: number;
  endDate?: string;
};

type Client = {
  _id: string;
  companyName: string;
  email: string;
  contactPerson?: string;
  mobile?: string;
  address?: string;
  totalAmount: number;
  services?: Service[];
  createdAt?: string;
  updatedAt?: string;
};

const ClientView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${id}`);
      setClient(response.data);
    } catch (error) {
      console.error("Error fetching client:", error);
      alert("Error loading client details");
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch(type) {
      case 'hosting': return '🖥️';
      case 'domain': return '🌐';
      case 'ssl': return '🔒';
      case 'amc': return '🛠️';
      default: return '📦';
    }
  };

  const getServiceColor = (type: string) => {
    switch(type) {
      case 'hosting': return 'bg-blue-50 border-blue-200';
      case 'domain': return 'bg-green-50 border-green-200';
      case 'ssl': return 'bg-purple-50 border-purple-200';
      case 'amc': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysLeft = (endDate?: string) => {
    if (!endDate) return null;
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return { text: `${Math.abs(diff)} days overdue`, class: 'text-red-600' };
    if (diff <= 7) return { text: `${diff} days left (Critical)`, class: 'text-orange-600 font-medium' };
    if (diff <= 30) return { text: `${diff} days left`, class: 'text-yellow-600' };
    return { text: `${diff} days left`, class: 'text-green-600' };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading client details...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Client not found</p>
      </div>
    );
  }

  // Calculate summary stats
  const totalServices = client.services?.length || 0;
  const expiringServices = client.services?.filter(s => {
    if (!s.endDate) return false;
    const daysLeft = Math.ceil((new Date(s.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30;
  }).length || 0;

  const expiredServices = client.services?.filter(s => {
    if (!s.endDate) return false;
    return new Date(s.endDate) < new Date();
  }).length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Details</h1>
          <p className="text-sm text-gray-500 mt-1">View complete client information</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/clients/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Client
          </button>
          <button
            onClick={() => navigate("/clients")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Total Services</p>
          <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">₹{client.totalAmount?.toLocaleString('en-IN') || '0'}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold text-orange-600">{expiringServices}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Expired</p>
          <p className="text-2xl font-bold text-red-600">{expiredServices}</p>
        </div>
      </div>

      {/* Client Information Card - Domain/Website Removed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Company Name</p>
              <p className="text-base font-medium text-gray-900">{client.companyName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-base text-gray-900">{client.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Contact Person</p>
              <p className="text-base text-gray-900">{client.contactPerson || '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Mobile</p>
              <p className="text-base text-gray-900">{client.mobile || '-'}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-base text-gray-900">{client.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* Added: Created & Updated Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
          <div>Created: {formatDateTime(client.createdAt)}</div>
          <div>Last Updated: {formatDateTime(client.updatedAt)}</div>
        </div>
      </div>

      {/* Services Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Services ({totalServices})
        </h2>
        
        {client.services && client.services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {client.services.map((service, index) => {
              const daysLeft = calculateDaysLeft(service.endDate);
              return (
                <div key={index} className={`p-4 rounded-lg border ${getServiceColor(service.type)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getServiceIcon(service.type)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <span className="text-xs px-2 py-0.5 bg-white rounded-full uppercase">
                          {service.type}
                        </span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{service.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                    <div>
                      <p className="text-gray-500 text-xs">Start Date</p>
                      <p className="font-medium text-gray-900">{formatDate(service.start)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">End Date</p>
                      <p className={`font-medium ${daysLeft?.class || 'text-gray-900'}`}>
                        {formatDate(service.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Duration</p>
                      <p className="font-medium text-gray-900">{service.duration} {service.durationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      {daysLeft && (
                        <p className={`text-xs font-medium ${daysLeft.class}`}>
                          {daysLeft.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>No services added for this client</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientView;