import { apiClient, ApiResponse } from './secureClient';
import axios from 'axios';

// Create a separate client for v2 endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.velocards.com/api/v1';

// Construct v2 URL properly
let v2BaseUrl: string;
if (API_BASE_URL.includes('/api/v1')) {
  // If it already has /api/v1, replace with /api/v2
  v2BaseUrl = API_BASE_URL.replace('/api/v1', '/api/v2');
} else if (API_BASE_URL.includes('/api/')) {
  // If it has /api/ but not v1, add v2
  v2BaseUrl = API_BASE_URL + '/v2';
} else {
  // If no /api path at all, add /api/v2
  v2BaseUrl = API_BASE_URL + '/api/v2';
}

const v2Client = axios.create({
  baseURL: v2BaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor for authentication
v2Client.interceptors.request.use((config) => {
  // Always try to add the token from localStorage
  const token = localStorage.getItem('accessToken');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  totpCode: string;
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
    const response = await v2Client.get<ApiResponse<TwoFactorStatus>>('/auth/2fa/status');
    return response.data;
  },

  // Initialize 2FA setup
  setup: async (): Promise<ApiResponse<TwoFactorSetupResponse>> => {
    const response = await v2Client.post<ApiResponse<TwoFactorSetupResponse>>('/auth/2fa/setup', {});
    return response.data;
  },

  // Enable 2FA with verification
  enable: async (data: TwoFactorEnableRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await v2Client.post<ApiResponse<{ message: string }>>('/auth/2fa/enable', data);
    return response.data;
  },

  // Verify 2FA code during login
  verify: async (data: TwoFactorVerifyRequest): Promise<ApiResponse<{ user: any; tokens?: any }>> => {
    const response = await v2Client.post<ApiResponse<{ user: any; tokens?: any }>>('/auth/2fa/verify', data);
    return response.data;
  },

  // Disable 2FA
  disable: async (data: TwoFactorDisableRequest): Promise<ApiResponse<{ message: string }>> => {
    const response = await v2Client.post<ApiResponse<{ message: string }>>('/auth/2fa/disable', data);
    return response.data;
  },

  // Get QR code for re-display
  getQRCode: async (): Promise<ApiResponse<{ qrCode: string }>> => {
    const response = await v2Client.get<ApiResponse<{ qrCode: string }>>('/auth/2fa/qrcode');
    return response.data;
  },

  // Regenerate backup codes
  regenerateBackupCodes: async (password: string): Promise<ApiResponse<{ backupCodes: string[] }>> => {
    const response = await v2Client.post<ApiResponse<{ backupCodes: string[] }>>('/auth/2fa/backup-codes/regenerate', { password });
    return response.data;
  },

  // Initiate account recovery
  initiateRecovery: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await v2Client.post<ApiResponse<{ message: string }>>('/auth/2fa/recovery/initiate', { email });
    return response.data;
  },

  // Complete account recovery
  completeRecovery: async (data: TwoFactorRecoveryRequest): Promise<ApiResponse<{ message: string; backupCodes?: string[] }>> => {
    const response = await v2Client.post<ApiResponse<{ message: string; backupCodes?: string[] }>>('/auth/2fa/recovery/complete', data);
    return response.data;
  },

  // Get active sessions
  getSessions: async (): Promise<ApiResponse<SessionInfo[]>> => {
    const response = await v2Client.get<ApiResponse<SessionInfo[]>>('/auth/sessions');
    return response.data;
  },

  // Revoke a session
  revokeSession: async (sessionId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await v2Client.delete<ApiResponse<{ message: string }>>(`/auth/sessions/${sessionId}`);
    return response.data;
  },
};