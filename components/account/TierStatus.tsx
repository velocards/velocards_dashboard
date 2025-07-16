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
  const [isLoadingTier, setIsLoadingTier] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchTierInfo();
    fetchTierFees();
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

  // Get current tier from profile or tierInfo
  const currentTier = tierInfo?.current || profile?.tier;
  const nextTier = tierInfo?.nextTier;
  
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
    if (!nextTier) return [];
    
    const requirements = [];
    
    // Email verification requirement
    if (nextTier.level === 1) {
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
    if (nextTier.minSpending > 0) {
      const monthlySpending = profile?.monthlySpending || 0;
      requirements.push({
        text: `Spend $${nextTier.minSpending.toLocaleString()}+ monthly`,
        completed: monthlySpending >= nextTier.minSpending
      });
    }
    
    // Account age requirements (this would need to come from API)
    if (nextTier.level === 2) {
      requirements.push({
        text: "Maintain account for 30 days",
        completed: false // This should come from API
      });
    } else if (nextTier.level === 3) {
      requirements.push({
        text: "Maintain account for 90 days",
        completed: false // This should come from API
      });
    }
    
    return requirements;
  };

  const currentTierColor = currentTier ? getTierColor(currentTier.level) : "gray";
  const requirements = getRequirements();
  const completedRequirements = requirements.filter(r => r.completed).length;

  // Get default tier data based on level
  const getDefaultTierData = (level: number) => {
    switch (level) {
      case 0:
        return {
          benefits: [
            "1 active card maximum",
            "Basic features",
            "$500 monthly limit",
            "3% deposit fee"
          ],
          cardLimits: {
            maxActiveCards: 1,
            maxTotalBalance: 500
          },
          fees: {
            cardCreationFee: 5,
            transactionFee: 3
          }
        };
      case 1:
        return {
          benefits: [
            "Unlimited active cards",
            "Priority support",
            "$10,000 monthly limit",
            "2.5% deposit fee"
          ],
          cardLimits: {
            maxActiveCards: null,
            maxTotalBalance: 10000
          },
          fees: {
            cardCreationFee: 3,
            transactionFee: 2.5
          }
        };
      case 2:
        return {
          benefits: [
            "All Verified benefits",
            "Reduced card creation fees",
            "$50,000 monthly limit",
            "2% deposit fee"
          ],
          cardLimits: {
            maxActiveCards: null,
            maxTotalBalance: 50000
          },
          fees: {
            cardCreationFee: 2,
            transactionFee: 2
          }
        };
      case 3:
        return {
          benefits: [
            "All Premium benefits",
            "Lowest fees",
            "Unlimited monthly limit",
            "1.5% deposit fee",
            "Dedicated account manager"
          ],
          cardLimits: {
            maxActiveCards: null,
            maxTotalBalance: null
          },
          fees: {
            cardCreationFee: 1,
            transactionFee: 1.5
          }
        };
      default:
        return {
          benefits: [],
          cardLimits: {},
          fees: {}
        };
    }
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

  // Merge API data with defaults
  const defaultData = getDefaultTierData(currentTier.level || 0);
  const tierBenefits = currentTier.benefits?.length > 0 ? currentTier.benefits : defaultData.benefits;
  const tierCardLimits = currentTier.cardLimits || defaultData.cardLimits;
  
  // Use API tier fees if available, otherwise fall back to current tier fees or defaults
  const displayFees = tierFees?.fees ? {
    cardCreationFee: tierFees.fees.cardCreation,
    transactionFee: tierFees.fees.depositPercentage,
    monthlyFee: tierFees.fees.cardMonthly,
    withdrawalFee: tierFees.fees.withdrawalPercentage
  } : currentTier.fees || defaultData.fees;

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
          <h4 className="text-xl font-bold">{currentTier.displayName || currentTier.name}</h4>
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
        
        {currentTier.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{currentTier.description}</p>
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
              <p className="font-medium">{tierCardLimits.maxActiveCards || 'Unlimited'}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Monthly Limit</p>
              <p className="font-medium">
                {tierCardLimits.maxTotalBalance 
                  ? `$${tierCardLimits.maxTotalBalance.toLocaleString()}` 
                  : 'Unlimited'}
              </p>
            </div>
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
            {displayFees.withdrawalFee !== undefined && (
              <div>
                <p className="text-gray-600 dark:text-gray-400">Withdrawal Fee</p>
                <p className="font-medium">{displayFees.withdrawalFee}%</p>
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
      {nextTier && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Progress to {nextTier.displayName || nextTier.name}</h5>
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
                <span className={`text-sm ${req.completed ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>

          {/* Amount to Next Tier */}
          {tierInfo?.amountToNext > 0 && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">${tierInfo.amountToNext.toLocaleString()}</span> more in monthly spending needed
            </div>
          )}

          {/* Next Tier Fee Comparison */}
          {nextTier.fees && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-300 mb-2">
                Save with {nextTier.displayName || nextTier.name}:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {nextTier.fees.cardCreationFee < displayFees.cardCreationFee && (
                  <div className="text-green-600 dark:text-green-400">
                    ▼ Card Creation: ${nextTier.fees.cardCreationFee}
                  </div>
                )}
                {nextTier.fees.transactionFee < displayFees.transactionFee && (
                  <div className="text-green-600 dark:text-green-400">
                    ▼ Deposit Fee: {nextTier.fees.transactionFee}%
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Unlock Benefits */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-xs font-medium text-primary mb-1">Unlock with {nextTier.displayName || nextTier.name}:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {nextTier.benefits?.[0] || 
                (nextTier.level === 1 ? "Unlimited active cards and priority support" :
                 nextTier.level === 2 ? "Reduced fees and higher limits" :
                 nextTier.level === 3 ? "Lowest fees and dedicated account manager" :
                 "Enhanced features and benefits")}
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