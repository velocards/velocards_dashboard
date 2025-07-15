// Invoice Types based on the backend API documentation

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BillingDetails {
  name: string;
  email: string;
  address?: Address;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_rate?: number;
  tax_amount?: number;
  metadata?: Record<string, any>;
}

export type InvoiceType = 
  | 'card_transaction' 
  | 'crypto_deposit' 
  | 'crypto_withdrawal' 
  | 'monthly_fee' 
  | 'card_creation_fee' 
  | 'deposit_fee' 
  | 'manual' 
  | 'consolidated';

export type InvoiceStatus = 
  | 'draft' 
  | 'pending' 
  | 'sent' 
  | 'viewed' 
  | 'paid' 
  | 'overdue' 
  | 'cancelled' 
  | 'failed';

export interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  currency: string;
  invoice_date: string;
  due_date?: string;
  paid_date?: string;
  description: string;
  billing_details: BillingDetails;
  pdf_url?: string;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
}

export interface InvoiceListResponse {
  invoices: Array<{
    id: string;
    invoice_number: string;
    type: InvoiceType;
    status: InvoiceStatus;
    total_amount: number;
    currency: string;
    invoice_date: string;
    due_date?: string;
    paid_date?: string;
    description: string;
    pdf_url?: string;
    email_sent_at?: string;
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  type?: InvoiceType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceSettings {
  auto_generate_pdf: boolean;
  auto_send_email: boolean;
  include_zero_amount: boolean;
  group_daily_fees: boolean;
  company_name?: string;
  billing_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  tax_id?: string;
  email_subject_template?: string;
  email_body_template?: string;
  cc_emails?: string[];
  logo_url?: string;
  footer_text?: string;
  terms_and_conditions?: string;
}

export interface InvoiceStats {
  period: string;
  stats: {
    total_invoices: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    overdue_amount: number;
  };
}

export interface InvoiceHealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  checks: {
    database: 'connected' | 'disconnected';
    pdfGenerator: 'operational' | 'down';
    emailService: 'operational' | 'degraded' | 'down';
    storage: 'accessible' | 'inaccessible';
  };
}

// Utility functions for invoice status
export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const statusColors: Record<InvoiceStatus, string> = {
    paid: 'green',
    pending: 'yellow',
    overdue: 'red',
    cancelled: 'gray',
    draft: 'blue',
    sent: 'indigo',
    viewed: 'purple',
    failed: 'red'
  };
  return statusColors[status] || 'gray';
};

export const getInvoiceStatusBadgeClass = (status: InvoiceStatus): string => {
  const statusClasses: Record<InvoiceStatus, string> = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    draft: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    sent: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

export const formatInvoiceType = (type: InvoiceType): string => {
  const typeLabels: Record<InvoiceType, string> = {
    card_transaction: 'Card Transaction',
    crypto_deposit: 'Crypto Deposit',
    crypto_withdrawal: 'Crypto Withdrawal',
    monthly_fee: 'Monthly Fee',
    card_creation_fee: 'Card Creation Fee',
    deposit_fee: 'Deposit Fee',
    manual: 'Manual Invoice',
    consolidated: 'Consolidated Invoice'
  };
  return typeLabels[type] || type;
};