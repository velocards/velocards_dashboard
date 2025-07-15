"use client";
import { useEffect, useState, useMemo } from "react";
import { IconSelector } from "@tabler/icons-react";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import Select from "@/components/shared/Select";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Actions not needed for deposit transactions
// import Action from "@/components/transactions/style-01/Action";
import useTable from "@/utils/useTable";
import { useCryptoStore } from "@/stores/cryptoStore";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
import DepositStatistics from "@/components/transactions/DepositStatistics";

const statusOptions = ["All", "Completed", "Pending", "Detected", "Received", "Cancelled", "Failed"];

const YourDeposits = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Real crypto data from API
  const { deposits, fetchDeposits, isLoading, error } = useCryptoStore();

  useEffect(() => {
    // Fetch crypto deposits - will gracefully handle if no crypto data exists
    fetchDeposits(isDashboard ? 5 : 50);
  }, [isDashboard]);

  // Helper function to get crypto icon class
  const getCryptoIconClass = (currency: string) => {
    switch (currency) {
      case 'BTC': return 'la-bitcoin';
      case 'ETH': return 'la-ethereum';
      case 'USDT':
      case 'USDC': return 'la-dollar-sign';
      default: return 'la-coins';
    }
  };


  // No longer need custom blockchain explorer logic - backend provides it

  // Use real crypto data from API only - no dummy data fallback
  const cryptoTransactionData = useMemo(() => {
    // Only use real deposits from API
    let dataSource = [...deposits];
    
    // Sort by date first (most recent first)
    dataSource = dataSource.sort((a, b) => {
      const dateA = new Date(a.requestedAt).getTime();
      const dateB = new Date(b.requestedAt).getTime();
      return dateB - dateA; // Most recent first
    });

    // Filter by selected status
    if (selectedStatus !== "All") {
      dataSource = dataSource.filter(item => {
        // Normalize the status for comparison
        const itemStatus = item.status?.toLowerCase();
        const filterStatus = selectedStatus.toLowerCase();
        
        // Direct status match
        if (itemStatus === filterStatus) {
          return true;
        }
        
        // Map 'confirming' to 'pending' for filter purposes
        if (filterStatus === 'pending' && itemStatus === 'confirming') {
          return true;
        }
        
        return false;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      dataSource = dataSource.filter(item => {
        const cryptoCurrency = item.cryptoCurrency || 'USD';
        const displayAmount = item.creditedAmount || item.amount;
        const feeAmount = item.feeInfo?.feeAmount || item.transactionFeeAmount || 0;
        
        return (
          cryptoCurrency.toLowerCase().includes(searchLower) ||
          item.status?.toLowerCase().includes(searchLower) ||
          item.orderReference?.toLowerCase().includes(searchLower) ||
          displayAmount.toString().includes(searchLower) ||
          feeAmount.toString().includes(searchLower)
        );
      });
    }
    
    return dataSource.map((item: any) => {
      // Determine the type (deposit or withdrawal)
      const isWithdrawal = item.orderReference?.startsWith('WD-');
      const type = isWithdrawal ? 'withdrawal' : 'deposit';
      
      // Get the crypto currency and amount
      const cryptoCurrency = item.cryptoCurrency || 'USD';
      const cryptoAmount = item.cryptoAmount || 0;
      const displayCurrency = cryptoCurrency !== 'USD' ? cryptoCurrency : item.currency;
      
      // Calculate the display amount
      const displayAmount = item.creditedAmount || item.amount;
      
      // Get fees
      const feeAmount = item.feeInfo?.feeAmount || item.transactionFeeAmount || 0;
      
      // Format the title
      const title = isWithdrawal 
        ? `Withdrawal - ${displayCurrency}`
        : `Deposit - ${displayCurrency}`;
      
      return {
        id: item.orderId,
        title: title,
        iconClass: getCryptoIconClass(displayCurrency),
        time: new Date(item.requestedAt).toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        amount: isWithdrawal 
          ? `-$${Math.abs(displayAmount).toFixed(2)}`
          : `+$${Math.abs(displayAmount).toFixed(2)}`,
        rawAmount: isWithdrawal ? -displayAmount : displayAmount,
        deductions: feeAmount > 0 ? `$${feeAmount.toFixed(2)}` : '-',
        rawDeductions: feeAmount,
        status: item.status,
        type: type,
        cryptoAmount: cryptoAmount > 0 
          ? `${cryptoAmount} ${cryptoCurrency}` 
          : `${displayAmount} ${displayCurrency}`,
        transactionHash: item.transactionHash,
        blockchainUrl: item.explorerUrls?.transaction || null,
        currency: displayCurrency,
        confirmations: item.confirmations || 0,
        paymentUrl: item.paymentUrl,
        orderReference: item.orderReference,
        // Additional fields for modal
        rawData: item,
        createdAt: item.requestedAt,
        network: displayCurrency === 'BTC' ? 'Bitcoin' : 
                 displayCurrency === 'ETH' ? 'Ethereum' :
                 displayCurrency === 'USDT' ? 'Tron/Ethereum' :
                 displayCurrency === 'USDC' ? 'Ethereum' : displayCurrency,
        orderId: item.orderId,
        explorerUrl: item.explorerUrls?.transaction || null,
        reference: item.orderReference
      };
    });
  }, [selectedStatus, searchTerm, deposits]); // Re-filter when status selection, search term, or deposits change

  // Use the transformed data directly with useTable - 5 items on dashboard, 12 on full page
  const { search, currentPage, endIndex, nextPage, paginate, prevPage, startIndex, tableData, totalData, totalPages, sortData } = useTable(cryptoTransactionData, isDashboard ? 5 : 12);

  return (
    <>
      {/* Show statistics only on the main deposits page, not on dashboard */}
      {!isDashboard && <DepositStatistics />}
      
      <div className={`box ${isDashboard ? 'h-[650px] flex flex-col' : ''}`}>
        <div className="flex flex-wrap gap-4 justify-between items-center bb-dashed mb-4 pb-4 lg:mb-6 lg:pb-6">
        <div className="flex items-center gap-3">
          {isDashboard ? <p className="font-medium">Your Deposits</p> : <h4 className="h4">Your Deposits</h4>}
        </div>
        <div className="flex items-center gap-4 flex-wrap grow sm:justify-end">
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-2">
              <i className="las la-spinner la-spin text-3xl text-primary"></i>
              <span className="text-gray-600">Loading crypto deposits...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <i className="las la-exclamation-triangle text-4xl mb-2 text-yellow-500"></i>
              <p className="mb-2">Unable to load crypto deposits</p>
              <p className="text-sm text-gray-400">{error}</p>
              <button 
                onClick={() => fetchDeposits(isDashboard ? 5 : 50)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <table className="w-full whitespace-nowrap table-fixed">
            <colgroup>
              <col className="w-[45%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead>
              <tr className="bg-secondary/5 dark:bg-bg3">
                <th onClick={() => sortData("title")} className="text-start py-5 px-6 min-w-[200px] cursor-pointer hover:bg-secondary/10">
                  <div className="flex items-center gap-1">
                    Transaction <IconSelector size={18} />
                  </div>
                </th>
                <th onClick={() => sortData("rawAmount")} className="text-start py-5 w-[16%] cursor-pointer hover:bg-secondary/10">
                  <div className="flex items-center gap-1">
                    Amount <IconSelector size={18} />
                  </div>
                </th>
                <th onClick={() => sortData("rawDeductions")} className="text-start py-5 w-[15%] cursor-pointer hover:bg-secondary/10">
                  <div className="flex items-center gap-1">
                    Charges <IconSelector size={18} />
                  </div>
                </th>
                <th onClick={() => sortData("status")} className="text-start py-5 w-[15%] cursor-pointer hover:bg-secondary/10">
                  <div className="flex items-center gap-1">
                    Status <IconSelector size={18} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((transaction) => {
                const { id, title, amount, iconClass, time, deductions, status, cryptoAmount, blockchainUrl, confirmations, orderReference } = transaction;
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
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/60 rounded-full flex items-center justify-center">
                        <i className={`las ${iconClass} text-white text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-medium mb-1">{title}</p>
                        <span className="text-xs text-gray-500">{time}</span>
                        {!isDashboard && (
                          <div className="text-xs text-gray-400 mt-1">
                            {cryptoAmount} • {confirmations} confirmations
                            <br />
                            <span className="text-[10px]">Order: {orderReference}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2">
                    <div>
                      <p className={`font-medium ${amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {amount}
                      </p>
                      <span className="text-xs text-gray-500">{cryptoAmount}</span>
                    </div>
                  </td>
                  <td className="py-2">
                    <div>
                      <p className={`font-medium ${deductions === '-' ? 'text-gray-400' : 'text-red-600'}`}>
                        {deductions}
                      </p>
                      {deductions !== '-' && (
                        <span className="text-xs text-gray-500">Platform fee</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 w-[15%]" onClick={(e) => e.stopPropagation()}>
                    {blockchainUrl ? (
                      <a
                        href={blockchainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 min-w-[150px] overflow-hidden ${
                          status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                            : status === 'pending' || status === 'confirming' || status === 'detected' || status === 'received'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                            : status === 'failed' || status === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900 dark:hover:text-blue-200'
                        }`}
                      >
                        <span className="transition-opacity duration-200 group-hover:opacity-0">
                          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <span className="flex items-center gap-1 whitespace-nowrap">
                            View on Blockchain
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </span>
                        </span>
                      </a>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium min-w-[80px] justify-center ${
                        status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : status === 'pending' || status === 'confirming' || status === 'detected' || status === 'received'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : status === 'failed' || status === 'cancelled'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                      </span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {!isLoading && tableData.length < 1 && (
        <div className="text-center py-10">
          <div className="text-center mx-auto max-w-[500px] max-md:flex flex-col items-center">
            <div className="px-5 lg:px-14 xl:px-24 mb-5">
              <i className={`las text-primary text-7xl ${
                deposits.length === 0 ? 'la-coins' : 
                searchTerm ? 'la-search' : 'la-filter'
              }`}></i>
            </div>
            <h3 className="h3 mb-3 lg:mb-6">
              {deposits.length === 0 
                ? 'No crypto deposits yet' 
                : searchTerm 
                ? 'No matching deposits found'
                : 'No deposits found'}
            </h3>
            <p className="mb-4">
              {deposits.length === 0 
                ? "You haven't made any crypto deposits yet. Create a deposit order to add funds to your account."
                : searchTerm 
                ? `No deposits match your search "${searchTerm}". Try a different search term or clear the search to see all deposits.`
                : selectedStatus !== "All"
                ? `No deposits with "${selectedStatus}" status. Try selecting a different status filter.`
                : 'No deposits available at the moment.'}
            </p>
            {deposits.length === 0 ? (
              <button 
                onClick={() => {
                  // Navigate to crypto deposit page
                  window.location.href = '/crypto/deposit';
                }}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Create Deposit Order
              </button>
            ) : (searchTerm || selectedStatus !== "All") && (
              <div className="flex gap-3 flex-wrap justify-center">
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                {selectedStatus !== "All" && (
                  <button 
                    onClick={() => setSelectedStatus("All")}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Show All Deposits
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {tableData.length > 0 && (
        isDashboard ? (
          <Link href="/transactions/your-deposits/" className="text-primary font-semibold inline-flex gap-1 items-center mt-6 group">
            View All Deposits 
            <i className="las la-arrow-right group-hover:pl-2 duration-300"></i>
          </Link>
        ) : (
          <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} startIndex={startIndex} endIndex={endIndex} prevPage={prevPage} total={totalData} goToPage={(page: number) => paginate(page)} />
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
        type="crypto"
      />
    </div>
    </>
  );
};

export default YourDeposits;