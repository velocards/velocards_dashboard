"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";

interface AvailableBalanceProps {
  variant?: 'topbar' | 'dashboard' | 'inline';
  showLabel?: boolean;
  showAddButton?: boolean;
  showBreakdown?: boolean;
  showDebug?: boolean;
  onAddBalance?: () => void;
  className?: string;
}

const AvailableBalance = ({ 
  variant = 'inline', 
  showLabel = true, 
  showAddButton = false,
  showBreakdown = true,
  showDebug = false,
  onAddBalance,
  className = ""
}: AvailableBalanceProps) => {
  // Get balance and available balance from userStore
  const { 
    balance, 
    availableBalance: availableBalanceData,
    fetchBalance, 
    fetchAvailableBalance,
    isLoadingBalance, 
    isLoadingAvailableBalance,
    balanceError 
  } = useUserStore();
  
  // Fetch balance on component mount
  // Note: fetchBalance() automatically calls fetchAvailableBalance(), so we only need to call fetchBalance()
  useEffect(() => {
    fetchBalance();
  }, []);
  
  // Use the backend-calculated available balance
  const availableBalance = availableBalanceData?.availableBalance || 0;
  const accountBalance = availableBalanceData?.accountBalance || balance?.virtualBalance || 0;
  const activeCardsBalance = availableBalanceData?.activeCardsBalance || 0;
  const pendingDeposits = availableBalanceData?.pendingDeposits || 0;
  
  // Show loading only if both are loading or if we don't have any data yet
  const isLoading = (isLoadingBalance || isLoadingAvailableBalance) && !availableBalanceData;
  
  // Debug mode - show raw API response
  if (showDebug && availableBalanceData) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg ${className}`}>
        <h3 className="font-bold mb-2 text-sm">Available Balance API Response:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(availableBalanceData, null, 2)}
        </pre>
        <div className="mt-2 space-y-1 text-sm">
          <div>Account Balance: ${availableBalanceData.accountBalance || 0}</div>
          <div>- Active Cards: ${availableBalanceData.activeCardsBalance || 0}</div>
          <div className="font-bold">= Available: ${availableBalanceData.availableBalance || 0}</div>
          {availableBalanceData.pendingDeposits > 0 && (
            <div className="text-yellow-600">Pending: ${availableBalanceData.pendingDeposits}</div>
          )}
        </div>
      </div>
    );
  }
  
  // Topbar variant - compact with icon
  if (variant === 'topbar') {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        {/* Balance Label - Hidden on very small screens */}
        {showLabel && (
          <span className="hidden sm:block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            Available:
          </span>
        )}
        
        {/* Balance Display with Tooltip */}
        <div className="relative group">
          <div className="flex items-center gap-1 bg-primary/5 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 cursor-help">
            <span className="text-primary text-sm sm:text-base">
              <i className="las la-dollar-sign"></i>
            </span>
            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
              {isLoading ? (
                <span className="text-gray-500">...</span>
              ) : balanceError ? (
                <span className="text-red-500">Error</span>
              ) : (
                availableBalance.toFixed(2)
              )}
            </span>
          </div>
          
          {/* Tooltip - Hidden by default, shown on hover */}
          {showBreakdown && !isLoading && !balanceError && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[240px]">
                {/* Arrow */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white dark:border-b-gray-800"></div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Account Balance:</span>
                    <span className="font-medium">${accountBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Locked in Cards:</span>
                    <span className="font-medium text-red-600">-${activeCardsBalance.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Available:</span>
                    <span className="text-green-600">${availableBalance.toFixed(2)}</span>
                  </div>
                  {pendingDeposits > 0 && (
                    <div className="flex justify-between text-xs pt-1">
                      <span className="text-gray-500">Pending Deposits:</span>
                      <span className="text-yellow-600">${pendingDeposits.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Add Balance Button - Icon only on mobile, full on desktop */}
        {showAddButton && onAddBalance && (
          <button 
            onClick={onAddBalance}
            className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm"
          >
            <i className="las la-plus text-sm sm:text-base"></i>
            <span className="hidden sm:inline">Add Balance</span>
          </button>
        )}
      </div>
    );
  }
  
  // Dashboard variant - larger display
  if (variant === 'dashboard') {
    return (
      <div className={className}>
        <h4 className="h4 mb-2 xxl:mb-4">
          ${isLoading ? '...' : availableBalance.toFixed(2)}
        </h4>
        {showAddButton && onAddBalance && (
          <button 
            onClick={onAddBalance}
            className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm"
          >
            <i className="las la-plus text-sm"></i>
            <span>Add Balance</span>
          </button>
        )}
      </div>
    );
  }
  
  // Inline variant - simple text display
  return (
    <span className={`font-medium ${className}`}>
      {isLoading ? (
        <span className="text-gray-500">Loading...</span>
      ) : balanceError ? (
        <span className="text-red-500">Error</span>
      ) : (
        `$${availableBalance.toFixed(2)}`
      )}
    </span>
  );
};

// Export both the component and the calculation logic
export const useAvailableBalance = () => {
  const { availableBalance: availableBalanceData } = useUserStore();
  
  return {
    availableBalance: availableBalanceData?.availableBalance || 0,
    accountBalance: availableBalanceData?.accountBalance || 0,
    activeCardsBalance: availableBalanceData?.activeCardsBalance || 0,
    pendingDeposits: availableBalanceData?.pendingDeposits || 0,
    tierInfo: availableBalanceData?.tierInfo || null
  };
};

export default AvailableBalance;