// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  
  console.log("PrivateRoute check - Token exists:", !!token);
  
  // If no token, redirect to signin
  if (!token) {
    console.log("No token found - Redirecting to /signin");
    return <Navigate to="/signin" replace />;
  }

  // If token exists, render the protected routes
  console.log("Token found - Rendering protected routes");
  return <Outlet />;
};

export default PrivateRoute;