import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export type RenewalNotificationState = 'upcoming' | 'processing' | 'completed' | 'insufficient' | 'hidden';

export interface UseRenewalNotificationReturn {
  bannerState: RenewalNotificationState;
  isVisible: boolean;
  shouldShow: boolean;
  daysUntilRenewal: number;
  isDismissed: boolean;
  dismiss: () => void;
  refreshRenewalData: () => void;
}

export const useRenewalNotification = (): UseRenewalNotificationReturn => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedUntil, setDismissedUntil] = useState<string | null>(null);
  const { upcomingRenewal, fetchUpcomingRenewal, isLoadingRenewal } = useUserStore();

  // Load dismissal state from localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('monthlyRenewalBanner_dismissedUntil');
    if (dismissed) {
      setDismissedUntil(dismissed);
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      setIsDismissed(now < dismissedDate);
    }
  }, []);

  // Calculate if banner should be shown based on date
  const shouldShow = (): boolean => {
    if (!upcomingRenewal || isLoadingRenewal || isDismissed) return false;

    const today = new Date();
    const dayOfMonth = today.getDate();
    
    // Show from 25th of current month until renewal completes
    return dayOfMonth >= 25;
  };

  // Calculate days until renewal
  const getDaysUntilRenewal = (): number => {
    if (!upcomingRenewal?.nextRenewalDate) return 0;
    
    const today = new Date();
    const renewalDate = new Date(upcomingRenewal.nextRenewalDate);
    const diffTime = renewalDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine notification state based on renewal data
  const getBannerState = (): RenewalNotificationState => {
    if (!upcomingRenewal || !shouldShow()) return 'hidden';

    const daysUntil = getDaysUntilRenewal();

    // If renewal is overdue, might be processing
    if (daysUntil < 0) {
      // Check if it's been more than 3 days overdue - might be completed
      return daysUntil < -3 ? 'completed' : 'processing';
    }

    // Check for insufficient balance
    if (!upcomingRenewal.sufficientBalance) {
      return 'insufficient';
    }

    // Regular upcoming renewal
    return 'upcoming';
  };

  // Dismiss notification until next renewal period
  const dismiss = () => {
    if (!upcomingRenewal) return;

    // Calculate next month's 25th as dismiss expiry
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(25);
    nextMonth.setHours(0, 0, 0, 0);

    const dismissUntil = nextMonth.toISOString();
    localStorage.setItem('monthlyRenewalBanner_dismissedUntil', dismissUntil);
    setDismissedUntil(dismissUntil);
    setIsDismissed(true);
  };

  // Refresh renewal data
  const refreshRenewalData = () => {
    fetchUpcomingRenewal();
  };

  const bannerState = getBannerState();
  const daysUntilRenewal = getDaysUntilRenewal();
  const isVisible = shouldShow() && bannerState !== 'hidden';

  return {
    bannerState,
    isVisible,
    shouldShow: shouldShow(),
    daysUntilRenewal,
    isDismissed,
    dismiss,
    refreshRenewalData,
  };
};