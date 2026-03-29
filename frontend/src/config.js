const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_URL;

export const USERS_API = ${API_URL}/users;
export const CLIENTS_API = ${API_URL}/clients;
export const RENEWALS_API = ${API_URL}/renewals;
export const AUTH_API = ${API_URL}/auth/login;
export const LOGIN_API = ${API_URL}/login;
export const HEALTH_API = ${API_URL}/health;
