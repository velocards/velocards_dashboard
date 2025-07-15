"use client";
import { useEffect, useMemo, useState } from "react";
import { IconFileText, IconShoppingCart, IconCreditCard, IconReceiptTax, IconInfoCircle } from "@tabler/icons-react";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useUserStore } from "@/stores/userStore";
import Modal from "@/components/shared/Modal";
import { formatCurrency } from "@/utils/formatters";
import { getInvoiceStatusBadgeClass, formatInvoiceType } from "@/types/invoice";

const InvoiceStatistics = () => {
  const { stats, fetchStats, invoices, fetchInvoices, isLoading } = useInvoiceStore();
  const { userStatistics, fetchUserStatistics } = useUserStore();
  
  // Modal states
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices({ limit: 100 }); // Fetch more invoices for detailed breakdown
    fetchUserStatistics();
  }, []);

  // Calculate invoice breakdown by type
  const invoiceBreakdown = useMemo(() => {
    if (!invoices || invoices.length === 0) {
      return {
        cardTransactions: 0,
        cryptoDeposits: 0,
        fees: 0,
        total: 0
      };
    }

    return invoices.reduce((acc, invoice) => {
      if (invoice.status === 'paid') {
        switch (invoice.type) {
          case 'card_transaction':
            acc.cardTransactions += invoice.total_amount;
            break;
          case 'crypto_deposit':
            acc.cryptoDeposits += invoice.total_amount;
            break;
          case 'monthly_fee':
          case 'card_creation_fee':
          case 'deposit_fee':
            acc.fees += invoice.total_amount;
            break;
        }
        acc.total += invoice.total_amount;
      }
      return acc;
    }, {
      cardTransactions: 0,
      cryptoDeposits: 0,
      fees: 0,
      total: 0
    });
  }, [invoices]);

  // Get filtered invoices for modals
  const getFilteredInvoices = (filter: string) => {
    if (!invoices) return [];
    
    switch (filter) {
      case 'total':
        return invoices.filter(inv => inv.status === 'paid');
      case 'card_transactions':
        return invoices.filter(inv => inv.type === 'card_transaction' && inv.status === 'paid');
      case 'crypto_deposits':
        return invoices.filter(inv => inv.type === 'crypto_deposit' && inv.status === 'paid');
      case 'fees':
        return invoices.filter(inv => 
          (inv.type === 'monthly_fee' || inv.type === 'card_creation_fee' || inv.type === 'deposit_fee') && 
          inv.status === 'paid'
        );
      default:
        return invoices.filter(inv => inv.status === 'paid');
    }
  };

  // Render invoice table
  const renderInvoiceTable = (invoices: any[]) => {
    if (invoices.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <i className="las la-inbox text-4xl mb-2"></i>
            <p>No transaction receipts found in this category</p>
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
                Invoice #
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
            {invoices.slice(0, 50).map((invoice) => (
              <tr key={invoice.id} className="even:bg-secondary/5 dark:even:bg-bg3 hover:bg-secondary/10 transition-colors">
                <td className="py-3 px-4">
                  <span className="text-sm font-mono">{invoice.invoice_number}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm">{formatInvoiceType(invoice.type)}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceStatusBadgeClass(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(invoice.invoice_date).toLocaleDateString('en-US', { 
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
        {/* Total Documented */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('total')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total Documented</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total value of all successful transactions with invoices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-file-invoice"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(invoiceBreakdown.total)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-primary font-medium">{invoices.filter(inv => inv.status === 'paid').length}</span> Receipts
              </p>
            </div>
          </div>
        </div>

        {/* Card Spending Receipts */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('card_transactions')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Card Spending</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receipts for all card transactions
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
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(invoiceBreakdown.cardTransactions)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-error font-medium">{invoices.filter(inv => inv.type === 'card_transaction' && inv.status === 'paid').length}</span> Transactions
              </p>
            </div>
          </div>
        </div>

        {/* Deposit Receipts */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('crypto_deposits')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Deposit Receipts</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Documentation for all successful deposits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 xl:gap-6">
            <div className="w-14 xl:w-[72px] h-14 xl:h-[72px] flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl xl:text-5xl la-arrow-circle-down"></i>
            </div>
            <div>
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(invoiceBreakdown.cryptoDeposits)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-secondary font-medium">{invoices.filter(inv => inv.type === 'crypto_deposit' && inv.status === 'paid').length}</span> Confirmed
              </p>
            </div>
          </div>
        </div>

        {/* Fee Receipts */}
        <div 
          className="col-span-12 sm:col-span-6 lg:col-span-3 box p-4 bg-n0 dark:bg-bg4 4xl:px-8 4xl:py-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setActiveModal('fees')}
        >
          <div className="mb-4 lg:mb-6 pb-4 lg:pb-6 bb-dashed">
            <div className="flex items-center gap-2">
              <span className="font-medium">Fee Documentation</span>
              {/* Tooltip */}
              <div className="relative group">
                <IconInfoCircle size={16} className="text-gray-400 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[99999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white dark:border-b-gray-800"></div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] whitespace-nowrap">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receipts for all platform fees charged
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
              <h4 className="h4 mb-2 xxl:mb-4">{formatCurrency(invoiceBreakdown.fees)}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="text-warning font-medium">{invoices.filter(inv => (inv.type === 'monthly_fee' || inv.type === 'card_creation_fee' || inv.type === 'deposit_fee') && inv.status === 'paid').length}</span> Fee receipts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Total Documented Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'total'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-primary/5 text-primary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-file-invoice"></i>
            </div>
            <h4 className="h4">All Transaction Receipts</h4>
          </div>
        </div>
        {renderInvoiceTable(getFilteredInvoices('total'))}
      </Modal>

      {/* Card Transaction Receipts Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'card_transactions'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-error/5 text-error border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-shopping-cart"></i>
            </div>
            <h4 className="h4">Card Transaction Receipts</h4>
          </div>
        </div>
        {renderInvoiceTable(getFilteredInvoices('card_transactions'))}
      </Modal>

      {/* Crypto Deposit Receipts Modal */}
      <Modal 
        toggleOpen={() => setActiveModal(null)} 
        open={activeModal === 'crypto_deposits'}
        width="max-w-5xl"
      >
        <div className="mb-4 pb-4 bb-dashed lg:mb-6 lg:pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-secondary/5 text-secondary border border-n30 dark:border-n500 rounded-xl">
              <i className="las text-3xl la-arrow-circle-down"></i>
            </div>
            <h4 className="h4">Crypto Deposit Receipts</h4>
          </div>
        </div>
        {renderInvoiceTable(getFilteredInvoices('crypto_deposits'))}
      </Modal>

      {/* Fee Documentation Modal */}
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
            <h4 className="h4">Fee Documentation</h4>
          </div>
        </div>
        {renderInvoiceTable(getFilteredInvoices('fees'))}
      </Modal>
    </>
  );
};

export default InvoiceStatistics;