import { create } from 'zustand';
import { cardApi, Card, CardProgram, CreateCardRequest } from '@/lib/api/cards';
import { getErrorMessage } from '@/lib/api/client';

interface CardState {
  cards: Card[];
  programs: CardProgram[];
  isLoading: boolean;
  isLoadingPrograms: boolean;
  error: string | null;
  
  fetchCards: () => Promise<void>;
  fetchPrograms: () => Promise<void>;
  createCard: (data: CreateCardRequest) => Promise<Card>;
  updateCard: (cardId: string, data: any) => Promise<void>;
  freezeCard: (cardId: string) => Promise<void>;
  unfreezeCard: (cardId: string) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  clearError: () => void;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  programs: [], // Initialize as empty array
  isLoading: false,
  isLoadingPrograms: false,
  error: null,
  
  fetchCards: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await cardApi.getCards();
      
      set({ 
        cards: data.cards || [], 
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
  
  fetchPrograms: async () => {
    set({ isLoadingPrograms: true, error: null });
    
    try {
      const response = await cardApi.getPrograms();
      // Extract programs array from the response
      const programsArray = response.data?.programs || [];
      
      set({ 
        programs: programsArray, 
        isLoadingPrograms: false 
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoadingPrograms: false,
        programs: [] // Ensure programs is always an array
      });
    }
  },
  
  createCard: async (cardData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await cardApi.createCard(cardData);
      const currentCards = get().cards;
      set({ 
        cards: [...currentCards, data],
        isLoading: false 
      });
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateCard: async (cardId: string, updateData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data } = await cardApi.updateCard(cardId, updateData);
      const currentCards = get().cards;
      set({
        cards: currentCards.map(card => 
          card.id === cardId ? data : card
        ),
        isLoading: false
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },
  
  freezeCard: async (cardId: string) => {
    try {
      await cardApi.freezeCard(cardId);
      const currentCards = get().cards;
      set({
        cards: currentCards.map(card => 
          card.id === cardId ? { ...card, status: 'frozen' as const } : card
        )
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      throw error;
    }
  },
  
  unfreezeCard: async (cardId: string) => {
    try {
      await cardApi.unfreezeCard(cardId);
      const currentCards = get().cards;
      set({
        cards: currentCards.map(card => 
          card.id === cardId ? { ...card, status: 'active' as const } : card
        )
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage });
      throw error;
    }
  },
  
  deleteCard: async (cardId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await cardApi.deleteCard(cardId);
      const currentCards = get().cards;
      set({
        cards: currentCards.filter(card => card.id !== cardId),
        isLoading: false
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
}));