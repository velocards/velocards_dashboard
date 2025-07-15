"use client";
import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import { useUserStore } from "@/stores/userStore";
import { useCryptoStore } from "@/stores/cryptoStore";
import { apiClient } from "@/lib/api/client";
import { toast } from "react-toastify";

type ModalProps = {
  toggleOpen: () => void;
  open: boolean;
};

const AddBalance = ({ toggleOpen, open }: ModalProps) => {
  const [amount, setAmount] = useState("");
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [feePercentage, setFeePercentage] = useState<number | null>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [paymentCreated, setPaymentCreated] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    orderReference: string;
    paymentUrl: string;
  } | null>(null);
  
  // Get user profile from userStore
  const { profile, fetchBalance } = useUserStore();
  
  // Get crypto store functions
  const { createDepositOrder, isLoading: isCreatingOrder, fetchDeposits } = useCryptoStore();
  
  // Calculate fees when amount changes
  useEffect(() => {
    const calculateFees = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setCalculatedFee(null);
        return;
      }
      
      setIsCalculatingFee(true);
      try {
        const { data } = await apiClient.post('/tiers/calculate-fees', {
          action: 'deposit',
          amount: parseFloat(amount)
        });
        
        setCalculatedFee(data.data.calculatedFee);
        // Calculate percentage from the fee
        const percentage = (data.data.calculatedFee / parseFloat(amount)) * 100;
        setFeePercentage(percentage);
      } catch (error) {
        setCalculatedFee(null);
        setFeePercentage(null);
      } finally {
        setIsCalculatingFee(false);
      }
    };
    
    // Debounce the calculation
    const timer = setTimeout(calculateFees, 500);
    return () => clearTimeout(timer);
  }, [amount]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setAmount("");
      setCalculatedFee(null);
      setFeePercentage(null);
      setPaymentCreated(false);
      setPaymentDetails(null);
    }
  }, [open]);

  const handleAddBalance = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (parseFloat(amount) < 10) {
      toast.error("Minimum deposit amount is $10");
      return;
    }

    // Check maximum deposit amount (platform limit)
    if (parseFloat(amount) > 100000) {
      toast.error("Maximum deposit amount is $100,000. Please contact support for larger deposits.");
      return;
    }

    // Already handled by isCreatingOrder state from cryptoStore
    if (isCreatingOrder) {
      return;
    }

    try {
      // Create deposit order with xMoney (USD only)
      const response = await createDepositOrder(parseFloat(amount));
      
      // Handle xMoney payment page
      if (response.paymentUrl) {
        // Mark payment as created and store details
        setPaymentCreated(true);
        setPaymentDetails({
          orderReference: (response as any).order?.order_reference || (response as any).order?.orderId || 'N/A',
          paymentUrl: response.paymentUrl
        });
        
        // Try to open in new window with better parameters
        try {
          const paymentWindow = window.open(
            response.paymentUrl, 
            '_blank',
            'noopener,noreferrer,width=1200,height=800'
          );
          
          if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed == 'undefined') {
            // Popup was blocked - user will use the manual options in the modal
          }
        } catch (e) {
          // Failed to open payment window - user will use the manual options in the modal
        }
        
        // Refresh balance after a delay
        setTimeout(() => {
          fetchBalance();
          fetchDeposits(); // Also refresh deposit history
        }, 10000); // 10 seconds
      } else {
        // No payment URL returned
        toast.error('Payment URL not received. Please try again or contact support.');
      }
    } catch (error: any) {
      
      // Handle network errors
      if (!error.response) {
        toast.error('Network error. Please check your internet connection and try again.');
        return;
      }
      
      // Handle specific error codes
      const errorCode = error.response?.data?.error?.code;
      const errorMessage = error.response?.data?.error?.message;
      
      switch (errorCode) {
        case 'INSUFFICIENT_BALANCE':
          // This shouldn't happen for deposits, but handle it anyway
          toast.error('Unable to process deposit at this time.');
          break;
        case 'TIER_RESTRICTION':
          toast.error('Your account tier restricts this deposit amount. Please contact support.');
          break;
        case 'VALIDATION_ERROR':
          toast.error(errorMessage || 'Invalid deposit amount. Please check and try again.');
          break;
        case 'RATE_LIMIT_EXCEEDED':
          toast.error('Too many deposit attempts. Please wait a few minutes and try again.');
          break;
        case 'SERVICE_UNAVAILABLE':
          toast.error('Payment service is temporarily unavailable. Please try again later.');
          break;
        default:
          toast.error(errorMessage || 'Failed to create deposit order. Please try again later.');
      }
    }
  };

  return (
    <Modal toggleOpen={toggleOpen} open={open} width="max-w-[496px] lg:top-24">
      <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
        <h4 className="h4">Add Balance</h4>
      </div>
      
      {!paymentCreated && (
        <form>
          <div className="mt-6 xl:mt-8 grid grid-cols-2 gap-4 xxxl:gap-6">
          {/* Amount Input */}
          <div className="col-span-2">
            <label htmlFor="amount-shared" className="md:text-lg font-medium block mb-4">Amount in USD</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min $10)"
              className="w-full text-sm bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3"
              id="amount-shared"
              min="10"
              step="0.01"
              required
            />
          </div>

          {/* Currency Display (USD Only) */}
          <div className="col-span-2">
            <label className="md:text-lg font-medium block mb-4">Currency</label>
            <div className="bg-secondary/5 dark:bg-bg3 border border-n30 dark:border-n500 rounded-3xl px-6 py-2.5 md:py-3 flex items-center justify-between opacity-75">
              <div className="flex items-center gap-3">
                <i className="las la-dollar-sign text-lg text-primary"></i>
                <span className="font-medium">USD (US Dollar)</span>
              </div>
              <span className="text-sm text-gray-500">Platform Currency</span>
            </div>
            {/* Calculation Display */}
            {amount && parseFloat(amount) > 0 && (
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {isCalculatingFee ? "Calculating fee..." : feePercentage !== null ? `Commission (${feePercentage.toFixed(1)}%):` : "Deposit Fee:"}
                  </span>
                  <span className="font-medium text-red-600">
                    {isCalculatingFee ? (
                      <i className="las la-spinner la-spin"></i>
                    ) : calculatedFee !== null ? (
                      `-$${calculatedFee.toFixed(2)}`
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount Added to Balance:</span>
                  <span className="font-bold text-lg text-green-600">
                    ${calculatedFee !== null 
                      ? (parseFloat(amount) - calculatedFee).toFixed(2)
                      : parseFloat(amount).toFixed(2)
                    }
                  </span>
                </div>
              </div>
            )}
            
            {/* Commission Info */}
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <i className="las la-info-circle text-amber-600 text-lg mt-0.5"></i>
                <div className="text-sm">
                  <p className="text-amber-800 dark:text-amber-200 font-medium">Commission Notice</p>
                  <p className="text-amber-700 dark:text-amber-300">
                    {profile?.tier?.name ? (
                      <>
                        As a <span className="font-semibold">{profile.tier.displayName}</span> member, you pay {feePercentage !== null ? `${feePercentage.toFixed(1)}%` : 'tier-based'} deposit fees. 
                        {profile.tier.level === 0 && " Complete KYC verification to reduce fees."}
                        <br className="mt-1" />
                        <span className="text-xs">You'll select your crypto payment method (BTC, ETH, USDT, USDC) on the next page.</span>
                      </>
                    ) : (
                      <>
                        Deposit fees are calculated based on your account tier.
                        <br className="mt-1" />
                        <span className="text-xs">You'll select your crypto payment method on the next page.</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Make Payment Button */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleAddBalance();
              }}
              disabled={!amount || parseFloat(amount) <= 0 || isCreatingOrder || isCalculatingFee || paymentCreated}
              className="w-full bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-full font-medium transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingOrder ? (
                <>
                  <i className="las la-spinner la-spin mr-2"></i>
                  Creating Order...
                </>
              ) : paymentCreated ? (
                <>
                  <i className="las la-check-circle mr-2"></i>
                  Payment Created - Complete on Payment Page
                </>
              ) : (
                "Make Payment"
              )}
            </button>
          </div>
        </div>
        </form>
      )}
      
      {/* Order Summary - Show when payment is created */}
      {paymentCreated && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Amount:</span>
              <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
            </div>
            {calculatedFee !== null && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Commission Fee:</span>
                <span className="font-medium text-red-600">-${calculatedFee.toFixed(2)}</span>
              </div>
            )}
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex justify-between">
              <span className="font-medium">Amount Added to Balance:</span>
              <span className="font-bold text-green-600">
                ${calculatedFee !== null 
                  ? (parseFloat(amount) - calculatedFee).toFixed(2)
                  : parseFloat(amount).toFixed(2)
                }
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Details Section - Show after payment is created */}
      {paymentCreated && paymentDetails && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <i className="las la-check-circle text-2xl text-green-600 dark:text-green-400"></i>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                Deposit Order Created Successfully!
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                Order Reference: <span className="font-mono font-medium">{paymentDetails.orderReference}</span>
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                Complete your payment on the xMoney payment page to add funds to your balance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    window.open(paymentDetails.paymentUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <i className="las la-external-link-alt"></i>
                  Open Payment Page
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentDetails.paymentUrl);
                    toast.success('Payment URL copied to clipboard!');
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-100 rounded-lg font-medium text-sm transition-colors"
                >
                  <i className="las la-copy"></i>
                  Copy Payment URL
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400">
                  <i className="las la-info-circle"></i> Your balance will be updated automatically after the payment is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddBalance;