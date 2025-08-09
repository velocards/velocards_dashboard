import { create } from 'zustand';
import { twoFactorApi, TwoFactorStatus, TwoFactorSetupResponse, SessionInfo } from '@/lib/api/twoFactor';
import { getErrorMessage } from '@/lib/api/secureClient';
import { toast } from 'react-toastify';

interface TwoFactorState {
  // State
  status: TwoFactorStatus | null;
  setupData: TwoFactorSetupResponse | null;
  sessions: SessionInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  checkStatus: () => Promise<void>;
  initiateSetup: () => Promise<void>;
  enable2FA: (code: string, password: string) => Promise<void>;
  disable2FA: (password: string, code?: string) => Promise<void>;
  verify2FA: (code: string, isBackupCode?: boolean) => Promise<any>;
  regenerateBackupCodes: (password: string) => Promise<string[]>;
  getSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  clearError: () => void;
  clearSetupData: () => void;
}

export const useTwoFactorStore = create<TwoFactorState>((set, get) => ({
  // Initial state
  status: null,
  setupData: null,
  sessions: [],
  isLoading: false,
  error: null,
  
  // Check 2FA status
  checkStatus: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await twoFactorApi.getStatus();
      set({
        status: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
  
  // Initiate 2FA setup
  initiateSetup: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await twoFactorApi.setup();
      set({
        setupData: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
  
  // Enable 2FA
  enable2FA: async (code: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await twoFactorApi.enable({ code, password });
      
      // Update status
      set({
        status: { isEnabled: true, lastUsed: null },
        setupData: null,
        isLoading: false,
      });
      
      toast.success('Two-factor authentication enabled successfully!');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage || 'Failed to enable 2FA');
      throw error;
    }
  },
  
  // Disable 2FA
  disable2FA: async (password: string, code?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await twoFactorApi.disable({ password, code });
      
      // Update status
      set({
        status: { isEnabled: false, lastUsed: null },
        isLoading: false,
      });
      
      toast.success('Two-factor authentication disabled successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage || 'Failed to disable 2FA');
      throw error;
    }
  },
  
  // Verify 2FA code (used during login)
  verify2FA: async (code: string, isBackupCode: boolean = false) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await twoFactorApi.verify({ code, isBackupCode });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
  
  // Regenerate backup codes
  regenerateBackupCodes: async (password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await twoFactorApi.regenerateBackupCodes(password);
      set({ isLoading: false });
      toast.success('Backup codes regenerated successfully');
      return response.data.backupCodes;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage || 'Failed to regenerate backup codes');
      throw error;
    }
  },
  
  // Get active sessions
  getSessions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await twoFactorApi.getSessions();
      set({
        sessions: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },
  
  // Revoke a session
  revokeSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await twoFactorApi.revokeSession(sessionId);
      
      // Remove session from list
      const currentSessions = get().sessions;
      set({
        sessions: currentSessions.filter(s => s.id !== sessionId),
        isLoading: false,
      });
      
      toast.success('Session revoked successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage || 'Failed to revoke session');
    }
  },
  
  // Clear error
  clearError: () => {
    set({ error: null });
  },
  
  // Clear setup data
  clearSetupData: () => {
    set({ setupData: null });
  },
}));