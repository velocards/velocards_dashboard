import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getInvoices,
  getInvoice,
  downloadAndSaveInvoice,
  resendInvoiceEmail,
  getInvoiceSettings,
  updateInvoiceSettings,
  getInvoiceStats
} from '@/lib/api/invoices';
import type { 
  Invoice, 
  InvoiceFilters, 
  InvoiceSettings, 
  InvoiceStats 
} from '@/types/invoice';

interface InvoiceStore {
  // State
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: InvoiceFilters;
  settings: InvoiceSettings | null;
  stats: InvoiceStats | null;
  isLoading: boolean;
  isLoadingInvoice: boolean;
  isDownloading: boolean;
  isSendingEmail: boolean;
  error: string | null;

  // Actions
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>;
  fetchInvoice: (invoiceId: string) => Promise<void>;
  downloadInvoice: (invoiceId: string, invoiceNumber: string) => Promise<void>;
  resendInvoice: (invoiceId: string, email?: string) => Promise<{ success: boolean; message: string } | undefined>;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<InvoiceSettings>) => Promise<void>;
  fetchStats: (period?: 'month' | 'quarter' | 'year') => Promise<void>;
  setFilters: (filters: InvoiceFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  invoices: [],
  currentInvoice: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {},
  settings: null,
  stats: null,
  isLoading: false,
  isLoadingInvoice: false,
  isDownloading: false,
  isSendingEmail: false,
  error: null
};

export const useInvoiceStore = create<InvoiceStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      fetchInvoices: async (filters?: InvoiceFilters) => {
        set({ isLoading: true, error: null });
        try {
          const currentFilters = filters || get().filters;
          const response = await getInvoices(currentFilters);
          
          // Map the response to match the Invoice type structure
          const mappedInvoices = response.invoices.map(inv => {
            // Create a properly typed invoice object
            const invoice: Invoice = {
              id: inv.id,
              invoice_number: inv.invoice_number,
              user_id: (inv as any).user_id || '',
              type: inv.type,
              status: inv.status,
              total_amount: inv.total_amount,
              subtotal: inv.total_amount, // Assuming subtotal equals total for list view
              tax_amount: 0, // Not provided in list response
              currency: inv.currency,
              invoice_date: inv.invoice_date,
              due_date: inv.due_date,
              paid_date: inv.paid_date,
              description: inv.description,
              billing_details: {
                name: '',
                email: ''
              }, // Not provided in list response
              pdf_url: inv.pdf_url,
              email_sent_at: inv.email_sent_at,
              created_at: inv.created_at,
              updated_at: inv.created_at, // Using created_at as fallback
              items: [] // Not provided in list response
            };
            return invoice;
          });

          set({
            invoices: mappedInvoices,
            pagination: response.pagination,
            filters: currentFilters,
            isLoading: false
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to fetch invoices';
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchInvoice: async (invoiceId: string) => {
        set({ isLoadingInvoice: true, error: null });
        try {
          const invoice = await getInvoice(invoiceId);
          set({ currentInvoice: invoice, isLoadingInvoice: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to fetch invoice details';
          set({ error: errorMessage, isLoadingInvoice: false });
        }
      },

      downloadInvoice: async (invoiceId: string, invoiceNumber: string) => {
        set({ isDownloading: true, error: null });
        try {
          await downloadAndSaveInvoice(invoiceId, invoiceNumber);
          set({ isDownloading: false });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to download invoice';
          set({ error: errorMessage, isDownloading: false });
        }
      },

      resendInvoice: async (invoiceId: string, email?: string) => {
        set({ isSendingEmail: true, error: null });
        try {
          // If no email provided, the backend will use the user's registered email
          const response = await resendInvoiceEmail(invoiceId, email);
          set({ isSendingEmail: false });
          return { success: true, message: response.message || 'Invoice email sent successfully!' };
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to send invoice email';
          set({ error: errorMessage, isSendingEmail: false });
          return { success: false, message: errorMessage };
        }
      },

      fetchSettings: async () => {
        try {
          const response = await getInvoiceSettings();
          set({ settings: response.settings });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to fetch invoice settings';
        }
      },

      updateSettings: async (settings: Partial<InvoiceSettings>) => {
        try {
          const response = await updateInvoiceSettings(settings);
          set({ settings: response.settings });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to update invoice settings';
        }
      },

      fetchStats: async (period: 'month' | 'quarter' | 'year' = 'month') => {
        try {
          const stats = await getInvoiceStats(period);
          set({ stats });
        } catch (error: any) {
          const errorMessage = error.response?.data?.error?.message || 'Failed to fetch invoice statistics';
        }
      },

      setFilters: (filters: InvoiceFilters) => {
        set({ filters });
        get().fetchInvoices(filters);
      },

      clearFilters: () => {
        set({ filters: {} });
        get().fetchInvoices({});
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState)
    }),
    {
      name: 'invoice-store'
    }
  )
);