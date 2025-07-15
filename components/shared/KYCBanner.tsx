"use client";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import KycModal from "@/components/kyc/KycModal";

const KYCBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showKycModal, setShowKycModal] = useState(false);
  const { profile } = useUserStore();

  // Only show for tier 0 (Unverified) users
  if (!profile || profile.tier?.level !== 0 || !isVisible) {
    return null;
  }

  const handleUpgrade = () => {
    setShowKycModal(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="relative mb-6">
      <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-xl p-6 border border-primary/20">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Dismiss banner"
        >
          <i className="las la-times text-xl"></i>
        </button>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <i className="las la-shield-alt text-4xl text-primary"></i>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-1">Complete Your Verification</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Verify your identity to unlock all features including higher card limits, multiple cards, and premium support.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <i className="las la-check text-green-500"></i>
                Unlimited cards (vs 1 card limit)
              </span>
              <span className="flex items-center gap-1">
                <i className="las la-check text-green-500"></i>
                No spending limits (vs $500 daily)
              </span>
              <span className="flex items-center gap-1">
                <i className="las la-check text-green-500"></i>
                $30 card fee (vs $50)
              </span>
              <span className="flex items-center gap-1">
                <i className="las la-check text-green-500"></i>
                4% deposit fee (vs 5%)
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Get Verified
              <i className="las la-arrow-right text-base"></i>
            </button>
          </div>
        </div>
      </div>

      {/* KYC Modal */}
      <KycModal 
        isOpen={showKycModal} 
        onClose={() => setShowKycModal(false)} 
      />
    </div>
  );
};

export default KYCBanner;