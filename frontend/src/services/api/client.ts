import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * API Client Configuration
 * 
 * Uses environment variables:
 * - VITE_API_BASE_URL (Vite)
 * - NEXT_PUBLIC_API_BASE_URL (Next.js)
 * 
 * Falls back to localhost:3000 for development
 */
const getApiBaseUrl = (): string => {
  // Check for Vite env var first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check for Next.js env var
  if (import.meta.env.NEXT_PUBLIC_API_BASE_URL) {
    return import.meta.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

/**
 * Create Axios instance with base configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Attach JWT token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle 401 -> logout + redirect
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-user');
        
        // Redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

// Export base URL getter for use in other modules
export { getApiBaseUrl };
