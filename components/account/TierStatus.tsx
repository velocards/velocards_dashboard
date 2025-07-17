"use client";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { userApi } from "@/lib/api/user";
import { IconTrendingUp, IconCheck, IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const TierStatus = () => {
  const { profile, fetchProfile } = useUserStore();
  const { user } = useAuthStore();
  const [tierInfo, setTierInfo] = useState<{
    current: any;
    nextTier: any;
    progressToNext: number;
    amountToNext: number;
  } | null>(null);
  const [tierFees, setTierFees] = useState<{
    currentTier: string;
    fees: {
      cardCreation: number;
      cardMonthly: number;
      depositPercentage: number;
      withdrawalPercentage: number;
    };
    monthlyFeesOwed: number;
    totalFeesThisMonth: number;
  } | null>(null);
  const [allTiers, setAllTiers] = useState<Array<any>>([]);
  const [isLoadingTier, setIsLoadingTier] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchTierInfo();
    fetchTierFees();
    fetchAllTiers();
  }, [fetchProfile]);

  const fetchTierInfo = async () => {
    try {
      setIsLoadingTier(true);
      const response = await userApi.getCurrentTier();
      setTierInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch tier info:', error);
      // If the API call fails, we'll just use the profile tier data
    } finally {
      setIsLoadingTier(false);
    }
  };
  
  const fetchTierFees = async () => {
    try {
      const response = await userApi.getTierFees();
      setTierFees(response.data);
    } catch (error) {
      console.error('Failed to fetch tier fees:', error);
    }
  };

  const fetchAllTiers = async () => {
    try {
      const response = await userApi.getAllTiers();
      setAllTiers(response.data);
    } catch (error) {
      console.error('Failed to fetch all tiers:', error);
    }
  };

  // Get current tier from profile or tierInfo
  const currentTier = tierInfo?.current || profile?.tier;
  let nextTier = tierInfo?.nextTier;
  
  // For unverified users, manually set the next tier as Verified (tier 1)
  if (currentTier?.level === 0 && !nextTier && allTiers.length > 0) {
    const verifiedTier = allTiers.find(t => t.tier_level === 1);
    if (verifiedTier) {
      nextTier = {
        level: verifiedTier.tier_level,
        name: verifiedTier.name,
        displayName: verifiedTier.display_name,
        description: verifiedTier.description
      };
    }
  }
  
  // Get full tier data from allTiers if available
  const currentTierData = allTiers.find(t => t.tier_level === currentTier?.level) || currentTier;
  const nextTierData = allTiers.find(t => t.tier_level === nextTier?.level) || nextTier;
  
  // Map tier colors based on level
  const getTierColor = (level: number) => {
    switch (level) {
      case 0: return "gray";
      case 1: return "blue";
      case 2: return "purple";
      case 3: return "gold";
      default: return "gray";
    }
  };

  // Calculate requirements status
  const getRequirements = () => {
    if (!nextTierData) return [];
    
    const requirements = [];
    
    // KYC requirement
    if (nextTierData.kyc_required) {
      requirements.push({
        text: "Verify email address",
        completed: user?.emailVerified || false
      });
      requirements.push({
        text: "Complete KYC verification",
        completed: user?.kycStatus === 'approved'
      });
    }
    
    // Spending requirements
    if (nextTierData.yearly_spending_threshold > 0) {
      const yearlySpending = profile?.yearlySpending || 0;
      requirements.push({
        text: `Reach $${nextTierData.yearly_spending_threshold.toLocaleString()} yearly spending`,
        completed: yearlySpending >= nextTierData.yearly_spending_threshold,
        progress: `$${yearlySpending.toLocaleString()} / $${nextTierData.yearly_spending_threshold.toLocaleString()}`
      });
    }
    
    return requirements;
  };

  const currentTierColor = currentTier ? getTierColor(currentTier.level) : "gray";
  const requirements = getRequirements();
  const completedRequirements = requirements.filter(r => r.completed).length;

  // Generate benefits from tier data
  const getTierBenefits = (tierData: any) => {
    if (!tierData) return [];
    
    const benefits = [];
    
    // Add card limit benefit
    if (tierData.max_cards === null) {
      benefits.push("Unlimited active cards");
    } else if (tierData.max_cards === 1) {
      benefits.push("1 active card maximum");
    } else {
      benefits.push(`Up to ${tierData.max_cards} active cards`);
    }
    
    // Add spending limit benefits based on tier level
    if (tierData.tier_level === 0) {
      benefits.push("$500 daily spending limit");
    } else {
      benefits.push("No spending limits");
    }
    
    // Add fee benefits
    benefits.push(`${tierData.deposit_fee_percentage}% deposit fee`);
    
    // Add feature-based benefits
    if (tierData.features?.cashback) {
      benefits.push(`${tierData.features.cashback}% cashback on all purchases`);
    }
    
    if (tierData.features?.support_level) {
      benefits.push(`${tierData.features.support_level} support`);
    }
    
    if (tierData.features?.concierge_service) {
      benefits.push("Dedicated concierge service");
    }
    
    return benefits;
  };

  if (isLoadingTier || !currentTier) {
    return (
      <div className="box p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <IconTrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Account Tier</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your current tier and progression
            </p>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4"></div>
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Use API data for tier information
  const tierBenefits = getTierBenefits(currentTierData);
  
  // Use API tier fees if available, otherwise fall back to tier data
  const displayFees = tierFees?.fees ? {
    cardCreationFee: tierFees.fees.cardCreation,
    transactionFee: tierFees.fees.depositPercentage,
    monthlyFee: tierFees.fees.cardMonthly
  } : {
    cardCreationFee: currentTierData?.card_creation_fee || 0,
    transactionFee: currentTierData?.deposit_fee_percentage || 0,
    monthlyFee: currentTierData?.card_monthly_fee || 0
  };

  return (
    <div className="box p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <IconTrendingUp className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Account Tier</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your current tier and progression
          </p>
        </div>
      </div>

      {/* Current Tier Display */}
      <div className={`p-4 rounded-lg mb-6 ${
        currentTierColor === 'blue' 
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
          : currentTierColor === 'purple'
          ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
          : currentTierColor === 'gold'
          ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xl font-bold">{currentTierData?.display_name || currentTierData?.name || currentTier?.displayName || currentTier?.name}</h4>
          <span className={`text-2xl ${
            currentTierColor === 'blue' 
              ? 'text-blue-600 dark:text-blue-400' 
              : currentTierColor === 'purple'
              ? 'text-purple-600 dark:text-purple-400'
              : currentTierColor === 'gold'
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {currentTier.level === 0 && <i className="las la-user"></i>}
            {currentTier.level === 1 && <i className="las la-certificate"></i>}
            {currentTier.level === 2 && <i className="las la-gem"></i>}
            {currentTier.level === 3 && <i className="las la-crown"></i>}
          </span>
        </div>
        
        {(currentTierData?.description || currentTier?.description) && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{currentTierData?.description || currentTier?.description}</p>
        )}
        
        <div className="space-y-4">
          {/* Benefits */}
          {tierBenefits && tierBenefits.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Benefits:</p>
              <ul className="space-y-2">
                {tierBenefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <IconCheck className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Card Limits */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Active Cards</p>
              <p className="font-medium">{currentTierData?.max_cards || 'Unlimited'}</p>
            </div>
            {currentTier?.level === 0 && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Daily Spending</p>
                <p className="font-medium">$500</p>
              </div>
            )}
            {currentTier?.level > 0 && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Spending Limits</p>
                <p className="font-medium text-green-600 dark:text-green-400">No limits</p>
              </div>
            )}
          </div>
          
          {/* Fees */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Card Creation</p>
              <p className="font-medium">${displayFees.cardCreationFee}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Deposit Fee</p>
              <p className="font-medium">{displayFees.transactionFee}%</p>
            </div>
            {displayFees.monthlyFee !== undefined && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Monthly Fee</p>
                <p className="font-medium">
                  {displayFees.monthlyFee > 0 ? `$${displayFees.monthlyFee}` : 'No fee'}
                </p>
              </div>
            )}
          </div>
          
          {/* Monthly Fees Summary */}
          {tierFees && (
            <div className="mt-4 pt-3 border-t dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Monthly Fees Owed</p>
                  <p className="font-medium text-orange-600 dark:text-orange-400">
                    ${tierFees.monthlyFeesOwed.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Fees This Month</p>
                  <p className="font-medium">${tierFees.totalFeesThisMonth.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Tier Progress */}
      {nextTierData && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Progress to {nextTierData.display_name || nextTierData.name || nextTier?.displayName || nextTier?.name}</h5>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedRequirements}/{requirements.length} completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${tierInfo?.progressToNext || (completedRequirements / requirements.length) * 100}%` 
              }}
            />
          </div>

          {/* Requirements */}
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                {req.completed ? (
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <IconCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <IconLock className="w-3 h-3 text-gray-400" />
                  </div>
                )}
                <div className="flex-1">
                  <span className={`text-sm ${req.completed ? 'text-green-600 dark:text-green-400' : ''}`}>
                    {req.text}
                  </span>
                  {req.progress && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{req.progress}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Amount to Next Tier */}
          {tierInfo?.amountToNext && tierInfo.amountToNext > 0 && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">${tierInfo.amountToNext.toLocaleString()}</span> more in monthly spending needed
            </div>
          )}

          {/* Next Tier Fee Comparison */}
          {nextTierData && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">
                Save with {nextTierData.display_name || nextTierData.name}:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {nextTierData.card_creation_fee < displayFees.cardCreationFee && (
                  <div className="text-green-600 dark:text-green-400">
                    ▼ Card Creation: ${nextTierData.card_creation_fee}
                  </div>
                )}
                {nextTierData.deposit_fee_percentage < displayFees.transactionFee && (
                  <div className="text-green-600 dark:text-green-400">
                    ▼ Deposit Fee: {nextTierData.deposit_fee_percentage}%
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Unlock Benefits */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-medium text-primary mb-1">Unlock with {nextTierData.display_name || nextTierData.name}:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {getTierBenefits(nextTierData)[0] || "Enhanced features and benefits"}
            </p>
          </div>
        </div>
      )}

      {/* Elite Tier - Already at highest */}
      {currentTier.level === 3 && !nextTier && (
        <div className="text-center py-4">
          <i className="las la-trophy text-4xl text-yellow-600 dark:text-yellow-400 mb-2"></i>
          <p className="text-sm font-medium">You've reached the highest tier!</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Enjoy all premium benefits
          </p>
        </div>
      )}
    </div>
  );
};

export default TierStatus;