"use client";
import useTable from "@/utils/useTable";
import { IconSelector } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
// Helper function to get merchant icon class based on category  
const getMerchantIconClass = (category: string, merchantName: string) => {
  const name = merchantName.toLowerCase();
  
  // Specific merchant icons
  if (name.includes('amazon')) return 'la-shopping-bag';
  if (name.includes('starbucks')) return 'la-coffee';
  if (name.includes('uber')) return 'la-car';
  if (name.includes('shell')) return 'la-gas-pump';
  
  // Category-based icons
  switch (category.toLowerCase()) {
    case 'food & beverage':
    case 'food':
      return 'la-utensils';
    case 'e-commerce':
    case 'shopping':
      return 'la-shopping-cart';
    case 'transportation':
      return 'la-car';
    case 'gas':
    case 'fuel':
      return 'la-gas-pump';
    default:
      return 'la-credit-card';
  }
};

// Helper function to format date
const formatTransactionDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return date.toLocaleDateString('en-US', options).replace(',', '.');
};

const LatestTransactions = () => {
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions({ limit: 8 }); // Get latest 8 transactions for dashboard
  }, []);
  
  // Map real transactions to component format
  const mappedTransactions = transactions.map(transaction => ({
    id: transaction.id,
    title: transaction.merchantName || 'Unknown Merchant',
    iconClass: getMerchantIconClass(transaction.merchantCategory || '', transaction.merchantName || ''),
    time: formatTransactionDate(transaction.createdAt),
    amount: transaction.amount,
    status: transaction.status,
    category: transaction.merchantCategory,
    country: transaction.merchantCountry,
    // Additional fields for modal
    rawData: transaction,
    merchantName: transaction.merchantName,
    merchantCategory: transaction.merchantCategory,
    merchantCountry: transaction.merchantCountry,
    maskedPan: transaction.maskedPan || transaction.card?.maskedPan,
    cardName: transaction.card?.nickname || `Card ending in ${transaction.last4 || transaction.card?.last4 || '****'}`,
    createdAt: transaction.createdAt,
    description: (transaction as any).description || transaction.merchantName || 'Transaction',
    currency: transaction.currency || 'USD'
  }));
  
  const { sortData, tableData } = useTable(mappedTransactions.length > 0 ? mappedTransactions : []);

  return (
    <div className="box">
      <div className="bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <p className="font-medium">Card Transactions</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("title")} className="text-start py-3 sm:py-5 px-3 sm:px-6 cursor-pointer">
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  Title <IconSelector size={16} className="hidden sm:inline" />
                </div>
              </th>
              <th onClick={() => sortData("amount")} className="text-start py-3 sm:py-5 px-3 sm:px-6 cursor-pointer">
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  Amount <IconSelector size={16} className="hidden sm:inline" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <i className="las la-spinner la-spin text-3xl text-primary"></i>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-8">
                  <div className="text-gray-500">
                    <i className="las la-credit-card text-4xl mb-2"></i>
                    <p>No card transactions yet</p>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((transaction) => {
                const { id, title, amount, time, status, category, iconClass } = transaction;
                return (
                <tr 
                  key={id} 
                  className="even:bg-secondary/5 dark:even:bg-bg3 cursor-pointer hover:bg-secondary/10 transition-colors"
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsModalOpen(true);
                  }}>
                  <td className="py-2 px-3 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className={`las ${iconClass} text-white text-xs sm:text-sm`}></i>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <p className="font-medium text-sm sm:text-base truncate">{title}</p>
                          <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium capitalize ${
                            status === 'completed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                          <span className="whitespace-nowrap">{time}</span>
                          {category && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline truncate">{category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 pr-3 sm:pr-6">
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base">${amount.toFixed(2)}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">USD</p>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Link className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group" href="/transaction/card-transactions/">
        View All Card Transactions <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
      </Link>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        type="card"
      />
    </div>
  );
};

export default LatestTransactions;
