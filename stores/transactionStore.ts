import { create } from 'zustand';
import { transactionApi, Transaction, TransactionStats, mapTransactionFromAPI } from '@/lib/api/transactions';
import { getErrorMessage } from '@/lib/api/secureClient';

interface TransactionState {
  transactions: Transaction[];
  totalAmount: number;
  stats: TransactionStats | null;
  isLoading: boolean;
  isLoadingStats: boolean;
  error: string | null;
  
  fetchTransactions: (filters?: any) => Promise<void>;
  fetchTransactionsByCard: (cardId: string) => Promise<void>;
  fetchTransactionStats: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => Promise<void>;
  exportTransactions: (format: 'csv' | 'pdf', filters?: any) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  totalAmount: 0,
  stats: null,
  isLoading: false,
  isLoadingStats: false,
  error: null,
  
  fetchTransactions: async (filters) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await transactionApi.getTransactions(filters);
      // Map transactions from snake_case to camelCase
      const mappedTransactions = (data.transactions || []).map(mapTransactionFromAPI);
      set({ 
        transactions: mappedTransactions, 
        totalAmount: data.totalAmount || 0,
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
  
  fetchTransactionsByCard: async (cardId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await transactionApi.getTransactions({ cardId });
      
      // Map transactions from snake_case to camelCase
      const mappedTransactions = (data.transactions || []).map(mapTransactionFromAPI);
      
      set({ 
        transactions: mappedTransactions, 
        totalAmount: data.totalAmount || 0,
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
  
  fetchTransactionStats: async (period) => {
    set({ isLoadingStats: true, error: null });
    
    try {
      const { data } = await transactionApi.getTransactionStats(period);
      set({ 
        stats: data,
        isLoadingStats: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoadingStats: false 
      });
    }
  },
  
  exportTransactions: async (format, filters) => {
    try {
      const blob = await transactionApi.exportTransactions(format, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));