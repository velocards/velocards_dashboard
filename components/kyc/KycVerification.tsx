"use client";
import React, { useEffect, useState } from 'react';
import snsWebSdk from '@sumsub/websdk';
import { useKycStore } from '@/stores/kycStore';
import { apiClient } from '@/lib/api/client';
import { toast } from 'react-toastify';

interface KycVerificationProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const KycVerification: React.FC<KycVerificationProps> = ({ 
  onComplete, 
  onCancel 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initiateKyc, reset } = useKycStore();

  // Simple initialization on mount - only once
  useEffect(() => {
    let mounted = true;
    
    const init = async () => {
      // Reset store state first
      reset();
      
      // Wait a bit longer to ensure any previous requests are cleared
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Only proceed if component is still mounted
      if (mounted) {
        initializeKYC();
      }
    };
    
    init();
    
    return () => {
      mounted = false;
    };
  }, []); // No dependencies to prevent re-runs

  const initializeKYC = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if we've made too many requests recently
      const lastAttempt = localStorage.getItem('kyc_last_attempt');
      if (lastAttempt) {
        const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
        if (timeSinceLastAttempt < 60000) { // 1 minute cooldown
          const waitTime = Math.ceil((60000 - timeSinceLastAttempt) / 1000);
          setError(`Please wait ${waitTime} seconds before trying again to avoid rate limits`);
          setLoading(false);
          return;
        }
      }
      
      // Record this attempt
      localStorage.setItem('kyc_last_attempt', Date.now().toString());
      
      const { data } = await apiClient.post('/kyc/initiate');
      
      if (!data?.data?.accessToken) {
        setError('Failed to get verification token from API');
        setLoading(false);
        return;
      }

      // Wait for DOM to be ready, then launch WebSDK
      setTimeout(() => {
        launchWebSDK(data.data.accessToken);
      }, 500);
    } catch (err: any) {
      // Handle rate limiting specifically
      if (err.response?.status === 429 || err.response?.data?.error?.code === 'AUTH_RATE_LIMIT_EXCEEDED') {
        setError('Too many requests. Please wait 5 minutes before trying again.');
        // Clear the attempt timestamp so user can try again after longer wait
        localStorage.removeItem('kyc_last_attempt');
      } else {
        setError(`API call failed: ${err.response?.data?.error?.message || err.message}`);
      }
      setLoading(false);
    }
  };

  const launchWebSDK = (accessToken: string) => {
    try {
      // First ensure we're not in loading state when showing the container
      setLoading(false);
      
      // Wait for the DOM to be ready and container to be rendered
      const waitForContainer = () => {
        return new Promise<HTMLElement>((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 30; // 3 seconds total
          
          const checkContainer = () => {
            const container = document.getElementById('sumsub-websdk-container');
            
            if (container) {
              resolve(container);
              return;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
              reject(new Error('Container not found after multiple attempts'));
              return;
            }
            
            setTimeout(checkContainer, 100);
          };
          
          checkContainer();
        });
      };
      
      // Wait for container then launch SDK
      waitForContainer()
        .then((container) => {
          // Clear any existing content
          container.innerHTML = '';
          
          const snsWebSdkInstance = (snsWebSdk
            .init(
              accessToken, 
              () => {
                return initiateKyc().then(r => r?.accessToken || '');
              }
            ) as any)
            .on('idCheck.onError', () => {
              setError('Verification error occurred');
              toast.error('Verification error occurred');
            })
            .on('idCheck.applicantStatus', (payload: any) => {
              if (payload.reviewResult?.reviewAnswer === 'GREEN') {
                toast.success('Verification completed successfully!');
                onComplete?.();
              }
            })
            .onMessage((type: any) => {
              if (type === 'idCheck.onReady') {
                setLoading(false);
              } else if (type === 'idCheck.onApplicantSubmitted') {
                toast('Verification submitted! We\'ll review your documents shortly.');
              }
            })
            .build();
          
          snsWebSdkInstance.launch('#sumsub-websdk-container');
        })
        .catch(() => {
          setError('Verification container not ready. Please refresh and try again.');
          setLoading(false);
        });
      
    } catch (error) {
      setError('Failed to initialize verification');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600">
          Please follow the steps to verify your identity
        </p>
      </div>

      {/* Always render the container, but overlay loading/error states */}
      <div className="relative w-full bg-white rounded-lg shadow-sm min-h-[600px] overflow-hidden">
        {/* The container that Sumsub SDK will use */}
        <div id="sumsub-websdk-container" className="w-full min-h-[600px]"></div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading verification...</p>
            </div>
          </div>
        )}
        
        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
            <div className="text-center max-w-md p-8">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="las la-exclamation-triangle text-4xl text-red-600"></i>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Verification Error
              </h4>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={initializeKYC}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {onCancel && (
        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel Verification
          </button>
        </div>
      )}
    </div>
  );
};

export default KycVerification;