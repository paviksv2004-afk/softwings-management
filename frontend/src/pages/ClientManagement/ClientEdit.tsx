import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

type Service = {
  name: string;
  type: string;
  start: string;
  duration: number;
  durationType: string;
  amount: number;
  endDate?: string;
};

type Client = {
  companyName: string;
  email: string;
  contactPerson?: string;
  mobile?: string;
  address?: string;
  totalAmount: number;
  // domain?: string;  // ✅ DOMAIN REMOVED
  services?: Service[];
};

const ClientEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Client>({
    companyName: "",
    email: "",
    contactPerson: "",
    mobile: "",
    address: "",
    totalAmount: 0,
    // domain: "",  // ✅ DOMAIN REMOVED
    services: []
  });

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${id}`);
      const clientData = response.data;
      
      // Remove domain from form data if it exists
      const { domain, ...rest } = clientData;  // ✅ DOMAIN REMOVED from destructuring
      
      setFormData(rest);
    } catch (error) {
      console.error("Error fetching client:", error);
      alert("Error loading client");
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      
      // Calculate total amount from services
      const totalAmount = formData.services?.reduce((sum, s) => sum + (s.amount || 0), 0) || 0;
      
      const updatedData = {
        ...formData,
        totalAmount
      };

      await axios.put(
        `http://localhost:5000/api/clients/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ Client updated successfully!");
      navigate(`/clients/view/${id}`);
    } catch (error: any) {
      console.error("Error updating client:", error);
      alert("Error: " + (error.response?.data?.message || "Failed to update"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Client</h1>
        <button
          onClick={() => navigate(`/clients/view/${id}`)}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to View
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ✅ DOMAIN FIELD COMPLETELY REMOVED */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Services Summary */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Services Summary</h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Total Services: <span className="font-medium">{formData.services?.length || 0}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total Amount: <span className="font-medium text-blue-600">₹{formData.totalAmount?.toLocaleString('en-IN') || '0'}</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/clients/view/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientEdit;