'use client';

import { useState } from 'react';
import { cardApi } from '@/lib/api/cards';
import { toast } from 'react-toastify';
import { IconEye, IconEyeOff, IconCopy, IconShieldLock } from '@tabler/icons-react';

interface SecureCardDetailsProps {
  cardId: string;
  field: 'pan' | 'cvv';
  className?: string;
  buttonText?: string;
  maskedValue?: string;
}

export default function SecureCardDetails({ 
  cardId, 
  field, 
  className = '',
  buttonText = field === 'pan' ? 'View Card Number' : 'View CVV',
  maskedValue = field === 'pan' ? '•••• •••• •••• ••••' : '•••'
}: SecureCardDetailsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const handleViewDetails = async () => {
    if (isVisible) {
      // Hide the value
      setIsVisible(false);
      setValue('');
      return;
    }

    setIsLoading(true);
    try {
      // Create secure session if we don't have one
      if (!sessionId || !token) {
        const sessionResponse = await cardApi.createCardSession(cardId, field === 'pan' ? 'view_pan' : 'view_cvv');
        setSessionId(sessionResponse.data.sessionId);
        setToken(sessionResponse.data.token);
        
        // Get the secure detail
        const detailResponse = await cardApi.getSecureCardDetail(
          sessionResponse.data.sessionId,
          sessionResponse.data.token,
          field
        );
        setValue(detailResponse.data[field]);
      } else {
        // Use existing session
        const detailResponse = await cardApi.getSecureCardDetail(sessionId, token, field);
        setValue(detailResponse.data[field]);
      }
      
      setIsVisible(true);
      
      // Auto-hide after 30 seconds for security
      setTimeout(() => {
        setIsVisible(false);
        setValue('');
      }, 30000);
      
    } catch (error: any) {
      // Failed to get secure details
      toast.error(error.response?.data?.error?.message || 'Failed to retrieve secure details');
      
      // Clear session on error
      setSessionId('');
      setToken('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.success(`${field === 'pan' ? 'Card number' : 'CVV'} copied to clipboard`);
      
      // Hide value after copying for security
      setTimeout(() => {
        setIsVisible(false);
        setValue('');
      }, 2000);
    }
  };

  const formatCardNumber = (pan: string) => {
    // Format as: 1234 5678 9012 3456
    return pan.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className={`secure-card-details ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {field === 'pan' ? 'Card Number' : 'CVV'}
          </div>
          <div className="font-mono text-lg">
            {isVisible && value ? (
              field === 'pan' ? formatCardNumber(value) : value
            ) : (
              maskedValue
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isVisible && value && (
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Copy to clipboard"
            >
              <IconCopy size={18} />
            </button>
          )}
          
          <button
            onClick={handleViewDetails}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : isVisible ? (
              <IconEyeOff size={18} />
            ) : (
              <IconEye size={18} />
            )}
            <span className="text-sm">
              {isLoading ? 'Loading...' : isVisible ? 'Hide' : buttonText}
            </span>
          </button>
        </div>
      </div>
      
      {isVisible && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
          <IconShieldLock size={14} />
          <span>This information will be hidden automatically in 30 seconds for your security</span>
        </div>
      )}
    </div>
  );
}