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
    
    // Handle 401 Unauthorized - try to refresh token
    // Skip refresh for auth endpoints to avoid redirect loops
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const errorData = error.response?.data as any;
    const isTokenExpired = error.response?.status === 401 && 
                          (errorData?.message === 'Token expired' || 
                           errorData?.error?.message === 'Token expired');
    
    if (isTokenExpired && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const { data } = await apiClient.post('/auth/refresh');
        
        // Save new token - expecting tokens object based on auth API definition
        if (data.data?.tokens?.accessToken) {
          tokenManager.setToken(data.data.tokens.accessToken);
          
          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenManager.removeToken();
        
        // Only redirect if we're in the browser and not already on auth pages
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/auth/')) {
          window.location.href = '/auth/sign-in';
        }
        
        return Promise.reject(refreshError);
      }
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