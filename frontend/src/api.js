import axios from 'axios';
import { LOGIN_API, USERS_API, CLIENTS_API, RENEWALS_API } from './config';

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(LOGIN_API, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if logged in
export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

// Auth header
export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: Bearer  } : {};
};

// API calls with auth
export const getUsers = async () => {
  const response = await axios.get(USERS_API, { headers: authHeader() });
  return response.data;
};

export const getClients = async () => {
  const response = await axios.get(CLIENTS_API, { headers: authHeader() });
  return response.data;
};

export const getRenewals = async () => {
  const response = await axios.get(RENEWALS_API, { headers: authHeader() });
  return response.data;
};
