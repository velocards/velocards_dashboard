import { apiClient } from './client';

// Types
export interface CardProgram {
  programId: number;  // This is the ID to use for card creation
  bin: string;        // Bank Identification Number (first 6 digits)
  name: string;       // Program name from Admediacards
  description: string; // User-friendly description
}

export interface Card {
  id: string;
  userId: string;
  cardToken?: string;
  maskedPan: string;
  bin?: string;
  last4?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string; // Only returned on creation
  type?: 'single_use' | 'multi_use';
  status: 'active' | 'frozen' | 'expired' | 'deleted';
  fundingAmount?: number;
  spendingLimit?: number;
  spentAmount?: number;
  remainingBalance?: number;
  balance?: number; // API might return 'balance' instead of 'remainingBalance'
  currency?: string;
  nickname?: string;
  programId?: number;
  merchantRestrictions?: {
    allowedCategories?: string[];
    blockedCategories?: string[];
    allowedMerchants?: string[];
    blockedMerchants?: string[];
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCardRequest {
  programId: number;
  fundingAmount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  nickname?: string;
  expiryMonth?: string;
  expiryYear?: string;
  merchantRestrictions?: Card['merchantRestrictions'];
}

export interface UpdateCardRequest {
  nickname?: string;
  spendingLimit?: number;
  merchantRestrictions?: Card['merchantRestrictions'];
}


// API functions
export const cardApi = {
  // Get available card programs
  getPrograms: async (): Promise<{ data: { programs: CardProgram[]; count: number } }> => {
    const response = await apiClient.get('/cards/programs');
    console.log('Card programs API response:', response);
    return response.data;
  },

  // Get all cards
  getCards: async (): Promise<{ 
    data: {
      cards: Card[];
      count: number;
    }
  }> => {
    const response = await apiClient.get('/cards');
    return response.data;
  },

  // Get single card
  getCard: async (cardId: string): Promise<{ data: Card }> => {
    const response = await apiClient.get(`/cards/${cardId}`);
    return response.data;
  },

  // Create new card
  createCard: async (data: CreateCardRequest): Promise<{ data: Card }> => {
    const response = await apiClient.post('/cards', data);
    return response.data;
  },

  // Update card
  updateCard: async (cardId: string, data: UpdateCardRequest): Promise<{ data: Card }> => {
    const response = await apiClient.patch(`/cards/${cardId}`, data);
    return response.data;
  },

  // Freeze card
  freezeCard: async (cardId: string): Promise<{ data: { message: string } }> => {
    const response = await apiClient.post(`/cards/${cardId}/freeze`);
    return response.data;
  },

  // Unfreeze card
  unfreezeCard: async (cardId: string): Promise<{ data: { message: string } }> => {
    const response = await apiClient.post(`/cards/${cardId}/unfreeze`);
    return response.data;
  },

  // Delete card
  deleteCard: async (cardId: string): Promise<{ data: { message: string } }> => {
    const response = await apiClient.delete(`/cards/${cardId}`);
    return response.data;
  },

  // Get card transactions
  getCardTransactions: async (cardId: string): Promise<{ 
    data: {
      transactions: any[];
      count: number;
    }
  }> => {
    const response = await apiClient.get(`/cards/${cardId}/transactions`);
    return response.data;
  },

  // Update spending limit
  updateSpendingLimit: async (cardId: string, limit: number): Promise<{ data: Card }> => {
    console.log('🚀 UPDATE LIMIT - Starting API call:', {
      cardId,
      newLimit: limit,
      timestamp: new Date().toISOString()
    });
    
    const requestData = { spendingLimit: limit };
    console.log('📤 UPDATE LIMIT - Request payload:', requestData);
    
    try {
      const response = await apiClient.put(`/cards/${cardId}/limits`, requestData);
      
      console.log('✅ UPDATE LIMIT - API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        timestamp: new Date().toISOString()
      });
      
      console.log('📊 UPDATE LIMIT - Updated card data:', response.data.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ UPDATE LIMIT - API Error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  },

  // Get full card details (SENSITIVE - includes unmasked PAN and CVV)
  getFullCardDetails: async (cardId: string): Promise<{ 
    data: {
      cardDetails: {
        id: string;
        cardToken: string;
        pan: string;              // Full 16-digit card number
        cvv: string;              // Real CVV (3 digits)
        expiryMonth: string;      // e.g., "6"
        expiryYear: string;       // e.g., "2028"
        holderName: string;       // Cardholder full name
        status: string;
        spendingLimit: number;
        spentAmount: number;
        remainingBalance: number;
        createdAt: string;
      }
    }
  }> => {
    console.log('🔐 Requesting full card details for:', cardId);
    const response = await apiClient.get(`/cards/${cardId}/full-details`);
    console.log('✅ Full card details received (sensitive data)');
    return response.data;
  },
};