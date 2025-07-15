import { apiClient } from './client';
import type { 
  Invoice, 
  InvoiceListResponse, 
  InvoiceFilters, 
  InvoiceSettings, 
  InvoiceStats,
  InvoiceHealthCheck 
} from '@/types/invoice';
import type { ApiResponse } from '@/types/api';

// List invoices with filtering and pagination
export const getInvoices = async (filters?: InvoiceFilters): Promise<InvoiceListResponse> => {
  const params = new URLSearchParams();
  
  // Always filter for paid invoices by default
  params.append('status', 'paid');
  
  if (filters) {
    // Override the paid status if explicitly provided
    if (filters.status) params.set('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
  }
  
  const response = await apiClient.get<ApiResponse<InvoiceListResponse>>(
    `/invoices${params.toString() ? `?${params.toString()}` : ''}`
  );
  return response.data.data;
};

// Get specific invoice details
export const getInvoice = async (invoiceId: string): Promise<Invoice> => {
  const response = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${invoiceId}`);
  return response.data.data;
};

// Download invoice PDF
export const downloadInvoicePDF = async (invoiceId: string): Promise<Blob> => {
  const response = await apiClient.get(`/invoices/${invoiceId}/download`, {
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  });
  return response.data;
};

// View invoice PDF in new window
export const viewInvoicePDF = async (invoiceId: string) => {
  try {
    const blob = await downloadInvoicePDF(invoiceId);
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Open in new window/tab
    window.open(url, '_blank');
    
    // Clean up the URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error viewing invoice:', error);
    throw error;
  }
};

// Resend invoice email
export const resendInvoiceEmail = async (
  invoiceId: string, 
  email?: string
): Promise<{ message: string; invoiceId: string }> => {
  console.log('Resending invoice email:', { invoiceId, email });
  try {
    const response = await apiClient.post<ApiResponse<{ message: string; invoiceId: string }>>(
      `/invoices/${invoiceId}/resend`,
      email ? { email } : {}
    );
    console.log('Resend response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Resend invoice email error:', error);
    throw error;
  }
};

// Get invoice settings
export const getInvoiceSettings = async (): Promise<{ settings: InvoiceSettings }> => {
  const response = await apiClient.get<ApiResponse<{ settings: InvoiceSettings }>>('/invoices/settings');
  return response.data.data;
};

// Update invoice settings
export const updateInvoiceSettings = async (
  settings: Partial<InvoiceSettings>
): Promise<{ message: string; settings: InvoiceSettings }> => {
  const response = await apiClient.put<ApiResponse<{ message: string; settings: InvoiceSettings }>>(
    '/invoices/settings',
    settings
  );
  return response.data.data;
};

// Get invoice statistics
export const getInvoiceStats = async (
  period: 'month' | 'quarter' | 'year' = 'month'
): Promise<InvoiceStats> => {
  const response = await apiClient.get<ApiResponse<InvoiceStats>>(
    `/invoices/stats?period=${period}`
  );
  return response.data.data;
};

// Check invoice system health
export const checkInvoiceHealth = async (): Promise<InvoiceHealthCheck> => {
  const response = await apiClient.get<ApiResponse<InvoiceHealthCheck>>('/invoices/health');
  return response.data.data;
};

// Utility function to download and save invoice PDF
export const downloadAndSaveInvoice = async (invoiceId: string, invoiceNumber: string) => {
  try {
    const blob = await downloadInvoicePDF(invoiceId);
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

// Utility function to format invoice amount
export const formatInvoiceAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Utility function to format invoice date
export const formatInvoiceDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};