import { create } from 'zustand';
import { apiClient } from '@/lib/api/secureClient';

export interface CryptoDeposit {
  orderId: string;
  orderReference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'detected' | 'received' | 'completed' | 'cancelled' | 'failed';
  requestedAt: string;
  lastUpdated: string;
  paymentUrl?: string | null;
  feeInfo?: {
    grossAmount: number;
    feeAmount: number;
    netAmount: number;
    feePercentage: number;
  } | null;
  // Additional fields for transactions:
  transactionId?: string | null;
  cryptoCurrency?: string | null;
  cryptoAmount?: number | null;
  exchangeRate?: number | null;
  transactionFeeAmount?: number | null;
  creditedAmount?: number | null;
  completedAt?: string | null;
  transactionHash?: string | null;
  confirmations?: number | null;
  metadata?: any;
}

interface CryptoOrder {
  id: string;
  userId: string;
  orderId: string;
  paymentUrl: string;
  amount: number;
  currency: string;
  exchangeRate: number;
  fiatAmount: number;
  fiatCurrency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  expiresAt: string;
  completedAt?: string;
  transactionHash?: string;
  createdAt: string;
  updatedAt: string;
}

interface CryptoState {
  deposits: CryptoDeposit[];
  currentOrder: CryptoOrder | null;
  isLoading: boolean;
  error: string | null;
  
  fetchDeposits: (limit?: number) => Promise<void>;
  createDepositOrder: (amount: number) => Promise<{ order: any; paymentUrl: any; }>;
  checkOrderStatus: (orderId: string) => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  deposits: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  
  fetchDeposits: async (limit = 20) => {
    set({ isLoading: true, error: null });
    
    try {
      // Fetch crypto deposit/withdrawal history
      const { data } = await apiClient.get('/crypto/deposit/history', {
        params: { limit, page: 1 }
      });
      
      set({ 
        deposits: data.data.deposits || [], 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ 
        deposits: [], 
        isLoading: false,
        error: error.response?.data?.error?.message || 'Failed to fetch crypto history'
      });
    }
  },
  
  createDepositOrder: async (amount: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await apiClient.post('/crypto/deposit/order', {
        amount: amount,          // Number format: 100.00
        currency: 'USD'          // Platform only supports USD
      });
      
      // The API returns data.data which contains the order object
      const responseData = data.data;
      
      // Store the order object in state
      set({ 
        currentOrder: responseData.order || responseData,
        isLoading: false 
      });
      
      // Return a normalized response with paymentUrl for consistency
      return {
        order: responseData.order || responseData,
        paymentUrl: responseData.order?.redirect_url || responseData.redirect_url || responseData.paymentUrl
      };
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error?.message || 'Failed to create deposit order',
        isLoading: false 
      });
      throw error;
    }
  },
  
  checkOrderStatus: async (orderId: string) => {
    try {
      const { data } = await apiClient.get(`/crypto/orders/${orderId}`);
      
      if (data.data.status === 'completed') {
        // Refresh deposits list
        get().fetchDeposits();
      }
      
      set({ currentOrder: data.data });
    } catch (error: any) {
      // Silently fail - this is a background check
    }
  }
}));
