import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Service = {
  _id?: string;
  name: string;
  type: string;
  start: string;
  duration: number;
  durationType: string;
  amount: number;
  endDate?: string;
  isManualEndDate?: boolean;
};

type Client = {
  _id: string;
  companyName: string;
  email: string;
  contactPerson?: string;
  mobile?: string;
  address?: string;
  totalAmount: number;
  domain?: string;
  services?: Service[];
};

// Icons (keep all your existing icons)
const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const AllClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<{
    clientId: string, 
    serviceIndex: number
  } | null>(null);
  const [editFormData, setEditFormData] = useState<Service | null>(null);
  
  const [addingServiceForClient, setAddingServiceForClient] = useState<string | null>(null);
  const [newServiceData, setNewServiceData] = useState<Service>({
    name: "",
    type: "hosting",
    start: new Date().toISOString().split('T')[0],
    duration: 1,
    durationType: "year",
    amount: 0,
    endDate: "",
    isManualEndDate: false
  });

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEndDate = (start: string, duration: number, durationType: string) => {
    if (!start || !duration) return "";
    const date = new Date(start);
    if (durationType === 'year') {
      date.setFullYear(date.getFullYear() + duration);
    } else {
      date.setMonth(date.getMonth() + duration);
    }
    return date.toISOString().split('T')[0];
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter(c => c._id !== id));
      alert("✅ Client deleted successfully");
    } catch (error) {
      alert("Error deleting client");
    }
  };

  const handleDeleteService = async (clientId: string, serviceIndex: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const client = clients.find(c => c._id === clientId);
      if (!client) return;

      const updatedServices = [...(client.services || [])];
      updatedServices.splice(serviceIndex, 1);

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/clients/${clientId}`,
        { ...client, services: updatedServices },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClients(clients.map(c => 
        c._id === clientId 
          ? { ...c, services: updatedServices }
          : c
      ));

      alert("✅ Service deleted successfully");
    } catch (error) {
      alert("Error deleting service");
    }
  };

  const startEditService = (clientId: string, serviceIndex: number, service: Service) => {
    setEditingService({ clientId, serviceIndex });
    setEditFormData({ ...service, isManualEndDate: false });
    setAddingServiceForClient(null);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setEditFormData(null);
  };

  const startAddService = (clientId: string) => {
    setAddingServiceForClient(clientId);
    setNewServiceData({
      name: "",
      type: "hosting",
      start: new Date().toISOString().split('T')[0],
      duration: 1,
      durationType: "year",
      amount: 0,
      endDate: "",
      isManualEndDate: false
    });
    setEditingService(null);
  };

  const cancelAddService = () => {
    setAddingServiceForClient(null);
  };

  const toggleManualEndDate = () => {
    setNewServiceData(prev => {
      const isManual = !prev.isManualEndDate;
      if (!isManual && prev.start && prev.duration && prev.durationType) {
        return {
          ...prev,
          isManualEndDate: isManual,
          endDate: calculateEndDate(prev.start, prev.duration, prev.durationType)
        };
      }
      return {
        ...prev,
        isManualEndDate: isManual
      };
    });
  };

  const handleNewServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewServiceData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'amount' || name === 'duration' ? Number(value) : value
      };

      if (!updated.isManualEndDate) {
        if ((name === 'start' || name === 'duration' || name === 'durationType') && 
            updated.start && updated.duration && updated.durationType) {
          updated.endDate = calculateEndDate(
            updated.start, 
            updated.duration, 
            updated.durationType
          );
        }
      }

      return updated;
    });
  };

  const handleManualEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewServiceData(prev => ({
      ...prev,
      endDate: e.target.value
    }));
  };

  const saveNewService = async (clientId: string) => {
    if (!newServiceData.name || !newServiceData.start || !newServiceData.amount) {
      alert("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const client = clients.find(c => c._id === clientId);
      if (!client) return;

      let endDate = newServiceData.endDate;
      if (!endDate && newServiceData.start && newServiceData.duration && newServiceData.durationType) {
        endDate = calculateEndDate(
          newServiceData.start,
          newServiceData.duration,
          newServiceData.durationType
        );
      }

      const newService = {
        ...newServiceData,
        endDate: endDate
      };

      const updatedServices = [...(client.services || []), newService];
      const newTotalAmount = updatedServices.reduce((sum, s) => sum + (s.amount || 0), 0);

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/clients/${clientId}`,
        { 
          ...client, 
          services: updatedServices,
          totalAmount: newTotalAmount 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClients(clients.map(c => 
        c._id === clientId 
          ? { ...c, services: updatedServices, totalAmount: newTotalAmount }
          : c
      ));

      alert("✅ New service added successfully");
      setAddingServiceForClient(null);
    } catch (error) {
      alert("Error adding service");
    } finally {
      setSaving(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    
    setEditFormData(prev => {
      if (!prev) return prev;
      
      const updated = {
        ...prev,
        [name]: name === 'amount' || name === 'duration' ? Number(value) : value
      };

      if ((name === 'start' || name === 'duration' || name === 'durationType') && 
          updated.start && updated.duration && updated.durationType) {
        updated.endDate = calculateEndDate(
          updated.start, 
          updated.duration, 
          updated.durationType
        );
      }

      return updated;
    });
  };

  const saveServiceEdit = async () => {
    if (!editingService || !editFormData) return;

    setSaving(true);
    try {
      const { clientId, serviceIndex } = editingService;
      const client = clients.find(c => c._id === clientId);
      if (!client) return;

      const updatedServices = [...(client.services || [])];
      
      const endDate = editFormData.endDate || calculateEndDate(
        editFormData.start,
        editFormData.duration,
        editFormData.durationType
      );
      
      updatedServices[serviceIndex] = {
        ...editFormData,
        endDate: endDate
      };

      const newTotalAmount = updatedServices.reduce((sum, s) => sum + (s.amount || 0), 0);

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/clients/${clientId}`,
        { 
          ...client, 
          services: updatedServices,
          totalAmount: newTotalAmount 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClients(clients.map(c => 
        c._id === clientId 
          ? { ...c, services: updatedServices, totalAmount: newTotalAmount }
          : c
      ));

      alert("✅ Service updated successfully");
      cancelEdit();
    } catch (error) {
      alert("Error updating service");
    } finally {
      setSaving(false);
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
      case 'hosting': return 'bg-blue-100 text-blue-800';
      case 'domain': return 'bg-green-100 text-green-800';
      case 'ssl': return 'bg-purple-100 text-purple-800';
      case 'amc': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredClients = clients.filter(client =>
    client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Clients</h1>
        <p className="text-sm text-gray-500 mt-1">Manage clients and their services</p>
      </div>

      {/* Search - FIXED: Only blue line on focus, no black line */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by company, email or contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Client Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate("/clients/add")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <AddIcon /> Add Client
        </button>
      </div>

      {/* Clients List */}
      <div className="space-y-6">
        {filteredClients.map((client) => (
          <div key={client._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Client Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{client.companyName}</h2>
                <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-3">
                  {client.contactPerson && <span>👤 {client.contactPerson}</span>}
                  <span>📧 {client.email}</span>
                  {client.mobile && <span>📱 {client.mobile}</span>}
                  {client.domain && <span>🌐 {client.domain}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-xl font-bold text-blue-600">
                    ₹{client.totalAmount?.toLocaleString('en-IN') || '0'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/clients/view/${client._id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <ViewIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Client"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span>Services</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {client.services?.length || 0}
                  </span>
                </h3>
                <button
                  onClick={() => startAddService(client._id)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <PlusIcon /> Add Service
                </button>
              </div>

              {/* Add New Service Form */}
              {addingServiceForClient === client._id && (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-3">
                  <h4 className="text-sm font-medium text-green-800 mb-3 flex justify-between items-center">
                    <span>Add New Service</span>
                    <button
                      type="button"
                      onClick={toggleManualEndDate}
                      className={`text-xs px-2 py-1 rounded ${
                        newServiceData.isManualEndDate 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {newServiceData.isManualEndDate ? '🔓 Manual' : '🤖 Auto'}
                    </button>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-600">Service Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={newServiceData.name}
                        onChange={handleNewServiceChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Web Hosting"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Type</label>
                      <select
                        name="type"
                        value={newServiceData.type}
                        onChange={handleNewServiceChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="hosting">Hosting</option>
                        <option value="domain">Domain</option>
                        <option value="ssl">SSL</option>
                        <option value="amc">AMC</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Start Date *</label>
                      <input
                        type="date"
                        name="start"
                        value={newServiceData.start}
                        onChange={handleNewServiceChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">Duration</label>
                        <input
                          type="number"
                          name="duration"
                          value={newServiceData.duration}
                          onChange={handleNewServiceChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-600">Type</label>
                        <select
                          name="durationType"
                          value={newServiceData.durationType}
                          onChange={handleNewServiceChange}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="month">Months</option>
                          <option value="year">Years</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Amount (₹) *</label>
                      <input
                        type="number"
                        name="amount"
                        value={newServiceData.amount}
                        onChange={handleNewServiceChange}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  {/* End Date Field */}
                  <div className="mt-3">
                    <label className="text-xs text-gray-600 block mb-1">
                      End Date {newServiceData.isManualEndDate ? '(Manual)' : '(Auto-calculated)'}
                    </label>
                    <input
                      type="date"
                      value={newServiceData.endDate || ''}
                      onChange={handleManualEndDateChange}
                      readOnly={!newServiceData.isManualEndDate}
                      className={`w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        !newServiceData.isManualEndDate ? 'bg-gray-100' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={cancelAddService}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                    >
                      <CancelIcon /> Cancel
                    </button>
                    <button
                      onClick={() => saveNewService(client._id)}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                      disabled={saving}
                    >
                      <SaveIcon /> {saving ? 'Adding...' : 'Add Service'}
                    </button>
                  </div>
                </div>
              )}

              {/* Existing Services */}
              {client.services && client.services.length > 0 ? (
                <div className="space-y-3">
                  {client.services.map((service, idx) => {
                    const isEditing = editingService?.clientId === client._id && 
                                     editingService?.serviceIndex === idx;
                    
                    if (isEditing && editFormData) {
                      // Edit Mode
                      return (
                        <div key={idx} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <div className="md:col-span-2">
                              <label className="text-xs text-gray-600">Service Name</label>
                              <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleEditChange}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Type</label>
                              <select
                                name="type"
                                value={editFormData.type}
                                onChange={handleEditChange}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="hosting">Hosting</option>
                                <option value="domain">Domain</option>
                                <option value="ssl">SSL</option>
                                <option value="amc">AMC</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Start Date</label>
                              <input
                                type="date"
                                name="start"
                                value={editFormData.start}
                                onChange={handleEditChange}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-xs text-gray-600">Duration</label>
                                <input
                                  type="number"
                                  name="duration"
                                  value={editFormData.duration}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  min="1"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-gray-600">Type</label>
                                <select
                                  name="durationType"
                                  value={editFormData.durationType}
                                  onChange={handleEditChange}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="month">Months</option>
                                  <option value="year">Years</option>
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Amount (₹)</label>
                              <input
                                type="number"
                                name="amount"
                                value={editFormData.amount}
                                onChange={handleEditChange}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                              />
                            </div>
                          </div>
                          
                          {/* End Date in Edit Mode */}
                          <div className="mt-3">
                            <label className="text-xs text-gray-600">End Date</label>
                            <input
                              type="date"
                              name="endDate"
                              value={editFormData.endDate || ''}
                              onChange={handleEditChange}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                              disabled={saving}
                            >
                              <CancelIcon /> Cancel
                            </button>
                            <button
                              onClick={saveServiceEdit}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                              disabled={saving}
                            >
                              <SaveIcon /> {saving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // View Mode
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-2xl">{getServiceIcon(service.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{service.name}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${getServiceColor(service.type)}`}>
                                {service.type}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-3">
                              <span>📅 Start: {formatDate(service.start)}</span>
                              <span>⏱️ End: {service.endDate ? formatDate(service.endDate) : '-'}</span>
                              <span>📊 {service.duration} {service.durationType}</span>
                              <span>💰 ₹{service.amount?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditService(client._id, idx, service)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit Service"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteService(client._id, idx)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete Service"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No services added for this client</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">No clients found</p>
            <p className="text-gray-400 mb-4">Try adjusting your search</p>
            <button
              onClick={() => navigate("/clients/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Add New Client
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClients;