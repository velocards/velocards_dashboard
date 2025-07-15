"use client";
import React, { useState, useMemo, useEffect } from "react";
import { IconSelector } from "@tabler/icons-react";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import useTable from "@/utils/useTable";
import { useCryptoStore } from "@/stores/cryptoStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useBalanceStore } from "@/stores/balanceStore";
import { useCardStore } from "@/stores/cardStore";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import AllTransactionsStatistics from "@/components/transactions/AllTransactionsStatistics";

interface Transaction {
  id: number;
  type: 'crypto' | 'card' | 'fee';
  title: string;
  amount: string;
  fee: string;
  status: string;
  date: string;
  rawDate: Date; // For sorting
  icon: string;
  crypto?: string;
  currency?: string;
  transactionHash?: string;
  merchant?: string;
  cardLast4?: string;
  isChecked?: boolean;
  orderReference?: string;
  confirmations?: number;
  description?: string;
  // Raw data for modal
  rawData?: any;
  merchantName?: string;
  merchantCategory?: string;
  merchantCountry?: string;
  maskedPan?: string;
  cardName?: string;
  createdAt?: string;
  network?: string;
  cryptoAmount?: number;
  orderId?: string;
  explorerUrl?: string;
  reference?: string;
}

const typeOptions = ["All", "Deposit", "Card", "Fees"];
const statusOptions = ["All", "Completed", "Pending", "Detected", "Received", "Failed", "Cancelled", "Reversed"];

const AllTransactions = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch real data from stores
  const { deposits: cryptoDeposits, fetchDeposits, isLoading: cryptoLoading } = useCryptoStore();
  const { transactions: cardTransactions, fetchTransactions, isLoading: cardLoading } = useTransactionStore();
  const { balanceHistory, fetchBalanceHistory, isLoadingHistory: balanceLoading } = useBalanceStore();
  const { cards, fetchCards } = useCardStore();
  
  // Fetch data on mount
  useEffect(() => {
    fetchDeposits(100); // Fetch more for all transactions page
    fetchTransactions();
    fetchBalanceHistory(); // Fetch all balance history to get fees
    fetchCards(); // Fetch ALL cards (including inactive, deleted, etc.) for comprehensive mapping
  }, []);
  
  // Blockchain explorer URLs
  const getBlockchainExplorerUrl = (currency: string, txHash: string) => {
    const explorers: Record<string, string> = {
      'BTC': 'https://blockstream.info/tx/',
      'ETH': 'https://etherscan.io/tx/',
      'USDT': 'https://etherscan.io/tx/',
      'USDC': 'https://etherscan.io/tx/',
    };
    return explorers[currency] ? `${explorers[currency]}${txHash}` : null;
  };

  // Helper to get crypto icon class
  const getCryptoIconClass = (currency: string) => {
    switch (currency) {
      case 'BTC': return 'la-bitcoin';
      case 'ETH': return 'la-ethereum';
      case 'USDT':
      case 'USDC': return 'la-dollar-sign';
      default: return 'la-coins';
    }
  };

  // Helper to get crypto network
  const getCryptoNetwork = (currency: string) => {
    switch (currency) {
      case 'BTC': return 'Bitcoin';
      case 'ETH': return 'Ethereum';
      case 'USDT': return 'Tron/Ethereum';
      case 'USDC': return 'Ethereum';
      case 'LTC': return 'Litecoin';
      case 'BCH': return 'Bitcoin Cash';
      case 'BNB': return 'Binance Smart Chain';
      default: return currency;
    }
  };

  // Create comprehensive card lookup map for reliable card info mapping
  const cardLookupMap = useMemo(() => {
    const map = new Map();
    cards.forEach(card => {
      map.set(card.id, {
        id: card.id,
        maskedPan: card.maskedPan,
        nickname: card.nickname,
        status: card.status,
        last4: card.maskedPan ? card.maskedPan.replace(/[^0-9]/g, '') : null
      });
    });
    return map;
  }, [cards]);

  // Combine and transform both data sources
  const combinedTransactions: Transaction[] = useMemo(() => {
    const allTransactions: Transaction[] = [];
    
    // Add crypto deposits/withdrawals
    cryptoDeposits.forEach((deposit, index) => {
      const isWithdrawal = deposit.orderReference?.startsWith('WD-');
      const cryptoCurrency = deposit.cryptoCurrency || 'USD';
      const displayAmount = deposit.creditedAmount || deposit.amount;
      
      allTransactions.push({
        id: index + 1,
        type: 'crypto',
        title: isWithdrawal ? `${cryptoCurrency} Withdrawal` : `${deposit.currency} Deposit`,
        amount: isWithdrawal ? `-$${displayAmount.toFixed(2)}` : `+$${displayAmount.toFixed(2)}`,
        fee: deposit.feeInfo?.feeAmount ? `$${deposit.feeInfo.feeAmount.toFixed(2)}` : 
             deposit.transactionFeeAmount ? `$${deposit.transactionFeeAmount.toFixed(2)}` : '-',
        status: deposit.status,
        date: new Date(deposit.requestedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        rawDate: new Date(deposit.requestedAt),
        icon: getCryptoIconClass(cryptoCurrency),
        crypto: deposit.cryptoAmount ? `${deposit.cryptoAmount} ${cryptoCurrency}` : `${displayAmount} ${deposit.currency}`,
        currency: cryptoCurrency,
        transactionHash: deposit.transactionHash || undefined,
        orderReference: deposit.orderReference,
        confirmations: deposit.confirmations || 0,
        // Additional fields for modal
        rawData: deposit,
        createdAt: deposit.requestedAt,
        network: getCryptoNetwork(cryptoCurrency),
        cryptoAmount: deposit.cryptoAmount || undefined,
        orderId: deposit.orderReference,
        explorerUrl: deposit.transactionHash ? getBlockchainExplorerUrl(cryptoCurrency, deposit.transactionHash) || undefined : undefined,
        reference: deposit.orderReference
      });
    });
    
    // Add card transactions (filter out transactions from deleted/unknown cards)
    const validCardTransactions = cardTransactions.filter(tx => {
      const cardExists = cardLookupMap.has(tx.cardId);
      
      if (!cardExists) {
      }
      
      return cardExists;
    });
    
    validCardTransactions.forEach((tx, index) => {
      // Helper function to get card display name using comprehensive mapping
      const getCardDisplayName = (transaction: any): string => {
        // Priority 1: Try transaction.last4 (direct from API)
        if (transaction.last4) {
          return transaction.last4;
        }
        
        // Priority 2: Try transaction.card.last4 (nested from API)
        if (transaction.card?.last4) {
          return transaction.card.last4;
        }
        
        // Priority 3: Extract from transaction.maskedPan (direct from API)
        if (transaction.maskedPan) {
          const last4 = transaction.maskedPan.replace(/[^0-9]/g, '');
          if (last4.length >= 4) {
            return last4;
          }
        }
        
        // Priority 4: Extract from transaction.card.maskedPan (nested from API)
        if (transaction.card?.maskedPan) {
          const last4 = transaction.card.maskedPan.replace(/[^0-9]/g, '');
          if (last4.length >= 4) {
            return last4;
          }
        }
        
        // Priority 5: Use our comprehensive card lookup map (MOST RELIABLE)
        const cardInfo = cardLookupMap.get(transaction.cardId);
        if (cardInfo?.last4 && cardInfo.last4.length >= 4) {
          return cardInfo.last4;
        }
        
        // Priority 6: Use nickname as fallback
        if (cardInfo?.nickname) {
          return cardInfo.nickname;
        }
        
        return '****';
      };

      allTransactions.push({
        id: cryptoDeposits.length + allTransactions.filter(t => t.type === 'card').length + index + 1,
        type: 'card',
        title: tx.merchantName,
        amount: tx.type === 'refund' ? `+$${tx.amount.toFixed(2)}` : `-$${tx.amount.toFixed(2)}`,
        fee: '-', // Card transactions don't show fees separately
        status: tx.status,
        date: new Date(tx.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        rawDate: new Date(tx.createdAt),
        icon: 'la-credit-card', // Card icon class
        merchant: tx.merchantCategory,
        cardLast4: getCardDisplayName(tx),
        // Additional fields for modal
        rawData: tx,
        merchantName: tx.merchantName,
        merchantCategory: tx.merchantCategory,
        merchantCountry: tx.merchantCountry,
        maskedPan: tx.maskedPan || tx.card?.maskedPan,
        cardName: cardLookupMap.get(tx.cardId)?.nickname || `Card ending in ${getCardDisplayName(tx)}`,
        createdAt: tx.createdAt,
        description: (tx as any).description || tx.merchantName || 'Transaction'
      });
    });
    
    // Add fee transactions from balance history
    // Filter to only include fee transactions based on transaction type
    const feeTransactions = balanceHistory.filter(tx => 
      tx.transactionType === 'fee' || 
      tx.transactionType === 'card_creation_fee' ||
      tx.transactionType === 'deposit_fee' ||
      tx.transactionType === 'card_monthly_fee' ||
      tx.transactionType === 'card_funding' || // This might include card creation fees
      (tx.description && (
        tx.description.toLowerCase().includes('fee') ||
        tx.description.toLowerCase().includes('card creation') ||
        tx.description.toLowerCase().includes('monthly')
      ))
    );
    
    feeTransactions.forEach((balanceTx, index) => {
      // Get fee type description
      let feeTitle = 'Platform Fee';
      let icon = 'la-dollar-sign';
      
      // Check transaction type first
      if (balanceTx.transactionType === 'card_creation_fee') {
        feeTitle = 'Card Creation Fee';
        icon = 'la-credit-card';
      } else if (balanceTx.transactionType === 'card_monthly_fee') {
        feeTitle = 'Monthly Card Fee';
        icon = 'la-calendar';
      } else if (balanceTx.transactionType === 'deposit_fee') {
        feeTitle = 'Deposit Fee';
        icon = 'la-percent';
      } else if (balanceTx.description) {
        // Fallback to description-based detection
        if (balanceTx.description.toLowerCase().includes('card creation')) {
          feeTitle = 'Card Creation Fee';
          icon = 'la-credit-card';
        } else if (balanceTx.description.toLowerCase().includes('monthly')) {
          feeTitle = 'Monthly Card Fee';
          icon = 'la-calendar';
        } else if (balanceTx.description.toLowerCase().includes('deposit fee')) {
          feeTitle = 'Deposit Fee';
          icon = 'la-percent';
        }
      }
      
      allTransactions.push({
        id: cryptoDeposits.length + cardTransactions.length + index + 1,
        type: 'fee',
        title: feeTitle,
        amount: `-$${Math.abs(balanceTx.amount).toFixed(2)}`, // Fees are always negative
        fee: '-', // No additional fee on fees
        status: 'completed', // Fees are always completed
        date: new Date(balanceTx.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        rawDate: new Date(balanceTx.createdAt),
        icon: icon,
        description: balanceTx.description,
        // Additional fields for modal
        rawData: balanceTx,
        createdAt: balanceTx.createdAt,
        reference: balanceTx.referenceId
      });
    });
    
    // Sort by date (newest first)
    return allTransactions.sort((a, b) => {
      return b.rawDate.getTime() - a.rawDate.getTime();
    });
  }, [cryptoDeposits, cardTransactions, balanceHistory, cardLookupMap]);

  const transactions = combinedTransactions;

  // Transform and filter data for table
  const filteredTransactionData = useMemo(() => {
    // First filter by type and status
    let filtered = transactions.filter(tx => {
      // Filter by type
      const typeMatch = selectedType === "All" || 
        (selectedType === "Deposit" && tx.type === 'crypto') ||
        (selectedType === "Card" && tx.type === 'card') ||
        (selectedType === "Fees" && tx.type === 'fee');
      
      // Filter by status
      const statusMatch = selectedStatus === "All" || 
        tx.status.toLowerCase() === selectedStatus.toLowerCase();
      
      return typeMatch && statusMatch;
    });

    // Transform data for table with required properties
    return filtered.map(tx => ({
      ...tx,
      title: tx.title,
      date: tx.date
    }));
  }, [selectedType, selectedStatus, transactions]);

  // Use the useTable hook with filtered data
  const { 
    search, 
    currentPage, 
    endIndex, 
    nextPage, 
    paginate, 
    prevPage, 
    startIndex, 
    tableData, 
    totalData, 
    totalPages, 
    sortData 
  } = useTable(filteredTransactionData, 12);

  return (
    <div>
      {/* Statistics Cards */}
      <AllTransactionsStatistics />
      
      <div className="box col-span-12">
        <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-3">
            <h4 className="h4">All Transactions</h4>
            {(cryptoDeposits.length > 0 || cardTransactions.length > 0) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Data
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-medium">Filter by Type:</span>
              <Select 
                setSelected={setSelectedType} 
                selected={selectedType} 
                items={typeOptions} 
                btnClass="rounded-[32px] bg-primary/5 md:py-2.5 min-w-[140px]" 
                contentClass="w-full" 
              />
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-medium">Filter by Status:</span>
              <Select 
                setSelected={setSelectedStatus} 
                selected={selectedStatus} 
                items={statusOptions} 
                btnClass="rounded-[32px] bg-primary/5 md:py-2.5 min-w-[140px]" 
                contentClass="w-full" 
              />
            </div>
            <SearchBar search={search} classes="bg-primary/5" />
          </div>
        </div>
      
      <div className="overflow-x-auto">
        {(cryptoLoading || cardLoading || balanceLoading) ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2">
              <i className="las la-spinner la-spin text-3xl text-primary"></i>
              <span className="text-gray-600">Loading transactions...</span>
            </div>
          </div>
        ) : (
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("title")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Transaction <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("amount")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Amount <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("fee")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Fee <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("type")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Type <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("status")} className="text-start py-5 px-6 w-[15%] cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("date")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Date <IconSelector size={18} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((tx) => (
              <tr 
                key={tx.id} 
                className="even:bg-secondary/5 dark:even:bg-bg3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-secondary/10 transition-colors"
                onClick={() => {
                  setSelectedTransaction(tx);
                  setIsModalOpen(true);
                }}>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'crypto' 
                        ? 'bg-gradient-to-r from-primary to-primary/60' 
                        : tx.type === 'card'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-400'
                        : 'bg-gradient-to-r from-red-500 to-red-400'
                    }`}>
                      <i className={`las ${tx.icon} text-white text-lg`}></i>
                    </div>
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-xs text-gray-500">
                        {tx.type === 'crypto' ? tx.crypto : tx.type === 'card' ? tx.merchant : tx.description}
                      </p>
                      {tx.type === 'crypto' && tx.orderReference && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Order: {tx.orderReference} • {tx.confirmations} confirmations
                        </p>
                      )}
                      {tx.type === 'card' && tx.cardLast4 && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Card ending in {tx.cardLast4}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`font-semibold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm ${tx.fee === '-' ? 'text-gray-400' : 'text-red-600'}`}>
                    {tx.fee}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tx.type === 'crypto' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : tx.type === 'card'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {tx.type === 'crypto' ? 'Deposit' : tx.type === 'card' ? 'Card' : 'Fee'}
                  </span>
                </td>
                <td className="py-4 px-6 w-[15%]" onClick={(e) => e.stopPropagation()}>
                  {tx.type === 'crypto' && tx.transactionHash && getBlockchainExplorerUrl(tx.currency!, tx.transactionHash) ? (
                    <a
                      href={getBlockchainExplorerUrl(tx.currency!, tx.transactionHash)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 min-w-[120px] justify-center ${
                        tx.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                          : tx.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                      }`}
                    >
                      <span className="group-hover:hidden text-sm">
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                      <span className="hidden group-hover:inline-flex items-center gap-1 text-sm">
                        View in Explorer
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium min-w-[120px] justify-center ${
                      tx.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : tx.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-gray-600">{tx.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      
      {!cryptoLoading && !cardLoading && !balanceLoading && tableData.length < 1 && (
        <div className="text-center py-10">
          <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
            <div className="px-5 lg:px-14 xl:px-24 mb-5">
              <i className={`las text-primary text-7xl ${
                combinedTransactions.length === 0 ? 'la-exchange-alt' : 'la-search'
              }`}></i>
            </div>
            <h3 className="h3 mb-3 lg:mb-6">
              {combinedTransactions.length === 0 
                ? 'No transactions yet' 
                : 'No matching transactions found'}
            </h3>
            <p className="mb-4">
              {combinedTransactions.length === 0 
                ? "No transactions to display. Your transaction history will appear here once you start making deposits, card purchases, or incur fees."
                : selectedType !== "All" && selectedStatus !== "All"
                ? `No ${selectedType.toLowerCase()} transactions with "${selectedStatus.toLowerCase()}" status found. Try adjusting your filters or search terms.`
                : selectedType !== "All"
                ? `No ${selectedType.toLowerCase()} transactions found. Try selecting a different type filter or using the search.`
                : selectedStatus !== "All"
                ? `No transactions with "${selectedStatus.toLowerCase()}" status found. Try selecting a different status filter or using the search.`
                : 'No transactions match your current search and filters. Try different search terms or clear the filters.'}
            </p>
            {(selectedType !== "All" || selectedStatus !== "All") && combinedTransactions.length > 0 && (
              <div className="flex gap-3 flex-wrap justify-center">
                {selectedType !== "All" && (
                  <button 
                    onClick={() => setSelectedType("All")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Show All Types
                  </button>
                )}
                {selectedStatus !== "All" && (
                  <button 
                    onClick={() => setSelectedStatus("All")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Show All Statuses
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {tableData.length > 0 && (
        <Pagination 
          totalPages={totalPages} 
          currentPage={currentPage} 
          nextPage={nextPage} 
          startIndex={startIndex} 
          endIndex={endIndex} 
          prevPage={prevPage} 
          total={totalData} 
          goToPage={(page: number) => paginate(page)} 
        />
      )}

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        type={selectedTransaction?.type || 'card'}
      />
      </div>
    </div>
  );
};

export default AllTransactions;