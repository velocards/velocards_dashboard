"use client";
import { useEffect, useMemo, useState } from "react";
import { IconCreditCard, IconReceiptDollar, IconAlertCircle, IconClock, IconX, IconInfoCircle } from "@tabler/icons-react";
import { useUserStore } from "@/stores/userStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCardStore } from "@/stores/cardStore";
import Modal from "@/components/shared/Modal";

const CardStatistics = () => {
  const { userStatistics, fetchUserStatistics } = useUserStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { cards, fetchCards } = useCardStore();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStatistics();
    fetchTransactions({ limit: 500 }); // Fetch more transactions for accurate stats
    fetchCards();
  }, []);

  // Calculate transaction statistics by status
  const transactionStats = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        completed: 0,
        pending: 0,
        failed: 0,
        totalFees: 0,
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
        failedAmount: 0
      };
    }

    const stats = transactions.reduce((acc, transaction) => {
      const status = transaction.status?.toLowerCase() || 'unknown';
      const amount = Math.abs(transaction.amount || 0);
      
      // Count by status and sum amounts
      if (status === 'completed' || status === 'settled') {
        acc.completed += 1;
        acc.completedAmount += amount;
        acc.totalAmount += amount;
      } else if (status === 'pending' || status === 'processing') {
        acc.pending += 1;
        acc.pendingAmount += amount;
      } else if (status === 'failed' || status === 'declined' || status === 'reversed') {
        acc.failed += 1;
        acc.failedAmount += amount;
      }
      
      return acc;
    }, {
      completed: 0,
      pending: 0,
      failed: 0,
      totalFees: 0,
      totalAmount: 0,
      completedAmount: 0,
      pendingAmount: 0,
      failedAmount: 0
    });

    return stats;
  }, [transactions]);

  // Get active cards count
  const activeCardsCount = useMemo(() => {
    return cards.filter(card => card.status === 'active').length;
  }, [cards]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get filtered transactions based on type
  const getFilteredTransactions = (type: string) => {
    if (!transactions) return [];
    
    switch (type) {
      case 'completed':
        return transactions.filter(t => (t as any).status === 'completed' || (t as any).status === 'settled');
      case 'pending':
        return transactions.filter(t => t.status === 'pending' || (t as any).status === 'processing');
      case 'failed':
        return transactions.filter(t => t.status === 'failed' || (t as any).status === 'declined' || t.status === 'reversed');
      case 'all':
      default:
        return transactions;
    }
  };

  // Helper to get card info
  const getCardInfo = (transaction: any) => {
    const card = cards.find(c => c.id === transaction.cardId);
    return card ? `${card.nickname || 'Card'} (${card.maskedPan})` : 'Unknown Card';
  };

  // Render transaction table
  const renderTransactionTable = (transactions: any[]) => {
    if (transactions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <i className="las la-inbox text-4xl mb-2"></i>
            <p>No transactions found in this category</p>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th className="text-start py-4 px-4 font-medium text-sm">
                Merchant
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Card
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Amount
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Status
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 50).map((transaction, index) => (
              <tr key={transaction.id} className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium">{transaction.merchantName || 'Unknown Merchant'}</p>
                    <p className="text-xs text-gray-500">{transaction.merchantCategory || ''}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">{getCardInfo(transaction)}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold">
                    {formatCurrency(Math.abs(transaction.amount || 0))}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' || transaction.status === 'settled'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : transaction.status === 'pending' || transaction.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-4 xxl:gap-6 mb-6">
        {/* Total Spending */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('all')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Card Spending</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total amount spent across all your virtual cards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-credit-card"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(userStatistics?.lifetime?.cardSpending?.completed || 0)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-primary font-medium">{activeCardsCount}</span> Active Cards
              </p>
            </div>
          </div>
        </div>

        {/* Completed Transactions */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('completed')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Completed</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Successfully processed card transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-check-circle"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(transactionStats.completedAmount)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-secondary font-medium">{transactionStats.completed}</span> Successful
              </p>
            </div>
          </div>
        </div>

        {/* Pending Transactions */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('pending')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Pending</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Transactions currently being processed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-clock"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(transactionStats.pendingAmount)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-warning font-medium">{transactionStats.pending}</span> Processing
              </p>
            </div>
          </div>
        </div>

        {/* Failed Transactions */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('failed')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Failed</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Transactions that were declined or failed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-exclamation-triangle"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(transactionStats.failedAmount)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-error font-medium">{transactionStats.failed}</span> Failed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* All Transactions Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'all'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-credit-card"></i>
            </div>
            <h4 className="h4">All Card Transactions</h4>
          </div>
        </div>
        {renderTransactionTable(transactions)}
      </Modal>

      {/* Completed Transactions Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'completed'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-check-circle"></i>
            </div>
            <h4 className="h4">Completed Transactions</h4>
          </div>
        </div>
        {renderTransactionTable(getFilteredTransactions('completed'))}
      </Modal>

      {/* Pending Transactions Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'pending'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-clock"></i>
            </div>
            <h4 className="h4">Pending Transactions</h4>
          </div>
        </div>
        {renderTransactionTable(getFilteredTransactions('pending'))}
      </Modal>

      {/* Failed Transactions Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'failed'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-exclamation-triangle"></i>
            </div>
            <h4 className="h4">Failed/Declined Transactions</h4>
          </div>
        </div>
        {renderTransactionTable(getFilteredTransactions('failed'))}
      </Modal>
    </>
  );
};

export default CardStatistics;