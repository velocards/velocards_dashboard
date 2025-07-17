"use client";
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import KycVerification from './KycVerification';
import { useKycStore } from '@/stores/kycStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KycModal: React.FC<KycModalProps> = ({ isOpen, onClose }) => {
  const { kycStatus, checkStatus, clearError, reset, resetKyc, isLoading, isResetting } = useKycStore();
  const { checkAuth, user } = useAuthStore();
  const router = useRouter();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    // Clear any errors when closing
    clearError();
    // Clear interval if exists
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onClose();
  };

  useEffect(() => {
    if (isOpen && !isLoading) {
      // Only check status if we don't already have it from user profile
      // This prevents unnecessary API calls when status is already known
      // Also don't check if store kycStatus is null (meaning user clicked reset)
      if (!user?.kycStatus && !kycStatus && kycStatus !== null) {
        checkStatus();
      }
    }
  }, [isOpen]); // Minimal dependencies to prevent loops
  
  useEffect(() => {
    // Set up auto-refresh for pending status
    // But don't auto-refresh if store status is null (user clicked reset)
    if (isOpen && kycStatus !== null && (user?.kycStatus === 'pending' || kycStatus === 'pending')) {
      intervalRef.current = setInterval(async () => {
        await checkStatus();
        
        // Check if status changed from pending to approved
        const updatedUser = useAuthStore.getState().user;
        const updatedKycStatus = useKycStore.getState().kycStatus;
        
        if (updatedUser?.kycStatus === 'approved' || updatedKycStatus === 'approved') {
          await checkAuth();
          clearInterval(intervalRef.current!);
          setTimeout(() => {
            handleClose();
            router.refresh();
          }, 1000);
        }
      }, 30000); // Check every 30 seconds
    }
    
    // Cleanup interval on unmount or when modal closes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen, user?.kycStatus, kycStatus, checkStatus, checkAuth, handleClose, router]); // All dependencies

  const handleComplete = async () => {
    // Refresh user profile to get updated tier
    await checkAuth();
    handleClose();
    
    // Optionally refresh the page to show updated tier
    router.refresh();
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal */}
        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Identity Verification
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <i className="las la-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Status Messages */}
            {kycStatus === 'approved' || (user?.kycStatus === 'approved' && kycStatus !== null) ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <i className="las la-check-circle text-4xl text-green-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Complete!
                </h4>
                <p className="text-gray-600 mb-6">
                  Your identity has been verified. You now have access to all features.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                >
                  Continue
                </button>
              </div>
            ) : (kycStatus === 'pending' || (user?.kycStatus === 'pending' && kycStatus !== null)) ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <i className="las la-hourglass-half text-4xl text-yellow-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Status: Pending
                </h4>
                <p className="text-gray-600 mb-4">
                  Your verification may be incomplete or under review.
                </p>
                
                {/* Options for pending status */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-amber-800 mb-2">
                    <i className="las la-exclamation-triangle mr-1"></i>
                    <strong>Did you complete the verification?</strong>
                  </p>
                  <p className="text-sm text-amber-700">
                    If you didn't finish submitting your documents, you can resume the verification process.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {/* Resume Verification Button */}
                  <button
                    onClick={async () => {
                      try {
                        // Clear any previous errors first
                        clearError();
                        
                        // Clear the auto-refresh interval first
                        if (intervalRef.current) {
                          clearInterval(intervalRef.current);
                          intervalRef.current = null;
                        }
                        
                        // Reset store to clear old tokens and show verification form
                        reset();
                        
                        // The KycVerification component will automatically try to initialize
                        // and the backend will handle the resume automatically
                      } catch (error) {
                        // Error will be handled by the store
                      }
                    }}
                    className="px-8 py-3 bg-secondary text-gray-900 rounded-lg hover:bg-secondary/90 font-medium"
                  >
                    <i className="las la-redo mr-2"></i>
                    Resume Verification
                  </button>
                  
                  {/* Check Status Button */}
                  <button
                    onClick={async () => {
                      // Prevent rapid clicking - minimum 5 seconds between checks
                      if (lastCheckTime) {
                        const timeSinceLastCheck = new Date().getTime() - lastCheckTime.getTime();
                        if (timeSinceLastCheck < 5000) {
                          // Too soon to check again
                          return;
                        }
                      }
                      
                      setIsCheckingStatus(true);
                      setLastCheckTime(new Date());
                      
                      try {
                        await checkStatus();
                        
                        // Check if status changed
                        const updatedStatus = useKycStore.getState().kycStatus;
                        const updatedUser = useAuthStore.getState().user;
                        if (updatedStatus === 'approved' || updatedUser?.kycStatus === 'approved') {
                          await checkAuth();
                          setTimeout(() => {
                            handleClose();
                            router.refresh();
                          }, 1000);
                        }
                      } catch (error) {
                        // Error is already handled in the store
                      } finally {
                        setIsCheckingStatus(false);
                      }
                    }}
                    disabled={isCheckingStatus}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isCheckingStatus ? (
                      <>
                        <i className="las la-spinner animate-spin mr-2"></i>
                        Checking...
                      </>
                    ) : (
                      <>
                        <i className="las la-sync mr-2"></i>
                        Check Status
                      </>
                    )}
                  </button>
                  
                  <div className="text-xs text-gray-500 mt-6">
                    <p className="mb-2">Having issues?</p>
                    <a 
                      href="mailto:support@velocards.com?subject=KYC%20Verification%20Stuck%20in%20Pending" 
                      className="text-primary hover:underline"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            ) : kycStatus === 'rejected' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <i className="las la-times-circle text-4xl text-red-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h4>
                <p className="text-gray-600 mb-6">
                  Your verification was rejected. Please try again with valid documents.
                </p>
                <div className="space-y-2">
                  <button
                    onClick={async () => {
                      try {
                        await resetKyc();
                        // Reset the store state to allow new verification
                        reset();
                        // The modal will now show the verification form
                      } catch (error: any) {
                        // If reset fails, user can contact support
                      }
                    }}
                    disabled={isResetting}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
                  >
                    {isResetting ? 'Resetting...' : 'Try Again'}
                  </button>
                  
                  <div className="text-xs text-gray-500 mt-3">
                    <a 
                      href="mailto:support@velocards.com?subject=KYC%20Verification%20Reset%20Issue" 
                      className="text-primary hover:underline"
                    >
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <KycVerification 
                onComplete={handleComplete}
                onCancel={handleClose}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default KycModal;