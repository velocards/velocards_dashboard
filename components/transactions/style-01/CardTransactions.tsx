"use client";
import { useState, useMemo, useEffect } from "react";
import { IconSelector } from "@tabler/icons-react";
import Image from "next/image";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTable from "@/utils/useTable";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCardStore } from "@/stores/cardStore";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import CardStatistics from "@/components/transactions/CardStatistics";

const statusOptions = ["All", "Completed", "Pending", "Failed"];

const CardTransactions = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCard, setSelectedCard] = useState("All Cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get real data from stores
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const { cards, fetchCards } = useCardStore();
  
  // Fetch data on component mount
  useEffect(() => {
    // Fetch more transactions for better pagination (500 instead of 50)
    fetchTransactions({ limit: 500 });
    // Fetch ALL cards (including inactive, deleted, etc.) for comprehensive mapping
    fetchCards(); // This should fetch all cards regardless of status
  }, []);
  
  // Helper function to format date
  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Create comprehensive card lookup map
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

  // Helper function to get card display name using our mapping logic
  const getCardDisplayName = (transaction: any): string => {
    // Priority 1: Try transaction.last4 (direct from API)
    if (transaction.last4) {
      return `•••• ${transaction.last4}`;
    }
    
    // Priority 2: Try transaction.card.last4 (nested from API)
    if (transaction.card?.last4) {
      return `•••• ${transaction.card.last4}`;
    }
    
    // Priority 3: Extract from transaction.maskedPan (direct from API)
    if (transaction.maskedPan) {
      const last4 = transaction.maskedPan.replace(/[^0-9]/g, '');
      if (last4.length >= 4) {
        return `•••• ${last4}`;
      }
    }
    
    // Priority 4: Extract from transaction.card.maskedPan (nested from API)
    if (transaction.card?.maskedPan) {
      const last4 = transaction.card.maskedPan.replace(/[^0-9]/g, '');
      if (last4.length >= 4) {
        return `•••• ${last4}`;
      }
    }
    
    // Priority 5: Use our comprehensive card lookup map (MOST RELIABLE)
    const cardInfo = cardLookupMap.get(transaction.cardId);
    if (cardInfo?.last4 && cardInfo.last4.length >= 4) {
      return `•••• ${cardInfo.last4}`;
    }
    
    // Priority 6: Use nickname as fallback
    if (cardInfo?.nickname) {
      return cardInfo.nickname;
    }
    
    // TEMPORARY FIX: Handle known deleted card ID
    if (transaction.cardId === '91415ffb-db97-4ba2-a970-cd69228a9547') {
      return '•••• 0000'; // Or could use any placeholder last 4 digits
    }
    
    return '•••• ****';
  };
  
  // Map real transactions to component format - memoized to prevent infinite re-renders
  const realTransactions = useMemo(() => {
    // Filter out transactions from deleted/unknown cards
    const validTransactions = transactions.filter(transaction => {
      // Check if the transaction's card exists in our current cards
      const cardExists = cardLookupMap.has(transaction.cardId);
      
      if (!cardExists) {
      }
      
      return cardExists;
    });
    
    return validTransactions.map(transaction => ({
      id: transaction.id,
      merchant: transaction.merchantName || 'Unknown Merchant',
      amount: `-$${transaction.amount.toFixed(2)}`,
      rawAmount: transaction.amount,
      fee: '$0.00', // Fee calculation would need to be added to backend
      rawFee: 0,
      status: transaction.status,
      date: formatTransactionDate(transaction.createdAt),
      card: getCardDisplayName(transaction),
      cardId: transaction.cardId,
      category: transaction.merchantCategory || 'Other',
      // Additional fields for modal
      rawData: transaction,
      merchantName: transaction.merchantName,
      merchantCategory: transaction.merchantCategory,
      merchantCountry: transaction.merchantCountry,
      maskedPan: transaction.maskedPan || transaction.card?.maskedPan,
      cardName: cardLookupMap.get(transaction.cardId)?.nickname || `Card ending in ${getCardDisplayName(transaction)}`,
      createdAt: transaction.createdAt,
      description: (transaction as any).description || transaction.merchantName || 'Transaction',
      currency: transaction.currency || 'USD'
    }));
  }, [transactions, cardLookupMap]); // Recalculate when transactions or card mapping changes

  // Extract unique cards and create card options
  const cardOptions = useMemo(() => {
    const uniqueCards = Array.from(new Set(realTransactions.map(tx => tx.card)));
    return ["All Cards", ...uniqueCards.filter(card => card !== '**** ****')];
  }, [realTransactions]);

  // Filter and transform data for table with proper formatting
  const cardTransactionData = useMemo(() => {
    // Sort transactions by date (most recent first)
    const sortedTransactions = [...realTransactions].sort((a, b) => {
      // Sort by raw amount for now (could be improved with actual timestamps)
      return new Date(transactions.find(t => t.id === b.id)?.createdAt || 0).getTime() - 
             new Date(transactions.find(t => t.id === a.id)?.createdAt || 0).getTime();
    });

    // Filter transactions based on selected status and card
    let filteredTransactions = sortedTransactions;
    
    // Filter by status
    if (selectedStatus !== "All") {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    
    // Filter by card
    if (selectedCard !== "All Cards") {
      filteredTransactions = filteredTransactions.filter(tx => tx.card === selectedCard);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.merchant.toLowerCase().includes(searchLower) ||
        tx.card.toLowerCase().includes(searchLower) ||
        tx.category.toLowerCase().includes(searchLower) ||
        tx.status.toLowerCase().includes(searchLower) ||
        tx.rawAmount.toString().includes(searchLower) ||
        tx.amount.toLowerCase().includes(searchLower)
      );
    }

    // Transform data for table (already transformed in realTransactions)
    return filteredTransactions;
  }, [selectedStatus, selectedCard, searchTerm, realTransactions, transactions]);

  // Use useTable hook with conditional page size - 10 transactions per page for card transactions
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
  } = useTable(cardTransactionData, isDashboard ? 5 : 10);

  return (
    <>
      {/* Show statistics only on the main card transactions page, not on dashboard */}
      {!isDashboard && <CardStatistics />}
      
      <div className={`box ${isDashboard ? 'h-[650px] flex flex-col' : ''}`}>
        <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        {isDashboard ? <p className="font-medium">Card Transactions</p> : <h4 className="h4">Card Transactions</h4>}
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
          {!isDashboard && (
            <div className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-sm font-medium">Select Card:</span>
              <Select 
                setSelected={setSelectedCard} 
                selected={selectedCard} 
                items={cardOptions} 
                btnClass="rounded-[32px] bg-primary/5 md:py-2.5 min-w-[160px]" 
                contentClass="w-full" 
              />
            </div>
          )}
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
          <SearchBar search={(term: string) => setSearchTerm(term)} classes="bg-primary/5" />
        </div>
      </div>
      
      <div className={`overflow-auto mb-4 lg:mb-6 ${isDashboard ? 'flex-1' : 'min-h-[500px]'}`}>
        <table className="w-full whitespace-nowrap table-fixed">
          {isDashboard ? (
            <colgroup>
              <col className="w-[40%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
            </colgroup>
          ) : (
            <colgroup>
              <col className="w-[45%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
            </colgroup>
          )}
          <thead>
            <tr className="bg-secondary/5 dark:bg-bg3">
              <th onClick={() => sortData("merchant")} className="text-start py-5 px-6 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Charge <IconSelector size={18} />
                </div>
              </th>
              <th onClick={() => sortData("rawAmount")} className="text-start py-5 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Amount <IconSelector size={18} />
                </div>
              </th>
              <th className="text-start py-5">Card</th>
              <th onClick={() => sortData("status")} className="text-start py-5 cursor-pointer hover:bg-secondary/10">
                <div className="flex items-center gap-1">
                  Status <IconSelector size={18} />
                </div>
              </th>
              {!isDashboard && (
                <th onClick={() => sortData("date")} className="text-start py-5 cursor-pointer hover:bg-secondary/10">
                  <div className="flex items-center gap-1">
                    Date <IconSelector size={18} />
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={isDashboard ? 4 : 6} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <i className="las la-spinner la-spin text-3xl text-primary"></i>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((transaction) => {
                const { id, merchant, amount, card, status, date } = transaction;
                return (
              <tr 
                key={id} 
                className="even:bg-secondary/5 dark:even:bg-bg3 cursor-pointer hover:bg-secondary/10 transition-colors"
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setIsModalOpen(true);
                }}>
                <td className="py-2 px-6">
                  <div className="flex items-center gap-3">
                    <Image src="/images/visa.png" width={isDashboard ? 60 : 40} height={isDashboard ? 40 : 25} alt="card" className="rounded" />
                    <div>
                      <p className={`font-medium mb-1 ${isDashboard ? 'text-sm truncate max-w-[300px]' : ''}`}>{merchant}</p>
                      <span className="text-xs text-gray-500">{date}</span>
                    </div>
                  </div>
                </td>
                <td className="py-2">
                  <p className="font-medium text-red-600">{amount}</p>
                </td>
                <td className="py-2">
                  <span className="text-sm font-mono">{card}</span>
                </td>
                <td className="py-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium min-w-[80px] justify-center ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </td>
                {!isDashboard && (
                  <td className="py-2">
                    <span className="text-sm text-gray-600">{date}</span>
                  </td>
                )}
              </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>
      
      {!isLoading && tableData.length < 1 && (
        <div className="text-center py-10">
          <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
            <div className="px-5 lg:px-14 xl:px-24 mb-5">
              <i className={`las text-primary text-7xl ${
                realTransactions.length === 0 ? 'la-credit-card' : 
                searchTerm ? 'la-search' : 'la-filter'
              }`}></i>
            </div>
            <h3 className="h3 mb-3 lg:mb-6">
              {realTransactions.length === 0 
                ? 'No card transactions yet' 
                : searchTerm 
                ? 'No matching transactions found'
                : 'No transactions found'}
            </h3>
            <p className="mb-4">
              {realTransactions.length === 0 
                ? "You haven't made any card transactions yet. Start using your virtual cards to see transactions here."
                : searchTerm 
                ? `No transactions match your search "${searchTerm}". Try a different search term or clear the search.`
                : selectedCard !== "All Cards" && selectedStatus !== "All"
                ? `No transactions found for card ${selectedCard} with "${selectedStatus}" status.`
                : selectedCard !== "All Cards"
                ? `No transactions found for card ${selectedCard}.`
                : selectedStatus !== "All"
                ? `No transactions with "${selectedStatus}" status. Try selecting a different status filter.`
                : 'No transactions available at the moment.'}
            </p>
            {(searchTerm || selectedCard !== "All Cards" || selectedStatus !== "All") && realTransactions.length > 0 && (
              <div className="flex gap-3 flex-wrap justify-center">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                {selectedCard !== "All Cards" && (
                  <button 
                    onClick={() => setSelectedCard("All Cards")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Show All Cards
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
        isDashboard ? (
          <Link href="/transactions/card-transactions/" className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group">
            View All Card Transactions 
            <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
          </Link>
        ) : (
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
        )
      )}

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
    </>
  );
};

export default CardTransactions;