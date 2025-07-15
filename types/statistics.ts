// Statistics Types

// User Statistics Response
export interface UserStatistics {
  lifetime: {
    deposits: {
      total: number;
      pending: number;
    };
    cardSpending: {
      completed: number;
      pending: number;
      failed: number;
    };
    fees: {
      cardCreation: number;
      cardMonthly: number;
      deposit: number;
      total: number;
    };
  };
  currentYear: {
    year: number;
    deposits: {
      total: number;
      pending: number;
    };
    cardSpending: {
      completed: number;
      pending: number;
      failed: number;
    };
    fees: {
      cardCreation: number;
      cardMonthly: number;
      deposit: number;
      total: number;
    };
    totalSpending: number;
  };
  accountInfo: {
    activeCardsCount: number;
    currentTier: string;
    tierLevel: number;
  };
}

// Transaction Statistics Response
export interface TransactionStatistics {
  totalTransactions: number;
  totalAmount: number;
  byType: Record<string, number>;
  byCurrency: Record<string, number>;
}

// Invoice Statistics Response
export interface InvoiceStatistics {
  period: string;
  stats: {
    total_invoices: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    overdue_amount: number;
  };
}

// Spending Statistics Response (existing endpoint)
export interface SpendingStatistics {
  period: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  merchantBreakdown: Array<{
    merchant: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
}