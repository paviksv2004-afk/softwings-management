import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './api';

const PrivateRoute = ({ children }) => {
  const loggedIn = isLoggedIn();
  
  if (!loggedIn) {
    console.log('No token found - Redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

export default PrivateRoute;
