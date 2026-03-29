import axios from 'axios';
import { LOGIN_API, USERS_API, CLIENTS_API, RENEWALS_API } from './config';

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

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: Bearer  } : {};
};
