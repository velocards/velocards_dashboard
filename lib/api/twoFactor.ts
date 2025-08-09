import { apiClient, ApiResponse } from './secureClient';

// Types for 2FA operations
export interface TwoFactorStatus {
  isEnabled: boolean;
  lastUsed: string | null;
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorEnableRequest {
  code: string;
  password: string;
}

export interface TwoFactorVerifyRequest {
  code: string;
  isBackupCode?: boolean;
}

export interface TwoFactorDisableRequest {
  password: string;
  code?: string;
}

export interface TwoFactorRecoveryRequest {
  email: string;
  recoveryToken?: string;
  newCode?: string;
}

export interface SessionInfo {
  id: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: string;
  createdAt: string;
}

// 2FA API service
export const twoFactorApi = {
  // Get 2FA status
  getStatus: async (): Promise<ApiResponse<TwoFactorStatus>> => {
    const response = await apiClient.get<ApiResponse<TwoFactorStatus>>('/v2/auth/2fa/status');
    return response.data;
  },

  // Initialize 2FA setup
  setup: async (): Promise<ApiResponse<TwoFactorSetupResponse>> => {
    const response = await apiClient.post<ApiResponse<TwoFactorSetupResponse>>('/v2/auth/2fa/setup');
    return response.data;
  },

  // Enable 2FA with verification
  enable: async (data: TwoFactorEnableRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/v2/auth/2fa/enable', data);
    return response.data;
  },

  // Verify 2FA code during login
  verify: async (data: TwoFactorVerifyRequest): Promise<ApiResponse<{ user: any; tokens?: any }>> => {
    const response = await apiClient.post<ApiResponse<{ user: any; tokens?: any }>>('/v2/auth/2fa/verify', data);
    return response.data;
  },

  // Disable 2FA
  disable: async (data: TwoFactorDisableRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/v2/auth/2fa/disable', data);
    return response.data;
  },

  // Get QR code for re-display
  getQRCode: async (): Promise<ApiResponse<{ qrCode: string }>> => {
    const response = await apiClient.get<ApiResponse<{ qrCode: string }>>('/v2/auth/2fa/qrcode');
    return response.data;
  },

  // Regenerate backup codes
  regenerateBackupCodes: async (password: string): Promise<ApiResponse<{ backupCodes: string[] }>> => {
    const response = await apiClient.post<ApiResponse<{ backupCodes: string[] }>>('/v2/auth/2fa/backup-codes/regenerate', { password });
    return response.data;
  },

  // Initiate account recovery
  initiateRecovery: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>('/v2/auth/2fa/recovery/initiate', { email });
    return response.data;
  },

  // Complete account recovery
  completeRecovery: async (data: TwoFactorRecoveryRequest): Promise<ApiResponse<{ message: string; backupCodes?: string[] }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string; backupCodes?: string[] }>>('/v2/auth/2fa/recovery/complete', data);
    return response.data;
  },

  // Get active sessions
  getSessions: async (): Promise<ApiResponse<SessionInfo[]>> => {
    const response = await apiClient.get<ApiResponse<SessionInfo[]>>('/v2/auth/sessions');
    return response.data;
  },

  // Revoke a session
  revokeSession: async (sessionId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/v2/auth/sessions/${sessionId}`);
    return response.data;
  },
};