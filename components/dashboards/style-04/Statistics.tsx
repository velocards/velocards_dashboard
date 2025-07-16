"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import Select from "@/components/shared/Select";
import { useUserStore } from "@/stores/userStore";
import { useCardStore } from "@/stores/cardStore";
import AddCard from "@/components/cards/card-overview/AddCard";
import AddBalance from "@/components/shared/AddBalance";
import AvailableBalance from "@/components/shared/AvailableBalance";
import KycModal from "@/components/kyc/KycModal";
import { userApi } from "@/lib/api/user";
import { transactionApi } from "@/lib/api/transactions";


const Statistics = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isSpendingModalOpen, setIsSpendingModalOpen] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);
  
  // Get data from stores
  const { 
    profile, 
    balance, 
    userStatistics,
    spendingStats,
    fetchProfile, 
    fetchBalance,
    fetchUserStatistics,
    fetchSpendingStats
  } = useUserStore();
  const { cards, fetchCards } = useCardStore();
  
  // State for monthly spending data
  const [monthlySpendingData, setMonthlySpendingData] = useState([
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 }
  ]);
  
  // Fetch spending data using the spending stats API
  const fetchMonthlySpendingData = async () => {
    try {
      // Fetch yearly spending stats which should have monthly breakdown
      await fetchSpendingStats('yearly');
    } catch (error) {
      console.error('Failed to fetch spending stats:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchProfile();
    fetchBalance();
    fetchCards();
    fetchUserStatistics(); // Fetch comprehensive user statistics
    fetchMonthlySpendingData();
  }, []);
  
  // Calculate total card balance from active cards
  const totalCardBalance = cards
    .filter(card => card.status === 'active')
    .reduce((sum, card) => sum + (card.remainingBalance || card.balance || 0), 0);
  
  // Generate states data with real values
  const statesData = [
    {
      title: "Available Balance",
      amount: null, // Will use AvailableBalance component
      percent: 35.7,
      icon: <i className="las text-3xl xl:text-5xl la-wallet"></i>,
      color: "text-primary",
    },
    {
      title: "Active Card Balance",
      amount: `$${totalCardBalance.toFixed(2)}`,
      percent: 45.2,
      icon: <i className="las text-3xl xl:text-5xl la-credit-card"></i>,
      color: "text-secondary",
    },
    {
      title: "Yearly Spending",
      amount: `$${userStatistics?.currentYear?.totalSpending?.toFixed(2) || profile?.yearlySpending?.toFixed(2) || '0.00'}`,
      percent: 25.7,
      icon: <i className="las text-3xl xl:text-5xl la-calendar"></i>,
      color: "text-error",
    },
    {
      title: "Current Tier",
      amount: profile?.tier?.displayName || 'Loading...',
      percent: 50.7,
      icon: <i className="las text-3xl xl:text-5xl la-medal"></i>,
      color: "text-warning",
    },
  ];
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleCardModal = () => {
    const wasOpen = isCardModalOpen;
    setIsCardModalOpen(!isCardModalOpen);
    
    // If we're closing the modal, refresh cards in case a new card was created
    if (wasOpen) {
      fetchCards();
      fetchBalance();
    }
  };



  const toggleTierModal = () => {
    setIsTierModalOpen(!isTierModalOpen);
  };

  // Get tier display information based on user's tier level
  const getTierInfo = () => {
    const tierLevel = profile?.tier?.level || 0;
    
    const tiers: Record<number, any> = {
      0: {
        name: "Unverified",
        displayName: "Unverified",
        color: "gray",
        fees: { commission: "5%", cardCreation: "$50.00", cardMonthly: "N/A" },
        limits: { maxCards: 1, maxBalance: "$500 daily" },
        nextTier: {
          name: "Verified",
          color: "blue",
          fees: { commission: "4%", cardCreation: "$30.00", cardMonthly: "$15.00" },
          limits: { maxCards: "Unlimited", maxBalance: "No limits" },
          savings: { commission: "-1%", cardCreation: "-$20.00", cardMonthly: "Full access" },
          requirement: "Complete KYC verification"
        }
      },
      1: {
        name: "Verified",
        displayName: "Verified",
        color: "blue",
        fees: { commission: "4%", cardCreation: "$30.00", cardMonthly: "$15.00" },
        limits: { maxCards: "Unlimited", maxBalance: "No limits" },
        progress: { current: profile?.yearlySpending || 0, required: 100000 },
        nextTier: {
          name: "Premium",
          color: "purple",
          fees: { commission: "2.5%", cardCreation: "$20.00", cardMonthly: "$15.00" },
          limits: { maxCards: "Unlimited", maxBalance: "No limits" },
          savings: { commission: "-1.5%", cardCreation: "-$10.00", cardMonthly: "Same" },
          requirement: "$100k yearly spending"
        }
      },
      2: {
        name: "Premium",
        displayName: "Premium",
        color: "purple",
        fees: { commission: "2.5%", cardCreation: "$20.00", cardMonthly: "$15.00" },
        limits: { maxCards: "Unlimited", maxBalance: "No limits" },
        progress: { current: profile?.yearlySpending || 0, required: 500000 },
        nextTier: {
          name: "Elite",
          color: "gold",
          fees: { commission: "1%", cardCreation: "$10.00", cardMonthly: "$10.00" },
          limits: { maxCards: "Unlimited", maxBalance: "No limits" },
          savings: { commission: "-1.5%", cardCreation: "-$10.00", cardMonthly: "-$5.00" },
          requirement: "$500k yearly spending"
        }
      },
      3: {
        name: "Elite",
        displayName: "Elite",
        color: "gold",
        fees: { commission: "1%", cardCreation: "$10.00", cardMonthly: "$10.00" },
        limits: { maxCards: "Unlimited", maxBalance: "No limits" },
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
    <>
      {statesData.map(({ amount, icon, title }) => (
        <div key={title} className="col-span-12 xs:col-span-6 sm:col-span-6 lg:col-span-3 box p-3 sm:p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6">
          <div className="mb-3 sm:mb-4 lg:mb-6 pb-3 sm:pb-4 lg:pb-6 bb-dashed">
            <span className="font-medium text-sm sm:text-base">{title}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 xl:gap-6">
            <div className="w-12 sm:w-14 xl:w-[72px] h-12 sm:h-14 xl:h-[72px] flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">{icon}</div>
            <div>
              {title === "Available Balance" ? (
                <AvailableBalance 
                  variant="dashboard"
                  showAddButton={true}
                  onAddBalance={toggleModal}
                />
              ) : (
                <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-1 sm:mb-2 xxl:mb-4">{amount}</h4>
              )}
              {title === "Active Card Balance" && (
                <button 
                  onClick={toggleCardModal}
                  className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors shadow-sm"
                >
                  <i className="las la-plus text-sm"></i>
                  <span>Add New Card</span>
                </button>
              )}
              {title === "Current Tier" && (
                <button 
                  onClick={toggleTierModal}
                  className="flex items-center gap-1 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors"
                >
                  <i className="las la-arrow-up text-sm"></i>
                  <span>Upgrade Tier</span>
                </button>
              )}
              {title === "Yearly Spending" && (
                <button 
                  onClick={() => setIsSpendingModalOpen(true)}
                  className="flex items-center gap-1 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-colors"
                >
                  <i className="las la-chart-bar text-sm"></i>
                  <span>Analyse Spending</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Add Balance Modal - Use shared AddBalance component */}
      <AddBalance open={isModalOpen} toggleOpen={toggleModal} />

      {/* Add New Card Modal - Use proper AddCard component */}
      <AddCard open={isCardModalOpen} toggleOpen={toggleCardModal} />

      {/* Upgrade Tier Modal */}
      <Modal toggleOpen={toggleTierModal} open={isTierModalOpen} width="max-w-[720px]">
        <div className="p-4 lg:p-6">
          <h4 className="h4 mb-6">Tier Information</h4>
          
          {/* Tier Comparison Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Tier */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">{tierInfo.displayName} Tier</h5>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Current</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Commission:</span>
                  <span className="font-medium text-right">{tierInfo.fees.commission}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Card Creation:</span>
                  <span className="font-medium text-right">{tierInfo.fees.cardCreation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Fee:</span>
                  <span className="font-medium text-right">{tierInfo.fees.cardMonthly}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Max Cards:</span>
                  <span className="font-medium text-right">{tierInfo.limits.maxCards}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Max Balance:</span>
                  <span className="font-medium text-right">{tierInfo.limits.maxBalance}</span>
                </div>
              </div>
            </div>

            {/* Next Tier */}
            {!tierInfo.isMaxTier && tierInfo.nextTier ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-5 border-2 border-dashed border-yellow-300">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold">{tierInfo.nextTier.name} Tier</h5>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Next</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Commission:</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-green-600">{tierInfo.nextTier.fees.commission}</span>
                      <small className="text-green-500 whitespace-nowrap">{tierInfo.nextTier.savings.commission}</small>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Card Creation:</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-green-600">{tierInfo.nextTier.fees.cardCreation}</span>
                      <small className="text-green-500 whitespace-nowrap">{tierInfo.nextTier.savings.cardCreation}</small>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Card Renewal:</span>
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-green-600">{tierInfo.nextTier.fees.cardMonthly}</span>
                      <small className="text-green-500 whitespace-nowrap">{tierInfo.nextTier.savings.cardMonthly}</small>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Daily Limit:</span>
                    <span className="font-medium text-green-600">{tierInfo.nextTier.limits.maxCards === "Unlimited" ? "Unlimited" : tierInfo.nextTier.limits.maxCards}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Limit:</span>
                    <span className="font-medium text-green-600">{tierInfo.nextTier.limits.maxBalance}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4 border-2 border-yellow-300">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <i className="las la-crown text-5xl text-yellow-600 mb-3"></i>
                    <h5 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Maximum Tier Reached!</h5>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                      You've achieved the highest tier with the best rates and benefits.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {!tierInfo.isMaxTier && tierInfo.progress && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress to {tierInfo.nextTier?.name} Tier</span>
                <span>${tierInfo.progress.current.toLocaleString()} / ${tierInfo.progress.required.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full relative" style={{width: `${progressPercentage}%`}}>
                  <span className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full"></span>
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">${(tierInfo.progress.required - tierInfo.progress.current).toLocaleString()}</span> more in total spending to unlock {tierInfo.nextTier?.name} tier
              </div>
            </div>
          )}

          {/* Benefits Summary */}
          {!tierInfo.isMaxTier && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h6 className="font-semibold mb-2 text-green-800 dark:text-green-200">{tierInfo.nextTier?.name} Tier Benefits</h6>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                {profile?.tier?.level === 0 ? (
                  <>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Unlimited cards (vs 1 card limit)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>No daily spending limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Lower fees on all transactions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Priority customer support</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Save {tierInfo.nextTier?.savings.commission} on commission fees</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Save {tierInfo.nextTier?.savings.cardCreation} on card creation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Higher spending limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <i className="las la-check-circle"></i>
                      <span>Priority customer support</span>
                    </li>
                  </>
                )}
              </ul>
              {profile?.tier?.level === 0 && (
                <button
                  onClick={() => {
                    toggleTierModal();
                    setShowKycModal(true);
                  }}
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Start Verification Process
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Spending Analysis Modal */}
      <Modal toggleOpen={() => setIsSpendingModalOpen(!isSpendingModalOpen)} open={isSpendingModalOpen} width="max-w-[600px]">
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <h4 className="h4">Spending Analysis</h4>
        </div>
        
        <div className="space-y-6">
          {/* Current Year Overview */}
          {userStatistics?.currentYear && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-3">Current Year ({userStatistics.currentYear.year})</h5>
                
                {/* Spending Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400">Card Purchases</span>
                    <span className="font-semibold">${userStatistics.currentYear.cardSpending.completed.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Deposit Commissions</span>
                    <span className="font-semibold">${userStatistics.currentYear.fees.deposit.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Card Creation Fees</span>
                    <span className="font-semibold">${userStatistics.currentYear.fees.cardCreation.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Monthly Card Fees</span>
                    <span className="font-semibold">${userStatistics.currentYear.fees.cardMonthly.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 dark:border-gray-600 bg-primary/5 -mx-4 px-4 rounded-b-lg">
                    <span className="font-semibold text-lg">Total Spending</span>
                    <span className="font-bold text-xl text-primary">${userStatistics.currentYear.totalSpending.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Lifetime Comparison */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="text-lg font-semibold mb-3">Lifetime Overview</h5>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Card Spending</p>
                    <p className="text-xl font-bold">${userStatistics.lifetime.cardSpending.completed.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Fees Paid</p>
                    <p className="text-xl font-bold">${userStatistics.lifetime.fees.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fee Breakdown:</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• Deposit Fees</span>
                      <span>${userStatistics.lifetime.fees.deposit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• Card Creation</span>
                      <span>${userStatistics.lifetime.fees.cardCreation.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">• Monthly Fees</span>
                      <span>${userStatistics.lifetime.fees.cardMonthly.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Amounts */}
              {(userStatistics.currentYear.cardSpending.pending > 0 || userStatistics.currentYear.deposits.pending > 0) && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h5 className="text-sm font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Pending Amounts</h5>
                  {userStatistics.currentYear.cardSpending.pending > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Card Transactions</span>
                      <span className="font-medium">${userStatistics.currentYear.cardSpending.pending.toFixed(2)}</span>
                    </div>
                  )}
                  {userStatistics.currentYear.deposits.pending > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">Deposits</span>
                      <span className="font-medium">${userStatistics.currentYear.deposits.pending.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {!userStatistics && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading spending analysis...</p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* KYC Modal */}
      <KycModal 
        isOpen={showKycModal} 
        onClose={() => setShowKycModal(false)} 
      />
    </>
  );
};

export default Statistics;