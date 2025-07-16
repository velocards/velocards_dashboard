import { apiClient } from './secureClient';

// Types
export interface Transaction {
  id: string;
  userId: string;
  cardId: string;
  cardToken?: string;
  maskedPan?: string;
  last4?: string; // Add direct last4 field
  type: 'authorization' | 'capture' | 'refund' | 'reversal';
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategory: string;
  merchantCountry: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  responseCode: string;
  responseMessage: string;
  createdAt: string;
  metadata?: any;
  card?: {
    id?: string;
    maskedPan?: string;
    last4?: string;
    nickname?: string;
  };
  // Original snake_case fields from API
  user_id?: string;
  card_id?: string;
  masked_pan?: string;
  last_4?: string;
  merchant_name?: string;
  merchant_category?: string;
  merchant_country?: string;
  response_code?: string;
  response_message?: string;
  created_at?: string;
}

// Helper function to convert snake_case to camelCase
export const mapTransactionFromAPI = (apiTransaction: any): Transaction => {
  // Enhanced mapping with better card data handling
  const mappedTransaction = {
    id: apiTransaction.id,
    userId: apiTransaction.user_id || apiTransaction.userId,
    cardId: apiTransaction.card_id || apiTransaction.cardId,
    cardToken: apiTransaction.cardToken,
    maskedPan: apiTransaction.masked_pan || apiTransaction.maskedPan, // Support snake_case from API
    last4: apiTransaction.last_4 || apiTransaction.last4, // Direct last4 field
    type: apiTransaction.type,
    amount: apiTransaction.amount,
    currency: apiTransaction.currency,
    merchantName: apiTransaction.merchant_name || apiTransaction.merchantName,
    merchantCategory: apiTransaction.merchant_category || apiTransaction.merchantCategory,
    merchantCountry: apiTransaction.merchant_country || apiTransaction.merchantCountry,
    status: apiTransaction.status,
    responseCode: apiTransaction.response_code || apiTransaction.responseCode || '',
    responseMessage: apiTransaction.response_message || apiTransaction.responseMessage || '',
    createdAt: apiTransaction.created_at || apiTransaction.createdAt,
    metadata: apiTransaction.metadata,
    card: apiTransaction.card ? {
      id: apiTransaction.card.id,
      maskedPan: apiTransaction.card.masked_pan || apiTransaction.card.maskedPan,
      last4: apiTransaction.card.last_4 || apiTransaction.card.last4,
      nickname: apiTransaction.card.nickname
    } : undefined
  };
  
  // Only log if absolutely no card data found (for debugging API issues)
  if (!mappedTransaction.last4 && !mappedTransaction.card?.last4 && !mappedTransaction.maskedPan && !mappedTransaction.card?.maskedPan && !mappedTransaction.cardId) {
    console.log('⚠️ TRANSACTION MISSING CARD DATA:', {
      id: apiTransaction.id,
      availableFields: Object.keys(apiTransaction)
    });
  }
  
  return mappedTransaction;
};

export interface TransactionFilters {
  cardId?: string;
  status?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  merchantName?: string;
  page?: number;
  limit?: number;
}

export interface TransactionStats {
  totalCount: number;
  totalAmount: number;
  averageAmount: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  merchantBreakdown: Array<{
    merchant: string;
    count: number;
    amount: number;
  }>;
}

// API functions
export const transactionApi = {
  // Get all transactions with optional filters
  getTransactions: async (filters?: TransactionFilters): Promise<{ 
    data: {
      transactions: Transaction[];
      count: number;
      totalAmount: number;
      totalPages?: number;
      currentPage?: number;
      hasNextPage?: boolean;
      hasPrevPage?: boolean;
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
    
    const response = await apiClient.get(`/transactions${params.toString() ? `?${params}` : ''}`);
    return response.data;
  },

  // Get single transaction
  getTransaction: async (id: string): Promise<{ data: Transaction }> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  // Get transaction statistics
  getTransactionStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{ 
    data: TransactionStats 
  }> => {
    const response = await apiClient.get(`/transactions/stats?period=${period}`);
    return response.data;
  },

  // Export transactions
  exportTransactions: async (format: 'csv' | 'pdf', filters?: TransactionFilters): Promise<Blob> => {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`/transactions/export?${params}`, {
      responseType: 'blob'
    });
    
    return response.data;
  },
};