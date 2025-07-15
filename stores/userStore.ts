import { create } from 'zustand';
import { userApi, UserProfile, UserBalance, UserSettings, AvailableBalance, UpcomingRenewal, MonthlyFeeBreakdown } from '@/lib/api/user';
import { UserStatistics, SpendingStatistics } from '@/types/statistics';
import { getErrorMessage } from '@/lib/api/client';

interface UserState {
  // Profile data
  profile: UserProfile | null;
  balance: UserBalance | null;
  availableBalance: AvailableBalance | null;
  upcomingRenewal: UpcomingRenewal | null;
  monthlyFeeBreakdown: MonthlyFeeBreakdown | null;
  settings: UserSettings | null;
  userStatistics: UserStatistics | null;
  spendingStats: SpendingStatistics | null;
  
  // Loading states
  isLoadingProfile: boolean;
  isLoadingBalance: boolean;
  isLoadingAvailableBalance: boolean;
  isLoadingSettings: boolean;
  isLoadingRenewal: boolean;
  isLoadingStatistics: boolean;
  isLoadingSpendingStats: boolean;
  
  // Error states
  profileError: string | null;
  balanceError: string | null;
  settingsError: string | null;
  renewalError: string | null;
  statisticsError: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchAvailableBalance: () => Promise<void>;
  fetchUpcomingRenewal: () => Promise<void>;
  fetchMonthlyFeeBreakdown: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchUserStatistics: () => Promise<void>;
  fetchSpendingStats: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
  updateSettings: (data: Partial<UserSettings>) => Promise<void>;
  refreshAll: () => Promise<void>;
  clearErrors: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  profile: null,
  balance: null,
  availableBalance: null,
  upcomingRenewal: null,
  monthlyFeeBreakdown: null,
  settings: null,
  userStatistics: null,
  spendingStats: null,
  
  isLoadingProfile: false,
  isLoadingBalance: false,
  isLoadingAvailableBalance: false,
  isLoadingSettings: false,
  isLoadingRenewal: false,
  isLoadingStatistics: false,
  isLoadingSpendingStats: false,
  
  profileError: null,
  balanceError: null,
  settingsError: null,
  renewalError: null,
  statisticsError: null,
  
  // Fetch user profile
  fetchProfile: async () => {
    set({ isLoadingProfile: true, profileError: null });
    
    try {
      const { data } = await userApi.getProfile();
      set({ 
        profile: data, 
        isLoadingProfile: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        profileError: errorMessage,
        isLoadingProfile: false 
      });
    }
  },
  
  // Fetch user balance
  fetchBalance: async () => {
    set({ isLoadingBalance: true, balanceError: null });
    
    try {
      const { data } = await userApi.getBalance();
      set({ 
        balance: data, 
        isLoadingBalance: false 
      });
      // Also fetch available balance when fetching regular balance
      get().fetchAvailableBalance();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        balanceError: errorMessage,
        isLoadingBalance: false 
      });
    }
  },
  
  // Fetch available balance
  fetchAvailableBalance: async () => {
    set({ isLoadingAvailableBalance: true });
    
    try {
      const { data } = await userApi.getAvailableBalance();
      set({ 
        availableBalance: data, 
        isLoadingAvailableBalance: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        isLoadingAvailableBalance: false 
      });
    }
  },
  
  // Fetch upcoming renewal information
  fetchUpcomingRenewal: async () => {
    set({ isLoadingRenewal: true, renewalError: null });
    
    try {
      const { data } = await userApi.getUpcomingRenewal();
      set({ 
        upcomingRenewal: data, 
        isLoadingRenewal: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        renewalError: errorMessage,
        isLoadingRenewal: false 
      });
    }
  },
  
  // Fetch monthly fee breakdown
  fetchMonthlyFeeBreakdown: async () => {
    set({ isLoadingRenewal: true });
    
    try {
      const { data } = await userApi.getMonthlyFeeBreakdown();
      set({ 
        monthlyFeeBreakdown: data, 
        isLoadingRenewal: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        isLoadingRenewal: false 
      });
    }
  },
  
  // Fetch user settings
  fetchSettings: async () => {
    set({ isLoadingSettings: true, settingsError: null });
    
    try {
      const { data } = await userApi.getSettings();
      set({ 
        settings: data, 
        isLoadingSettings: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        settingsError: errorMessage,
        isLoadingSettings: false 
      });
    }
  },
  
  // Update user profile
  updateProfile: async (data) => {
    set({ isLoadingProfile: true, profileError: null });
    
    try {
      const { data: updatedProfile } = await userApi.updateProfile(data);
      set({ 
        profile: updatedProfile, 
        isLoadingProfile: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        profileError: errorMessage,
        isLoadingProfile: false 
      });
      throw error;
    }
  },
  
  // Update user settings
  updateSettings: async (data) => {
    set({ isLoadingSettings: true, settingsError: null });
    
    try {
      const { data: updatedSettings } = await userApi.updateSettings(data);
      set({ 
        settings: updatedSettings, 
        isLoadingSettings: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        settingsError: errorMessage,
        isLoadingSettings: false 
      });
      throw error;
    }
  },
  
  // Refresh all user data
  refreshAll: async () => {
    const promises = [
      get().fetchProfile(),
      get().fetchBalance(),
      // Don't fetch settings by default, only when needed
    ];
    
    await Promise.allSettled(promises);
  },
  
  // Fetch comprehensive user statistics
  fetchUserStatistics: async () => {
    set({ isLoadingStatistics: true, statisticsError: null });
    
    try {
      const { data } = await userApi.getUserStatistics();
      set({ 
        userStatistics: data, 
        isLoadingStatistics: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        statisticsError: errorMessage,
        isLoadingStatistics: false 
      });
    }
  },
  
  // Fetch spending statistics
  fetchSpendingStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    set({ isLoadingSpendingStats: true, statisticsError: null });
    
    try {
      const { data } = await userApi.getSpendingStats(period);
      set({ 
        spendingStats: data, 
        isLoadingSpendingStats: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        statisticsError: errorMessage,
        isLoadingSpendingStats: false 
      });
    }
  },
  
  // Clear all errors
  clearErrors: () => {
    set({
      profileError: null,
      balanceError: null,
      settingsError: null,
      renewalError: null,
      statisticsError: null,
    });
  },
}));