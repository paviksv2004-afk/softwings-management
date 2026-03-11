import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

interface User {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

const AppLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    loadUserData();

    // Listen for storage changes
    const handleStorageChange = () => {
      console.log("Storage changed - reloading user");
      loadUserData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadUserData = () => {
    const userStr = localStorage.getItem("user");
    console.log("Loading user from localStorage:", userStr);
    
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        console.log("User loaded:", userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.log("No user data found");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // Get initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Profile */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.name || "User"}! 👋
              </h2>
            </div>

            {/* Profile Section with Clickable Circle */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <div className="text-right">
                  {/* ✅ Shows name from backend */}
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name || "User"}
                  </p>
                  {/* ✅ Shows email from backend */}
                  <p className="text-xs text-gray-500">
                    {user?.email || ""}
                  </p>
                </div>
                {/* Circle with initial */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-shadow">
                  {getUserInitials()}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                      <p className="text-sm text-gray-500 mt-1">{user?.email || ""}</p>
                      {user?.role && (
                        <p className="text-xs text-blue-600 mt-1 capitalize">
                          Role: {user.role}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/profile/edit");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        ✏️ Edit profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/settings");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        ⚙️ Account settings
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/support");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        ❓ Support
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-200 p-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        🚪 Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;