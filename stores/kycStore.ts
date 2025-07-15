import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  initiateKycVerification, 
  getKycStatus, 
  resetKycVerification,
  type KycInitiateResponse,
  type KycStatusResponse
} from '@/lib/api/kyc';
import { toast } from 'react-toastify';

interface KycStore {
  // State
  kycStatus: 'new' | 'pending' | 'approved' | 'rejected' | 'expired' | null;
  kycAccessToken: string | null;
  applicantId: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  isResetting: boolean;
  error: string | null;
  lastChecked: Date | null;
  lastInitiateAttempt: Date | null;
  isRateLimited: boolean;
  isResuming: boolean; // NEW: Indicates whether this is a resumed session

  // Actions
  initiateKyc: () => Promise<KycInitiateResponse | null>;
  checkStatus: () => Promise<void>;
  resetKyc: () => Promise<void>;
  setKycStatus: (status: KycStatusResponse['status']) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  kycStatus: null,
  kycAccessToken: null,
  applicantId: null,
  isLoading: false,
  isInitializing: false,
  isResetting: false,
  error: null,
  lastChecked: null,
  lastInitiateAttempt: null,
  isRateLimited: false,
  isResuming: false,
};

export const useKycStore = create<KycStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      initiateKyc: async () => {
        const state = get();
        
        // Check if already initializing
        if (state.isInitializing) {
          return null;
        }
        
        // Check if we already have an access token
        if (state.kycAccessToken && state.kycStatus !== 'expired') {
          return {
            accessToken: state.kycAccessToken,
            applicantId: state.applicantId || '',
            status: state.kycStatus || 'new',
            expiresAt: new Date().toISOString(),
          };
        }
        
        set({ 
          isInitializing: true, 
          error: null, 
          isRateLimited: false,
          lastInitiateAttempt: new Date()
        });
        
        try {
          const response = await initiateKycVerification();
          
          // Check if this is a resumed session
          const isResuming = response.isResume === true;
          
          set({
            kycAccessToken: response.accessToken,
            applicantId: response.applicantId,
            kycStatus: response.status,
            isInitializing: false,
            isRateLimited: false,
            isResuming: isResuming,
          });
          
          // Show appropriate toast message
          if (isResuming) {
            toast.info('Continuing your verification from where you left off...');
          } else {
            toast.info('Starting new verification process...');
          }
          
          return response;
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to initiate KYC verification';
          const errorCode = error.response?.data?.error?.code;
          const statusCode = error.response?.status;
          
          // Check for rate limit error
          if (errorMessage.toLowerCase().includes('too many') || 
              errorMessage.toLowerCase().includes('rate limit') ||
              errorCode === 'RATE_LIMIT_EXCEEDED' ||
              statusCode === 429) {
            set({ 
              error: 'Rate limit exceeded. Please wait a moment before trying again.', 
              isInitializing: false,
              isRateLimited: true 
            });
            toast.error('Too many attempts. Please wait 30 seconds before trying again.');
          } else {
            set({ error: errorMessage, isInitializing: false });
            toast.error(errorMessage);
          }
          
          return null;
        }
      },

      checkStatus: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getKycStatus();
          set({
            kycStatus: response.status,
            lastChecked: new Date(),
            isLoading: false,
          });
          
          // Show toast if status changed to approved
          const previousStatus = get().kycStatus;
          if (previousStatus !== 'approved' && response.status === 'approved') {
            toast.success('🎉 Your identity verification has been approved!');
          } else if (response.status === 'rejected' && previousStatus !== 'rejected') {
            toast.error('Your verification was rejected. Please try again.');
          }
          
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to check KYC status';
          set({ error: errorMessage, isLoading: false });
        }
      },

      resetKyc: async () => {
        set({ isResetting: true, error: null });
        try {
          const response = await resetKycVerification();
          set({
            kycStatus: 'new',
            kycAccessToken: null,
            applicantId: null,
            isResetting: false,
            isRateLimited: false,
            lastInitiateAttempt: null,
          });
          toast.success(response.message || 'KYC verification reset successfully');
        } catch (error: any) {
          const errorCode = error.response?.data?.error?.code;
          const errorMessage = error.response?.data?.error?.message || 'Failed to reset KYC verification';
          
          // Handle specific error codes
          if (errorCode === 'NO_KYC_FOUND') {
            set({ error: errorMessage, isResetting: false });
            toast.info('No verification found to reset');
          } else if (errorCode === 'KYC_ALREADY_APPROVED') {
            set({ error: errorMessage, isResetting: false });
            toast.warning('Your verification is already approved and cannot be reset');
          } else if (errorCode === 'KYC_RESET_FAILED') {
            // This is likely a Sumsub integration issue
            set({ error: errorMessage, isResetting: false });
            toast.error('Unable to reset verification at this time. Please contact support for assistance.');
          } else {
            set({ error: errorMessage, isResetting: false });
            toast.error(errorMessage);
          }
          
          throw error;
        }
      },

      setKycStatus: (status) => {
        set({ kycStatus: status });
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'kyc-store',
    }
  )
);