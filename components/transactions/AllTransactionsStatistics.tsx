"use client";
import { useEffect, useMemo, useState } from "react";
import { IconPigMoney, IconShoppingCart, IconReceiptTax, IconWallet, IconInfoCircle } from "@tabler/icons-react";
import { useUserStore } from "@/stores/userStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useCryptoStore } from "@/stores/cryptoStore";
import Modal from "@/components/shared/Modal";
const AllTransactionsStatistics = () => {
  const { userStatistics, fetchUserStatistics, balance, fetchBalance } = useUserStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { deposits, fetchDeposits } = useCryptoStore();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStatistics();
    fetchBalance();
    fetchTransactions({ limit: 500 });
    fetchDeposits(100);
  }, []);

  // Calculate comprehensive statistics
  const comprehensiveStats = useMemo(() => {
    const stats = {
      totalInflow: 0,
      totalOutflow: 0,
      netBalance: 0,
      thisMonthActivity: 0,
      inflowCount: 0,
      outflowCount: 0,
      thisMonthCount: 0
    };

    // Calculate deposits (inflow)
    if (deposits && deposits.length > 0) {
      deposits.forEach(deposit => {
        if (deposit.status === 'completed') {
          const amount = deposit.creditedAmount || deposit.amount || 0;
          stats.totalInflow += amount;
          stats.inflowCount += 1;
        }
      });
    }

    // Calculate card transactions (outflow) and fees
    if (transactions && transactions.length > 0) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      transactions.forEach(transaction => {
        const amount = Math.abs(transaction.amount || 0);
        const transactionDate = new Date(transaction.createdAt);
        
        if ((transaction as any).status === 'completed' || (transaction as any).status === 'settled' || transaction.status === 'pending') {
          stats.totalOutflow += amount;
          stats.outflowCount += 1;
          
          // Check if transaction is from current month
          if (transactionDate.getMonth() === currentMonth && 
              transactionDate.getFullYear() === currentYear) {
            stats.thisMonthActivity += amount;
            stats.thisMonthCount += 1;
          }
        }
      });
    }

    // Add fees from user statistics
    if (userStatistics) {
      stats.totalOutflow += userStatistics.lifetime.fees.total || 0;
    }

    // Calculate net balance
    stats.netBalance = stats.totalInflow - stats.totalOutflow;

    return stats;
  }, [deposits, transactions, userStatistics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get all activities for modal
  const getAllActivities = () => {
    const activities: any[] = [];
    
    // Add deposits
    deposits.forEach(deposit => {
      if (deposit.status === 'completed') {
        activities.push({
          id: deposit.orderId,
          type: 'deposit',
          description: `Deposit - ${deposit.cryptoCurrency || 'USD'}`,
          amount: deposit.creditedAmount || deposit.amount || 0,
          fee: deposit.feeInfo?.feeAmount || deposit.transactionFeeAmount || 0,
          status: deposit.status,
          date: deposit.requestedAt,
          reference: deposit.orderReference
        });
      }
    });
    
    // Add card transactions
    transactions.forEach(transaction => {
      if ((transaction as any).status === 'completed' || (transaction as any).status === 'settled' || transaction.status === 'pending') {
        activities.push({
          id: transaction.id,
          type: 'card',
          description: transaction.merchantName || 'Card Transaction',
          amount: -(Math.abs(transaction.amount || 0)),
          fee: 0,
          status: transaction.status,
          date: transaction.createdAt,
          reference: (transaction as any).reference || transaction.id
        });
      }
    });
    
    // Sort by date (newest first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Render activity table
  const renderActivityTable = (activities: any[], title: string) => {
    if (activities.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <i className="las la-inbox text-4xl mb-2"></i>
            <p>No activities found</p>
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
                Description
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Type
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
            {activities.slice(0, 50).map((activity, index) => (
              <tr key={`${activity.type}-${activity.id}`} className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 transition-colors">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500 font-mono">{activity.reference}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.type === 'deposit' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : activity.type === 'card'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {activity.type === 'deposit' ? 'Deposit' : activity.type === 'card' ? 'Card' : 'Fee'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-semibold ${
                    activity.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {activity.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(activity.amount))}
                  </span>
                  {activity.fee > 0 && (
                    <p className="text-xs text-red-500">Fee: -{formatCurrency(activity.fee)}</p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {activity.status?.charAt(0).toUpperCase() + activity.status?.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString('en-US', { 
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
        {/* Total Deposits */}
        <div 
        className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setActiveModal('deposits')}
      >
        <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total Deposits</span>
            {/* Tooltip */}
            <div className="relative group">
              <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total amount deposited through crypto payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 xl:gap-6">
          <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
            <i className="las text-3xl xl:text-5xl la-piggy-bank"></i>
          </div>
          <div>
            <h4 className="h4 mb-2 xxl:mb-4 text-secondary">+{formatCurrency(userStatistics?.lifetime?.deposits?.total || 0)}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-secondary font-medium">{comprehensiveStats.inflowCount}</span> Successful
            </p>
          </div>
        </div>
      </div>

      {/* Total Spending */}
      <div 
        className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setActiveModal('spending')}
      >
        <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total Spending</span>
            {/* Tooltip */}
            <div className="relative group">
              <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Total amount spent using virtual cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 xl:gap-6">
          <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
            <i className="las text-3xl xl:text-5xl la-shopping-cart"></i>
          </div>
          <div>
            <h4 className="h4 mb-2 xxl:mb-4 text-error">-{formatCurrency(userStatistics?.lifetime?.cardSpending?.completed || 0)}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-error font-medium">{comprehensiveStats.outflowCount}</span> Transactions
            </p>
          </div>
        </div>
      </div>

      {/* Total Fees */}
      <div 
        className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setActiveModal('fees')}
      >
        <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total Fees</span>
            {/* Tooltip */}
            <div className="relative group">
              <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[220px] whitespace-nowrap">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Platform fees including deposit, card creation, and monthly fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 xl:gap-6">
          <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
            <i className="las text-3xl xl:text-5xl la-receipt"></i>
          </div>
          <div>
            <h4 className="h4 mb-2 xxl:mb-4 text-warning">-{formatCurrency(userStatistics?.lifetime?.fees?.total || 0)}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All platform fees
            </p>
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div 
        className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setActiveModal('balance')}
      >
        <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
          <div className="flex items-center gap-2">
            <span className="font-medium">Current Balance</span>
            {/* Tooltip */}
            <div className="relative group">
              <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your available balance for creating new cards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 xl:gap-6">
          <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
            <i className="las text-3xl xl:text-5xl la-wallet"></i>
          </div>
          <div>
            <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(balance?.virtualBalance || 0)}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Available funds
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Modals */}
      {/* Deposits Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'deposits'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-piggy-bank"></i>
            </div>
            <h4 className="h4">All Deposits</h4>
          </div>
        </div>
        {renderActivityTable(
          getAllActivities().filter(a => a.type === 'deposit'),
          'Deposits'
        )}
      </Modal>

      {/* Spending Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'spending'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-shopping-cart"></i>
            </div>
            <h4 className="h4">Card Spending</h4>
          </div>
        </div>
        {renderActivityTable(
          getAllActivities().filter(a => a.type === 'card'),
          'Card Transactions'
        )}
      </Modal>

      {/* Fees Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'fees'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-receipt"></i>
            </div>
            <h4 className="h4">Platform Fees Breakdown</h4>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Fee Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Deposit Fees:</span>
                <span className="font-medium">{formatCurrency(userStatistics?.lifetime?.fees?.deposit || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Card Creation Fees:</span>
                <span className="font-medium">{formatCurrency(userStatistics?.lifetime?.fees?.cardCreation || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Card Fees:</span>
                <span className="font-medium">{formatCurrency(userStatistics?.lifetime?.fees?.cardMonthly || 0)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Fees:</span>
                <span className="text-warning">{formatCurrency(userStatistics?.lifetime?.fees?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Balance Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'balance'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-wallet"></i>
            </div>
            <h4 className="h4">Balance History</h4>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Balance Overview</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Deposits:</span>
                <span className="font-medium text-secondary">+{formatCurrency(userStatistics?.lifetime?.deposits?.total || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Spending:</span>
                <span className="font-medium text-error">-{formatCurrency(userStatistics?.lifetime?.cardSpending?.completed || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Fees:</span>
                <span className="font-medium text-warning">-{formatCurrency(userStatistics?.lifetime?.fees?.total || 0)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Current Balance:</span>
                <span className="text-primary">{formatCurrency(balance?.virtualBalance || 0)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your balance is calculated as: Deposits - Spending - Fees
          </p>
        </div>
      </Modal>
    </>
  );
};

export default AllTransactionsStatistics;