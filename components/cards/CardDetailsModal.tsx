"use client";
import React, { useState, useEffect } from 'react';
import Modal from '@/components/shared/Modal';
import { cardApi } from '@/lib/api/cards';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface CardDetailsModalProps {
  open: boolean;
  toggleOpen: () => void;
  cardId: string;
  maskedPan: string;
  nickname?: string;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ 
  open, 
  toggleOpen, 
  cardId, 
  maskedPan,
  nickname 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [fullCardDetails, setFullCardDetails] = useState<any>(null);
  const [remainingTime, setRemainingTime] = useState(30);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setShowDetails(false);
      setFullCardDetails(null);
      setRemainingTime(30);
      setCopiedField(null);
    }
  }, [open]);

  // Auto-hide timer
  useEffect(() => {
    if (showDetails && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (remainingTime === 0) {
      handleHideDetails();
    }
  }, [showDetails, remainingTime]);

  const handleRevealDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await cardApi.getFullCardDetails(cardId);
      setFullCardDetails(data.cardDetails);
      setShowDetails(true);
      setRemainingTime(30);
    } catch (error: any) {
      console.error('Failed to fetch card details:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to fetch card details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHideDetails = () => {
    setShowDetails(false);
    setFullCardDetails(null);
    setRemainingTime(30);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatCardNumber = (pan: string) => {
    return pan.replace(/(.{4})/g, '$1 ').trim();
  };

  const detectCardType = (pan: string) => {
    const firstDigit = pan.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (['5', '2'].includes(firstDigit)) return 'mastercard';
    return 'unknown';
  };

  return (
    <Modal 
      toggleOpen={toggleOpen} 
      open={open} 
      width="max-w-[500px] lg:top-24"
    >
      <div>
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <h4 className="h4">Secure Card Details</h4>
        </div>

        {/* Security Notice */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <div className="flex items-start gap-3">
            <i className="las la-shield-alt text-yellow-600 text-xl mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Security Notice
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Card details will be displayed for 30 seconds only for security reasons. 
                Never share these details over email or unsecured channels.
              </p>
            </div>
          </div>
        </div>

        {/* Card Visual Preview */}
        <div className="mb-6">
          <div className="relative overflow-hidden rounded-xl h-48 bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white">
            <div className="absolute top-4 right-4 brightness-0 invert">
              <Image 
                src={maskedPan.startsWith('4') ? "/images/visa-sm.png" : "/images/mastercard.png"} 
                width={maskedPan.startsWith('4') ? 50 : 40} 
                height={maskedPan.startsWith('4') ? 18 : 40} 
                alt="card brand" 
              />
            </div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-lg font-mono mb-3">
                {showDetails && fullCardDetails ? formatCardNumber(fullCardDetails.pan) : maskedPan}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-70">Cardholder</p>
                  <p className="text-sm">
                    {showDetails && fullCardDetails ? fullCardDetails.holderName : '••• •••'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Expires</p>
                  <p className="text-sm font-mono">
                    {showDetails && fullCardDetails 
                      ? `${fullCardDetails.expiryMonth.padStart(2, '0')}/${fullCardDetails.expiryYear.slice(-2)}`
                      : '••/••'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {!showDetails ? (
          // Initial state - Show reveal button
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Click below to reveal your full card details. Make sure you're in a secure environment.
            </p>
            <button
              onClick={handleRevealDetails}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <i className="las la-spinner la-spin"></i>
                  Loading...
                </>
              ) : (
                <>
                  <i className="las la-eye"></i>
                  Reveal Card Details
                </>
              )}
            </button>
          </div>
        ) : (
          // Details revealed state
          <div>
            {/* Timer */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-full text-sm">
                <i className="las la-clock"></i>
                Auto-hide in {remainingTime}s
              </div>
            </div>

            {/* Card Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Card Number</label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-lg">{formatCardNumber(fullCardDetails.pan)}</p>
                  <button
                    onClick={() => copyToClipboard(fullCardDetails.pan, 'Card number')}
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    <i className={`las ${copiedField === 'Card number' ? 'la-check text-green-600' : 'la-copy'}`}></i>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">CVV</label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg">{fullCardDetails.cvv}</p>
                    <button
                      onClick={() => copyToClipboard(fullCardDetails.cvv, 'CVV')}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <i className={`las ${copiedField === 'CVV' ? 'la-check text-green-600' : 'la-copy'}`}></i>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Expiry Date</label>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-lg">
                      {fullCardDetails.expiryMonth.padStart(2, '0')}/{fullCardDetails.expiryYear}
                    </p>
                    <button
                      onClick={() => copyToClipboard(`${fullCardDetails.expiryMonth.padStart(2, '0')}/${fullCardDetails.expiryYear}`, 'Expiry')}
                      className="text-gray-500 hover:text-primary transition-colors"
                    >
                      <i className={`las ${copiedField === 'Expiry' ? 'la-check text-green-600' : 'la-copy'}`}></i>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Cardholder Name</label>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{fullCardDetails.holderName}</p>
                  <button
                    onClick={() => copyToClipboard(fullCardDetails.holderName, 'Name')}
                    className="text-gray-500 hover:text-primary transition-colors"
                  >
                    <i className={`las ${copiedField === 'Name' ? 'la-check text-green-600' : 'la-copy'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleHideDetails}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg transition-colors font-medium"
              >
                Hide Details
              </button>
              <button
                onClick={toggleOpen}
                className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
            </div>

            {/* Security Reminder */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <i className="las la-info-circle"></i> Remember to keep these details secure and never share them via email or chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CardDetailsModal;