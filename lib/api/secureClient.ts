import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';

// Create axios instance with secure defaults
export const secureApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Enhanced token management for migration period
// This supports both cookie-based (preferred) and localStorage (fallback)
const TOKEN_KEY = 'accessToken';

export const secureTokenManager = {
  // Check if we're using cookie-based auth
  isUsingCookies: () => {
    // The server should set a flag when using cookie auth
    return document.cookie.includes('auth_mode=secure');
  },
  
  // Get token (only for backward compatibility)
  getToken: () => {
    if (typeof window !== 'undefined' && !secureTokenManager.isUsingCookies()) {
      return localStorage.getItem(TOKEN_KEY);
    }
    // With cookies, token is automatically sent
    return null;
  },
  
  // Set token (only used during migration)
  setToken: (token: string) => {
    if (typeof window !== 'undefined' && !secureTokenManager.isUsingCookies()) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    // With cookies, server sets the token
  },
  
  // Remove token
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      // For cookie-based auth, server should clear the cookie
    }
  },
  
  // Get CSRF token from meta tag or cookie
  getCsrfToken: () => {
    // First try meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
    
    // Then try cookie
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='));
    
    if (csrfCookie) {
      return csrfCookie.split('=')[1];
    }
    
    return null;
  },
};

// Check if endpoint requires signing
const requiresSigning = (url: string, method: string): boolean => {
  if (!url || !method) return false;
  
  const requiresSigningForMethod = 
    (method === 'PUT' && (url.includes('/freeze') || url.includes('/unfreeze'))) ||
    (method === 'DELETE' && /\/cards\/[^/]+$/.test(url)) ||
    (method === 'POST' && url.includes('/crypto/withdraw'));
    
  return requiresSigningForMethod;
};

// Request interceptor - add auth token and CSRF protection
secureApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only add Authorization header if not using secure cookies
    if (!secureTokenManager.isUsingCookies()) {
      const token = secureTokenManager.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add CSRF token for state-changing requests
    const csrfToken = secureTokenManager.getCsrfToken();
    if (csrfToken && config.headers && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    // Add request signing for sensitive operations
    // NOTE: These headers will trigger CORS preflight, but that's acceptable
    // for sensitive operations that require additional security
    if (requiresSigning(config.url || '', config.method?.toUpperCase() || '')) {
      // For now, we'll add placeholder headers
      // In production, you'd get the secret from secure storage
      const timestamp = Math.floor(Date.now() / 1000);
      const nonce = Math.random().toString(36).substring(7);
      
      if (config.headers) {
        config.headers['X-Timestamp'] = timestamp.toString();
        config.headers['X-Nonce'] = nonce;
        // Note: X-Signature would be computed with user's API secret
        // This is a placeholder - actual implementation would use the signing utility
        config.headers['X-Signature'] = 'placeholder-signature';
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh and errors
secureApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    const isAuthEndpoint = originalRequest.url?.includes('/auth/');
    const errorData = error.response?.data as any;
    const isTokenExpired = error.response?.status === 401 && 
                          (errorData?.message === 'Token expired' || 
                           errorData?.error?.message === 'Token expired');
    
    // For token expiration, immediately redirect to login (security requirement)
    if (isTokenExpired && !isAuthEndpoint) {
      // Clear tokens
      secureTokenManager.removeToken();
      
      // Redirect to login with session expired message
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth/')) {
        window.location.replace('/auth/sign-in?error=session_expired');
      }
      
      return Promise.reject(error);
    }
    
    // Handle other 401 errors (not token expiration)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint && !isTokenExpired) {
      originalRequest._retry = true;
      
      // Clear tokens and redirect
      secureTokenManager.removeToken();
      
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/auth/')) {
        window.location.replace('/auth/sign-in');
      }
      
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden (CSRF token issues)
    if (error.response?.status === 403 && (error.response.data as any)?.error?.code === 'CSRF_VALIDATION_FAILED') {
      // Try to get a new CSRF token and retry once
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Request new CSRF token
          await secureApiClient.get('/auth/csrf-token');
          
          // Retry with new token
          return secureApiClient(originalRequest);
        } catch (csrfError) {
          return Promise.reject(csrfError);
        }
      }
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const message = `Rate limit exceeded. Please try again ${retryAfter ? `in ${retryAfter} seconds` : 'later'}.`;
      
      // Create a more user-friendly error
      error.message = message;
    }
    
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

// Enhanced error message extraction with security considerations
export const getSecureErrorMessage = (error: any): string => {
  // Don't expose internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    
    // Use API error message if available
    if (apiError?.error?.message) {
      return apiError.error.message;
    }
    
    // Handle common HTTP errors with user-friendly messages
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Your session has expired. Please sign in again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 429:
          return error.message || 'Too many requests. Please try again later.';
        case 500:
          return isProduction 
            ? 'Something went wrong. Please try again later.' 
            : error.message || 'Internal server error';
        default:
          return isProduction
            ? 'An unexpected error occurred. Please try again.'
            : error.message || 'An unexpected error occurred';
      }
    }
  }
  
  // Generic error message for production
  return isProduction 
    ? 'An unexpected error occurred. Please try again.' 
    : error?.message || 'An unexpected error occurred';
};

// Export aliases for easy migration
export const apiClient = secureApiClient;
export const tokenManager = secureTokenManager;
export const getErrorMessage = getSecureErrorMessage;

// Export axios for direct use if needed
export { axios };