// API Configuration and Utility Functions
import axios from 'axios';

// Base API Configuration
const API_CONFIG = {
  // Base URL - Change this to switch between environments
  BASE_URL: 'http://127.0.0.1:8000/rest',
  
  // Alternative URLs for different environments
  // BASE_URL: 'http://localhost:8000/rest', // Alternative localhost
  // BASE_URL: 'https://your-production-domain.com/rest', // Production
  // BASE_URL: 'https://your-staging-domain.com/rest', // Staging
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Timeout configuration
  TIMEOUT: 10000, // 10 seconds
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
  // Enable cookies to be sent automatically
  withCredentials: true,
});

// Request interceptor to add authentication token as fallback
apiClient.interceptors.request.use(
  (config) => {
    // Only add Authorization header if cookies are not available
    // This is a fallback mechanism for cases where cookies might not work
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('idToken='))
      ?.split('=')[1];
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  GET_PROFILE: '/get-profile',
  UPDATE_PROFILE: '/update-profile',
  CHANGE_PASSWORD: '/change-password',
  RESEND_EMAIL: '/resend-email',
  
  // OAuth
  GET_LINKED_SERVICES: '/get-linked-services',
  LINK_OAUTH: '/link-oauth',
  
  // Sensor Data
  MODULO1: '/modulo1',
  MODULO2: '/modulo2',
  MODBUSDATA: '/modbusdata',
  RTD: '/rtd',
  
  // Admin
  ADMIN_BUZON: '/admin-buzon',
  ADMIN_USUARIOS: '/admin-usuarios',
  ADMIN_ADDUSER: '/admin-adduser',
  ADMIN_RESTORE: '/admin-restore',
  
  // Contact Form
  FORM: '/form',
};

// Utility functions for API calls

// GET request
export const apiGet = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.get(endpoint, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// POST request
export const apiPost = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// PUT request
export const apiPut = async (endpoint, data = {}, config = {}) => {
  try {
    const response = await apiClient.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// DELETE request
export const apiDelete = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.delete(endpoint, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch wrapper for backward compatibility
export const apiFetch = async (endpoint, options = {}) => {
  // Get token from cookies as fallback for Authorization header
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('idToken='))
    ?.split('=')[1];

  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Only add Authorization header if not already present and token exists
      ...(token && !options.headers?.Authorization && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include', // This ensures cookies are sent automatically
    ...options,
  };

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, defaultOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Export configuration for direct access
export { API_CONFIG, apiClient };

// Helper function to get full URL
export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Helper function to change base URL (useful for environment switching)
export const setBaseUrl = (newBaseUrl) => {
  API_CONFIG.BASE_URL = newBaseUrl;
  apiClient.defaults.baseURL = newBaseUrl;
};

// Cookie utility functions
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: '/',
    maxAge: 3600, // 1 hour
    sameSite: 'Lax',
    ...options
  };
  
  let cookieString = `${name}=${value}`;
  
  if (defaultOptions.path) cookieString += `; path=${defaultOptions.path}`;
  if (defaultOptions.maxAge) cookieString += `; max-age=${defaultOptions.maxAge}`;
  if (defaultOptions.sameSite) cookieString += `; samesite=${defaultOptions.sameSite}`;
  if (defaultOptions.secure) cookieString += '; secure';
  if (defaultOptions.httpOnly) cookieString += '; httponly';
  
  document.cookie = cookieString;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCookie('idToken');
};

// Get user data from cookies
export const getUserData = () => {
  const userDataCookie = getCookie('userData');
  if (userDataCookie) {
    try {
      return JSON.parse(userDataCookie);
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
      return null;
    }
  }
  return null;
};
