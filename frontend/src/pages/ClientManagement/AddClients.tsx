import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

type Service = {
  name: string;
  start: string;
  duration: string;
  durationType: "year" | "month";
  amount: string;
  type?: string;
  endDate?: string;
  isManualEndDate?: boolean;
};

const AddClients = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    contactPerson: "",
    mobile: "",
    address: "",
  });

  const [hostingServices, setHostingServices] = useState<Service[]>([]);
  const [domainServices, setDomainServices] = useState<Service[]>([]);
  const [sslServices, setSslServices] = useState<Service[]>([]);
  const [amcServices, setAmcServices] = useState<Service[]>([]);
  
  const [loading, setLoading] = useState(false);

  // Basic input change
  const handleBasicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate end date
  const calculateEndDate = (
    start: string,
    duration: string,
    type: "year" | "month"
  ) => {
    if (!start || !duration) return "";
    const date = new Date(start);
    const value = Number(duration);
    if (type === "year") date.setFullYear(date.getFullYear() + value);
    if (type === "month") date.setMonth(date.getMonth() + value);
    return date.toISOString().split("T")[0];
  };

  // Add empty service row
  const addServiceRow = (
    setter: React.Dispatch<React.SetStateAction<Service[]>>
  ) => {
    setter((prev) => [
      ...prev,
      { 
        name: "", 
        start: "", 
        duration: "", 
        durationType: "year", 
        amount: "",
        endDate: "",
        isManualEndDate: false
      },
    ]);
  };

  // Handle service input change
  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string,
    services: Service[],
    setter: React.Dispatch<React.SetStateAction<Service[]>>
  ) => {
    const updated = [...services];
    updated[index][field] = value as any;

    if (field === 'endDate') {
      updated[index].isManualEndDate = true;
    }

    if ((field === 'start' || field === 'duration' || field === 'durationType') && 
        !updated[index].isManualEndDate) {
      const start = updated[index].start;
      const duration = updated[index].duration;
      const durationType = updated[index].durationType;
      
      if (start && duration && durationType) {
        updated[index].endDate = calculateEndDate(start, duration, durationType);
      } else {
        updated[index].endDate = "";
      }
    }

    setter(updated);
  };

  // Remove service row
  const removeServiceRow = (
    index: number,
    services: Service[],
    setter: React.Dispatch<React.SetStateAction<Service[]>>
  ) => {
    const updated = services.filter((_, i) => i !== index);
    setter(updated);
  };

  // Toggle manual end date
  const toggleManualEndDate = (
    index: number,
    services: Service[],
    setter: React.Dispatch<React.SetStateAction<Service[]>>
  ) => {
    const updated = [...services];
    updated[index].isManualEndDate = !updated[index].isManualEndDate;
    
    if (!updated[index].isManualEndDate) {
      const { start, duration, durationType } = updated[index];
      if (start && duration && durationType) {
        updated[index].endDate = calculateEndDate(start, duration, durationType);
      }
    }
    
    setter(updated);
  };

  // Total amount
  const calculateTotal = () => {
    const all = [...hostingServices, ...domainServices, ...sslServices, ...amcServices];
    return all.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  };

  // Validate services
  const validateServices = () => {
    const allServices = [
      ...hostingServices,
      ...domainServices,
      ...sslServices,
      ...amcServices
    ];

    for (const service of allServices) {
      if (!service.name || !service.start || !service.duration || !service.amount) {
        alert("Please fill all service fields (Name, Start Date, Duration, Amount)");
        return false;
      }
    }
    return true;
  };

  // Render service section
  const renderServices = (
    title: string,
    services: Service[],
    setter: React.Dispatch<React.SetStateAction<Service[]>>
  ) => (
    <div key={title} className="mb-8">
      <div className="rounded-xl bg-white shadow-md p-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          type="button"
          onClick={() => addServiceRow(setter)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          + Add {title}
        </button>
      </div>

      {services.map((service, index) => {
        const autoEndDate = calculateEndDate(
          service.start,
          service.duration,
          service.durationType
        );

        return (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-8 gap-4 mt-4 items-end bg-gray-50 p-4 rounded-lg relative"
          >
            <button
              type="button"
              onClick={() => removeServiceRow(index, services, setter)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>

            <div className="col-span-1">
              <Label>Service Name *</Label>
              <InputField
                type="text"
                placeholder="e.g., Web Hosting"
                value={service.name}
                onChange={(e) =>
                  handleServiceChange(index, "name", e.target.value, services, setter)
                }
                required={true}  // ✅ FIXED: required={true} not just required
                className="w-full"
              />
            </div>

            <div className="col-span-1">
              <Label>Start Date *</Label>
              <InputField
                type="date"
                value={service.start}
                onChange={(e) =>
                  handleServiceChange(index, "start", e.target.value, services, setter)
                }
                required={true}  // ✅ FIXED
                className="w-full"
              />
            </div>

            <div className="col-span-1">
              <Label>Duration *</Label>
              <InputField
                type="number"
                min="1"
                placeholder="1"
                value={service.duration}
                onChange={(e) =>
                  handleServiceChange(index, "duration", e.target.value, services, setter)
                }
                required={true}  // ✅ FIXED
                className="w-full"
              />
            </div>

            <div className="col-span-1">
              <Label>Type *</Label>
              <select
                value={service.durationType}
                onChange={(e) =>
                  handleServiceChange(index, "durationType", e.target.value as "year" | "month", services, setter)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                required={true}  // ✅ FIXED
              >
                <option value="year">Years</option>
                <option value="month">Months</option>
              </select>
            </div>

            <div className="col-span-1">
              <div className="flex items-center justify-between mb-1">
                <Label>End Date</Label>
                <button
                  type="button"
                  onClick={() => toggleManualEndDate(index, services, setter)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {service.isManualEndDate ? "🔓 Manual" : "🤖 Auto"}
                </button>
              </div>
              <InputField 
                type="date" 
                value={service.endDate || autoEndDate}
                onChange={(e) =>
                  handleServiceChange(index, "endDate", e.target.value, services, setter)
                }
                className={`w-full ${!service.isManualEndDate ? 'bg-gray-100' : ''}`}
                readOnly={!service.isManualEndDate}  // ✅ readOnly works now
              />
            </div>

            <div className="col-span-1">
              <Label>Amount (₹) *</Label>
              <InputField
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={service.amount}
                onChange={(e) =>
                  handleServiceChange(index, "amount", e.target.value, services, setter)
                }
                required={true}  // ✅ FIXED
                className="w-full"
              />
            </div>
          </div>
        );
      })}
      
      {services.length === 0 && (
        <div className="mt-4 p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
          No {title} added yet. Click "Add {title}" to add.
        </div>
      )}
    </div>
  );

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.email) {
      alert("Company Name and Email are required");
      return;
    }

    const hasServices = 
      hostingServices.length > 0 ||
      domainServices.length > 0 ||
      sslServices.length > 0 ||
      amcServices.length > 0;

    if (!hasServices) {
      alert("Please add at least one service");
      return;
    }

    if (!validateServices()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const allServices = [
        ...hostingServices.map(s => ({ ...s, type: 'hosting' })),
        ...domainServices.map(s => ({ ...s, type: 'domain' })),
        ...sslServices.map(s => ({ ...s, type: 'ssl' })),
        ...amcServices.map(s => ({ ...s, type: 'amc' }))
      ];

      const formattedData = {
        companyName: formData.companyName.trim(),
        email: formData.email.trim().toLowerCase(),
        contactPerson: formData.contactPerson.trim() || undefined,
        mobile: formData.mobile.trim() || undefined,
        address: formData.address.trim() || undefined,
        services: allServices.map((s) => ({
          name: s.name.trim(),
          type: s.type,
          start: s.start,
          duration: Number(s.duration),  // ✅ Fixed: string to number
          durationType: s.durationType,
          amount: Number(s.amount),
          endDate: s.endDate || calculateEndDate(s.start, s.duration, s.durationType)
        })),
        totalAmount: calculateTotal()
      };

      console.log('Sending data to backend:', formattedData);

      const response = await axios.post(
        "http://localhost:5000/api/clients",
        formattedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("✅ Client Added Successfully!");
        navigate("/clients");
      }
    } catch (error: any) {
      console.error("Add Client Error:", error);
      
      if (error.response) {
        alert(`❌ ${error.response.data?.message || "Something went wrong"}`);
      } else if (error.request) {
        alert("❌ Server not responding. Please check if backend is running.");
      } else {
        alert("❌ Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Client</h1>
        <button
          type="button"
          onClick={() => navigate("/clients")}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Clients
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Basic Information */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Company Name *</Label>
              <InputField
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleBasicChange}
                required={true}  // ✅ FIXED
                className="w-full"
              />
            </div>

            <div>
              <Label>Contact Person</Label>
              <InputField
                name="contactPerson"
                placeholder="Enter contact person name"
                value={formData.contactPerson}
                onChange={handleBasicChange}
                className="w-full"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <InputField
                name="email"
                type="email"
                placeholder="company@example.com"
                value={formData.email}
                onChange={handleBasicChange}
                required={true}  // ✅ FIXED
                className="w-full"
              />
            </div>

            <div>
              <Label>Mobile</Label>
              <InputField
                name="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleBasicChange}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Address</Label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleBasicChange}
                rows={3}
                placeholder="Enter complete address"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Services Sections */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Services</h2>
          
          {renderServices("Hosting Services", hostingServices, setHostingServices)}
          {renderServices("Domain Services", domainServices, setDomainServices)}
          {renderServices("SSL Services", sslServices, setSslServices)}
          {renderServices("AMC Services", amcServices, setAmcServices)}
        </div>

        {/* Total Amount */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <Label className="text-lg">Total Amount</Label>
            <div className="text-2xl font-bold text-blue-600">
              ₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding Client...' : 'Add Client'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/clients")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClients;