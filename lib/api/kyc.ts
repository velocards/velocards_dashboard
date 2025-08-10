import { apiClient } from './secureClient';
import type { ApiResponse } from '@/types/api';

export interface KycInitiateResponse {
  accessToken: string;
  userId: string;
  applicantId: string;
  status: 'new' | 'pending' | 'completed' | 'failed';
  isResume: boolean; // Indicates if this is a resumed session
}

export interface KycStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewAnswer?: 'GREEN' | 'RED' | 'RETRY'; // Only if reviewed
  moderationComment?: string; // Only if rejected
  updatedAt: string;
}

export interface KycResetResponse {
  success: boolean;
  message: string;
}

// Start KYC verification process
export const initiateKycVerification = async (): Promise<KycInitiateResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<KycInitiateResponse>>('/kyc/initiate');
    console.log('KYC initiated:', response.data);
    return response.data.data!;
  } catch (error) {
    console.error('Failed to initiate KYC:', error);
    throw error;
  }
};

// Check current KYC status
export const getKycStatus = async (): Promise<KycStatusResponse> => {
  try {
    const response = await apiClient.get<ApiResponse<KycStatusResponse>>('/kyc/status');
    return response.data.data!;
  } catch (error) {
    console.error('Failed to get KYC status:', error);
    throw error;
  }
};

// Reset KYC verification (for retry after rejection)
export const resetKycVerification = async (): Promise<KycResetResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<KycResetResponse>>('/kyc/reset');
    return response.data.data!;
  } catch (error) {
    console.error('Failed to reset KYC:', error);
    throw error;
  }
};

// Helper function to check if user needs KYC
export const needsKycVerification = (kycStatus?: string): boolean => {
  return !kycStatus || kycStatus === 'pending' || kycStatus === 'new' || kycStatus === 'rejected' || kycStatus === 'expired';
};

// Helper function to check if KYC is in progress
export const isKycInProgress = (kycStatus?: string): boolean => {
  return kycStatus === 'pending';
};

// Helper function to check if KYC is approved
export const isKycApproved = (kycStatus?: string): boolean => {
  return kycStatus === 'approved';
};