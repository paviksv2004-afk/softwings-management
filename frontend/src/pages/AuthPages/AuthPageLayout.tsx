import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* GridShape removed */}
            
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                {/* Logo and Text side by side */}
                <div className="flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src="/images/logo/softwings-logo.png"
                    alt="SoftWings"
                  />
                  {/* White color text */}
                  <span className="text-2xl font-semibold text-white">
                    SoftWings
                  </span>
                </div>
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60 mt-4">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div>
          </div>
        </div>
        {/* ✅ ThemeTogglerTwo COMPLETELY REMOVED - bottom right corner la irundhadhu pochu */}
      </div>
    </div>
  );
}