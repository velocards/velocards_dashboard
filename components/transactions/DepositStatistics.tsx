"use client";
import { useEffect, useMemo, useState } from "react";
import { IconReceiptBitcoin, IconReceiptDollar, IconReceiptOff, IconLoader, IconX, IconInfoCircle } from "@tabler/icons-react";
import { useUserStore } from "@/stores/userStore";
import { useCryptoStore } from "@/stores/cryptoStore";
import Modal from "@/components/shared/Modal";

const DepositStatistics = () => {
  const { userStatistics, fetchUserStatistics } = useUserStore();
  const { deposits, fetchDeposits } = useCryptoStore();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchUserStatistics();
    fetchDeposits(100); // Fetch more deposits for accurate status breakdown
  }, []);

  // Calculate deposit statistics by status
  const depositStats = useMemo(() => {
    if (!deposits || deposits.length === 0) {
      return {
        completed: 0,
        pending: 0,
        detected: 0,
        received: 0,
        cancelled: 0,
        failed: 0,
        totalCommission: 0
      };
    }

    const stats = deposits.reduce((acc, deposit) => {
      const status = deposit.status?.toLowerCase() || 'unknown';
      const commission = deposit.feeInfo?.feeAmount || deposit.transactionFeeAmount || 0;
      
      // Count by status
      if (status === 'completed') {
        acc.completed += 1;
        acc.totalCommission += commission;
      } else if (status === 'pending' || status === 'confirming') {
        acc.pending += 1;
      } else if (status === 'detected') {
        acc.detected += 1;
      } else if (status === 'received') {
        acc.received += 1;
      } else if (status === 'cancelled') {
        acc.cancelled += 1;
      } else if (status === 'failed') {
        acc.failed += 1;
      }
      
      return acc;
    }, {
      completed: 0,
      pending: 0,
      detected: 0,
      received: 0,
      cancelled: 0,
      failed: 0,
      totalCommission: 0
    });

    return stats;
  }, [deposits]);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Get filtered deposits based on type
  const getFilteredDeposits = (type: string) => {
    if (!deposits) return [];
    
    switch (type) {
      case 'completed':
        return deposits.filter(d => d.status === 'completed');
      case 'pending':
        return deposits.filter(d => d.status === 'pending' || (d as any).status === 'confirming');
      case 'processing':
        return deposits.filter(d => d.status === 'detected' || d.status === 'received');
      case 'unsuccessful':
        return deposits.filter(d => d.status === 'failed' || d.status === 'cancelled');
      default:
        return deposits;
    }
  };

  // Render deposit table
  const renderDepositTable = (deposits: any[]) => {
    if (deposits.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <i className="las la-inbox text-4xl mb-2"></i>
            <p>No deposits found in this category</p>
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
                Reference
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Amount
              </th>
              <th className="text-start py-4 px-4 font-medium text-sm">
                Fee
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
            {deposits.map((deposit, index) => (
              <tr key={deposit.orderId} className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 transition-colors">
                <td className="py-3 px-4">
                  <span className="text-sm font-mono">{deposit.orderReference}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    +{formatCurrency(deposit.creditedAmount || deposit.amount)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-red-600 dark:text-red-400">
                    -{formatCurrency(deposit.feeInfo?.feeAmount || deposit.transactionFeeAmount || 0)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    deposit.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : deposit.status === 'pending' || deposit.status === 'confirming'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : deposit.status === 'detected' || deposit.status === 'received'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {deposit.status?.charAt(0).toUpperCase() + deposit.status?.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(deposit.requestedAt).toLocaleDateString('en-US', { 
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
          onClick={() => setActiveModal('completed')}
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
                      Total value of all completed crypto deposits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-coins"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(userStatistics?.lifetime?.deposits?.total || 0)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-secondary font-medium">{depositStats.completed}</span> Completed
              </p>
            </div>
          </div>
        </div>

        {/* Total Commission */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('commission')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Commission</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total fees paid on all deposit transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-receipt"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(userStatistics?.lifetime?.fees?.deposit || 0)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Platform fees
              </p>
            </div>
          </div>
        </div>

        {/* Processing Deposits */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('processing')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Processing</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[220px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Deposits being processed (detected or received on blockchain)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-hourglass-half"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{depositStats.detected + depositStats.received}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                In progress
              </p>
            </div>
          </div>
        </div>

        {/* Failed/Cancelled */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('unsuccessful')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Unsuccessful</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Deposits that failed or were cancelled
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-times-circle"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{depositStats.failed + depositStats.cancelled}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Unsuccessful
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Completed Deposits Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'completed'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-coins"></i>
            </div>
            <h4 className="h4">Completed Deposits</h4>
          </div>
        </div>
        {renderDepositTable(getFilteredDeposits('completed'))}
      </Modal>

      {/* Commission Modal - Shows all deposits with fees */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'commission'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-receipt"></i>
            </div>
            <h4 className="h4">Deposits with Commission</h4>
          </div>
        </div>
        {renderDepositTable(
          deposits.filter(d => (d.feeInfo?.feeAmount || d.transactionFeeAmount || 0) > 0)
        )}
      </Modal>

      {/* Processing Deposits Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'processing'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-warning/5 text-warning border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-hourglass-half"></i>
            </div>
            <h4 className="h4">Processing Deposits</h4>
          </div>
        </div>
        {renderDepositTable(getFilteredDeposits('processing'))}
      </Modal>

      {/* Unsuccessful Deposits Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'unsuccessful'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-times-circle"></i>
            </div>
            <h4 className="h4">Unsuccessful Deposits</h4>
          </div>
        </div>
        {renderDepositTable(getFilteredDeposits('unsuccessful'))}
      </Modal>
    </>
  );
};

export default DepositStatistics;