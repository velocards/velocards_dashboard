import { create } from 'zustand';
import { balanceApi, BalanceTransaction, BalanceInfo } from '@/lib/api/balance';
import { getErrorMessage } from '@/lib/api/secureClient';

interface BalanceState {
  balance: BalanceInfo | null;
  balanceHistory: BalanceTransaction[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  
  fetchBalance: () => Promise<void>;
  fetchBalanceHistory: (filters?: any) => Promise<void>;
  clearError: () => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  balanceHistory: [],
  isLoading: false,
  isLoadingHistory: false,
  error: null,
  
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await balanceApi.getBalance();
      set({ 
        balance: data,
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },
  
  fetchBalanceHistory: async (filters) => {
    set({ isLoadingHistory: true, error: null });
    
    try {
      const { data } = await balanceApi.getBalanceHistory({
        page: 1,
        limit: 100, // Max allowed by backend
        ...filters, // Allow overrides but with defaults set first
      });
      set({ 
        balanceHistory: data.transactions || [],
        isLoadingHistory: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoadingHistory: false,
        balanceHistory: []
      });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));