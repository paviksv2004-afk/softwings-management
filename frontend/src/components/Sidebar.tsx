import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

// Icons
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const UserRegisterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const AddClientIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const ClientsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const RenewalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface MenuItem {
  path: string;
  name: string;
  icon: React.ReactNode;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuSections: MenuSection[] = [
    {
      title: "MENU",
      items: [
        { path: "/", name: "Dashboard", icon: <DashboardIcon /> },
      ]
    },
    {
      title: "USER MANAGEMENT",
      items: [
        { path: "/user-register", name: "User Register", icon: <UserRegisterIcon /> },
        { path: "/all-users", name: "All Users", icon: <UsersIcon /> },
      ]
    },
    {
      title: "CLIENT MANAGEMENT",
      items: [
        { path: "/clients/add", name: "Add Client", icon: <AddClientIcon /> },
        { path: "/clients", name: "All Clients", icon: <ClientsIcon /> },
        { path: "/renewals", name: "Renewal Reminder", icon: <RenewalIcon /> },
        { path: "/profit", name: "Profit", icon: <ProfitIcon /> },
      ]
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Custom function to check active state
  const isActive = (path: string) => {
    if (path === "/clients/add") {
      return location.pathname === "/clients/add";
    }
    if (path === "/clients") {
      return location.pathname === "/clients";
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Section with Toggle Button */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              {/* Logo with your image */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="/images/logo/softwings-logo.png"
                  alt="SoftWings"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">SoftWings</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">SoftWings</p>
              </div>
            </div>
          ) : (
            // Collapsed state - show logo
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-white">
                <img
                  src="/images/logo/softwings-logo.png"
                  alt="SoftWings"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* 3 Lines Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MenuIcon />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-3 overflow-y-auto h-[calc(100vh-80px)]">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} px-3 py-2.5 text-sm rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    title={isCollapsed ? item.name : ""}
                  >
                    <span className={isActive(item.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`} />
    </>
  );
};

export default Sidebar;