import { apiClient } from './client';
import { UserStatistics, SpendingStatistics } from '@/types/statistics';

// Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  accountStatus: 'active' | 'suspended' | 'closed';
  virtualBalance?: number;
  totalSpent?: number;
  cardsCount?: number;
  transactionsCount?: number;
  monthlySpending?: number;
  yearlySpending?: number;
  tier?: {
    id: number;
    level: number;
    name: string;
    displayName: string;
    description: string;
    features: {
      virtualOnly: boolean;
      instantCards: boolean;
      supportLevel: string;
    };
    minSpending: number;
    maxSpending: number | null;
    benefits: string[];
    cardLimits: {
      maxActiveCards: number;
      maxMonthlyCards: number;
      maxSingleCardAmount: number;
      maxTotalBalance: number;
    };
    fees: {
      cardCreationFee: number;
      monthlyFee: number;
      transactionFee: number;
      atmWithdrawalFee: number;
    };
  };
  tierAssignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserBalance {
  virtualBalance: number;
  pendingBalance?: number;
  totalDeposited?: number;
  totalSpent?: number;
  currency: string;
  lastUpdated?: string;
  availableBalance?: number;
}

export interface AvailableBalance {
  accountBalance: number;
  activeCardsBalance: number;
  availableBalance: number;
  pendingDeposits: number;
  tierInfo: {
    level: number;
    name: string;
    cardCreationFee: number;
    depositFeePercentage: number;
  };
}

export interface UpcomingRenewal {
  nextRenewalDate: string;
  daysUntilRenewal: number;
  totalRenewalAmount: number;
  activeCardsCount: number;
  perCardFee: number;
  currentBalance: number;
  sufficientBalance: boolean;
  balanceShortfall: number;
  cardsAtRisk: Array<{
    cardId: string;
    cardToken: string;
    maskedPan: string;
    monthlyFee: number;
    currentBalance: number;
  }>;
}

export interface MonthlyFeeBreakdown {
  currentMonth: {
    paid: number;
    pending: number;
    failed: number;
  };
  nextMonth: {
    scheduled: number;
    dueDate: string;
  };
  cardBreakdown: Array<{
    cardId: string;
    maskedPan: string;
    nickname?: string;
    monthlyFee: number;
    status: string;
    lastPaymentDate: string;
    nextPaymentDue: string;
  }>;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    transactionAlerts: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    timezone: string;
  };
}

// API functions
export const userApi = {
  // Get user profile with tier info
  getProfile: async (): Promise<{ data: UserProfile }> => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  // Get user balance
  getBalance: async (): Promise<{ data: UserBalance }> => {
    const response = await apiClient.get('/users/balance');
    // Map API response to UserBalance interface
    const mappedData: UserBalance = {
      virtualBalance: response.data.data.balance, // API returns 'balance', map to 'virtualBalance'
      currency: response.data.data.currency,
      lastUpdated: response.data.data.lastUpdated,
      // These fields are not provided by API - leaving as undefined
      pendingBalance: undefined,
      totalDeposited: undefined,
      totalSpent: undefined,
      availableBalance: undefined,
    };
    return { data: mappedData };
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<{ data: UserProfile }> => {
    const response = await apiClient.patch('/users/profile', data);
    return response.data;
  },

  // Get user settings
  getSettings: async (): Promise<{ data: UserSettings }> => {
    const response = await apiClient.get('/users/settings');
    return response.data;
  },

  // Update user settings
  updateSettings: async (data: Partial<UserSettings>): Promise<{ data: UserSettings }> => {
    const response = await apiClient.patch('/users/settings', data);
    return response.data;
  },

  // Get user spending stats
  getSpendingStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{ 
    data: SpendingStatistics
  }> => {
    const response = await apiClient.get(`/users/spending-stats?period=${period}`);
    return response.data;
  },

  // Get comprehensive user statistics (NEW)
  getUserStatistics: async (): Promise<{ data: UserStatistics }> => {
    const response = await apiClient.get('/users/statistics');
    return response.data;
  },

  // Get tier information
  getCurrentTier: async (): Promise<{ 
    data: {
      current: UserProfile['tier'];
      nextTier: UserProfile['tier'] | null;
      progressToNext: number; // percentage
      amountToNext: number;
    }
  }> => {
    const response = await apiClient.get('/tiers/current');
    return response.data;
  },

  // Get available balance
  getAvailableBalance: async (): Promise<{ data: AvailableBalance }> => {
    const response = await apiClient.get('/users/balance/available');
    return response.data;
  },

  // Get upcoming renewal information
  getUpcomingRenewal: async (): Promise<{ data: UpcomingRenewal }> => {
    const response = await apiClient.get('/tiers/upcoming-renewal');
    return response.data;
  },

  // Get monthly fee breakdown
  getMonthlyFeeBreakdown: async (): Promise<{ data: MonthlyFeeBreakdown }> => {
    const response = await apiClient.get('/tiers/monthly-fee-breakdown');
    return response.data;
  },

  // Get tier fees
  getTierFees: async (): Promise<{ 
    data: {
      currentTier: string;
      fees: {
        cardCreation: number;
        cardMonthly: number;
        depositPercentage: number;
        withdrawalPercentage: number;
      };
      monthlyFeesOwed: number;
      totalFeesThisMonth: number;
    }
  }> => {
    const response = await apiClient.get('/tiers/fees');
    return response.data;
  },
};