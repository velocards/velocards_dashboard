'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { IconMail, IconX } from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/lib/api/auth';

const EmailVerificationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const { user } = useAuthStore();

  // Don't show if user is verified or banner is dismissed
  if (!user || user.emailVerified || !isVisible) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await authApi.resendVerification(user.email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to send email');
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <IconMail className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
            Email Verification Required
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Please verify your email address to secure your account and access all features.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleResendEmail}
              disabled={isResending}
              className="text-sm bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700 disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend Email'}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;