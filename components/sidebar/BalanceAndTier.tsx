"use client";
import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import KycModal from "@/components/kyc/KycModal";

const TierInfo = () => {
  const { profile } = useUserStore();
  const [showKycModal, setShowKycModal] = useState(false);
  const isUnverified = profile?.tier?.level === 0;

  const handleVerifyClick = () => {
    setShowKycModal(true);
  };

  // Get tier display information based on user's tier level
  const getTierInfo = () => {
    const tierLevel = profile?.tier?.level || 0;
    
    const tiers: Record<number, any> = {
      0: {
        name: "Unverified",
        displayName: "Unverified",
        color: "gray",
        fees: { commission: "5%", cardCreation: "$50.00", cardRenewal: "N/A" },
        nextTier: {
          name: "Verified",
          color: "blue",
          fees: { commission: "4%", cardCreation: "$30.00", cardRenewal: "$15.00/mo" },
          savings: { commission: "-1%", cardCreation: "-$20.00", cardRenewal: "Full access" },
          requirement: "Complete KYC"
        }
      },
      1: {
        name: "Verified",
        displayName: "Verified",
        color: "blue",
        fees: { commission: "4%", cardCreation: "$30.00", cardRenewal: "$15.00/mo" },
        progress: { current: profile?.yearlySpending || 0, required: 100000 },
        nextTier: {
          name: "Premium",
          color: "purple",
          fees: { commission: "2.5%", cardCreation: "$20.00", cardRenewal: "$15.00/mo" },
          savings: { commission: "-1.5%", cardCreation: "-$10.00", cardRenewal: "Same" },
          requirement: "$100k yearly"
        }
      },
      2: {
        name: "Premium",
        displayName: "Premium",
        color: "purple",
        fees: { commission: "2.5%", cardCreation: "$20.00", cardRenewal: "$15.00/mo" },
        progress: { current: profile?.yearlySpending || 0, required: 500000 },
        nextTier: {
          name: "Elite",
          color: "gold",
          fees: { commission: "1%", cardCreation: "$10.00", cardRenewal: "$10.00/mo" },
          savings: { commission: "-1.5%", cardCreation: "-$10.00", cardRenewal: "-$5.00" },
          requirement: "$500k yearly"
        }
      },
      3: {
        name: "Elite",
        displayName: "Elite",
        color: "gold",
        fees: { commission: "1%", cardCreation: "$10.00", cardRenewal: "$10.00/mo" },
        isMaxTier: true
      }
    };

    return tiers[tierLevel] || tiers[0];
  };

  const tierInfo = getTierInfo();
  const progressPercentage = tierInfo.progress 
    ? Math.min((tierInfo.progress.current / tierInfo.progress.required) * 100, 100)
    : 0;

  return (
    <div className="px-4 xxl:px-6 xxxl:px-8">
      
      {/* Tier Section */}
      <div className="tier-part relative">
        <div className="flex items-center justify-between border-t-2 border-dashed border-primary/20 py-4 lg:py-6">
          <p className="text-xs font-semibold">Your Tier</p>
          <span className={`text-xs px-2 py-1 rounded-full ${
            tierInfo.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
            tierInfo.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
            tierInfo.color === 'gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
          }`}>
            {tierInfo.displayName}
          </span>
        </div>
        <div className="space-y-3">
          {/* Current Tier Info */}
          <div className={`rounded-lg p-2.5 ${
            tierInfo.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
            tierInfo.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20' :
            tierInfo.color === 'gold' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
            'bg-gray-50 dark:bg-gray-900/20'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium">{tierInfo.displayName} Tier</span>
              <span className={`text-sm ${
                tierInfo.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                tierInfo.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                tierInfo.color === 'gold' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>Current</span>
            </div>
            <div className="space-y-0.5 text-[7px] text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Deposit Fee:</span>
                <span>{tierInfo.fees.commission}</span>
              </div>
              <div className="flex justify-between">
                <span>Card Creation:</span>
                <span>{tierInfo.fees.cardCreation}</span>
              </div>
              <div className="flex justify-between">
                <span>Card Monthly Fee:</span>
                <span>{tierInfo.fees.cardRenewal}</span>
              </div>
            </div>
          </div>
          
          {/* Progress to Next Tier - Only show if not max tier and has progress tracking */}
          {!tierInfo.isMaxTier && tierInfo.progress && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span>Progress to {tierInfo.nextTier.name}</span>
                <span>${(tierInfo.progress.current).toLocaleString()} / ${(tierInfo.progress.required).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div className="bg-primary h-1 rounded-full transition-all duration-500" style={{width: `${progressPercentage}%`}}></div>
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                ${(tierInfo.progress.required - tierInfo.progress.current).toLocaleString()} more to unlock {tierInfo.nextTier.name}
              </div>
            </div>
          )}
          
          {/* Next Tier Info - Only show if not max tier */}
          {!tierInfo.isMaxTier && tierInfo.nextTier && (
            <div className={`rounded-lg p-2.5 border border-dashed ${
              tierInfo.nextTier.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' :
              tierInfo.nextTier.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700' :
              tierInfo.nextTier.color === 'gold' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700' :
              'bg-gray-50 dark:bg-gray-900/20 border-gray-300 dark:border-gray-700'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{tierInfo.nextTier.name} Tier</span>
                <span className={`text-sm ${
                  tierInfo.nextTier.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  tierInfo.nextTier.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                  tierInfo.nextTier.color === 'gold' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>Next</span>
              </div>
              <div className="space-y-0.5 text-[7px] text-gray-600 dark:text-gray-400 mb-1.5">
                <div className="flex justify-between">
                  <span>Deposit Fee:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {tierInfo.nextTier.fees.commission} 
                    <span className="text-green-500 dark:text-green-400"> ({tierInfo.nextTier.savings.commission})</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Card Creation:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {tierInfo.nextTier.fees.cardCreation} 
                    <span className="text-green-500 dark:text-green-400"> ({tierInfo.nextTier.savings.cardCreation})</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Card Monthly Fee:</span>
                  <span className="text-green-600 dark:text-green-400 whitespace-nowrap">
                    {tierInfo.nextTier.fees.cardRenewal} 
                    <span className="text-green-500 dark:text-green-400"> ({tierInfo.nextTier.savings.cardRenewal})</span>
                  </span>
                </div>
              </div>
              <div className="text-[8px] text-green-600 dark:text-green-400 font-medium text-left">
                {tierInfo.nextTier.requirement === "Complete KYC" ? "Verify to unlock!" : "Save on all fees!"}
              </div>
            </div>
          )}
          
          {/* Max Tier Message */}
          {tierInfo.isMaxTier && (
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-3 text-center">
              <i className="las la-crown text-2xl text-yellow-600 dark:text-yellow-400 mb-1"></i>
              <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">
                You've reached the highest tier!
              </p>
              <p className="text-[10px] text-yellow-700 dark:text-yellow-400 mt-1">
                Enjoy the lowest fees and exclusive benefits
              </p>
            </div>
          )}
        </div>
        
        {/* Beautiful Overlay for Unverified Users */}
        {isUnverified && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            {/* Blurred background */}
            <div className="absolute inset-0 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 rounded-lg"></div>
            
            {/* Content */}
            <div className="relative z-20 p-4 text-center">
              <div className="mb-3">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-3">
                  <i className="las la-lock text-3xl text-primary"></i>
                </div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  Unlock Tier Benefits
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Complete KYC verification to access tier rewards and lower fees
                </p>
              </div>
              
              <button
                onClick={handleVerifyClick}
                className="w-full bg-primary text-white text-xs font-medium py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <i className="las la-check-circle text-base"></i>
                Verify Now
              </button>
              
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                  <i className="las la-check text-green-500"></i>
                  <span>Unlock unlimited cards</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600 dark:text-gray-400">
                  <i className="las la-check text-green-500"></i>
                  <span>Save 40% on fees</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KYC Modal */}
      <KycModal 
        isOpen={showKycModal} 
        onClose={() => setShowKycModal(false)} 
      />
    </div>
  );
};

export default TierInfo;