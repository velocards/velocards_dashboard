import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Token management
const TOKEN_KEY = 'accessToken';

export const tokenManager = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },
};

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle error response without logging
    
    // Handle 401 Unauthorized
    // Skip auth endpoints to avoid redirect loops
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const errorData = error.response?.data as any;
    const isTokenExpired = error.response?.status === 401 && 
                          (errorData?.message === 'Token expired' || 
                           errorData?.error?.message === 'Token expired');
    
    // For token expiration, immediately redirect to login (security requirement)
    if (isTokenExpired && !isAuthEndpoint) {
      // Clear tokens
      tokenManager.removeToken();
      
      // Redirect to login with session expired message
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/sign-in?error=session_expired';
      }
      
      return Promise.reject(error);
    }
    
    // Handle other 401 errors (not token expiration)
    if (error.response?.status === 401 && !isAuthEndpoint && !isTokenExpired) {
      // Clear tokens and redirect
      tokenManager.removeToken();
      
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth/')) {
        window.location.href = '/auth/sign-in';
      }
      
      return Promise.reject(error);
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// Typed API response interfaces
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

// Helper function to extract error message
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    if (apiError?.error?.message) {
      return apiError.error.message;
    }
  }
  
  return error?.message || 'An unexpected error occurred';
};

// Export axios for direct use if needed
export { axios };