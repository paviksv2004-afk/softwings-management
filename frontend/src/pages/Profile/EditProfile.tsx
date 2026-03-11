import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    role: "",
    phone: ""
  });

  // Load user data on page load
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem("user");
    console.log("Loading user from localStorage:", userStr);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          phone: userData.phone || ""
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        setMessage({ 
          type: "error", 
          text: "Error loading user data" 
        });
      }
    } else {
      // If no user data in localStorage, try to get from token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Decode token to get user info
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const tokenData = JSON.parse(atob(base64));
          
          const userFromToken = {
            name: "User",
            email: "user@example.com",
            role: tokenData.role || "staff",
            phone: "",
            id: tokenData.id
          };
          
          localStorage.setItem("user", JSON.stringify(userFromToken));
          
          setFormData({
            name: userFromToken.name,
            email: userFromToken.email,
            role: userFromToken.role,
            phone: ""
          });
          
          console.log("Created user from token:", userFromToken);
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Get current user data
      const userStr = localStorage.getItem("user");
      
      if (!userStr) {
        // If no user data, create one
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage({ 
            type: "error", 
            text: "Please login again" 
          });
          setLoading(false);
          return;
        }
        
        // Create new user data with role
        const newUser = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone
        };
        
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        // Update existing user data with role
        const userData = JSON.parse(userStr);
        const updatedUser = {
          ...userData,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      
      // Trigger storage event
      window.dispatchEvent(new Event('storage'));

      setMessage({ 
        type: "success", 
        text: "Profile updated successfully!" 
      });

      // Go back to previous page
      setTimeout(() => {
        navigate(-1);
      }, 1000);

    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to update profile" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field - Fixed: Only blue line on focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field - Fixed: Only blue line on focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Role Field - Already has single blue line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Phone Field - Fixed: Only blue line on focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;