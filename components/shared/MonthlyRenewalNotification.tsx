"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import Modal from "@/components/shared/Modal";

const MonthlyRenewalNotification = () => {
  const { upcomingRenewal, fetchUpcomingRenewal, monthlyFeeBreakdown, fetchMonthlyFeeBreakdown } = useUserStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Check if we should show the notification
  const shouldShowNotification = () => {
    if (isDismissed || !upcomingRenewal) return false;
    
    const today = new Date();
    const currentDay = today.getDate();
    
    // Show from 25th day of the month until renewal
    return currentDay >= 25 || upcomingRenewal.daysUntilRenewal <= 7;
  };

  // Fetch renewal data on component mount
  useEffect(() => {
    fetchUpcomingRenewal();
    fetchMonthlyFeeBreakdown();
  }, []);

  // Don't render if shouldn't show
  if (!shouldShowNotification()) {
    return null;
  }

  const renewalDate = new Date(upcomingRenewal!.nextRenewalDate).toLocaleDateString();
  const totalCards = upcomingRenewal!.activeCardsCount || 0;
  const totalFee = upcomingRenewal!.totalRenewalAmount || 0;

  return (
    <>
      {/* Monthly Renewal Notification Banner */}
      <div className="relative mb-6">
        <div className="bg-gradient-to-r from-blue-50 via-blue-50/50 to-blue-50 dark:from-blue-900/20 dark:via-blue-900/10 dark:to-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Dismiss banner"
            title="Dismiss until page reload"
          >
            <i className="las la-times text-xl"></i>
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                <i className="las la-calendar-check text-4xl text-blue-600"></i>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1 text-blue-900 dark:text-blue-100">Monthly Card Fees Due Soon</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                Your monthly card maintenance fees for {totalCards} active card{totalCards !== 1 ? 's' : ''} are due on {renewalDate}.
                {totalFee > 0 
                  ? ` Total amount: $${totalFee.toFixed(2)}` 
                  : ' No fees due this month.'}
              </p>
              
              {totalFee > 0 && (
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <p>
                    <strong>Automatic payment:</strong> Fees will be automatically deducted from your available balance.
                    If insufficient balance, cards may be temporarily suspended.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowDetailsModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Details
                <i className="las la-arrow-right text-base"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal 
        open={showDetailsModal} 
        toggleOpen={() => setShowDetailsModal(false)} 
        width="max-w-[500px] lg:top-24"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <h4 className="h4">Monthly Renewal Details</h4>
        </div>

        {upcomingRenewal && (
          <div className="space-y-6">
            {/* Renewal Overview */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h5 className="font-semibold mb-3">Renewal Overview</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Next Renewal Date:</span>
                  <span className="font-medium">{renewalDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Days Until Renewal:</span>
                  <span className="font-medium">{upcomingRenewal.daysUntilRenewal} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Cards:</span>
                  <span className="font-medium">{totalCards} card{totalCards !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            {monthlyFeeBreakdown && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h5 className="font-semibold mb-3 text-blue-900 dark:text-blue-100">Fee Breakdown</h5>
                <div className="space-y-2 text-sm">
                  {monthlyFeeBreakdown.cardBreakdown?.map((cardFee: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Card {cardFee.maskedPan || `#${index + 1}`}:
                      </span>
                      <span className="font-medium">${cardFee.monthlyFee?.toFixed(2) || '0.00'}</span>
                    </div>
                  ))}
                  
                  {/* Tier discount not available in current API
                  {monthlyFeeBreakdown.tierDiscount && monthlyFeeBreakdown.tierDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Tier Discount ({monthlyFeeBreakdown.tierName}):</span>
                      <span className="font-medium">-${monthlyFeeBreakdown.tierDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  */}
                  
                  <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800 font-semibold">
                    <span>Total Monthly Fee:</span>
                    <span>${totalFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h5 className="font-semibold mb-3 text-green-900 dark:text-green-100">Payment Process</h5>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-green-800 dark:text-green-200">Automatic Payment:</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Fees will be automatically deducted from your available balance on the renewal date.
                  </p>
                </div>
                
                {totalFee > 0 && (
                  <div>
                    <strong className="text-green-800 dark:text-green-200">Current Balance Status:</strong>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      You currently have sufficient balance to cover the ${totalFee.toFixed(2)} fee.
                    </p>
                  </div>
                )}
                
                <div>
                  <strong className="text-orange-800 dark:text-orange-200">If Insufficient Balance:</strong>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    If your balance is insufficient, your cards may be temporarily suspended until payment is made.
                    Add funds to your account before the renewal date to avoid service interruption.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-full font-medium transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default MonthlyRenewalNotification;