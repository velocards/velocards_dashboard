import { create } from 'zustand';
import { authApi, User, LoginRequest, RegisterRequest } from '@/lib/api/auth';
import { tokenManager, getErrorMessage } from '@/lib/api/secureClient';
import { getKycStatus } from '@/lib/api/kyc';
import { useKycStore } from './kycStore';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean;
  requiresTwoFactor: boolean;
  pendingUser: User | null;
  
  // Actions
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  setPendingTwoFactor: (user: User) => void;
  clearPendingTwoFactor: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent redirect on refresh
  error: null,
  isCheckingAuth: false,
  requiresTwoFactor: false,
  pendingUser: null,
  
  // Login action
  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authApi.login(data);
      
      // Check if 2FA is required
      if (response.data.requiresTwoFactor) {
        set({
          requiresTwoFactor: true,
          pendingUser: response.data.user,
          isLoading: false,
          error: null,
        });
        return;
      }
      
      // Save token if provided
      if (response.data.accessToken) {
        tokenManager.setToken(response.data.accessToken);
      }
      
      // Update state
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        requiresTwoFactor: false,
        pendingUser: null,
      });
      
      // Set KYC status from user profile
      if (response.data.user.kycStatus) {
        useKycStore.getState().setKycStatus(response.data.user.kycStatus);
      }
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      // Check if it's an email verification error and redirect immediately
      if (errorMessage && errorMessage.includes('Please verify your email before logging in')) {
        // Don't update state to prevent UI flash
        if (typeof window !== 'undefined') {
          window.location.href = `/auth/verify-required?email=${encodeURIComponent(data.email)}`;
          return; // Stop execution here
        }
      }
      
      // For other errors, update state normally
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },
  
  // Register action
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authApi.register(data);
      
      // Don't log in automatically - redirect to login
      set({
        isLoading: false,
        error: null,
      });
      
      // Don't return anything to match Promise<void> signature
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      
      set({
        isLoading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  },
  
  // Logout action
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API fails
    }
    
    // Clear token and state
    tokenManager.removeToken();
    
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
  
  // Check authentication status
  checkAuth: async () => {
    // Prevent multiple simultaneous auth checks
    const { isCheckingAuth } = get();
    if (isCheckingAuth) {
      return;
    }
    
    const token = tokenManager.getToken();
    
    if (!token) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isCheckingAuth: false,
      });
      return;
    }
    
    set({ isLoading: true, isCheckingAuth: true });
    
    try {
      const response = await authApi.getProfile();
      
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      });
      
      // Set KYC status from user profile
      if (response.data.kycStatus) {
        useKycStore.getState().setKycStatus(response.data.kycStatus);
      }
    } catch (error) {
      
      // Clear invalid token
      tokenManager.removeToken();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isCheckingAuth: false,
        error: null,
      });
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
  
  // Set pending two-factor
  setPendingTwoFactor: (user: User) => {
    set({ 
      requiresTwoFactor: true, 
      pendingUser: user 
    });
  },
  
  // Clear pending two-factor
  clearPendingTwoFactor: () => {
    set({ 
      requiresTwoFactor: false, 
      pendingUser: null 
    });
  },
}));