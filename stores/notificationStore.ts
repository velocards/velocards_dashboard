import { create } from 'zustand';
import { apiClient } from '@/lib/api/client';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: 'news' | 'updates' | 'maintenance' | 'features' | 'promotions';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon?: string;
  image_url?: string | null;
  action_url?: string | null;
  action_label?: string | null;
  published_at: string;
  expires_at?: string | null;
  read: boolean;
}

interface AnnouncementStore {
  announcements: Announcement[];
  unreadCount: number;
  selectedAnnouncement: Announcement | null;
  isModalOpen: boolean;
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  
  // Actions
  loadAnnouncements: (page?: number, category?: string) => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openAnnouncementModal: (announcement: Announcement) => void;
  closeAnnouncementModal: () => void;
}

// Category icons mapping
export const categoryIcons: Record<string, string> = {
  news: 'las la-newspaper',
  updates: 'las la-rocket',
  maintenance: 'las la-tools',
  features: 'las la-star',
  promotions: 'las la-percentage'
};

// Priority styles mapping
export const priorityStyles = {
  urgent: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20' },
  high: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  medium: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  low: { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/20' }
};

export const useNotificationStore = create<AnnouncementStore>((set, get) => ({
  announcements: [],
  unreadCount: 0,
  selectedAnnouncement: null,
  isModalOpen: false,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,

  loadAnnouncements: async (page = 1, category?: string) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (category) {
        params.append('category', category);
      }

      const { data } = await apiClient.get(`/announcements?${params}`);
      
      set({
        announcements: data.data.announcements || [],
        unreadCount: data.data.unreadCount || 0,
        currentPage: data.data.pagination?.page || 1,
        totalPages: data.data.pagination?.totalPages || 1,
        isLoading: false
      });
    } catch (error: any) {
      set({ isLoading: false, announcements: [], unreadCount: 0 });
    }
  },

  loadUnreadCount: async () => {
    try {
      const { data } = await apiClient.get('/announcements/unread-count');
      set({ unreadCount: data.data.count });
    } catch (error) {
      // Silently fail - this is a background operation
    }
  },

  markAsRead: async (id: string) => {
    try {
      await apiClient.post(`/announcements/${id}/read`);
      
      set((state) => {
        const announcements = state.announcements.map((a) =>
          a.id === id ? { ...a, read: true } : a
        );
        const unreadCount = announcements.filter((a) => !a.read).length;
        return { announcements, unreadCount };
      });
    } catch (error) {
      // Silently fail - UI already updated optimistically
    }
  },

  markAllAsRead: async () => {
    try {
      const { data } = await apiClient.post('/announcements/read-all');
      
      set((state) => ({
        announcements: state.announcements.map((a) => ({ ...a, read: true })),
        unreadCount: 0
      }));
    } catch (error) {
      // Silently fail - UI already updated optimistically
    }
  },

  openAnnouncementModal: (announcement: Announcement) => {
    set({ selectedAnnouncement: announcement, isModalOpen: true });
    // Mark as read when opened
    if (!announcement.read) {
      get().markAsRead(announcement.id);
    }
  },

  closeAnnouncementModal: () => {
    set({ selectedAnnouncement: null, isModalOpen: false });
  },
}));