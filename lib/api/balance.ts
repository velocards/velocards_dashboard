import { apiClient } from './secureClient';

// Types
export interface BalanceTransaction {
  id: string;
  userId: string;
  transactionType: 'deposit' | 'card_funding' | 'refund' | 'withdrawal' | 'fee' | 'adjustment' | 'card_creation_fee' | 'deposit_fee' | 'card_monthly_fee';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface BalanceInfo {
  virtualBalance: number;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
}

export interface BalanceHistoryFilters {
  page?: number;
  limit?: number;
  type?: 'deposit' | 'card_funding' | 'refund' | 'withdrawal' | 'fee';
  startDate?: string;
  endDate?: string;
}

// API functions
export const balanceApi = {
  // Get user balance
  getBalance: async (): Promise<{ data: BalanceInfo }> => {
    const response = await apiClient.get('/users/balance');
    return response.data;
  },

  // Get balance history
  getBalanceHistory: async (filters?: BalanceHistoryFilters): Promise<{ 
    data: {
      transactions: BalanceTransaction[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }
  }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`/users/balance/history${params.toString() ? `?${params}` : ''}`);
    return response.data;
  },
};