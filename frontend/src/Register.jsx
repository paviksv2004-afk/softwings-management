import { useState } from "react";
import axios from "axios";
import InputField from "../components/form/input/InputField";
import Textarea from "../components/form/input/Textarea";
import Button from "../components/ui/Button";
import Label from "../components/form/Label";

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    mobile: "",
    email: "",
    address: "",
    domain: "",
    hosting: "",
    amc: "",
    ssl: "",
    financialRenewalAmount: "",
    financialRenewalDeadline: "",
    financialBilledCost: "",
    financialLastCreated: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register", // backend endpoint
        formData
      );

      alert("Client Registered Successfully");
      setFormData({
        companyName: "",
        contactName: "",
        mobile: "",
        email: "",
        address: "",
        domain: "",
        hosting: "",
        amc: "",
        ssl: "",
        financialRenewalAmount: "",
        financialRenewalDeadline: "",
        financialBilledCost: "",
        financialLastCreated: "",
      });
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Client / Company Register</h1>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company & Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Company Name</Label>
            <InputField
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <Label>Contact Name</Label>
            <InputField
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Enter contact person"
              required
            />
          </div>
        </div>

        {/* Mobile & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Mobile</Label>
            <InputField
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div>
            <Label>Email</Label>
            <InputField
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
          />
        </div>

        {/* Domain & Hosting */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Domain</Label>
            <InputField
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="Enter domain"
            />
          </div>

          <div>
            <Label>Hosting</Label>
            <InputField
              name="hosting"
              value={formData.hosting}
              onChange={handleChange}
              placeholder="Enter hosting info"
            />
          </div>
        </div>

        {/* AMC & SSL */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>AMC</Label>
            <InputField
              name="amc"
              value={formData.amc}
              onChange={handleChange}
              placeholder="Enter AMC info"
            />
          </div>

          <div>
            <Label>SSL</Label>
            <InputField
              name="ssl"
              value={formData.ssl}
              onChange={handleChange}
              placeholder="Enter SSL info"
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Renewal Amount</Label>
            <InputField
              type="number"
              name="financialRenewalAmount"
              value={formData.financialRenewalAmount}
              onChange={handleChange}
              placeholder="Enter renewal amount"
            />
          </div>

          <div>
            <Label>Renewal Deadline</Label>
            <InputField
              type="date"
              name="financialRenewalDeadline"
              value={formData.financialRenewalDeadline}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Billed Cost</Label>
            <InputField
              type="number"
              name="financialBilledCost"
              value={formData.financialBilledCost}
              onChange={handleChange}
              placeholder="Enter billed cost"
            />
          </div>
        </div>

        <div>
          <Label>Last Created</Label>
          <InputField
            type="date"
            name="financialLastCreated"
            value={formData.financialLastCreated}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Client"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
